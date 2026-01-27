const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launchApp', (app) => {
    if (!app.userAgent) {
        app.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
    }
    ipcRenderer.send('launchapp', app);
})