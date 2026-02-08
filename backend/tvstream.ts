import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const M3U_URL = "https://pastebin.com/raw/Ch0NDJSu";
const BASE_BUFFER_DIR = join(__dirname, "buffers");
const HEARTBEAT_TIMEOUT = 60_000; // stop stream if no heartbeat for 1 minute

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

interface Channel {
    name: string;
    number: string;
    streamUrl: string;
    logo?: string;
}

class ChannelStream {
    channel: Channel;
    process: ChildProcessWithoutNullStreams | null = null;
    viewers: Set<string> = new Set();
    heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();

    constructor(channel: Channel) { this.channel = channel; }

    startFFmpeg() {
        if (this.process) return; // already running

        const outDir = join(BASE_BUFFER_DIR, `channel_${this.channel.number}`);
        fs.mkdirSync(outDir, { recursive: true });
        const outPath = join(outDir, "live.m3u8");

        console.log(`[CH ${this.channel.number}] Starting ffmpeg`);
        this.process = spawn("ffmpeg", [
            "-re", // crucial to read at real-time
            "-fflags", "+genpts",
            "-i", this.channel.streamUrl,
            "-c", "copy",
            "-f", "hls",
            "-hls_time", "2",
            "-hls_list_size", "450",
            "-hls_flags", "append_list",
            outPath
        ]);

        this.process.stderr.on("data", d => console.log(`[CH ${this.channel.number}] ${d.toString()}`));
        this.process.on("close", () => console.log(`[CH ${this.channel.number}] FFmpeg stopped`));
    }

    addViewer(boxId: string) {
        this.viewers.add(boxId);
        this.startFFmpeg();
        this.resetHeartbeat(boxId);
    }

    removeViewer(boxId: string) {
        this.viewers.delete(boxId);
        this.clearHeartbeat(boxId);
        if (this.viewers.size === 0) this.stop();
    }

    resetHeartbeat(boxId: string) {
        if (this.heartbeatTimers.has(boxId)) clearTimeout(this.heartbeatTimers.get(boxId)!);
        const timer = setTimeout(() => {
            console.log(`[CH ${this.channel.number}] No heartbeat from ${boxId} - removing viewer`);
            this.removeViewer(boxId);
        }, HEARTBEAT_TIMEOUT);
        this.heartbeatTimers.set(boxId, timer);
    }

    clearHeartbeat(boxId: string) {
        if (this.heartbeatTimers.has(boxId)) {
            clearTimeout(this.heartbeatTimers.get(boxId)!);
            this.heartbeatTimers.delete(boxId);
        }
    }

    stop() {
        console.log(`[CH ${this.channel.number}] Stopping ffmpeg`);
        if (this.process) {
            this.process.kill("SIGTERM");
            this.process = null;
        }
        // clean buffer folder
        const dir = join(BASE_BUFFER_DIR, `channel_${this.channel.number}`);
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`[CH ${this.channel.number}] Cleaned buffer folder`);
        }
    }

    getStreamPath() {
        return join(BASE_BUFFER_DIR, `channel_${this.channel.number}`);
    }
}

class StreamManager {
    private channels: Channel[];
    private channelStreams: Map<string, ChannelStream> = new Map();
    private boxToChannel: Map<string, string> = new Map();

    constructor(channels: Channel[]) { this.channels = channels; }

    start(boxId: string, channelNumber: string) {
        const channel = this.channels.find(c => c.number === channelNumber);
        if (!channel) throw new Error("Channel not found");

        const currentChannel = this.boxToChannel.get(boxId);
        if (currentChannel && currentChannel !== channelNumber) this.stop(boxId);

        let stream = this.channelStreams.get(channelNumber);
        if (!stream) {
            stream = new ChannelStream(channel);
            this.channelStreams.set(channelNumber, stream);
        }

        stream.addViewer(boxId);
        this.boxToChannel.set(boxId, channelNumber);

        fs.mkdirSync(stream.getStreamPath(), { recursive: true });
        console.log(`Box ${boxId} started watching ${channelNumber} (viewers: ${stream.viewers.size})`);
    }

