import "dotenv/config"
import { contextBridge } from 'electron'
import { createBluetooth } from 'node-ble'
import { ipcRenderer } from 'electron'
import wifi from 'node-wifi'
import { exec } from 'child_process'
import { PrismaClient } from "./src/generated/prisma/client.ts";
import { PrismaPg } from '@prisma/adapter-pg'
import { create } from "domain"
import { Core, EmittedEvent } from "mdns-listener-advanced"
import { StreamClient } from "./streamClient.ts"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// import { DeviceManager } from '@ecobridge.xyz/devicemanager'

// contextBridge.exposeInMainWorld('createDeviceManager', () => {
//     const deviceManager = new DeviceManager();
//     return deviceManager;
// })

contextBridge.exposeInMainWorld('launchApp', (app) => {
    if (!app.userAgent) {
        app.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
    }
    ipcRenderer.send('launchapp', app);
})

contextBridge.exposeInMainWorld('createBluetooth', () => {
    return createBluetooth()
})

wifi.init()

contextBridge.exposeInMainWorld('wifi', wifi)

contextBridge.exposeInMainWorld("fetchTvGuide", async (opts = {}) => {
    return ipcRenderer.invoke("tvguide:fetch", opts);
});

contextBridge.exposeInMainWorld("JWSearch", async (query, location = "GB") => {
    return ipcRenderer.invoke("jw:search", query, location);
});

contextBridge.exposeInMainWorld("JWGetProviders", async (path, location = "GB") => {
    return ipcRenderer.invoke("jw:getproviders", path, location);
});

contextBridge.exposeInMainWorld("tvPower", async (state) => {
    exec(`echo "${state ? "on" : "standby"} 0" | cec-client -s -d 1`)
});

contextBridge.exposeInMainWorld("db", {
    bookmark: {
        findMany: (options) => {
            return prisma.bookmark.findMany(options)
        },
        create: async (options) => {
            var x = await prisma.bookmark.create(options)
            return x
        },
        delete: async (options) => {
            var x = await prisma.bookmark.delete(options)
            return x
        }
    }
})

contextBridge.exposeInMainWorld("createMdns", async (state) => {
    return new Core(null)
});

var hasScanned = false

contextBridge.exposeInMainWorld("scanMdns", ({ timeOut = 3000 }) => {
    return new Promise((resolve, reject) => {
        const mdns = new Core()
        const scan = mdns.listen("_OnTvStb._tcp.local")
        var items = []
        scan.on(EmittedEvent.DISCOVERY, device => {
            items.push(device)
        })
        setTimeout(() => {
            console.log("done")
            mdns.stop()
            resolve(items)
        }, timeOut)
    })
});

contextBridge.exposeInMainWorld("playStream", async (apiBase, defaultPort) => {
    const client = new StreamClient({
        apiBase: "http://192.168.1.16:3000",
        defaultPort: 9080
    })
    await client.startAndPlay({
        videoDevice: '/dev/video0',
        audioDevice: 'plughw:2,0',
        framerate: 20,
        videoSize: '1280x720',
        videoBitrate: '2400k',
        audioBitrate: '128k',
    });
    return {
        stop: () => {
            client.stopAndClosePlayer()
        }
    }
});