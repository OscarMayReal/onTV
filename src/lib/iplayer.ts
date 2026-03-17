export type IPlayerCollection = {
    version: string;
    schema: string;
    group_episodes: GroupEpisodes;
}

export type GroupEpisodes = {
    page: number;
    per_page: number;
    count: number;
    group: Group;
    elements: IPlayerElement[];
}

export type IPlayerElement = {
    id: string;
    live: boolean;
    type: "episode";
    title: string;
    images: ElementImages;
    labels: Labels;
    signed: boolean;
    status: "available";
    tleo_id: string;
    guidance: boolean;
    slice_id?: string;
    subtitle: string;
    synopses: ElementSynopses;
    versions: Version[];
    childrens: boolean;
    parent_id: string;
    tleo_type: TleoType;
    categories: string[];
    has_credits: boolean;
    requires_ab: RequiresAb[];
    master_brand: MasterBrand;
    release_date: string;
    related_links: any[];
    original_title: string;
    programme_type: ProgrammeType;
    slice_subtitle?: string;
    audio_described: boolean;
    parent_position: number;
    requires_sign_in: boolean;
    release_date_time: Date;
    editorial_subtitle?: string;
    lexical_sort_letter: string;
    requires_tv_licence: boolean;
    numeric_tleo_position?: number;
    preview_id?: string;
    preview_clip_id?: string;
    editorial_title?: string;
}

export type ElementImages = {
    type: "image";
    portrait?: string;
    standard: string;
    promotional: string;
    promotional_with_logo: string;
    character_image?: string;
}

export type Labels = {
    category: string;
}

export type MasterBrand = {
    id: Attribution;
    titles: Titles;
    attribution: Attribution;
}

export enum Attribution {
    BbcOne = "bbc_one",
    BbcThree = "bbc_three",
    BbcTwo = "bbc_two",
}

export type Titles = {
    large: string;
    small: Small;
    medium: string;
}

export enum Small {
    BBCOne = "BBC One",
    BBCThree = "BBC Three",
    BBCTwo = "BBC Two",
    HasGuidance = "Has guidance",
}

export enum ProgrammeType {
    Narrative = "narrative",
    SelfContained = "self-contained",
    Sequential = "sequential",
}

export enum RequiresAb {
    O18 = "o18",
    U13 = "u13",
    U16 = "u16",
    U18 = "u18",
}

export type ElementSynopses = {
    large?: string;
    small: string;
    medium: string;
    editorial?: string;
    programme_small?: string;
    preview?: string;
}

export enum TleoType {
    Brand = "brand",
    Series = "series",
}

export type Version = {
    hd: boolean;
    id: string;
    hdr: boolean;
    uhd: boolean;
    kind: Kind;
    type: "version";
    events: Event[];
    download: boolean;
    duration: Duration;
    guidance?: Guidance;
    availability: Availability;
    credits_start?: number;
    first_broadcast: string;
    first_broadcast_date_time: Date;
    interactions?: Interaction[];
    rrc?: Rrc;
}

export type Availability = {
    end: Date;
    start: Date;
    remaining: Remaining;
}

export type Remaining = {
    text: Text;
}

export enum Text {
    AvailableFor10Months = "Available for 10 months",
    AvailableFor11Months = "Available for 11 months",
    AvailableForOverAYear = "Available for over a year",
}

export type Duration = {
    text: string;
    value: string;
}

export type Event = {
    name: Name;
    offset: number;
    system: System;
}

export enum Name {
    Ended = "ended",
    IplxpEpStarted = "iplxp-ep-started",
    IplxpEpWatched = "iplxp-ep-watched",
    Started = "started",
}

export enum System {
    Dax = "dax",
    Optimizely = "optimizely",
    Uas = "uas",
}

export type Guidance = {
    id: string;
    text: Titles;
}

export type Interaction = {
    type: string;
    title: Title;
    subtype: string;
    interaction_points: InteractionPoints;
}

export type InteractionPoints = {
    skip_to: number;
    show_from: number;
}

export type Title = {
    long: string;
    short: string;
}

export enum Kind {
    AudioDescribed = "audio-described",
    Editorial = "editorial",
    Original = "original",
    Signed = "signed",
    TechnicalReplacement = "technical-replacement",
}

export type Rrc = {
    description: Description;
}

export type Description = {
    large: string;
    small: string;
}

export type Group = {
    id: string;
    type: string;
    group_type: string;
    content_type: string;
    stacked: boolean;
    images: GroupImages;
    episode_sort_direction: string;
    related_links: any[];
    title: string;
    synopses: GroupSynopses;
}

export type GroupImages = {
    type: "image";
    standard: string;
    vertical: string;
}

export type GroupSynopses = {
    small: string;
}
