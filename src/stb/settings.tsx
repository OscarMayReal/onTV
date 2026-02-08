import { RowLayout } from "../components/stbkit";
import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { Children, useContext, useState } from "react";
import { useProcessKey } from "@please/lrud";
import { Tv2Icon, PlugIcon, ClockIcon, HardDriveIcon, SearchIcon, LayoutGridIcon, SettingsIcon, NetworkIcon, CheckIcon, XCircleIcon, EyeIcon, SpeakerIcon, WifiIcon, UnlockIcon, SparklesIcon, Camera } from "lucide-react";
import { GlobalContext } from "../main";
import { useEffect } from "react";
import { FocusNode } from "@please/lrud";

export default function STBSettings() {
    const [selectedMenu, setSelectedMenu] = useState("0");
    return (
        <STBRootLayout>
            <STBHeader title="Settings" subtitle="Box Device Name" />
            <RowLayout className="flex-1 stbmainrow">
                <SettingsMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
                {selectedMenu === "0" && <SourceSettings />}
                {selectedMenu === "1" && <NetworkSettings />}
                {selectedMenu === "2" && <SmartFeatureSettings />}
            </RowLayout>
        </STBRootLayout>
    )
}

function SettingsMenu({ selectedMenu, setSelectedMenu }: { selectedMenu: string, setSelectedMenu: (menu: string) => void }) {
    const { setView } = useContext(GlobalContext);
    const processKey = useProcessKey();
    return (
        <ListColumn defaultFocusChild={parseInt(selectedMenu)} onBack={() => { setView("home") }}>
            <MenuListItem BgActive={selectedMenu == "0"} onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("0") }} text="Input Sources" Icon={PlugIcon} />
            <MenuListItem BgActive={selectedMenu == "1"} onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("1") }} text="Network" Icon={NetworkIcon} />
            <MenuListItem BgActive={selectedMenu == "2"} onSelected={() => { processKey.right() }} onFocused={() => { setSelectedMenu("2") }} text="Smart Features" Icon={SparklesIcon} />
        </ListColumn>
    )
}

function NetworkSettings() {
    const [networks, setNetworks] = useState({ networks: [], loaded: false })
    useEffect(() => {
        if (networks.loaded) return
        wifi.scan().then((nw) => {
            setNetworks({ loaded: true, networks: nw })
        })
    }, [networks])
    return <ListColumn>
        <div className="text-3xl stbkit-color-text pl-11 mb-3 mt-1 font-light text-white/50">Networks</div>
        {networks.loaded && networks.networks.filter(nw => nw.ssid != "").map(nw => (
            <MenuListItem text={nw.ssid} Icon={nw.security == "" ? UnlockIcon : WifiIcon} key={nw.mac} extraInfo={{ title: nw.ssid, subtitle: nw.mac + " - " + nw.security == "" ? "Unsecured" : nw.security, description: "Connect to this network" }} />
        ))}
    </ListColumn>
}

function SmartFeatureSettings() {
    const { config, setConfig } = useContext(GlobalContext);
    return <ListColumn>
        <div className="text-3xl stbkit-color-text pl-11 pr-11 mb-3 mt-1 font-light text-white/50">Camera Auto Power</div>
        <div className="text-xl stbkit-color-text pl-11 pr-11 mb-3 mt-1 font-medium text-white/50">Camera Auto Power uses the camera to automatically turn the TV on and off when people are detected. Camera footage is never saved and never leaves your device</div>
        <MenuListItem text={config.smartFeatures?.camera?.autoPower ? "Enabled" : "Disabled"} onSelected={() => {
            setConfig({ ...config, smartFeatures: { ...config.smartFeatures, camera: { ...config.smartFeatures?.camera, autoPower: !config.smartFeatures?.camera?.autoPower } } })
        }} Icon={config.smartFeatures?.camera?.autoPower ? CheckIcon : XCircleIcon} extraInfo={{ title: "State", subtitle: config.smartFeatures?.camera?.autoPower ? "Enabled" : "Disabled", description: "Enable or disable auto power" }} />
    </ListColumn>
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