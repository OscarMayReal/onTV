import { useContext, useEffect, useRef, useState } from "react";
import { ColumnLayout, GridLayout, MenuTile, RootLayout, RowLayout } from "./components/stbkit";
import { ModernIconButton, ModernItem, ModernItemFill, ModernListButton, ModernRootLayout } from "./components/stbkit/modern";
import click from "./public/click.mp3";
import { ArrowLeftIcon, ArrowRightCircleIcon, BookmarkIcon, Grid2X2Icon, HardDriveIcon, HdmiPortIcon, KeyboardIcon, ScreenShareIcon, SearchIcon, SettingsIcon, Tv2Icon, TvIcon, UserIcon, VideoIcon, XCircleIcon } from "lucide-react";
import { Api, Jellyfin } from "@jellyfin/sdk";
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api.js';
import type { BaseItemDto, RecommendationDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { FocusNode } from "@please/lrud";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api/live-tv-api.js";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api.js";
import type { LiveTvApi } from "@jellyfin/sdk/lib/generated-client/api/live-tv-api";
import { GlobalContext } from "./main";
import { returnAppsList } from "./apps";
import { OnTVConfig } from "./info";

export function profileBgFromText(text: string) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }

    const hue = Math.abs(hash) % 360;

    // Add variation but keep it "nice"
    const sat = 55 + (Math.abs(hash) % 25);          // 55–79
    const light = 22 + (Math.abs(hash >> 8) % 18);   // 22–39 (dark)

    return `hsl(${hue} ${sat}% ${light}%)`;
}


const serverUrl = "https://jellyfin.mayhouse.dedyn.io";

// export default function App() {
//     return (
//         <RootLayout>
//             <GridLayout className="gap-8">
//                 <RowLayout className="gap-8">
//                     <MenuTile />
//                     <MenuTile />
//                     <MenuTile />
//                 </RowLayout>
//                 <RowLayout className="gap-8">
//                     <MenuTile />
//                     <MenuTile />
//                     <MenuTile />
//                 </RowLayout>
//             </GridLayout>
//         </RootLayout>
//     )
// }

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}


export default function StbApp() {
    const { config, setConfig, currentUser, setCurrentUser, jellyfinClient, setJellyfinClient, setView } = useContext(GlobalContext);
    useEffect(() => {
        if (jellyfinClient) return;
        const jellyfin = new Jellyfin({
            clientInfo: {
                name: OnTVConfig.serviceInfo.name,
                version: '1.0.0'
            },
            deviceInfo: {
                name: OnTVConfig.deviceInfo.name,
                id: '01'
            }
        });
        var api = null as Api | null;
        if (currentUser) {
            api = jellyfin.createApi(serverUrl, currentUser.AccessToken);
        } else {
            api = jellyfin.createApi(serverUrl);
        }
        console.log(api);
        setJellyfinClient(api);
    }, [jellyfinClient, currentUser]);
    // if (!config) return <SetupUI />
    if (!currentUser) return <UserPicker api={jellyfinClient!} setCurrentUser={setCurrentUser} currentUser={currentUser} />
    return (
        <ModernRootLayout onBack={() => setView("home")}>
            <RowLayout className="p-10 pb-0 flex flex-row items-center gap-3 sticky top-0 z-50 bg-neutral-900 z-60">
                <ModernIconButton Icon={ArrowLeftIcon} onSelected={() => setView("home")} />
                <div className="text-4xl font-medium stbkit-color-text">Bookmarks</div>
                <div className="flex-1" />
            </RowLayout>
            <div className="h-10" />
            <div className="h-[204px] p-10 pt-0 flex flex-col justify-center gap-2">
                <BookmarkIcon className="pb-2" size={50} />
                <div className="text-4xl font-medium stbkit-color-text">Bookmarks</div>
                <div className="text-2xl stbkit-color-text">Save shows from Live TV to watch later</div>
            </div>
            <AllBookmarksGrid />
            <div className="h-[100dvh]" />
        </ModernRootLayout>
    )
}

function AllBookmarksGrid() {
    const focusNode = useRef<HTMLElement>(null);
    return (
        <FocusNode className="home-row" ref={focusNode} onFocused={() => {
            focusNode.current?.scrollIntoView({ behavior: "smooth" });
        }}>
            <div className="mb-3 pl-10 flex flex-row items-center">
                <div className="text-2xl">All Bookmarks</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8">
                {

                }
            </RowLayout>
        </FocusNode>
    )
}

