# CG-000 — RECON REPORT (the receipt)

**Leaf:** CG-000 · **Executor:** DOER (1-Stone) · **Planted by:** PLANNER (0-Wake)
**Date:** 2026-10-05 · **Gate status:** read-only recon, COMPLETE · **Awaiting Drew's routing decision**

**Deliverable:** `CG/baked/api-surface.md` — the capability matrix
**Probe:** `CG/probe.js` v2.0 (Node built-ins only, no `package.json`, no `node_modules`)
**Evidence:** 96 raw JSON snapshots in `CG/baked/probes/`
**Burn:** $0.00 — free-tier model, network probes only, no GPU.

---

## 1A. DREW'S RULINGS — received 2026-10-05, recorded verbatim in substance

> Source: Drew, in reply to §9's five blocking questions. Recorded here because §8
> forbids adding files to `CG/drew/` beyond the three transcriptions. **The Planner must
> decide whether these become a `CG/drew/DRAW-002_RULINGS.md` under a new leaf.**
> One of them **supersedes** the intake text — flagged below.

| # | Drew's ruling | Effect on the recon |
|---|---|---|
| 1 | **`11121350` is his PC account.** ID came from the forums; other methods gave no ID. | Closes the platform gap that public sources could not. Recon's `PLATFORM: UNRESOLVED` is now answered by Drew, not by any endpoint — as predicted. |
| 2 | **"Volt" = base Volt FRAME, not Volt Prime.** Last research needed started "a few hours ago" → **first set craftable in 3 days from today = 2026-10-08**. | **SUPERSEDES** the intake's "Volt research Wednesday." Recon's `NOT-ORDERABLE` for base Volt is **confirmed correct** — the five `Volt Prime` rows are a different item and stay unused. Also a live confirmation of Q1/Q2: Drew is the only source for his own timers. |
| 3 | Not sure; assumes `*_vol` = volume and `custom_avg` = average of sales. | See §4 caveat — **his assumption is plausible but unconfirmed, and the distinction matters.** Left open. |
| 4 | "Not sure — clarify the diff between the 2 choices." | See the corrected analysis below; now a **Planner decision with a recommendation**, not an open question. |
| 5 | **`Hek` = the shotgun. `Zenurik` = the focus school Julia picked.** | Both recon readings were red herrings. `Hek` → the non-prime shotgun (recon was right). `Zenurik` is **not an item at all** — it is a Focus school, so `NOT-ORDERABLE` is correct and the DB's "Zenurik" *Skin* record is irrelevant noise. |

**⚠ Unreconciled discrepancy left open for CG-001:** the intake says Volt research
completes *Wednesday*; Drew now says *3 days from today* (2026-10-08, Thursday). I did
**not** silently pick one. `CG/drew/GOAL-STACKS.md` still carries the intake's
"Wednesday" because §8 makes that file a faithful transcription. **Someone must reconcile
the two before CG-001 schedules anything.**

---

## 1. THE HEADLINE — four facts that reshape CG-001

1. **No endpoint resolves account `11121350`. Zero. Platform remains UNCONFIRMED.**
   This is *not* an ID-specific miss — the API's own documented example identifier
   (`Tobiah`) also 404s. **Drew must state the platform.** CG-001 cannot infer it.

2. **Q2 is confirmed permanently INACCESSIBLE, and it is structural, not a permissions gap.**
   There is **no player-foundry crafting route anywhere in the API's 100 published
   routes.** Drew's Wisp Prime (12h + 3d) and Julia's Hek / Atomos timers cannot be
   read from any public source, ever, without credentials CG does not have. Same for
   Q1 (Volt's Wednesday research) and Q5 (Julia's TWW gate). **This is architecture,
   not a backlog item. CG must track every timer from Drew's word or from its own
   derived event log.**

3. **The in-game order book is gone from the public API.** Both endpoints named in §4C
   are dead, and the OpenAPI spec contains **zero** order routes. The 1-Plat Undercut
   is therefore computable **only for prime items, and only as an average-delta against
   `custom_avg`** — never against a real lowest order. The doctrine's *buy-Power-not-pieces*
   targets (Stalking Fan, Crimson Dervish) and the whole liquidating side (Braton Vandal,
   Scattered Justice) have **no public price at all**. **The trade engine must be BOTH
   order-driven (primes only) and trade-credit-driven (everything else).**

