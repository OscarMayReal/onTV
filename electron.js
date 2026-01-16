import { app, BrowserWindow, globalShortcut, screen } from 'electron';
import { fork, spawn } from 'child_process';

var appwindow;
// var server = fork('server.js');
var server = spawn('npm', ['run', 'dev']);

server.on('message', (message) => {
    var json = JSON.parse(message);
    if (json.type === 'launchapp') {
        console.log(json);
        launchApp(json);
    }
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
    let primaryDisplay = screen.getPrimaryDisplay()
    console.log(primaryDisplay);
    let screenDimention = primaryDisplay.workAreaSize
    let width = screenDimention.width
    let height = screenDimention.height

    let scaleFactor = 1 / (1280 / width);
    // appwindow.webContents.zoomFactor = scaleFactor;
    appwindow.webContents.setZoomLevel(scaleFactor);
    appwindow.webContents.setUserAgent(json.useragent);
    appwindow.loadURL(json.url);
}

function createWindow() {
    var mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    let primaryDisplay = screen.getPrimaryDisplay()
    console.log(primaryDisplay);
    let screenDimention = primaryDisplay.workAreaSize
    let width = screenDimention.width
    let height = screenDimention.height

    let scaleFactor = 1 / (1280 / width);
    // mainWindow.webContents.zoomFactor = scaleFactor;
    mainWindow.webContents.setZoomLevel(scaleFactor);
    mainWindow.loadURL('http://localhost:5173/');
}

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+esc', () => {
        appwindow.close();
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