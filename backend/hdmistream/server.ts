import express from 'express';
import {
    listVideoDevices,
    startStreaming,
    stopStreaming,
    isStreaming,
} from './streamManager.ts';
import { Core } from "mdns-listener-advanced";
import os from 'os';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

const mdns = new Core();

mdns.publish(os.hostname() + "._OnTvStb._tcp.local", {}, 2000);

app.get('/devices', async (_req, res) => {
    try {
        const devices = await listVideoDevices();
        res.json(devices);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to list devices';
        res.status(500).json({ error: message });
    }
});

app.post('/stream', (req, res) => {
    try {
        const {
            targetIp,
            port,
            videoDevice,
            audioDevice,
            framerate,
            videoSize,
            videoBitrate,
            audioBitrate,
        } = req.body;

        startStreaming({
            targetIp,
            port,
            videoDevice,
            audioDevice,
            framerate,
            videoSize,
            videoBitrate,
            audioBitrate,
        });

        res.json({ ok: true, message: 'Stream started' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to start stream';
        res.status(400).json({ ok: false, error: message });
    }
});

app.post('/stop', async (_req, res) => {
    try {
        await stopStreaming();
        res.json({ ok: true, message: 'Stream stopped' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to stop stream';
        res.status(400).json({ ok: false, error: message });
    }
});

app.get('/status', (_req, res) => {
    res.json({ isStreaming: isStreaming() });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});