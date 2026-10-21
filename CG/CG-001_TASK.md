# CG-001 — THE LOOT/TRADE DOCK PAGE (TASK PACKAGE · RE-CUT)

**Leaf:** CG-001 · **Executor:** DOER (1-Stone) · **Planted by:** PLANNER (0-Wake) ·
**Date:** 2026-10-05 · **Supersedes:** the CG-001 package planted earlier today

**Why this was re-cut.** Ruling F (Google Sheets) is **overturned by Drew** — Excel
costs money he will not spend. The dock becomes a **local page**. Then Drew produced the
thing that makes it real: **`C:\Users\Andrew\Desktop\WF10_04-TRADEDOCK.xlsx`** — his
hand-built dock, 35 rows, with possession, values, plans, and a Scratchpad already
designed for the drop decision.

**The deliverable is a page he can open tonight and decide a drop with.**

**Preserved constraints (unchanged, still binding):**
- **HUB STAYS OUT** (ruling 4) — zero hub files, this leaf and after.
- **VCS HOLD** — no `git add`, no `git commit`, no amend.
- **Zero invented fields.** `[INACCESSIBLE]` is valid and preferred.
- **READ-ONLY on all game data/files.** Writes **only** under `CG/`.
- **NEVER WRITE TO DREW'S XLSX.** It is a read-only seed (ruling H).

---

## 0A. WHAT CHANGED — and one correction I owe Drew

**I reported "6 of 17 targets priceable; 11 have no public price."** That was measured
against CG-000's 17-item intake list. Against **Drew's actual 35-row dock**:

| | |
|---|---|
| **PRICEABLE** (≥1 live price row) | **32 / 35** |
| **NO PUBLIC PRICE** | **3 / 35** — `Braton Vandal`, `Scattered Justice`, `Voltaic Strike` |

Those three are exactly his **`6 - Market`** tier — the liquidating side plus the
long-term hold. **The gap is far smaller than I said.** For 32 of his 35 targets CG has a
real historical price and volume signal. Say this plainly in the receipt; the earlier
figure was scoped to the intake, not to his dock, and the dock is the truth.

### 0B. ⚠ `custom_avg` vs Drew's own `Est Value` — ruling C, new evidence

Comparing his stated ranges against the feed's Set averages:

| Item | Drew's `Est Value` | `custom_avg` Set | In range? |
|---|---|---|---|
| Sybaris Prime | 74–80p | 72.3 | below |
| Steflos Prime | 70–75p | 71.3 | **inside** |
| Baza Prime | 69–70p | 68.1 | below |
| Valkyr Prime | 69–70p | 69.1 | **inside** |
| Ivara Prime | 62–65p | 60.1 | below |
| Corufell Prime | 55–70p | 60.0 | **inside** |
| Nautilus Prime | 46–50p | 47.8 | **inside** |
| Ninkondi Prime | 61–65p | 61.4 | **inside** |
| Afentis Prime | 37–40p | 38.6 | **inside** |
| Fulmin Prime | 40–45p | 41.8 | **inside** |
| Daikyu Prime | 14–15p | 14.8 | **inside** |

~20 of 30 land **inside** his stated range; the rest sit at or just under his low end.
**None sits systematically above it.** An average of *asking* prices would sit **above**
what people actually pay. This leans toward `custom_avg` tracking real transactable
value — **but it is NOT a settle, and here is the killer caveat:**

> ### ✅ SETTLED BY DREW — 2026-10-05. NOT CIRCULAR. CG-001a IS DEAD.
>
> **Drew, verbatim:** *"EST values are based on sell listings on warframe.market, and my
> own analysis based on volume, and market interactions like if it is frequently
> undercut, or if it is bought by noobs like my scattered justices tend to be."*
>
> This is **decisive**, and it settles ruling C:
>
> 1. **Not circular.** His `Est Value` is an **independent observation** of the **live
>    asking-price population** — the exact channel the public API provably cannot reach
>    (CG-000: zero order routes, `getItemOrders.php` 403, no `warframe.market` data in
>    the feed). The feed's `custom_avg` is a **separate instrument**. Agreement between
>    them is therefore **evidence, not tautology.**
> 2. **`custom_avg` is a FAIR-VALUE reference, not an inflated one.** ~20 of 30 land
>    inside his listing-derived range; the rest at or just below his low end; **none
>    sits systematically above it.** DOER's CG-000 §4 warning — *"if `custom_avg` is an
>    average of asking prices it sits above the real floor and any undercut computed
>    from it is trivially easy"* — **does not bite here.** The number is representative
>    of the market he actually reads.
> 3. **Therefore: the empirical settle leaf (CG-001a) is CANCELLED.** It existed only to
>    answer this question, and the question is answered by better evidence than it would
>    have produced. Do not build it. Do not re-open it.

**⚠ THE OVERRIDE IS PRECISE — do not over-read it.** `custom_avg` is upgraded from
*"opaque reference"* to **"fair-value reference."** It is **still**:
- **never a price, never a floor, never a market** — it is an average, and averages are
  not floors;
- **never a recommendation on its own** — Drew's `Est Value` and `Live Action Plan` remain
  authoritative, per ruling F;
- **`*_vol` remains TREND-ONLY.** Unchanged. Never a price input.

**What genuinely changed:** `AVG_DELTA` against `custom_avg` is now a **commercially
meaningful signal** rather than a suspect one — so the page **may show the delta**, and
must show it **labelled and beside his number, never instead of it.** See UNIT 4 §7A.

### 0C. ⚠ AKBOLTO PRIME — the live example of why that rule exists

`Akbolto Prime` is Drew's **`5 - F-Tier`**, `Est Value = TRAP`, plan
*"Market trap (5 trades). Sell Recs for plat."* The feed's `Akbolto Prime Set`
`custom_avg` is **73.5**.

A page that showed a bare number would tell him to sell a set worth 73.5p that he needs
to **dismantle for Recs**. That is a real, specific, expensive failure. Hence **ruling I.**

---

## 0. THE RULINGS (binding on this leaf)

**A. MISMATCH → SURFACE AND FLAG, NEVER DROP.** Catalog = identity; API = priceability.
Now live: **two of Drew's own S-tier sets** — `Steflos Prime` and `Corufell Prime` — are
priced but **denied by the 17,672-item catalog** (measured: 3 items / 15 rows total —
Citrine, Corufell, Steflos). Corufell's Set `today_vol` is **228**, its Receiver **151**:
one of the most liquid sets in his dock, invisible to any catalog-keyed engine.
**Dropping either would silently kill a live buy plan.**

**B. TRADE ENGINE → SPLIT, deferred to CG-002.** `PRICE` lane = average-delta only, never
an undercut (no order book exists). The token `undercut` may appear in CG artifacts
**only** as the disclaimer: *"DOCTRINE_REF "1-Plat Undercut" — NOT COMPUTABLE (no order
book); AVG_DELTA only."*

> **🆕 B-SCOPE CORRECTION (Drew, 2026-10-05).** PLANNER previously wrote that the 1-Plat
> Undercut is *"not computable anywhere, ever."* **That was too broad and is corrected
> here.** The precise truth: **it is not computable from ANY automated source** — CG-000
> proved the order routes are dead and no order book is reachable. It **IS** computable
> **from Drew's word**, because Drew reads the live `warframe.market` **sell listings**
> himself (§0B). So: **CG alone never computes an undercut. CG + Drew's listing read
> does.** This is one principle, not two — Drew is already the sole source for timers and
> inventory; he is now also the sole source for the live floor. CG's job is to **hold both
> numbers, timestamp them, and show the delta** — never to derive the floor itself.

**C. `custom_avg` → FAIR-VALUE REFERENCE. `*_vol` → TREND ONLY.** *(Upgraded by Drew's
§0B answer — read §0B before coding.)* `custom_avg` is a representative average of the
asking-price population, independently corroborated. It is **still never a price, never a
floor, never a market**, and **never a recommendation on its own** — ruling F precedence
is unchanged. `AVG_DELTA` against it may be **displayed** (§7A). `*_vol` is unchanged:
**trend only, never a price input.**

**D. JOIN KEY → `base#partSlot`, strip a trailing `" Blueprint"`.** Unchanged — **and now
independently corroborated by Drew's own dock**, which types parts as `Chassis`,
`Neuroptics`, `Systems`, `Barrel`, `Receiver`, `Carapace`, `Cerebrum` — the **same
convention as `filtered_items`, not the price feed.** Three sources now agree; only the
price feed appends ` Blueprint`.

**E. TIMERS → CG-owned countdowns, Drew-seeded.** **Out of scope this leaf** — no timers,
no `dock.json.timers` seeding, `VOLT-RESEARCH-DATE` stays recorded OPEN. Deferred to
CG-002. **The page must not display any timer.**

**F. LOCAL PAGE, NOT SHEETS.** *(Drew, 2026-10-05 — supersedes PLANNER ruling F.)*
**Ruling F's PRECEDENCE TABLE SURVIVES INTACT** — it governs *authority*, not transport:
identity → CATALOG · priceability → API · `price.public` → API raw, **conflicts surface
both and flag `PRICE_CONFLICT`, CG never picks** · `value.drew` → **DREW, authoritative** ·
timers/inventory → DREW_WORD only.

**G. JULIA = A TAG, NOT AN ACCOUNT.** *(Drew, confirmed 2026-10-05.)* Drew's own xlsx
already carries a **`Juju Rsv`** column — exactly this mechanism, already his design.
Map it to `wantedBy: "JULIA"`. **No second account, no second inventory, no Julia
timers, no Julia profile scope.** CG-000's one-account ruling (Drew only) is unchanged.

