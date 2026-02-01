import { app, BrowserWindow, globalShortcut, screen, ipcMain } from 'electron';
import { fork, spawn } from 'child_process';
import path from 'path';

var appwindow;
var mainWindow;
var goingToUrl;
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

ipcMain.handle("tvguide:fetch", async (event, opts = {}) => {
    const {
        nid = 64257,
        start = Math.floor(Date.now() / 1000),
    } = opts;

    const url = new URL("https://www.freeview.co.uk/api/tv-guide");
    url.searchParams.set("nid", String(nid));
    url.searchParams.set("start", String(start));

    const res = await fetch(url.toString(), {
        headers: {
            "accept": "application/json",
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Freeview API failed (${res.status}): ${text}`);
    }

    return res.json();
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
    appwindow.on('close', () => {
        mainWindow.show();
    });
    appwindow.on('closed', () => {
        mainWindow.show();
    })
    appwindow.webContents.on('did-start-navigation', (event, url) => {
        var localscaleFactor = 1 / (1280 / appwindow.getSize()[0]);
        appwindow.webContents.setZoomFactor(localscaleFactor);
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