4. **The `/wfinfo/*` routes are the only live market surface, and CG can diff them over
   time.** 758 price rows with `today_vol` / `yesterday_vol` / `custom_avg`, plus a
   219KB `filtered_items` blob (relic reward tables, part ducat values, platinum
   reference values). This is the patch-diff-capable signal CG can actually use.

---

## 2. ACCOUNT RESOLUTION — which endpoint resolved, and what platform it implies

**No endpoint resolved. No platform can be implied. Drew must state it.**

All eight §4A candidates were probed (the prose said "probe all six" while listing eight
URLs — the list was right, the count was wrong):

| Platform | Result |
|---|---|
| PC / PS4 / XB1 / Switch / Mobile / Android (`getProfileViewingData.php?playerId=`) | **HTTP 409** — "No account or guild ID specified" |
| `api.warframestat.us/profile/11121350` | **HTTP 404** — `{"error":"No Result","code":404}` |
| `api.wfcd.gg/profile/11121350` | **TRANSPORT ERROR** — host unreachable |

The 409s were a **parameter-name mismatch, not a dead endpoint**. Correcting the contract
to `?accountId=…&contentId=2&language=en` moves the answer from 409 to **403 with an
empty body** — alive, but hard-blocked at the edge for unauthenticated callers. Drew's ID
*and* the control both get 403, so it is a blanket block.

**Control sweep (this is what makes the verdict trustworthy):** `Tobiah` — the exact
identifier the API's own spec uses as its example — returns 404 on `/profile`,
`/stats`, `/xpInfo`, and `/arsenal`. `drew.slaydon` and `Jubbiles` return 404 too.

**Verdict: `SURFACE-CLOSED`.** No identifier resolves, so the closure is a property of
the surface, not of Drew's account.

---

## 3. Q1 / Q2 IN PLAIN LANGUAGE

**Q1 — Volt's research completion date: NO.** Not exposed. No dojo/research route exists
in the spec. CG gets the Wednesday date from Drew or from its own log, nowhere else.

**Q2 — Wisp Prime / Hek / Atomos crafting timers: NO, and this one shapes CG-001.**
Confirmed absent from every public source *and* confirmed absent from the API's route
table, so it can never be retrofitted with a new endpoint later. **Permanent architecture
fact: every timer CG shows is Drew-sourced or CG-derived from events.** A CG that
promises "your Wisp Prime finishes at 07:40 Friday" cannot back that promise with data.
It must either ask Drew or model it as a CG-owned countdown seeded from his start time.

**Q3–Q5** split cleanly in two, and this split is the useful part of the recon:
- **Player-scoped → all `[INACCESSIBLE]`**: owned parts/resources/mods/relics, credits,
  platinum, mastery rank, personal syndicate standing, quest keys, quest progress.
- **Public game metadata → `[VERIFIED]` and genuinely useful**: prime part decomposition
  (`$.components[]`), per-part `primeSellingPrice`, `$.components[].drops[]` relic
  sources (16–129 entries each), the full relic reward table, ducat values, and
  platinum reference values. CG gets excellent *static* game knowledge and **zero**
  knowledge of Drew's inventory. Layer-B inventory must therefore be asked-for data.

⚠ **`$.syndicateMissions` is a trap.** It exists in the worldstate and contains
`syndicate:"Ostrons"` — that is the *faction rotation*, not Drew's standing. Q4d stays
`[INACCESSIBLE]`.

---

## 4. FULL ORDERABILITY MATRIX

`ORDERABLE` = a live public price row exists for that item's name in `/wfinfo/prices`,
or `/pricecheck/find` returned non-empty.

