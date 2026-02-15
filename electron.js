import { app, BrowserWindow, globalShortcut, screen, ipcMain } from 'electron';
import { fork, spawn } from 'child_process';
import path from 'path';
import JustWatch from 'justwatch-api-client'

var appwindow;
var mainWindow;
var goingToUrl;
var jw = new JustWatch(5000)

// var server = fork('server.js');
var server = spawn('npm', ['run', 'dev']);

// server.on('message', (message) => {
//     var json = JSON.parse(message);
//     if (json.type === 'launchapp') {
//         console.log(json);
//         launchApp(json);
//     }
// });

ipcMain.on('launchapp', (event, appData) => {
    launchApp(appData);
});

// ipcMain.handle("tvguide:fetch", async (event, opts = {}) => {
//     const now = new Date();

//     // Midnight LOCAL time
//     const midnightLocal = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate(),
//         0, 0, 0, 0
//     );

//     const {
//         nid = 64257,
//         start = Math.floor(midnightLocal.getTime() / 1000),
//     } = opts;

//     const url = new URL("https://www.freeview.co.uk/api/tv-guide");
//     url.searchParams.set("nid", String(nid));
//     url.searchParams.set("start", String(start));

//     console.log("Using start timestamp:", start);

//     const res = await fetch(url.toString(), {
//         headers: {
//             "accept": "application/json",
//             "user-agent": "Mozilla/5.0",
//             "referer": "https://www.freeview.co.uk/",
//         },
//     });

//     const text = await res.text();

//     console.log("Status:", res.status);
//     console.log("First 200 chars:", text.slice(0, 200));

//     if (!res.ok) {
//         throw new Error(`Freeview API failed (${res.status}): ${text}`);
//     }

//     if (!text.trim()) {
//         throw new Error("Freeview returned empty body");
//     }

//     try {
//         return JSON.parse(text);
//     } catch (err) {
//         throw new Error("Invalid JSON returned from Freeview");
//     }
// });

ipcMain.handle("tvguide:fetch", async () => {
    try {
        // Step 1: Get the index.json
        const indexRes = await fetch(
            "https://raw.githubusercontent.com/elyobelyob/freely_tv_guide/refs/heads/main/docs/index.json"
        );
        if (!indexRes.ok) throw new Error(`Failed to fetch index.json (${indexRes.status})`);
        const indexData = await indexRes.json();

        // Step 2: Grab the "start" property
        const start = indexData.start;
        if (!start) throw new Error("No start property in index.json");

        // Step 3: Fetch the guide_{start}.json
        const guideUrl = `https://raw.githubusercontent.com/elyobelyob/freely_tv_guide/refs/heads/main/docs/raw/guide_${start}.json`;
        const guideRes = await fetch(guideUrl);
        if (!guideRes.ok) throw new Error(`Failed to fetch guide JSON (${guideRes.status})`);
        const guideData = await guideRes.json();

        return guideData;
    } catch (err) {
        console.error("tvguide fetch error:", err);
        throw err;
    }
});


ipcMain.handle("jw:search", async (event, query, location = "GB") => {
    var req = await fetch(`https://discover.provider.plex.tv/library/search?query=${query}&searchProviders=discover&searchTypes=movies,tv,availabilityPlatforms&limit=30&includeElements=guid&includeDetails=1`, {
        "headers": {
            "accept": "application/json",
        }
    })

    var res = await req.json();
    return res.MediaContainer.SearchResults[0].SearchResult;
});

ipcMain.handle("jw:getproviders", async (event, path, location = "GB") => {
    var res = await jw.getDataByPath(path, location);
    console.log(res)
    return res;
});