    stop(boxId: string) {
        const channelNumber = this.boxToChannel.get(boxId);
        if (!channelNumber) return;

        const stream = this.channelStreams.get(channelNumber);
        if (stream) stream.removeViewer(boxId);

        this.boxToChannel.delete(boxId);
        console.log(`Box ${boxId} stopped watching ${channelNumber}`);
    }

    ping(boxId: string) {
        const channelNumber = this.boxToChannel.get(boxId);
        if (!channelNumber) return;

        const stream = this.channelStreams.get(channelNumber);
        if (stream) stream.resetHeartbeat(boxId);
    }

    getBoxStatus() {
        const status: Record<string, string | null> = {};
        this.boxToChannel.forEach((channel, box) => status[box] = channel);
        return status;
    }

    getBufferedChannels() {
        const buffered: Record<string, number> = {};
        this.channelStreams.forEach((stream, number) => buffered[number] = stream.viewers.size);
        return buffered;
    }

    getStreamPath(channelNumber: string) {
        const stream = this.channelStreams.get(channelNumber);
        return stream?.getStreamPath() ?? null;
    }
}

async function loadChannels(): Promise<Channel[]> {
    const res = await fetch(M3U_URL);
    const text = await res.text();
    const channels: Channel[] = [];
    const lines = text.split("\n");
    let temp: any = null;

    for (const line of lines) {
        if (line.startsWith("#EXTINF")) {
            const nameMatch = line.split(",")[1];
            const chMatch = line.match(/tvg-chno="(.*?)"/);
            const logoMatch = line.match(/tvg-logo="(.*?)"/);
            temp = { name: nameMatch?.trim(), number: chMatch ? chMatch[1] : null, logo: logoMatch ? logoMatch[1] : undefined };
        } else if (line.startsWith("http") && temp) {
            if (temp.number) channels.push({ ...temp, streamUrl: line.trim() });
            temp = null;
        }
    }

    console.log(`Loaded ${channels.length} channels`);
    return channels;
}

async function init() {
    const channels = await loadChannels();
    const manager = new StreamManager(channels);

    app.get("/channels", (_req, res) => res.json(channels));
    app.get("/boxes", (_req, res) => res.json(manager.getBoxStatus()));
    app.get("/buffering", (_req, res) => res.json(manager.getBufferedChannels()));

    app.post("/start/:boxId/:channelNumber", (req, res) => {
        try { manager.start(req.params.boxId, req.params.channelNumber); res.json({ status: "started" }); }
        catch (e: any) { res.status(400).json({ error: e.message }); }
    });

    app.post("/stop/:boxId", (req, res) => { manager.stop(req.params.boxId); res.json({ status: "stopped" }); });
    app.post("/ping/:boxId", (_req, res) => { manager.ping(_req.params.boxId); res.json({ status: "ok" }); });

    // Serve HLS
    app.use("/stream/:channelNumber", (req, res, next) => {
        const dir = manager.getStreamPath(req.params.channelNumber);
        if (!dir || !fs.existsSync(dir)) return res.status(404).send("Channel not started");
        express.static(dir)(req, res, next);
    });

    // Minimal web viewer
    app.get("/stream/:channelNumber/webplayback", (req, res) => {
        const dir = manager.getStreamPath(req.params.channelNumber);
        if (!dir || !fs.existsSync(dir)) return res.status(404).send("Channel not started");

        res.send(`
          <!DOCTYPE html>
          <html>
          <head><title>Channel ${req.params.channelNumber}</title></head>
          <body>
            <video id="player" controls width="640" height="360"></video>
            <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
            <script>
              const video = document.getElementById('player');
              if(Hls.isSupported()){
                const hls = new Hls({ maxBufferLength:900 });
                hls.loadSource('/stream/${req.params.channelNumber}/live.m3u8');
                hls.attachMedia(video);
                hls.startLoad();
              } else if(video.canPlayType('application/vnd.apple.mpegurl')){
                video.src='/stream/${req.params.channelNumber}/live.m3u8';
              }
            </script>
          </body>
          </html>
        `);
    });

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

init();
