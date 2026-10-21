# GHOST-HUB-002 — HUB SKELETON REPAIR (TASK PACKAGE)

> **From:** PLANNER (0-Wake, Big Pickle) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Purpose:** Repair the GHOST-HUB-001 skeleton to studio standard — real
> server behavior, one-command native launch (Wheel pattern), real roster
> from ground truth (ledger + seats + shadow council + specters), honest
> UI (no fake spawns), behavioral tests. Chat lanes are **NOT** this leaf —
> they ship as **GHOST-HUB-003** (Drew ruling 2026-09-20).
> **Origin of this leaf:** Drew's review found the 001 launch "terrible —
> not to standard or spec." A prior session (Wake powered by Nemotron 3
> Ultra free) claimed it made a second-version plan but **hallucinated it —
> no file ever existed** (verified: grep/glob = zero hits). This file is the
> real 002.

---

## 1. Drew's Rulings (locked 2026-09-20)

1. **Native boot pattern: YES** — `electron-main.js` spawns `hub-server.js`
   itself (Sandtrap-clean child, kill-point on quit): one command launches
   the hub, exactly like the Wheel (`bun run native`).
2. **Native wrapper pattern: ADOPT THE WHEEL** — `WASH/package.json` +
   `trustedDependencies: ["electron"]` + `bun install` (proven in
   WHEEL-NATIVE-001). No postinstall hook.
3. **Sequencing: SKELETON FIRST.** GHOST-HUB-002 = this skeleton repair.
   **GHOST-HUB-003 = real chat lanes** (verify against opencode spawn
   layer). Do NOT fold chat into this leaf.
4. **Roster truth: OK** — build from the actual ledger
   (`06_THE_LEDGER/<SEAT>/<date>/*-TASK.md` + `*-REPORT.md`), seat agents
   (`.opencode/agents/*.md`), the Shadow Council registry
   (`LEGACY/VAULT/00_SHADOW_COUNCIL/`), and MILESTONES registry — **read-only**.
5. **Include our shadow agents AND the specters; personalize/customize
   them** — the hub carries a human-editable agent registry
   (`WASH/hub-agents.json`) as the personalization surface: display name,
   role, tagline, status, access per agent. Defaults derive from ground
   truth; the file overrides/extends.

---

## 2. Mandatory pre-reads

1. `AGENTS.md` (repo root) — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` — §6 leaf lifecycle, §8
   guardrails, §9 constraints, §10 DoD.
3. `WASH/GHOST-HUB-001_TASK.md` + `WASH/GHOST-HUB-001_REPORT.md` —
   the leaf being repaired (001 specs + honest report of what shipped).
4. `WASH/GHOST-HUB-MANDATE.md` — hub anatomy (council / specters / roster,
   TK manifest link, native standard, Sandtrap law).
5. `ED/03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/Lotus-Adversity-Game-main/WHEEL-NATIVE-001_TASK.md`
   — the Wheel native pattern (Units 1, 1.5, 6 = install trust + launch proof).
6. `ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md` + `spawn-safe.js` —
   Sandtrap law for every child spawn.
7. `ED/02_THE_LOGS/06_THE_LEDGER/README.md` — ledger structure (truth for the
   roster).
8. `LEGACY/VAULT/00_SHADOW_COUNCIL/00_README.md` (+ member files) — Shadow
   Council roster truth: COURRIER = B-Bolt (RATIFIED/live), SHADOW AUDITOR
   (dormant), TIMELORD (dormant).

---

## 3. Verified 001 defects being repaired (PLANNER read the code 2026-09-20)

| # | Defect | Location | Repair |
|---|--------|----------|--------|
| D1 | `/spawn` sends JSON twice → second write throws "headers already sent", silently swallowed; client never sees stdout/exitCode | `hub-server.js` `handleSpawn` (~line 265 + 277) | Respond **once**, on child `close`, with `{ pid, agent, exitCode, signal, stdout, stderr }` |
| D2 | `electron-main.js` polls for a server **nobody starts** → native launch fails standalone | `electron-main.js` | Spawn `node hub-server.js` as Sandtrap child before `loadURL`; kill child on quit |
| D3 | `install.js` uses bogus `npx @electron/get` CLI call; `dist/` holds only 4 copied files — no electron binary, no launch script | `install.js` + `dist/` | **Replace** with Wheel pattern: `package.json` + `bun install` + `trustedDependencies`; electron binary lands in `node_modules/electron/dist/electron.exe` |
| D4 | Council/specters hardcoded; roster parser hunts a non-existent `## ACTIVE MILESTONES` header → zero milestones | `hub-server.js` `buildState`/`parseRoster` | Read `hub-agents.json` (personalization) + derive defaults from ground truth; roster by ledger walk |
| D5 | UI "Open Chat" button runs a fake `node -e console.log('hub-spawn-ok…')` | `hub.html` `spawnAgent` | Remove fake spawn UX; replace with honest "Chat lanes: GHOST-HUB-003" placeholder + status display |
| D6 | Tests assert file contents, not behavior (pass while D1 standby) | `GHOST-HUB-001.test.js` | New behavioral suite (below) |
| D7 | WASH symbol clover approximated; red-lining spec under-delivered | `hub.css` `.hub-symbol` | Sharpen clover (4 rounded lobes, golden, red lining on clover + box edges per Drew spec) |

