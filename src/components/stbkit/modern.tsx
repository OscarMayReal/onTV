import { FocusNode, FocusRoot } from "@please/lrud";
import type { JSX } from "react";
import { ColumnLayout, GridLayout, RowLayout } from ".";

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

const keyboardKeys = [
    [{ key: "q", value: "q" }, { key: "w", value: "w" }, { key: "e", value: "e" }, { key: "r", value: "r" }, { key: "t", value: "t" }, { key: "y", value: "y" }, { key: "u", value: "u" }, { key: "i", value: "i" }, { key: "o", value: "o" }, { key: "p", value: "p" }],
    [{ key: "a", value: "a" }, { key: "s", value: "s" }, { key: "d", value: "d" }, { key: "f", value: "f" }, { key: "g", value: "g" }, { key: "h", value: "h" }, { key: "j", value: "j" }, { key: "k", value: "k" }, { key: "l", value: "l" }, { key: ";", value: ";" }],
    [{ key: "z", value: "z" }, { key: "x", value: "x" }, { key: "c", value: "c" }, { key: "v", value: "v" }, { key: "b", value: "b" }, { key: "n", value: "n" }, { key: "m", value: "m" }, { key: ",", value: "," }, { key: ".", value: "." }, { key: "/", value: "/" }],
    [{ key: " ", value: " " }]
]

export function Keyboard({ value, setValue }: { value: string, setValue: (value: string) => void }) {
    return (
        <GridLayout>
            {keyboardKeys.map((row, index) => <RowLayout>
                {row.map((key) => <ColumnLayout>
                    <ModernItemFillScale onSelected={() => setValue(value + key.value)} className="w-[50px] h-[50px] flex items-center justify-center text-2xl font-medium rounded-full">{key.key}</ModernItemFillScale>
                </ColumnLayout>)}
            </RowLayout>)}
        </GridLayout>
    );
}
