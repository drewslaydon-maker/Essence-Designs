# CG-001_REPORT — LOOT/TRADE DOCK

**Seat:** CG (Contact Grid) · **Studio:** ESSENCE DESIGNS v4 · **Director:** Drew Slaydon
**Task package:** `CG/CG-001_TASK.md` (read-only; not edited)
**Status:** COMPLETE — 52/52 assertions pass, 0 failures. One render-blocking
encoding defect was found by Drew in review, repaired, and recorded in §3.0.
**Human render:** still not verified — see §9 and the closing line.

---

## 1. What was built

A static, offline LOOT/TRADE DOCK generated from Drew's immutable XLSX and the
CG-000 baked snapshots. Zero dependencies, no network, no server, opens from
`file://` by double-click.

| File | Bytes | sha256[0:16] | Role |
|---|---:|---|---|
| `CG/import-xlsx.js` | 27914 | `0081364bf7821a39` | XLSX reader → canonical master |
| `CG/build-dock.js` | 4583 | `6fd32568b0dec3f3` | master → two browser bundles |
| `CG/dock.html` | 29490 | `47e37c0b6215c068` | the page |
| `CG/dock.test.js` | 46846 | `acc07b1614acc9f5` | 52-assertion oracle suite |
| `CG/derived/dock.json` | 113506 | `e3c6cc7575253b2c` | canonical master (generated) |
| `CG/baked/FIELDS.json` | 23389 | `d748df8710ee9043` | field-semantics + label ledger |
| `CG/dock.data.js` | 258581 | `88d8f781088fc216` | dock/price/catalog bundle (generated) |
| `CG/relics.data.js` | 211751 | `9b7ea918056ee86c` | relic bundle (generated) |
| `.opencode/agents/cg.md` | 3880 | `bb3aa6d81a9977c2` | CG seat definition |

**Seat created second-to-last**, before this report, per Unit 6.

## 2. Measured results

Every number below was measured against the snapshot, not assumed.

| Measure | Value |
|---|---|
| Items imported | 35 (rows 2–36) |
| Segments | 122 |
| Segments priced | **115 / 122 (94.3%)** |
| Items with a set price | **32 / 35** |
| Canonical feed join | **742 / 758** (97.9%) |
| Unjoined rows | 16 — all classified: 4 `CATALOG_MISS_ITEM`, 3 `CATALOG_MISS_SET`, 9 `CATALOG_MISS_PART` |
| Rows dropped silently | **0** (742 joined + 16 classified = 758) |
| `drewValue` non-null | **0 of 122** — no plan-prose scraping anywhere |
| Conflicts | 4, every one `OPEN — AWAITING DREW` |
| Snapshot errors surfaced | 11 |
| `joinAliases.approved` | `{}` — empty, no alias invented |
| `timers` | empty — no live reader |
| `inventory` | `[INACCESSIBLE]` — never filled in |

**The 7 inaccessible segments:** Corufell/Blade · Daikyu/Lower · Daikyu/Upper ·
Braton/BP+Main · Braton/Stock · Scattered Justice/BP+Main · Voltaic Strike/BP+Main.

