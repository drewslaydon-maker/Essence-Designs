# CG-000 — WORLDSTATE RECON + DREW-INTAKE SEED (TASK PACKAGE)

**Leaf:** CG-000 · **Executor:** DOER (1-Stone) · **Planted by:** PLANNER (0-Wake) ·
**Date:** 2026-10-05
**Rulings (Drew, 2026-10-05):** (1) READ-ONLY does **NOT** extend to CG's own memory
bank — CG may write `CG/` freely; READ-ONLY holds on game files + account data.
(2) Location confirmed: `CG/` at root, parallel to `WASH/`; agent file at
`.opencode/agents/cg.md` (**CG-001**, not this leaf). (3) Scope = **ONE account**
(Drew only). (4) **HUB STAYS OUT** — no hub file is touched by this leaf or CG-001;
CG ships isolated + self-contained; hub integration is a later date after a pass.
(5) Account ID **11121350** (platform not yet stated — recon resolves it).
(6) Wisp Prime live target = **Friday morning 2026-10-09**.

**GATE:** This leaf is **read-only recon**. It must NOT build CG. CG-001 (the agent
itself) does not start until Drew reads this report and routes it.

---

## 1. MANDATE — why this leaf exists

CG-001 will be built on assumptions about what Warframe's public data actually
exposes. This leaf removes the assumptions **before** any build, by probing the real
surface against Drew's real account.

One finding already reshaped the design and came from recon, not speculation:
**username-based profile lookup was removed in update 38.0.8.** Profile access now
requires a numeric account ID. IGNs (`drew.slaydon`, `Jubbiles`) return 404. That is
why this leaf probes endpoints instead of trusting a documented one.

**Deliverable:** a verified capability matrix — every capability Drew's goal depends
on, marked `[VERIFIED]` (exposed, with the exact field path) or `[INACCESSIBLE]`
(not obtainable from any public source, so CG must derive or ask).

---

## 2. SCOPE LOCK — only these targets

| # | Target | Kind | Purpose |
|---|---|---|---|
| M1 | `CG/probe.js` | CREATE | zero-dep Node probe (Node built-ins only) |
| M2 | `CG/baked/` | CREATE (dir) | holds API/game-fact knowledge |
| M3 | `CG/baked/probes/` | CREATE (dir) | raw JSON snapshots (patch-diff baseline) |
| M4 | `CG/baked/api-surface.md` | CREATE | **the capability matrix — the deliverable** |
| M5 | `CG/drew/` | CREATE (dir) | Drew-authored layer |
| M6 | `CG/drew/OPERATORS.md` | CREATE | Drew's intake, verbatim (Unit 5, transcription only) |
| M7 | `CG/drew/TRADE-DOCK.md` | CREATE | Drew's V3 execution ledger + doctrine (Unit 5) |
| M8 | `CG/drew/GOAL-STACKS.md` | CREATE | both operator goal stacks (Unit 5) |
| M9 | `CG/CG-000_REPORT.md` | CREATE | the receipt |

### LOCKED OUT — do not touch

- `.opencode/agents/cg.md` — **CG-001.** Must still be ABSENT at this leaf's end.
- **ALL hub files** (`WASH/**`) — ruling 4, hub stays out. Zero edits.
- `.opencode/agents/**`, `opencode.json`, `AGENTS.md`
- `ED/**`, `03_THE_GAMES/**`, `LEGACY/**`, `MUSIC/**`
- `CG/derived/` — create NOTHING this leaf. Derived layer is CG-001+.
- Any write, move, or delete of real game data. **There is no such thing here —
  Warframe has no local account file. READ-ONLY is trivially satisfied; do not
  invent a game-data write to satisfy it.**
- **VCS HOLD** — no `git add`, no `git commit`, no amend. Drew holds the tree local.

---

## 3. UNIT 0 — Baseline gate (record BEFORE any write)

1. `node --version` → expect v24.x (global `fetch` available; no npm install, zero deps).
2. `git status --short` → record pre-existing dirty tree. **No commit.**
3. Confirm `Test-Path .opencode\agents\cg.md` → **False** (CG does not exist yet).
4. Record mtimes of `WASH\hub-server.js`, `WASH\hub.html`, `WASH\hub.css` → these
   must be **byte-identical at Unit 5 exit** (proves hub was untouched).
5. Confirm outbound HTTPS works: one `fetch` to `https://api.warframestat.us/heartbeat`.
   If it fails, **STOP and report** — do not attempt workarounds or mirrors.

---

## 4. UNIT 1 — `CG/probe.js` (CREATE)

**Implementation is DOER's.** Spec the contract, do not copy-paste a design.

**Hard constraints:** Node built-ins only (global `fetch`, `node:fs`, `node:path`).
No `package.json`. No `node_modules`. Must `process.exit(0)` on full success and
`process.exit(1)` on any probe that found nothing to report.

**Probes to run, each writing raw JSON into `CG/baked/probes/`:**