---

## 4. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any build)

Record exact outputs:
1. `node --version`
2. `git status --short` — record pre-existing dirty paths (do NOT touch;
   **VCS HOLD — no commits in this leaf**).
3. Reproduce D1 fast: `node -e "const s=require('./WASH/hub-server.js'); const sv=s.startServer(); setTimeout(async()=>{ const r=await fetch('http://127.0.0.1:4749/spawn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bin:'node',args:['-e','console.log(\"one\")'],agent:'t',timeoutMs:5000})}); console.log('status',r.status); console.log(await r.text()); sv.close(); },300);"` — record the double-response symptom (socket hang / one-shot only) if seen.
4. Confirm `dist/` contents (expect: no electron binary, no launch script).
5. Confirm `hub-agents.json` does **not** exist yet.

### Unit 1 — Create `WASH/hub-agents.json` (personalization surface)

Create with EXACTLY this seed shape (values editable by Drew later;
server merges over ground-truth defaults; unknown ids are added as-is):

```json
{
  "version": 1,
  "note": "Personalization surface for the GHOST HUB. Edit freely. Server merges over ground-truth defaults (seats from .opencode/agents/, shadow from 00_SHADOW_COUNCIL/, ledger seals).",
  "agents": {
    "0-wake":   { "displayName": "Wake",   "role": "PLANNER",   "section": "council",  "tagline": "The planner seat. Reads truth, specs leaves, never builds.", "status": "active" },
    "1-stone":  { "displayName": "Stone",   "role": "DOER",      "section": "council",  "tagline": "The build lane. Executes the approved task package, halts.", "status": "active" },
    "b-bolt":   { "displayName": "Bolt",    "role": "COURRIER",  "section": "council",  "tagline": "Bridge role. Ferries verified records between windows.", "status": "active" },
    "x-xp":     { "displayName": "XP",      "role": "EXPERIENCER", "section": "council", "tagline": "The play lane. Experiencer's workspace.", "status": "active" },
    "wash":     { "displayName": "WASH",    "role": "SEER",      "section": "council",  "tagline": "Outside seer. Read-only walks, artifact filing, live ghost.", "status": "live" },
    "cg":       { "displayName": "CG",      "role": "Cephalon Ghost", "section": "specters", "tagline": "Warframe helper — seated specter, READ-ONLY by default.", "status": "seated", "access": "READ-ONLY" },
    "es-guru":  { "displayName": "ES-GURU", "role": "Elder Scrolls Guide", "section": "specters", "tagline": "MW/OBL game-play lane, isolated chat.", "status": "seated", "access": "isolated chat" },
    "shadow-auditor": { "displayName": "SHADOW AUDITOR", "role": "Shadow Council", "section": "shadow", "tagline": "Standing fishhook — fresh-context drift audit.", "status": "dormant" },
    "timelord": { "displayName": "TIMELORD", "role": "Shadow Council", "section": "shadow", "tagline": "Record keeper of the permanent record.", "status": "dormant" }
  }
}
```

