import { useContext, useEffect, useRef, useState } from "react";
import { ColumnLayout, GridLayout, MenuTile, RootLayout, RowLayout } from "./components/stbkit";
import { ModernIconButton, ModernItem, ModernItemFill, ModernListButton, ModernRootLayout } from "./components/stbkit/modern";
import click from "./public/click.mp3";
import { ArrowRightCircleIcon, HardDriveIcon, HdmiPortIcon, KeyboardIcon, ScreenShareIcon, SearchIcon, SettingsIcon, Tv2Icon, UserIcon, VideoIcon, XCircleIcon } from "lucide-react";
import { Api, Jellyfin } from "@jellyfin/sdk";
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api.js';
import type { BaseItemDto, RecommendationDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { FocusNode } from "@please/lrud";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api/live-tv-api.js";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api.js";
import type { LiveTvApi } from "@jellyfin/sdk/lib/generated-client/api/live-tv-api";
import { GlobalContext } from "./main";

const serverUrl = "http://192.168.1.14:8097";

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

export default function App() {
    const { config, setConfig, currentUser, setCurrentUser, jellyfinClient, setJellyfinClient } = useContext(GlobalContext);
    useEffect(() => {
        if (jellyfinClient) return;
        const jellyfin = new Jellyfin({
            clientInfo: {
                name: 'OnTV',
                version: '1.0.0'
            },
            deviceInfo: {
                name: 'OnTV STB',
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
        <ModernRootLayout>
            <RowLayout className="p-10 flex flex-row items-center gap-3">
                <div className="text-4xl font-medium stbkit-color-text">OnTV</div>
                <div className="flex-1" />
                <ModernIconButton Icon={SearchIcon} />
                <ModernIconButton Icon={SettingsIcon} />
                <ModernIconButton Icon={UserIcon} onSelected={() => {
                    setCurrentUser(null);
                    window.localStorage.removeItem("user");
                }} />
            </RowLayout>
            <div className="mb-3 pl-10 flex flex-row items-center">
                <div className="text-2xl">Apps and Sources</div>
            </div>
            <AppsRow />
            {jellyfinClient && <TVShowsOnNow api={jellyfinClient} />}
        </ModernRootLayout>
    )
}

function AppsRow() {
    const { view, setView } = useContext(GlobalContext);
    return (
        <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8">
            <AppItem>
                <img src="https://i.ibb.co/yB80JsQC/f7d5f5ff2646c63c5bd7d9ad9741bcda-fgraphic.png" className="w-[200px] h-[98px] object-cover" />
            </AppItem>
            <AppItem>
                <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                <div className="text-xl font-medium stbkit-color-text">HDMI 1</div>
            </AppItem>
            <AppItem>
                <img src="https://i.ibb.co/wrpTd4QD/51i0m01-RSx-L.png" className="w-[200px] h-[98px] object-cover" />
            </AppItem>
            <AppItem onSelected={() => { setView("livetv") }}>
                <Tv2Icon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                <div className="text-xl font-medium stbkit-color-text">Live TV</div>
            </AppItem>
            <AppItem>
                <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                <div className="text-xl font-medium stbkit-color-text">HDMI 2</div>
            </AppItem>
            <AppItem>
                <HardDriveIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                <div className="text-xl font-medium stbkit-color-text">Recorded</div>
            </AppItem>
            <AppItem>
                <ScreenShareIcon size={35} strokeWidth={1.7} className="text-emerald-800" />
            </AppItem>
            <AppItem onSelected={() => { setView("keyboarddemo") }}>
                <KeyboardIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                <div className="text-xl font-medium stbkit-color-text">Keyboard Demo</div>
            </AppItem>
        </RowLayout>
    )
}

function TVShowsOnNow({ api }: { api: Api }) {
    const [liveTvApi, setLiveTvApi] = useState<LiveTvApi | null>(null);
    const [onNow, setOnNow] = useState<RecommendationDto | null>(null);
    useEffect(() => {
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
    }, []);
    return (
        <>
            <div className="mb-2 pl-10 flex flex-row items-center">
                <div className="text-2xl">TV Shows On Now</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8 show-row">
                {onNow?.Items.map((item) => (
                    <ShowCard key={item.Id} show={item} api={api} showInfoHeader={true} />
                ))}
            </RowLayout>
        </>
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
                itemRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            <div className="text-4xl font-medium stbkit-color-text">Welcome to OnTV</div>
            <div className="text-2xl pt-2 pb-8 stbkit-color-text">Select a user</div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row gap-8">
                {users.map((user) => (
                    <UserItem key={user.Id} user={user} setCurrentUser={setCurrentUser} currentUser={currentUser} api={api} />
                ))}
            </RowLayout>
        </ModernRootLayout>
    )
}

function AppItem({ children, onSelected }: { children: React.ReactNode, onSelected?: () => void }) {
    const itemRef = useRef<HTMLDivElement>(null);
    return (
        <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3" ref={itemRef} onFocused={() => {
            itemRef.current?.scrollIntoView({ behavior: "smooth" });
        }} onSelected={onSelected}>
            {children}
        </ModernItem>
    )
}

function UserItem({ user, setCurrentUser, currentUser, api }: { user: UserDto, setCurrentUser: (user: UserDto) => void, currentUser: UserDto | null, api: Api }) {
    return (
        <FocusNode className="usermenu-item flex flex-col items-center gap-4" onSelected={async () => {
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
            {user.PrimaryImageTag ? <img src={serverUrl + "/Users/" + user.Id + "/Images/Primary/"} className="w-[100px] h-[100px] object-cover rounded-full usermenu-item-image" /> : <div className="w-[100px] h-[100px] flex flex-row items-center justify-center rounded-full usermenu-item-image">
                <UserIcon size={50} />
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