function SourcesRow() {
    const { view, setView } = useContext(GlobalContext);
    const focusNode = useRef<HTMLElement>(null);
    return (
        <FocusNode className="home-row" ref={focusNode} onFocused={() => {
            focusNode.current?.scrollIntoView({ behavior: "smooth" });
        }}>
            <div className="mb-3 pl-10 flex flex-row items-center">
                <div className="text-2xl">Sources</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8">
                <AppItem showInfoHeader info={{ name: "HDMI 1", overview: `View the device connected to HDMI 1`, subtitle: "Hardware Inputs" }} onSelected={() => { setView("hdmi?input=1") }}>
                    <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">HDMI 1</div>
                </AppItem>
                <AppItem showInfoHeader info={{ name: "Live TV", overview: "View Live TV", subtitle: "TV Inputs" }} onSelected={() => { setView("livetv") }}>
                    <Tv2Icon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">Live TV</div>
                </AppItem>
                <AppItem showInfoHeader info={{ name: "HDMI 2", overview: "View the device connected to HDMI 2", subtitle: "Hardware Inputs" }} onSelected={() => { setView("hdmi?input=2") }}>
                    <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">HDMI 2</div>
                </AppItem>
                <AppItem showInfoHeader info={{ name: "Recorded", overview: "View Recorded Shows", subtitle: "TV Inputs" }} onSelected={() => { setView("bookmarks") }}>
                    <HardDriveIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">Recorded</div>
                </AppItem>
            </RowLayout>
        </FocusNode>
    )
}

function TVShowsOnNow({ api }: { api: Api }) {
    const [liveTvApi, setLiveTvApi] = useState<LiveTvApi | null>(null);
    const [onNow, setOnNow] = useState<RecommendationDto | null>(null);
    useEffect(() => {
        if (!api) return;
        const liveTvApi = getLiveTvApi(api);
        setLiveTvApi(liveTvApi);
        const userApi = getUserApi(api);
        userApi.getCurrentUser().then((user) => {
            liveTvApi.getRecommendedPrograms({
                userId: user.data.Id,
                limit: 30,
                isAiring: true,
                fields: [
                    "Overview",
                    "ChannelInfo",
                ]
            }).then((onNow) => {
                console.log(onNow.data);
                setOnNow(onNow.data);
            });
        });
    }, [api]);
    const focusNode = useRef<HTMLElement>(null);
    return (
        <FocusNode className="home-row" ref={focusNode} onFocused={() => {
            focusNode.current?.scrollIntoView({ behavior: "smooth" });
        }}>
            <div className="mb-2 pl-10 flex flex-row items-center">
                <div className="text-2xl">TV Shows On Now</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8 show-row">
                {onNow?.Items.map((item) => (
                    <ShowCard key={item.Id} show={item} api={api} showInfoHeader={true} />
                ))}
            </RowLayout>
        </FocusNode>
    )
}

function ShowCard({ show, api, showInfoHeader }: { show: BaseItemDto, api: Api, showInfoHeader?: boolean }) {
    const [image, setImage] = useState<string | null>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        const imageApi = getImageApi(api);
        setImage(imageApi.getItemImageUrl(show, "Primary"));
    }, [show]);
    return (
        <>
            <ModernItem ref={itemRef} onFocused={() => {
                setFocused(true);
                // itemRef.current?.scrollIntoView({ behavior: 'smooth' });
                itemRef.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemRef.current?.offsetLeft! - 40 });
            }} onBlur={() => {
                setFocused(false);
            }} className="w-[125px] min-w-[125px] h-[180px]">
                {/* <div>{show.Name}</div> */}
                {image && <img src={image} className="w-full h-full object-cover" onError={(e) => { setImage(null) }} />}
                {!image && <div className="w-full h-full flex items-center justify-center">
                    <VideoIcon size={50} strokeWidth={1.4} className="stbkit-color-text" />
                </div>}
            </ModernItem>
            {showInfoHeader && focused && (
                <div style={{ position: "fixed", top: "80px", left: "0", zIndex: 50, }} className="w-full h-[250px] bg-neutral-900 p-10 flex flex-row gap-2">
                    <div className="flex-1">
                        <div className="text-4xl">{show.Name}</div>
                        <div className="text-xl py-4">{show.ChannelName} • {new Date(show.StartDate).toLocaleTimeString()} - {new Date(show.EndDate).toLocaleTimeString()}</div>
                        <div className="text-2xl">{show.Overview}</div>
                    </div>
                    <img src={image} className="h-full w-auto object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
            )}
        </>
    )
}

