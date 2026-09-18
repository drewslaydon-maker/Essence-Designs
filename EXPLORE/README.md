# EXPLORE — The True Client (v0.5)

The **EF 2.0 validation gate**: a stylized, live map of the ESSENCE DESIGNS
domain. Read-only. It reads the repo on demand, pushes live updates as files
change (no reload), and surfaces LAG's real Sealing Gates.

Purple & gold — the **PAD** identity (cosmic pencil over a blank pad).

## Run

```
node EXPLORE/server.js
```

Then open <http://localhost:4747>.

Zero dependencies. Node only. No API cost.

## What it is (the name)

- **The Map** — `index.html` + `app.js` + `style.css`: the purple/gold domain
  map. Districts are regions (ENGINE gem, DESIGNS compass, LOGS logbook,
  GAMES dice, VAULT door); game folders are parcels colonized into THE GAMES,
  colored by placement — **LAG is the golden Wheel** (ACTIVE/MAIN), BROKEN
  cracked shard, ON_DECK card stack, PARKED resting leaf, TOOLKIT anvil.
  `json`/infra files show as plain **stone** piles ("not for people").
- **The Ledger** — `server.js`: walks the repo into a domain model, watches
  the tree (`fs.watch`, debounced 300ms), and streams updates over SSE
  (`/events`). No write endpoints — v0.5 is read-only by ruling.

## Test Operations

- **LAG** → **Sealing Gates**: the Ledger shells the game's own
  `bun run lab:verify` (single source of truth — `Lotus_Adversity_Game/`) and
  parses the PASS/FAIL gates and the AIRSEALED / LAB LEAK verdict.
  Degrades gracefully: if `bun` or LAG dependencies are absent it reports a
  clean `unavailable` state instead of failing.
- **Every other parcel** → yellow **UNDER CONSTRUCTION** tape with placeholder
  expectations (display-gap reasons come in a later pass).

## Layout

| File | Role |
|---|---|
| `server.js` | The Ledger — scan, watch/SSE, static serving, LAG gate runner |
| `index.html` | Map shell |
| `style.css` | Purple/gold PAD theme, map textures, tape, overlays |
| `app.js` | Icon language + map render + live patch + dossier overlays |
| `ledger.test.js` | Headless diagnostic — domain model + live HTTP (13 checks) |
| `README.md` | This file |

## Diagnostics

```
node EXPLORE/ledger.test.js
```

13/13 (domain model, roster placement, git honesty, graceful gate runner,
live HTTP endpoints). Run from anywhere; the script resolves the repo root
from its own location.

## Scope (v0.5)

Per Drew's ruling: confirm it **reads and functions** before adding any
writing. Read-only explorer now; plant/prune and further functions are a
later gate. Crafted under Leaf 6, 2026-09-17. Watch scope: root + `ED/`,
excluding `.git`, `node_modules`, and deep `LEGACY/` internals.