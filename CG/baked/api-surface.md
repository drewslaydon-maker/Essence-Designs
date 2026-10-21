# CG-000 — Warframe PUBLIC API CAPABILITY MATRIX

**Leaf:** CG-000 · **Executor:** DOER (1-Stone) · **Run:** 2026-10-05 · **Probe:** `CG/probe.js` v2.0
**Account probed:** `11121350` (one account, Drew only)

**Machine-readable twin:** `CG/baked/probes/_probe-findings.json`
**Raw snapshots:** 96 JSON files in `CG/baked/probes/`
**Reproduce:** `node CG/probe.js` (zero deps, exit 0, idempotent — 96 files before and after a re-run)

**RULE OBSERVED:** zero invented fields. `[VERIFIED]` means a literal field path was
observed in a real payload, quoted verbatim. Anything not observed is `[INACCESSIBLE]`
with the search enumerated. No plausible guesses, no inferred values.

---

## 1. ACCOUNT RESOLUTION — which endpoint resolved 11121350?

**Answer: NONE. Zero endpoints resolved. Platform remains UNRESOLVED and Drew must state it.**

This is *not* an ID-specific miss. The profile surface is closed for **every**
identifier tested, including the one the API's own OpenAPI spec uses as its example.

### 1A — The eight candidates named in §4A (all probed, none abandoned early)