No other content. (COURRIER appears as `b-bolt` above — the shadow registry's
COURRIER IS the ratified B-Bolt seat; shadow section lists COURRIER status
from ground truth. Shadow AUDITOR + TIMELORD are dormant per
`00_SHADOW_COUNCIL/00_README.md`.)

### Unit 2 — Fix `WASH/hub-server.js` (exact targets)

**A. `handleSpawn` — kill the double response (D1).**
- Remove the immediate `sendJson(res, 200, { pid, agent, spawned: true })`
  call after child creation.
- Keep ONE response, sent on `child.on("close")`: `{ ok: true, pid, agent,
  exitCode, signal, stdout: stdout.slice(0, 5000), stderr: stderr.slice(0, 5000) }`.
- Keep the `child.on("error")` path (send once, 500).
- Keep `spawnSafe()` + `timeoutMs` (Sandtrap law) unchanged.

**B. `buildState` → read ground truth + personalization (D4).**
- Add a `hubAgents()` loader: read `WASH/hub-agents.json`; on miss, fall back
  to an empty config object (server still boots).
- Add default derivation (read-only):
  - Seats: `fs.readdirSync("../.opencode/agents")` → names like `0-wake.md`,
    `1-stone.md`, `b-bolt.md`, `x-xp.md`; code = stem; status `active`.
    (If the dir is missing, fall back to the four known codes — do NOT crash.)
  - Shadow: `LEGACY/VAULT/00_SHADOW_COUNCIL/` → COURRIER (live via B-Bolt,
    status from ground truth `00_README.md`: RATIFIED/live), SHADOW AUDITOR
    (dormant), TIMELORD (dormant).
  - Specters: CG, ES-GURU with access per mandate (READ-ONLY / isolated).
  - WASH: status `live` (it is a live ghost, verified 2026-09-20).
- Merge rule: for each agent id, `config.agents[id]` overrides/defaults for
  displayName/role/section/tagline/status/access; a config id with no default
  is added as a custom agent.
- Roster: walk `06_THE_LEDGER/<SEAT>/<date>/*-TASK.md` + `*-REPORT.md`,
  collect sealed leaf codes per seat (e.g. SANDTRAP-001, WASH-001). Major
  milestone level comes from the MILESTONES registry (Part 2 table rows:
  status `Complete` / `Active Target` → major milestones). Report per agent:
  `seals: [...]`, `majorMilestones: [...]`, `level: seals.length + milestones.length`.
- Replace the old `parseRoster` header-hunt (`## ACTIVE MILESTONES`) — that
  section doesn't exist; use Part 2 registry (`| **M<id>** |` rows).