### 4A — Account resolution (resolve platform, don't guess it)
Try each candidate against account `11121350`, in order, record HTTP status +
resolved/unresolved for every one. **Never stop at the first hit — probe all six so
the report states which platforms do and don't resolve.**

- `https://api.warframestat.us/profile/11121350`
- `https://api.wfcd.gg/profile/11121350`
- `https://api.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`
- `https://api-ps4.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`
- `https://api-xb1.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`
- `https://api-swi.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`
- `https://api-mob.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`
- `https://api-and.warframe.com/cdn/getProfileViewingData.php?playerId=11121350`

### 4B — Profile capability questions (the two load-bearing VERIFY items)

Against **every** profile payload that resolved, determine and record:

| # | Question | Why it matters |
|---|---|---|
| Q1 | **Is a research/dojo timer exposed, with a completion date?** | Drew's **Volt** research completes *Wednesday* — if exposed, CG gets this free. |
| Q2 | **Is any player-foundry crafting queue exposed?** | Drew's **Wisp Prime** (12h + 3d) and Julia's **Hek / Atomos** — believed NOT exposed anywhere. If confirmed absent, these must be CG-tracked from events, and that is a permanent architecture fact. |
| Q3 | Prime parts / resource counts / owned mods / relics / quest-completion keys | Layer-B inventory + progression |
| Q4 | Credits, platinum, mastery rank, syndicate standings | economy + progression |
| Q5 | Whether quest progress is granular enough to distinguish *started* vs *complete* | Julia's TWW progress gate |

Report Q1/Q2 as the headline verdicts. Do not paraphrase — quote the field path or
state `[INACCESSIBLE]`.

### 4C — Market orderability matrix (the trade-dock engine's foundation)

For **each** item below, probe an orders endpoint and record a hard
**ORDERABLE** or **NOT-ORDERABLE** verdict. URL-encode item names.
Try `https://api.warframestat.us/items/<ITEM>/orders`, then
`https://api.warframe.com/cdn/getItemOrders.php?item=<ITEM>`.

- Drew's live/liquidating: `Braton Vandal`, `Scattered Justice`
- Drew's long-term hold: `Voltaic Strike`
- Drew's S-tier set targets: `Sybaris Prime`, `Steflos Prime`, `Baza Prime`, `Valkyr Prime`, `Ivara Prime`
- Drew's in-flight gaps: `Wisp Prime`, `Volt`, `Hek`, `Atomos`, `Neurode`
- Drew's buyout doctrine targets: `Stalking Fan`, `Crimson Dervish`
- Julia's gap (recorded, not acted on): `Zenurik` focus-related, `Railjack`

**Explicit question to answer: is "the 1-Plat Undercut" computable from public orders
at all?** If Prime parts and Baro exclusives carry no public orders, the undercut
doctrine only applies to a subset and the rest must move via trade credits. State the
split explicitly — it determines whether CG-001's trade engine is order-driven,
trade-credit-driven, or both.

### 4D — Worldstate baseline (the patch-diff mechanism)
Fetch and snapshot the worldstate (`https://api.warframestat.us/pc/en`), recording
`streamDate` and the top-level key list. This snapshot is the baseline CG-001 diffs
against to detect what a game patch changed. Record which keys exist — these are the
live-world facts (fissures, Nightwave, alerts, darvo, sorties) CG can read.

### 4E — Discipline
Sequential requests, polite spacing. **Treat HTTP 429 as a legitimate finding**
(record it, back off, never hammer). Truncate/huge payloads: store raw, but the
printed matrix must stay readable.

---

## 5. UNIT 2 — `CG/baked/api-surface.md` (the deliverable)

Structure it as a **table of capabilities**, one row per question, each row carrying
exactly one of:

- `[VERIFIED]` + the exact field path / URL + a one-line example of the value shape
- `[INACCESSIBLE]` + every source tried, so we know the search was actually done

Required sections, in this order:

1. **Account resolution** — which endpoint resolved 11121350, which platforms resolved, which didn't
2. **Profile capabilities** — Q1–Q5, verdicts + field paths
3. **Market orderability** — the per-item ORDERABLE / NOT-ORDERABLE matrix
4. **Trade doctrine computability** — is the 1-Plat Undercut derivable? On which items?
5. **Live worldstate keys available**
6. **What the API does NOT know** — the explicit gap list. Everything in this section
   is a thing CG must ask Drew about or derive itself.

**Rule: zero invented fields.** If a field is not in the payload, it is
`[INACCESSIBLE]` — never a plausible guess, never an inferred value.

---

## 6. UNIT 3 — Diagnostics

| Check | Pass condition |
|---|---|
| `node --check CG/probe.js` | clean |
| `node CG/probe.js` | exit 0; prints the matrix; re-runnable |
| `node CG/probe.js` (2nd run) | exit 0 again; idempotent; overwrites snapshots cleanly; no crash on existing files |
| `Get-ChildItem CG\baked\probes` | ≥1 profile snapshot + 1 worldstate snapshot + one per market item probed |
| `node -e "..."` scan of `api-surface.md` | every Q1–Q5 row present and carries `[VERIFIED]` or `[INACCESSIBLE]` |
| market matrix scan | every listed item has an explicit ORDERABLE / NOT-ORDERABLE verdict — **no blanks, no "probably"** |
| `Test-Path .opencode\agents\cg.md` | **False** — CG still does not exist |
| hub mtimes (re-check vs Unit 0) | **byte-identical** — hub untouched |
| `git status --short` | no new commits; only `?? CG/` added to the untracked set |