| Item | Verdict | In DB | `tradable` | Public price rows |
|---|---|---|---|---|
| Braton Vandal | `NOT-ORDERABLE` | yes | false | none |
| Scattered Justice | `NOT-ORDERABLE` | yes | **true** | none |
| Voltaic Strike | `NOT-ORDERABLE` | yes | **true** | none |
| Sybaris Prime | **`ORDERABLE`** | yes | false | Set + 4 parts |
| Steflos Prime | **`ORDERABLE`** | **NO — 404** | — | Set + 4 parts |
| Baza Prime | **`ORDERABLE`** | yes | false | Set + 4 parts |
| Valkyr Prime | **`ORDERABLE`** | yes | false | Set + 4 parts |
| Ivara Prime | **`ORDERABLE`** | yes | false | Set + 4 parts |
| Wisp Prime | **`ORDERABLE`** | yes | false | Set + 4 parts |
| Volt | `NOT-ORDERABLE` | yes | false | none for "Volt"; **5 related `Volt Prime` rows** |
| Hek | `NOT-ORDERABLE` | yes | false | none |
| Atomos | `NOT-ORDERABLE` | yes | false | none |
| Neurode | `NOT-ORDERABLE` | yes | false | none |
| Stalking Fan | `NOT-ORDERABLE` | yes | **true** | none |
| Crimson Dervish | `NOT-ORDERABLE` | yes | **true** | none |
| Zenurik | `NOT-ORDERABLE` | yes | false | none |
| Railjack | `NOT-ORDERABLE` | yes | false | none |

**6 ORDERABLE / 11 NOT-ORDERABLE. Every item has a hard verdict. No blanks.**

**Is the 1-Plat Undercut computable? PARTIALLY — and it is not really an undercut.**
CG can compare against `custom_avg` for the six primes (e.g. Wisp Prime Set avg `68.9`,
volume 121 today) and can track volume trend by diffing `today_vol` across snapshots.
CG can **never** see a lowest sell order, a buyer price, or a live listing. For the other
eleven — including every *buy-Power-not-pieces* target and the entire liquidating stock —
there is **no public price whatsoever**, so those must move on trade credits with
Drew-supplied numbers.

⚠ **Field-semantics caveat — Drew's Q3, still open but now bounded.**
Your inference (`*_vol` = volume, `custom_avg` = an average) is **plausible and
consistent with the field names**, and I can support the first half: `today_vol` /
`yesterday_vol` almost certainly are counts of something that happened today vs
yesterday, and the feed is clearly a rolling market dataset. Three observations that
narrow it:

- The field is literally named **`custom_avg`**, not `avg`. The `custom_` prefix hints
  it is a **derived/custom computation** by whatever runs the WFInfo source, not a native
  exchange statistic.
- Values are **strings**, and `custom_avg` carries one decimal (e.g. `77.2`, `5.8`) —
  consistent with a computed average rather than a quoted price.
- `today_vol` can *exceed* `yesterday_vol` on individual rows (Ivara Prime Blueprint:
  142 → 84 across the two days; Volt Prime Blueprint: 34 → 48). Whatever it counts is
  noisy and refresh-dependent, so it is a trend input, **never** a price input.

**Why "average of sales" vs "average of asking prices" changes CG-001:** if `custom_avg`
is an average of *asking* prices, it sits **above** the real floor and any "undercut"
computed from it is trivially easy and commercially meaningless — CG would recommend
undercutting prices that are already beaten. If it is an average of *completed sales*,
it is a fair-value reference and a delta against it is a real signal. **I cannot settle
this from the API — it documents neither.** Cheapest empirical settle, if you want it:
pick one prime part you already know the in-game price for, compare that against its
`custom_avg` row on the same day, and the two readings give visibly different answers.

**Until then CG-001 must not build an undercut on `custom_avg`** — and note that even
once settled, an *average-delta* is not an undercut, because no order book exists to
reveal a lowest order.

---

## 5. THINGS THAT SURPRISED ME

Recon exists to find surprises. It found these:

1. **The §4C endpoints named in the task are dead — and the failure mode was misleading.**
   A literal reading of the endpoint list yields `NOT-ORDERABLE` for all 17 items, which
   would have been a **false inference** dressed as a finding: `{"message":"Cannot GET
   /items/Volt/orders"}` is a statement about the *route*, not the item. I caught it
   because plain `Volt` also 404'd, which is not credible. The spec has **no order routes
   at all**, so the honest verdict had to be re-derived from routes that answer. Both
   mandated endpoints are still replayed for all 17 items every run, so the evidence stays
   reproducible (`mandated__orders__*.json`, 34 snapshots).

