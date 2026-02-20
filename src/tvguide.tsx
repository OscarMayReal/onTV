import { STBHeader, STBRootLayout } from "./components/stbkit/stb";
import { ColumnLayout, RootLayout, RowLayout } from "./components/stbkit";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "./main";
import {
    getFreeviewTvGuide,
    type FreeviewServiceProgram,
    type FreeviewEvent,
    getCurrentEvent,
} from "./lib/freeview";
import { ModernItemFill, ModernRootLayout } from "./components/stbkit/modern";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { FocusNode, useSetFocus } from "@please/lrud";
import { BookmarkIcon, TvIcon } from "lucide-react";
import { M3uMedia, M3uParser } from "m3u-parser-generator";
import { useClock } from "./lib/useclock";
const MAX_EVENTS = 999;
const PX_PER_MIN = 4;
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
    const setFocus = useSetFocus();
    // Tracks the time window of the currently focused event so up/down
    // navigation lands on the event with the most overlap in the new row.
    const focusedWindowRef = useRef<{ start: number; end: number }>({ start: Date.now(), end: Date.now() });
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

    // After programs load, explicitly focus the current event on row 0.
    // We defer by one frame so that all FocusNode components are mounted.
    useEffect(() => {
        if (programs.length === 0) return;
        const now = Date.now();
        focusedWindowRef.current = { start: now, end: now };
        const firstRowEvents = (programs[0].events ?? []).slice(0, MAX_EVENTS);
        const idx = getBestOverlapEventIndex(firstRowEvents, now, now);
        const timer = setTimeout(() => {
            setFocus(idx >= 0 ? `row-0-event-${idx}` : `row-0`);
        }, 50);
        return () => clearTimeout(timer);
    }, [programs]);

    if (programs.length == 0 || !channels) return <div />

    // Compute global start time: earliest event start across all channels
    const globalStartMs = programs.reduce((earliest, program) => {
        const channelMin = (program.events ?? []).reduce((min, ev) => {
            const t = new Date(ev.start_time).getTime();
            return t < min ? t : min;
        }, Infinity);
        return channelMin < earliest ? channelMin : earliest;
    }, Infinity);

    // Compute total timeline width so the container is wide enough
    const globalEndMs = programs.reduce((latest, program) => {
        const channelMax = (program.events ?? []).reduce((max, ev) => {
            const t = new Date(ev.start_time).getTime() + parseDurationMinutes(ev.duration) * 60 * 1000;
            return t > max ? t : max;
        }, 0);
        return channelMax > latest ? channelMax : latest;
    }, 0);
    const timelineWidthPx = ((globalEndMs - globalStartMs) / 60000) * PX_PER_MIN;

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
                                globalStartMs={globalStartMs}
                                timelineWidthPx={timelineWidthPx}
                                focusedWindowRef={focusedWindowRef}
                                programs={programs}
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
    channels,
    globalStartMs,
    timelineWidthPx,
    focusedWindowRef,
    programs,
}: {
    channel: FreeviewServiceProgram;
    rowIndex: number;
    totalRows: number;
    virtuosoRef: React.RefObject<VirtuosoHandle>;
    channels: M3uMedia[];
    globalStartMs: number;
    timelineWidthPx: number;
    focusedWindowRef: React.RefObject<{ start: number; end: number }>;
    programs: FreeviewServiceProgram[];
}) {
    const setFocus = useSetFocus();
    const events = (channel.events ?? []).slice(0, MAX_EVENTS);
    const eventAreaRef = useRef<HTMLDivElement>(null)
    const clock = useClock()

    const rowFocusId = `row-${rowIndex}`;

    return (
        <FocusNode
            focusId={rowFocusId}
            orientation="horizontal"
            defaultFocusChild={events.findIndex(item => item.event_locator == getCurrentEvent(events)?.event_locator)}
            className="flex flex-row items-center w-full h-[75px] relative"
            onFocused={() => {
                // Just scroll the row into view — no setFocus here to avoid
                // the lrud re-entrancy loop (onFocused fires for every child focus)
                virtuosoRef.current?.scrollToIndex({
                    index: rowIndex,
                    align: "center",
                    behavior: "smooth",
                });
            }}
            onUp={(e) => {
                e.preventDefault();
                if (rowIndex <= 0) return;
                const { start, end } = focusedWindowRef.current ?? { start: Date.now(), end: Date.now() };
                const targetEvents = (programs[rowIndex - 1]?.events ?? []).slice(0, MAX_EVENTS);
                const targetIdx = getBestOverlapEventIndex(targetEvents, start, end);
                const targetFocusId = targetIdx >= 0
                    ? `row-${rowIndex - 1}-event-${targetIdx}`
                    : `row-${rowIndex - 1}`;
                setFocus(targetFocusId);
            }}
            onDown={(e) => {
                e.preventDefault();
                if (rowIndex >= totalRows - 1) return;
                const { start, end } = focusedWindowRef.current ?? { start: Date.now(), end: Date.now() };
                const targetEvents = (programs[rowIndex + 1]?.events ?? []).slice(0, MAX_EVENTS);
                const targetIdx = getBestOverlapEventIndex(targetEvents, start, end);
                const targetFocusId = targetIdx >= 0
                    ? `row-${rowIndex + 1}-event-${targetIdx}`
                    : `row-${rowIndex + 1}`;
                setFocus(targetFocusId);
            }}
        >
            {/* Channel title */}
            <div className="w-44 h-full stb-menuitem border-r-2 bg-[#1d1d1d] border-b-2 border-b-white/20 flex items-center px-4 shrink-0 sticky" style={{ left: 0, zIndex: 10 }}>
                <span className="text-base font-medium">{channels.find(item => item.attributes["serviceid"] == channel.service_id)?.attributes["tvg-chno"]?.padStart(3, "0")}: {channel.title}</span>
            </div>

            {/* Events — absolutely positioned on a shared time axis */}
            <div
                className="relative h-full border-b-2 border-white/20 overflow-x-visible"
                style={{ width: timelineWidthPx, minWidth: timelineWidthPx }}
                ref={eventAreaRef}
            >
                {events.map((event, i) => {
                    const [isFocused, setIsFocused] = useState(false)
                    const elementref = useRef<HTMLDivElement>(null)
                    const [isCurrent, setIsCurrent] = useState(getCurrentEvent(events)?.event_locator == event.event_locator)
                    const clock = useClock()
                    useEffect(() => {
                        setIsCurrent(getCurrentEvent(events)?.event_locator == event.event_locator)
                    }, [clock])

                    const startMs = new Date(event.start_time).getTime();
                    const leftPx = ((startMs - globalStartMs) / 60000) * PX_PER_MIN;
                    const widthPx = parseDurationMinutes(event.duration) * PX_PER_MIN - 2;

                    return (
                        <div
                            key={event.uuid}
                            data-current={isCurrent ? "true" : undefined}
                            data-event-index={i}
                            ref={elementref}
                            className={`absolute top-0 h-full border-white/20 border-l-2 ${isCurrent ? "bg-white/10" : ""}`}
                            style={{ left: leftPx, width: widthPx, minWidth: widthPx, maxWidth: widthPx }}
                        >
                            <ModernItemFill
                                onFocused={() => {
                                    // Record the full time window of this event for up/down nav
                                    const endMs = startMs + parseDurationMinutes(event.duration) * 60 * 1000;
                                    focusedWindowRef.current = { start: startMs, end: endMs };
                                    elementref.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" })
                                    setIsFocused(true)
                                }}
                                onBlur={() => {
                                    setIsFocused(false)
                                }}
                                focusId={`row-${rowIndex}-event-${i}`}
                                className="w-full h-full text-[18px] leading-[22px] overflow-hidden"
                            >
                                <div className="flex flex-col justify-center px-2 w-full h-full overflow-hidden">
                                    <div className="text-sm opacity-70">{new Date(event.start_time).toLocaleTimeString()}</div>
                                    <div className="truncate">{event.main_title}</div>
                                </div>
                            </ModernItemFill>
                            {isFocused && <div style={{ position: "fixed", top: "80px", left: "0", zIndex: 50 }} className="w-full h-[200px] bg-neutral-900 p-10 flex flex-row gap-2">
                                <div className="flex-1">
                                    <div className="text-4xl text-white">{event.main_title}</div>
                                    <div className="text-lg py-3 text-white">{event.on_demand ? "Bookmarkable" : "Cannot Be Bookmarked"}</div>
                                    <div className="text-xl text-white">{event.secondary_title}</div>
                                </div>
                                <img src={event.image_url + "?w=800"} className="h-full w-auto object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            </div>}
                        </div>
                    );
                })}
                <div className="w-[2px] h-full bg-red-500 absolute z-999" style={{
                    left: ((clock.getTime() - globalStartMs) / 60000) * PX_PER_MIN
                }}></div>
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

/** Returns the index of the event in `events` that has the greatest millisecond
 * overlap with the window [windowStart, windowEnd). Falls back to the event
 * whose midpoint is closest to the window's midpoint if there is no overlap. */
function getBestOverlapEventIndex(events: FreeviewEvent[], windowStart: number, windowEnd: number): number {
    let bestIdx = -1;
    let bestOverlap = -1;

    for (let i = 0; i < events.length; i++) {
        const evStart = new Date(events[i].start_time).getTime();
        const evEnd = evStart + parseDurationMinutes(events[i].duration) * 60 * 1000;
        const overlapStart = Math.max(windowStart, evStart);
        const overlapEnd = Math.min(windowEnd, evEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        if (overlap > bestOverlap) {
            bestOverlap = overlap;
            bestIdx = i;
        }
    }

    if (bestOverlap > 0) return bestIdx;

    // No overlap at all — fall back to the event whose midpoint is closest
    const windowMid = (windowStart + windowEnd) / 2;
    let closestIdx = -1;
    let closestDist = Infinity;
    for (let i = 0; i < events.length; i++) {
        const evStart = new Date(events[i].start_time).getTime();
        const evEnd = evStart + parseDurationMinutes(events[i].duration) * 60 * 1000;
        const evMid = (evStart + evEnd) / 2;
        const dist = Math.abs(evMid - windowMid);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    }
    return closestIdx;
}