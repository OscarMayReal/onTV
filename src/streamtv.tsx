import { ModernItem, ModernRootLayout } from "./components/stbkit/modern";
import { RowLayout } from "./components/stbkit";
import { FocusNode, useProcessKey } from "@please/lrud";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./main";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api/live-tv-api.js";
import { getMediaInfoApi } from "@jellyfin/sdk/lib/utils/api/media-info-api.js";
import { type PlaybackInfoResponse, type BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import type { LiveTvApi } from "@jellyfin/sdk/lib/generated-client/api/live-tv-api";
import ReactPlayer from "react-player";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";
import { M3uMedia, M3uParser } from 'm3u-parser-generator';
import { getCurrentEvent, getFreeviewTvGuide, type FreeviewServiceProgram } from "./lib/freeview";
import { ArrowLeftIcon, BookmarkIcon, TvIcon } from "lucide-react";

export default function LiveTV() {
    const { jellyfinClient, setView } = useContext(GlobalContext);
    const [liveTvApi, setLiveTvApi] = useState<LiveTvApi | null>(null);
    const [channels, setChannels] = useState<M3uMedia[] | undefined>(undefined);
    const [channelNumber, setChannelNumber] = useState(1);
    // const [currentChannel, setCurrentChannel] = useState<BaseItemDto | undefined>(undefined);
    const [mediaInfo, setMediaInfo] = useState<any | null>(null);
    const [tempChannelNumber, setTempChannelNumber] = useState("");
    const [showChannelNumber, setShowChannelNumber] = useState(true);
    const [programs, setPrograms] = useState<FreeviewServiceProgram[]>([]);
    const [processKey, setProcessKey] = useState(null)

    useEffect(() => {
        getFreeviewTvGuide().then((items) => {
            console.log(items)
            setPrograms(items.data?.programs ?? []);
        });
    }, []);
    useEffect(() => {
        fetch('/stream.m3u.txt').then(res => res.text()).then((data) => {
            const parser = new M3uParser()
            console.log(data)
            const playlist = parser.parse(data)
            console.log(playlist)
            setChannels(playlist.medias)
        })
    }, [])
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
    useEffect(() => {
        if (!channels || !programs) return
        const item = channels.find(item => item.attributes["tvg-chno"]?.padStart(3, "0") == channelNumber.toString().padStart(3, "0"))
        if (!item) return
        console.log(item.attributes["serviceid"])
        console.log(programs.find(program => program.service_id == item.attributes["serviceid"]))
        setMediaInfo({
            m3uItem: item,
            guideItem: item.attributes["serviceid"] ? programs.find(program => program.service_id == item.attributes["serviceid"]) : null
        })
        console.log({
            m3uItem: item,
            guideItem: item.attributes["serviceid"] ? programs.find(program => program.service_id == item.attributes["serviceid"]) : null
        })
    }, [channelNumber, channels, programs])
    useEffect(() => {
        if (tempChannelNumber !== "") {
            setTimeout(() => {
                setTempChannelNumber("");
            }, 1000);
        }
    }, [tempChannelNumber]);
    useEffect(() => {
        const typechannel = (event: KeyboardEvent) => {
            if (event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5" || event.key === "6" || event.key === "7" || event.key === "8" || event.key === "9" || event.key === "0") {
                setTempChannelNumber(tempChannelNumber + event.key);
            }
        }
        window.addEventListener("keydown", typechannel);
        return () => {
            window.removeEventListener("keydown", typechannel);
        };
    }, [tempChannelNumber]);
    useEffect(() => {
        if (tempChannelNumber.length === 3) {
            const channel = channels?.find((channel) => parseInt(channel.attributes["tvg-chno"]) === parseInt(tempChannelNumber));
            if (channel) {
                setChannelNumber(parseInt(tempChannelNumber));
                setTempChannelNumber("");
            }
        }
    }, [tempChannelNumber]);
    return (
        <ModernRootLayout>
            <GetProcessKey setProcessKey={setProcessKey} />
            <FocusNode onBack={() => {
                setView("home");
            }} onSelected={() => {
                processKey.down()
            }}>
                {mediaInfo && <>
                    {/* <ReactPlayer src={jellyfinClient?.basePath + mediaInfo.MediaSources?.[0].TranscodingUrl!} autoPlay controls /> */}
                    <ReactPlayer style={{ width: "100vw", height: "100vh" }} src={mediaInfo.m3uItem.location} onError={(e) => {
                        e.currentTarget.src = "/unavailable-regular.mp4"
                        e.currentTarget.play()
                    }} playing={true} />
                    {showChannelNumber && tempChannelNumber == "" && <div style={{ position: "fixed" }} className="px-5 py-3 top-10 left-10 bg-black text-white flex items-center justify-center z-10">{channelNumber}: {mediaInfo.m3uItem.name}</div>}
                    {/* {showChannelNumber && tempChannelNumber == "" && <div style={{ position: "fixed" }} className="px-5 py-3 top-10 right-10 bg-black text-white flex items-center justify-center z-10">Press 🔴 to watch on iPlayer</div>} */}
                </>}
                {tempChannelNumber !== "" && <div style={{ position: "fixed" }} className="px-5 py-3 top-10 left-10 bg-black text-white flex items-center justify-center z-10">{tempChannelNumber}</div>}
                {/* {mediaInfo && <div>Loading...</div>} */}
            </FocusNode>
            <FocusNode onBack={() => {
                // setView("home");
                processKey.up()
            }} className="livetv-controls flex flex-col scroll-row">
                {mediaInfo && mediaInfo.guideItem ? <div className="mb-3 pl-10 mt-15">
                    <div className="text-4xl pb-2">{getCurrentEvent(mediaInfo.guideItem.events)?.main_title}</div>
                    <div className="text-2xl">{getCurrentEvent(mediaInfo.guideItem.events)?.secondary_title}</div>
                </div> : <div className="h-10" />}
                <div className="mb-3 pl-10 pt-5 flex flex-row items-center">
                    <div className="text-2xl text-white">Channels</div>
                </div>
                <RowLayout className="p-10 pt-0 scroll-row gap-4" defaultFocusChild={channels?.findIndex((channel) => channel.attributes["tvg-chno"] === channelNumber.toString()) ?? 0}>
                    {channels?.map((channel, index) => <ChannelItem key={index} channel={channel} setChannelNumber={setChannelNumber} />)}
                </RowLayout>
                <div className="h-15 flex flex-row items-center gap-5 pl-10">
                    <div className="flex flex-row items-center text-[20px] gap-3">
                        <BookmarkIcon className="rounded-full bg-white text-black p-1.5 w-8 h-8" /> <div>Bookmark Current Show</div>
                    </div>
                    <div className="flex flex-row text-[20px] items-center gap-3">
                        <TvIcon className="rounded-full bg-white text-black p-1.5 w-8 h-8" /> <div>Open TV Guide</div>
                    </div>
                    <div className="flex flex-row text-[20px] items-center gap-3">
                        <ArrowLeftIcon className="rounded-full bg-white text-black p-1.5 w-8 h-8" /> <div>Close Miniguide</div>
                    </div>
                </div>
            </FocusNode>
        </ModernRootLayout>
    )
}

function GetProcessKey({ setProcessKey }) {
    const pk = useProcessKey()
    useEffect(() => {
        if (!pk) return
        setProcessKey(pk)
    }, [pk])
    return <></>
}

function ChannelItem({ channel, setChannelNumber }: { channel: M3uMedia, setChannelNumber: (channelNumber: number) => void }) {
    const itemref = useRef<HTMLDivElement>(null);
    return (
        <ModernItem onSelected={() => {
            setChannelNumber(parseInt(channel.attributes["tvg-chno"]!));
        }} ref={itemref} className="h-[175px] min-w-[175px] w-[175px] flex items-center justify-center relative" onFocused={() => {
            // itemref.current?.scrollIntoView({ behavior: "smooth" });
            itemref.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemref.current?.offsetLeft! - 40 });
        }}>
            {channel.attributes["tvg-logo"] && <img src={channel.attributes["tvg-logo"]} className="h-[75px] w-[75px] object-contain" alt="" />}
            <div className="absolute bottom-2 left-2 text-xl">{channel.attributes["tvg-chno"].padStart(3, "0")}: {channel.name}</div>
        </ModernItem>
    )
}