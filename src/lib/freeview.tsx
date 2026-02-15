export type FreeviewGuideApiResponse = {
    status: "success" | "error" | string;
    data: FreeviewGuideData;
};

export type FreeviewGuideData = {
    programs: FreeviewServiceProgram[];
};

export type FreeviewServiceProgram = {
    service_id: string; // e.g. "4164"
    title: string;      // e.g. "BBC ONE Lon"
    events: FreeviewEvent[];
};

export type FreeviewEvent = {
    program_id: string;      // e.g. "crid://bbc.co.uk/icc/episode/m001rb9x"
    event_locator: string;   // e.g. "dvb://233a..1044;5c2"
    main_title: string;
    secondary_title?: string;
    image_url?: string;
    start_time: string;      // ISO-ish string e.g. "2026-01-31T00:50:00+0000"
    duration: string;        // ISO 8601 duration e.g. "PT1H40M"
    on_demand?: FreeviewOnDemand;
    genre?: string;          // e.g. "urn:fvc:metadata:cs:ContentSubjectCS:2014-07:8"
    fallback_image_url?: string;
    uuid: string;
};

export type FreeviewOnDemand = {
    start_of_availability: string; // ISO-ish string
    end_of_availability: string;   // ISO-ish string
    player_links: FreeviewPlayerLinks;
};

export type FreeviewPlayerLinks = {
    tv?: FreeviewPlayerLinkTarget;
    // sometimes these APIs also have "mobile", "web", etc
    [key: string]: FreeviewPlayerLinkTarget | undefined;
};

export type FreeviewPlayerLinkTarget = {
    program_url: string;
    template_url?: string;
};

export async function getFreeviewTvGuide() {
    const guide = await window.fetchTvGuide({
        nid: 64257,
        start: 1769817600,
    });
    return guide as FreeviewGuideApiResponse
}

function isoDurationToMs(duration: string): number {
    const match = duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) return 0;

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return (
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000
    );
}


export function getCurrentEvent(events: FreeviewEvent[]): FreeviewEvent | null {
    const now = Date.now();

    for (const event of events) {
        const start = new Date(event.start_time).getTime();

        // Convert ISO duration (PT1H40M etc) to ms
        const durationMs = isoDurationToMs(event.duration);

        const end = start + durationMs;

        if (now >= start && now < end) {
            return event;
        }
    }

    return null;
}
