import { spawn } from "child_process";

const RTSP_URL_1 = "rtsp://localhost:8554/hdmi1";
const RTSP_URL_2 = "rtsp://localhost:8554/hdmi2";
const AV_DEVICE_1 = "USB Video";
const AV_DEVICE_2 = "2:none";
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;

let ffmpegProcess: ReturnType<typeof spawn> | null = null;
let ffmpegProcess2: ReturnType<typeof spawn> | null = null;

function startFFmpeg() {
    if (ffmpegProcess) {
        console.log("FFmpeg is already running. Skipping spawn.");
        return;
    }

    ffmpegProcess = spawn('ffmpeg', [
        '-f', 'avfoundation',
        '-r', '30',
        '-i', `${AV_DEVICE_1}:none`,

        '-c:v', 'h264',
        '-preset', 'ultrafast',
        '-b:v', '50k',
        '-maxrate', '5000k',
        '-bufsize', '10000k',
        '-g', '60',

        '-c:a', 'aac',
        '-b:a', '128k',

        '-rtsp_transport', 'tcp',
        '-f', 'rtsp',
        RTSP_URL_1
    ]);

    // ffmpegProcess = spawn("ffmpeg", [
    //     "-f", "avfoundation",
    //     "-framerate", `${FPS}`,
    //     // "-video_size", `${WIDTH}x${HEIGHT}`,
    //     "-i", AV_DEVICE_1,
    //     "-c:v", "libx264",
    //     "-preset", "ultrafast",
    //     "-tune", "zerolatency",
    //     // "-vf", "format=yuv420p",      
    //     "-vf", "format=yuv420p,scale=1280:720",
    //     "-f", "rtsp",
    //     "-rtsp_transport", "tcp",
    //     RTSP_URL_1
    // ]);

    // ffmpegProcess2 = spawn("ffmpeg", [
    //     "-f", "avfoundation",
    //     "-framerate", `${FPS}`,
    //     "-video_size", `${WIDTH}x${HEIGHT}`,
    //     "-i", AV_DEVICE_2,
    //     "-c:v", "libx264",
    //     "-preset", "ultrafast",
    //     "-tune", "zerolatency",
    //     "-profile:v", "baseline",
    //     "-probesize", "45M",
    //     "-analyzeduration", "45M",
    //     "-rtsp_transport", "tcp",
    //     "-f", "rtsp",
    //     RTSP_URL_2
    // ]);

    // ffmpegProcess2.stderr.on("data", (data) => console.log("[FFMPEG]", data.toString()));

    // ffmpegProcess2.on("exit", (code, signal) => {
    //     console.log(`FFmpeg exited with code ${code}, signal ${signal}`);
    //     ffmpegProcess = null;
    // });

    // ffmpegProcess2.on("error", (err) => {
    //     console.error("FFmpeg failed to start:", err);
    //     ffmpegProcess = null;
    // });

    ffmpegProcess.stderr.on("data", (data) => console.log("[FFMPEG]", data.toString()));

    ffmpegProcess.on("exit", (code, signal) => {
        console.log(`FFmpeg exited with code ${code}, signal ${signal}`);
        ffmpegProcess = null;
    });

    ffmpegProcess.on("error", (err) => {
        console.error("FFmpeg failed to start:", err);
        ffmpegProcess = null;
    });
}

function stopFFmpeg() {
    if (!ffmpegProcess) return;
    ffmpegProcess.kill("SIGINT");
    ffmpegProcess = null;
    console.log("FFmpeg stopped");
}

startFFmpeg();

process.on("SIGINT", () => {
    console.log("Shutting down...");
    stopFFmpeg();
    process.exit();
});

process.on("exit", () => {
    stopFFmpeg();
});
