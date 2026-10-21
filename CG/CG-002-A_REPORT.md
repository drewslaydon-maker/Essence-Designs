# CG-002-A REPORT — CRAFT MODEL GENERALIZATION

- Date: 2026-10-07
- Builder: 1-Stone (DOER seat) · Task package: `CG/CG-002-A_CRAFTMODEL_TASK.md`
- Status: HALTED — complete, awaiting Drew. Point DOER at this file for routing.

---

## 0. Baseline hashes (captured in Unit 0, before any regen)

| Artifact | BEFORE (SHA-256) | AFTER (SHA-256) |
|---|---|---|
| `CG/derived/dock.json` | `80627A755D9C0121B7D9898E355A99673653854FD2C558636E54A398AF63F7C7` | `89D89819BE3F1AB80DB60F243942B839C04359B33EA55B5B731CAA3840BF0115` |
| `CG/dock.data.js` | `1110E370F55C84A6CF448AF0BD21F0BBC86586BC179CF5EBB4E87489E8FF940C` | `81B4E5CE3834DDB120399F3007A6E279D931819E87E894DA865FBD7411AE6310` |
| `CG/relics.data.js` | `9B7EA918056EE86C87E1B3C6DB246F0EFDA5A683B528958ABEC9D808D6DB1C8C` | `9B7EA918056EE86C87E1B3C6DB246F0EFDA5A683B528958ABEC9D808D6DB1C8C` (identical — expected) |

---

## 1. What was DONE (per unit)

### Unit 0 — reset banner (no build)
- `CG/CG-002_TASK.md`: banner line inserted as line 1 (before the title).
- `CG/CG-002_RESUME.md`: same banner inserted as line 1.
- `CG/CG-002_REPORT.md`: **does not exist** → banner skipped silently, exactly as the package allows.
- Baseline hashes captured (table above). Nothing regenerated in Unit 0.

### Unit 1 — override table (NEW)
- Created `CG/drew/CRAFT_OVERRIDES.json` verbatim from the package, contents:
  `["_doc", "Corufell Prime"]` — **only** the Corufell entry, no inferred entries for any other item.

### Unit 2 — importer generalization (`CG/import-xlsx.js`)
- Header READS/WRITES comment updated: now also reads `CG/drew/CRAFT_OVERRIDES.json`; still writes only `dock.json`.
- Added `CRAFT_OVERRIDES_IN` + `loadCraftOverrides()`:
  - refuses loudly if the table is missing, `parts` is not a list, length is not 1..8, a name is empty/non-string, or a name is duplicated (8 = cap, not a feature);
  - `_doc` key skipped.
- Part reading: `xlsxParts` keeps the exact CG-001 3-cell scan (E/F, G/H, I/J) verbatim, `N/A` preserved. When the override names the item, its `parts` list is authoritative for the SLOT LIST; slots 1..3 take the xlsx cell qty, an override part beyond the cells takes `qty: null` (`have` follows from existing arithmetic). Non-overridden items take `xlsxParts` unchanged (same object shape/key order).
- `segmentSlots`, `qtyFor`, `have`/`missing`/`partsSum` arithmetic: unchanged — they already generalized over `item.parts`.
- Overflow guard, re-import guard: both verified live (Unit 3).
- `timers` / `inventory` / `lifecycle` blocks: **not touched**. (`lastSync` — see finding F1.)
- Also updated, same file, for truth: `conflicts._doc`, the `PART_LIST_CONFLICT` entry (status → `RESOLVED — DREW 2026-10-06 (4+1 BP)`, added `note`, `countedInPartsSum: true`, `gap` rewritten as historical + resolved; `dockSays`/`feedSays`/`measuredFeedOnly` history **retained**), the `drewValue` slot-count comment (122 → 123), and the `corufellReport` console line (was printing a now-false "feed-only Stock="; now prints the Stock **segment**: `Stock=7.9 MISSING`).

### Unit 3 — regenerate derived + baked
Four commands, in order, from repo root — outputs in §2.