| # | Platform | URL | HTTP | Verdict |
|---|---|---|---|---|
| 1 | PC | `api.warframe.com/cdn/getProfileViewingData.php?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — "No account or guild ID specified" |
| 2 | PS4 | `api-ps4.warframe.com/…?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — same |
| 3 | XB1 | `api-xb1.warframe.com/…?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — same |
| 4 | Switch | `api-swi.warframe.com/…?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — same |
| 5 | Mobile | `api-mob.warframe.com/…?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — same |
| 6 | Android | `api-and.warframe.com/…?playerId=11121350` | 409 | `WRONG-PARAM-CONTRACT` — same |
| 7 | multi | `api.warframestat.us/profile/11121350` | 404 | `UNRESOLVED` — `{"error":"No Result","code":404}` |
| 8 | multi | `api.wfcd.gg/profile/11121350` | — | `TRANSPORT-ERROR` — `TypeError: fetch failed` (host unreachable; root URL also unreachable) |

Note on the task's own premise (§1 claimed *"probe all six"* while listing eight URLs):
all eight listed URLs were probed. The count in the prose was wrong, not the list.

### 1B — Control sweep (separates "our ID is absent" from "the surface is closed")

| Control | What it tests | HTTP | Result |
|---|---|---|---|
| `/profile/Tobiah` | **the spec's own documented example identifier** | 404 | `{"error":"No Result","code":404}` |
| `/profile/Tobiah/stats` | profile stats route | 404 | No Result |
| `/profile/Tobiah/xpInfo` | profile XP/mastery route | 404 | No Result |
| `/profile/Tobiah/arsenal` | arsenal route | 404 | No Result |
| `/profile/11121350?withItem=true` | our ID with item detail | 404 | No Result |
| `getProfileViewingData.php?accountId=11121350&contentId=2&language=en` | **corrected** legacy param contract | 403 | empty body |
| `getProfileViewingData.php?accountId=Tobiah&contentId=2&language=en` | corrected contract, control ID | 403 | empty body |
| `/profile/drew.slaydon/arsenal` | Drew IGN named in §1 | 404 | No Result |
| `/profile/Jubbiles/arsenal` | second IGN named in §1 | 404 | No Result |

**`PROFILE VERDICT: SURFACE-CLOSED.`**

Two discoveries here that matter more than the 404s themselves:

- The 409s were a **parameter-name mismatch, not a dead endpoint**. Supplying
  `accountId` + `contentId` instead of `playerId` changes the answer from 409 to
  **403 with an empty body** — i.e. the legacy profile endpoint is alive and is
  hard-blocked at the edge for unauthenticated callers. Both Drew's ID *and* the
  control get 403, so this is a blanket block, not an ID-specific denial.
- The spec at `api.warframestat.us/openapi.json` (v3.2.28) still advertises
  `/profile/{playerId}` as *"Player account ID **or username**"*, with the example
  value `Tobiah`. So username lookup was **not** removed from this API's contract —
  it is declared and then serves nothing publicly. §1's premise is correct about
  Warframe's public profile *pages* and wrong about this API route.

---

## 2. PROFILE CAPABILITIES — Q1–Q5

### 2A — Player-scoped questions (the two load-bearing ones first)

| # | Question | Verdict | Detail |
|---|---|---|---|
| **Q1** | Research / dojo timer with a completion date? | **`[INACCESSIBLE]`** | No profile obtainable. Structurally, the spec's 100 routes contain **zero** research/dojo route. |
| **Q2** | Any player-foundry crafting queue? | **`[INACCESSIBLE]`** | No profile obtainable. Structurally, **zero** crafting/foundry route in the spec. |
| Q3f | Player-**owned** prime parts / resources / mods / relics | `[INACCESSIBLE]` | Requires a profile. None obtainable. |
| Q3g | Player quest-completion keys | `[INACCESSIBLE]` | Requires a profile. None obtainable. |
| Q4a | Player credits | `[INACCESSIBLE]` | Requires a profile. None obtainable. |
| Q4b | Player platinum | `[INACCESSIBLE]` | Requires a profile. None obtainable. |
| Q4c | Player mastery rank | `[INACCESSIBLE]` | `/xpInfo` (which the spec says carries mastery rank) returns 404 for the control too. |
| Q4d | Player syndicate standings | `[INACCESSIBLE]` | See the warning in 2C — the worldstate field of the same name is **not** player standing. |
| **Q5** | Quest progress granular enough for STARTED vs COMPLETE? | **`[INACCESSIBLE]`** | No quest-state route exists at all. See 2B for the one false positive. |

**Every source tried for Q1/Q2/Q5** (all enumerated in §1A and §1B above):
the 8 §4A candidates, the 9 control probes, plus the structural evidence: the
full 100-route OpenAPI spec, in which
`routes matching /order/i = NONE`,
`routes matching /craft|foundry|research|dojo/ = /pc/buildLabel`,
`routes matching /quest/i = /pc/questToConquerCancer`.

**Q1 and Q2 in plain language:** the answer is **no, and no.** Drew's Volt research
completion date cannot be read from any public source, and neither can a Wisp Prime
craft timer or Julia's Hek/Atomos timers. **This is a permanent architecture fact,
not a gap CG-001 can close.** Every timer CG shows must come from Drew, from a
derived event log, or from an in-game source CG does not have.

### 2B — Structural absence, stated precisely (with false positives called out)

Two spec routes textually match a keyword but are **not** what they look like:

- `/pc/buildLabel` matches `/build/` — it returns the **game build version string**
  (e.g. `"16.1.1"`), not a foundry build queue.
- `/pc/questToConquerCancer` matches `/quest/` — it is a **worldstate event**, not
  quest-completion state.

Neither grants Q1, Q2 or Q5. Recorded so nobody later "discovers" them as answers.

### 2C — Public game metadata that IS exposed (VERIFIED — no profile needed)

These are real, citable capabilities CG-001 can use. They are *about items and the
live world*, never about the player's inventory.

| Capability | Verdict | Endpoint + exact field path | Example value shape |
|---|---|---|---|
| Prime part decomposition | `[VERIFIED]` | `GET /items/{item}?only=components` → `$.components[].name` | `"Blueprint"` |
| Part quantities | `[VERIFIED]` | `$.components[].itemCount` | `1` (Orokin Cell: `10`) |
| Prime part price reference | `[VERIFIED]` | `$.components[].primeSellingPrice` | `45` (Ivara Prime Blueprint) |
| Part tradability | `[VERIFIED]` | `$.components[].tradable` | `true` on prime parts, `false` on the Orokin Cell component |
| Part drop sources (relics) | `[VERIFIED]` | `$.components[].drops[]` | 16–129 entries; `Axi B4 Relic`, chance `11`, rarity `Uncommon` |
| Set-level tradability | `[VERIFIED]` | `$.tradable` | `false` on every prime set (the *parts* are the tradeable units) |
| Item type / category | `[VERIFIED]` | `$.type`, `$.category` | `"Warframe"` / `"Warframes"`, `"Stance Mod"` / `"Mods"` |
| Canonical item id | `[VERIFIED]` | `$.uniqueName` | `/Lotus/Powersuits/Ranger/IvaraPrime` |
| Full catalog enumeration | `[VERIFIED]` | `GET /items?only=name,uniqueName` | **17,672 records**, 1.80 MB, HTTP 200 — CG can build its own index and stop guessing at per-item lookups |
| Relic reward tables | `[VERIFIED]` | `GET /wfinfo/filtered_items` → `$.relics.<Tier>.<Code>` | 5 tiers `Axi, Lith, Meso, Neo, Vanguard`; `Axi.A1 = {vaulted:true, rare1:"Nikana Prime Blueprint", uncommon1:"Akstiletto Prime Barrel", …}` |
| Equipment + ducat values | `[VERIFIED]` | `$.eqmt["Ivara Prime"]` | `{type:"Warframes", vaulted:true, parts:{"Ivara Prime Blueprint":{count:1,ducats:45,vaulted:true}}}` — 162 entries |
| Platinum reference values | `[VERIFIED]` | `$.ignored_items["Forma Blueprint"]` | `{plat:0, ducats:0, volume:0}` |
| Data-quality warnings | `[VERIFIED]` | `$.errors[]` | `"Axi A22 IS MISSING DROPS"`, `"Axi T13 IS MISSING DROPS"` |
| Market average + volume | `[VERIFIED]` | `GET /wfinfo/prices` → `$.name`, `$.yesterday_vol`, `$.today_vol`, `$.custom_avg` | `{"name":"Sybaris Prime Set","yesterday_vol":"32","today_vol":"19","custom_avg":"72.3"}` — all values are **strings** |

**⚠ WARNING on Q4d — do not misread `$.syndicateMissions`.** It exists in the
worldstate and contains `syndicate:"Ostrons"`, `activation`, `expiry`, `nodes`,
`jobs`. That is the **faction standing rotation** (which faction is currently
available), **not the player's syndicate standing**. Q4d stays `[INACCESSIBLE]`.

---

## 3. MARKET ORDERABILITY — hard verdict per item

**Verdict definition (stated so it can be audited):**
`ORDERABLE` = a **live public price row exists for that item's name** in
`/wfinfo/prices`, or `/pricecheck/find/{item}` returned a non-empty array.
`NOT-ORDERABLE` = no public price row of any kind for that name.

**The §4C endpoints do not exist.** Both URLs named in §4C were probed for all 17
items and recorded in `CG/baked/probes/mandated__orders__*.json` (34 snapshots):

- `api.warframestat.us/items/<ITEM>/orders` → **HTTP 404** `{"message":"Cannot GET /items/<ITEM>/orders","error":"Not Found","statusCode":404}`
- `api.warframe.com/cdn/getItemOrders.php?item=<ITEM>` → **HTTP 403**, empty body

A router-level `Cannot GET` is a statement about the **route**, not the item.
Neither appears anywhere in the 100-route OpenAPI spec. Reporting "not orderable"
off that dead route would have been a false inference; the verdicts below are
derived from routes that actually answer.

| # | Item | Verdict | In item DB | `tradable` | Public price rows (exact names) |
|---|---|---|---|---|---|
| 1 | Braton Vandal | `NOT-ORDERABLE` | yes | false | none |
| 2 | Scattered Justice | `NOT-ORDERABLE` | yes | **true** | none |
| 3 | Voltaic Strike | `NOT-ORDERABLE` | yes | **true** | none |
| 4 | Sybaris Prime | **`ORDERABLE`** | yes | false | Sybaris Prime Set / Barrel / Blueprint / Receiver / Stock |
| 5 | Steflos Prime | **`ORDERABLE`** | **NO — 404** | — | Steflos Prime Set / Blueprint / Receiver / Barrel / Stock |
| 6 | Baza Prime | **`ORDERABLE`** | yes | false | Baza Prime Set / Barrel / Blueprint / Receiver / Stock |
| 7 | Valkyr Prime | **`ORDERABLE`** | yes | false | Valkyr Prime Set / Blueprint / Chassis Blueprint / Neuroptics Blueprint / Systems Blueprint |
| 8 | Ivara Prime | **`ORDERABLE`** | yes | false | Ivara Prime Set / Blueprint / Chassis Blueprint / Neuroptics Blueprint / Systems Blueprint |
| 9 | Wisp Prime | **`ORDERABLE`** | yes | false | Wisp Prime Set / Blueprint / Chassis Blueprint / Neuroptics Blueprint / Systems Blueprint |
| 10 | Volt | `NOT-ORDERABLE` | yes | false | none for "Volt" — **5 related rows exist for `Volt Prime`** (recorded, not granted) |
| 11 | Hek | `NOT-ORDERABLE` | yes | false | none |
| 12 | Atomos | `NOT-ORDERABLE` | yes | false | none |
| 13 | Neurode | `NOT-ORDERABLE` | yes | false | none |
| 14 | Stalking Fan | `NOT-ORDERABLE` | yes | **true** | none |
| 15 | Crimson Dervish | `NOT-ORDERABLE` | yes | **true** | none |
| 16 | Zenurik | `NOT-ORDERABLE` | yes | false | none |
| 17 | Railjack | `NOT-ORDERABLE` | yes | false | none |

**`ORDERABLE` = 6/17.** `Sybaris Prime, Steflos Prime, Baza Prime, Valkyr Prime, Ivara Prime, Wisp Prime`
**`NOT-ORDERABLE` = 11/17.** All 17 carry an explicit verdict. No blanks, no "probably".

### 3A — The price rows that exist (verbatim, at probe time)

Values are strings. Snapshot for CG-001 is `CG/baked/probes/market__wfinfo-prices.json`.

| Row | `yesterday_vol` | `today_vol` | `custom_avg` |
|---|---|---|---|
| Sybaris Prime Set | 32 | 19 | 72.3 |
| Sybaris Prime Barrel | 35 | 12 | 34.3 |
| Sybaris Prime Blueprint | 10 | 7 | 6.5 |
| Sybaris Prime Receiver | 12 | 13 | 8.7 |
| Sybaris Prime Stock | 18 | 5 | 9.7 |
| Steflos Prime Set | 270 | 170 | 71.3 |
| Steflos Prime Barrel | 212 | 140 | 25.5 |
| Steflos Prime Blueprint | 181 | 95 | 8.3 |
| Steflos Prime Receiver | 54 | 29 | 7.6 |
| Steflos Prime Stock | 150 | 102 | 8.6 |
| Baza Prime Set | 30 | 36 | 68.1 |
| Baza Prime Barrel | 28 | 19 | 5.5 |
| Baza Prime Blueprint | 75 | 33 | 8.4 |
| Baza Prime Receiver | 43 | 36 | 7.9 |
| Baza Prime Stock | 89 | 62 | 22.7 |
| Valkyr Prime Set | 96 | 84 | 69.1 |
| Valkyr Prime Blueprint | 46 | 20 | 5.7 |
| Valkyr Prime Chassis Blueprint | 51 | 37 | 34.3 |
| Valkyr Prime Neuroptics Blueprint | 73 | 44 | 9.8 |
| Valkyr Prime Systems Blueprint | 61 | 42 | 14.7 |
| Ivara Prime Set | 160 | 126 | 60.1 |
| Ivara Prime Blueprint | 142 | 84 | 9 |
| Ivara Prime Chassis Blueprint | 179 | 99 | 19 |
| Ivara Prime Neuroptics Blueprint | 69 | 45 | 7.5 |
| Ivara Prime Systems Blueprint | 101 | 70 | 9.8 |
| Wisp Prime Set | 229 | 121 | 68.9 |
| Wisp Prime Blueprint | 120 | 70 | 34 |
| Wisp Prime Chassis Blueprint | 121 | 60 | 17.1 |
| Wisp Prime Neuroptics Blueprint | 62 | 38 | 5.2 |
| Wisp Prime Systems Blueprint | 39 | 39 | 5.3 |
| **Volt Prime** Set (related) | 92 | 44 | 68.3 |
| **Volt Prime** Blueprint (related) | 34 | 48 | 13.7 |
| **Volt Prime** Chassis Blueprint (related) | 41 | 32 | 9.9 |
| **Volt Prime** Neuroptics Blueprint (related) | 39 | 35 | 28.5 |
| **Volt Prime** Systems Blueprint (related) | 58 | 34 | 9.9 |

### 3B — Anomalies that will bite CG-001 if ignored

1. **The price feed and the item DB do NOT join on `name` — 757 of 758 price rows have
   no exactly-matching item-DB name.** Measured against the full 17,672-item catalog
   (`GET /items?only=name,uniqueName`), the price feed labels rows in a *market*
   convention (`"<Item> Prime <Part> Blueprint"`, `"<Item> Prime Set"`) while the catalog
   uses canonical names (`"Ivara Prime"`, and part names inside `$.components[].name`
   such as `"Blueprint"`). **A CG-001 engine that joins price rows to items on `name`
   will fail on 99.9% of rows.** It must normalize the key (strip ` Set` / ` Blueprint`
   suffixes, match the base set name) — this is a join-key requirement, not a data bug.

   **Inside that general pattern, `Steflos Prime` is a genuine outlier.** Its five price
   rows exist with the highest volumes of any S-tier target (Set 270/170, avg 71.3),
   yet across the *entire* 17,672-item catalog the only match for `/steflos/i` is
   `Steflos` — no `Steflos Prime` in `name` **or** `uniqueName`. By contrast all five
   other S-tier prime sets (`Sybaris Prime`, `Baza Prime`, `Valkyr Prime`, `Ivara Prime`,
   `Wisp Prime`) are present in the catalog. So: the market feed carries a liquid
   Steflos Prime trade that the game catalog does not contain.

   **Ruling needed from Drew (see §6.17).** Recommended behavior for CG-001: treat the
   price feed as authoritative for *priceability* and the item DB as authoritative for
   *identity* (`uniqueName`, `type`, `tradable`, `components[]`, drops). A cross-dataset
   mismatch is a flag to **surface**, never a reason to silently drop the item.
2. **"Volt" is ambiguous in the intake.** The bare Warframe `Volt` has no price row.
   All five rows belong to **`Volt Prime`** — which is almost certainly what Drew's
   Wednesday research and in-flight gap mean. Recorded as related, not granted, because
   they are a different item. **Drew must confirm the intended name.**
3. **Four tradeable mods have zero public price:** Scattered Justice, Voltaic Strike,
   Stalking Fan, Crimson Dervish — all `tradable: true`, none in the price feed.
   The doctrine's *buy-Power-not-pieces* targets are the *least* observable.
4. **Identity mismatches on names that resolved:**
   - `Scattered Justice` → `/Lotus/Upgrades/Mods/Syndicate/**HekMod**` — it *is* the Hek syndicate mod. This is the concrete link between the `Hek` line in the intake and a tradeable artifact.
   - `Hek` → `/Lotus/Weapons/Tenno/Shotgun/QuadShotgun` — the **non-prime** Hek shotgun, not the syndicate.
   - `Atomos` → `/Lotus/Weapons/Grineer/Pistols/HeatGun/GrnHeatGun` — the non-prime pistol.
   - `Zenurik` → `/Lotus/Upgrades/Skins/TextureOverrides/Zenurik` — a **Skin**, not the Zenurik Warframe.
   - `Neurode` → the record's `name` is the plural **`Neurodes`**.
   - `Railjack` → `type: "Orbiter"`, `/Lotus/Types/Game/CrewShip/Ships/RailJack`.
   - `Braton Vandal` → `/Lotus/Weapons/Tenno/Rifle/VIPRifle` with `tradable: false` — that is the **base rifle record**, not the Vandal variant. Do not read it as "the Vandal is untradable."

---

## 4. TRADE DOCTRINE COMPUTABILITY — is the 1-Plat Undercut derivable?

**Answer: PARTIALLY — and the "undercut" is weaker than the doctrine assumes.**

The in-game order book is **not exposed by any reachable public route.** There is no
orders endpoint in the 100-route spec; both endpoints named in §4C are dead
(404 router-level, 403 edge-blocked). So CG can never see a lowest sell order, a
buyer price, or a live listing for anything.

What is available is `/wfinfo/prices`: a coarse row per item of
`today_vol` / `yesterday_vol` / `custom_avg`. That is an **average and a volume
count, not an order book.**

| Doctrine move | Computable from public data? | Why |
|---|---|---|
| Undercut a **prime** (6 S-tier targets) | **PARTIALLY** | `custom_avg` gives an average to reason against (e.g. Wisp Prime Set avg `68.9`, volume 121 today). You get an average-delta, **never a live lowest order**. It is an *average-delta*, not a true undercut. |
| Undercut a **mod** (Stalking Fan, Crimson Dervish) | **NO** | Not in the price feed at all, despite `tradable: true`. |
| Undercut **Voltaic Strike** | **NO** | Not in the price feed. The long-term hold has no public price. |
| Price the **liquidating** stock (Braton Vandal, Scattered Justice) | **NO** | Neither is in the price feed. |
| Compute the **Trade Trap** floor (10–12p) | **NO** | Needs a real market floor; only an average exists, and only for primes. |
| Settle on **trade credits** | **N/A — always works** | Unaffected by any API limit. |

**Verdict for CG-001's engine: it must be BOTH, and the two halves are not equal.**

- **Order-driven path:** exists *only* for prime items, and only as an average-delta
  against `custom_avg` plus a volume trend from `today_vol`/`yesterday_vol`. Diffing
  `today_vol` across snapshots is how CG could infer rising or falling demand.
- **Trade-credit path:** mandatory for the entire liquidating/aug-flip side of the
  dock, because none of it has any public price.

**⚠ FIELD-SEMANTICS CAVEAT — the API does not document these fields.**
`/wfinfo/prices` states only that "the data structure depends on the external source
configured via the `WFINFO_PRICES` environment variable." Nothing in the API says
`custom_avg` is a platinum asking price, nor that `today_vol` is an order count.
**CG-001 must not treat `custom_avg` as a live asking price or implement a "lowest
order" comparison on top of it until Drew confirms what those three fields mean.**
Everything else in this row is mechanical and safe.

---

## 5. LIVE WORLDSTATE KEYS AVAILABLE

Baseline snapshot: `CG/baked/probes/worldstate__pc-en.json`
Key manifest: `CG/baked/probes/worldstate__pc-en.keys.json`

`GET https://api.warframestat.us/pc/en` → **HTTP 200**, **38 top-level keys**.

**⚠ `streamDate` — the field §4D asked for — is ABSENT from the payload.** The live
timestamp field is **`timestamp`**, observed as `"2026-10-05T22:15:39.000Z"`.
`GET /pc/timestamp` returns the same value as a bare JSON string. Any CG-001 diff
mechanism must key on `timestamp`, not `streamDate`.

| Group | Keys (verbatim) |
|---|---|
| Meta | `timestamp`, `buildLabel` |
| Events & alerts | `news`, `events`, `alerts`, `flashSales`, `invasions`, `darkSectors`, `persistentEnemies` |
| Fissures & cycles | `fissures`, `earthCycle`, `cetusCycle`, `cambionCycle`, `zarimanCycle`, `vallisCycle`, `duviriCycle` |
| Missions | `sortie`, `arbitration`, `archonHunt`, `syndicateMissions`, `conclaveChallenges`, `archimedeas`, `descendia` |
| Economy & vendors | `voidTraders`, `voidTrader`, `dailyDeals`, `vaultTrader`, `simaris`, `steelPath`, `globalUpgrades`, `kuva` |
| Progression | `nightwave`, `sentientOutposts`, `constructionProgress`, `clanWeeklyInitiative`, `calendar`, `faceoffBonus`, `kinepage` |

Sample shapes:
- `$.nightwave` → `{"id":"nightwave1804464000000","activation":"2026-08-12T15:30:00.000Z","expiry":"2027-03-08T00:00:00.000Z","season":18,"tag":"Radio Legion Intermission16 Syndicate","phase":0,"activeChallenges":[…]}`
- `$.syndicateMissions[]` → `{"id":"1791245728111CetusSyndicate","activation":"…","expiry":"…","syndicate":"Ostrons","syndicateKey":"Ostrons","nodes":[],"jobs":[…]}` — faction rotation, **not** player standing.

Per-field routes also exist for most of these: `GET /pc/{field}` (e.g. `/pc/fissures`,
`/pc/nightwave`, `/pc/alerts`, `/pc/vaultTrader`).

**This is the patch-diff anchor.** A re-run that changes `timestamp`, adds/removes a
top-level key, or drops a key from `keyTypes` is the signal that a game patch moved
something CG depends on.

---

## 6. WHAT THE API DOES NOT KNOW — the explicit gap list

Everything here is a thing CG must **ask Drew about** or **derive itself**. None of it
is obtainable from any public source probed.

**Player state — permanently inaccessible (no credentials, no route):**
1. Research / dojo completion timers — **Drew's Volt research (Wednesday)**.
2. Player-foundry crafting queue and timers — **Wisp Prime (12h + 3d), Julia's Hek / Atomos**.
3. Owned inventory counts: prime parts, resources, mods, relics.
4. Credits and platinum balances.
5. Mastery rank (`/xpInfo` is declared by the spec and serves nothing).
6. Personal syndicate standing.
7. Quest completion keys and STARTED-vs-COMPLETE state — **Julia's TWW gate**.
8. Account platform. Nothing resolves `11121350`; **Drew must state it.**
9. Loadout / arsenal. The one username-keyed route (spec: *"requires Twitch integration to be configured"*) 404s for `drew.slaydon`, `Jubbiles`, and the control alike.

**Market state:**
10. Any live order book — no orders route exists in the spec.
11. Lowest sell order, buyer orders, or per-player listings, for **any** item.
12. Prices for the entire mod/stance/syndicate side of the dock: **Stalking Fan, Crimson Dervish, Voltaic Strike, Scattered Justice**.
13. Prices for the liquidating stock: **Braton Vandal**.
14. What `custom_avg`, `today_vol`, `yesterday_vol` actually mean — undocumented.
15. Whether a given prime's part is currently in stock in-game (no vendor inventory route for stock).

**Identity / naming — needs Drew's ruling, not a guess:**
16. Does "Volt" in the intake mean **Volt** or **Volt Prime**? (Only Volt Prime is priced.)
17. **Steflos Prime:** the market feed carries a liquid trade (5 rows, Set vol 270/170)
    that the 17,672-item catalog does not contain at all. Does a market row for an item
    the catalog denies authorize CG to surface it on the dock?
18. Is `Hek` the syndicate (whose mod is Scattered Justice) or the non-prime Hek shotgun
    the DB resolves?
19. Is `Zenurik` the Warframe or the Skin the DB resolves?

**Structural, for CG-001's architecture:**
20. CG cannot verify or contradict any timer Drew states. Drew's word is the only source.
21. Trade-credit transactions are invisible to the API entirely — the trade side of the dock must be CG-tracked from Drew's own records.
22. `wfcd.gg` is unreachable (transport failure on both the API and the host root). If any prior design assumed wfcd.gg as a second source, **that assumption is dead.**
23. The API's `/wfinfo/*` routes return 503 when their external source is unconfigured. Both were live at probe time, but CG-001 must handle 503 as a normal state, not a crash.

---

**End of matrix.** Every row above is traceable to a snapshot in
`CG/baked/probes/` or a quoted HTTP response. No field was inferred.