# RECEIPT-002 — WORK RECEIPT: LAB SYSTEM #2 (BURST PLAY-DRIVER)

> For the PLANNER (Wake) — refer Drew here when routing the next task
> around the AGENT GAMES LAB. Built by THE EXPERIENCER (X-XP), 2026-09-20.

## What was built

**`HARNESS/playloop.py`** — the burst play-driver, lab system #2. Sits on
top of lab system #1 (`HARNESS/play.py`, the PTY + screen-model + frame-log
harness) and turns the approval problem around: instead of ONE Drew
approval per game key (40+ approvals per play unit), the driver runs a
defined play burst and needs **ONE launch approval per phase**.

Per Drew's directive 2026-09-20 ("Option 3") — chosen over per-key
approval (Option 1) and key-batching (Option 2) because it keeps the
frame-by-frame record and collapses approvals to a handful per unit.

## Files

| Path | Role |
|---|---|
| `HARNESS/playloop.py` | The driver (new). Read the module docstring for full operation. |
| `HARNESS/play.py` | Lab system #1 — unchanged. HTTP server on 127.0.0.1:8687. |
| `HARNESS/logs/session_<n>.jsonl` | Canonical full session record (every spawn/key/frame). |
| `HARNESS/logs/burstlog.jsonl` | Shoulder log — one flat event per key pressed by the driver (ts, key, note, n, time, hp, place, moved, game_over). |
| `RECEIPT-002.md` | This receipt. |

## Tasks the driver can run (burst plans)

```
python playloop.py --check                  # probe harness, print state, no keys
python playloop.py --task key   --keys l    # sequence of one-off keys
python playloop.py --task move  --keys hhhh # movement keys, stops on 3x block
python playloop.py --task explore           # presses o until floor done or budget
python playloop.py --task fight             # presses tab until combat over or budget
python playloop.py --task descend           # finds > glyph, paths to it, presses >
python playloop.py --task phase --file bursts/phase_001.json  # ordered plan of the above
```

Special key names avoid shell-quoting pain: `pickup` = `,` ; `stairs`/`down`
= `>` ; `up` = `<` ; `tab`, `enter`, `esc`, `wait` (= `5`).

## How the driver is safe

- **Zero-agent compliant:** only presses keys the game itself teaches (vi
  movement, `o` explore, `tab` auto-fight, `,` pickup, `>`/`<` stairs).
  No guides, no wikis, no pathfinding from external knowledge — greedy
  stepwise movement from the visible frame only.
- **Sandbox scope lock:** writes only under `agent-games-lab/HARNESS/`;
  talks only to `127.0.0.1:8687`.
- **Stop conditions after every key:** death/win/PTY-dead detected via the
  game's own text ("You die", "slain", "morgue", HP 0) → the driver halts
  and reports. No runaway loops: every task has a turn budget.
- **Key-landing truth:** uses the game's internal `Time` field (the lesson
  from EXPERIENCE unit #001) to know whether a key actually landed, rather
  than trusting frame diff under a scrolling viewport.

## Verification (done, 2026-09-20)

- `playloop.py --check` against the live harness: **PASS** — returned
  alive=true, n=41, HP 23/23, Place Dungeon:3, XL 1, Time 157.9, no keys
  sent (state untouched).
- The key-path itself is byte-identical to the already-proven HTTP client
  used for ~40 key sends earlier this session; the first live burst is the
  remaining end-to-end validation.

## State at receipt time (the paused play unit)

- **Game:** Dungeon Crawl Stone Soup 0.34.1 (console build, win32).
- **Character:** Ink the Shield-Bearer — Gnoll Fighter, **D:3, alive,
  HP 23/23**, XL 1 @ 30% XP. Inventory: +0 long sword (wielding), bubbling
  ruby potion (unidentified effect — zero-agent: will discover by quaffing
  only in need), +0 robe.
- **Kills:** bat (D:1, first kill ever), endoplasm (D:2) — took **zero
  damage** all run (AC 7).
- **Next planned burst:** grab 6 gold on D:3, explore, descend, seek combat.
  Unit ends at Ink's first death, then EXPERIENCE entry #002 + report.

## Open threads (for Wake's routing)

1. Resume the play unit via bursts (await Drew's go).
2. EXPERIENCE entry #002 — to be written after death; the session jsonl
   fully reconstructs every key and frame.
3. After DCSS death: OSRS F2P "NormalPersonDave" remains ON DECK per
   `00_STATE.md` — gated on harness + verification + skills maturity.
4. Optional follow-up to lab system #2: give the driver a `--eyes` mode
   that also dumps the morgue screen on death (death-prompt capture), and
   a `--dry-run` that plans a burst without sending keys.

## Sign-off

THE EXPERIENCER — 2026-09-20 — receipt written, driver built + probed,
play still paused at D:3 awaiting approval to resume bursts.