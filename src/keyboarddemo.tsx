import { ModernRootLayout, Keyboard } from "./components/stbkit/modern";
import { FocusNode } from "@please/lrud";
import { useState } from "react";

export default function KeyboardDemo() {
    const [value, setValue] = useState("");
    return (
        <ModernRootLayout>
            <FocusNode>
                <div>value: {value}</div>
                <Keyboard value={value} setValue={setValue} />
            </FocusNode>
        </ModernRootLayout>
    )
}