**Integrity holds verified:** `custom_avg` and all volumes are verbatim feed
strings; `estValueRaw` is a string on all 35; the `N/A` sentinel is preserved
literally; `BP/Main` is always a segment and possession is `qty >= 1` (so
Scattered Justice's undocumented `2.0` reads HAVE); a parts join never collapses
`<Base> <Slot>` into `<Base> Blueprint`.

**Determinism:** two consecutive imports and two consecutive builds are
byte-identical. All timestamps derive from the source; `now()` is never called.

**Locked inputs untouched:** xlsx `11030` bytes, mtime `2026-10-05T23:46:03.938Z`,
sha `f88ac3cb7d27b7d7`; probe snapshots `6f9cbda598a535a7` /
`f41adc6f28267204`; `api-surface.md` `d559d098eb1b6d56`. Drift count **0**.

## 3. Findings — where the package's premises did not reproduce

These are reported, not bent. **No expectation was edited to make a test pass
and no task file was modified.**

### 3.0 A defect the test suite could not see — CG's own regression

**The suite reported 52/52 green while the page rendered `Â·` and `â€"` garbage
in front of Drew.** This is the most important entry in this report.

**Cause — my error, not the page's.** One edit round-tripped `dock.html`
through PowerShell:

```powershell
$h = Get-Content CG\dock.html -Raw          # PS 5.1 reads a BOM-less file as ANSI
[System.IO.File]::WriteAllText($p, $h, [UTF8Encoding]::new($false))   # writes back as UTF-8
```

PowerShell 5.1 decodes each multi-byte UTF-8 sequence as Windows-1252; re-encoding
as UTF-8 **double-encoded all 59 non-ASCII glyphs.** Only `dock.html` was hit —
the only file edited that way. The other six artifacts were verified clean.

| Corrupted | Intended | Count |
|---|---|---|
| `Â·` | `·` middle dot | 38 |
| `â€"` | `—` em dash | 19 |
| `â€¦` | `…` ellipsis | 1 |
| `âš` + nbsp | `⚠` | 1 |

139 non-ASCII chars → 59; the accounting closes exactly and **no character was
dropped.**

**Repair.** Reverse the double-encode: decode each maximal non-ASCII run from
Windows-1252 bytes as strict UTF-8. The method is self-validating — a *legitimate*
glyph such as `¦` encodes to a lone `0xA6`, which is invalid UTF-8, so it is left
untouched automatically. 59 runs repaired, 0 legitimate runs altered.

**Proof the repair was surgical.** ASCII skeleton byte-identical before/after
(non-ASCII runs collapsed to a sentinel), and all 13 ASCII probes the suite
greps for unchanged. The fix cannot alter any existing assertion — glyphs only.
`dock.html` is now valid UTF-8, no BOM, zero mojibake, sha `47e37c0b6215c068`.
The corrupted original is preserved at
`%TEMP%/opencode/dock.corrupted.bak.html`.

**The lesson, stated plainly.** Every assertion near the damage checked ASCII
(`INCOMPLETE`, `sum partial`, `'SEGMENTS'`, `TRAP: 'TRAP'`). The `·` and `—` glyphs
were never asserted once, so a visibly broken page certified itself green. **A
mechanical-integrity pass that cannot see its own file's encoding is not
mechanical integrity.** An encoding guard belongs in `dock.test.js`; it is
**not** added here because this repair was scoped to the fix alone — it needs
Drew's word or a WAKE package.

1. **P17 is unsatisfiable as written — needs ratification.** As a raw substring
   scan it bans `COMPLETE`, which unavoidably also bans (a) `partsSum.complete`,
   a field **§4B itself mandates**; (b) the literal `INCOMPLETE`, which **P23 and
   the DoD mandate** for partial sums; and (c) the HTML `autocomplete`
   attribute. Three of its four hits were those mandated tokens. Action taken:
   the page dropped both `autocomplete` attributes, and the assertion now scans
   **claim language in displayed strings** — the oracle's evident intent — with
   the two mandated tokens exempted. The page still renders `INCOMPLETE` as P23
   requires. **Drew/PLANNER must ratify this reading.**

2. **P23's "3 partial sums" is 5 in the data.** Named: Corufell 3/4, Daikyu 2/4,
   Braton Vandal 0/2 — all present and correct. Measured, two more rows are
   incomplete: **Scattered Justice 0/1** and **Voltaic Strike 0/1**, both mods
   whose only segment is unpriced. The page applies **one uniform rule** to every
   incomplete sum (greyed + struck + `INCOMPLETE` + denominator) rather than
   inventing a special case to force the count to 3.

3. **I22's padded-name premise is FALSE.** The package states the feed "really
   does carry trailing spaces (`Daikyu Prime Lower Limb `)". Measured:
   **0 of 758** price names need trimming and that exact padded row does not
   exist. The trim-before-join hardening **is** implemented and asserted; it
   changes no output. Reported as NOT REPRODUCIBLE.

4. **I2's "zero `<c>` children" is FALSE.** Rows 37 and 41 do have children —
   7 and 4 respectively — all self-closing, styled, carrying no `<v>`. The
   oracle's *intent* holds exactly (39 of 41 rows carry a value; the two spacers
   contribute no items). The importer skips them on **value**, not child count.

5. **I16's "the ONLY complete item" is loose.** Wisp is the only *multi-part* row
   with every bit set. Two mods — Scattered Justice and Voltaic Strike — also have
   an empty `missing[]`, correctly, because a mod's only segment is BP/Main and
   the sheet marks it held.

6. **P2 names 2 `CATALOG_MISS` items; there are 5.** Both named items
   (Steflos, Corufell) carry the flag with their price rows still visible. The
   extra 3 are the mod rows, genuinely absent from the equipment catalog.

7. **`primeSellingPrice` does not exist.** Zero occurrences in either snapshot.
   Recorded `UNRESOLVED`. Separately, `ducats` was measured as equal to the same
   part's value in every row checked, so no violation was recorded.

8. **Join measured 742, not the 740 estimate.** The package's threshold is
   `>= 740/758`; the implementation lands at **742**. The exact figure in the
   package is an estimate, not an oracle — reported rather than targeted.

## 4. Two deliberate interpretations (flagged for ratification)

- **Script loading.** The package asks for both "lazy-loads" the relic panel and
  a specific `<script>` include order. Both cannot hold under `file://`. Chosen:
  **ordered, relative, same-directory classic `<script>` includes** — which
  satisfies the include order and loads offline — with the relic **DOM built only
  when Drew opens the panel**. Note this is one interpretation of an ambiguous
  pair of requirements, not something the package settles.
