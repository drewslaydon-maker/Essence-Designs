"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — Install helper (Wheel-consistent successor).
 * GHOST-HUB-002 Unit 4C — replaces the 001-era D3 artifact (bogus
 * `npx @electron/get` CLI call + dist/ copy step).
 *
 * Provenance: WHEEL-NATIVE-001 (2026-09-20). electron@44 has NO postinstall
 * script — the binary downloads LAZILY (index.js → install.js → @electron/get),
 * so `bun install` alone never produces node_modules/electron/dist/electron.exe.
 * The proven fix is the package's OWN installer, run via node.
 *
 * Jobs:
 *   1. Ensure WASH/package.json carries the approved native-wrapper shape.
 *   2. Run `bun install` (exit must be 0).
 *   3. If the electron binary is still missing after install, run the Wheel
 *      treatment: `node node_modules/electron/install.js`.
 *   4. Print the electron binary path + verification (Test-Path + size).
 *      Exit 0/1.
 *
 * No dist/ copy step — the native app runs from source via `electron .`.
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const APP_DIR = __dirname;
const BUN = process.env.BUN_BIN || "C:\\Users\\Andrew\\.bun\\bin\\bun.exe";
const PKG_PATH = path.join(APP_DIR, "package.json");
const ELECTRON_DIR = path.join(APP_DIR, "node_modules", "electron");
const ELECTRON_EXE = path.join(ELECTRON_DIR, "dist", "electron.exe");
const ELECTRON_INSTALL = path.join(ELECTRON_DIR, "install.js");

// Approved package.json shape (GHOST-HUB-002 Unit 4A — Wheel native wrapper).
const APPROVED_PKG = {
  name: "essence-ghost-hub",
  private: true,
  version: "0.2.0",
  main: "electron-main.js",
  scripts: {
    start: "node hub-server.js",
    native: "electron ."
  },
  trustedDependencies: ["electron"],
  devDependencies: {
    electron: "^44.4.3"
  }
};

function log(msg) {
  console.log(`[GHOST HUB INSTALL] ${msg}`);
}

function fail(msg) {
  log(`ERROR: ${msg}`);
  process.exit(1);
}

function hasApprovedShape(pkg) {
  return (
    pkg &&
    pkg.name === APPROVED_PKG.name &&
    pkg.private === true &&
    pkg.main === APPROVED_PKG.main &&
    pkg.scripts &&
    pkg.scripts.start === APPROVED_PKG.scripts.start &&
    pkg.scripts.native === APPROVED_PKG.scripts.native &&
    Array.isArray(pkg.trustedDependencies) &&
    pkg.trustedDependencies.includes("electron") &&
    pkg.devDependencies &&
    pkg.devDependencies.electron === "^44.4.3"
  );
}

function ensurePackageShape() {
  if (!fs.existsSync(PKG_PATH)) {
    log("WASH/package.json missing — writing approved shape.");
    fs.writeFileSync(PKG_PATH, JSON.stringify(APPROVED_PKG, null, 2) + "\n");
    return;
  }
  let current;
  try {
    current = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
  } catch (e) {
    fail(`WASH/package.json does not parse (${e.message}) — fix manually, do not overwrite blind.`);
  }
  if (hasApprovedShape(current)) {
    log("package.json already carries the approved shape.");
  } else {
    log("package.json deviates from the approved shape — rewriting approved shape.");
    fs.writeFileSync(PKG_PATH, JSON.stringify(APPROVED_PKG, null, 2) + "\n");
  }
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: opts.cwd || APP_DIR,
    stdio: "inherit",
    windowsHide: true,
    env: { ...process.env, ...opts.env }
  });
}

function bunInstall() {
  log("Running bun install (Wheel pattern)...");
  const r = run(BUN, ["install"]);
  if (r.error) {
    fail(`bun install could not run: ${r.error.message}`);
  }
  if (r.status !== 0) {
    fail(`bun install exited with code ${r.status}`);
  }
  log("bun install exited 0.");
}

function wheelTreatment() {
  // WHEEL-NATIVE-001 proven step: electron@44 has NO postinstall, so the binary
  // downloads lazily via the package's own install.js (index.js → install.js →
  // @electron/get). Run it with node — this is the sanctioned remedy, not an
  // improvisation.
  log("Electron binary missing after install — running the Wheel treatment (node node_modules/electron/install.js)...");
  const r = run(process.execPath, [ELECTRON_INSTALL]);
  if (r.error) {
    fail(`Wheel treatment could not run: ${r.error.message}`);
  }
  if (r.status !== 0) {
    fail(`Wheel treatment exited with code ${r.status}`);
  }
  log("Wheel treatment exited 0.");
}

function verifyBinary() {
  const present = fs.existsSync(ELECTRON_EXE);
  if (present) {
    const size = fs.statSync(ELECTRON_EXE).size;
    log(`Electron binary: ${ELECTRON_EXE}`);
    log(`Test-Path -> True · size -> ${size} bytes`);
    return 0;
  }
  log(`Electron binary MISSING: ${ELECTRON_EXE}`);
  return 1;
}

function main() {
  log("=== ESSENCE DESIGNS GHOST HUB Installer ===");
  ensurePackageShape();
  bunInstall();
  if (!fs.existsSync(ELECTRON_EXE)) {
    if (!fs.existsSync(ELECTRON_INSTALL)) {
      fail(`Electron package installer not found at ${ELECTRON_INSTALL} — STOP and report (do not improvise).`);
    }
    wheelTreatment();
  } else {
    log("Electron binary present after install — no Wheel treatment needed.");
  }
  process.exit(verifyBinary());
}

main();