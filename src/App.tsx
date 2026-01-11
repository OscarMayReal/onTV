import { useEffect, useState } from "react";
import { GridLayout, MenuTile, RootLayout, RowLayout } from "./components/stbkit";
import { ModernIconButton, ModernItem, ModernItemFill, ModernRootLayout } from "./components/stbkit/modern";
import click from "./public/click.mp3";
import { HardDriveIcon, HdmiPortIcon, ScreenShareIcon, SearchIcon, SettingsIcon, Tv2Icon, UserIcon } from "lucide-react";
import { Api, Jellyfin } from "@jellyfin/sdk";
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api.js';
import type { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { FocusNode } from "@please/lrud";

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
    const [jellyfinClient, setJellyfinClient] = useState<Api | null>(null);
    const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
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
        const api = jellyfin.createApi(serverUrl);
        console.log(api);
        setJellyfinClient(api);
    }, [jellyfinClient]);
    useEffect(() => {
        function PlayDirectionSound() {
            // document.body.requestFullscreen();
            const audio = new Audio(click);
            audio.play();
        }
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                PlayDirectionSound();
            }
        });
        return () => {
            window.removeEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    PlayDirectionSound();
                }
            });
        };
    }, []);
    if (!currentUser) return <UserPicker api={jellyfinClient!} setCurrentUser={setCurrentUser} currentUser={currentUser} />
    return (
        <ModernRootLayout>
            <RowLayout className="p-10 flex flex-row items-center gap-3">
                <div className="text-4xl font-medium stbkit-color-text">OnTV</div>
                <div className="flex-1" />
                <ModernIconButton Icon={SearchIcon} />
                <ModernIconButton Icon={SettingsIcon} />
                <ModernIconButton Icon={UserIcon} onSelected={() => setCurrentUser(null)} />
            </RowLayout>
            <div className="mb-3 pl-10 flex flex-row items-center">
                <div className="text-2xl">Apps and Sources</div>
            </div>
            <RowLayout className="gap-2 pl-10 pr-10 scroll-row">
                <ModernItem className="w-[200px] min-w-[200px] h-[98px]">
                    <img src="https://i.ibb.co/yB80JsQC/f7d5f5ff2646c63c5bd7d9ad9741bcda-fgraphic.png" className="w-[200px] h-[98px] object-cover" />
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3">
                    <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">HDMI 1</div>
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px]">
                    <img src="https://i.ibb.co/wrpTd4QD/51i0m01-RSx-L.png" className="w-[200px] h-[98px] object-cover" />
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3">
                    <Tv2Icon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">Live TV</div>
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3">
                    <HdmiPortIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">HDMI 2</div>
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3">
                    <HardDriveIcon size={35} strokeWidth={1.4} className="stbkit-color-text" />
                    <div className="text-xl font-medium stbkit-color-text">Recorded</div>
                </ModernItem>
                <ModernItem className="w-[200px] min-w-[200px] h-[98px] flex flex-row items-center justify-center gap-3">
                    <ScreenShareIcon size={35} strokeWidth={1.7} className="text-emerald-800" />
                </ModernItem>
            </RowLayout>
        </ModernRootLayout>
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