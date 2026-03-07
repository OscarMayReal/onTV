import { networkInterfaces } from 'node:os';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';

export interface StreamStartOptions {
    targetIp?: string;
    port?: number;
    videoDevice?: string;
    audioDevice?: string;
    framerate?: number;
    videoSize?: string;
    videoBitrate?: string;
    audioBitrate?: string;
}

export interface StreamClientOptions {
    apiBase: string;
    defaultPort?: number;
}

export interface VideoDevice {
    path: string;
    index: number;
}

export interface StreamStatus {
    isStreaming: boolean;
}

export class StreamClient {
    private readonly apiBase: string;
    private readonly defaultPort: number;
    private ffplayProcess: ChildProcessWithoutNullStreams | null = null;

    constructor(options: StreamClientOptions) {
        this.apiBase = options.apiBase.replace(/\/$/, '');
        this.defaultPort = options.defaultPort ?? 9080;
    }

    async listDevices(): Promise<VideoDevice[]> {
        return this.apiRequest<VideoDevice[]>('/devices');
    }

    async getStatus(): Promise<StreamStatus> {
        return this.apiRequest<StreamStatus>('/status');
    }

    async startStreaming(options: StreamStartOptions = {}): Promise<void> {
        const payload = {
            targetIp: options.targetIp ?? getLocalIPv4(),
            port: options.port ?? this.defaultPort,
            videoDevice: options.videoDevice,
            audioDevice: options.audioDevice,
            framerate: options.framerate,
            videoSize: options.videoSize,
            videoBitrate: options.videoBitrate,
            audioBitrate: options.audioBitrate,
        };

        await this.apiRequest('/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    }

    async stopStreaming(): Promise<void> {
        await this.apiRequest('/stop', { method: 'POST' });
    }

    startPlayer(port = this.defaultPort): void {
        if (this.ffplayProcess && !this.ffplayProcess.killed) {
            return;
        }

        const inputUrl = `udp://0.0.0.0:${port}?fifo_size=1000000&overrun_nonfatal=1`;
        const ffplayArgs = [
            '-fflags',
            'nobuffer',
            '-flags',
            'low_delay',
            '-framedrop',
            '-probesize',
            '32',
            '-analyzeduration',
            '0',
            '-fs',
            '-sync',
            'video',
            inputUrl,
        ];

        this.ffplayProcess = spawn('ffplay', ffplayArgs, { stdio: 'inherit' });
        this.ffplayProcess.on('close', () => {
            this.ffplayProcess = null;
        });
    }

    stopPlayer(): void {
        if (!this.ffplayProcess || this.ffplayProcess.killed) {
            return;
        }
        this.ffplayProcess.kill('SIGTERM');
    }

    isPlayerRunning(): boolean {
        return Boolean(this.ffplayProcess && !this.ffplayProcess.killed && this.ffplayProcess.exitCode === null);
    }

    async startAndPlay(options: StreamStartOptions = {}): Promise<void> {
        const port = options.port ?? this.defaultPort;
        await this.startStreaming({ ...options, port });
        this.startPlayer(port);
    }

    async stopAndClosePlayer(): Promise<void> {
        this.stopPlayer();
        await this.stopStreaming();
    }

    private async apiRequest<T = unknown>(path: string, init?: RequestInit): Promise<T> {
        const response = await fetch(`${this.apiBase}${path}`, init);
        const text = await response.text();

        let payload: unknown = null;
        if (text.length > 0) {
            try {
                payload = JSON.parse(text);
            } catch {
                payload = text;
            }
        }

        if (!response.ok) {
            const message =
                payload && typeof payload === 'object' && 'error' in payload
                    ? String((payload as { error: unknown }).error)
                    : `HTTP ${response.status}`;
            throw new Error(message);
        }

        return payload as T;
    }
}

export function getLocalIPv4(): string {
    const nets = networkInterfaces();

    for (const iface of Object.values(nets)) {
        if (!iface) {
            continue;
        }

        for (const addr of iface) {
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }

    throw new Error('Could not detect local IPv4 address. Pass targetIp explicitly.');
}