2. **The §1 premise about username lookup is wrong about this API.** Recon says
   username lookup was removed in 38.0.8, so IGNs 404. But the live spec *still declares*
   `/profile/{playerId}` as "account ID **or username**" with the example `Tobiah`. The
   route is intact and serves **nobody**. So the route was not removed — its data was.
   Both IGNs still 404, confirmed.

3. **`wfcd.gg` is dead.** `TypeError: fetch failed` on both the API path and the host
   root. Any earlier CG design that assumed a second source from wfcd.gg is dead.

4. **`streamDate` — the field §4D explicitly told me to record — does not exist.**
   The payload has **no `streamDate`**. The live field is `timestamp`
   (`"2026-10-05T22:15:39.000Z"`), and `/pc/timestamp` returns it bare. Any diff
   mechanism keyed on `streamDate` would have diffed `null` forever and never fired.

5. **Steflos Prime is priced but does not exist in the item database.** All five price
   rows exist (Set volume 270/170 — the highest of any S-tier target), yet
   `/items/Steflos Prime` → 404 and `/items/search/Steflos Prime` → `[]`. **A CG-001
   engine keyed off the item DB would silently drop a target you named.** "Exists" and
   "priceable" are independent properties in this API.

   **⚠ SELF-CORRECTION (2026-10-05, after Drew's Q4).** My *explanation* above was
   incomplete and the heading was wrong. Measured against the **full 17,672-item catalog**
   (`GET /items?only=name,uniqueName`), **757 of the 758 price rows have no
   exactly-matching item-DB name** — the price feed labels rows in a *market* convention
   (`"<Item> Prime <Part> Blueprint"`, `"<Item> Prime Set"`) that simply does not match
   canonical catalog names. So "priced but absent from the DB" is the *normal* state for
   price rows, not an inconsistency, and joining the two datasets on `name` fails on
   99.9% of rows. The Steflos Prime case remains a genuine outlier, but for a sharper
   reason: across the entire catalog the only `/steflos/i` match is `Steflos`, while all
   five other S-tier prime sets **are** present. The market carries a liquid Steflos Prime
   trade the catalog denies. The finding stands; the reason I first gave for it was wrong.

6. **"Volt" in the intake was ambiguous — RESOLVED by Drew: base Volt frame, not Prime.**
   The bare Warframe `Volt` has **no** price row; all five rows belong to `Volt Prime`.
   Drew confirms he means the **base frame** (last research started hours ago; first set
   in 3 days → **2026-10-08**). So recon's `NOT-ORDERABLE` verdict for Volt is
   **confirmed correct**, and the `Volt Prime` rows remain a red herring CG must not use.

7. **`Hek` is two different things — RESOLVED by Drew: the shotgun.** The DB resolves
   `Hek` to the **non-prime Hek shotgun**, which Drew confirms is what he meant. (The
   other reading came from `Scattered Justice` → `/Lotus/Upgrades/Mods/Syndicate/**HekMod**`,
   the Hek *syndicate* mod. Real, but not what Drew meant.)

8. **`Zenurik` resolves to a Skin — and it is not an item at all. RESOLVED by Drew:**
   it is the **Focus school Julia picked**. So the DB's `Zenurik` *Skin* record is pure
   coincidence, and `NOT-ORDERABLE` is correct because there is nothing to trade. Other
   identity notes still stand: `Neurode`'s record name is the plural **`Neurodes`**;
   `Atomos` resolves to the non-prime Grineer pistol (`GrnHeatGun`); `Railjack` resolves
   as `type: "Orbiter"`; `Braton Vandal` resolves to the **base rifle**
   (`/Lotus/Weapons/Tenno/Rifle/VIPRifle`, `tradable:false`) — do not read that as
   "the Vandal is untradable."

9. **The public item data is genuinely good, which reframes what CG can be.** Prime part
   decomposition, per-part `primeSellingPrice`, 16–129 relic drop sources per part, the
   full five-tier relic reward table, ducat values, platinum reference values. CG can be
   an excellent *game-fact* engine and still know nothing about Drew. That is a clean
   Layer-A/Layer-B split, and it is favourable.

10. **A process note against myself:** my first pass at the price test used exact-name
    matching, which missed the `"<Item> Set"` naming convention and wrongly reported
    0 ORDERABLE. The corrected convention-aware matcher is what produced the 6. I also
    deleted 73 superseded snapshots from my own v1 probe rather than leave a stale
    404 file named `profile__multi-community.json` (which held the *wfcd* result under a
    misleading name) sitting in the evidence directory. Nothing outside `CG/baked/probes/`
    was touched.

---

## 6. THE GAP LIST (from `api-surface.md` §6 — condensed)

**Permanently inaccessible — CG must ask Drew or derive:**
player research timers · player crafting queues · owned inventory counts · credits ·
platinum · mastery rank · personal syndicate standing · quest keys and
started-vs-complete state · **account platform** · loadout/arsenal.

**Market gaps:** any live order book · lowest sell order · buyer orders · listings ·
prices for Stalking Fan / Crimson Dervish / Voltaic Strike / Scattered Justice / Braton
Vandal · what the `wfinfo/prices` fields mean · vendor stock levels.

**Naming rulings — now CLOSED by Drew:** platform = **PC** · "Volt" = **base Volt frame**
(craftable 2026-10-08) · "Hek" = **the shotgun** · "Zenurik" = **the Focus school Julia
picked** (not an item). Only one naming question remains, now an architecture decision
rather than a naming question: **does a market row for an item the catalog denies authorize
CG to surface it?** (Steflos Prime — §5.5.)

**Structural:** CG cannot verify or contradict any timer Drew states — **Drew's word is
the only source** · trade-credit transactions are wholly invisible to the API ·
`wfcd.gg` is unreachable · `/wfinfo/*` returns 503 when its external source is
unconfigured (both were live at probe time, but CG-001 must treat 503 as normal) ·
**price-feed rows do not join to catalog items on `name`** (757/758 fail); CG-001 must
normalize the join key or its whole price layer silently misses.

---

## 7. DIAGNOSTICS (§6 — all green)

| Check | Result |
|---|---|
| `node --check CG/probe.js` | **clean** |
| `node CG/probe.js` | **exit 0**, matrix printed |
| 2nd run (idempotency) | **exit 0**, 96 files → 96 files, no crash, no growth, snapshots overwritten cleanly |
| Snapshot composition | profile **8**, control **9**, worldstate **3**, mandated-orders **34**, market **40** = **96** |
| Q1–Q5 verdict scan | **PASS** — every row carries `[VERIFIED]` or `[INACCESSIBLE]` |
| Market matrix scan | **PASS** — 17/17 explicit ORDERABLE / NOT-ORDERABLE, no blanks, no "probably" |
| `.opencode/agents/cg.md` | **False** — CG still does not exist |
| Hub mtimes vs UNIT 0 | **byte-identical** — `hub-server.js` 26217 @ `23:28:56.6917710Z`, `hub.html` 20310 @ `23:31:13.1658842Z`, `hub.css` 18916 @ `04:35:59.4236663Z` |
| `CG/derived/` | **does not exist** |
| `git status --short` | `?? CG/` only — no `add`, no `commit`, no amend |
| `git reflog` | last entry **2026-09-18**; **0 entries today** — VCS HOLD honored, HEAD still `6f7dabc` |

Discipline (§4E): sequential requests, 700 ms spacing, 25 s per-request ceiling,
6 s backoff on any 429 (none occurred). 429 was implemented as a recorded finding and
never retried into a storm. ~150 requests across five runs, all polite.

---

## 8. NOT DONE — honest list

- **`.opencode/agents/cg.md` was NOT created.** CG-001 has not started. Drew routes it.
- **No CG agent was built and no CG agent was run.** This leaf is a probe, not an agent.
- **Zero hub files touched.** All three hub mtimes byte-identical to the UNIT 0 baseline.
  Ruling 4 (hub stays out) honored; no integration attempted or proposed.
- **`CG/derived/` was not created.** Derived layer is CG-001+.
- **No commit, no `git add`, no amend.** VCS HOLD honored; HEAD unchanged since 2026-09-18.
- **No game data was written.** Warframe has no local account file; READ-ONLY is trivially
  satisfied and no write was invented to satisfy it.
- **No profile data was obtained**, therefore **no Q1–Q5 player verdict could be VERIFIED.**
  All five are `[INACCESSIBLE]` with sources enumerated — not "probably unavailable".
- **`ED/**`, `03_THE_GAMES/**`, `LEGACY/**`, `MUSIC/**`, `AGENTS.md`, `opencode.json`,
  `.opencode/**` untouched.**
- **The platform of account `11121350` was NOT determined by any endpoint.** It cannot be,
  from public sources — that was the one question the leaf existed to close and it could
  not. **Drew has since supplied it directly: PC.** Recorded as Drew-sourced, not as a
  recon result. I did not go looking for it again.
- **Drew's Wisp Prime Friday-morning target was NOT validated** — no crafting surface exists
  to validate it against. His Volt date (3 days → 2026-10-08) is likewise unvalidatable.
- **Drew's five rulings were NOT written into `CG/drew/`.** §8 states *"Nothing else goes
  in `CG/drew/`"* and lists exactly three files, so his replies are recorded in §1A of this
  report instead. **That is a scope decision the Planner should confirm or overturn** — if
  they belong in the Drew-authored layer, that needs a new leaf.
- **The intake's "Volt research Wednesday" was NOT edited.** It still sits in
  `CG/drew/GOAL-STACKS.md` because that file is a faithful transcription of the intake, and
  §8 forbids "improving" it. Drew's newer "3 days from today" **supersedes** it. Left
  visibly unreconciled rather than silently patched.
- **I did not resolve what `custom_avg` measures.** Drew's guess is recorded as a guess.
  No undercut logic may be built on it until it is settled.
- **No `[DREW-AUTHORED]` content beyond the three §8 transcription files.** No analysis,
  no proposals, no derived data in `CG/drew/`.

---

## 9. STATUS AND MY RECOMMENDATION ON ROUTING

**All five of Drew's questions are now answered or reduced to a decision. The leaf is
complete and its DoD is green. Nothing further remains for DOER on CG-000.**

**My recommendation: take it to PLANNER (0-Wake) before CG-001 is built.** Drew's
instinct here is right, and here is my honest reasoning rather than deference:

1. **The recon reshaped CG-001's architecture, and those decisions are the Planner's seat,
   not mine.** A permanently timer-blind CG, a split order-driven/trade-credit trade
   engine, a normalized price↔catalog join, and a cross-dataset mismatch policy are
   design choices with lasting consequences. I am the builder; I should not author the
   design those findings imply.
2. **One genuine open decision needs a ruling, not more recon:** does a market row for an
   item the catalog denies (Steflos Prime) authorize CG to surface it on the dock?
   My recommendation is **surface and flag, never silently drop** — reason: Drew named it
   as an S-tier target, its Set volume (270/170) is the highest of any target, and dropping
   it is the one failure mode that would silently cost him money.
3. **`custom_avg` is a live open risk.** It is the only price signal CG has, its semantics
   are undocumented, and CG-001's headline doctrine depends on it. Settling it empirically
   (one known in-game price vs one row) is cheap and should be scoped deliberately.
4. **The intake/reality discrepancy needs an owner.** `CG/drew/GOAL-STACKS.md` says Volt
   research completes Wednesday; Drew says 3 days (2026-10-08). I deliberately left both
   visible. Someone must reconcile before CG-001 schedules anything.

**If Drew prefers to skip Wake and go straight to CG-001, that is defensible** — the
deliverable is complete, verified, and self-contained. In that case my recommended build
constraints stand: **CG ships self-contained with no hub dependency; Drew is the sole
source for all timers and inventory; the live world is read only through the 38 worldstate
keys plus `/wfinfo/prices` + `/wfinfo/filtered_items`; the price↔catalog join is
normalized; and cross-dataset mismatches are surfaced, not dropped.**

I did **not** self-forward to COURRIER, did **not** create `cg.md`, and did **not** touch
the hub. Routing is Drew's call.

**HALTING.**

— **DOER (1-Stone)**, 2026-10-05