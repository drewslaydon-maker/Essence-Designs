# BREW the WORLD — Combat & Encounter System

*Working reference document. Fills the gap flagged in the VS blocker check — nothing on combat existed in the current codex before this pass. Companion to the cast bible, style bible, macro structure, and vertical slice plan.*

---

## Core Design Principle

**A fight is never the first option — it's what happens after the reasoning window closes without resolution.** This is the combat system's version of the same governing thesis running through everything else in this codex: the Orchard sells the player a singular, inevitable crisis; the true path is always relational first. Monsters in this game are not spawns, they're consequences — Hollows are citizens the Picker process broke, state-produced trauma made manifest — and the system has to treat them that way mechanically, not just narratively. If combat played identically to a generic RPG encounter, the UI-never-announces-wrongness principle from the style bible would be doing all the moral work alone. It shouldn't have to. The encounter structure itself should already be arguing the thesis before a single line of dialogue does.

---

## Fennel's Weapon: The Scythe

Fennel fights with a **scythe** — a harvesting tool, not a weapon designed for combat. This is the load-bearing detail, not flavor: every fight is visibly, physically an extension of her actual job. She's not trained for violence; she's doing the only physical motion she knows at a larger, more desperate scale. The harvest/brew/sell loop that structures the whole game structures her one combat tool too — nothing in her kit exists outside the shopkeeping logic the rest of the game runs on.

**Combat framing implications:**
- No separate "combat stance" animation set that reads as trained or practiced. Her scythe swings should carry the same motion-language as her harvesting animations, just faster and more strained.
- The scythe is never upgraded into something more weapon-like (no blade swaps, no "war scythe" skin) — visual escalation happens through wear and damage to the same tool, not through it becoming a different, more combat-legitimate object. If it changes at all across acts, it should look more used, not more lethal.

---

## Spellcasting: Repurposed Tools, Not Trained Magic

Fennel's magic is **belief-powered**, per the world logic, and it manifests through her as improvised repurposing of shop tools and brewing ingredients — never as a discrete "spell" cast from a menu of trained abilities. Closest touchstone: Isaac Clarke in *Dead Space* — engineering tools weaponized under pressure, not a soldier's arsenal. Fennel's version is the potion-shop equivalent: a ladle becomes a parry, a sachet of something volatile becomes a thrown consumable, a preservation charm meant for ingredients gets flung at a Hollow mid-fight because it's the only thing in her hands.

**Why this matters structurally:** it keeps combat legible as an extension of the brewing interface rather than a separate system bolted on. The style bible is explicit that the brewing screen has zero visual differentiation between a recipe that stays local and one that becomes war supply — that "no red flag" logic should hold in combat too. A thrown ingredient doesn't get a combat-specific icon or rarity glow that a shop ingredient wouldn't also have. Same visual language, same object, just deployed under different stakes.

**Practical framing for build:**
- Every combat "ability" should map to a named shop or brewing object that already exists (or plausibly could) in Fennel's inventory — not an invented magical implement.
- No spell-menu UI with cooldown timers or mana bars if it can be avoided — closer to "what's in her hands/satchel right now" than a prepared loadout. (Full inventory-as-loadout system can be scoped more precisely once the VS is in engine; the constraint to hold onto is that it never looks like a wizard's spellbook.)

---

## The Reasoning Window

**Every Hollow encounter opens with a non-combat window before combat becomes available at all.** This is the mechanical enactment of the game's whole "the true path is talking to people" thesis, applied to the one enemy type the game has.

- On encountering a Hollow, the player is dropped into a reasoning/observation beat first — reading the Hollow's behavior, environment details, remaining fragments of what they used to be (posture, a half-recognizable object they're carrying, a repeated gesture). No combat input is available during this window.
- The window can resolve multiple ways depending on what the player notices and does: de-escalation, retreat, or the Hollow disengaging on its own. Combat is not the "correct" resolution — it's the fallback state, mechanically framed as a failure to find another way, not a neutral first option sitting alongside the others.
- Once combat is entered (because the window closed without another resolution, or the Hollow attacks first), it plays like a real, sometimes-necessary fight — not a punishment or a game-over-adjacent state. The point isn't to make combat feel bad to engage in; it's to make sure the player had to walk past a door marked "try something else" to get there.

**VS-specific note:** the vertical slice's one Hollow encounter is explicitly scoped as **systems/combat demo only** — the reasoning window still gates entry into combat mechanically (so the system is real and tested), but the actual humanizing reveal (recognizing who a Hollow used to be, the Lemon/Fox/Barley content) is reserved for much later. Day 1's Hollow should feel like a genuine unknown the player is cautiously reading, not yet a specific tragedy — the window does real mechanical work without the narrative payload landing yet.

---

## Outcome Tracking: Diegetic, Not a Meter

Per the standing UI/HUD rule (no visible relationship, trust, or reputation meters — this document extends that rule to combat outcomes specifically): **how the player handles Hollow encounters is never scored, tallied, or surfaced as a number anywhere in the interface.**

- Consequences surface through what NPCs say and do differently later — a villager who heard how a Hollow encounter went reacts accordingly, dialogue options shift, a character mentions something in passing. No combat-log summary screen, no "mercy" or "aggression" stat.
- This mirrors exactly how Sparrow's, Ash's, and Kirkwood's swings already work per the macro structure — accumulated player choice that the player has to read like they'd read a real person's shifting trust, not track like a resource bar. Combat outcomes should feed into the same invisible accumulation logic, not a separate, parallel system.
- Practically for the VS: even in the single demo encounter, resist the urge to add a placeholder score or debug counter that's meant to be removed "later." If it's visible once, cutting it before ship is easy to forget. Build it invisible from day one, even in a systems demo.

---

## What This Doesn't Cover Yet (flagging, not scoping now)

- Exact input/animation-frame combat feel (turn-based vs. real-time vs. hybrid) — not decided, and not a VS blocker since the slice only needs one encounter to prove the reasoning-window-into-combat pipeline, not a fully tuned combat system.
- Full inventory-as-loadout mapping (which specific shop objects become which specific combat tools) — worth a dedicated pass once the VS's actual ingredient/tool roster is locked in the harvest/brew build.
- Whether other characters (Fox, Ash, Barley) ever fight alongside or against the player, and whether they'd use this same scythe/repurposed-tool language or their own combat identity — deferred; not needed for a single-player Day 1 slice.

None of these block tomorrow's build. The three locked pieces above — scythe as harvesting tool, spells as repurposed objects, reasoning window before combat, diegetic-only outcomes — are enough to implement the one VS Hollow encounter end to end.

---

*Compiled reference — carries forward alongside Claude's memory of this project.*
