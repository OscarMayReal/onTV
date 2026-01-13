import { ModernRootLayout, Keyboard } from "./components/stbkit/modern";
import { FocusNode } from "@please/lrud";
import { useContext, useState } from "react";
import { GlobalContext } from "./main";

export default function KeyboardDemo() {
    const { setView } = useContext(GlobalContext);
    const [value, setValue] = useState("");
    return (
        <ModernRootLayout>
            <FocusNode onBack={() => { if (value.length > 0) { setValue(value.slice(0, -1)) } else { setView("home") } }}>
                <div>value: {value}</div>
                <Keyboard value={value} setValue={setValue} />
            </FocusNode>
        </ModernRootLayout>
    )
}