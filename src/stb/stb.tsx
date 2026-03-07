import { useContext, useEffect, useRef, useState } from "react";
import { ColumnLayout, GridLayout, MenuTile, RootLayout, RowLayout, SearchBox } from "../components/stbkit";
import { ModernIconButton, ModernItem, ModernItemFill, ModernListButton, ModernRootLayout } from "../components/stbkit/modern";
import { ArrowRightCircleIcon, CircleCheckBigIcon, ClockIcon, HandIcon, HardDriveIcon, HdmiPortIcon, KeyboardIcon, LayoutGridIcon, NetworkIcon, PlayIcon, PlugIcon, ScreenShareIcon, SearchIcon, SettingsIcon, Tv2Icon, TvIcon, UserIcon, VideoIcon, XCircleIcon } from "lucide-react";
import { Api, Jellyfin } from "@jellyfin/sdk";
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api.js';
import type { BaseItemDto, RecommendationDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { FocusNode, useProcessKey } from "@please/lrud";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api/live-tv-api.js";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api.js";
import type { LiveTvApi } from "@jellyfin/sdk/lib/generated-client/api/live-tv-api";
import { GlobalContext } from "../main";
import { returnAppsList } from "../apps";
import { OnTVConfig } from "../info";
import { useClock } from "../lib/useclock";
import logo from "../assets/logo.svg";
import { MenuListItem, ListColumn, STBHeader, STBRootLayout } from "../components/stbkit/stb";

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

export default function App() {
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
    const clock = useClock();
    const [selectedMenu, setSelectedMenu] = useState("0");
    // if (!config) return <SetupUI />
    if (!currentUser) return <UserPicker api={jellyfinClient!} setCurrentUser={setCurrentUser} currentUser={currentUser} />
    return (
        <STBRootLayout>
            <STBHeader title="Home" subtitle="Box Device Name" />
            <RowLayout className="flex-1">
                <MainMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setCurrentUser={setCurrentUser} />
                {selectedMenu === "1" && <SourceMenu />}
                {selectedMenu === "3" && <RecordingsMenu />}
                {selectedMenu === "5" && <AppsMenu />}
            </RowLayout>
        </STBRootLayout>
    )
}

function MainMenu({ selectedMenu, setSelectedMenu, setCurrentUser }: { selectedMenu: string, setSelectedMenu: (menu: string) => void, setCurrentUser: (user: User | null) => void }) {
    const { setView } = useContext(GlobalContext);
    const processKey = useProcessKey();
    return (
        <ListColumn defaultFocusChild={parseInt(selectedMenu)}>
            <MenuListItem onFocused={() => { setSelectedMenu("0") }} onSelected={() => { setView("livetv") }} BgActive={selectedMenu == "0"} text="Watch Live TV" Icon={Tv2Icon} extraInfo={{ title: "Watch Live TV", subtitle: "Live TV", description: "Watch live TV on this box" }} />
            <MenuListItem onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("1") }} BgActive={selectedMenu == "1"} text="Input Sources" Icon={PlugIcon} />
            <MenuListItem onSelected={() => { setView("tvguide") }} onFocused={() => { setSelectedMenu("2") }} BgActive={selectedMenu == "2"} text="TV Guide" Icon={ClockIcon} extraInfo={{ title: "TV Guide", subtitle: "Explore channels", description: "Find out what's coming up on TV, or go back in time to catch up on your favorite shows" }} />
            <MenuListItem onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("3") }} BgActive={selectedMenu == "3"} text="Recordings & Media" Icon={HardDriveIcon} />
            <MenuListItem onSelected={() => { setView("search") }} onFocused={() => { setSelectedMenu("4") }} BgActive={selectedMenu == "4"} text="Search" Icon={SearchIcon} extraInfo={{ title: "Search", subtitle: "Find content", description: "Search for shows, movies, and more" }} />
            <MenuListItem onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("5") }} BgActive={selectedMenu == "5"} text="Apps" Icon={LayoutGridIcon} />
            <MenuListItem onSelected={() => { setView("settings") }} onFocused={() => { setSelectedMenu("6") }} BgActive={selectedMenu == "6"} text="Settings" Icon={SettingsIcon} extraInfo={{ title: "Settings", subtitle: "Edit settings", description: "Manage your settings for this box, or your entire system" }} />
            <MenuListItem onSelected={() => {
                setCurrentUser(null);
                window.localStorage.removeItem("user");
            }} onFocused={() => { setSelectedMenu("7") }} text={JSON.parse(window.localStorage.getItem("user") ?? "null").User.Name + " (switch user)"} Icon={UserIcon} extraInfo={{ title: "Sign Out", subtitle: "Switch User", description: "Switch to another user" }} />
        </ListColumn>
    )
}

