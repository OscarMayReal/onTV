import { FocusNode, FocusRoot, useProcessKey } from "@please/lrud";
import { useEffect, type JSX } from "react";
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

export function ModernRootLayout({ children, className, ref, onBack }: { children: React.ReactNode, className?: string, ref?: React.RefObject<HTMLDivElement>, onBack?: () => void }) {
    return (
        <div className="h-[100dvh] w-[100dvw] bg-neutral-900 fixed top-0 left-0 h-[100dvh] w-[100dvw] overflow-scroll"><FocusRoot>
            <DelKeyBack />
            <FocusNode onBack={onBack} orientation="vertical" className={"flex flex-col " + (className ?? "")} ref={ref}>
                {children}
            </FocusNode>
        </FocusRoot></div>
    )
}

function DelKeyBack() {
    const processKey = useProcessKey();
    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                processKey.back()
            }
        })
        return () => {
            window.removeEventListener("keydown", (e) => {
                if (e.key === "Backspace") {
                    processKey.back()
                }
            })
        }
    }, [processKey])
    return <></>
}

export function ModernIconButton({ Icon, className, onSelected, onFocused, onBlur }: { Icon: JSX.ElementType, className?: string, onSelected?: () => void, onFocused?: () => void, onBlur?: () => void }) {
    return (
        <FocusNode onFocused={onFocused} className={"p-3 stbkit-selectionstyle-fill-modern rounded-full " + (className ?? "")} onSelected={onSelected} onBlurred={onBlur}>
            <Icon size={25} />
        </FocusNode>
    );
}

export function ModernListButton({ Icon, Text, className, onSelected, onFocused, shouldScale, onBlur, description }: { Icon: JSX.ElementType, Text: string, className?: string, onSelected?: () => void, onFocused?: () => void, shouldScale?: boolean, onBlur?: () => void, description?: string }) {
    if (shouldScale) {
        return (
            <ModernItemFillScale className={"rounded-lg p-6 flex flex-row items-center gap-6" + (className ?? "")} onSelected={onSelected} onFocused={onFocused} onBlurred={onBlur}>
                <Icon size={25} />
                <div className="flex flex-col">
                    <div className="text-2xl font-medium stbkit-color-text">{Text}</div>
                    <div className="text-md stbkit-color-text">{description}</div>
                </div>
            </ModernItemFillScale>
        )
    }
    return (
        <ModernItemFill className={"rounded-lg p-6 flex flex-row items-center gap-6" + (className ?? "")} onSelected={onSelected} onFocused={onFocused}>
            <Icon size={25} />
            <div className="flex flex-col">
                <div className="text-2xl font-medium stbkit-color-text">{Text}</div>
                <div className="text-lg stbkit-color-text">{description}</div>
            </div>
        </ModernItemFill>
    );
}

const keyboardKeys = [
    [{ key: "1", value: "1" }, { key: "2", value: "2" }, { key: "3", value: "3" }, { key: "4", value: "4" }, { key: "5", value: "5" }, { key: "6", value: "6" }, { key: "7", value: "7" }, { key: "8", value: "8" }, { key: "9", value: "9" }, { key: "0", value: "0" }],
    [{ key: "q", value: "q" }, { key: "w", value: "w" }, { key: "e", value: "e" }, { key: "r", value: "r" }, { key: "t", value: "t" }, { key: "y", value: "y" }, { key: "u", value: "u" }, { key: "i", value: "i" }, { key: "o", value: "o" }, { key: "p", value: "p" }],
    [{ key: "a", value: "a" }, { key: "s", value: "s" }, { key: "d", value: "d" }, { key: "f", value: "f" }, { key: "g", value: "g" }, { key: "h", value: "h" }, { key: "j", value: "j" }, { key: "k", value: "k" }, { key: "l", value: "l" }, { key: ";", value: ";" }],
    [{ key: "z", value: "z" }, { key: "x", value: "x" }, { key: "c", value: "c" }, { key: "v", value: "v" }, { key: "b", value: "b" }, { key: "n", value: "n" }, { key: "m", value: "m" }, { key: ",", value: "," }, { key: ".", value: "." }, { key: "/", value: "/" }],
]

export function Keyboard({ value, setValue }: { value: string, setValue: (value: string) => void }) {
    return (
        <GridLayout className="bg-neutral-800 w-fit p-4 gap-3 rounded-2xl">
            {keyboardKeys.map((row, index) => <RowLayout className="gap-3" key={index}>
                {row.map((key, index) => <ColumnLayout key={index}>
                    <ModernItemFillScale onSelected={() => setValue(value + key.value)} className="w-[50px] h-[50px] flex items-center justify-center text-2xl font-medium rounded-md bg-neutral-700">{key.key}</ModernItemFillScale>
                </ColumnLayout>)}
            </RowLayout>)}
        </GridLayout>
    );
}
