"use strict";

/**
 * LAUNCH CG — one-command native launcher for CEPHALON GHOST (CG-STANDALONE-001)
 * Follows WASH/launch-hub.js (REPAIR-001 detached visible window):
 * Spawns WASH/node_modules/electron/dist/electron.exe with ["CG/electron-main.js"]
 * from repo root, waits for http://127.0.0.1:4760 to respond 200, and exits 0.
 */

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const CG_URL = "http://127.0.0.1:4760";
const REPO_ROOT = path.resolve(__dirname, "..");
const ELECTRON_EXE = path.join(REPO_ROOT, "WASH", "node_modules", "electron", "dist", "electron.exe");

function serverLive() {
  return new Promise((resolve) => {
    const req = http.get(CG_URL, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForServer(retries = 25, interval = 400) {
  return new Promise((resolve) => {
    const check = async (attempt) => {
      if (await serverLive()) return resolve(true);
      if (attempt >= retries) return resolve(false);
      setTimeout(() => check(attempt + 1), interval);
    };
    check(0);
  });
}

async function main() {
  console.log("[LAUNCH CG]");

  const wasLive = await serverLive();
  console.log(
    wasLive
      ? "[LAUNCH CG] server already live on 127.0.0.1:4760 (reusing)"
      : "[LAUNCH CG] server down — native window will bring it up"
  );

  if (!fs.existsSync(ELECTRON_EXE)) {
    console.error("[LAUNCH CG] electron binary missing at:", ELECTRON_EXE);
    process.exit(1);
  }

  const child = spawn(ELECTRON_EXE, [path.join("CG", "electron-main.js")], {
    cwd: REPO_ROOT,
    detached: true,
    windowsHide: false,
    stdio: "ignore",
  });
  child.on("error", (err) => {
    console.error("[LAUNCH CG] electron spawn error:", err.message);
    process.exit(1);
  });
  child.unref();
  console.log(`[LAUNCH CG] native window spawned (pid ${child.pid})`);

  if (!wasLive) {
    const up = await waitForServer();
    console.log(
      up
        ? "[LAUNCH CG] server reachable on 127.0.0.1:4760"
        : "[LAUNCH CG] WARNING: server not reachable yet (check the window)"
    );
  }

  process.exit(0);
}

main();
