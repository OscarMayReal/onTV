import { FocusNode, FocusRoot } from "@please/lrud";
import type { JSX } from "react";

export function ModernItem({ children, className, onSelected }: { children: React.ReactNode, className?: string, onSelected?: () => void }) {
    return (
        <FocusNode className={"flex flex-col stbkit-selectionstyle-scale bg-white text-neutral-900 text-2xl overflow-hidden" + (className ?? "")} onSelected={onSelected}>
            {children}
        </FocusNode>
    );
}

export function ModernItemFill({ children, className, onSelected }: { children: React.ReactNode, className?: string, onSelected?: () => void }) {
    return (
        <FocusNode className={"flex flex-col stbkit-selectionstyle-fill-modern overflow-hidden" + (className ?? "")} onSelected={onSelected}>
            {children}
        </FocusNode>
    );
}

export function ModernRootLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className="h-[100dvh] w-[100dvw] bg-neutral-900"><FocusRoot>
            <FocusNode orientation="vertical" className={"flex flex-col " + (className ?? "")}>
                {children}
            </FocusNode>
        </FocusRoot></div>
    )
}

export function ModernIconButton({ Icon, className, onSelected }: { Icon: JSX.ElementType, className?: string, onSelected?: () => void }) {
    return (
        <FocusNode className={"p-3 stbkit-selectionstyle-fill-modern rounded-full" + (className ?? "")} onSelected={onSelected}>
            <Icon size={25} />
        </FocusNode>
    );
}