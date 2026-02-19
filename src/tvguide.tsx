import { STBHeader, STBRootLayout } from "./components/stbkit/stb";
import { ColumnLayout, RootLayout, RowLayout } from "./components/stbkit";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "./main";
import {
    getFreeviewTvGuide,
    type FreeviewServiceProgram,
    type FreeviewEvent,
} from "./lib/freeview";
import { ModernItemFill, ModernRootLayout } from "./components/stbkit/modern";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { FocusNode, useSetFocus } from "@please/lrud";
import { BookmarkIcon, TvIcon } from "lucide-react";
import { M3uMedia, M3uParser } from "m3u-parser-generator";
const MAX_EVENTS = 25;
const PX_PER_MIN = 5;
// const MIN_EVENT_W = 180;
// const MAX_EVENT_W = 560;

export default function TvGuidePage() {
    return (
        <ModernRootLayout className="main-layout" onBack={() => { }}>
            <TVGuide />
        </ModernRootLayout>
    );
}

function TVGuide() {
    const { setView } = useContext(GlobalContext);
    const [programs, setPrograms] = useState<FreeviewServiceProgram[]>([]);
    const [channels, setChannels] = useState<M3uMedia[] | undefined>(undefined);
    const virtuosoRef = useRef<VirtuosoHandle>(null);
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
        if (!channels) return
        getFreeviewTvGuide().then((items) => {
            var list = items.data?.programs.filter(item => {
                if (channels.find(channel => channel.attributes["serviceid"] == item.service_id) !== undefined) {
                    return item
                }
            })
            console.log(list)
            setPrograms(list ?? []);
        });
    }, [channels]);

    if (programs.length == 0 || !channels) return null

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-row items-center p-10 pb-0 flex flex-row items-center gap-3 sticky top-0 z-50 bg-neutral-900 z-60">
                {/* <img src={logo} className="h-10 object-cover pr-5" /> */}
                <div className="text-4xl font-medium stbkit-color-text">TV Guide</div>
                <div className="flex-1" />
            </div>
            <div className="h-[214px]"></div>
            <RowLayout className="flex-1">
                <ColumnLayout className="items-center border-y-2 relative h-full w-full flex flex-col overflow-hidden">
                    <Virtuoso
                        ref={virtuosoRef}
                        style={{ height: "100%", width: "100%" }}
                        data={programs}
                        overscan={200}
                        itemContent={(index, channel) => (
                            <TvChannelRow
                                key={channel.service_id}
                                channel={channel}
                                rowIndex={index}
                                totalRows={programs.length}
                                virtuosoRef={virtuosoRef}
                                channels={channels}
                            />
                        )}
                    />
                </ColumnLayout>
            </RowLayout>
            <div className="h-15 flex flex-row items-center gap-5 pl-5">
                <div className="flex flex-row items-center text-[20px] gap-3">
                    <BookmarkIcon className="rounded-full bg-white text-black p-1.5 w-8 h-8" /> <div>Bookmark Selected Show</div>
                </div>
                <div className="flex flex-row text-[20px] items-center gap-3">
                    <TvIcon className="rounded-full bg-white text-black p-1.5 w-8 h-8" /> <div>Close TV Guide</div>
                </div>
            </div>
        </div>
    );
}

function TvChannelRow({
    channel,
    rowIndex,
    totalRows,
    virtuosoRef,
    channels
}: {
    channel: FreeviewServiceProgram;
    rowIndex: number;
    totalRows: number;
    virtuosoRef: React.RefObject<VirtuosoHandle>;
    channels: M3uMedia[]
}) {
    const setFocus = useSetFocus();
    const events = (channel.events ?? []).slice(0, MAX_EVENTS);
    const eventAreaRef = useRef<HTMLDivElement>(null)

    const rowFocusId = `row-${rowIndex}`;

    return (
        <FocusNode
            focusId={rowFocusId}
            orientation="horizontal"
            defaultFocusChild={0}
            className="flex flex-row items-center w-full h-[75px]"
            onFocused={() => {
                virtuosoRef.current?.scrollToIndex({
                    index: rowIndex,
                    align: "center",
                    behavior: "smooth",
                });
                try {
                    eventAreaRef.current?.children[0].scrollIntoView({ behavior: "smooth", inline: "center", block: "center" })
                } catch {

                }
            }}
            onUp={(e) => {
                e.preventDefault()
                if (rowIndex > 0) setFocus(`row-${rowIndex - 1}`);
            }}
            onDown={(e) => {
                e.preventDefault()
                if (rowIndex < totalRows - 1) setFocus(`row-${rowIndex + 1}`);
            }}
        >
            {/* Channel title */}
            <div className="w-44 h-full stb-menuitem border-r-2 bg-black/20 border-b-2 border-b-white/20 flex items-center px-4 shrink-0">
                <span className="text-base font-medium">{channels.find(item => item.attributes["serviceid"] == channel.service_id)?.attributes["tvg-chno"]?.padStart(3, "0")}: {channel.title}</span>
            </div>

            {/* Events */}
            <div className="flex-1 overflow-x-visible flex items-center h-full border-b-2 border-white/20 flex-nowrap" ref={eventAreaRef}>
                {events.map((event, i) => {
                    const [isFocused, setIsFocused] = useState(false)
                    // const width = clamp(parseDurationMinutes(event.duration) * PX_PER_MIN, MIN_EVENT_W, MAX_EVENT_W);
                    const width = parseDurationMinutes(event.duration) * PX_PER_MIN
                    const elementref = useRef<HTMLDivElement>(null)
                    return (
                        <ModernItemFill
                            ref={elementref}
                            key={event.uuid}
                            onFocused={() => {
                                elementref.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" })
                                setIsFocused(true)
                            }}
                            onBlur={() => {
                                setIsFocused(false)
                            }}
                            focusId={`row-${rowIndex}-event-${i}`}
                            className={`line-clamp-1 px-4 flex text-[18px] justify-center leading-[22px] whitespace-nowrap overflow-hidden shrink-0 text-ellipsis h-full border-white/20 ${i !== 0 ? "border-l-2" : ""}`}
                        >
                            <div style={{
                                width,
                                minWidth: width,
                                maxWidth: width
                            }}>
                                <div className="text-sm">{new Date(event.start_time).toLocaleTimeString()}</div>
                                {/* <div className="text-sm">{width}</div> */}
                                {event.main_title}
                            </div>
                            {isFocused && <div style={{ position: "fixed", top: "80px", left: "0", zIndex: 50, }} className="w-full h-[200px] bg-neutral-900 p-10 flex flex-row gap-2">
                                <div className="flex-1">
                                    <div className="text-4xl text-white">{event.main_title}</div>
                                    <div className="text-lg py-3 text-white">{event.on_demand ? "Bookmarkable" : "Cannot Be Bookmarked"}</div>
                                    <div className="text-xl text-white">{event.secondary_title}</div>
                                </div>
                                <img src={event.image_url + "?w=800"} className="h-full w-auto object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            </div>}
                        </ModernItemFill>
                    );
                })}
            </div>
        </FocusNode>
    );
}

function parseDurationMinutes(duration: string) {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 30;
    const h = parseInt(match[1] ?? "0", 10);
    const m = parseInt(match[2] ?? "0", 10);
    return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}