**H. 🆕 THE XLSX IS A READ-ONLY SEED. `dock.data.js` IS THE MUTABLE MASTER.**
Import is **one-way**. CG-001 **never writes to `WF10_04-TRADEDOCK.xlsx`** — not now, not
ever in this leaf. Rationale: it is a binary, hand-maintained, shared master; a binary
write is unreviewable and unrecoverable; and he does not need it, because he will change
things **by talking to CG**. If Excel ever returns, re-import is a separate, explicit leaf.

> **⚠ THE DIVERGENCE HAZARD — read before any future re-import.** The moment Drew tells CG
> something the xlsx does not say — *"crafted the last Wisp piece"*, a corrected
> `marketRead`, a sharpened spread — `dock.json` **diverges from the seed, permanently and
> by design.** The xlsx is frozen at its `2026-10-05 18:46:03` state forever.
>
> **Consequence: a naive re-import would silently destroy chat-sourced state.** Every
> `have` flip, every `marketRead`, every plan revision then lives **only** in `dock.json`.
> There is no second copy.
>
> **So any future re-import leaf must:** (1) **diff** seed-vs-`dock.json` and print it,
> (2) **never blind-overwrite** — merge field-by-field and keep `dock.json` authoritative
> for anything Drew has since stated, (3) state in its own report that a divergence existed
> and how it was resolved. **`import-xlsx.js` must ship a guard refusing to overwrite an
> existing `dock.json` without `--force`,** and `--force` must print the diff loudly.
> This leaf ships the guard; it does **not** ship the re-import path.

**I. 🆕 DREW'S `Live Action Plan` IS ALWAYS RENDERED ADJACENT TO EVERY NUMBER.**
Never a bare `custom_avg` on screen. See the Akbolto trap in §0C. If the plan cell is
empty, the page shows the number **greyed and marked `NO PLAN`** — never clean.

**J. 🆕 SNAPSHOT AGE IS ALWAYS VISIBLE.** The price feed is a snapshot stamped
`2026-10-05T22:28:04Z`. Every price on the page shows its age. A stale number must never
look live.

**K. 🆕 `filtered_items.errors[]` (11 rows) IS SURFACED.** Strings like
`"Axi A22 IS MISSING DROPS"`. If he judges a relic run on a table the feed flags, he
misjudges it. The relic panel must show these warnings.

**L. 🆕 `marketRead` — DREW'S MARKET-INTERACTION ANALYSIS, VERBATIM, NEVER PARSED.**
*(Drew, 2026-10-05.)* His `Est Value` is only half his method. The other half is
**behaviour he observes on `warframe.market` and cannot get from any feed**:

> *"my own analysis based on volume, and market interactions like if it is frequently
> undercut, or if it is bought by noobs like my scattered justices tend to be"*

That is a real, high-value signal class — **exit liquidity / demand quality.** It has no
field in the catalog, no field in the API, and **none in his xlsx**, because it is *why*,
not *what*. Add `marketRead` (string, verbatim, `null` when he has not said one).

- **It is free text. Do NOT build a taxonomy of market behaviour.** Do not invent
  `demandQuality`, `exitLiquidity`, `noobDemand`, or any typed sub-field. He writes prose,
  CG stores prose and prints it. **Inferring structure from his sentences is the exact
  failure mode the doctrine forbids.**
- **`Scattered Justice` is the worked example and it is load-bearing:** it has **zero**
  public price rows and is `[INACCESSIBLE]` — yet his own sheet says **`Est Value 8p`** and
  **`Live Action Plan: "Actively listed on market."`** It is one of his most reliable
  flippers *because* it sells to inexperienced buyers fast. **The page must therefore
  never let `[INACCESSIBLE]` imply "no value."** Render the reason and his `marketRead`
  together.
- Seed `Scattered Justice.marketRead` from his sentence above, verbatim. **Seed nothing
  else** — every other `marketRead` starts `null` until he says it.

**M. 🆕 `missing[]` IS A FACT ABOUT THE SHEET — NEVER A TASK LIST.** Ruling L's neighbour,
and the most-used block on the page: **31 of the 32 real-part items are incomplete**, so
this renders constantly. Two hard limits:

- **The heading is `YOUR BITS SHOW MISSING`, never `YOU NEED`, `REQUIRED`, `NEEDED`, or
  `COMPLETE`.** `missing[]` is arithmetic on his own `0.0` bits. It is **not** a
  recommendation, and it is **not** a foundry state (ruling `WISP-ASSEMBLY`).
- **⚠ THE SYBARIS CONTRADICTION — the reason this rule exists.** `Sybaris Prime`
  (ordinal 3) measures `missing: ["BP/Main","Barrel","Receiver"]`, yet his own plan reads
  **`"Sells on Barrel (30p). Hunt aggressively."`** — he intends to **flip the Barrel**,
  not complete the set. So the bits and the plan **genuinely disagree**, and a page that
  renders a big `MISSING` list under that plan hands him two contradictory instructions at
  3am. **Resolution: the plan is authoritative (ruling I) and `missing[]` must render
  *adjacent to it*, never in place of it.** Where a plan names a part as a **sell/flip**
  target, the page **must not** imply that part is a completion target.
- **Never derive ordering, priority, or "closest to done"** from `missing[]`. No progress
  bars, no sort-by-fewest-missing as a default, no "1 part away" badges. That is CG
  inventing a goal. If he wants that, it is a leaf.

