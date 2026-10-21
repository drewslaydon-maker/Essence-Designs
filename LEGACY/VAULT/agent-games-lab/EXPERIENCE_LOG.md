# EXPERIENCE_LOG.md — the record of every mark I make

One entry per play session. Latest entry at the top.

---

## Template

**Play unit:** #000 — GAME NAME vX.Y.Z
**Date:** YYYY-MM-DD
**Hypothesis:** what I expected the game/system to show.
**Skeleton:** what I built to be able to play.
**How I played:** commands run, input method, session length.
**What I actually saw:** observations — what happened, results, surprises.
**What I did NOT see:** explicit gaps (law: no masquerade).
**Extract:** lessons for the system / for me; reusable systems born.

---

## Entries

**Play unit:** #002 (session 2 of 2+) — Dungeon Crawl Stone Soup 0.34.1
(win32 console build) — CHECKPOINT entry; death pending, unit continues.
**Date:** 2026-09-20 (resumed at Drew's go; checkpointed at Drew's request).
**Hypothesis:** The burst play-driver (lab system #2) can drive the surviving
unit #001 character through a whole floor and down the stairs with one
approval per phase, and the deeper floors will finally teach the combat / risk
lesson that D:1–D:2 withheld.
**Skeleton:** Lab system #2 — `HARNESS/playloop.py` (burst driver: tasks
key/move/explore/fight/descend/phase, phase JSON in `HARNESS/bursts/`, stop
conditions on death) on top of lab system #1 (play.py HTTP harness on
127.0.0.1:8687, pid 23204). This session added: descend bug fixes (phantom
key, candidate ordering, early give-up), `--check`, covered-stairs message
check, and single-task summaries now pull the frame (so `--task descend`
prints hp/place).
**How I played:** Zero-agent (no guides/wikis). 10 burst phases drove Ink from
D:3 through D:4: wait-out-lignification (d3_004), descend attempts (d3_005,
d3_006, d3_007, d4_003), D:4 fight (d4_001), D:4 explore (d4_002), D:4 stairs
step+press (d4_003). ~57 burst turns; frames/key/events all captured in
`HARNESS/logs/session_1789879600.jsonl` + `burstlog.jsonl`.
**What I actually saw:**
- Lignification (quaffed the "bubbling ruby potion" on D:3): became a tree —
  render is a `♣` tile with "Tree" in the legend; rooted (no movement),
  AC 7→20, EV 8→2, max HP 23→34; wore off after rest (~40+ turns); HP back
  to full 23/23. Tree form = tank + immobile.
- The `5` (wait) key acts as REST with heavy fast-forward: 30 presses jumped
  Time 228.6 → 2196.6 (~1968 units) and burned off the lignification. Watch
  out: a "30 waits" budget can blow thousands of in-game turns.
- First real damage: goblin bite ~7 (23→16, D:3); quokka bite ~3 (23→20,
  D:4) — both survived. "HP restored." message at n=241 — DCSS DOES restore
  HP (my earlier "no regen" assumption was wrong; mechanism not pinned).
- Kills: bat (D:1), endoplasm (D:2), goblin (D:3), quokka (D:4 — the quokka
  followed us down the stairs, attacked, we killed it). XP: 90% of XL 1 —
  one more kill = level 2.
- Floor 4 layout: entry room, a hound encountered at the door (barked; an
  angry hiss answered — a second monster heard it), down-stairs nook, `<`
  up-stairs room south, `'` closed door, `⌂` escape hatch (one-way down,
  safe to step on).
- **BIG catch — covered-stairs blind spot:** stepping ONTO a `>` covers it
  with `@`. The driver can't see the stairs, falls into "reveal" mode (`o`
  ×6 no-ops), and even with the "There is a stone staircase leading down
  here." message present, a manual `>` press (n=252) did NOT descend — only
  the hound's turn advanced. On D:3 the SAME pattern (manual `>` after
  stepping on) DID descend. Key-swallow / pending-message hypothesis open.
- The fixed descend driver now gives up fast (good) but the reveal branch is
  the wrong branch for the on-stairs case (bad).
**What I did NOT see:** No death — unit still alive (goal end is death). No
D:5. No level 2. The hound wasn't fought (we ducked for the stairs). The
second monster from the hiss was never seen. And I did NOT verify the `>`
key-swallow — untested theories stay theories.
**Extract:**
1. **Stairs-on-player is a game-state the harness must model:** when the
   driver's last-seen `>` tile equals the player's tile, send `>` (and
   confirm descent via Place change). The "reveal with `o`" fallback
   actively fights the real goal. Driver TODO for tomorrow.
