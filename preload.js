import { contextBridge } from 'electron'
import { createBluetooth } from 'node-ble'
import { ipcRenderer } from 'electron'
import wifi from 'node-wifi'
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