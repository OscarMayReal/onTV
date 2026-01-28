import { RowLayout } from "../components/stbkit";
import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { Children, useContext, useState } from "react";
import { useProcessKey } from "@please/lrud";
import { Tv2Icon, PlugIcon, ClockIcon, HardDriveIcon, SearchIcon, LayoutGridIcon, SettingsIcon, NetworkIcon, CheckIcon, XCircleIcon, EyeIcon, SpeakerIcon } from "lucide-react";
import { GlobalContext } from "../main";
import { useEffect } from "react";
import { FocusNode } from "@please/lrud";

export default function STBSettings() {
    const [selectedMenu, setSelectedMenu] = useState("0");
    return (
        <STBRootLayout>
            <STBHeader title="Settings" subtitle="Box Device Name" />
            <RowLayout className="flex-1">
                <SettingsMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
                {selectedMenu === "0" && <SourceSettings />}
            </RowLayout>
        </STBRootLayout>
    )
}

function SettingsMenu({ selectedMenu, setSelectedMenu }: { selectedMenu: string, setSelectedMenu: (menu: string) => void }) {
    const { setView } = useContext(GlobalContext);
    const processKey = useProcessKey();
    return (
        <ListColumn defaultFocusChild={parseInt(selectedMenu)} onBack={() => { setView("home") }}>
            <MenuListItem onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("0") }} text="Input Sources" Icon={PlugIcon} />
            <MenuListItem onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("1") }} text="Network" Icon={NetworkIcon} />
        </ListColumn>
    )
}

function SourceSettings() {
    const [devices, setDevices] = useState([]);
    const processKey = useProcessKey();
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setDevices(devices);
        });
    }, []);
    const { config, setConfig } = useContext(GlobalContext);
    return (
        <ListColumn onBack={() => { processKey.left() }}>
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50">HDMI 1</div>
            <MenuListItem text="State" onSelected={() => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi1: { ...config?.sources?.options?.hdmi1, enabled: !config?.sources?.options?.hdmi1?.enabled } } } }) }} Icon={config?.sources?.options?.hdmi1?.enabled ? CheckIcon : XCircleIcon} extraInfo={{ title: "State", subtitle: config?.sources?.options?.hdmi1?.enabled ? "Enabled" : "Disabled", description: "Enable or disable this input source" }} />
            <MediaInputPicker type="videoinput" selectedDeviceId={config?.sources?.options?.hdmi1?.videoDeviceId} setSelectedDeviceId={(deviceId) => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi1: { ...config?.sources?.options?.hdmi1, videoDeviceId: deviceId } } } }) }}>
                <MenuListItem text="Video Device" Icon={EyeIcon} extraInfo={{ title: "Video Device", subtitle: devices.find((device) => device.deviceId === config?.sources?.options?.hdmi1?.videoDeviceId)?.label ?? "None", description: "Select the device to use for this input source's video" }} />
            </MediaInputPicker>
            <MediaInputPicker type="audioinput" selectedDeviceId={config?.sources?.options?.hdmi1?.audioDeviceId} setSelectedDeviceId={(deviceId) => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi1: { ...config?.sources?.options?.hdmi1, audioDeviceId: deviceId } } } }) }}>
                <MenuListItem text="Audio Device" Icon={SpeakerIcon} extraInfo={{ title: "Audio Device", subtitle: devices.find((device) => device.deviceId === config?.sources?.options?.hdmi1?.audioDeviceId)?.label ?? "None", description: "Select the device to use for this input source's audio" }} />
            </MediaInputPicker>
            <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50 pt-5">HDMI 2</div>
            <MenuListItem text="State" onSelected={() => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi2: { ...config?.sources?.options?.hdmi2, enabled: !config?.sources?.options?.hdmi2?.enabled } } } }) }} Icon={config?.sources?.options?.hdmi2?.enabled ? CheckIcon : XCircleIcon} extraInfo={{ title: "State", subtitle: config?.sources?.options?.hdmi2?.enabled ? "Enabled" : "Disabled", description: "Enable or disable this input source" }} />
            <MediaInputPicker type="videoinput" selectedDeviceId={config?.sources?.options?.hdmi2?.videoDeviceId} setSelectedDeviceId={(deviceId) => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi2: { ...config?.sources?.options?.hdmi2, videoDeviceId: deviceId } } } }) }}>
                <MenuListItem text="Video Device" Icon={EyeIcon} extraInfo={{ title: "Video Device", subtitle: devices.find((device) => device.deviceId === config?.sources?.options?.hdmi2?.videoDeviceId)?.label ?? "None", description: "Select the device to use for this input source's video" }} />
            </MediaInputPicker>
            <MediaInputPicker type="audioinput" selectedDeviceId={config?.sources?.options?.hdmi2?.audioDeviceId} setSelectedDeviceId={(deviceId) => { setConfig({ ...config, sources: { ...config?.sources, options: { ...config?.sources?.options, hdmi2: { ...config?.sources?.options?.hdmi2, audioDeviceId: deviceId } } } }) }}>
                <MenuListItem text="Audio Device" Icon={SpeakerIcon} extraInfo={{ title: "Audio Device", subtitle: devices.find((device) => device.deviceId === config?.sources?.options?.hdmi2?.audioDeviceId)?.label ?? "None", description: "Select the device to use for this input source's audio" }} />
            </MediaInputPicker>
        </ListColumn>
    )
}

function MediaInputPicker({ type, selectedDeviceId, setSelectedDeviceId, children }: { type: "videoinput" | "audioinput", selectedDeviceId: string, setSelectedDeviceId: (deviceId: string) => void, children: React.ReactNode }) {
    const [devices, setDevices] = useState([]);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setDevices(devices);
        });
    }, []);
    return (
        <>
            <FocusNode onSelected={() => setIsPickerOpen(true)}>
                {children}
            </FocusNode>
            {isPickerOpen && <FocusNode onMountAssignFocusTo="list_0" className="w-[100dvw] h-[100dvh] min-w-[100dvw] min-h-[100dvh] max-w-[100dvw] max-h-[100dvh] fixed top-0 left-0 z-50 flex flex-col bg-[#145D48]" isTrap onBack={() => setIsPickerOpen(false)}>
                <STBHeader title="Pick Device" subtitle={type === "videoinput" ? "Video Source" : "Audio Source"} />
                <ListColumn focusId="list_0">
                    {devices.filter((device: MediaDeviceInfo) => device.kind === type).map((device: MediaDeviceInfo) => (
                        <MenuListItem key={device.deviceId} focusId={`item_${device.deviceId}`} text={device.label} Icon={EyeIcon} extraInfo={{ title: "Video Device", subtitle: device.label, description: "Select the device to use for this input source's video" }} onSelected={() => { setSelectedDeviceId(device.deviceId); setIsPickerOpen(false) }} />
                    ))}
                </ListColumn>
            </FocusNode>}
        </>
    )
}