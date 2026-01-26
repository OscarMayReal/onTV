import { ModernItem, ModernRootLayout } from "./components/stbkit/modern";
import { RowLayout } from "./components/stbkit";
import { FocusNode } from "@please/lrud";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./main";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api/live-tv-api.js";
import { getMediaInfoApi } from "@jellyfin/sdk/lib/utils/api/media-info-api.js";
import { type PlaybackInfoResponse, type BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import type { LiveTvApi } from "@jellyfin/sdk/lib/generated-client/api/live-tv-api";
import ReactPlayer from "react-player";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";

export default function LiveTV() {
    const { jellyfinClient, setView } = useContext(GlobalContext);
    const [liveTvApi, setLiveTvApi] = useState<LiveTvApi | null>(null);
    const [channels, setChannels] = useState<BaseItemDto[] | undefined>(undefined);
    const [channelNumber, setChannelNumber] = useState(1);
    const [currentChannel, setCurrentChannel] = useState<BaseItemDto | undefined>(undefined);
    const [mediaInfo, setMediaInfo] = useState<PlaybackInfoResponse | null>(null);
    useEffect(() => {
        if (!jellyfinClient) return;
        const liveTvApi = getLiveTvApi(jellyfinClient);
        setLiveTvApi(liveTvApi);
        liveTvApi.getLiveTvChannels().then((channels) => {
            setChannels(channels.data.Items);
        });
    }, [jellyfinClient]);
    useEffect(() => {
        if (!channels || !liveTvApi || !jellyfinClient) return;
        const channel = channels.find((channel) => channel.ChannelNumber === channelNumber.toString());
        console.log(channel);
        if (!channel) return;
        liveTvApi.getChannel({
            channelId: channel.Id
        }).then((fullChannel) => {
            if (!fullChannel) return;
            console.log(fullChannel.data);
            const mediaInfoApi = getMediaInfoApi(jellyfinClient);
            mediaInfoApi.getPostedPlaybackInfo({
                itemId: channel.Id,
                autoOpenLiveStream: true,
            }).then((mediaInfo) => {
                setMediaInfo(mediaInfo.data);
                setCurrentChannel(fullChannel.data);
            });
        });
    }, [channels, channelNumber, liveTvApi, jellyfinClient]);
    const mediaPlayerRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        function PageKeyHandler(event: KeyboardEvent) {
            if (event.key === "PageUp") {
                setChannelNumber(channelNumber + 1);
            } else if (event.key === "PageDown") {
                setChannelNumber(channelNumber - 1);
            }
        }
        window.addEventListener("keydown", PageKeyHandler);
        return () => {
            window.removeEventListener("keydown", PageKeyHandler);
        };
    }, [channelNumber]);
    return (
        <ModernRootLayout>
            <FocusNode onBack={() => {
                mediaPlayerRef.current?.remove();
                setView("home");
            }} onLeft={() => { if (channelNumber > 1) setChannelNumber(channelNumber - 1) }} onRight={() => { if (channelNumber < channels?.length!) setChannelNumber(channelNumber + 1) }}>
                {currentChannel && mediaInfo && <>
                    {/* <ReactPlayer src={jellyfinClient?.basePath + mediaInfo.MediaSources?.[0].TranscodingUrl!} autoPlay controls /> */}
                    <ReactPlayer ref={mediaPlayerRef} style={{ width: "100vw", height: "100vh" }} src={mediaInfo.MediaSources?.[0].Path!} autoPlay />
                    <div style={{ position: "fixed" }} className="w-[100px] h-[50px] top-10 left-10 bg-black text-white flex items-center justify-center z-10">{currentChannel.Name}</div>
                </>}
                {!mediaInfo && currentChannel && <div>Loading...</div>}
                {!currentChannel && <div>No Channel Selected</div>}
            </FocusNode>
            <FocusNode onBack={() => {
                setView("home");
            }} className="livetv-controls flex flex-col scroll-row">
                <div className="mb-3 pl-10 mt-10 flex flex-row items-center">
                    <div className="text-2xl text-white">Channels</div>
                </div>
                <RowLayout className="p-10 pt-0 scroll-row gap-4" defaultFocusChild={channels?.findIndex((channel) => channel.ChannelNumber === channelNumber.toString()) ?? 0}>
                    {channels?.map((channel, index) => <ChannelItem key={index} channel={channel} setChannelNumber={setChannelNumber} />)}
                </RowLayout>
            </FocusNode>
        </ModernRootLayout>
    )
}

function ChannelItem({ channel, setChannelNumber }: { channel: BaseItemDto, setChannelNumber: (channelNumber: number) => void }) {
    const itemref = useRef<HTMLDivElement>(null);
    const { jellyfinClient } = useContext(GlobalContext);
    const [image, setImage] = useState<string | null>(null);
    useEffect(() => {
        if (!jellyfinClient) return;
        const imageApi = getImageApi(jellyfinClient);
        setImage(imageApi.getItemImageUrl(channel, "Primary"))
    }, [channel, jellyfinClient]);
    return (
        <ModernItem onSelected={() => {
            setChannelNumber(parseInt(channel.ChannelNumber!));
        }} ref={itemref} className="h-[175px] min-w-[175px] w-[175px] flex items-center justify-center" onFocused={() => {
            // itemref.current?.scrollIntoView({ behavior: "smooth" });
            itemref.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemref.current?.offsetLeft! - 40 });
        }}>
            {image && <img src={image} className="h-[100px] w-[100px] object-contain" alt="" />}
        </ModernItem>
    )
}