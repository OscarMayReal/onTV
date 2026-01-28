import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckIcon, KeyboardIcon, XIcon } from "lucide-react";
import { RootLayout, RowLayout } from "../components/stbkit";
import { Keyboard, ModernRootLayout } from "../components/stbkit/modern";
import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { useState } from "react";
import { FocusNode } from "@please/lrud";

const steps = {
    welcome: {
        title: "Welcome To OnTV",
        subtitle: "Set Up Your OnTV Box",
    },
    hasExistingSystem: {
        title: "Add To Existing System",
        subtitle: "Step 1",
    },
    createNewSystem: {
        title: "Create New System",
        subtitle: "Step 1",
    },
}

export function Setup() {
    const [step, setStep] = useState("welcome");
    return (
        <STBRootLayout>
            <STBHeader title={steps[step].title} subtitle={steps[step].subtitle} />
            <RowLayout className="flex-1">
                {step === "welcome" && <Welcome step={step} setStep={setStep} />}
                {step === "hasExistingSystem" && <HasExistingSystem step={step} setStep={setStep} />}
                {step === "createNewSystem" && <CreateNewSystem step={step} setStep={setStep} />}
            </RowLayout>
        </STBRootLayout>
    )
}

function Welcome({ step, setStep }: { step: string, setStep: (step: string) => void }) {
    return (
        <ListColumn larger>
            <div className="text-3xl stbkit-color-text pl-11 mb-1 mt-1 font-light text-white/50">Welcome to OnTV</div>
            <div className="text-xl stbkit-color-text pl-11 mb-3 mt-1 font-medium text-white/50">Do you have an existing OnTV System in your home?</div>
            <MenuListItem text="Yes" onSelected={() => { setStep("hasExistingSystem") }} Icon={CheckIcon} extraInfo={{ title: "Yes", subtitle: "Existing System", description: "Add this box to an existing OnTV System" }} larger />
            <MenuListItem text="No" onSelected={() => { setStep("createNewSystem") }} Icon={XIcon} extraInfo={{ title: "No", subtitle: "New System", description: "Setup a new OnTV System" }} larger />
        </ListColumn>
    )
}

function HasExistingSystem({ step, setStep }: { step: string, setStep: (step: string) => void }) {
    return (
        <ListColumn larger>
            <div className="text-3xl stbkit-color-text pl-11 mb-1 mt-1 font-light text-white/50">Add to Existing System</div>
            <div className="text-xl stbkit-color-text pl-11 mb-3 mt-1 font-medium text-white/50">Setup Steps</div>
            <ol className="list-decimal pl-16">
                <li className="text-lg stbkit-color-text pl-5 mb-3 mt-1 font-medium text-white/50">On the primary box, navigate to Settings</li>
                <li className="text-lg stbkit-color-text pl-5 mb-3 mt-1 font-medium text-white/50">Select System</li>
                <li className="text-lg stbkit-color-text pl-5 mb-3 mt-1 font-medium text-white/50">Select Add Device</li>
            </ol>
            <MenuListItem text="Next" Icon={ArrowRightCircleIcon} onSelected={() => { setStep("hasExistingSystem") }} extraInfo={{ title: "Next", subtitle: "Next Step", description: "Go to the next step" }} larger />
            <MenuListItem text="Back" Icon={ArrowLeftCircleIcon} onSelected={() => { setStep("welcome") }} extraInfo={{ title: "Back", subtitle: "Previous Step", description: "Go to the previous step" }} larger />
        </ListColumn>
    )
}

function CreateNewSystem({ step, setStep }: { step: string, setStep: (step: string) => void }) {
    const [name, setName] = useState("");
    return (
        <ListColumn larger>
            <div className="text-3xl stbkit-color-text pl-11 mb-1 mt-1 font-light text-white/50">Name Your System</div>
            <div className="text-xl stbkit-color-text pl-11 mb-3 mt-1 font-medium text-white/50">Giving your OnTV system a name will help you identify it</div>
            <TextInputDialog text={name} setText={setName} title="Name Your System" subtitle="Enter System Name" placeholder="Enter System Name">
                <MenuListItem text={name} Icon={KeyboardIcon} extraInfo={{ title: "Name", subtitle: "System Name", description: "Open the keyboard to name your system" }} larger />
            </TextInputDialog>
            <MenuListItem text="Next" Icon={ArrowRightCircleIcon} onSelected={() => { setStep("hasExistingSystem") }} extraInfo={{ title: "Next", subtitle: "Next Step", description: "Go to the next step" }} larger />
            <MenuListItem text="Back" Icon={ArrowLeftCircleIcon} onSelected={() => { setStep("welcome") }} extraInfo={{ title: "Back", subtitle: "Previous Step", description: "Go to the previous step" }} larger />
        </ListColumn>
    )
}

function TextInputDialog({ text, setText, title, subtitle, children, placeholder }: { text: string, setText: (text: string) => void, title: string, subtitle: string, children: React.ReactNode, placeholder: string }) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    return (
        <>
            <FocusNode onSelected={() => setIsPickerOpen(true)}>
                {children}
            </FocusNode>
            {isPickerOpen && <FocusNode onMountAssignFocusTo="list_0" className="w-[100dvw] h-[100dvh] min-w-[100dvw] min-h-[100dvh] max-w-[100dvw] max-h-[100dvh] fixed top-0 left-0 z-50 flex flex-col bg-[#145D48]" isTrap onBack={() => setIsPickerOpen(false)}>
                <STBHeader title={title} subtitle={subtitle} />
                <ListColumn focusId="list_0" larger>
                    <FocusNode onFocused={() => setIsKeyboardOpen(true)} onBlurred={() => setIsKeyboardOpen(false)}>
                        <div className={`text-3xl stbkit-color-text mx-8 p-4 mb-3 mt-1 border-white/20 border-2 text-white/50 ${isKeyboardOpen ? "bg-white/20" : ""} rounded-lg`}>{text ? <p className={`w-fit ${isKeyboardOpen ? "border-r-2" : ""} ${text.endsWith(" ") ? "pr-2" : ""}`}>{text}</p> : <p className="opacity-50">{placeholder}</p>}</div>
                        <Keyboard overlay value={text} setValue={setText} />
                    </FocusNode>
                    <MenuListItem text="Done" Icon={CheckIcon} onSelected={() => { setIsPickerOpen(false) }} extraInfo={{ title: "Done", subtitle: "Done", description: "Done" }} larger />
                </ListColumn>
            </FocusNode>}
        </>
    )
}