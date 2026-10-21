"use strict";

/**
 * CEPHALON GHOST — Native Electron Entry (CG-STANDALONE-001)
 * Native window over http://127.0.0.1:4760.
 * Checks if 127.0.0.1:4760 is already listening; if not, spawns console-server.js
 * via spawnSafe, waits for readiness, opens BrowserWindow, and kills the child on quit.
 */

const { app, BrowserWindow } = require("electron");
const http = require("http");
const path = require("path");
const { spawnSafe } = require("../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js");

const CG_URL = "http://127.0.0.1:4760";
const REPO_ROOT = path.resolve(__dirname, "..");

let mainWindow = null;
let serverReady = false;
let serverChild = null;

function isServerListening() {
  return new Promise((resolve) => {
    const req = http.get(CG_URL, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on("error", () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function spawnServer() {
  serverChild = spawnSafe("node", [path.join(__dirname, "console-server.js")], {
    cwd: REPO_ROOT,
    timeoutMs: 0,
  });
  serverChild.stdout.on("data", (d) => {
    console.log("[cg-server]", String(d).trim());
  });
  serverChild.stderr.on("data", (d) => {
    console.error("[cg-server][stderr]", String(d).trim());
  });
  serverChild.on("error", (err) => {
    console.error("[CEPHALON GHOST] server spawn error:", err.message);
    serverChild = null;
  });
  serverChild.on("exit", () => {
    serverChild = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });
}

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
    width: 1280,
    height: 840,
    minWidth: 940,
    minHeight: 620,
    backgroundColor: "#0d0b14",
    title: "CEPHALON GHOST",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(CG_URL);

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("[CEPHALON GHOST] Failed to load:", errorCode, errorDescription);
    if (!serverReady) {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.loadURL(CG_URL);
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

function waitForServer(retries = 30, interval = 400) {
  return new Promise((resolve, reject) => {
    const check = async (attempt) => {
      if (await isServerListening()) return resolve();
      if (attempt >= retries) return reject(new Error("CG server did not become ready in time"));
      setTimeout(() => check(attempt + 1), interval);
    };
    check(0);
  });
}

app.whenReady().then(async () => {
  try {
    const alreadyUp = await isServerListening();
    if (!alreadyUp) {
      killServerChild();
      spawnServer();
      await waitForServer();
    }
    createWindow();
  } catch (e) {
    console.error("[CEPHALON GHOST] Server not ready, creating window anyway:", e.message);
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
