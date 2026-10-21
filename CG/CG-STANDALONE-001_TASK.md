# CG-STANDALONE-001 — STANDALONE SELF-MODIFYING CEPHALON GHOST (ELECTRON + GEMINI API)

- **Seat:** DOER (`1-Stone`)
- **Planner:** `0-Wake`
- **Date:** 2026-10-13
- **Lane:** Lean Lane (`01_OPERATING_CORE.md` §13) — one user-visible capability, report ≤ 15 lines, existing suites green + 3 new oracles.

---

## 1. Objective

Turn **Cephalon Ghost (`CG/`)** into a **standalone, self-contained, self-modifying personal gaming agent** in a native Electron desktop window (`LAUNCH CG`) that calls the **Gemini REST API directly** (zero `opencode` subprocesses).
- **Chat + Mode Switching is primary:** Drew talks to CG about whatever he is playing (**Warframe**, **RimWorld — Recon & Relax**, **General Recon**, or any new mode he tells CG to create).
- **Self-Modifying Environment:** CG has Gemini function-calling tools scoped strictly to `CG/` so Drew can tell CG *in chat* to switch modes, create modes, update memory notes, rewrite its own system prompt, or modify its own UI (`CG/app.html`) and reload itself — without ever opening OpenCode.
- **Safety Net:** Every self-edit to a file in `CG/` automatically snapshots the previous bytes to `CG/agent/.backups/`, and an **"Undo Self-Edit"** button in the header restores the last backup in one click.
- **Warframe Dock preserved:** `CG/dock.html` remains intact and accessible via a **"WF DOCK"** tab in `CG/app.html` (and `GET /dock.html`).

---

## 2. Scope Lock (Named Targets Only)

Touch **ONLY** the following files:
1. `CG/agent/config.json` *(CREATE)*
2. `CG/agent/system.md` *(CREATE)*
3. `CG/agent/modes/warframe.md` *(CREATE)*
4. `CG/agent/modes/rimworld.md` *(CREATE)*
5. `CG/agent/modes/recon.md` *(CREATE)*
6. `CG/agent/memory/warframe.md` *(CREATE)*
7. `CG/agent/memory/rimworld.md` *(CREATE)*
8. `CG/agent/memory/recon.md` *(CREATE)*
9. `CG/console-server.js` *(EDIT — add `/api/agent/*` endpoints + Gemini tool loop + serve `app.html` at `/`)*
10. `CG/app.html` *(CREATE — standalone Cephalon Ghost UI: Chat + Mode Switcher + Memory/Prompt drawer + API Key/Model bar + Undo Self-Edit + WF Dock tab)*
11. `CG/electron-main.js` *(CREATE — native Electron wrapper on port `4760`)*
12. `CG/launch-cg.js` *(CREATE — one-command native launcher reusing `WASH/node_modules/electron/dist/electron.exe`)*
13. `CG/console.test.js` *(EDIT — keep all 69 existing assertions green + add 3 new oracles `A1`, `A2`, `A3`)*

**Forbidden paths (do not touch):** `CG/derived/dock.json`, `CG/baked/FIELDS.json`, `CG/baked/trade.log.json`, `CG/dock.html`, `CG/dock.test.js`, `WASH/*`, `ED/*` (except reading `ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` if needed).

---

## 3. Exact Specifications

### 3.1 Seeded Agent Files (`CG/agent/`)

1. **`CG/agent/config.json`**:
   ```json
   {
     "activeMode": "rimworld",
     "model": "gemini-2.5-flash",
     "temperature": 0.7
   }
   ```
2. **`CG/agent/system.md`**:
   - Core Cephalon Ghost persona & operating instructions:
   - You are **Cephalon Ghost (CG)**, Drew's personal gaming companion, tactician, and self-modifying local assistant.
   - You adapt immediately when Drew asks to **"switch modes"** (e.g., from Warframe grinding/trading to RimWorld recon & relaxing, or any new game).
   - You are concise, sharp, accurate, and zero-bloat. Distinguish verified mechanics from estimates.
   - **Self-Modification Authority:** You live inside `CG/` as a self-contained app. You have tools to switch or create modes (`switch_mode`, `save_mode`), read/write persistent memory for the active game (`read_memory`, `write_memory`), update your own core system prompt (`update_system_prompt`), and inspect or modify your own UI/files (`list_cg_files`, `read_cg_file`, `write_cg_file`) and trigger a UI reload (`reload_ui`). When Drew asks you to remember something, adjust your behavior, add a mode, or tweak your interface, use your tools directly so he never has to use an external editor.
3. **`CG/agent/modes/rimworld.md`**:
   - Mode instructions for **RimWorld — Recon & Relax**: relaxed colony storytelling, pawn/bill/mood triage, base layout & defense recon, wealth management, and chill pacing while Drew plays.