### Unit 4 — page generalization (`CG/dock.html`)
- DEEP `COLS` is now built at page load: `MAX_PARTS` = widest `item.parts` on the dock (4, from Corufell), so part columns are `p1/q1 … p4/q4`; every other row leaves `p4/q4` blank.
- Column tuples carry a sortable bit; **part columns are display + filter only, sorting keeps static keys** (their headers get `class="static"`, no `onclick`).
- `rowVals` fills part cells from `it.parts.forEach(...)` — no `parts[0..2]` hardcodes left in the file (verified by grep).
- Static columns, the market-read column (same label, `static`, non-sort/non-filter), the filter, the expand-row (`colSpan = COLS.length + 1`), SEGMENTS table, GLANCE verdict: all preserved and dynamic.
- **Page-side judgment call (reported, not hidden):** `segmentLines()` used to append the `FEED-ONLY PART` line for the Corufell conflict. Once Stock is a real slot that line would print Stock **twice** and label a dock slot "feed-only". It is now gated: rendered only while the conflict status does **not** begin `RESOLVED`. The renderer itself stays for any future unresolved feed-only conflict (oracle P26's static check still holds).
- Verified: no other hardcoded 3 anywhere in the page's HTML/JS (grep `parts\[`, `p1/q3`, `=== 3` → only `MAX_PARTS` code).

### Unit 5 — tests (`CG/dock.test.js`)
Updated oracles, each carrying `// CRAFT RULING 2026-10-06: Corufell 4+1 BP`:

| Oracle | Before | After |
|---|---|---|
| I16 spot | Corufell missing `["BP/Main","Blade","Receiver"]` | `+ "Stock"` |
| I17 | `115/122`, 122 slots | `116/123`, 123 slots (pct 94.3 unchanged; 7 unpriced unchanged) |
| I19 | Corufell sum `37.3 · 3/4 · incomplete` | `45.2 · 4/5 · incomplete` |
| I20 | "null on all 122 slots" | 123 slots |
| I23 | all 4 conflicts `OPEN — AWAITING DREW` | 3 OPEN (`JOIN_ALIAS`, `VOLT`, `WISP`) + `PART_LIST_CONFLICT` `RESOLVED` |
| P22 | `115 priced + 7 inaccessible = 122` | `116 + 7 = 123` |
| P23 | Corufell partial `3/4` (+ its findings text) | `4/5` |
| P26 | `countedInPartsSum === false` | `=== true` + status asserted `RESOLVED` |

Added 6 oracles, new section `CG-002-A · craft model (C1–C6)`:
- **C1** Corufell `parts.length === 4`, slot 4 `Stock`, `qty === null`, `have === false`
- **C2** segment `Stock`: `feedAvg 7.9`, `have false`, matched `Corufell Prime Stock`
- **C3** `partsSum` `45.2 / 4 / 5 / complete false`, 5 segments
- **C4** `missing` includes `Stock` (exact: `["BP/Main","Blade","Receiver","Stock"]`)
- **C5** `PART_LIST_CONFLICT` entry: `RESOLVED`, carries `DREW 2026-10-06`, `countedInPartsSum true`, `dockSays`/`feedSays` history intact
- **C6** regression: the **34** other items each have exactly 3 parts, slots `1,2,3`

Tally line updated: `58 (23 I + 29 P + 6 C)`. Header comment updated. **No baseline oracle was silently removed; no expectation was bent to match data.**

---

## 2. Unit 3 command outputs (verbatim)

**1) `node CG/import-xlsx.js --force`**
```
input : C:\Users\Andrew\Desktop\WF10_04-TRADEDOCK.xlsx
output: C:\Users\Andrew\Projects\CG\derived\dock.json
--- dock.json divergence vs existing file ---
  CHANGED: items
  CHANGED: conflicts
  CHANGED: segmentCoverage
  CHANGED: lastSync
--- end divergence ---
--force: replacing the divergent master.
wrote C:\Users\Andrew\Projects\CG\derived\dock.json
items=35  segments=116/123 (94.3%)  priceable=32/35  join=742/758  unjoined=16  conflicts=4  errors=11
corufell: Blade=[INACCESSIBLE]  Stock=7.9 MISSING
```
(`lastSync` divergence is finding F1 below.)

