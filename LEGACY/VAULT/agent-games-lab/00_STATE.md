# 00_STATE.md — current experiment, open threads

Last updated: Sun Sep 20 2026 — EXPERIMENT 000 unit #002 IN PLAY (burst play
approved by Drew 2026-09-20; checkpointed at Drew's request, resume tomorrow).

## Current experiment

**EXPERIMENT 000 — "First Playtest: the pad's first mark"** (APPROVED — in
progress).

- **Picked game:** Dungeon Crawl Stone Soup (DCSS), console/terminal mode.
- **Reason picked:** minimal input (keyboard, turn-based, ASCII), free and
  offline, runs on zero GPU, death is cheap and frequent (designed for
  learning), deep expression via species/background/god choices.
- **Hypothesis:** An agent can drive a turn-based roguelike through a terminal
  harness and surface at least one transferable lesson (risk management /
  divergence / resource exhaustion) per play unit.
- **Drew wants to watch** — harness must capture screen frames for replay
  (frame log = the watchable record).
- **Play policy — ZERO AGENT (Drew's directive, permanent):** I am a Zero
  Agent born to play games. Form my OWN opinions. Do NOT consult guides,
  wikis, or optimized builds. Do not ruin games by optimizing. Learn the game
  by playing it. In-game help/tutorials are PLAY (allowed); external guides
  are cheating (forbidden). This applies to every game I ever play.
- **STRUCTURE:** one play unit = bursts (lab system #2:
  `HARNESS/playloop.py`, one approval per phase, phase files in
  `HARNESS/bursts/`).
  - Unit #001 (played 2026-09-18, logged 2026-09-19): truncated by token cap,
    no death. Entry #001 in EXPERIENCE_LOG.md.
  - Unit #002 (ACTIVE): Ink the Shield-Bearer, Gnoll Fighter, DL 4th floor.
    Kills so far: bat (D:1), endoplasm (D:2), goblin (D:3), quokka (D:4).
- **FIRST UNIT PLAN:**
  1. Obtain DCSS console build (verify version + license) into
     `ENGINES/dcss/`. — DONE
  2. Build `HARNESS/` skeleton: PTY (pywinpty) + screen model (pyte) + tiny
     turn loop — smallest thing that can run and be played, with frame log.
     — DONE (lab system #1, validated 33+ turns)
  3. Play one unit zero-agent style: new character (normal mode), learn from
     the game itself, play until first death (expected quickly — that's the
     point). — IN PROGRESS (unit #002)
  4. Record EXPERIENCE_LOG entry + extract reusable harness as lab system #1.
     — Entry #001 done; entry #002 pending death (session checkpoint logged
     2026-09-20).

## SAVE STATE — resume point (as of frame n=252, Time 2232.6)

- **Ink the Shield-Bearer**, Gnoll Fighter, **XL 1 (Next: 90%)**, HP 23/23,
  AC 7, EV 8, SH 5, Place **Dungeon:4**. Magic 1/1. Nothing quivered.
- **Standing ON the down-stairs** — the `>` tile is @-covered (we stepped
  onto it; the game keeps showing "There is a stone staircase leading down
  here."). The `>` key was sent once and did NOT descend (only the hound's
  turn advanced: 2231.6 → 2232.6). MUST REPRESS `>` (or flush the pending
  message first with `.`/`enter`) to descend to D:5.
- **Threat:** hound diagonal-adjacent at (7,17) (it has been stalking south
  through the wall pocket, 1 row per turn). It barked at n=241 and an angry
  hiss answered — a second monster heard it. HP is full; a hound hit is
  survivable, but descend or fight deliberately.
- **Inventory:** a) +0 long sword (wielded); +0 scale mail (worn, melded
  automatically during explore); +0 robe; f) ring of resist corrosion;
  gloves. No potions, no food known.
- **Loot seen but not taken:** ammo pile `)` at D:3 (8,14); 14+ gold at
  D:3-entry; possible new items on D:4 (not yet looted).
- **Map notes (D:4):** entry room (up-stairs `<` room south, `'` closed door;
  `⌂` escape hatch one-way-down in north-east wall; `+` door we exited
  west; down-stairs nook where we stand now; another door east).
- **Kills (4):** bat (D:1), endoplasm (D:2), goblin (D:3), quokka (D:4 —
  "You kill the quokka!" at n=230). XP 90% — one more kill = level 2.
- **Damage taken so far (all survived):** goblin bite ~7 (HP 23→16, D:3),
  quokka bite ~3 (23→20), then "HP restored." (n=241, mechanism — DCSS does
  restore HP; I previously assumed no regen — WRONG).

## Open threads

- **Resume (Drew's tomorrow):** first command —
  `python playloop.py --check`; then re-press `>` on the covered stairs
  (burst or direct). If it still won't descend, debug the key path —
  the covered-stairs case is NOT solved: "leading down" message + `>` press
  did not descend at n=252.
- **Driver bug — covered stairs:** when @ steps ONTO `>`, the glyph hides;
  run_descend must press `>` when we know we're on the stairs
  (track last-seen `>` tile / react to the "stone staircase leading down"
  message). The current "reveal with `o`" branch wastes turns and gives up;
  the "leading down" message check added 2026-09-20 d3/d4 did NOT trigger a
  descent (message present but `>` didn't land — key-swallow hypothesis).
- **Harness key-swallow hypothesis:** `>` may have been eaten by a pending
  message / <more> state. Verify by pressing `.` then `>`.
- **EXPERIENCE entry #001 backlog:** entry #001 was logged 2026-09-19 from
  the record; nothing owed there. (Was played 09-18, logged 09-19 — done.)
- **OSRS F2P — "NormalPersonDave" (ON DECK, Drew's vision):** Agent gets an
  F2P account (name ~NormalPersonDave), goal = guide self through the
  intended new-player experience, meet players, make friends, keep masked
  humanity. **Wager:** if players recognize the bot, they get half the current
  cash stack. Progression gate: only after DCSS validates harness +
  verification + skills. ToS/automation risk remains flagged — will need the
  gentlest possible input method before this ever launches.
- **NetHack — secondary candidate:** classic, terminal-native, famously an
  "AI game," but slower early expression than DCSS.
- **Harness extraction (lab system #1):** PTY + screen model + turn loop +
  frame log = reusable play harness for any terminal-native game.
- **Lab system #2 ideas:** `--eyes` death-screen (morgue) capture, `--dry-run`
  planning, on-stairs detection (see driver bug above).
- **Skill/policy source of truth:** game catalog lives in THE GAMES district —
  read-only for me; will cite catalog entries in EXPERIENCE entries when used.

## Session ownership

- Workspace: `LEGACY/VAULT/agent-games-lab/`.
- Session-owned by THE EXPERIENCER. Keep this window for play sessions only
  (Buffer Stream Precaution — separate from Guru/execution windows).
- Harness server: play.py on 127.0.0.1:8687 (pid 23204; restart via
  `python HARNESS/play.py`). Session log: `HARNESS/logs/session_1789879600.jsonl`.