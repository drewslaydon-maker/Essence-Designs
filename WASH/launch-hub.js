"use strict";

/**
 * LAUNCH GHOST HUB — one-ask launcher for the ESSENCE DESIGNS GHOST HUB
 * native window (studio standard: native over http://127.0.0.1:4749).
 * Created under LAUNCH-001 (2026-09-22); window-fix under LAUNCH-001-REPAIR
 * (2026-09-22).
 *
 * Contract:
 *  - Detects whether the hub server is already live on 127.0.0.1:4749.
 *  - If not live, the native window's own electron-main.js spawns it as its
 *    Sandtrap child and kills it on quit (proven one-command boot).
 *  - Launches the native window via the verified electron binary.
 *  - Never kills existing processes. Exit 0 after spawning — the window and
 *    its server child outlive this launcher by design.
 *
 * REPAIR-001 (why this window spawn is raw, not spawnSafe):
 *  - spawnSafe defaults windowsHide:true — the window MUST be visible.
 *  - spawnSafe pipes die on this launcher's exit (Windows) — the window
 *    must live detached (own process group) and unref'd.
 *  - stdio "ignore" inherits NO terminal at all (Sandtrap spirit); the
 *    launcher exits promptly so there is nothing to relay.
 *  - Kill-point = Electron's own app lifecycle (window-all-closed -> quit
 *    kills the hub-server child). This launcher never kills.
 */

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const HUB_URL = "http://127.0.0.1:4749";
const WASH_DIR = __dirname;
const ELECTRON_EXE = path.join(WASH_DIR, "node_modules", "electron", "dist", "electron.exe");

function serverLive() {
  return new Promise((resolve) => {
    const req = http.get(HUB_URL, (res) => {
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

function waitForServer(retries = 20, interval = 500) {
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
  console.log("[LAUNCH GHOST HUB]");

  const wasLive = await serverLive();
  console.log(
    wasLive
      ? "[LAUNCH GHOST HUB] server already live on 127.0.0.1:4749 (reusing)"
      : "[LAUNCH GHOST HUB] server down — the native window will bring it up (electron-main spawn)"
  );

  if (!fs.existsSync(ELECTRON_EXE)) {
    console.error(
      "[LAUNCH GHOST HUB] electron binary missing — run the Wheel treatment first:\n" +
        '  node "WASH\\node_modules\\electron\\install.js"'
    );
    process.exit(1);
  }

  console.log("[LAUNCH GHOST HUB] launching native window (electron) …");
  const child = spawn(ELECTRON_EXE, ["."], {
    cwd: WASH_DIR,
    detached: true, // LAUNCH-001-REPAIR: own process group — survives this launcher's exit on Windows
    windowsHide: false, // LAUNCH-001-REPAIR: spawnSafe's default hides the window; the window MUST show
    stdio: "ignore", // LAUNCH-001-REPAIR: no terminal inherited, no pipes to die on parent exit
  });
  child.on("error", (err) => {
    console.error("[LAUNCH GHOST HUB] electron spawn error:", err.message);
    process.exit(1);
  });
  child.unref(); // LAUNCH-001-REPAIR: this launcher may exit; the window lives on
  console.log(`[LAUNCH GHOST HUB] native window spawned (pid ${child.pid})`);

  if (!wasLive) {
    const up = await waitForServer();
    console.log(
      up
        ? "[LAUNCH GHOST HUB] server reachable on 127.0.0.1:4749"
        : "[LAUNCH GHOST HUB] WARNING: server not reachable yet (check the window)"
    );
  }

  console.log("[LAUNCH GHOST HUB] done — this launcher exits. The window is Drew's.");
  process.exit(0);
}

main();