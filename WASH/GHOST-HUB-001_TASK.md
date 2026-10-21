# GHOST-HUB-001 — ESSENCE DESIGNS GHOST HUB BUILD (TASK PACKAGE)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Purpose:** Build the **ESSENCE DESIGNS GHOST HUB** as the native, zero-dep studio hub — one app, three sections (Head Council Ghosts, Specified Specters, Agent Roster), TK Manifest link, Sandtrap-spawn compliant, Electron-native from the start (Wheel precedent). This is the post-Sandtrap leaf per mandate `WASH/GHOST-HUB-MANDATE.md`.
> **Scope ruling:** Stone builds (build lane). WASH is reference, not builder. Native from start — Electron wrapper over local server (no browser-first phase). Single-page tabbed architecture.

---

## 1. What this leaf creates

Studio hub in `WASH/` (the hub is WASH's expansion):

1. `WASH/hub-server.js` — zero-dep HTTP + SSE server (Node built-ins only), serves the hub UI, **spawns agents via `spawn-safe.js`** (Sandtrap law).
2. `WASH/hub.html` — single-page tabbed UI (three sections, no dependencies, vanilla JS/CSS).
3. `WASH/hub.css` — purple/gold PAD identity, WASH symbol (purple smooth-edged box, golden 4-leaf clover with red lining).
4. `WASH/electron-main.js` — Electron entry (native window, no Chrome tab, golden Wheel icon precedent).
5. `WASH/install.js` — Electron install step (lazy binary download, no postinstall hook).
6. `ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md` — Toolkit Manifest (tools, reasons, access) — linked from hub.
7. `WASH/GHOST-HUB-001.test.js` — offline proof (server boots, SSE streams, spawn-safe integration, Electron loads).
8. One-line constraining update to `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` (Ghost Hub entry in Constraints).

Nothing else. No `package.json`, no `node_modules`, no network at runtime, no game code, no `.opencode/` changes, no Pad/Log/Bible/MILESTONES.

---

## 2. Mandatory pre-reads

1. `AGENTS.md` (repo root) — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` — §8 Guardrails, §9 Constraints, §10 DoD.
3. `ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md` + `spawn-safe.js` — the law + helper.
4. `WASH/server.js` — WASH's proven server pattern (SSE, stdio fix, zero-dep).
5. `WASH/GHOST-HUB-MANDATE.md` — this leaf's mandate.
6. `ED/02_ESSENCE_PAD.md` — WASH symbol spec, memory bank framework, roster leveling.

---

## 3. Architecture Decisions (locked by this spec)

| Item | Decision | Rationale |
|------|----------|-----------|
| **Architecture** | Single-page tabs (Hash-router: `#council`, `#specters`, `#roster`) | One HTML, no build step, instant tab switch, native-ready |
| **Tab markers** | Section 1 = HEAD COUNCIL GHOSTS (default), Section 2 = SPECIFIED SPECTERS, Section 3 = AGENT ROSTER | Mandate §2 anatomy |
| **Roster leveling** | Major milestone = game/system milestone (M8, M9, etc.); Minor milestone = leaf seal (VAL-003, SANDTRAP-001, etc.) | Studio meta: agents have XP; definitions from MILESTONES.md + ledger |
| **TK Manifest location** | `ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md` (INFRA-adjacent, unvaulted) | Machine makes itself readable; infra is the tool layer |
| **Native sequence** | **Native from start** — Electron wrapper over `http://127.0.0.1:4749` (Wheel precedent: WHEEL-NATIVE-001) | Drew: "Native = studio standard" |
| **Builder seat** | **Stone (1-Stone)** — build lane executor | Seat doctrine: Stone builds; WASH self-fixes narrow scope only |
| **Port** | `4749` (distinct from WASH 4748, Wheel 4747, Explore 4747) | No collision |
| **Icon** | Golden Wheel icon reused (studio standard) + WASH symbol in UI | Consistency with Wheel native |

---

## 4. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any build)

Record exact outputs:
1. `node --version`
2. Confirm `WASH/` currently contains: `server.js`, `GHOST-HUB-MANDATE.md`, `desktop.ini`, `icon.ico` (cite what you find).
3. Confirm `ED/00_ESSENCE_CORE/INFRA/` contains `spawn-safe.js`, `SANDTRAP_DISCIPLINE.md`, `SANDTRAP-001.test.js`, `SYSTEM_ARCH.md`.
4. Read `spawn-safe.js` — confirm `spawnSafe` export exists.
5. `git status --short` — record pre-existing dirty paths (do NOT touch them; **VCS HOLD — no commits in this leaf**).

### Unit 1 — Create `WASH/hub-server.js`

Zero-dep HTTP + SSE server. Must:
- Serve `hub.html`, `hub.css`, `hub.js` (inline script in HTML is fine) statically.
- `GET /state` → JSON: `{ agents: [...], roster: [...], tkManifest: [...] }` (reads `TK_MANIFEST.md` + roster source).
- `POST /chat` → relays to target agent via `spawnSafe()` (Sandtrap law) — stub for now (returns `{ ok: true, relayed: true }`).
- `GET /events` — SSE stream (heartbeat every 15s + agent output relay).
- `POST /spawn` — spawns an agent via `spawnSafe()` with `timeoutMs: 600000`, returns `{ pid, agent }`.
- **Uses `spawn-safe.js` from `ED/00_ESSENCE_CORE/INFRA/`** (relative require).
- Port `4749`, binds `127.0.0.1`.
- Graceful shutdown on `SIGINT`/`SIGTERM` (kills all children).

Reference: `WASH/server.js` lines 1-250 (proven pattern). No `package.json`, no deps.

### Unit 2 — Create `WASH/hub.html` + `WASH/hub.css`

Single-page tabbed UI. Structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ESSENCE DESIGNS GHOST HUB</title>
  <link rel="stylesheet" href="hub.css">
</head>
<body>
  <header>
    <h1>ESSENCE DESIGNS GHOST HUB</h1>
    <div class="hub-symbol" aria-label="WASH symbol"></div> <!-- purple box, gold clover, red lining -->
  </header>
  <nav class="tabs" role="tablist">
    <button role="tab" aria-selected="true" data-tab="council">HEAD COUNCIL GHOSTS</button>
    <button role="tab" aria-selected="false" data-tab="specters">SPECIFIED SPECTERS</button>
    <button role="tab" aria-selected="false" data-tab="roster">AGENT ROSTER</button>
  </nav>
  <main>
    <section id="council" role="tabpanel" aria-labelledby="council-tab"></section>
    <section id="specters" role="tabpanel" aria-labelledby="specters-tab" hidden></section>
    <section id="roster" role="tabpanel" aria-labelledby="roster-tab" hidden></section>
  </main>
  <footer>
    <a href="/tk-manifest" target="_blank" rel="noopener">TK MANIFEST</a>
    <span class="version">v0.1 — Sandtrap-secured</span>
  </footer>
  <script>/* vanilla tab router + SSE client + spawn buttons */</script>
</body>
</html>
```

CSS — purple/gold PAD palette, WASH symbol (purple smooth-edged box, golden 4-leaf clover with red lining on box edges and clover), clean typography, responsive. No external fonts, no frameworks.

### Unit 3 — Create `WASH/electron-main.js` + `WASH/install.js`

**`electron-main.js`** (Wheel precedent):
- Creates `BrowserWindow` (width 1200, height 800, min 900x600).
- Loads `http://127.0.0.1:4749` (waits for server ready).
- Window icon: `WASH/icon.ico` (golden Wheel icon).
- `webPreferences: { contextIsolation: true, nodeIntegration: false }`.
- No menu bar (clean native feel).
- On `window-all-closed` → `app.quit()`.

**`install.js`** (Wheel precedent):
- Downloads Electron binary lazily (no postinstall).
- Uses `@electron/get` via `npx` at runtime, or bundle minimal Electron if preferred — **but zero `package.json`**, so use the `npx electron@latest` pattern with a version pin.
- Creates `dist/` with the unpacked Electron + app files.
- Returns the path to the Electron executable for the launch script.

### Unit 4 — Create `ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md`

Toolkit Manifest — source of truth for tools, reasons, access. Structure:

```markdown
# TOOLKIT MANIFEST (TK)

> The Machine makes itself READABLE to humans. Source of truth for every tool
> the studio agents can reach, why it exists, and who has access.
> Home: `ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md` — linked from GHOST HUB.

## Tool Registry

| Tool | Purpose | Access | Notes |
|------|---------|--------|-------|
| `opencode-edit` | File edits via opencode | Wake, Stone, Bolt, XP | Core edit primitive |
| `b-bolt` | Cross-window ferry (Courier) | Bolt only | Moves receipts, never writes |
| `bash` | Shell allowlist (git, node, etc.) | All seats | Guardrailed in opencode.json |
| `web-fetch` | External research | Wake, XP | Allowlisted domains |
| `spawn-safe.js` | Sandtrap-spawn helper | All servers/ghosts | `ED/00_ESSENCE_CORE/INFRA/` |
| `E(SC) test runner` | Deterministic QA gates | Stone, XP | `node --test` / custom |
| `opencode session engine` | Agent resume/persist | All seats | `.opencode/session/` |
| `fs walk / read` | Filesystem inspection | All seats | Read-only by default |

## Access Policy

- **Default:** READ-ONLY on all game data/files (CG guardrail).
- **Elevated:** Explicit task package names write targets.
- **Courier-only:** `b-bolt` — ferries, never writes another workspace's records.
```

### Unit 5 — Create `WASH/GHOST-HUB-001.test.js` + run it

Offline assert-based tests (node built-ins only). Runnable via plain `node`. Tests:

1. **Server boots + serves HTML:** `hub-server.js` starts, `GET /` returns 200 + HTML containing "ESSENCE DESIGNS GHOST HUB".
2. **SSE stream opens:** `GET /events` returns `text/event-stream`, emits heartbeat.
3. **Spawn-safe integration:** `POST /spawn` with a benign command (`node -e "console.log('hub-spawn-ok')"`) → returns `{ pid, agent }`, child stdout captured, exit 0.
4. **TK Manifest readable:** `GET /state` includes `tkManifest` array parsed from `TK_MANIFEST.md`.
5. **Electron main loads (smoke):** `electron-main.js` syntax validates (no runtime Electron needed — `node --check`).

Record exact pass/fail lines.

### Unit 6 — Update `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`

In §9 Constraints & Environment, append one bullet (after the Sandtrap law bullet):

```markdown
- **Ghost Hub (2026-09-20):** `WASH/hub-server.js` + Electron native wrapper — the studio hub for Head Council Ghosts, Specified Specters, and Agent Roster; all agent spawns route through `spawn-safe.js` (Sandtrap law).
```

Do NOT touch any other line.

### Unit 7 — Verification

1. All 6 new files exist under `WASH/` + `TK_MANIFEST.md` under `INFRA/` — PASS/FAIL.
2. `GHOST-HUB-001.test.js` passes (record exact lines) — PASS/FAIL.
3. `01_OPERATING_CORE.md` §9 contains the Ghost Hub bullet — PASS/FAIL.
4. `hub-server.js` requires `spawn-safe.js` from `../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` — PASS/FAIL.
5. `electron-main.js` loads `http://127.0.0.1:4749` — PASS/FAIL.
6. `git status --short` — ONLY changes from this leaf are the 7 new files + 1 appended doc (cite pre-existing dirty paths separately; **VCS HOLD — no commit**).
7. Boundary held: no `.opencode/`, `opencode.json`, game code, Pad, Log, Bible, MILESTONES changed — PASS/FAIL.

### Unit 8 — Report + HALT

1. Plant `GHOST-HUB-001_REPORT.md` next to this task file — restated scope, unit-by-unit results (baseline outputs, files created, test pass lines, exact doc line added), any deviations, honest NOT-DONE list.
2. HALT. Do NOT touch Captain's Log, Bible, MILESTONES, Pad, or any other file. Do NOT commit (VCS HOLD).

---

## 5. Definition of Done (DoD)

1. `hub-server.js`, `hub.html`, `hub.css`, `electron-main.js`, `install.js`, `TK_MANIFEST.md`, `GHOST-HUB-001.test.js` created — zero-dep, Node built-ins only.
2. Tests green (recorded honestly).
3. `01_OPERATING_CORE.md` carries the exact constraining bullet (nothing else changed).
4. Sandtrap law enforced: `hub-server.js` uses `spawn-safe.js` for all spawns.
5. Native-ready: `electron-main.js` + `install.js` follow Wheel precedent.
6. Report planted; no staging residue; VCS HOLD respected; HALT.

---

## 6. Guardrails

- Touch ONLY the named targets: 7 new files (6 in `WASH/`, 1 in `INFRA/`) + 1 doc append.
- WASH is reference, not a target (do not modify `WASH/server.js`).
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for danger); do NOT improvise.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** do not commit or amend anything in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at this file to execute. Executor: restate scope, run, HALT at every unit gate.