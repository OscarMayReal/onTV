import { ModernRootLayout } from "./components/stbkit/modern";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "./main";

export default function HDMIViewer() {
    const { view, setView, config } = useContext(GlobalContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    useEffect(() => {
        if (!videoRef.current || !config) return;
        console.log(view.split("?")[1].split("=")[1]);
        console.log(config.sources.options["hdmi" + view.split("?")[1].split("=")[1]].groupId);
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: {
                    exact: config.sources.options["hdmi" + view.split("?")[1].split("=")[1]].videoDeviceId,
                },
                width: 1920,
                height: 1080,
                frameRate: {
                    ideal: 60,
                    max: 60,
                    min: 60
                },
                facingMode: "external",
            },
            audio: {
                deviceId: {
                    exact: config.sources.options["hdmi" + view.split("?")[1].split("=")[1]].audioDeviceId
                },
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
            }
        }).then((stream) => {
            const track = stream.getVideoTracks()[0];
            track.applyConstraints({
                advanced: [
                    {
                        brightness: 0.5,
                        contrast: 0.5,
                        saturation: 0.5,
                        sharpness: 0.5,
                        noiseReduction: 0.5
                    }
                ]
            });
            stream.removeTrack(stream.getVideoTracks()[0]);
            stream.addTrack(track);
            setStream(stream);
            videoRef.current.srcObject = stream;
        });
    }, [view]);
    return (
        <ModernRootLayout onBack={() => {
            // stream?.getTracks().forEach((track) => {
            //     stream?.removeTrack(track);
            // });
            setView("home");
        }}>
            <video ref={videoRef} autoPlay className="w-[100dvw] h-[100dvh] min-w-[100dvw] min-h-[100dvh] max-w-[100dvw] max-h-[100dvh] object-contain"></video>
        </ModernRootLayout>
    )
}
