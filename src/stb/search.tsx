import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { RowLayout } from "../components/stbkit";
import { CheckIcon, FolderIcon, SearchIcon, Tv2Icon, TvIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../main";
import { FocusNode } from "@please/lrud";
import { Keyboard } from "../components/stbkit/modern";

export default function Recordings() {
    const { view, setView } = useContext(GlobalContext);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
    const [items, setItems] = useState<{ loaded: boolean, data: any[] }>({ loaded: false, data: [] });
    const [text, setText] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!text || isKeyboardOpen) return;
        window.JWSearch(text).then(res => {
            console.log(res)
            setItems({ loaded: true, data: res })
        })
    }, [text, isKeyboardOpen])
    useEffect(() => {
        setItems({ loaded: false, data: [] })
    }, [text])
    return (
        <STBRootLayout onBack={() => { setView("home") }}>
            <STBHeader title="Search" subtitle="Search for content" />
            <RowLayout className="flex-1">
                <ListColumn focusId="list_0" larger>
                    <FocusNode onFocused={() => {
                        setIsKeyboardOpen(true)
                        searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }} ref={searchRef} onBlurred={() => setIsKeyboardOpen(false)}>
                        <div className={`text-3xl stbkit-color-text mx-8 p-4 mb-3 mt-1 border-white/20 border-2 text-white/50 ${isKeyboardOpen ? "bg-white/20" : ""} rounded-lg`}>{text ? <p className={`w-fit ${isKeyboardOpen ? "border-r-2" : ""} ${text.endsWith(" ") ? "pr-2" : ""}`}>{text}</p> : <p className="opacity-50">Search for content</p>}</div>
                        <Keyboard overlay value={text} setValue={setText} />
                    </FocusNode>
                    <FocusNode className="w-[870px]" orientation="vertical">
                        {items.loaded && <FocusNode orientation="vertical">{items.data.map((item, index) => (
                            <MenuListItem key={index} text={item.Metadata.title} Icon={TvIcon} larger extraInfo={{
                                title: item.Metadata.title,
                                subtitle: item.Metadata.year + " • " + item.Metadata.type,
                            }} />
                        ))}</FocusNode>}
                    </FocusNode>
                </ListColumn>
            </RowLayout>
        </STBRootLayout>
    );
}