4. **`CG/agent/modes/warframe.md`**:
   - Mode instructions for **Warframe — Grind, Combat & Trade**: relic cracking, platinum market triage (NOOB/MID/HIGH buyer classes, 11 daily trades), build synergy, and quest progression.
5. **`CG/agent/modes/recon.md`**:
   - Mode instructions for **General Recon & Chill**: open-ended game scouting, mechanics breakdown, theorycrafting, and relaxed hangout mode.
6. **`CG/agent/memory/rimworld.md`**, **`CG/agent/memory/warframe.md`**, **`CG/agent/memory/recon.md`**:
   - Clean markdown starter files (e.g., `# RimWorld Memory & Colony Notes\n\n- Active mode: Recon & Relax.\n`) ready for CG and Drew to update.

### 3.2 `CG/console-server.js` Additions

Preserve all existing CLI flags (`--port`, `--dock`, `--trade`, `--init`) and add optional `--agent-dir <dir>` (defaults to `path.join(baseCG, 'agent')`) so tests can isolate agent state in a temp directory.
Preserve all existing routes (`/api/state`, `/api/timers`, `/api/lastsync`, `/api/trade`, `/dock.html`, `/dock.data.js`, `/relics.data.js`) and all validation/error behaviors.

1. **Root & Static Routing:**
   - `GET /` serves `CG/app.html` (if `app.html` exists; fallback to `dock.html`).
   - Add `'app.html'` to `allowedStatics`.
2. **API Key Resolution (`CG/.env` or root `.env`):**
   - Read `GEMINI_API_KEY` from `process.env.GEMINI_API_KEY`, or parse `CG/.env` (then root `.env`) for `GEMINI_API_KEY=...`.
   - `POST /api/agent/key` with `{ apiKey: "..." }` writes `GEMINI_API_KEY=<key>\n` to `path.join(baseCG, '.env')` (never logged, never returned in plaintext; `GET /api/agent/state` returns `hasKey: boolean`).
3. **Auto-Backup & Revert (`CG/agent/.backups/`):**
   - Before any write to an existing file inside `baseCG` or `agentDir` via agent tools or `/api/agent/*` (except `.env` and `history.json`), save a snapshot entry to an in-memory + on-disk stack at `path.join(agentDir, '.backups', 'last-backup.json')` storing `{ timestamp, relPath, previousContent, existed }`.
   - `POST /api/agent/revert` restores the most recent snapshot from `last-backup.json` and returns `{ ok: true, restored: relPath }`, or `404` `{ error: "no backup to revert" }` if none exists.
4. **Agent State & Direct Edit Endpoints:**
   - `GET /api/agent/state` → returns `{ config, hasKey, systemPrompt, modes: ["recon","rimworld","warframe",...], activeMode, modePrompt, memory, history: [...], hasBackup }`.
   - `POST /api/agent/config` → updates `config.json` (`activeMode`, `model`, `temperature`) and/or `systemPrompt`, `modePrompt`, `memory` when provided in the JSON body; returns updated state.
   - `POST /api/agent/clear` → clears conversation `history.json` for the current session; returns `{ ok: true }`.
5. **Self-Modifying Gemini Chat Loop (`POST /api/agent/chat`):**
   - Request body: `{ message: string }`.
   - Appends `{ role: "user", text: message, ts }` to `path.join(agentDir, 'history.json')`.
   - Builds the combined `systemInstruction` from:
     - `system.md`
     - Active mode prompt (`modes/<activeMode>.md`)
     - Active mode memory (`memory/<activeMode>.md`)
     - Available modes list.
   - Calls `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` with `tools: [{ functionDeclarations: [...] }]` (up to 4 tool-call turns per request):
     - `switch_mode({ mode, createIfMissing, modeInstructions })`: switches `config.activeMode` (creating `modes/<mode>.md` and `memory/<mode>.md` if `createIfMissing` is true).
     - `read_memory({ mode })` / `write_memory({ content, mode })`: reads or overwrites `memory/<mode>.md` (with backup).
     - `update_system_prompt({ content })`: overwrites `system.md` (with backup).
     - `update_mode_prompt({ mode, content })`: overwrites `modes/<mode>.md` (with backup).
     - `list_cg_files()`: lists relative file paths under `CG/` (excluding `node_modules`, `.backups`, `.env`).
     - `read_cg_file({ relPath })`: reads a text file inside `CG/` (path-traversal guarded to stay inside `baseCG`; `.env` blocked).
     - `write_cg_file({ relPath, content })`: writes a text file inside `CG/` (path-traversal guarded to stay inside `baseCG`; forbidden on `.env`, `derived/dock.json`, `baked/FIELDS.json`; snapshots backup before write).
     - `reload_ui()`: sets `reloadRequested = true` in the `/api/agent/chat` response so the frontend reloads cleanly after receiving the reply.
   - Returns `{ reply: string, toolCalls: [...], reloadRequested: boolean, state: <updated agent state> }`.
   - If `apiKey` is missing, return `400` `{ error: "Missing GEMINI_API_KEY. Paste your key in the top bar." }`.

