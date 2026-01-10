import { useEffect } from "react";
import { GridLayout, MenuTile, RootLayout, RowLayout } from "./components/stbkit";
import { ModernIconButton, ModernItem, ModernRootLayout } from "./components/stbkit/modern";
import click from "./public/click.mp3";
import { HardDriveIcon, HdmiPortIcon, ScreenShareIcon, SearchIcon, SettingsIcon, Tv2Icon, UserIcon } from "lucide-react";

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
    return (
        <ModernRootLayout>
            <RowLayout className="p-10 flex flex-row items-center gap-3">
                <div className="text-4xl font-medium stbkit-color-text">OnTV</div>
                <div className="flex-1" />
                <ModernIconButton Icon={SearchIcon} />
                <ModernIconButton Icon={SettingsIcon} />
                <ModernIconButton Icon={UserIcon} />
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
