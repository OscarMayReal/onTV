import { ModernRootLayout } from "./components/stbkit/modern";
import { ColumnLayout, RowLayout } from "./components/stbkit/index";
import { ModernListButton } from "./components/stbkit/modern";
import { BluetoothIcon, CheckIcon, HdmiPortIcon, PlugIcon, ServerIcon, SettingsIcon, Tv2Icon, WifiIcon } from "lucide-react";
import { useContext, useRef } from "react";
import { GlobalContext } from "./main";
import { FocusNode } from "@please/lrud";

export function Settings() {
    const { setView } = useContext(GlobalContext);
    return (
        <ModernRootLayout>
            <RowLayout onBack={() => {
                setView("home");
            }} className="h-[100dvh] w-[100dvw] flex flex-row overflow-x-scroll">
                <SettingsRow>
                    <div className="text-4xl font-medium stbkit-color-text m-6">OnTV Settings</div>
                    <ModernListButton Icon={SettingsIcon} Text="General" description="General TV settings" />
                    <ModernListButton Icon={PlugIcon} Text="Connections" description="Manage connected devices" />
                    <ModernListButton Icon={ServerIcon} Text="Server Connection" description="How the TV connects to the server" />
                    <ModernListButton Icon={Tv2Icon} Text="Live TV" description="Watching Live TV" />
                </SettingsRow>
                <SettingsRow>
                    <div className="text-4xl font-medium stbkit-color-text m-6">Connections</div>
                    <ModernListButton Icon={WifiIcon} Text="Wifi" description="Manage wifi settings" />
                    <ModernListButton Icon={BluetoothIcon} Text="Bluetooth" description="Manage bluetooth settings" />
                    <ModernListButton Icon={HdmiPortIcon} Text="Media Input" description="Manage media input settings" />
                </SettingsRow>
                <SettingsRow>
                    <div className="text-4xl font-medium stbkit-color-text m-6">Media Input</div>
                    <ModernListButton Icon={CheckIcon} Text="Enabled" />
                </SettingsRow>
                <div className="w-screen min-w-screen" />
            </RowLayout>
        </ModernRootLayout>
    )
}

function SettingsRow({ children }: { children: React.ReactNode }) {
    const itemref = useRef<HTMLDivElement>(null);
    return (
        <FocusNode orientation="vertical" ref={itemref} onFocused={() => {
            // itemref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            itemref.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemref.current?.offsetLeft! });
        }} className="flex flex-col gap-3 gap-3 w-[475px] min-w-[475px] h-full modern-shadow p-8 bg-l2-active border-r-1 border-neutral-700">
            {children}
        </FocusNode>
    )
}