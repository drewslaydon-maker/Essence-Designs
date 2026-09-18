# ElderScrollsGuruHelper

A playground-repo Guru for **The Elder Scrolls III: Morrowind (GOTY)** —
progression, questing, exploitation, and efficient gameplay — designed to
run inside **opencode** as a skill-backed assistant.

The trigger for this project (see `00_SPEC_ORIGINAL.md`): prior AI agents on
Google AI Studio habitually fed wrong mechanics, useless tips, and lost
Drew's actual goals. This project exists to be the opposite.

## What's inside

```
ElderScrollsGuruHelper/
  00_SPEC_ORIGINAL.md     # original placeholder spec (kept as artifact)
  01_PROJECT_MANIFEST.md  # this file
  knowledge/              # the Guru's brain (source of truth)
    00_ACCURACY_DOCTRINE.md     # anti-false-info operating law
    01_CHARACTER_CREATION.md    # races / birthsigns / classes / builds
    02_SYSTEMS_AND_LEVELING.md  # attributes, derived stats, leveling math
    03_PROGRESSION_MONEY_TRAVEL.md
    04_FACTIONS_AND_GUILDS.md
    05_MAIN_QUEST_WALKTHROUGH.md
    06_EXPLOITS_AND_EFFICIENCY.md
    07_COMBAT_MAGIC_ENCHANTING.md
    08_SESSION_TEMPLATE.md
  session/                # per-character playthrough logs (created on use)
```

## How to use it

1. **Run opencode from anywhere inside `C:\Users\Andrew\Projects`** (or copy
   the skill folder to `~/.config/opencode/skills/` to use it from any
   directory).
2. Type a Morrowind/Elder Scrolls question — the **elder-scrolls-guru**
   skill auto-loads and follows the session protocol
   (`knowledge/08_SESSION_TEMPLATE.md`).
3. First real question of a session: the Guru boots your character sheet and
   goal via `session/current_character.md`.
4. Restart opencode after building so the skill is registered.

Skill file: `C:\Users\Andrew\Projects\.opencode\skills\elder-scrolls-guru\SKILL.md`

## Accuracy stance (read this before trusting anything)

- Baseline: **GOTY in OpenMW**. `[VERIFIED]` = cross-checked vs UESP/OpenMW.
  `[VERIFY]` = believed, check in-game. `[OPENMW DIFF]` = engine difference.
- The Guru quotes the knowledge base; it does not "remember" the game.
  Unknown → it says "not verified" instead of inventing.
- Sources: UESP Morrowind pages, OpenMW research wiki & forums, Bethesda
  help articles, in-game journal/tooltips (final arbiter).

## Roadmap (per 00_SPEC_ORIGINAL goals)

- [x] Morrowind core knowledge base (build-time verified)
- [x] Goal-capture session protocol + persistent character log
- [x] opencode skill wiring
- [ ] Oblivion knowledge layer (same doctrine, different tables)
- [ ] Live playthrough log review ("tell me what I did wrong last session")
- [ ] Quest-checklist generator (spoiler-tiered) per faction
- [ ] Egg of time: plug into the elder-scrolls-lore-codex web app

## Changelog

- 2026-09-17 — Created. Verified ~all core mechanics against UESP +
  OpenMW research; moved spec into the project; added the opencode skill.