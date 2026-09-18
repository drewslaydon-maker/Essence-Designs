# ICONS — ESSENCE DESIGNS identity icon system

The approved purple/gold icon family, materialized as real Windows folder
icons (and as the source used by the `EXPLORE/` client).

## Files

| File | Role |
|---|---|
| `icons.json` | Icon definitions (tone + glyph primitives, 24x24 design grid) |
| `build-icons.ps1` | Zero-dep WPF generator -> multi-size PNG-in-ICO (16–256) |
| `assignments.json` | Node -> icon map (Tier-1 meaningful folders) |
| `apply-icons.ps1` | Writes `desktop.ini` + `icon.ico` into each node, sets attrs, refreshes cache |
| `remove-icons.ps1` | Full revert (removes the two files, clears folder ReadOnly) |
| `ico/` | Generated `.ico` assets (32 icons) |

## Rebuild / apply / revert

```powershell
powershell -ExecutionPolicy Bypass -File build-icons.ps1
powershell -ExecutionPolicy Bypass -File apply-icons.ps1
powershell -ExecutionPolicy Bypass -File remove-icons.ps1
```

No external tools: icons are rendered with WPF (`System.Windows.Media`) and
packed into ICO containers by `build-icons.ps1`.

## Icon language

- `seedling` ED / studio root · `gem` ENGINE · `streams` ED_FLOW · `blueprint` INFRA / FRAMEWORKS
- `compass` DESIGNS · `key` DISCOVERIES · `star` INFLUENCES · `ticket` ticket-schema
- `logbook` LOGS / CAPTAINS_LOG · `calendar` IRL_PLANS · `film` VIDEOS · `broadcast` STREAM
- `heart` JUJU / MaMa · `chalk` TEACHING
- `dice` GAMES · `flame` ACTIVE · `crown` MAIN · `wheel` **LAG** (gold) · `pillar` SUPPORTING
- `shard` BROKEN · `stack` ON_DECK · `leaf` PARKED · `anvil` TOOLKIT/ARMORY · `telescope` OBSERVATORY
- `map` EXPLORE · `vault` LEGACY/VAULT · `crate` archived projects · `orb` ES GURU · `tome` lore codex · `gear` retired hub · `tombstone` Graveyard · `stone` default (not-for-people)

## Scope rule

**Tier-1 meaningful nodes only** — structural and administrative folders
(districts, log rooms, game parcels by placement state, toolkit, top-level
vault projects, graveyard, EXPLORE, root). Deep source and per-project lore
subfolders are intentionally left default; extend `assignments.json` to cover
them if wanted.

Windows note: individual *files* cannot carry custom icons natively (only
per-file-type associations, which are global). This system is folders-only by
ruling.