**2) `node CG/import-xlsx.js`**
```
input : C:\Users\Andrew\Desktop\WF10_04-TRADEDOCK.xlsx
output: C:\Users\Andrew\Projects\CG\derived\dock.json
dock.json unchanged (byte-identical re-import) — nothing written
verified C:\Users\Andrew\Projects\CG\derived\dock.json
items=35  segments=116/123 (94.3%)  priceable=32/35  join=742/758  unjoined=16  conflicts=4  errors=11
corufell: Blade=[INACCESSIBLE]  Stock=7.9 MISSING
EXIT=0
```

**3) `node CG/build-dock.js`**
```
wrote C:\Users\Andrew\Projects\CG\dock.data.js
wrote C:\Users\Andrew\Projects\CG\relics.data.js
joinCoverage: 742/758  unjoined=16  {"CATALOG_MISS_ITEM":4,"CATALOG_MISS_SET":3,"CATALOG_MISS_PART":9}
catalogMiss: ["Steflos Prime","Corufell Prime","Braton Vandal","Scattered Justice","Voltaic Strike"]
segments: 116/123 (94.3%)
priceable: 32/35
errors surfaced in the relic panel: 11
EXIT=0
```

**4) `node --check CG/import-xlsx.js CG/dock.html CG/dock.test.js`**
```
EXIT=0   (no output)
```
Note (F4): Node's `--check` validates only the first script — the remaining args are passed as argv, so this command did **not** actually parse `dock.html` or `dock.test.js`. `dock.test.js` is executed end-to-end by the suite (58/58); `dock.html`'s inline JS is covered only by static P-oracles.

**DoD #1 — `node CG/dock.test.js` → `assertions: 58  passed: 58  failed: 0`, EXIT=0.**
The six findings it prints (I2, I16 note, I22, P2, P17, P23 note) are the pre-existing CG-001 measured findings, unchanged — none was edited, none was bent.

---

## 3. Exact before/after

**segmentCoverage**
| | before | after |
|---|---|---|
| pricedSegments | 115 | **116** |
| totalSegments | 122 | **123** |
| pct | 94.3 | **94.3** (116/123) |

**Corufell Prime**
| | before | after |
|---|---|---|
| parts | Blade, Handle, Receiver (3) | Blade, Handle, Receiver, **Stock** (4); Stock `qty null / have false` |
| segments | BP/Main, Blade, Handle, Receiver (4) | + **Stock** (5) |
| partsSum.value | 37.3 | **45.2** (6.3 + 6.9 + 24.1 + 7.9) |
| pricedSegments / totalSegments | 3 / 4 | **4 / 5** |
| complete | false | **false** (Blade has no feed row → `[INACCESSIBLE]`) |
| missing | `["BP/Main","Blade","Receiver"]` | `["BP/Main","Blade","Receiver","Stock"]` |
| conflict `PART_LIST_CONFLICT` | `OPEN — AWAITING DREW`, `countedInPartsSum false` | `RESOLVED — DREW 2026-10-06 (4+1 BP)`, `countedInPartsSum true`, history retained |

Stock segment measured: `feedAvg 7.9 · have false · matchedName "Corufell Prime Stock"` (EXACT_SET_NAME). Blade measured `feedAvg null` — renders `[INACCESSIBLE]` with reason, **never a fabricated number**.

