import { useRef, useState } from "react";
import { ColumnLayout } from ".";
import { ModernItemFill, ModernRootLayout } from "./modern";
import { useClock } from "../../lib/useclock";
import logo from "../../assets/logo.svg";
import "./stbstyles.css";

export function MenuListItem({ focusId, onSelected, text, Icon, image, onFocused, extraInfo, larger, BgActive }: { focusId?: string, onSelected?: () => void, text: string, Icon?: React.JSX.ElementType, image?: string, onFocused?: () => void, extraInfo?: { title: string, subtitle: string, description: string }, larger?: boolean, BgActive?: boolean }) {
    const [isFocused, setIsFocused] = useState(false);
    const elref = useRef<HTMLDivElement>(null)
    return (
        <ModernItemFill ref={elref} focusId={focusId} onSelected={onSelected} onBlur={() => { setIsFocused(false) }} onFocused={() => { setIsFocused(true); elref.current?.scrollIntoView({ behavior: 'smooth' }); onFocused?.() }} className={`p-2 pl-11 stb-menuitem rounded-lg flex flex-row items-center gap-4 relative overflow-visible ${larger ? "max-w-[870px] min-w-[870px]" : "max-w-[430px] min-w-[430px]"} ${BgActive ? "bg-black/20" : ""}`} showOverflow={true}>
            {Icon && <Icon size={24} />}
            {image && <img src={image} className="h-6 object-cover" />}
            <div className="text-xl">{text}</div>
            {extraInfo && isFocused && <div style={{ left: "calc(100% + 30px)" }} className="absolute">
                <div className="fixed top-35 flex flex-col justify-center gap-1 z-10 text-white w-[325px]">
                    {Icon && <Icon size={30} className="mb-2" />}
                    {image && <img src={image} className="h-12 mb-2 w-fit object-cover" />}
                    <div className="text-xl font-medium">{extraInfo.title}</div>
                    <div className="text-md font-medium">{extraInfo.subtitle}</div>
                    <div className="text-lg">{extraInfo.description}</div>
                </div>
            </div>}
        </ModernItemFill>
    )
}

export function ListColumn({ children, defaultFocusChild, onBack, focusId, larger }: { children: React.ReactNode, defaultFocusChild?: number, onBack?: () => void, focusId?: string, larger?: boolean }) {
    return (
        <ColumnLayout defaultFocusChild={defaultFocusChild} onBack={onBack} focusId={focusId} className={`ml-8 items-center rounded-t-xl relative h-full vertical-list-menu ${larger ? "max-w-[840px] min-w-[840px]" : "max-w-[400px] min-w-[400px]"}`}>
            <div className={"h-full flex flex-col gap-2 overflow-y-scroll py-4 " + (larger ? "w-[870px]" : "w-[430px]") + " absolute"}>
                {children}
            </div>
        </ColumnLayout>
    )
}

export function STBHeader({ title, subtitle }: { title: string, subtitle: string }) {
    const clock = useClock();
    return (
        <div className="flex flex-row items-center p-8 font-light">
            <img src={logo} className="h-12 object-cover pr-5" />
            <div>
                <div className="text-4xl stbkit-color-text">{title}</div>
                <div className="text-lg stbkit-color-text">{subtitle}</div>
            </div>
            <div className="flex-1" />
            {/* <div className="text-3xl stbkit-color-text fixed right-[50%] translate-x-1/2 font-medium">{OnTVConfig.serviceInfo.name}</div> */}
            <div className="text-3xl stbkit-color-text pr-4">{clock.toLocaleTimeString()}</div>
        </div>
    )
}

export function STBRootLayout({ children, onBack, className }: { children: React.ReactNode, onBack?: () => void, className?: string }) {
    return (
        <ModernRootLayout onBack={onBack} bgClassName={"stbkit-background-flat main-layout " + className} className="main-layout">
            {children}
        </ModernRootLayout>
    )
}