function SourceMenu() {
    const processKey = useProcessKey();
    const { view, setView, hosts, setTvClient } = useContext(GlobalContext);
    return (
        <ListColumn onBack={() => { processKey.left() }} >
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50">Input Sources</div>
            <MenuListItem onSelected={() => {
                setView("hdmi?input=1");
            }} text="HDMI 1 (This Box)" Icon={HdmiPortIcon} extraInfo={{ title: "HDMI 1", subtitle: "This Box", description: "Watch the device connected to HDMI 1" }} />
            <MenuListItem onSelected={() => {
                setView("hdmi?input=2");
            }} text="HDMI 2 (This Box)" Icon={HdmiPortIcon} extraInfo={{ title: "HDMI 2", subtitle: "This Box", description: "Watch the device connected to HDMI 2" }} />
            {hosts.items.map((item, index) => <MenuListItem key={index} onSelected={() => {
                playStream({
                    apiBase: "http://192.168.1.16:3000",
                    defaultPort: 9080
                }).then((tvc) => {
                    console.log(tvc)
                    setTvClient(tvc)
                })
            }} text={"HDMI (" + item.name + ")"} Icon={NetworkIcon} extraInfo={{ title: "HDMI", subtitle: item.name, description: "Watch the device connected to HDMI on the " + item.name + " box" }} />)}
            {/* <MenuListItem onSelected={() => { }} text="HDMI 1 (Living Room)" Icon={NetworkIcon} extraInfo={{ title: "HDMI 1", subtitle: "Living Room", description: "Watch the device connected to HDMI 1 on the Living Room Box" }} />
            <MenuListItem onSelected={() => { }} text="HDMI 1 (Kitchen)" Icon={NetworkIcon} extraInfo={{ title: "HDMI 1", subtitle: "Kitchen", description: "Watch the device connected to HDMI 1 on the Kitchen Box" }} /> */}
        </ListColumn>
    )
}

function RecordingsMenu() {
    const processKey = useProcessKey();
    const { setView } = useContext(GlobalContext);
    return (
        <ListColumn onBack={() => { processKey.left() }}>
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50">Your OnTV System</div>
            <MenuListItem onSelected={() => { setView("recordings") }} text="Recordings" Icon={CircleCheckBigIcon} extraInfo={{ title: "Recordings", subtitle: "This Box", description: "Watch back content you have recorded from live TV" }} />
            <MenuListItem onSelected={() => { }} text="Personal Media" Icon={PlayIcon} extraInfo={{ title: "Personal Media", subtitle: "This Box", description: "Watch back content you have transferred to this box from your computer" }} />
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50 pt-5">On your network</div>
            <MenuListItem onSelected={() => { }} text="DLNA Share Name" Icon={NetworkIcon} extraInfo={{ title: "DLNA Share Name", subtitle: "Server Name", description: "Watch back content from the DLNA share hosted on Server Name" }} />
            <MenuListItem onSelected={() => { }} text="DLNA Share Name" Icon={NetworkIcon} extraInfo={{ title: "DLNA Share Name", subtitle: "Server Name", description: "Watch back content from the DLNA share hosted on Server Name" }} />
        </ListColumn>
    )
}

function AppsMenu() {
    const processKey = useProcessKey();
    const { setView } = useContext(GlobalContext);
    return (
        <ListColumn onBack={() => { processKey.left() }}>
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50">Apps</div>
            {returnAppsList({ jellyfinUrl: serverUrl }).map((app, index) => {
                return (
                    <MenuListItem key={index} onSelected={() => { console.log(app); launchApp(app) }} text={app.name} image={app.icon} extraInfo={{ title: app.name, subtitle: app.company, description: app.description }} />
                )
            })}
        </ListColumn>
    )
}

function AppsRow() {
    const { view, setView } = useContext(GlobalContext);
    const focusNode = useRef<HTMLElement>(null);
    return (
        <FocusNode className="home-row" ref={focusNode} onFocused={() => {
            focusNode.current?.scrollIntoView({ behavior: "smooth" });
        }}>
            <div className="mb-3 pl-10 flex flex-row items-center">
                <div className="text-2xl">Apps</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row mb-8">
                {returnAppsList().map((app) => {
                    return (
                        <AppItem key={app.name} onSelected={() => {
                            window.open(app.url, "_blank");
                        }} showInfoHeader info={{
                            name: app.name,
                            overview: app.description,
                            subtitle: app.company
                        }}>
                            <img src={app.icon} className="w-[200px] h-[98px] object-cover" />
                        </AppItem>
                    )
                })}
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

function AppItem({ children, onSelected, showInfoHeader, info }: { children: React.ReactNode, onSelected?: () => void, showInfoHeader?: boolean, info?: AppItemInfo }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    return (
        <>
            <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3" ref={itemRef} onFocused={() => {
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
        <FocusNode className="usermenu-item flex flex-col items-center gap-6" onSelected={async () => {
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