**Isolation proof (DoD #4):** diffed regenerated `dock.json` against `derived/dock.seed.json` (the pre-craft import-pure freeze):
```
top-level keys changed: ["items","conflicts","segmentCoverage"]   (no keys added)
items changed: ["Corufell Prime"]                                 (only Corufell)
```
Plus my own diff read of the three edited sources vs their pre-edit copies (kept in temp): every changed line in `dock.html` is either the feed-only gate or the dynamic-part-column block; `import-xlsx.js` and `dock.test.js` diffs are exactly the changes listed above. **The other 34 items and the rest of the page are untouched.**

---

## 4. Findings, unexpected divergence, refusals — plain statement

**F1 — UNEXPECTED DIVERGENCE: the mandated `--force` regen dropped `lastSync` from `dock.json`.**
`--force` reported `CHANGED: lastSync`. The importer never writes `lastSync`; the block had been injected into the working `dock.json` by `CG/console-server.js::ensureInit()` (CG-002 work) and held only null values: `{ _doc:…, bagScrub: null, perItem: {} }`. Replacing the file with pure importer output removed it. **Zero data lost** (nothing but nulls), and the console re-seeds it on next boot — it is self-healing by design. I did **not** hand-restore it: hand-editing the canonical master would break the byte-identical re-import guard (Unit 3 command 2 would then refuse, exit 2), and writing `lastSync` from the importer is exactly what the package forbids. Original values quoted above for restoration if Drew wants them written back some other way. **No `timers`/`inventory`/`lifecycle` content was changed.**

**F2 — Corufell still carries the item flag `PART_LIST_CONFLICT`** (page chip "PART LIST CONFLICT"). The package made the *conflicts[] entry* RESOLVED but did not name `item.flags` as a target, so flags were left untouched — history, not a lie, but the chip is arguably stale now. **Drew's call:** drop the flag in CG-002-B, or keep it as a marker.

**F3 — "15th YOUR MARKET READ column" shifts index.** With dynamic part columns the table is 4 + 8 + 4 = 16 data columns + market read = **17 columns** when `MAX_PARTS = 4`. At the 3-part baseline it is still exactly the 15th. The column itself (label, static, non-sort, non-filter, hover-full-text) is preserved verbatim; its in-code comment now says "trailing column (the 15th at the 3-part baseline)". Package wording read as "keep the column", not "pin its index at 15" — which is impossible alongside N-part columns. Flagging rather than guessing.

**F4 — syntax gate scope** (see §2 note 4): the exact command exits 0 but only parses `import-xlsx.js`. Reported rather than "fixing" the command — no extra commands beyond the package were run.

**F5 — adjacent stale docs, NOT touched (forbidden/un-named):**
- `CG/baked/FIELDS.json` prose still says "The 4 OPEN — AWAITING DREW discrepancies" and "115/122 priced" — stale after this toss; FIELDS.json is explicitly FORBIDDEN here.
- `CG/derived/dock.seed.json` still holds the pre-craft model (seed freeze; un-named target).
Suggest both ride along in a later package.

**Refusals:** none. No oracle failed; no expectation was bent; no forbidden path was written.

---

## 5. Definition of done — checklist

1. `node CG/dock.test.js` — **58/58 green, exit 0** (52 baseline + 6 additions; none removed). ✅
2. Corufell renders in DEEP with 4 part pairs incl. **Stock**, and in SEGMENTS as 5 slots with Stock AVG 7.9 counted in PARTS SUM **45.2 · 4 of 5** — data verified, render path statically verified (C1–C3, P22, P26). ⚠ *file:// render not yet opened by a human — the suite prints "FILE:// RENDER: UNVERIFIED" as always.*
3. `Blade` still `[INACCESSIBLE]` with its reason (`(no feed row for this slot)`) — `feedAvg` measured `null`, asserted in I17/I19/P26. ✅
4. The 34 other items byte-for-byte as the CG-001 seal — **C6** regression oracle + diff vs `dock.seed.json` (only Corufell changed) + my own diff read of the page. ✅
5. `CG/drew/CRAFT_OVERRIDES.json` exists with **ONLY** the Corufell entry. ✅
6. No FORBIDDEN paths touched — mtimes confirm: `baked/FIELDS.json` (10/06), `console-server.js` (10/06), `console.test.js` (10/06), `probe.js` (10/05), probes (10/05), xlsx (10/05). No git commands, no web calls, no `/chat`, no adjacent fixes. ✅

**Not done (out of scope by design):** CG-002-B (loot log), CG-002-C (timers), FIELDS `_doc_count` (F1 of the old CG-002), F5's stale docs, restoring `lastSync` (F1), dropping the Corufell flag (F2), and the human file:// render pass.

---

## 6. HALT

Planted. **Flag Drew: "point DOER at CG-002-A_REPORT.md".**
Not starting CG-002-B. Two calls need Drew before the next toss: **F1** (`lastSync` disposition) and **F2/F3** (flag chip + market-read column index).

*Console/VCS note: no external consoles to mirror (offline, zero-network package); no git commands run — the package forbids them, which supersedes the studio's VCS-ready default for this leaf. Report exactly what was done and not done; masquerade is forbidden.*
