// WHEEL-NATIVE-001 — Electron main process (CommonJS).
// Loads the STATIC Vite build (dist/) in a native desktop window.
// No backend, no dev server, no browser tab, no IPC, no preload.
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_TITLE = 'Wheel of Adversity — The Apparatus';
const ICON_PATH = path.join(__dirname, 'wheel.ico');
const INDEX_PATH = path.join(__dirname, '..', 'dist', 'index.html');
const BOOT_MARKER = path.join(app.getPath('userData'), 'wheel-native-boot-ok.txt');

function createWindow() {
  const win = new BrowserWindow({
    title: APP_TITLE,
    icon: ICON_PATH,
    width: 1440,
    height: 900,
    backgroundColor: '#0a0a0a', // neutral-950 — the palette law's bed
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(INDEX_PATH);

  win.webContents.on('did-finish-load', () => {
    const title = win.webContents.getTitle();
    console.log('[WHEEL-NATIVE] did-finish-load OK — window title: ' + title);
    try {
      // Verification marker (DOER reads it, then deletes it). Non-fatal if it fails.
      fs.writeFileSync(BOOT_MARKER, title);
    } catch (_) { /* ignore */ }
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});