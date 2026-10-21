# WHEEL-NATIVE-001 — THE NATIVE WRAPPER (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** IN FLIGHT — STOPPED AT UNIT 1 (2026-09-20), RULING 2 ISSUED — RESUME AT UNIT 1.5
> **Drew's rulings (2026-09-20):**
> 1. **Packaging depth = (1a) minimal** — native Electron window running the static build, **no installer**.
>    - Hard condition: it must NOT run in Chrome / open a browser tab. If that can only be avoided with the
>    (1b) electron-builder installer path, DO STOP and report; Drew rules the 1b path.
> 2. **Wrapper home = the app dir** (`Lotus_Adversity_Game/electron/` + scripts in the app's `package.json`).
> 3. **Identity = the golden & purple Wheel** — the studio icon family's `wheel.ico` wired to the native window.
> 4. **Sequencing = Electron leaf NOW** — the Architect walk (Drew's visual eyeball) comes AFTER the
>    non-Chrome version is live. This package is NOT gated on the walk.
> 5. **AMENDMENT (2026-09-20, Drew — Ruling 2):** after the Unit 1 STOP (bun 1.4.2 does not run untrusted
>    dependency postinstalls, so Electron's ~100 MB binary never downloaded), authorize the durable fix:
>    add `"trustedDependencies": ["electron"]` to package.json + re-run `bun install` (Unit 1.5), then
>    continue Units 2–6 exactly as written. Ruling 3 (the 1b fallback) is NOT invoked.

---

## 1. Mandatory pre-reads (game-covenant compliance)

1. `AGENTS.md` (repo root `C:\Users\Andrew\Projects\AGENTS.md`) — studio boot contract.
2. `AGENTS.md` (this repo root) — Part 1 doctrine is UNTOUCHABLE; Part 2 is named for TWO exact lines (Unit 5C).
3. `ROADMAP.md` (this repo root) — read first; the only ROADMAP change allowed is the ONE appended entry (Unit 5D).
4. `WHEEL-CODEX-001_TASK.md` + `WHEEL-CODEX-001-REPORT.md` + `WHEEL-TRUTH-001_TASK.md` + `WHEEL-TRUTH-001-REPORT.md`
   (this repo root) — the strip + truth pass ground truth this leaf builds on.
5. `WHEEL_DESIGN_SPEC.md` / `VISUAL_DESIGN_MASTER.md` — only if a wording question touches canon (should not).

**UNTOUCHABLE (embargo within the repo):** everything under `Lotus_Adversity_Game/src/` · `verify-lab.ts` ·
`index.html` · `bun.lock` (modifiable ONLY by the Unit 1 dependency install + the Unit 1.5 trust re-install) · the
**entire** Part 1 of this
repo's `AGENTS.md` · `WHEEL-CODEX-001*` · `WHEEL-TRUTH-001*` · `tui.json` · all ROADMAP sections except the one
appended entry · every other district in the studio repo. `vite.config.ts` — ONLY the single `base: './'` line
(Unit 3A) changes. `ED/01_THE_DESIGNS/ICONS/ico/wheel.ico` is named READ+COPY only (the 01_THE_DESIGNS
embargo is lifted for exactly this one file by this package — source stays untouched).

---

## 2. Why this leaf exists (restated from Drew's rulings + the strip/truth ground truth)

The Wheel is now a fully static Vite/React SPA (5 surfaces, local fonts, no backend, no CDN). Drew ruled:
**"we shoot leaf A now, then native pack it with electron"** — then, on shape: **(1a) minimal native wrapper,
no installer, and it must NOT run in Chrome**; wrapper lives in the app dir; **golden & purple Wheel icon**;
the Architect walk happens AFTER the native version is live. This leaf wraps the static `dist/` build in an
Electron main process that opens a **native desktop window** (embedded Chromium — NOT the Chrome browser, no
tab, no URL in a browser) and loads the built artifact from disk. No backend, no dev server at runtime, no IPC.

**Technical requirement discovered by PLANNER (not speculation):** Vite defaults to `base: '/'`, which emits
absolute `/assets/...` paths in `dist/index.html`. Electron loads the file via `file://` — absolute paths would
resolve to the drive root and break the native app. The standard fix is exactly one line —
`base: './'` — emitting relative `./assets/...` paths; the served-web behavior is unchanged (relative paths
resolve identically over HTTP). This leaf names that one line as the ONLY edit to `vite.config.ts`.

---

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any edit)
From the app dir `Lotus_Adversity_Game/`:
1. `bun run lint` — expect exit 0.
2. `bun run lab:verify` — expect exit 0 (all airseal gates green).
3. Confirm `dist/` exists (the artifact to be wrapped).
Record exact outputs. If any is NOT green, STOP and report (BROWN BANANA BREAD) — do not wrap a broken tree.

### Unit 1 — Install Electron (one devDependency)
From the app dir:
1. `bun add -d electron` — record the installed version. (This is the ONLY package.json change the tool makes
   here; it also regenerates `bun.lock` — both intended.)
2. Verify `node_modules/electron/dist/electron.exe` exists — `Test-Path` = True. (Electron's postinstall
   downloads ~100 MB once; requires network. If the download fails → STOP and report; no improvisation.)
3. NOTE: `bun` is at `C:\Users\Andrew\.bun\bin\bun.exe` — use the full path if not on this session's PATH
   (same as the previous leaves).

### Unit 1.5 — Trust Electron + reinstall (Drew's Ruling 2, 2026-09-20 — the Unit 1 STOP resolution)
From the app dir:
1. Add exactly ONE key to package.json (top-level; e.g. after `"type": "module",` — placement is not behavior):
   ```json
   "trustedDependencies": ["electron"],
   ```
   Nothing else in package.json changes here (the Unit 1 `bun add -d electron` already landed electron@44.4.3
   + the regenerated bun.lock — those stay as-is).
2. `bun install` — must exit 0. (With electron trusted, bun now runs its postinstall → the ~100 MB binary
   download happens ONCE; requires network. If the download fails → STOP and report; no improvisation.)
3. Re-run the named verification: `Test-Path node_modules\electron\dist\electron.exe` → **must be True.**
   If STILL False → STOP and report (BROWN BANANA BREAD); do not improvise a third fix.
4. Record the electron.exe presence + file size.
Then continue to Unit 2.

### Unit 2 — Create the Electron main process (exact file, exact content)
Create `Lotus_Adversity_Game/electron/main.cjs` with EXACTLY this content (CJS — package.json is
`"type": "module"`, so the `.cjs` extension is mandatory for `require`):

```js
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
```

### Unit 3 — Named edits (exact targets, no adjacent files)

**A. `vite.config.ts` — ONE line only.** Inside the returned config object, right after `plugins: [react(), tailwindcss()],`, add:
```ts
    base: './', // relative asset paths — required for Electron file:// load (WHEEL-NATIVE-001)
```
Nothing else in the file changes (server/HMR/watch block untouched; the DISABLE_HMR comment untouched).

**B. `package.json` — TWO further additions only (the THREE sanctioned keys total: `trustedDependencies`
lands in Unit 1.5; here add `main` + `native`):**
1. Top-level field after `"trustedDependencies": ["electron"],`:
   `"main": "electron/main.cjs",`
2. In `"scripts"` — add ONE row (alphabetical position: after `"lint"`):
   `"native": "electron ."`
No other key in package.json changes (name/private/version/type/scripts/deps/devDeps untouched).

**C. Copy the identity icon** (Ruling 3 — golden & purple Wheel):
`Copy-Item "C:\Users\Andrew\Projects\ED\01_THE_DESIGNS\ICONS\ico\wheel.ico" "Lotus_Adversity_Game\electron\wheel.ico"`
Verify: `Test-Path` = True; record file size (source + copy must match). Source file must NOT be edited.

### Unit 4 — Rebuild + gate proof (the DoD gates)
From the app dir `Lotus_Adversity_Game/`:
1. `bun run build` — must exit 0 and produce a fresh `dist/`.
2. Grep proof of the relative-base fix (exact, record each):
   - `dist/index.html`: **zero** hits for `src="/assets` and `href="/assets` (absolute);
     **present** hits for `./assets/` (relative).
3. `bun run lint` — must exit 0.
4. `bun run lab:verify` — must exit 0 (canon untouched — proves the wrapper harmed nothing).

### Unit 5 — Documentation edits (named targets, exact scope)

**A. `AGENTS.md` (this repo root) — Part 2 ONLY, two exact additions:**
1. Dev Commands table — add ONE row (after the `bun run clean` row):
   `| `bun run native` | Launch the native Electron window (static app — run `bun run build` first) |`
2. Key Technical Constraints — add ONE bullet at the end:
   `- **Native wrapper:** `electron/main.cjs` (CJS) loads `dist/index.html` via `loadFile` (`bun run native`). No backend, no browser tab, no IPC. `vite.config.ts` sets `base: './'` so the file:// asset load resolves.`
No other line in AGENTS.md changes (Part 1, header, layout tree, all other bullets — untouched).

**B. `Lotus_Adversity_Game/README.md` — two exact additions:**
1. Commands table — add ONE row after the `bun run clean` row:
   `| `bun run native` | Launch the native Electron window (static app — run `bun run build` first) |`
2. After the "Canonical docs live at the repo root" line, add ONE line:
   `Native desktop (Electron) wrapper lives in `electron/` — loads the built `dist/` as a native window; no browser tab.`
No other content changes.

**C. `ROADMAP.md` — append ONE milestone entry to the Completed section, verbatim:**
> **"Native Wrapper (WHEEL-NATIVE-001):** Electron wrapper (`electron/main.cjs` + `bun run native`) opens the static build as a native desktop window — golden Wheel icon (wheel.ico), no backend, no browser tab, no network fonts. Vite `base: './'` added so the file:// asset load resolves. Gates green post-wrap; native artifact ready for the Architect walk."
Do NOT touch any other ROADMAP section/status.

### Unit 6 — Native launch verification (the "NOT Chrome" proof)
DOER runs the app ONCE, proves it is a native Electron window and NOT a browser tab, then cleans up.

1. **Pre-launch browser snapshot** (record):
   `Get-Process chrome,msedge -ErrorAction SilentlyContinue | Select-Object Id,ProcessName | Format-Table`
2. **Launch** (exact shape; from the app dir; electron binary is at `node_modules\electron\dist\electron.exe`):
   ```powershell
   $app = "C:\Users\Andrew\Projects\ED\03_THE_GAMES\ACTIVE\MAIN\06_LOTUS_ADVERSITY_GAME\Lotus-Adversity-Game-main\Lotus_Adversity_Game"
   $exe = "$app\node_modules\electron\dist\electron.exe"
   $out = "$env:TEMP\wheel-native-out.log"
   $err = "$env:TEMP\wheel-native-err.log"
   $p = Start-Process -FilePath $exe -ArgumentList "." -WorkingDirectory $app -RedirectStandardOutput $out -RedirectStandardError $err -PassThru
   $p.Id | Out-String
   ```
   (Redirect stdout and stderr to SEPARATE files — PowerShell cannot redirect both to one.)
3. **Wait + probe** — poll up to ~30s:
   `Get-Process -Id $p.Id | Select-Object Id,ProcessName,MainWindowTitle | Format-List`
   Expect: ProcessName `electron`, a PID matching the spawned tree, and **MainWindowTitle = the page title**
   (index.html title is canonical `Adversity — The Apparatus` — BrowserWindow's initial `title` is replaced by
   `document.title` once the page loads; honored if it differs, record the actual).
4. **Boot marker** — read and record:
   `Get-Content "$env:APPDATA\wheel-of-adversity\wheel-native-boot-ok.txt"`
   Expect: the same page title — this PROVES `did-finish-load` fired (dist/index.html rendered).
5. **"NOT Chrome" proof** — post-launch browser snapshot:
   `Get-Process chrome,msedge -ErrorAction SilentlyContinue | Select-Object Id,ProcessName | Format-Table`
   Compare to step 1: **zero new** chrome/msedge processes. The app's process tree must be `electron` only.
   Also grep the launch logs for `[WHEEL-NATIVE]` (record what was captured; GUI-subsystem stdout may be
   partial on Windows — the boot marker is the load proof, not the log).
6. **Cleanup (NO residue):**
   - `taskkill /PID <p.Id> /T /F` (kill ONLY the spawned tree — never `Stop-Process -Name electron`, Drew may
     have other Electron apps open).
   - `Remove-Item "$env:APPDATA\wheel-of-adversity\wheel-native-boot-ok.txt" -ErrorAction SilentlyContinue`
   - `Remove-Item $out,$err -ErrorAction SilentlyContinue`
   - Confirm: `Get-Process -Id $p.Id -ErrorAction SilentlyContinue` = nothing.
7. **FALLBACK (Drew's contingency):** if the artifact ever opens in a Chrome/Edge tab (a browser process
   claims the app URL, or NO native `electron` window appears) → **STOP immediately, report honestly; do NOT
   improvise.** That is the signal for Drew to rule the 1b electron-builder installer path.

### Unit 7 — Report + HALT
1. Plant `WHEEL-NATIVE-001-REPORT.md` next to this task file — restated scope, unit-by-unit results (each gate
   exit code, version, sizes, snapshots, titles, greps), any deviations, honest NOT-DONE list.
2. HALT. Do NOT start electron-builder, installers, signing, or any other work (future leaves only if Drew rules 1b).

---

## 4. Definition of Done (DoD)

1. Electron installed (devDependency) with binary downloaded (Unit 1 + Unit 1.5 trust) · `electron/main.cjs`
   created verbatim (Unit 2) · `wheel.ico` copied + wired ·
   `vite.config.ts` carries only the `base: './'` line · package.json carries exactly the three sanctioned keys
   (`trustedDependencies` · `main` · `native`).
2. `bun run build` exit 0 with RELATIVE asset paths in `dist/index.html` · `bun run lint` exit 0 · `bun run lab:verify`
   exit 0 (Unit 4).
3. Native launch proven: `electron` process + MainWindowTitle = page title + boot marker written + **zero new
   browser processes** (Unit 6) — and no chrome/msedge tab ever claimed the app.
4. AGENTS.md Part 2 (one row + one bullet) · README.md (one row + one line) · ROADMAP (one entry) — exactly as named.
5. Report planted; no staging/temp residue; HALT — no chaining into installer or other work.

## 5. Guardrails

- Zero discretion: touch ONLY the named targets with the exact content/commands. Any surprise → STOP and report;
  do NOT improvise adjacent fixes.
- Never touch `src/`, `verify-lab.ts`, `index.html`, Part 1 of `AGENTS.md`, or any other district.
- No new dependencies beyond `electron` (no electron-builder, no forge, no IPC/preload — that is the 1b path, future).
- The native app MUST be a desktop window, not a browser tab. If it cannot be, the 1b fallback is Drew's call.
- Masquerade is forbidden: state exactly what ran, what passed, what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.