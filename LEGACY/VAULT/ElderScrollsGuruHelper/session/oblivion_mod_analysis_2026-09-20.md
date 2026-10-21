# Oblivion GOTY — Install & Mod Analysis

> Analysis date: 2026-09-20, by 0-Wake (PLANNER) under explicit Drew
> directive. **READ-ONLY inspection — no game files were touched or changed.**
> Source of truth: filesystem inspection of
> `C:\Program Files (x86)\Steam\steamapps\common\Oblivion` +
> `C:\Users\Andrew\Documents\My Games\Oblivion`. UESP labels apply
> (`[VERIFIED]` / `[VERIFY]`) per the Guru accuracy doctrine.

---

## Environment
- **Game:** The Elder Scrolls IV: Oblivion GOTY (Steam), English, installed at
  the path above. `Oblivion.exe` + official DLC esps present. [VERIFIED]
- **OBSE:** `obse_1_2_416.dll` / `obse_loader.exe` (build 22.13, crc A2408F04),
  launches via Steam wrapper. obse_loader.log: "Launching Steam version of
  Oblivion." [VERIFIED]
- **Mod manager:** **Vortex** — `Data/vortex.deployment.json`,
  `__folder_managed_by_vortex` markers throughout, `omod conversion data`
  folder. Last deploy activity 2026-09-19~20. [VERIFIED]
- **Last known launch:** 2026-09-20 13:18 (EngineBugFixes.log /
  WalkBlessed.log / RendererInfo.txt all stamp 13:18; Save 4 was loaded). [VERIFIED]
