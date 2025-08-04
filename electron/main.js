const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    const agent = spawn('node', ['agent/index.js'], {
        cwd: path.join(__dirname, '..'),
        shell: true,
        stdio: 'inherit',
    });

    createWindow();
});