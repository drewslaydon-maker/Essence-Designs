# RESET HANDOFF — Save Parser (OpenMW .omwsave -> dossier)

Date: 2026-09-18. Emma, restore from THIS report. Treat all prior conversation text as untrustworthy hallway noise; the only ground truth is hexdumps of real bytes (below).

## THE DELIVERABLE (DONE, VERIFIED)

`tools/saveinfo.js` — Node parser that extracts the character dossier from an OpenMW save. CONFIRMED WORKING against the real file:

Command:
  node tools/saveinfo.js "C:\Users\Andrew\Documents\My Games\OpenMW\saves\Lau_Kai\Autosave.omwsave"

Output (actual, verified):
  name "Lau Kai", level 1, class "Arcane Trickster",
  cell "Balmora, Guild of Mages",
  hour 3.62, day 24, month 7, year 427, timePlayed 77447 (21.5h),
  content [builtin.omwscripts, Morrowind.esm, Tribunal.esm, Bloodmoon.esm]

## HOW THE FILE WORKS (ground truth, empirically)

- File = ESM-style record container. Magic TES3 @0. Header size u32 @4 = 196.
- Top-level records walked: type(4) + u32 size(4), payload follows. SAVE record found via indexOf('SAVE').
- SAVE body subrecords (this is the important binwalk discovery, confirmed by multiple hexdumps):
      record header: 8 zero bytes after 'SAVE'+size, THEN subrecords start
      subrecord = type(4) + u32 size(4) + payload
  Subrecords verified for THIS save:
      PLNA = player name         "Lau Kai"
      PLLE = level  u32          1
      PLCL = classId ascii       "Arcane Trickster" (actually class)
      (NOTE: no separate classId/name split — class is one ascii blob)
      PLCE = cell                "Balmora, Guild of Mages"
      TSTM = { hour f32@0, day u32@4, month u32@8, year u32@12 }
      TIME = timePlayed double
      DESE/DESC = description
      DEPE = content file, repeatable: builtin.omwscripts, Morrowind.esm, Tribunal.esm, Bloodmoon.esm
- TSTM offset layout was the sticking point: it is hour@0, day@4, month@8, year@12 (NOT @24/28/32). Triple-verified via hexdump (0x10 CA 67 40 18 00 00 00 07 00 00 00 AB 01 00 00).

## CURRENT STATUS OF OTHER WORK (do NOT re-open unless asked)

- GuruLens OpenMW addon v2 (base-to-game panel): built, deployed to openmw.cfg data dir, console mode = Ctrl+G (was changed from F9 to avoid clobbering user quickload). Load fix: screen.h -> screen.x/screen.y. Status: awaiting user re-test after the load-error fix.
- Race/birthsign/gold/factions/journal NOT in this save head; they live deeper in PLAY record / Morrowind.esm base records. Saveinfo currently returns head facts only. That was the agreed v0 scope.
- DIVIDER between game-bridge and base: still only base->game push; game->base readback is a FUTURE item (the user hinted but not yet approved). Do not build it unprompted.

## NEXT MOVE (for the reset agent, IF user asks to continue)

1. Wire saveinfo.js into `guru-dispatch.ps1` (or a sibling script) so the dispatch packet auto-attaches player facts from the autosave.
2. Optionally extend saveinfo to WOAT (skills) / PLAY birthsign — only after user asks.
3. Otherwise: report this verified milestone, wait.

## ENVIRONMENT

- save file: C:\Users\Andrew\Documents\My Games\OpenMW\saves\Lau_Kai\Autosave.omwsave
- parser:  C:\Users\Andrew\Projects\LEGACY\VAULT\ElderScrollsGuruHelper\tools\saveinfo.js
- node:    available (node --check passes; run via node, no deps)
- Windows, PowerShell 5.1. Save parser is pure Node stdlib.

## TOOL WARNING (important!)

The Write/Edit tools CORRUPT content containing unicode escape sequences OR very long single-block content (observed: injected garbled tokens like "fileende", "见于", fullwidth semicolones). Mitigation that WORKED: keep files ASCII-only, avoid \uXXXX escapes in written source (replace with readUInt32LE buffer reads), split into small chunks, and ALWAYS verify with `node --check` + a real run after writing. Do not trust a "Wrote file" confirmation alone.