- **Docs\My Games\Oblivion:** `Oblivion.ini` (+ `.base` / `.baked` — Vortex
  ini management), `BlendSettings.ini`, `RendererInfo.txt`, `Saves\`. [VERIFIED]

## ACTIVE plugins (deployed in Data root)
Order shown = Vortex/mod-manager stamps (oldest first). The game's own applied
order can be confirmed in-game via Data Files. [VERIFY final order in-game]

1. `Oblivion.esm` (master)
2. `Unofficial Oblivion Patch.esp` (UOP) — the standard comprehensive bugfix patch. [VERIFIED]
3. `DLCShiveringIsles.esp` — **85-BYTE STUB** (see AMBER #1) 
4. `DLCHorseArmor.esp` · 5. `DLCOrrery.esp` · 6. `DLCVileLair.esp`
7. `DLCMehrunesRazor.esp` · 8. `DLCSpellTomes.esp` · 9. `DLCThievesDen.esp`
10. `DLCBattlehornCastle.esp` · 11. `DLCFrostcrag.esp` — all real content esps (sizes 47 KB – 729 KB). [VERIFIED]
12. `Knights.esp` — Knights of the Nine (2.2 MB, real content). [VERIFIED]
13. `Balanced Creatures.esp` — creature difficulty rebalance. [VERIFY what it changes in-game]
14. `NewThirdPerson.esp` — third-person camera/animation overhaul. [VERIFY]
15. `BetterBlocking.esp` (+ `BetterBlocking.ini`) — blocking combat overhaul. [VERIFY]

Official BSA archives for all DLC/Knights are present and untouched. [VERIFIED]

## ACTIVE OBSE plugins (`Data\OBSE\Plugins\`, all confirmed loaded in obse.log)
| Plugin | Ver | What it does |
|---|---|---|
| EngineBugFixes.dll | 2.22 (2019) | ~70 engine fixes. Magic-relevant: BoundItemEvaluationFix, MagicCastFailureSoundFix, SpellPurchaseCrashFix, SummonAILocationTargetFix, CombatBuffSpellSelectionFix (adds ReflectDamage to combat-buff pool). Base = rock-solid for a long run. [VERIFIED via log] |
| oblivion_display_tweaks.dll | 1 (2020) | Tick Fix, FPS fix, FOV fix, fast exit, borderless windowed (per its log: all enabled). [VERIFIED via log] |
| sdr.dll | 1.36 (2018) | **Sneak Detection Redux** runtime — detection overhaul (LOS, footweight, volume, detection hooks). Loaded, but see AMBER #2 (its esps are NOT deployed). [VERIFIED via log + folder] |
| MenuQue.dll | 16 (Kyoma) | UI/menu framework command set. [VERIFIED] |
| OBSE_EnhancedCamera.dll | 1 (2014) | Enhanced first/third-person camera. [VERIFIED] |
| WalkBlessed.dll | 1 (2019) | Walk/run animation toggle. [VERIFIED] |
| FastExit2.dll | (2009) | Fast quit on exit. [VERIFIED] |

## Vortex-staged / present but NOT deployed (sitting inside Data)
- **`SDR - Full Installer\`** — full SDR package: `SDR.esm` + `SDR.esp` (plus
  worldspace variants SDR_Oblivion/SDR_Nehrim, detection-formula overrides,
  ini tweaks, blindness/shaders/spell-icons, DDLS textures). **None of the
  esps are deployed to Data root** → SDR dll runs but the content esps are
  off. See AMBER #2. [VERIFIED via folder listing]
- **`Oblivion Ram Optimization\`** — the RAM-optimization project: `4gb
  patch.exe` + readme. Staged; the exe patch on Oblivion.exe must be run
  manually to apply. Check: is Oblivion.exe already LAA-patched? [VERIFY]
- **`Docs\OblivionReloaded\`** — Oblivion Reloaded docs present, but **no
  OblivionReloaded.dll / ini deployed** at game root or Data → OR is NOT
  active. SDR's "for Oblivion Reloaded" options are therefore moot until OR
  is actually installed. [VERIFIED via absence]
- **`src\FastExit\`** — FastExit plugin source (harmless).
- **`INI\Migck\`, `INI\New Third Person.ini`** — ini-content mods deployed by
  Vortex into Data\INI. [VERIFIED]
- **`P1D Low-Poly Grass Readme.txt`** — stale readme only; no active mod
  evidence. [VERIFIED]
- Root `readme.txt` (2019, 91 KB) + `Credits.txt` (2026-09-19) — mod
  documentation; not active content. [VERIFIED]

## Saves (per-character truth)
- `Save 3 — Lau Kai — Imperial Prison, Level 1, Playing Time 00.34.18` (03:37)
- `Save 4 — Lau Kai — Imperial Prison, Level 1, Playing Time 00.44.10` (05:49)
- obse.log shows Save 4 loaded and its co-save handed **58 "mod owning array
  was removed from load order"** warnings → the load order changed between
  that save and the current deploy. See AMBER #3. [VERIFIED via log]

---

## FLAGS

### 🟡 AMBER #1 — Shivering Isles is OFF (firm finding)
`DLCShiveringIsles.esp` is **85 bytes** — header-only stub (author `nmcdyer`),
no content records. The real SI esp is ~2.3 MB. SI quests/world (Nibenay
gate, the Isles) are not loading. The SI BSAs are intact but unused.
**Options (Drew's call, no action taken):** (a) leave it off — some runs
prefer it; (b) restore the real esp via **Steam → verify integrity of game
files**, then re-deploy in Vortex. Do NOT hand-edit the stub.

### 🟡 AMBER #2 — SDR dll active, SDR esps not deployed (inconsistent)
The SDR runtime loaded (`sdr.dll` + `sdr.log` shows detection hooks setup)
but its `SDR.esm`/`SDR.esp` are still in the staged installer folder, not in
Data root → the full stealth overhaul is half-installed. **Choose:** enable
the SDR esm/esp in Vortex (sneak system overhaul — fits a trickster) **or**
disable/remove the sdr dll. Half-state risks weird detection behavior.
[VERIFY in-game whichever way]

### 🟡 AMBER #3 — Load order changed mid-run
Save 3/Save 4 were made under a different mod set than the current deploy
(58 discarded-array warnings). **Recommendation:** finalize the mod list now,
then decide — continue from the pre-birthsign Save 4 or start a fresh Lau Kai
(Level 1, ~44 min; cheap to redo). Consistent saves beat salvage here.

### 🟢 GREEN — base is healthy
- UOP present; EngineBugFixes 2.22 + Display Tweaks Tick Fix on; DLC esps real
  except SI. [VERIFIED]
- **No magicka-regen mods, no leveling overhauls, no birthsign mods detected**
  → the Atronach build math on the Lau Kai sheet is unchanged (195 pool,
  no-regen fuel loop, Stunted Magicka intact). [VERIFIED]
- BetterBlocking/NewThirdPerson/Balanced Creatures are cosmetic/combat-layer;
  they don't touch magic math. [VERIFIED by absence of relevant records]

### ℹ️ INFO
- No Bashed Patch.esp — fine at this plugin count (no leveled-list-heavy mods
  beyond Balanced Creatures); could add later if the list grows.
- `BlendSettings.ini` present (source unconfirmed — ENB/SweetFX-style or a
  display mod's; no active enbseries/ in root seen). [VERIFY]
- Vortex last deploy 09/20 ~13:18 (matches last launch).

## Recommended next steps (all Drew's calls)
1. Decide SI: keep off or Steam-verify to restore. 
2. Decide SDR: deploy fully or drop the dll.
3. Apply (or skip) the 4gb RAM patch.
4. THEN finalize the mod list and settle the Lau Kai save question.
5. Stamp the Lau Kai sheet → terminal Wake review.