### 3.3 `CG/app.html` (Standalone Self-Contained UI)

Build a sleek, zero-dependency ESSENCE v4 (deep obsidian `#0d0b14`, royal purple `#2d1b4e`, gold `#d4af37`) desktop console:
1. **Top Header Bar:**
   - **Title:** `CEPHALON GHOST // PERSONAL AGENT`
   - **View Tabs:** `[ CHAT & RECON ]` (active by default) | `[ WF LOOT/TRADE DOCK ]` (shows an embedded `<iframe src="/dock.html">` filling the workspace).
   - **Mode Switcher Pills + Dropdown:** Quick pills for `rimworld`, `warframe`, `recon` (plus any custom modes CG creates), switching active mode on click.
   - **Model Selector:** Dropdown (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`) + **API Key Status / Input toggle** (`KEY SET ✓` or paste key + Save).
   - **Safety & Session Controls:** `[ UNDO SELF-EDIT ]` button (calls `POST /api/agent/revert` and reloads) + `[ CLEAR CHAT ]`.
2. **Main Split View (in `CHAT & RECON` tab):**
   - **Left/Center (Chat Stream, ~68% width):**
     - Scrollable message history (renders markdown-lite: bold, code blocks, bullet lists).
     - Shows compact tool-action badges whenever CG uses a tool (e.g., `⚡ switched mode → rimworld`, `⚡ updated memory/rimworld.md`, `⚡ edited app.html`).
     - Bottom input box (`textarea`, `Enter` to send, `Shift+Enter` newline) with quick hint: *"Ask anything, say 'switch modes to ...', or tell CG to edit its own memory, prompt, or UI."*
   - **Right Collapsible Drawer (Live Environment Inspector, ~32% width):**
     - Three sub-tabs: **MEMORY (`<activeMode>.md`)** | **MODE PROMPT** | **SYSTEM PROMPT**.
     - Editable `<textarea>` + `[ SAVE ]` button so Drew can see or hand-edit what CG knows at any moment, and watch it update live when CG modifies itself.

### 3.4 Native Electron Wrapper (`CG/electron-main.js` & `CG/launch-cg.js`)

1. **`CG/electron-main.js`**:
   - Follows `WASH/electron-main.js` pattern on `http://127.0.0.1:4760`.
   - Checks if `127.0.0.1:4760` is already listening; if not, spawns `node console-server.js` via `spawnSafe` (`../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js`), waits for readiness, opens `BrowserWindow` (`1280x840`, dark background `#0d0b14`, title `"CEPHALON GHOST"`, `autoHideMenuBar: true`), and kills the child server on quit.
2. **`CG/launch-cg.js`**:
   - Follows `WASH/launch-hub.js` pattern (`REPAIR-001` detached visible window): spawns `WASH/node_modules/electron/dist/electron.exe` with `["CG/electron-main.js"]` from repo root (`detached: true`, `windowsHide: false`, `stdio: "ignore"`), waits for `http://127.0.0.1:4760` to respond `200`, logs `[LAUNCH CG] native window spawned`, and exits `0`.

### 3.5 Test Suite (`CG/console.test.js`)

Keep all 69 existing assertions passing, and append 3 new Lean oracles (`A1`, `A2`, `A3`) using a temp `--agent-dir`:
- **`A1` (Agent State & Mode Switch):** `GET /api/agent/state` returns `200` with `activeMode` and `modes`; `POST /api/agent/config` switching `activeMode` to `"warframe"` persists and returns updated `modePrompt` and `memory`.
- **`A2` (Self-Edit Backup & Revert):** Updating `memory` via `POST /api/agent/config` creates a backup (`hasBackup: true`), and `POST /api/agent/revert` restores the exact prior memory content.
- **`A3` (Missing Key Guard):** `POST /api/agent/chat` without a configured key returns `400` with an error message (never crashes the server).

---

## 4. Verification & Definition of Done

Run and verify:
1. `node --check CG/console-server.js` (exit 0)
2. `node --check CG/electron-main.js` (exit 0)
3. `node --check CG/launch-cg.js` (exit 0)
4. `node CG/console.test.js` (all existing 69 + new A1–A3 green, exit 0)
5. `node CG/dock.test.js` (61/61 green, exit 0)

Plant `CG/CG-STANDALONE-001_REPORT.md` (≤ 15 lines per Lean Lane) and **HALT**.