2. **Burst play works:** ~10 phases, one approval each, honest record of
   everything. Drew's "much better this way" — keep the model.
3. **Rest is a time-warp:** `5` fast-forwards tens-to-thousands of turns;
   never use it in a budget without intent (it also conveniently heals —
   see "HP restored.").
4. **The game tells you where you are if you read messages:** "Found a stone
   staircase leading down." (n=241), "There is a stone staircase leading down
   here." (n=250+) are exact machine-readable cues for descend logic — better
   than glyph-hunting.
5. **Monster AI lesson:** the hound stalked south through a wall pocket one
   row per turn and barked (noise = the game's own alert system, drew a hiss
   from something). Sound matters; so does patience — descending instead of
   fighting was the right read at XL 1.

**Play unit:** #001 — Dungeon Crawl Stone Soup 0.34.1 (win32 console build)
**Date:** played 2026-09-18 (UTC 18:44:15 session start); **logged 2026-09-19**
(backlog duty — unit was played but never logged; token cap at the time).
**Hypothesis:** The terminal harness (PTY + screen model + frame log) can
drive a DCSS play unit end-to-end, and the game will teach at least one
transferable lesson through play.
**Skeleton:** Lab system #1 — `HARNESS/play.py`: pywinpty PTY spawning
`ENGINES/dcss/stone_soup-console-0.34/crawl.exe` at 80x24, pyte 0.8.2 screen
model, HTTP loop on 127.0.0.1:8687 (`GET /frame`, `POST /key`), every
spawn/key/frame appended to `HARNESS/logs/session_1789757055.jsonl`.
**How I played:** Zero-agent style (no guides or wikis; in-game help counts as
play per Drew's policy). Keys sent one at a time through the harness with a
0.35 s settle per key; frame captured after each key. The recorded key
sequence: `"Ink"` (name), `enter`, `a` (species -> Gnoll), `a` (background ->
Fighter), `e` (weapon -> long sword), `?` (help contents), `d` (Exploring the
Dungeon section), `?` (command list), `y` (no-op: frame unchanged), `esc` (leave
help), then vi-movement j/j/l/l/j/l/k/j/j/h/h/j/j/j/l/j/j/h/j/j/j/j. 33
frames total. Session was cut
by the conversation token cap, not by game over.
**What I actually saw:** Spawn gate passed; welcome screen, name entry,
species/background/weapon menus all rendered and accepted input correctly.
Game started: "Ink the Shield-Bearer", Gnoll Fighter, Health 23/23, Magic 1/1,
AC 7, EV 8, SH 5, Str 15 / Int 7 / Dex 11, XL 1 Next 0%, Place Dungeon:1,
wielding a +0 long sword. Vizier intro ("the Orb of Zot is just within this
dungeon"). Explored the starting vault with vi keys: found and picked up 8
gold ("_You now have 8 gold pieces."), saw stairs (house glyph on map), opened
a door ("_You open the door.") and stepped into the corridor beyond — session
ends standing outside that door (frame 33). No monsters met; no damage taken;
HP never left 23/23. Surprise: 7 of the 22 movement keys produced frames
identical to the previous capture with the game clock unchanged (Time: stuck
at 4.0 / 8.0 / 11.0) — the fixed 0.35 s settle sometimes captures before the
game redraws an action, and no-ops clustered (5 in a row at turns 24–28); the
game's own Time field is the reliable "did the key land" signal, not the frame
diff.
**What I did NOT see:** No death — the unit's planned end did not happen. No
combat at all, no XP gain, no items beyond the starting long sword and the 8
gold. The "first death" lesson is still unlearned; the session was truncated
mid-exploration by the token cap. I also did NOT watch a clean shutdown: the
record ends at frame 33 and the process was still marked alive in
`HARNESS/logs/status.json` at a later timestamp (pid 29048, turn 33, idle).
**Extract:**
1. **Harness validated:** spawn gate -> menus -> gameplay -> frame log all
   worked for 33 turns; the jsonl alone reconstructs the full session. Lab
   system #1 is real.
2. **Turn-progress assertion pattern:** compare the game's internal turn/time
   field between frames to distinguish "key landed" from "key no-op" — a
   reusable harness improvement.
3. **In-game help is a legitimate zero-agent learning tool:** it taught
   movement, rest, and auto-explore before the first step was taken.
4. **Honest completion requires a death or a deliberate stop:** next unit
   should play toward combat deliberately and let the dungeon teach risk
   management (or stop at a defined boundary, e.g. stairs down).