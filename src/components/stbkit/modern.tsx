import { FocusNode, FocusRoot } from "@please/lrud";
import type { JSX } from "react";

export function ModernItem({ children, className, onSelected, onFocused, ref, onBlur }: { children: React.ReactNode, className?: string, onSelected?: () => void, onFocused?: () => void, ref?: React.RefObject<HTMLDivElement>, onBlur?: () => void }) {
    return (
        <FocusNode onFocused={onFocused} className={"flex flex-col stbkit-selectionstyle-scale bg-white text-neutral-900 text-2xl overflow-hidden " + (className ?? "")} onSelected={onSelected} ref={ref} onBlurred={onBlur}>
            {children}
        </FocusNode>
    );
}

export function ModernItemFill({ children, className, onSelected, onFocused, ref, onBlur }: { children: React.ReactNode, className?: string, onSelected?: () => void, onFocused?: () => void, ref?: React.RefObject<HTMLDivElement>, onBlur?: () => void }) {
    return (
        <FocusNode onFocused={onFocused} className={"flex flex-col stbkit-selectionstyle-fill-modern overflow-hidden " + (className ?? "")} onSelected={onSelected} ref={ref} onBlurred={onBlur}>
            {children}
        </FocusNode>
    );
}

export function ModernItemFillScale({ children, className, onSelected, onFocused, ref, onBlur }: { children: React.ReactNode, className?: string, onSelected?: () => void, onFocused?: () => void, ref?: React.RefObject<HTMLDivElement>, onBlur?: () => void }) {
    return (
        <FocusNode onFocused={onFocused} className={"flex flex-col stbkit-selectionstyle-fill-modern stbkit-selectionstyle-scale overflow-hidden " + (className ?? "")} onSelected={onSelected} ref={ref} onBlurred={onBlur}>
            {children}
        </FocusNode>
    );
}

export function ModernRootLayout({ children, className, ref }: { children: React.ReactNode, className?: string, ref?: React.RefObject<HTMLDivElement> }) {
    return (
        <div className="h-[100dvh] w-[100dvw] bg-neutral-900 fixed top-0 left-0 h-[100dvh] w-[100dvw]"><FocusRoot>
            <FocusNode orientation="vertical" className={"flex flex-col " + (className ?? "")} ref={ref}>
                {children}
            </FocusNode>
        </FocusRoot></div>
    )
}

export function ModernIconButton({ Icon, className, onSelected, onFocused, onBlur }: { Icon: JSX.ElementType, className?: string, onSelected?: () => void, onFocused?: () => void, onBlur?: () => void }) {
    return (
        <FocusNode onFocused={onFocused} className={"p-3 stbkit-selectionstyle-fill-modern rounded-full " + (className ?? "")} onSelected={onSelected} onBlurred={onBlur}>
            <Icon size={25} />
        </FocusNode>
    );
}

export function ModernListButton({ Icon, Text, className, onSelected, onFocused, shouldScale, onBlur }: { Icon: JSX.ElementType, Text: string, className?: string, onSelected?: () => void, onFocused?: () => void, shouldScale?: boolean, onBlur?: () => void }) {
    if (shouldScale) {
        return (
            <ModernItemFillScale className={"rounded-lg p-6 flex flex-row items-center gap-4" + (className ?? "")} onSelected={onSelected} onFocused={onFocused} onBlurred={onBlur}>
                <Icon size={25} />
                <div className="text-2xl font-medium stbkit-color-text">{Text}</div>
            </ModernItemFillScale>
        )
    }
    return (
        <ModernItemFill className={"rounded-lg p-6 flex flex-row items-center gap-4" + (className ?? "")} onSelected={onSelected} onFocused={onFocused}>
            <Icon size={25} />
            <div className="text-2xl font-medium stbkit-color-text">{Text}</div>
        </ModernItemFill>
    );
}