- `/state` response shape (extend, don't break old fields):
  ```json
  {
    "ok": true,
    "council": [...],
    "specters": [...],
    "shadow": [...],
    "roster": [{ "id", "displayName", "role", "section", "status", "tagline", "access", "seals": [], "majorMilestones": [], "level": 0 }],
    "tkManifest": [...],
    "serverTime": "...", "port": 4749
  }
  ```

**C. `/chat` stays a stub this leaf** — respond `{ ok: true, relayed: true,
note: "chat lanes ship in GHOST-HUB-003" }` (no fake relay).

No other server behavior changes. Static file map, `/state`, `/events`,
`/tk-manifest`, port 4749, `spawn-safe` require — unchanged.

### Unit 3 — Fix `WASH/electron-main.js` (D2 — one-command native boot)

- At app boot, before `waitForServer()`: spawn the server:
  `spawnSafe("node", ["hub-server.js"], { cwd: __dirname, timeoutMs: 0 })`
  (require `../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` relative) — **Sandtrap
  law**: no inherited terminal, pipes, hidden window.
- Keep `waitForServer()` then `createWindow()`.
- Track `serverChild`; on `before-quit` and `window-all-closed` → kill child
  (`serverChild.kill()` if alive) before quit.
- Keep: existing window sizing, icon `icon.ico`, `loadURL("http://127.0.0.1:4749")`,
  `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`,
  no menu bar.

### Unit 4 — Wheel-pattern native wrapper (Ruling 2; replaces D3)

**A. Create `WASH/package.json`** with EXACTLY this shape:

```json
{
  "name": "essence-ghost-hub",
  "private": true,
  "version": "0.2.0",
  "main": "electron-main.js",
  "scripts": {
    "start": "node hub-server.js",
    "native": "electron ."
  },
  "trustedDependencies": ["electron"],
  "devDependencies": {
    "electron": "^44.4.3"
  }
}
```

(Version pin matches the Wheel-proven binary path. `main` points at the
Electron entry so `electron .` works. No postinstall hook — trustedDependencies
is the approved answer to bun's postinstall gate, per WHEEL-NATIVE-001
Ruling 2.)

**B. Install (Wheel pattern, from `WASH/`):**
1. `& "C:\Users\Andrew\.bun\bin\bun.exe" install` inside `WASH/` — must exit 0.
2. Verify binary: `Test-Path WASH\node_modules\electron\dist\electron.exe` →
   must be **True**; record size. If False → STOP and report (the machine
   needs the Wheel treatment — do not improvise a third fix).

**C. Replace `WASH/install.js`** (D3) with a slim successor that does NOT
download via fake npx: its new job is (1) ensure `package.json` shape above,
(2) run the same `bun install`, (3) print the electron binary path +
verification, (4) exit 0/1. Keep the file name `install.js` (referenced by
hub docs) but the content is the Wheel-consistent helper. Do NOT create a
`dist/` copy step — the native app runs from source via `electron .`.
Remove the stale broken `dist/` folder created by 001 (`Remove-Item
WASH\dist -Recurse -Force` — it holds only 4 copied files; the app now
launches from source).

### Unit 5 — Fix `WASH/hub.html` + `WASH/hub.css` (D5, D7)

**`hub.html`:**
- Keep the 3-tab anatomy (council / specters / roster) + header + WASH symbol
  + footer TK MANIFEST link + version badge.
- Render from `/state`: council cards, specter cards (role, access, status),
  **shadow cards**, and a full roster list (agent + role + status + level +
  sealed-leaf badges + major milestone badges).
- **REMOVE the fake `spawnAgent` UI + `alert()` demo.** Replace the specter
  "Open Chat" button with a disabled-styled chip: `Chat — GHOST-HUB-003`
  (honest placeholder, no action).
- Keep tab router, SSE client, 30s state refresh, `escapeHtml` guarding.

**`hub.css`:**
- Keep PAD palette/identity.
- Sharpen `.hub-symbol`: purple smooth-edged box (rounded, red lining border),
  golden 4-leaf clover (4 rounded lobes + stem), red lining ON the clover
  (stroke/highlight), consistent with Drew's spec. (PLANNER note: a near-4-
  lobe shape of 4 circles + stem is acceptable; the key is the red lining
  reads on box AND clover — previously only approximated.)
- Add styles for shadow cards, roster badges, placeholder chips.

### Unit 6 — Create `WASH/GHOST-HUB-002.test.js` + run it (behavioral)

Node built-in `node --test` (v24). Assert BEHAVIOR, not just file contents:

1. **Server boots** bound to `127.0.0.1:4749`; `GET /` serves shell with hub title.
2. **`/spawn` single response** — POST benign `node -e console.log('hub-spawn-ok')`;
   assert `status 200`, response is the child-close shape
   (`ok === true`, `exitCode === 0`, `stdout` includes `hub-spawn-ok`),
   and only ONE response body (fast client read — no hang/double).
3. **`/state` ground truth**: `council` includes Wake + WASH; `specters`
   includes CG + ES-GURU; `shadow` includes COURRIER (via b-bolt) +
   SHADOW AUDITOR + TIMELORD; `roster` entries carry `seals` arrays and at
   least the known sealed codes are present from the live ledger
   (e.g. `SANDTRAP-001`, `WASH-001` — assert at least the SANDTRAP seal is
   found; the ledger is ground truth, so check `roster.some(a =>
   a.seals.includes("SANDTRAP-001") || a.seals.includes("WASH-001"))`).
