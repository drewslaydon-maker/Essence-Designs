"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — Electron Entry (GHOST-HUB-002 repaired)
 * Native window over http://127.0.0.1:4749 (Wheel precedent: WHEEL-NATIVE-001).
 * One-command native boot (bun run native): this main process spawns
 * hub-server.js itself as a Sandtrap child (no inherited terminal, pipes,
 * hidden window), waits for it, then opens the window. Kills the child on quit.
 */

const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawnSafe } = require("../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js");

const HUB_URL = "http://127.0.0.1:4749";
const ICON_PATH = path.join(__dirname, "icon.ico");

let mainWindow = null;
let serverReady = false;
let serverChild = null;

/** Spawn the hub server as a Sandtrap-clean child (Sandtrap law). */
function spawnServer() {
  serverChild = spawnSafe("node", ["hub-server.js"], {
    cwd: __dirname,
    timeoutMs: 0, // no timeout kill — dies with the parent
  });
  serverChild.stdout.on("data", (d) => {
    console.log("[hub-server]", String(d).trim());
  });
  serverChild.stderr.on("data", (d) => {
    console.error("[hub-server][stderr]", String(d).trim());
  });
  serverChild.on("error", (err) => {
    console.error("[GHOST HUB] server spawn error:", err.message);
    serverChild = null;
  });
}

/** Kill the server child (if alive) — called before quit. */
function killServerChild() {
  if (serverChild) {
    try {
      serverChild.kill();
    } catch (e) { /* already gone */ }
    serverChild = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: ICON_PATH,
    title: "ESSENCE DESIGNS GHOST HUB",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(HUB_URL);

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("[GHOST HUB] Failed to load:", errorCode, errorDescription);
    if (!serverReady) {
      // Retry after a short delay if server isn't ready
      setTimeout(() => {
        if (!mainWindow.isDestroyed()) mainWindow.loadURL(HUB_URL);
      }, 1000);
    }
  });

  mainWindow.webContents.on("did-finish-load", () => {
    serverReady = true;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function waitForServer(retries = 30, interval = 500) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const check = (attempt) => {
      const req = http.get(HUB_URL, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry(attempt);
        }
      });
      req.on("error", () => retry(attempt));
      req.setTimeout(1000, () => {
        req.destroy();
        retry(attempt);
      });
    };
    const retry = (attempt) => {
      if (attempt >= retries) {
        reject(new Error("Server did not become ready in time"));
      } else {
        setTimeout(() => check(attempt + 1), interval);
      }
    };
    check(0);
  });
}

app.whenReady().then(async () => {
  try {
    killServerChild(); // safety: never double-spawn
    spawnServer();
    await waitForServer();
    createWindow();
  } catch (e) {
    console.error("[GHOST HUB] Server not ready, creating window anyway:", e.message);
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    killServerChild();
    app.quit();
  }
});

app.on("before-quit", () => {
  killServerChild();
  if (mainWindow) mainWindow.destroy();
});