**N. 🆕 PER-SEGMENT VALUES — MEASURED, VIABLE, AND THE HIGHEST-VALUE BLOCK ON THE PAGE.**
*(Drew, 2026-10-05: "individual values for each segment of a set on the dock, and
therefore in the CG matrix… important for me to be able to see the segment prices on a
quick check and deep check.")*

**Measured ground truth (PLANNER, from the real file + the real 758-row feed):**
**`115 / 122` dock segment slots have a feed price row = `94.3%` coverage.** This is not a
nice-to-have; it is the most decision-dense surface on the dock.

**`parts[]` gains, per segment:**

| field | source | label | rule |
|---|---|---|---|
| `slot` | Drew's cell | — | `Blueprint` \| `Chassis` \| `Barrel` \| … verbatim |
| `have` | `1.0`/`0.0` | `HAVE` / `MISSING` | ruling M: **fact, never `YOU NEED`** |
| `feedAvg` | feed `custom_avg` | **`AVG (UNDOC)`** | **never `price`/`floor`/`market`** |
| `feedVolToday` | `today_vol` | `VOL TODAY` | trend only |
| `feedVolYest` | `yesterday_vol` | `VOL YEST` | trend only |
| `matchShape` | join | shown on hover | `<Base> <Slot>` \| `<Base> <Slot> Blueprint` \| `<Base> Blueprint` \| `NONE` |
| `drewValue` | **Drew, chat** | **`YOUR VALUE`** | **`null` everywhere in CG-001** — see below |

**⚠ TWO BLUEPRINT SHAPES — measured, and they are not interchangeable.** The feed contains
**both** `"<Base> Blueprint"` (the Warframe BP) **and** `"<Base> <Slot> Blueprint"` (a
**part-specific** BP, a separate tradeable item). Example: `"Sybaris Prime Blueprint"`
`6.5 / vol 7` vs `"Wisp Prime Systems Blueprint"`. **The join MUST try, in order:**
`"<Base> <Slot>"` → `"<Base> <Slot> Blueprint"` → (slot `Blueprint` only) `"<Base> Blueprint"`.
`matchShape` records which one hit. **Never strip a trailing ` Blueprint` before trying the
part-specific form** — doing so silently collapses two different items into one.

**⚠ `drewValue` IS `null` ON ALL 122 SLOTS. DO NOT SCRAP HIS PROSE.** His plans state part
prices in English — *"Sells on Barrel (30p)"*, *"Receiver (25p) bottlenecks set"*,
*"Buy Barrel (9p) to flip"*, *"Hold Chassis (19-22p)"* — and it is tempting to regex them
into `drewValue`. **Do not.** That is inference, it is the exact failure mode of ruling L,
and a mis-parsed `"Chassis is jackpot"` would write a **number he never said**. Seeds come
**only** from Drew saying a value in chat. **Plant a `DREW_VALUE_SEED_REQUEST` list in the
report** — every segment appearing in his plan prose, unparsed, so he can dictate in one
pass. That list is a **request**, not a parse.

**`PARTS SUM` — show it, and do not let it lie.** Sum the `feedAvg` of segments **that have
one**, then declare the denominator: **`PARTS SUM 59.2 · 4 of 4 SEGMENTS`** (Sybaris).
**If any segment is `[INACCESSIBLE]`, the sum is PARTIAL and must render greyed and
struck, with the count: `PARTS SUM 37.3 · 3 of 4 SEGMENTS · INCOMPLETE`.** Never silently
omit an unpriced segment — a 3-of-4 sum presented as a total is how Corufell gets
undervalued by a whole segment. `PARTS SUM` is **arithmetic on `reference` fields, so it is
`usableAs: "none"`** — display it beside `AVG (UNDOC)` set and `YOUR EST`, **never interpret
the gap.** The set-premium insight is Drew's to draw.

**Never use `primeSellingPrice` for any segment value** — it equals `ducats` in every row
checked (ruling on `primeSellingPrice`). The only platinum-ish per-segment field is
`custom_avg`.

**GLANCE (quick check):** a `SEGMENTS` sub-block inside the verdict block, one compact
line per segment, `Barrel · MISSING · AVG 34.3 · VOL 12`. Compact enough for the no-scroll
rule; **the whole point is that a 3am drop names its own value instantly.**

**DEEP (deep check):** every dock row expands to its segment table — slot, `HAVE`/`MISSING`,
`AVG (UNDOC)`, `VOL TODAY`, `VOL YEST`, `YOUR VALUE` — plus the `PARTS SUM` line.

**O. 🆕 JOIN ALIASES AND PART-LIST CONFLICTS — SURFACE, NEVER RESOLVE.** The per-segment
join exposed two real defects. Both are **`conflicts[]` entries**, not silent fixes.

> **O1 — `JOIN_ALIAS_PROPOSED`: Daikyu.** Drew's dock says **`Upper`** / **`Lower`**; the
> feed says **`Upper Limb`** / **`Lower Limb`**. Result: 2 of Daikyu's 4 segments render
> `[INACCESSIBLE]` while the data sits right there. **Trimming whitespace is mechanical and
> always allowed** — and note the feed strings carry **trailing spaces**
> (`"Daikyu Prime Lower Limb "`), so trim unconditionally. But **`Upper → Upper Limb` is a
> SEMANTIC ALIAS = INFERENCE.** Do **not** apply it. Instead emit
> `{ id: "JOIN_ALIAS_PROPOSED", item: "Daikyu Prime", proposed: [["Upper","Upper Limb"],["Lower","Lower Limb"]], status: "OPEN — AWAITING DREW" }`.
> **When Drew approves, CG records the alias in an explicit, Drew-authored `joinAliases{}`
> block** — a human decision, data, not a guess buried in code. Until then Daikyu honestly
> shows `[INACCESSIBLE]`.
>
> **O2 — `PART_LIST_CONFLICT`: Corufell.** Drew's dock lists **`Blade`**; the feed has
> **`Stock`** (Handle and Receiver agree). **Do not decide which is right.** Corufell is his
> most liquid S-tier set (`today_vol 228`), so this must be visible, not smoothed over:
> `{ id: "PART_LIST_CONFLICT", item: "Corufell Prime", dockSays: "Blade", feedSays: "Stock", agree: ["Handle","Receiver"], status: "OPEN — AWAITING DREW" }`.
> **Both names render**, each with its own status — `Blade [INACCESSIBLE]` beside
> `Stock 7.9 · VOL 101`. **CG never silently substitutes one for the other.**

---

## 1. MANDATE

Turn Drew's existing dock into a **page he can open, glance at, and decide a drop with
tonight** — then keep current by talking to CG. Every number carries its source and its
age. Nothing on it is inferred.

---

## 2. SCOPE LOCK

| # | Target | Kind | Purpose |
|---|---|---|---|
| M1 | `CG/import-xlsx.js` | CREATE | zero-dep xlsx reader → dock items + scratchpad |
| M2 | `CG/derived/dock.json` | CREATE | **canonical mutable master** (CG writes; generated by M1's first run) |
| M3 | `CG/build-dock.js` | CREATE | emits the browser bundles from `dock.json` + CG-000 snapshots |
| M4 | `CG/dock.data.js` | CREATE · **GENERATED** | dock + 758 prices + eqmt + errors, as a script include |
| M5 | `CG/relics.data.js` | CREATE · **GENERATED** | relic reward tables, loaded on demand |
| M6 | `CG/dock.html` | CREATE | **the page** |
| M7 | `CG/baked/FIELDS.json` | CREATE | field-semantics ledger (labels + honest `usableAs`) |
| M8 | `CG/dock.test.js` | CREATE | zero-dep tests — importer oracle + page-data integrity |
| M9 | `.opencode/agents/cg.md` | CREATE | the seat (**second-to-last**, see UNIT 6) |
| M10 | `CG/CG-001_REPORT.md` | CREATE | the receipt |

### LOCKED OUT

- **`C:\Users\Andrew\Desktop\WF10_04-TRADEDOCK.xlsx` — READ-ONLY. NEVER WRITTEN.**
  (ruling H.) Record its size + mtime at Unit 0 and re-check at exit: **must be identical.**
- **ALL hub files (`WASH/**`)** — byte-identical mtimes as proof.
- `CG/probe.js`, `CG/baked/probes/**`, `CG/baked/api-surface.md` — CG-000's, read-only.
  **Do not re-run the probe.**
- `CG/CG-001_TASK.md` (this file) — **read-only while executing.** No edits.
- The 3 existing `CG/drew/*.md` — untouched.
- `.opencode/agents/**` **except** creating `cg.md`. `opencode.json`, `AGENTS.md`,
  `ED/**`, `03_THE_GAMES/**`, `LEGACY/**`, `MUSIC/**`.
- **No server, no port, no install, no build toolchain, no `package.json`,
  no `node_modules`, no CDN, no webfont, no network in the page.** The page must work
  from `file://` on a machine with no internet.
- **`CG/baked/DOCTRINE.md` and `CG/drew/DRAW-002_RULINGS.md` are DEFERRED to CG-002.**
  Do not build them here. This leaf is scoped to getting Drew live.
- **VCS HOLD** — no `git add`, no `git commit`, no amend.

---

## 3. UNIT 0 — Baseline gate (record BEFORE any write)

1. `node --version` → v24.x.
2. `git status --short` → record. **No commit.**
3. `Test-Path .opencode\agents\cg.md` → **False.**
4. mtimes of `WASH\hub-server.js`, `WASH\hub.html`, `WASH\hub.css` → must be
   byte-identical at exit.
5. **Record Drew's xlsx: full path, size `11030`, mtime `2026-10-05 18:46:03`.**
   Re-check at exit — **must be unchanged.** This proves ruling H held.
6. Confirm CG-000 inputs readable: `market__wfinfo-prices.json` (**758** rows under
   `.data`), `market__wfinfo-filtered_items.json` (`errors` 11, `eqmt` 162, `relics`,
   `ignored_items`). **These are the only market inputs. Do not fetch fresh ones.**
7. `Test-Path CG\derived` → expect **False**; you create it.
8. Confirm `CG\import-xlsx.js`, `build-dock.js`, `dock.data.js`, `relics.data.js`,
   `dock.html`, `dock.test.js`, `baked\FIELDS.json` → all **False**. If any is True,
   **STOP and report.**

---

## 4. UNIT 1 — `CG/import-xlsx.js` (CREATE)

Reads the xlsx, writes `CG/derived/dock.json`. **Read-only on the xlsx.**

**Hard constraints:** Node built-ins only. **No `package.json`, no `node_modules`, no
npm.** An xlsx is a ZIP of XML and Node has no built-in unzip, so: parse the **ZIP
central directory** yourself and inflate entries with **`node:zlib`
`inflateRawSync`**. Read only the entries required: `xl/sharedStrings.xml`,
`xl/worksheets/sheet1.xml`, `xl/workbook.xml`, `xl/tables/table1.xml`,
`xl/tables/table2.xml`. **Do not extract to disk** — read entries in memory.

**CLI:** `node CG/import-xlsx.js "<path>" --out CG/derived/dock.json`
Must print the resolved input path and output path. **Default input path is Drew's
xlsx**, so `node CG/import-xlsx.js` alone works.

### 4A — The two tables (read the real headers; do not hardcode a schema you guessed)

**`TradeDock`** — `A1:N36` = header + **35 item rows**, **14 columns**:

| # | Column | Meaning as Drew uses it |
|---|---|---|
| 1 | `Item Name` | the set |
| 2 | `Category` | Warframe / Rifle / Shotgun / Pistol / Bow / Melee / Sentinel / Sniper / Mod |
| 3 | `Velocity Tier` | `0 - SACRED` … `6 - Market` |
| 4 | `BP/Main Qty` | **1.0 = HAS · 0.0 = MISSING** |
| 5,7,9 | `Part 1/2/3 Name` | Drew's part noun, or **`N/A`** = no such part |
| 6,8,10 | `Part 1/2/3 Qty` | same 1.0/0.0 possession bit |
| 11 | `Est Value` | **Drew-stated.** A range (`74-80p`), or `LOCKED` / `TRAP` / `HOLD` |
| 12 | `Vaulted` | Yes / No |
| 13 | `Juju Rsv` | **Yes / No → `wantedBy` (ruling G)** |
| 14 | `Live Action Plan` | **Drew's words. ALWAYS RENDERED (ruling I)** |

**`Scratchpad`** — `A38:D41` = header + 2 placeholder rows:

| # | Column |
|---|---|
| 1 | `Unknown Drop Check` |
| 2 | `Ducat Tier (15/45/100)` |
| 3 | `Current Plat Floor` |
| 4 | `Verdict (Add to Ledger / Junk)` |

Row 37 and row 41 are empty; rows 39/40 hold the literal `[Type Item Here]`.

### 4B — `dock.json` shape

Top-level keys — **`_doc` on each** (one source of truth, self-documenting):

`_doc` · `schemaVersion` · `source` (the xlsx path, size, mtime, import timestamp) ·
`velocityTiers` (the **observed vocabulary**, not an invented one) · `items[]` ·
`scratchpad` · `conflicts[]` · `timers` (**`[]`, empty — out of scope, ruling E**) ·
`inventory` (all `[INACCESSIBLE]`, CG-000 §6) · `authority` (ruling F's precedence
table, encoded as data) · `externalStores` (`googleSheetsDock.status: "REJECTED"`,
`writePolicy: "FORBIDDEN"` — ruling F is overturned; record **why**) ·
`provenance` (`DREW_XLSX_IMPORT`).

**Per item, every field carried verbatim from his cells — no coercion, no
reinterpretation:**
`item` · `category` · `velocityTier` · `parts[]` (`name`, `qty`, `have`) ·
`estValueRaw` (**his exact string**, e.g. `"74-80p"`, `"LOCKED"`, `"TRAP"`, `"HOLD"`) ·
`vaulted` · `jujuRsv` / `wantedBy` · `liveActionPlan` (verbatim) ·
`marketRead` (verbatim free text, ruling L — **`null` unless Drew stated it; only
`Scattered Justice` is seeded) ·
`estValueBasis: "DREW_WORD"` · `missing[]` (derived from the qty bits — **arithmetic on
his own stated possession, not invention**) · `flags[]` ·
`partsSum` (ruling N — **`{ value, pricedSegments, totalSegments, complete }`**, so a
partial sum can never present as a total) · `ordinal` (1–35) · `xlsxRow` (2–36).

**`parts[]` — ruling N, every field measured:**

`slot` · `qty` · `have` · **`feedAvg`** · **`feedVolToday`** · **`feedVolYest`** ·
**`matchShape`** · **`drewValue`** (verbatim string, **`null` on all 122 slots** in CG-001).

**`joinAliases{}`** — **top level, and EMPTY in CG-001.** Populated only by explicit Drew
approval (ruling O1). Daikyu's `Upper → Upper Limb` is a *proposal*, not an alias, until
he says so.

**`conflicts[]`** gains **`WISP-ASSEMBLY`** (see above) and the ruling-O entries
`JOIN_ALIAS_PROPOSED` (Daikyu) and `PART_LIST_CONFLICT` (Corufell). **Four open conflicts
ship: `VOLT-RESEARCH-DATE`, `WISP-ASSEMBLY`, `JOIN_ALIAS_PROPOSED`, `PART_LIST_CONFLICT`.**
Resolve none.

**`flags[]` — closed vocabulary, exactly these fourteen:** `NO_PUBLIC_PRICE` ·
`CATALOG_MISS` · `SACRED` · `TRAP` · `HOLD` · `LOCKED` · `JUJU_RESERVED` · `COMPLETE` ·
`DREW_VALUE_STATED` · `DREW_MARKET_READ` · `NO_PLAN` · **`SEG_INACCESSIBLE`** (one or more
segments unpriced — ruling N) · **`JOIN_ALIAS_PROPOSED`** · **`PART_LIST_CONFLICT`**.

> **`SEG_INACCESSIBLE` is about SEGMENTS, not the item.** It is **orthogonal** to
> `NO_PUBLIC_PRICE`: an item can be fully priced as a Set while a segment is not (Corufell),
> or entirely unpriced (Scattered Justice). Both may appear together. **These three flags
> were added by ruling N/O** — my first draft said "the closed ten" while listing **eleven**,
> which was itself a spec error; the count is now enumerated and test-enforced (P16). **No
> flag values beyond these fourteen** — if a new condition appears, it goes in the report,
> not the vocabulary.

**`flags[]` — closed vocabulary, no new flags:** `NO_PUBLIC_PRICE` · `CATALOG_MISS` ·
`SACRED` · `TRAP` · `HOLD` · `LOCKED` · `JUJU_RESERVED` · `COMPLETE` ·
`DREW_VALUE_STATED` · `DREW_MARKET_READ` · `NO_PLAN` · `SEG_INACCESSIBLE` ·
`JOIN_ALIAS_PROPOSED` · `PART_LIST_CONFLICT`.

> **`NO_PUBLIC_PRICE` ≠ `NO VALUE`.** Per ruling L, an item can be `[INACCESSIBLE]` on
> price and still be one of his best flips (`Scattered Justice`). Any UI path that renders
> `NO_PUBLIC_PRICE` **must** also render `marketRead` when present. **The closed vocabulary
> is these fourteen** — if a new condition appears, it goes in the report, not the
> vocabulary.

**`conflicts[]`** — carry forward **`VOLT-RESEARCH-DATE`**, state
`OPEN — AWAITING DREW`, quoting both sources (intake `"Wednesday"` vs Drew
`"3 days from today = 2026-10-08"`). **Do not resolve it. Do not seed a Volt timer.**

> ### 🆕 `WISP-ASSEMBLY` — a second OPEN conflict, and the answer to "the Wisp piece still isn't crafting"
>
> **Measured (Drew, 2026-10-05, verbatim from his sheet):** `Wisp Prime` (ordinal 1 /
> xlsxRow 2) has **`BP/Main 1.0`, `Chassis 1.0`, `Neuroptics 1.0`, `Systems 1.0`** — every
> bit set. It is **the only fully-complete item on the entire 35-row dock.** Yet Drew
> reports the final Wisp piece is still not crafted.
>
> **The dock therefore cannot express his actual state.** `have` means **"I own this
> piece."** A Prime Warframe is not built until it is **assembled at the foundry** — BP +
> all parts + credits. Those are **two different states**, and the sheet has **only one
> field**, so "owns all four" and "has the assembled Warframe" are **indistinguishable**.
>
> **⚠ DO NOT INVENT AN `assembled` FIELD.** He has no such column; adding one is exactly
> the schema invention the doctrine forbids, and it would hard-code a guess about foundry
> workflow into permanent truth. **Record instead:**
>
> `conflicts[] += { id: "WISP-ASSEMBLY", status: "OPEN — AWAITING DREW",
>   observed: "Wisp Prime: BP+Chassis+Neuroptics+Systems all 1.0 — the only complete row",
>   reported: "Drew: final Wisp piece still not crafted",
>   gap: "no assembly/foundry state exists; 'have' is possession only",
>   question: "Does CG need an ASSEMBLED state distinct from possession? If so it is a NEW LEAF." }`
>
> **The page must not resolve it either.** `missing[]` for Wisp is legitimately **`[]`** —
> that is what his bits say, and it is honest. **Do not** display `COMPLETE`, `FINISHED`,
> or `READY` for Wisp. `missing[] = []` is a statement about **the sheet**, not about the
> foundry. See ruling M.

> **`N/A` is a sentinel, not a value.** `Part 3 Name = "N/A"` means the set has no third
> part. Never coerce it to `null`, `""`, or a number — keep the literal and let the page
> render it as an em-dash. Same for `Est Value = LOCKED / TRAP / HOLD`: **they are his
> words, not numbers.** Never parse them into a price.

---

## 5. UNIT 2 — `CG/baked/FIELDS.json` (CREATE)

The anti-invention ledger that drives every label on the page. **Machine-readable,
self-documenting via `_doc` per entry** — do **not** also write a prose `.md` restating
it.

Each entry: `field` · `meaning` · `evidence` (`[VERIFIED]` + endpoint + field path, or
`[INACCESSIBLE]`) · `usableAs` (`price` \| `trend` \| `count` \| `reference` \| `none`) ·
`semantics` (`DOCUMENTED` \| `UNDOCUMENTED`) · **`label`** (the exact string the page
prints).

**Mandatory entries and their exact labels:**

| Field | `usableAs` | `semantics` | Page label |
|---|---|---|---|
| `custom_avg` | **`reference`** | `UNDOCUMENTED` | **`AVG (UNDOC)`** — never "price" |
| `today_vol` | `trend` | `UNDOCUMENTED` | `VOL TODAY` |
| `yesterday_vol` | `trend` | `UNDOCUMENTED` | `VOL YEST` |
| `estValueRaw` | `reference` | `DREW_SOURCED` | **`YOUR EST`** |
| `liveActionPlan` | `none` | `DREW_SOURCED` | **`YOUR PLAN`** |
| `marketRead` | `none` | `DREW_SOURCED` | **`YOUR MARKET READ`** — free text, ruling L |
| `estDelta` | **`none`** | `DERIVED_VIEW_ONLY` | **`EST vs AVG`** — `COMPARISON, NOT A SIGNAL` |
| `parts[].feedAvg` | **`reference`** | `UNDOCUMENTED` | **`AVG (UNDOC)`** — per segment, ruling N |
| `parts[].feedVolToday` | `trend` | `UNDOCUMENTED` | `VOL TODAY` |
| `parts[].feedVolYest` | `trend` | `UNDOCUMENTED` | `VOL YEST` |
| `parts[].drewValue` | `none` | `DREW_SOURCED` | **`YOUR VALUE`** — `null` on all 122 slots in CG-001 |
| `parts[].have` | `count` | `DREW_SOURCED` | **`HAVE`** / **`MISSING`** — **never `NEED`** (ruling M) |
| `partsSum` | **`none`** | `DERIVED_VIEW_ONLY` | **`PARTS SUM · n of m SEGMENTS`** — partial sums render struck |
| `ducats` | `reference` | `DOCUMENTED` | `DUCATS` |
| `primeSellingPrice` | **`reference`** | `UNDOCUMENTED` | `PRIME SELLING REF` |
| `uniqueName` | `none` | `DOCUMENTED` | `ID` |
| `timestamp` | `none` | `DOCUMENTED` | `SNAPSHOT` — **NOT `streamDate`**, absent |
| `priceability` | `none` | `DOCUMENTED` | `PRICEABLE` |
| `syndicateMissions` | **`none`** | — | **⚠ TRAP: faction rotation, NOT player standing** |
| any player-scoped field | `none` | — | `[INACCESSIBLE]` |

> **`estDelta` is `usableAs: "none"`, not `reference`.** It is a **view-time arithmetic
> comparison of two references** and is therefore **weaker than either input** — it must
> never feed a lane, a sort, a recommendation, or a flag. If it is sorted, coloured, or
> thresholded anywhere, that is a **masquerade finding → report it.**
>
> **`marketRead` is `usableAs: "none"`.** It is Drew's prose. CG may print it; CG may
> never interpret, score, or match on it.

> **⚠ `primeSellingPrice` GUARD.** Measured: its value equals the same part's `ducats`
> in **every** row checked (Sybaris Barrel 100/100, Blueprint 15/15, Receiver 45/45,
> Stock 15/15; Ivara Prime Blueprint 45/45). **It is NOT a platinum price.** Never place
> it in a price lane. **Count the N/N across all dock items and report it.** If it does
> not hold universally, that is a **FINDING** → `semantics: UNRESOLVED`. Do not quietly
> keep it either way.

---

## 6. UNIT 3 — `CG/build-dock.js` (CREATE)

Emits the browser bundles. **Offline, deterministic, no wall-clock in output** (all
timestamps come from the inputs' own `_probe.fetchedAt` / source mtime — this is what
makes the page diffable and the tests real).

```
node CG/build-dock.js
```

**`CG/dock.data.js`** — a plain script include, **no module system**, so it loads from
`file://`:

```
window.CG_DOCK = { ...dock.json, prices: <758 rows>, eqmt: <162>, errors: <11>, snapshot: {...} };
```

**`CG/relics.data.js`** — `window.CG_RELICS = { relics: <...> }`, loaded only when the
relic panel opens.

> ### ⚠ THE `file://` TRAP — this is the #1 way this leaf ships a blank page
>
> `file://` has **no origin**, so Chrome/Edge block two very ordinary things. Both fail
> **silently** — no error dialog, just `undefined` and an empty page.
>
> 1. **`fetch()` — FORBIDDEN.** Never `fetch('dock.data.js')`. It throws a CORS/origin
>    error under `file://` and the page renders empty. Load it as a **classic script tag
>    only**: `<script src="dock.data.js"></script>`.
> 2. **`<script type="module">` — FORBIDDEN.** ES modules are origin-checked and are
>    blocked under `file://`. Use **plain classic `<script>` tags, in order**:
>    `dock.data.js` → `relics.data.js` → `dock.html`'s own inline script.
> 3. **The global name is the contract.** `dock.html` reads `window.CG_DOCK` and
>    `window.CG_RELICS` **synchronously at parse time** — so the data tags must come
>    **before** the page script, and **not** behind `DOMContentLoaded` waiting on a fetch.
> 4. **Guard, don't fail silent.** Every read of `window.CG_DOCK` must be behind a
>    presence check that renders the exact string
>    `RUN: node CG/build-dock.js` — never `undefined`, never a blank `<body>`.
>
> **If you are unsure whether a construct survives `file://`, it does not.** No `fetch`,
> no modules, no `import`, no web workers, no service worker, no `localStorage` reliance
> for correctness (it is origin-scoped and may be unavailable — the Scratchpad is
> session-only *in memory* for exactly this reason).

**Hard constraints:** both are **GENERATED — never hand-edited.** Put
`GENERATED BY CG/build-dock.js — DO NOT HAND-EDIT` as the first line of each. Node
built-ins only. **Exit 0** on success. **Exit 1** only if a required input is missing or
unreadable.

**Must emit:** `joinCoverage` (rows joined / total + every unjoined row with its class)
and `catalogMiss` — so the page can show coverage honestly instead of implying the feed
is complete.

---

## 7. UNIT 4 — `CG/dock.html` (CREATE) — **THE DELIVERABLE**

**One file. No build step, no server, no CDN, no webfont, no network.** Opens by
double-click from `file://`. Copy the folder to a laptop and it works there — that is
Drew's future "cheat sheet open on my laptop," achieved by **copying files**, not by
installing anything.

### 7A — GLANCE mode (the default, and what he opens at 3am)

**Big type. One decision per screen. No scrolling to use it.**

- **The drop bar** — a single always-focused input. He types or pastes an item name
  (or a part name).
- **Instant match** against **all 758 price rows AND all 35 dock rows**, as he types.
- **The verdict block** for the matched item, in this fixed order:
  1. **`YOUR PLAN`** — his `Live Action Plan`, verbatim, largest (ruling I).
  2. **`YOUR MARKET READ`** — his `marketRead`, verbatim, or omitted when `null` (ruling L).
  3. **`YOUR EST`** — his `Est Value`, verbatim string.
  4. **`AVG (UNDOC)` + `VOL TODAY`** — the feed's numbers, visibly smaller and labelled.
  5. **`EST vs AVG`** — a **display-only** comparison of his estimate against
     `custom_avg`, as a signed delta. **Measured reality: his `Est Value` takes THREE
     shapes, and all three occur** —
     - **range** `74-80p` → delta against the **midpoint** (77), labelled `vs mid`;
     - **single** `25p` / `50p` / `20p` / `8p` → delta directly, no qualifier;
     - **sentinel** `LOCKED` / `TRAP` / `HOLD` → **render nothing. No delta at all.**
     Label it `COMPARISON, NOT A SIGNAL`. **Never colour it as good/bad, never derive a
     recommendation from it, never sort by it, never threshold it.** It is a reading aid
     for *his* judgement. **Never parse the sentinel shapes into a number** (ruling on
     `estValueRaw` verbatim) — `TRAP` has no price and must produce no delta.
  6. **`SNAPSHOT <age>`** — e.g. `SNAPSHOT 2026-10-05 22:28Z · 4h old`. **Always.**
  7. **Flags** — `SACRED` / `TRAP` / `HOLD` / `NO PUBLIC PRICE` / `CATALOG_MISS` /
     `JUJU RESERVED`.
  8. **`MISSING`** — which parts he lacks, from his own qty bits.
- **🆕 `SEGMENTS` — the per-segment block (ruling N).** Renders directly under the verdict,
  **one compact line per segment**, and it is the reason this leaf is worth building:
  `Barrel · MISSING · AVG 34.3 · VOL 12`. Rules:
  - **`HAVE` / `MISSING` only** — **never `NEED`** (ruling M).
  - `AVG (UNDOC)` per segment, **never** `price`/`floor`/`market`.
  - Unpriced segment → **`[INACCESSIBLE]`** with its reason, **never `0`**, and the line
    **still renders** — Drew must know the segment exists.
  - `YOUR VALUE` renders **only** when `drewValue` is non-`null`; in CG-001 that is
    **nowhere**, so the column is present and empty.
  - **`PARTS SUM`** line last: `PARTS SUM 59.2 · 4 of 4 SEGMENTS`, or greyed+struck
    `· 3 of 4 SEGMENTS · INCOMPLETE`. **Never a bare number.**
  - **Blueprint renders as its own segment line** — and note it is often the **most
    valuable line on the item** (`Wisp Prime Blueprint` = `34` / `VOL 70`). His plan says
    `DO NOT SELL (Crown Jewel)`, so that line must carry the plan warning **adjacent**,
    never as a clean "34p" that invites a 3am flip.
- **If the item is not in the dock**, say so plainly — *"not on your dock"* — and still
  show the feed's numbers, labelled. **Do not hide it.**
- **If there is no public price** → **`[INACCESSIBLE]`** with the reason. Never `0`.
  **And if `marketRead` exists, show it — `[INACCESSIBLE]` must never read as "worth
  nothing"** (ruling L; `Scattered Justice` is the reason this is binding).
- **Toggle GLANCE ⇄ DEEP** with the **`G`** key.

> **⚠ Akbolto guard, enforced in the verdict block.** Because `YOUR PLAN` is always
> rendered *first* and *largest*, a `TRAP` item can never present as a clean sell. If
> `Live Action Plan` is empty, the numbers render **greyed and marked `NO PLAN`** — never
> clean, never bare.

### 7B — DEEP mode (the cheat sheet)

The full dock as a filterable table: **all 35 rows, all 14 columns exactly as his xlsx
has them**, so the page is a faithful mirror of the thing he built. Live text filter
across every column. Sortable by any column. `ESC` returns to GLANCE.

Plus: the **Scratchpad** — his four columns, live-editable in the browser for
**this session only**, clearly marked `SESSION ONLY — NOT SAVED`. He writes the drop,
CG persists it via `dock.json`. **The page must never claim to have saved anything.**

**Fifteenth column: `YOUR MARKET READ`.** Appended after his 14, visibly marked
`CHAT-SOURCED — NOT IN XLSX`, so the mirror is never mistaken for a faithful copy of a
column he did not write. Empty for 34 of 35 rows. **It is prose — do not truncate it to a
few characters in the table;** let it wrap, or offer a `title` attribute carrying the full
text. Do **not** make it a semantic filter or a sort key.

**Every row expands to its `SEGMENTS` table (ruling N) — this is the "deep check":**
slot · `HAVE`/`MISSING` · `AVG (UNDOC)` · `VOL TODAY` · `VOL YEST` · `YOUR VALUE` ·
match shape on hover — closing with the `PARTS SUM` line.

- **Sorting/filtering on a segment column is allowed; sorting by `PARTS SUM` is NOT a
  default view.** A "cheapest set to finish" ordering is a **goal CG invented** — banned
  by ruling M. He may sort it himself if he asks.
- **`Corufell Prime` must render BOTH `Blade` and `Stock`** — `Blade [INACCESSIBLE]`
  (dock-only) beside `Stock 7.9 · VOL 101` (feed-only) — flagged
  `PART_LIST_CONFLICT`, **never one silently replacing the other.**

### 7C — Relic panel (button, lazy-loads `relics.data.js`)

5 tiers × reward tables for run decisions, plus **⚠ the `errors[]` warnings rendered
prominently** (ruling K) — a reward table the feed flags as missing drops must say so
where he is reading it.

### 7D — Non-negotiables

- **Every price shows its snapshot age.** No exceptions (ruling J).
- **`AVG (UNDOC)` is never rendered as "price", "floor", or "market."**
- **`EST vs AVG` is a reading aid only** — never coloured, never ranked, never
  recommended from, never shown for a non-parseable `Est Value` (ruling C).
- **No undercut claim anywhere** (ruling B disclaimer wording). `marketRead` may quote
  Drew's own words about undercutting because **they are his, not CG's claim** — CG never
  asserts one.
- **`[INACCESSIBLE]`, never `0`, never `—`, for a missing value.**
- **His words are never edited.** `LOCKED` / `TRAP` / `HOLD` / `DO NOT SELL` / `marketRead`
  render as written.
- **No `alert()`, no `prompt()`, no network call, no external asset.** Fails silently and
  legibly if `dock.data.js` is absent — with a clear "run `node CG/build-dock.js`"
  message, not a blank page.

---

## 8. UNIT 5 — `CG/dock.test.js` (CREATE)

**Zero-dep, offline, no arguments.** `node CG/dock.test.js` — all green.

### 8A — Importer oracle (PLANNER-measured ground truth from the real file)

> ### ⚠ ROW-NUMBERING LAW — the first draft of this table was ambiguous and would have failed
>
> **`ordinal` (1–35, header excluded) ≠ `xlsxRow` (2–36). The relation is
> `ordinal = xlsxRow − 1`.** My first draft mixed the two in one table: it said *"Item 1 =
> Wisp Prime"* (correct as **ordinal**, wrong as **xlsxRow**, which is `2`) and *"Item 33 =
> Orthos Prime"* (correct as **xlsxRow**, wrong as **ordinal**, which is `32`). A DOER
> reading either convention literally would have failed one or the other.
>
> **Therefore every anchor below states BOTH numbers, and `dock.json` must carry
> `ordinal` (1–35) AND `xlsxRow` (2–36) on every item** so no consumer ever has to infer it.
>
> | ordinal | xlsxRow | item | tier | est | juju | plan |
> |---|---|---|---|---|---|---|
> | 1 | **2** | Wisp Prime | `0 - SACRED` | `LOCKED` | No | `DO NOT SELL (Crown Jewel)` |
> | 2 | 3 | Burston Prime | `0 - SACRED` | `LOCKED` | No | `DO NOT SELL (Incarnon Host)` |
> | 3 | 4 | Sybaris Prime | `1 - S-Tier` | `74-80p` | No | `Sells on Barrel (30p). Hunt aggressively.` |
> | 8 | 9 | Corufell Prime | `1 - S-Tier` | `55-70p` | No | `Receiver (25p) bottlenecks set.` |
> | 31 | 32 | Akbolto Prime | `5 - F-Tier` | `TRAP` | No | `Market trap (5 trades). Sell Recs for plat.` |
> | **32** | **33** | Orthos Prime | `5 - F-Tier` | `10-12p` | **Yes** | `Save for Julia Mastery. Do not burn trade.` |
> | 33 | 34 | Braton Vandal | `6 - Market` | `8p` | No | `Actively listed on market.` |
> | 34 | 35 | Scattered Justice | `6 - Market` | `8p` | No | `Actively listed on market.` |
> | **35** | **36** | Voltaic Strike | `6 - Market` | `HOLD` | No | `Park for 4-8 weeks (40-60p+).` |

| # | Assertion |
|---|---|
| I1 | ZIP parses; reads the 5 required entries in memory; **nothing written outside `--out`** |
| I2 | **149** sharedStrings; **41 `<row>` elements of which exactly 39 are POPULATED** — rows **37** and **41** are **empty spacers** (zero `<c>` children) and must be skipped, not imported as blank items |
| I3 | `TradeDock` = header (row 1) + **35** items in rows **2–36**; `Scratchpad` header row **38** + **2** placeholders rows **39–40**. Every item carries `ordinal` (1–35) **and** `xlsxRow` (2–36), satisfying `ordinal = xlsxRow − 1` |
| I4 | Headers exact: `Item Name` … `Live Action Plan`; scratchpad `Unknown Drop Check` … `Verdict (Add to Ledger / Junk)` |
| I5 | **ordinal 1 / xlsxRow 2** = `Wisp Prime`, `Est Value` `LOCKED`, plan `DO NOT SELL (Crown Jewel)`, tier `0 - SACRED` |
| I6 | **ordinal 2 / xlsxRow 3** = `Burston Prime`, plan `DO NOT SELL (Incarnon Host)` |
| I7 | **ordinal 32 / xlsxRow 33** = `Orthos Prime`, `Juju Rsv` = `Yes` — ruling G's **only** `JUJU_RESERVED` |
| I8 | **ordinal 35 / xlsxRow 36** = `Voltaic Strike`, `Est Value` `HOLD`, plan `Park for 4-8 weeks (40-60p+).` |
| I9 | `Velocity Tier` vocabulary = the **7 observed values** (`0 - SACRED`, `1 - S-Tier`, `2 - A-Tier`, `3 - B-Tier`, `4 - C-Tier`, `5 - F-Tier`, `6 - Market`), no invented tier |
| I10 | Possession bits: `1.0`→have, `0.0`→missing; **`N/A` stays the literal `"N/A"`** |
| I11 | **`estValueRaw` is never a number** — `"74-80p"`, `"LOCKED"`, `"TRAP"`, `"HOLD"` all stay strings |
| I12 | **`xlsx` size `11030` and mtime `2026-10-05 18:46:03` unchanged after import** (ruling H) |
| I13 | Re-running the importer on an unchanged xlsx → **byte-identical** `dock.json` |
| I14 | **`marketRead` = `null` on all 34 other items**; `Scattered Justice` carries Drew's sentence verbatim and **no other item is seeded** |
| I15 | `estValueRaw` is never coerced — parse-range is a **view-time** concern only; `dock.json` holds strings |
| I16 | **`missing[]` agrees with the bits on all 35 items.** Spot oracles: Sybaris (ord 3) = `["BP/Main","Barrel","Receiver"]` · Steflos (ord 4) = `["Barrel","Receiver","Stock"]` · Corufell (ord 8) = `["BP/Main","Blade","Receiver"]` · Ivara (ord 7) = `["BP/Main","Neuroptics","Systems"]` · **Wisp (ord 1) = `[]` — the ONLY complete item** · mods with `N/A` parts (Scattered Justice ord 34, Voltaic Strike ord 35) yield **`missing: []`, never `["N/A"]`** |
| I17 | **SEGMENT JOIN: `115 / 122` slots priced = `94.3%`.** The **7** unpriced slots are exactly: `Corufell Prime \| Blade` · `Daikyu Prime \| Lower` · `Daikyu Prime \| Upper` · `Braton Vandal \| Blueprint` · `Braton Vandal \| Stock` · `Scattered Justice \| Blueprint` · `Voltaic Strike \| Blueprint` |
| I18 | **Both blueprint shapes resolve, and never collapse.** `Sybaris Prime Blueprint` → `6.5` (shape `<Base> Blueprint`); `Wisp Prime Chassis Blueprint` → `17.1` (shape `<Base> <Slot> Blueprint`); `Ivara Prime Blueprint` → `9` (shape `<Base> Blueprint`); `Wisp Prime Blueprint` → `34` |
| I19 | **Measured segment oracles** — Sybaris ord 3: Barrel `34.3`/vol 12, Receiver `8.7`/13, Stock `9.7`/5, BP `6.5`/7, **`PARTS SUM 59.2 · 4 of 4`** · Corufell ord 8: Handle `6.9`/120, Receiver `24.1`/151, BP `6.3`/75, Blade **`[INACCESSIBLE]`**, **`PARTS SUM 37.3 · 3 of 4 · INCOMPLETE`** · Wisp ord 1: BP `34`/70, Chassis `17.1`/60, Neuroptics `5.2`/38, Systems `5.3`/39 |
| I20 | **`drewValue` = `null` on all 122 slots** — **no plan-prose scraping.** Assert the count of non-null `drewValue` is exactly **0** |
| I21 | **`joinAliases{}` = `{}` (empty)** in CG-001; Daikyu `Upper`/`Lower` remain **`[INACCESSIBLE]`**, NOT aliased to `Upper Limb`/`Lower Limb` |
| I22 | Feed strings are **whitespace-trimmed before join** — the feed really does carry trailing spaces (`"Daikyu Prime Lower Limb "`) |
| I23 | `conflicts[]` has **exactly 4** entries: `VOLT-RESEARCH-DATE`, `WISP-ASSEMBLY`, `JOIN_ALIAS_PROPOSED`, `PART_LIST_CONFLICT` — **all `OPEN — AWAITING DREW`**, none resolved |

### 8B — Coverage + honesty

| # | Assertion |
|---|---|
| P1 | **32 / 35** dock items priceable; **3** `[INACCESSIBLE]` = `Braton Vandal`, `Scattered Justice`, `Voltaic Strike` |
| P2 | `Steflos Prime` **and** `Corufell Prime` carry `CATALOG_MISS`, price rows still visible |
| P3 | `Corufell Prime Set` `AVG (UNDOC)` = `60`, `VOL TODAY` = **228** |
| P4 | Canonical join ≥ **740 / 758**; **every** unjoined row reported with a class; **zero dropped** |
| P5 | All **35** items present exactly once; no blanks, no `probably` |
| P6 | `Akbolto Prime` carries `TRAP` **and** `AVG (UNDOC)` 73.5 — **both visible, never one alone** |
| P7 | Every price carries a non-empty snapshot age |
| P8 | **CG never authors an undercut claim.** The token `undercut` may appear **only** (a) once, in ruling B's disclaimer, and (b) **inside verbatim Drew strings** — `marketRead`, `liveActionPlan`, `estValueRaw`. It must appear in **no** CG-authored sentence, label, flag, field name, tooltip, or comment. See the P8 carve-out below. |
| P9 | Every key the page reads is declared in `FIELDS.json`; no `usableAs:"price"` field carries `custom_avg`/`*_vol` |
| P10 | `dock.data.js` and `relics.data.js` contain **no** `http://` / `https://` / `src=` external asset |
| P11 | Two `build-dock.js` runs → **byte-identical** bundles |
| P12 | `build-dock.js` **writes nothing** outside its two declared outputs |
| P13 | `errors[]` count = **11**, surfaced in the relic panel |
| P14 | **`NO_PUBLIC_PRICE` items each render their `marketRead` beside the reason** — `Scattered Justice` specifically must show **no** "worthless" framing |
| P15 | `EST vs AVG` appears **only** for parseable numerics; `Akbolto Prime` (`TRAP`), `Wisp Prime` (`LOCKED`), `Burston Prime` (`LOCKED`), `Voltaic Strike` (`HOLD`) render **no delta**. **Single-value ests DO render**: `Gyre Prime` `25p`, `Okina Prime` `50p`, `Braton Vandal` `8p` |
| P16 | **No flag values** beyond the closed **fourteen**; **no new per-item field** beyond `marketRead`; the flag vocabulary is **enumerated and counted** |
| P17 | **No string matching `YOU NEED` / `REQUIRED` / `NEEDED` / `COMPLETE` / `FINISHED` / `READY TO BUILD` anywhere in `dock.html`** — the `missing[]` block is headed `YOUR BITS SHOW MISSING`, segments say `HAVE`/`MISSING` |
| P18 | **`Sybaris Prime` renders his plan `"Sells on Barrel (30p)…"` adjacent to `missing: ["BP/Main","Barrel","Receiver"]`** — plan first, and `Barrel` is **not** presented as a completion target |
| P19 | `Wisp Prime` renders `missing: []` **without** any `COMPLETE`/`FINISHED` claim; **`WISP-ASSEMBLY` appears in `conflicts[]` with status `OPEN — AWAITING DREW`** |
| P20 | Every item carries `ordinal` (1–35) **and** `xlsxRow` (2–36) with `ordinal = xlsxRow − 1`; rows **37** and **41** are **not** imported as items |
| P21 | `ordinal`/`xlsxRow` anchors: **1/2** Wisp · **2/3** Burston · **3/4** Sybaris · **8/9** Corufell · **31/32** Akbolto · **32/33** Orthos · **35/36** Voltaic Strike |
| P22 | **SEGMENTS block present in GLANCE and DEEP**, one line per segment, **115 priced + 7 `[INACCESSIBLE]` = 122** |
| P23 | **No `PARTS SUM` renders as a bare number** — every one carries `· n of m SEGMENTS`, and the **3 partial sums** (Corufell 3/4, Daikyu 2/4, Braton Vandal 0/2) are **greyed + struck + `INCOMPLETE`** |
| P24 | **No segment value uses `primeSellingPrice`**; no `price`-labelled segment field; every segment avg is labelled `AVG (UNDOC)` |
| P25 | **`YOUR VALUE` column renders but is empty everywhere** — **zero** non-null `drewValue` in `dock.data.js`; **no plan-prose scraping anywhere** (assert no segment number was harvested from `liveActionPlan`) |
| P26 | **Corufell renders BOTH `Blade [INACCESSIBLE]` and `Stock 7.9 · VOL 101`** — neither replaces the other; `PART_LIST_CONFLICT` present |
| P27 | **Daikyu renders `Upper`/`Lower` as `[INACCESSIBLE]`** — **no** `Upper Limb`/`Lower Limb` substitution in `dock.data.js`, `joinAliases` empty |
| P28 | **`Wisp Prime Blueprint` segment line renders `AVG 34` with the `DO NOT SELL (Crown Jewel)` plan adjacent** — never a clean unqualified `34p` |
| P29 | `dock.data.js` segment values carry the **snapshot age** like every other price |

> ### ⚠ P8 CARVE-OUT — a contradiction I shipped in the first draft, caught before handoff
>
> The original P8 read: *"Token `undercut` appears **at most once**, only in ruling B's
> disclaimer."* **That is unsatisfiable alongside I14.** I14 requires seeding
> `Scattered Justice.marketRead` with Drew's own sentence — and that sentence **contains
> the word "undercut"**:
>
> > *"…market interactions like if it is frequently undercut, or if it is bought by noobs…"*
>
> So obeying I14 would have **failed P8**, and DOER would have been forced to either
> **mangle Drew's verbatim words** (a masquerade) or **report a false failure** — with the
> oracle-discipline rule correctly forbidding him from bending either side.
>
> **The rule's actual intent** is: **CG must never assert an undercut.** Drew saying the
> word about his own market is not a CG claim. So P8 is re-scoped to **CG-authored text
> only**, with verbatim Drew strings carved out. **Note this is a fix to MY
> specification, not a relaxation of a measured oracle** — the original was a bug, not a
> requirement.
>
> **Concretely:** P8 passes if the only occurrences of `undercut` are the single ruling-B
> disclaimer **plus** occurrences inside `marketRead` / `liveActionPlan` / `estValueRaw`
> values copied character-for-character from Drew. It **fails** if `undercut` appears in
> any label, flag, tooltip, heading, or CG-written sentence. **DO NOT "fix" this by
> rewording Drew's sentence** — verbatim is load-bearing.

> **⚠ ORACLE DISCIPLINE.** I1–P29 are **measured**, so they are a real oracle. **A failing
> test is a FINDING to report — never an expectation to be edited to match.** An
> expectation quietly bent to fit is the masquerade the operating core forbids. The P8
> carve-out below is the **one** correction to this package, and it was made **by
> PLANNER, pre-handoff**, to fix a contradiction in the spec itself.

### 8C — What the automated suite CANNOT prove (masquerade gate)

**P1–P16 assert on file contents, not on a rendered DOM.** No headless browser is in
scope, so `dock.test.js` **cannot** prove the page renders. The suite can prove the
bundle is correct, self-contained, and internally consistent. It **cannot** prove:

- that `dock.html` displays anything at all under `file://`;
- that `G` toggles, that the filter works, that the relic panel lazy-loads;
- that nothing throws in the console.

**Therefore the report MUST carry this line, verbatim, unless Drew has physically opened
the page:**

> `FILE:// RENDER: UNVERIFIED — no human has opened dock.html. Static assertions only.`

**Claiming the page works without having watched it work is the single easiest
masquerade in this leaf, and it is forbidden.** If Drew opens it and reports a fault, that
is a **new leaf** — do not quietly patch `dock.html` inside this one.

**TEST COUNT: 23 importer (I1–I23) + 29 page/static (P1–P29) = 52 assertions.**

---

## 9. UNIT 6 — `.opencode/agents/cg.md` (CREATE) — second-to-last

**CG's job changed, and the seat must say so.** CG is now the **keeper of Drew's dock**:
he states an analysis in chat, CG writes it into `dock.json`, and the page shows it.

**Frontmatter:** `description`, `mode: primary`, `color`, `model: opencode/big-pickle`,
`permission: {edit: allow, bash: allow}` — mirroring `v-d.md` / `x-xp.md`.
`edit: allow` is scoped by the seat's own guardrail to **`CG/` only**; `bash: allow` runs
`node CG/build-dock.js`. `opencode.json` sets a global `edit: "ask"`; agent frontmatter
overrides. **If the override does not take in this opencode version, CG runs in ask mode
— slower, not broken. Say so in the report. Do NOT "fix" it by editing `opencode.json`**
(locked out).

**Body must contain:**
1. **Identity** — CG, CEPHALON GHOST; Warframe; seated SPECIFIED SPECTER; own window.
2. **The four Core Operational Laws + safe word**, house pattern.
3. **Boot sequence** — the studio seven, **then** `CG/derived/dock.json`,
   `CG/baked/FIELDS.json`, `CG/baked/api-surface.md`, `CG/drew/**`.
4. **Role** — hold the dock: record Drew's stated analyses, values, spreads, and verdicts;
   keep the page truthful; re-emit `dock.data.js` after any change.
5. **⚠ THE DOCK CONTRACT — non-negotiable:**
   - `CG/dock.data.js` and `CG/relics.data.js` are **GENERATED**. Never hand-edit.
   - **`WF10_04-TRADEDOCK.xlsx` is READ-ONLY. CG never writes it.** (ruling H)
   - **`dock.json` is the master.** Changes go there, then `node CG/build-dock.js`.
   - **After every write, re-run the build, and report the change in one line.**
6. **⚠ THE CAPABILITY HONESTY BLOCK — eight facts:** profile surface CLOSED · no order
   book reachable by any automated source (**but Drew reads the live listings — CG holds
   his floor, never derives it**) · **`custom_avg` = FAIR-VALUE REFERENCE, still
   UNDOCUMENTED** · **32 of 35** dock targets priceable, **3 not** ·
   **average spread is NOT computable — Drew supplies it** · timers Drew-sourced ·
   **hub stays out** · self-contained.
7. **🆕 THE METHOD BLOCK — `Est Value` is only half of Drew's method.** His own words:
   *"EST values are based on sell listings on warframe.market, and my own analysis based
   on volume, and market interactions like if it is frequently undercut, or if it is
   bought by noobs like my scattered justices tend to be."* So CG must never treat
   `estValueRaw` as the whole picture: **`marketRead` carries the behavioural half, and
   CG stores and prints it verbatim without interpreting it.**
8. **🆕 THE SEGMENT CONTRACT (ruling N).** Per-segment values are **CG-derived from the
   feed** (`custom_avg` → `AVG (UNDOC)`, `today_vol`/`yesterday_vol` → trend). **Never
   `primeSellingPrice`** — it equals `ducats`. **`PARTS SUM` always declares its
   denominator** (`· n of m SEGMENTS`) and a partial sum is **struck + `INCOMPLETE`** —
   never a bare total. **`drewValue` is `null` until Drew states it in chat: NEVER
   regex a number out of `liveActionPlan`.** If he says *"Corufell Receiver is 25p"*, CG
   writes `parts[].drewValue = "25p"` and re-emits the bundle. **CG never invents an alias
   either** — Daikyu `Upper → Upper Limb` stays a `JOIN_ALIAS_PROPOSED` conflict until he
   approves it into `joinAliases{}`.
9. **⚠ ANTI-OVERCLAIM:** CG-001 has **no live reader**. Prices are a
   `2026-10-05T22:28:04Z` **snapshot**. CG must never imply a live feed, and must state
   the snapshot age when it quotes a price.
10. **Guardrails** — READ-ONLY on all game data; writes **only** under `CG/`; **never**
    write the xlsx; **never** write to any external store — write authority is Drew's, per
    task package, and CG may never acquire it.
11. **Delegation** — never self-forward. **Halt & report.**
12. **Masquerade is forbidden** — report exactly what was done and not done.

**Do NOT edit any other agent file. Do NOT add a hub entry.**

---

## 10. UNIT 7 — Diagnostics + `CG/CG-001_REPORT.md`, then HALT

| Check | Pass condition |
|---|---|
| `node --check` on every new `.js` | clean |
| `node CG/dock.test.js` | **all green**, offline, no args |
| `node CG/import-xlsx.js` | exit 0; prints paths; writes `CG/derived/dock.json` |
| `node CG/build-dock.js` | exit 0; emits both bundles; prints join coverage |
| `node CG/build-dock.js` (2nd run) | **byte-identical** bundles |
| `CG\dock.html` opened from `file://` | renders; GLANCE matches; `G` toggles DEEP; filter works; relic panel lazy-loads |
| console on `dock.html` | **no errors, no failed loads, no network requests** |
| `Test-Path CG\baked\DOCTRINE.md`, `CG\drew\DRAW-002_RULINGS.md` | **False** — deferred to CG-002 |
| **xlsx size + mtime vs Unit 0** | **identical — `11030` / `2026-10-05 18:46:03`** |
| hub mtimes vs Unit 0 | **byte-identical** |
| `CG\probe.js`, `CG\baked\probes\**`, `api-surface.md`, the 3 `CG\drew\*.md` | **unchanged** |
| `node CG/probe.js` | **NOT RUN.** |
| `Test-Path .opencode\agents\cg.md` | **True** |
| other `.opencode\agents\*.md` | **unchanged** |
| `git status --short` | no new commits; only `CG/` + `.opencode/agents/cg.md` untracked |

**Receipt must state:** the **32/35 correction**; the **`custom_avg` fair-value finding
and the fact that it is NOT circular** — with Drew's verbatim method sentence quoted, and
**CG-001a recorded as CANCELLED**; the new **`marketRead` field**, that **only
`Scattered Justice` is seeded**, and that **no behavioural taxonomy was invented**; the
**per-segment work — `115/122` (94.3%) coverage, the 7 named unpriced slots, both blueprint
shapes, and the `PARTS SUM` denominator discipline**; the **`DREW_VALUE_SEED_REQUEST`
list** (every segment appearing in his plan prose, **unparsed**) so he can dictate values
in one pass; the **`WISP-ASSEMBLY` conflict** and that **no `assembled` field was
invented**; the **ordinal↔xlsxRow law** and the **2 empty spacer rows (37, 41)**; the
**Sybaris plan-vs-bits contradiction** and how ruling M resolves it; the
**`JOIN_ALIAS_PROPOSED` (Daikyu)** and **`PART_LIST_CONFLICT` (Corufell)** items, both
**unresolved and awaiting Drew**; the `Akbolto trap`; the **Akbolto / Orthos / Steflos /
Corufell** specifics; the `primeSellingPrice` N/N count; join coverage and every unjoined
class; what the page does **not** show and why; the CG-002 boundary; and NOT-DONE —
including **no live reader, no network, no server, no xlsx write, no timers, no Volt date,
no undercut logic, no inferred aliases, no scraped prose, no commit.**

---

## 11. DEFINITION OF DONE

- [ ] `node CG/dock.test.js` — **23 importer (I1–I23) + 29 page/static (P1–P29) = 52 assertions green**, offline, no args
- [ ] All **35** dock rows imported verbatim; **nothing coerced, nothing invented**
- [ ] **`Est Value` never a number** — `74-80p` / `LOCKED` / `TRAP` / `HOLD` stay strings
- [ ] **`N/A` preserved** as the literal sentinel
- [ ] **`Juju Rsv` → `wantedBy: JULIA`; Orthos Prime the only one; NO second account**
- [ ] **`WF10_04-TRADEDOCK.xlsx` byte-for-byte unchanged** — `11030` / `2026-10-05 18:46:03`
- [ ] `dock.html` opens from `file://` — **zero server, zero network, zero CDN**
- [ ] GLANCE: `YOUR PLAN` first and largest; **Akbolto can never read as a clean sell**
- [ ] **Every price shows its snapshot age**
- [ ] **`AVG (UNDOC)` never labelled price/floor/market**; `*_vol` trend-only
- [ ] **32 / 35** priceable; the 3 render `[INACCESSIBLE]` with a reason, **never `0`**
- [ ] `Steflos Prime` + `Corufell Prime` carry `CATALOG_MISS`, prices still visible
- [ ] Join **≥ 740/758**; every unjoined row classed; **zero dropped**
- [ ] `errors[]` = **11**, surfaced in the relic panel
- [ ] **Every item carries `ordinal` (1–35) AND `xlsxRow` (2–36)**, `ordinal = xlsxRow − 1`; rows **37**/**41** not imported
- [ ] **`missing[]` headed `YOUR BITS SHOW MISSING`** — the strings **`YOU NEED` / `REQUIRED` / `NEEDED` / `COMPLETE` / `FINISHED` / `READY TO BUILD` appear NOWHERE** (ruling M)
- [ ] **Sybaris plan renders adjacent to its `missing[]`**; `Barrel` never presented as a completion target
- [ ] **`WISP-ASSEMBLY` recorded OPEN** in `conflicts[]`; **no `assembled` field invented**; Wisp shows `missing: []` with no `COMPLETE` claim
- [ ] **`EST vs AVG` handles range, single, and sentinel** — sentinel shapes render **no** delta
- [ ] **`file://` safe:** no `fetch`, no `type="module"`, classic `<script src>` → `window.CG_DOCK` / `window.CG_RELICS`, data tags **before** page script, `RUN: node CG/build-dock.js` guard renders instead of a blank page
- [ ] **`import-xlsx.js` refuses to overwrite an existing `dock.json` without `--force`**; `--force` prints the divergence diff
- [ ] **Report carries `FILE:// RENDER: UNVERIFIED`** unless Drew has physically opened the page
- [ ] **SEGMENTS render in GLANCE and DEEP** — **115 priced + 7 `[INACCESSIBLE]` = 122 slots (94.3%)**, `HAVE`/`MISSING` only
- [ ] **Both blueprint shapes resolve and never collapse** — `<Base> Blueprint` ≠ `<Base> <Slot> Blueprint`
- [ ] **`PARTS SUM` never bare** — always `· n of m SEGMENTS`; the 3 partials struck + `INCOMPLETE`
- [ ] **`drewValue` = `null` on all 122 slots**; **no plan-prose scraping**; `DREW_VALUE_SEED_REQUEST` planted in the report
- [ ] **`joinAliases{}` empty**; Daikyu `Upper`/`Lower` stay `[INACCESSIBLE]`
- [ ] **Corufell renders BOTH `Blade [INACCESSIBLE]` and `Stock 7.9`** — no substitution
- [ ] **4 open conflicts**, none resolved: `VOLT-RESEARCH-DATE`, `WISP-ASSEMBLY`, `JOIN_ALIAS_PROPOSED`, `PART_LIST_CONFLICT`
- [ ] **14-flag** closed vocabulary, enumerated and counted
- [ ] Token `undercut` ≤ once, disclaimer only
- [ ] **`custom_avg` = FAIR-VALUE REFERENCE** (upgraded, §0B); still **never** price/floor/market; **CG-001a CANCELLED**
- [ ] **`marketRead`** carried verbatim; **`null` on 34 of 35**; **only `Scattered Justice` seeded**
- [ ] **No behavioural taxonomy invented** — no `demandQuality` / `exitLiquidity` / `noobDemand` field
- [ ] `EST vs AVG` is `usableAs:"none"`, display-only, **absent** for `TRAP`/`LOCKED`/`HOLD`
- [ ] `NO_PUBLIC_PRICE` rows show their `marketRead` — **Scattered Justice never reads as worthless**
- [ ] **No flag values** beyond the closed **fourteen**; **no new per-item field** beyond `marketRead`; vocabulary enumerated **and counted**
- [ ] `VOLT-RESEARCH-DATE` recorded **OPEN**; **zero timers** seeded
- [ ] `timers` display **absent** from the page
- [ ] `DOCTRINE.md` + `DRAW-002_RULINGS.md` **NOT built** — deferred, CG-002
- [ ] `.opencode/agents/cg.md` installed with the dock contract + honesty block
- [ ] **Zero** hub files touched; **zero** network calls; **zero** commits

---

## 12. NEXT — CG-002 (NOT AUTHORIZED HERE)

The engine, `DOCTRINE.md`, `DRAW-002_RULINGS.md`, the timer layer, and the full test
suite — i.e. the hardening that makes the page *trustworthy* rather than merely working.
**CG-003** is the live price reader. **Do not start either.**

---

## 13. HALT

When green per §11, plant `CG/CG-001_REPORT.md` beside this task and **HALT** for Drew.

**Do NOT** self-forward to COURRIER. **Do NOT** start the live reader. **Do NOT** touch
the hub. **Do NOT** commit. **Do NOT** write the xlsx. **Do NOT** pick a Volt date.
**Do NOT** edit an expected test number to make a test pass.

Masquerade is forbidden — report what was built, what was measured, what surprised you,
and what was not done.