4. **`hub-agents.json` merge** — the file drives displayName/role override
   (compare a known id's fields against the seed file).
5. **Electron main spawns the server** — read `electron-main.js`: assert it
   contains a spawn of `hub-server.js` with a kill path (static guard for D2),
   plus `node --check` passes.
6. **Native wrapper** — `package.json` exists with `trustedDependencies:
   ["electron"]`, `scripts.native === "electron ."`, and
   `Test-Path node_modules\electron\dist\electron.exe` is True.
7. **No fake spawn** — `hub.html` does NOT contain `hub-spawn-ok` or
   `alert("Spawned` (D5 regression).
8. **TK manifest** still readable via `/state`.

Record exact pass/fail lines.

### Unit 7 — Verification

1. All touched files present: `hub-agents.json`, `package.json`, fixed
   `hub-server.js`, `electron-main.js`, `install.js`, `hub.html`, `hub.css`,
   `GHOST-HUB-002.test.js` — PASS/FAIL.
2. `GHOST-HUB-002.test.js` green (record lines) — PASS/FAIL.
3. `bun install` electron binary present (`Test-Path` True) — PASS/FAIL.
4. Native launch smoke (optional but encouraged, Wheel Unit 6 pattern —
   if Drew is present to eyeball): `bun run native` from `WASH/` opens a
   native window w/ hub title, **no new chrome/msedge process**, kill child
   clean on quit. If Drew is not present, record the launch script state and
   mark this check as `DEFERRED to Drew's window` honestly.
5. `git status --short` — ONLY this leaf's changes + pre-existing paths
   (record separately; **VCS HOLD — no commit**).
6. Boundary held: no `.opencode/`, `opencode.json`, game code, Pad, Log,
   Bible, MILESTONES, `01_OPERATING_CORE.md` changed — PASS/FAIL.

### Unit 8 — Report + HALT

1. Plant `WASH/GHOST-HUB-002_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline, files created/fixed, test pass lines,
   electron binary path/size, launch smoke result, hash/DIFF notes), honest
   NOT-DONE list.
2. HALT. Do NOT touch Captain's Log, Bible, MILESTONES, Pad, or other files.
   Do NOT commit (VCS HOLD).

---

## 5. Definition of Done (DoD)

1. `hub-server.js` `/spawn` returns exactly ONE child-close response with
   stdout/stderr/exitCode; no double-send.
2. Native boot: `package.json` + `bun install` + `trustedDependencies` landed
   the electron binary; `electron-main.js` spawns the server child and kills
   it on quit (one command = `bun run native`).
3. Roster real: seats + shadow council + specters + ledger seals + milestone
   registry, personalized through `hub-agents.json` — read-only on all sources.
4. UI honest: no fake spawn/alert; chat placeholder labeled GHOST-HUB-003.
5. WASH symbol reads purple box + golden clover with red lining on box and
   clover per Drew spec.
6. Tests behavioral and green; `install.js` slim successor; stale `dist/`
   removed.
7. Report planted; HALT; VCS HOLD respected.

---

## 6. Guardrails

- Touch ONLY: `WASH/hub-agents.json` (new), `WASH/package.json` (new),
  `WASH/hub-server.js`, `WASH/electron-main.js`, `WASH/install.js`,
  `WASH/hub.html`, `WASH/hub.css`, `WASH/GHOST-HUB-002.test.js` (new),
  `WASH/GHOST-HUB-002_REPORT.md` (new), and `WASH/dist/` (remove stale copy).
- **WASH is reference** for everything else: do NOT modify `WASH/server.js`,
  `WASH/wash.test.js`, `WASH/app.js`, `WASH/index.html`, `WASH/style.css`.
- **Zero discretion:** any surprise → STOP and report (BROWN BANANA BREAD for
  danger); do NOT improvise adjacent fixes (chat = 003, no exception).
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `.opencode/`, `opencode.json`, Pad/Log/Bible/MILESTONES — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle).** Drew: point the
DOER (1-Stone) window at this file to execute. Executor: restate scope,
run, HALT at every unit gate.