function launchApp(json) {
    appwindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    mainWindow.hide();
    appwindow.webContents.setUserAgent(json.userAgent);
    appwindow.loadURL(json.url);
    var localscaleFactor = 1 / ((json.width || 1280) / appwindow.getSize()[0]);
    appwindow.webContents.setZoomFactor(localscaleFactor);
    appwindow.on('close', () => {
        mainWindow.show();
    });
    appwindow.on('closed', () => {
        mainWindow.show();
    })
    appwindow.webContents.on('did-start-navigation', (event, url) => {
        var localscaleFactor = 1 / ((json.width || 1280) / appwindow.getSize()[0]);
        setTimeout(() => {
            appwindow.webContents.setZoomFactor(localscaleFactor);
        }, 1000);
    })
}

function createWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            // zoomFactor: scaleFactor,
            preload: path.join(import.meta.dirname, 'preload.js'),
            // nodeIntegration: true,
            // contextIsolation: false,
            // enableRemoteModule: true,
            sandbox: false
        }
    });
    mainWindow.setMenuBarVisibility(false);
    // mainWindow.webContents.setWindowOpenHandler((details) => {
    //     mainWindow.hide();
    //     goingToUrl = details.url;
    //     return { action: 'allow', overrideBrowserWindowOptions: { fullscreen: true } };
    // });
    // mainWindow.webContents.on('did-create-window', (window) => {
    //     appwindow = window;
    //     console.log(goingToUrl);
    //     if (goingToUrl.startsWith('https://www.live.bbctvapps.co.uk/')) {
    //         console.log('BBC iPlayer');
    //         window.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36')
    //         setTimeout(() => {
    //             window.webContents.reload();
    //             console.log(window.webContents.getUserAgent());
    //         }, 100);
    //     } else if (goingToUrl.startsWith('https://www.youtube.com/')) {
    //         console.log('YouTube');
    //         window.webContents.setUserAgent('Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)')
    //         setTimeout(() => {
    //             window.webContents.reload();
    //             console.log(window.webContents.getUserAgent());
    //         }, 100);
    //     }
    //     // window.maximize();
    //     window.on('close', () => {
    //         mainWindow.show();
    //     });
    //     window.on('closed', () => {
    //         mainWindow.show();
    //     })
    //     window.webContents.on('did-start-navigation', (event, url) => {
    //         console.log(url);
    //         console.log(window.webContents.getUserAgent());
    //         var localscaleFactor = 1 / (1280 / window.getSize()[0]);
    //         window.webContents.setZoomFactor(localscaleFactor);
    //     })
    // })
    // mainWindow.maximize();
    let primaryDisplay = screen.getPrimaryDisplay()
    console.log(primaryDisplay);
    let screenDimention = primaryDisplay.workAreaSize
    let width = screenDimention.width
    let height = screenDimention.height

    mainWindow.loadURL('http://localhost:5173/');
    setTimeout(() => {
        let scaleFactor = 1 / (1280 / mainWindow.getSize()[0]);
        mainWindow.webContents.setZoomFactor(scaleFactor);
    }, 100);
    mainWindow.addListener("resize", () => {
        let width = mainWindow.getSize()[0]
        let height = mainWindow.getSize()[1]

        let scaleFactor = 1 / (1280 / width);
        mainWindow.webContents.setZoomFactor(scaleFactor);
    })
    // mainWindow.webContents.openDevTools();
    // mainWindow.webContents.executeJavaScript('localStorage.clear()');
}

app.whenReady().then(() => {
    // globalShortcut.register('CommandOrControl+esc', () => {
    //     appwindow.close();
    // });
    globalShortcut.register('Alt+H', () => {
        try {
            if (appwindow) {
                appwindow.close();
            }
        } catch (error) {
        }
        mainWindow.webContents.executeJavaScript('window.goHome()');
        // `const overlayMenu = new BrowserWindow({
        //     // fullscreen: true,
        //     transparent: true,
        //     frame: false,
        //     alwaysOnTop: true,
        //     webPreferences: {
        //         nodeIntegration: true,
        //         contextIsolation: false,
        //         enableRemoteModule: true,
        //     }
        // });
        // overlayMenu.maximize();
        // overlayMenu.loadURL('http://localhost:5173/overlaymenu.html');`
    });
    setTimeout(() => {
        createWindow();
    }, 2000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});