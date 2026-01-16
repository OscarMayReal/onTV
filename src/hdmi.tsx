import { ModernRootLayout } from "./components/stbkit/modern";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "./main";

export default function HDMIViewer() {
    const { view, setView } = useContext(GlobalContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current) return;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 1920, height: 1080 }, audio: true }).then((stream) => {
            videoRef.current.srcObject = stream;
        });
    }, []);
    return (
        <ModernRootLayout onBack={() => {
            setView("home");
        }}>
            <video ref={videoRef} autoPlay className="w-[100dvw] h-[100dvh] min-w-[100dvw] min-h-[100dvh] max-w-[100dvw] max-h-[100dvh] object-contain"></video>
        </ModernRootLayout>
    )
}
