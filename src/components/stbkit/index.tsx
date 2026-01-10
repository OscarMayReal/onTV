import { FocusNode, FocusRoot } from "@please/lrud";
import { SearchIcon } from "lucide-react";
import { type JSX, useRef, useState, useEffect } from "react";


export function ListItem({ Text }: { Text: string }) {
    return (
        <FocusNode className="flex flex-row items-center w-full stbkit-selectionstyle-fill stbkit-list-item" orientation="horizontal">
            <div className="stbkit-list-item-text">{Text}</div>
        </FocusNode>
    );
}

export function TabsMenuRow({ children, defaultFocusChild }: { children: React.ReactNode; defaultFocusChild: number }) {
    return (
        <FocusNode defaultFocusChild={defaultFocusChild} className="flex flex-row items-center bg-emerald-100 rounded-xl p-3 gap-3 w-fit" orientation="horizontal">
            {children}
        </FocusNode>
    );
}

export function TabsMenuItem({ Icon, Text, onActive, active }: { Icon: JSX.ElementType; Text: string; onActive: () => void; active: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    setIsFocused(ref.current?.classList.contains('isFocused') ?? false);
                    if (ref.current?.classList.contains('isFocused')) {
                        onActive();
                    }
                }
            });
        });
        observer.observe(ref.current, { attributes: true });
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return (
        <FocusNode ref={ref} className={"flex flex-row items-center " + (active ? "bg-emerald-800" : "bg-emerald-100") + " rounded-md p-2 px-3 gap-3"}>
            {active ? <div className="text-emerald-100 text-3xl">{Text}</div> : null}
            <Icon size={40} className={active ? "text-emerald-100" : "text-emerald-800"} />
        </FocusNode>
    );
}

export function MenuTile() {
    return (
        <FocusNode className="border-3 border-green-100 w-[200px] flex flex-col items-center stbkit-selectionstyle-outline">
            <div className="h-[100px] bg-green-100 w-full"></div>
            <div className="h-[40px] flex flex-row items-center text-green-100 font-bold">Menu</div>
        </FocusNode>
    );
}

export function SearchBox() {
    return (
        <FocusNode className="border-3 border-green-100 h-[40px] w-[240px] flex flex-row items-center stbkit-selectionstyle-outline">
            <div className="h-[40px] w-[40px] bg-green-100 mr-2 bg-green-100 flex flex-row items-center justify-center">
                <SearchIcon className="h-[20px] w-[20px] text-green-800" />
            </div>
            <div>Search</div>
        </FocusNode>
    );
}

export function RootLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className="p-10 h-[100dvh] w-[100dvw]"><FocusRoot>
            <FocusNode orientation="vertical" className={"flex flex-col " + (className ?? "")}>
                {children}
            </FocusNode>
        </FocusRoot></div>
    )
}

export function RowLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <FocusNode orientation="horizontal" className={"flex flex-row " + (className ?? "")}>
            {children}
        </FocusNode>
    )
}

export function ColumnLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <FocusNode orientation="vertical" className={"flex flex-col " + (className ?? "")}>
            {children}
        </FocusNode>
    )
}

export function GridLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <FocusNode isGrid defaultFocusColumn={0} defaultFocusRow={0} className={"flex flex-col " + (className ?? "")}>
            {children}
        </FocusNode>
    )
}