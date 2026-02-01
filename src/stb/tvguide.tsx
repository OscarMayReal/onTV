import { STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { ColumnLayout, RowLayout } from "../components/stbkit";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../main";
import {
    getFreeviewTvGuide,
    type FreeviewServiceProgram,
    type FreeviewEvent,
} from "../lib/freeview";
import { ModernItemFill } from "../components/stbkit/modern";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { FocusNode, useSetFocus } from "@please/lrud";

const MAX_EVENTS = 25;
const PX_PER_MIN = 60;
// const MIN_EVENT_W = 180;
// const MAX_EVENT_W = 560;

export default function TvGuidePage() {
    return (
        <STBRootLayout onBack={() => { }}>
            <TVGuide />
        </STBRootLayout>
    );
}

function TVGuide() {
    const { setView } = useContext(GlobalContext);
    const [programs, setPrograms] = useState<FreeviewServiceProgram[]>([]);
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    useEffect(() => {
        getFreeviewTvGuide().then((items) => {
            setPrograms(items.data?.programs ?? []);
        });
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <STBHeader title="TV Guide" subtitle={new Date().toLocaleDateString()} />

            <RowLayout className="flex-1">
                <ColumnLayout className="ml-8 items-center rounded-t-xl relative h-full vertical-list-menu w-full mr-12 flex flex-col overflow-hidden">
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
                            />
                        )}
                    />
                </ColumnLayout>
            </RowLayout>
        </div>
    );
}

function TvChannelRow({
    channel,
    rowIndex,
    totalRows,
    virtuosoRef,
}: {
    channel: FreeviewServiceProgram;
    rowIndex: number;
    totalRows: number;
    virtuosoRef: React.RefObject<VirtuosoHandle>;
}) {
    const setFocus = useSetFocus();
    const events = (channel.events ?? []).slice(0, MAX_EVENTS);

    const rowFocusId = `row-${rowIndex}`;

    return (
        <FocusNode
            focusId={rowFocusId}
            orientation="horizontal"
            defaultFocusChild={0}
            className="flex flex-row items-center w-full border-b border-gray-700 h-[78px]"
            onFocused={() => {
                virtuosoRef.current?.scrollToIndex({
                    index: rowIndex,
                    align: "center",
                    behavior: "smooth",
                });
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
            <div className="w-44 h-full stb-menuitem border-r-2 bg-black/20 flex items-center px-4 shrink-0">
                <span className="text-base font-medium">{channel.title}</span>
            </div>

            {/* Events */}
            <div className="flex-1 overflow-x-auto flex items-center min-w-0">
                {events.map((event, i) => {
                    // const width = clamp(parseDurationMinutes(event.duration) * PX_PER_MIN, MIN_EVENT_W, MAX_EVENT_W);
                    const width = parseDurationMinutes(event.duration) * PX_PER_MIN
                    return (
                        <ModernItemFill
                            key={event.uuid}
                            focusId={`row-${rowIndex}-event-${i}`}
                            className={`line-clamp-1 h-full px-4 flex items-center text-[18px] leading-[22px] whitespace-nowrap overflow-hidden text-ellipsis min-w-[${width}px] max-w-[${width}px w-[${width}px] shrink-0 h-56`}
                        >
                            {event.main_title}
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