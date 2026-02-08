import { ModernItem, ModernRootLayout } from "./components/stbkit/modern";
import { RowLayout } from "./components/stbkit";
import { FocusNode } from "@please/lrud";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./main";
import React from "react";
import Hls from "hls.js";

const REWIND_SEC = 5; // seconds to rewind
const FASTFORWARD_SEC = 5; // seconds to fast-forward

export default function LiveTV() {
    const { setView } = useContext(GlobalContext);
    const [channels, setChannels] = useState<{ number: string; name: string; logo?: string }[]>([]);
    const [channelNumber, setChannelNumber] = useState("1");
    const [tempChannelNumber, setTempChannelNumber] = useState("");
    const [showChannelNumber, setShowChannelNumber] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const [loading, setLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const BOX_ID = "boxA"; // unique per client

    // Load channels
    useEffect(() => {
        fetch("http://localhost:3000/channels")
            .then(res => res.json())
            .then(data => setChannels(data));
    }, []);

    // Show overlay briefly
    useEffect(() => {
        if (!showChannelNumber) return;
        const t = setTimeout(() => setShowChannelNumber(false), 5000);
        return () => clearTimeout(t);
    }, [showChannelNumber]);

    // Heartbeat to keep stream alive
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://localhost:3000/ping/${BOX_ID}`, { method: "POST" });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Keyboard channel changing
    useEffect(() => {
        const handlePageKeys = (event: KeyboardEvent) => {
            if (event.key === "PageUp") {
                const idx = channels.findIndex(c => c.number === channelNumber);
                setChannelNumber(channels[Math.min(idx + 1, channels.length - 1)]?.number ?? channelNumber);
            } else if (event.key === "PageDown") {
                const idx = channels.findIndex(c => c.number === channelNumber);
                setChannelNumber(channels[Math.max(idx - 1, 0)]?.number ?? channelNumber);
            } else if (event.key === "Enter") {
                const video = videoRef.current;
                if (video) video.paused ? video.play() : video.pause();
            } else if (event.key === "ArrowLeft") {
                const video = videoRef.current;
                if (video) video.currentTime = Math.max(video.currentTime - REWIND_SEC, 0);
            } else if (event.key === "ArrowRight") {
                const video = videoRef.current;
                if (video) video.currentTime = Math.min(video.currentTime + FASTFORWARD_SEC, video.buffered.length ? video.buffered.end(video.buffered.length - 1) : video.duration);
            } else if (event.key == "ArrowUp") {
                setShowChannelNumber(true)
            }
        };
        window.addEventListener("keydown", handlePageKeys);
        return () => window.removeEventListener("keydown", handlePageKeys);
    }, [channels, channelNumber]);

    // Keyboard number typing
    useEffect(() => {
        const handleNumberKeys = (event: KeyboardEvent) => {
            if (/[0-9]/.test(event.key)) setTempChannelNumber(prev => prev + event.key);
        };
        window.addEventListener("keydown", handleNumberKeys);
        return () => window.removeEventListener("keydown", handleNumberKeys);
    }, []);

    // Switch if 3 digits typed
    useEffect(() => {
        if (tempChannelNumber.length === 3) {
            const ch = channels.find(c => c.number === tempChannelNumber);
            if (ch) setChannelNumber(tempChannelNumber);
            setTempChannelNumber("");
        }
    }, [tempChannelNumber, channels]);

    // Start playback
    useEffect(() => {
        if (!channelNumber || !videoRef.current) return;

        async function startChannel() {
            setLoading(true);

            // destroy previous Hls
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            // tell backend to start buffering
            try {
                await fetch(`http://localhost:3000/start/${BOX_ID}/${channelNumber}`, { method: "POST" });

                // wait a bit for ffmpeg to create initial chunks
                await new Promise(r => setTimeout(r, 15000));

                const video = videoRef.current;
                if (Hls.isSupported()) {
                    const hls = new Hls({ maxBufferLength: 900, backBufferLength: 600, liveSyncDuration: 6 });
                    hls.loadSource(`http://localhost:3000/stream/${channelNumber}/live.m3u8`);
                    hls.attachMedia(video);
                    await new Promise(resolve => {
                        var i = setInterval(() => {
                            if (hls.hasEnoughToStart) {
                                clearInterval(i)
                                resolve()
                            }
                        })
                    })
                    hls.startLoad(-1);
                    hlsRef.current = hls;

                    // check live/rewind every second
                    const interval = setInterval(() => {
                        const level = hls.levels[hls.startLevel];
                        const frags = level?.details?.fragments;
                        if (frags && frags.length > 0) {
                            const last = frags[frags.length - 1];
                            if (video.currentTime < last.start - 5) setIsLive(false);
                            else setIsLive(true);
                        }
                    }, 1000);

                    video.onpause = () => setIsLive(false);
                    video.onplay = () => setIsLive(true);

                    return () => clearInterval(interval);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = `http://localhost:3000/stream/${channelNumber}/live.m3u8`;
                    video.play();
                }
            } catch (err) {
                console.error("Error starting channel:", err);
            } finally {
                setLoading(false);
            }
        }

        startChannel();
    }, [channelNumber]);

    const goLive = () => {
        const video = videoRef.current;
        const hls = hlsRef.current;
        if (!video || !hls) return;

        const level = hls.levels[hls.startLevel];
        const frags = level?.details?.fragments;
        if (!frags || frags.length === 0) return;

        const last = frags[frags.length - 1];
        video.currentTime = last.start;
        video.play();
        setIsLive(true);
    };

    return (
        <ModernRootLayout>
            <FocusNode
                onBack={() => setView("home")}
            >
                <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
                    {loading && (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
                            Loading Stream...
                        </div>
                    )}
                    <video ref={videoRef} style={{ width: "100%", height: "100%" }} controls autoPlay />
                    {showChannelNumber && (OnTVConfig.serviceInfo.mode == "stb" ?
                        <div style={{ position: "absolute", top: 10, left: 10, width: 150, height: 50, backgroundColor: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                            {channelNumber}: {channels.find(c => c.number === channelNumber)?.name}
                        </div>
                        :
                        <div style={{ position: "absolute", top: 10, left: 10, width: 150, height: 50, backgroundColor: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                            {channelNumber}: {channels.find(c => c.number === channelNumber)?.name}
                        </div>
                    )}
                    {tempChannelNumber && (
                        <div style={{ position: "absolute", top: 10, left: 170, width: 100, height: 50, backgroundColor: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                            {tempChannelNumber}
                        </div>
                    )}
                    {!isLive && (
                        <button style={{ position: "absolute", top: 70, left: 10, zIndex: 15 }} onClick={goLive}>Go Live</button>
                    )}
                </div>
            </FocusNode>

            <FocusNode className="livetv-controls flex flex-col scroll-row">
                <div className="mb-3 pl-10 mt-10 flex flex-row items-center">
                    <div className="text-2xl text-white">Channels</div>
                </div>
                <RowLayout className="p-10 pt-0 scroll-row gap-4" defaultFocusChild={channels.findIndex(c => c.number === channelNumber) ?? 0}>
                    {channels.map((channel, index) => (
                        <ChannelItem key={index} channel={channel} setChannelNumber={setChannelNumber} />
                    ))}
                </RowLayout>
            </FocusNode>
        </ModernRootLayout>
    );
}

function ChannelItem({ channel, setChannelNumber }: { channel: { number: string; name: string; logo?: string }, setChannelNumber: (num: string) => void }) {
    const itemref = useRef<HTMLDivElement>(null);

    return (
        <ModernItem
            onSelected={() => setChannelNumber(channel.number)}
            ref={itemref}
            className="h-[175px] min-w-[175px] w-[175px] flex items-center justify-center relative"
            onFocused={() => {
                itemref.current?.parentElement?.scrollTo({ behavior: "smooth", left: itemref.current.offsetLeft - 40 });
            }}
        >
            {channel.logo && <img src={channel.logo} className="h-[100px] w-[100px] object-contain" alt={channel.name} />}
            <div className="absolute bottom-2 left-2 text-xl">{channel.number.padStart(3, "0")}</div>
        </ModernItem>
    );
}