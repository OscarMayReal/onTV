import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { promises as fs } from 'node:fs';

export interface VideoDevice {
    path: string;
    index: number;
}

export interface StartStreamOptions {
    targetIp: string;
    port?: number;
    videoDevice?: string;
    audioDevice?: string;
    framerate?: number;
    videoSize?: string;
    videoBitrate?: string;
    audioBitrate?: string;
}

let ffmpegProcess: ChildProcessWithoutNullStreams | null = null;

function assertNoRunningStream(): void {
    if (ffmpegProcess && !ffmpegProcess.killed) {
        throw new Error('A stream is already running. Stop it before starting a new one.');
    }
}

function assertValidTargetIp(ip: string): void {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    if (!ipv4.test(ip)) {
        throw new Error(`Invalid IPv4 address: ${ip}`);
    }
}

function requireRunningStream(): ChildProcessWithoutNullStreams {
    if (!ffmpegProcess || ffmpegProcess.killed) {
        throw new Error('No active stream to stop.');
    }
    return ffmpegProcess;
}

export async function listVideoDevices(): Promise<VideoDevice[]> {
    const entries = await fs.readdir('/dev');

    return entries
        .filter((name) => /^video\d+$/.test(name))
        .map((name) => ({
            path: `/dev/${name}`,
            index: Number.parseInt(name.replace('video', ''), 10),
        }))
        .sort((a, b) => a.index - b.index);
}

export function startStreaming(options: StartStreamOptions): void {
    assertNoRunningStream();
    assertValidTargetIp(options.targetIp);

    const {
        targetIp,
        port = 9080,
        videoDevice = '/dev/video0',
        audioDevice = 'plughw:2,0',
        framerate = 18,
        videoSize = '1280x720',
        videoBitrate = '2400k',
        audioBitrate = '128k',
    } = options;

    const outputUrl = `udp://${targetIp}:${port}?pkt_size=1316`;

    const args = [
        '-hide_banner',
        '-f',
        'v4l2',
        '-thread_queue_size',
        '256',
        '-input_format',
        'mjpeg',
        '-framerate',
        String(framerate),
        '-video_size',
        videoSize,
        '-i',
        videoDevice,
        '-f',
        'alsa',
        '-thread_queue_size',
        '512',
        '-ac',
        '1',
        '-ar',
        '48000',
        '-i',
        audioDevice,
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-tune',
        'zerolatency',
        '-x264-params',
        'bframes=0:ref=1:scenecut=0:rc-lookahead=0:sync-lookahead=0:sliced-threads=1',
        '-g',
        String(framerate),
        '-keyint_min',
        String(framerate),
        '-b:v',
        videoBitrate,
        '-maxrate',
        videoBitrate,
        '-bufsize',
        '400k',
        '-c:a',
        'aac',
        '-b:a',
        audioBitrate,
        '-ar',
        '48000',
        '-ac',
        '1',
        '-af',
        'aresample=async=1:first_pts=0',
        '-f',
        'mpegts',
        '-muxdelay',
        '0',
        '-muxpreload',
        '0',
        '-flush_packets',
        '1',
        outputUrl,
    ];

    ffmpegProcess = spawn('ffmpeg', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    ffmpegProcess.stdout.on('data', (chunk: Buffer) => {
        process.stdout.write(`[ffmpeg] ${chunk.toString()}`);
    });

    ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
        process.stderr.write(`[ffmpeg] ${chunk.toString()}`);
    });

    ffmpegProcess.on('close', () => {
        ffmpegProcess = null;
    });
}

export async function stopStreaming(timeoutMs = 3000): Promise<void> {
    const processToStop = requireRunningStream();

    await new Promise<void>((resolve, reject) => {
        let resolved = false;

        const finish = () => {
            if (!resolved) {
                resolved = true;
                resolve();
            }
        };

        const onClose = () => {
            processToStop.removeListener('error', onError);
            finish();
        };

        const onError = (error: Error) => {
            processToStop.removeListener('close', onClose);
            if (!resolved) {
                resolved = true;
                reject(error);
            }
        };

        processToStop.once('close', onClose);
        processToStop.once('error', onError);

        processToStop.kill('SIGTERM');

        setTimeout(() => {
            if (!resolved && processToStop.exitCode === null) {
                processToStop.kill('SIGKILL');
            }
        }, timeoutMs);
    });

    ffmpegProcess = null;
}

export function isStreaming(): boolean {
    return Boolean(ffmpegProcess && ffmpegProcess.exitCode === null && !ffmpegProcess.killed);
}