function UserPicker({ api, setCurrentUser, currentUser }: { api: Api, setCurrentUser: (user: UserDto) => void, currentUser: UserDto | null }) {
    const [users, setUsers] = useState<UserDto[]>([]);
    useEffect(() => {
        if (!api) return;
        getUserApi(api).getPublicUsers().then((users) => {
            setUsers(users.data);
        });
    }, [api]);
    return (
        <ModernRootLayout className="items-center justify-center h-[100dvh] w-[100dvw]">
            <div className="text-4xl font-medium stbkit-color-text">Welcome to {OnTVConfig.serviceInfo.name}</div>
            <div className="text-2xl pt-2 pb-8 stbkit-color-text">Select a user</div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row gap-8">
                {users.map((user) => (
                    <UserItem key={user.Id} user={user} setCurrentUser={setCurrentUser} currentUser={currentUser} api={api} />
                ))}
            </RowLayout>
        </ModernRootLayout>
    )
}

interface AppItemInfo {
    name: string;
    subtitle?: string;
    overview: string;
    image: string;
}

function AppItem({ children, onSelected, showInfoHeader, info, type = "app" }: { children: React.ReactNode, onSelected?: () => void, showInfoHeader?: boolean, info?: AppItemInfo, type?: "icon" | "app" }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    return (
        <>
            <ModernItem className={(type == "icon" ? "w-[98px] min-w-[98px]" : "w-[200px] min-w-[200px]") + " h-[98px] flex flex-row items-center justify-center gap-3"} ref={itemRef} onFocused={() => {
                setFocused(true);
                // itemRef.current?.scrollIntoView({ behavior: "smooth" });
                itemRef.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemRef.current?.offsetLeft! - 40 });
            }} onBlur={() => {
                setFocused(false);
            }} onSelected={onSelected}>
                {children}
            </ModernItem>
            {showInfoHeader && focused && <div style={{ position: "fixed", top: "80px", left: "0", zIndex: 50, }} className="w-full h-[250px] bg-neutral-900 p-10 flex flex-row gap-2">
                <div className="flex-1">
                    <div className="text-4xl">{info?.name}</div>
                    <div className="text-xl py-4">{info?.subtitle}</div>
                    <div className="text-2xl">{info?.overview}</div>
                </div>
                <img src={info?.image} className="h-full w-auto object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>}
        </>
    )
}

function UserItem({ user, setCurrentUser, currentUser, api }: { user: UserDto, setCurrentUser: (user: UserDto) => void, currentUser: UserDto | null, api: Api }) {
    return (
        <FocusNode className={`usermenu-item flex flex-col items-center gap-6`} onSelected={async () => {
            if (!user.HasPassword) {
                const result = await getUserApi(api).authenticateUserByName({
                    authenticateUserByName: {
                        Username: user.Name,
                        Pw: ""
                    }
                });
                if (result.data) {
                    window.localStorage.setItem("user", JSON.stringify(result.data));
                    setCurrentUser(result.data);
                }
            }
        }}>
            {user.PrimaryImageTag ? <img src={serverUrl + "/Users/" + user.Id + "/Images/Primary/"} className="w-[100px] h-[100px] object-cover rounded-full usermenu-item-image" /> : <div className="w-[100px] h-[100px] flex flex-row items-center justify-center rounded-full usermenu-item-image" style={{
                backgroundColor: profileBgFromText(user.Name)
            }}>
                <UserIcon color="white" size={50} />
            </div>}
            <div className="usermenu-item-text w-fit px-2 rounded-full">
                {user.Name}{user.HasPassword ? " (Locked)" : ""}
            </div>
        </FocusNode>
    )
}

function SetupUI() {
    return (
        <ModernRootLayout className="items-center space-between h-[100dvh] w-[100dvw] flex flex-row">
            <div className="flex flex-col gap-4 w-[70%] p-10">
                <div className="text-4xl font-medium stbkit-color-text">Welcome to OnTV</div>
                <div className="text-2xl pt-2 pb-8 stbkit-color-text max-w-[500px]">This setup wizard will guide you through the process of setting up OnTV.</div>
            </div>
            <ColumnLayout className="flex flex-col gap-4 w-[30%] bg-neutral-800 h-full justify-center modern-shadow p-8">
                <ModernListButton Icon={ArrowRightCircleIcon} Text="Next" />
                <ModernListButton Icon={XCircleIcon} Text="Skip" />
            </ColumnLayout>
        </ModernRootLayout>
    )
}