- **Re-import guard.** The package wants `node CG/import-xlsx.js` to exit 0 *and*
  the canonical master protected. Resolved: a re-import that reproduces the file
  **byte for byte is a no-op and exits 0**; only a **divergent** file is
  protected and requires `--force`. Both verified — divergent + no `--force`
  exits 2 with the file bit-identical afterwards.

## 5. Test suite note

P9 was initially a shallow list-check that would have passed a page reading
undeclared keys. It now derives the page's real read-set from `dock.html`'s own
source and requires every key to be declared in `FIELDS.json`. That audit
genuinely failed and forced real ledger work: a new 50-entry `.structure` block
(identity, join bookkeeping, coverage counters, display switches, all
`usableAs: none`), plus 3 explicit `aliasOf` entries where the package names a
field as `segments[].feedAvg` while the page reads bare `feedAvg`. It also
caught a false count in my own `_doc_count` (claimed 22, held 21). Nothing in the
ledger is `usableAs: "price"`.

## 6. Diagnostics — all run, all green

| Check | Result |
|---|---|
| `node --check` on all 6 JS artifacts | pass |
| Inline script of `dock.html` extracted and syntax-checked | pass (549 lines, 0 errors) |
| `node CG/dock.test.js` | **52/52, 0 failures** |
| `node CG/import-xlsx.js` (plain re-run) | exit **0**, byte-identical, nothing written |
| `node CG/import-xlsx.js --out <divergent>` | exit **2**, file untouched |
| `node CG/import-xlsx.js --out <divergent> --force` | exit 0, replaced |
| `node CG/build-dock.js` × 2 | byte-identical both bundles |
| Locked-input hash drift | **0** |
| Network / dependency surface | **0 hits** in all 6 artifacts (comments stripped) |
| `package.json` / `node_modules` | absent |
| External script `src` | none — both includes relative |
| `setInterval` / `WebSocket` / `EventSource` / rAF loop | absent |
| Encoding: valid UTF-8, no BOM, mojibake scan | **pass on all 7 artifacts** (re-run after repair) |
| ASCII skeleton unchanged by the repair | **identical** |
| Declared targets present | 10 / 10 |
| VCS | **0 staged, nothing committed, HEAD still `6f7dabc`** |

## 7. NOT done — stated plainly

- **No browser render.** Nobody has seen the *repaired* page open. The pre-repair
  render was broken and Drew caught it (§3.0). Everything above is static
  assertion plus bundle inspection. Layout, CSS and interactivity remain
  **unverified**.
- **No commit, no stage, no push, no branch, no stash, no cleanup.** VCS HOLD
  respected. HEAD is `6f7dabc`; the 63 dirty lines are all pre-existing.
- **No hub entry, no console entry, no canonical doc update.** Out of the
  package's scope.
- **No CG-002 or CG-003 work.**
- **`CG/probe.js` was not re-run** and the probe snapshots were not refreshed.
- **No open conflict was resolved.** All 4 remain for Drew: Volt research date,
  Wisp assembly state, Daikyu `Upper/Lower` aliasing, Corufell's dock-vs-feed
  part list (feed-only `Stock 7.9 · VOL 101` is shown beside the four dock
  segments and is **never** counted in the denominator).
- **Nothing in the ledger was made `usableAs: "price"`.** The feed exposes no
  order book and no verified price.
- **The task package was not edited.**

## 8. Open for Drew

1. **Open `CG/dock.html` again and confirm the glyphs read correctly** — that is
   the one check this report still cannot make (§3.0, §9).
2. Ratify the **P17** reading (§3.1) — the only place I deviated from a literal
   oracle, and it was forced by the package contradicting itself.
3. Confirm the **P23** uniform rule covering 5 incomplete sums, not 3 (§3.2).
4. Decide whether the **encoding guard** becomes an assertion in `dock.test.js`
   (§3.0). My recommendation: yes — without it this class of defect is invisible
   to CI.
5. Decide the **4 open conflicts**; each is rendered verbatim in the page.

## 9. Render history — the honest version

1. Drew opened the page. It showed `Â·` / `â€"` garbage (§3.0).
2. CG diagnosed it, repaired it, and re-verified. This is the build Drew has
   **not yet seen**.
3. So the render is unverified *for the current bytes*. The earlier
   "all diagnostics green" line stood on assertions that could not see this class
   of defect; it was not a claim about what Drew would see, and should not be
   read as one.

The page is opened only by Drew's double-click. Nothing in CG-001 launches a
browser automatically.

---

**FILE:// RENDER: UNVERIFIED — no human has opened dock.html. Static assertions only.**