---

## 7. UNIT 4 — `CG-000_REPORT.md`

State, per the operating core, **exactly what was done and not done.**

Must include:
- Which endpoint resolved 11121350, and the platform it implies
- The Q1 / Q2 verdicts in plain language — *especially* Q2, which shapes CG-001
- The full orderability matrix, and whether the 1-Plat Undercut is computable
- The gap list from `api-surface.md` §6
- **Anything that surprised you** — recon exists to find surprises
- Honest NOT-DONE: `cg.md` not created, hub not touched, `CG/derived/` empty,
  no commit, no CG agent run

---

## 8. UNIT 5 — DREW-INTAKE SEED (TRANSCRIPTION ONLY — no analysis, no invention)

Plant Drew's 2026-10-05 intake into the Drew-authored layer **verbatim**. This is
copying, not building. Preserve his own words; do not "improve" them, do not
resolve his terminology, do not add mechanics he did not state.

| File | Contains |
|---|---|
| `CG/drew/OPERATORS.md` | Identity: primary operator handle + account ID `11121350`; timezone CDT (America/Chicago); primary ops window weekdays ~15:00–00:00; market sweeps weekend dead-hours 04:00–07:00 CDT + Sunday evening pre-reset liquidations. **11 unused trades** to cycle. Note that platform is UNCONFIRMED pending CG-000 §4A. |
| `CG/drew/GOAL-STACKS.md` | Both stacks verbatim: **Drew — "The Buffer Week"** (hard-parked at TNW door, 7–10 day wait for Julia, "Baby God" power standard, survival→"Selfish Altruism" speed/group buffers Wisp/Volt, purge Boar/Spira/Sonicor, merge Akbolto + Dual Skana → Akjagara, Wisp Prime live **Friday morning 2026-10-09**, Volt research **Wednesday**) + owned/sacred-bench roster. **Julia — "The Ascension Week"** (initiated TWW, Zenurik, Hek/Atomos/Broken War, Rising Tide → Railjack = TNW-gating, ⚠️ never mercy-kill Kuva Larvlings post-TWW — Lich taxation) + roster/in-flight. Record the **cross-gate**: Drew's TNW is gated behind Julia's Railjack. |
| `CG/drew/TRADE-DOCK.md` | "V3 Live Execution Ledger", Velocity Tiers 0–6. S-tier sets (Sybaris, Steflos, Baza, Valkyr, Ivara); liquidating Scattered Justice aug flips (8p) + Braton Vandal stock (8p); long-term Voltaic Strike hold 4–8w → 40–60p+. Doctrine verbatim: **1-Plat Undercut** (never sit for an extra 2p), **buy Power not pieces** (stances outright — Stalking Fan for Hate, Crimson Dervish for Broken War; prime parts only as the single missing piece of an S-tier flip), **margin floor 10–12p = Trade Trap** (scrap to Ducats or bank as mastery fodder), zero patience for slow/low-value + max "Corpus-tier" patience for appreciating assets. |

Tag every file `[DREW-AUTHORED 2026-10-05]` and mark the Kuva Larvling rule as
**Drew's ruling — CG follows it, never verifies or second-guesses it.**

**Nothing else goes in `CG/drew/`.** No analysis, no proposals, no derived data.

---

## 9. DEFINITION OF DONE

- [ ] `node CG/probe.js` exits 0, is idempotent, zero dependencies
- [ ] `CG/baked/probes/` holds raw snapshots incl. worldstate + per-item orders
- [ ] `CG/baked/api-surface.md` answers Q1–Q5 with `[VERIFIED]` (exact field path) or
      `[INACCESSIBLE]` (all sources tried) — **zero invented fields**
- [ ] Every market item has a hard ORDERABLE / NOT-ORDERABLE verdict
- [ ] `api-surface.md` §6 states plainly what the API does not know
- [ ] Drew's intake transcribed verbatim into `CG/drew/` (3 files), tagged
      `[DREW-AUTHORED 2026-10-05]`
- [ ] `.opencode/agents/cg.md` still absent — **no CG agent was built**
- [ ] **Zero** `WASH/**` / hub files touched (byte-identical mtimes)
- [ ] `CG/derived/` empty
- [ ] **VCS HOLD honored** — no commit
- [ ] `CG-000_REPORT.md` planted next to this task

---

## 10. HALT

When green per §9, plant `CG/CG-000_REPORT.md` beside this task and **HALT** for Drew.
Do **not** self-forward to COURRIER, do **not** create `cg.md`, do **not** touch the
hub. Masquerade is forbidden — report what was probed, what resolved, what surprised
you, and what was not done.
