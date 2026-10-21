# CG-002-B — LOOT/TRADE LOG: REQUIREMENTS CAPTURE (session input, not yet a task package)

- Captured: 2026-10-06 (evening, while Drew grinds relics)
- Planner: 0-Wake (PLANNER seat). This is a PLANNING NOTE, not a task package — no build, no DOER run.
- Dev is PAUSED by Drew for the grind; this file is the exact source for tomorrow's CG-002-B spec.

> SUPERSEDES the original CG-002-B "loot logging" placeholder from the CG-002 reset.
> CG-002-B is now **LOOT/TRADE LOG** — a bilateral ledger: drops come IN via click, sales go OUT via trade log entry, and a recorded sale removes the part from the dock.

## Drew's words (verbatim intent, evening 2026-10-06)

"only issue with my current Loot/Trade dock is a lack of a trade log/tracker where i can enter in what i sold, for how much, to what kind of player (Since items like Scattered Justice are noob buys typically, vs high level primes are likely to be bought by high level players), and have that translate to its removal from the dock. ive gotten 4 diff items on tonics relics, and none are super impactful, but i cant add them to the current dock as it stands. having to use a text doc, so we gotta fix that. right now when i pop the relic, i search my page and the wf.market page to see our price and intention/current items of the set i have, then the current listings on the market for an idea of what its lowballing for. should be able to click the item segment if/when i get a drop, and have it in the dock"

## The workflow to support (as Drew described it tonight)

1. Pop a relic.
2. Search his page (the dock) AND the wf.market page to see:
   - the price (dock AVG / feed reference)
   - the intention (`liveActionPlan` / `marketRead`)
   - current items of the set he has (HAVE per segment)
3. Look at current market listings for a lowballing read.
4. When he gets a drop → **click the item segment → it's in the dock** (pickup logged, HAVE).

## Requirements (stated by Drew tonight)

- R1 — DROP-IN: click an item segment on the dock when he gets a drop → part is logged as HAVE in the dock.
- R2 — TRADE LOG: a tracker where he can enter a sale: item/part sold, for how much (plat), to what kind of player (buyer class).
- R3 — BUYER CLASS is first-class data: noob buyers (e.g., Scattered Justice is typically a noob buy) vs. high-level players (high-tier primes). Connects to his TRADE-DOCK.md doctrine.
- R4 — SALE = REMOVAL: recording a sale translates to the part's removal from the dock (it leaves HAVE / disappears from sellable inventory).
- R5 — AD-HOC ITEMS: tonight's 4 relic drops ("none super impactful") cannot enter the current static dock — he is using a text doc. The dock must accept items it didn't ship with.

## Q1 ANSWERED by Drew (2026-10-06, while grinding relics) — MIXED

BOTH paths are required. Tonight's 4 drops classified against `CG/derived/dock.json` + `baked/probes/market__wfinfo-prices.json`:

| # | Drop | On 35-dock? | Dock state today | Feed reference | Drew's words |
|---|---|---|---|---|---|
| 1 | Trumna Barrel | YES — Trumna Prime IS docked | BP have is TRUE; Barrel/Receiver/Stock all have=false | Barrel avg 8.4 / vol 32; Set avg 20.3 | "Barrel [9p] — have BP / missing Receiver / Stock, 20p ish set, missing 8-12p in the 2 items" |
| 2 | Sevagoth BP | NO — not on dock | — | BP avg 5.6 / vol 42; Set avg 34.7 | "Sevagoth BP [5p] — no other parts" |
| 3 | Vadarya Receiver | NO — not on dock | — | Receiver avg 3.0 / vol 20; Set avg 13.9 | "Vadarya receiver" (no price stated) |
| 4 | Strun Prime Receiver | NO — not on dock | — | Receiver avg 6.4 / vol 16; Set avg 61.1 | "Strun Prime Receiver" (no price stated) |

Consequences for CG-002-B:
- R1A — CLICK-TO-HAVE on existing docked segments (Trumna Barrel: have=false → true; `missing` shrinks to ["Receiver","Stock"] = exactly Drew's read of "missing Receiver/Stock").
- R1B — FREE-TEXT NEW-ITEM ENTRY for off-dock drops (Sevagoth BP, Vadarya Receiver, Strun Prime Receiver). The dock must accept an item it never shipped with. Q5's persistence home must carry NEW items, not just flips on the 35 (the 35-item "item list" is xlsx-derived; an off-dock item has no xlsx cell).
- Value readability: each drop carries Drew's stated price where given (Trumna Barrel 9p, Sevagoth BP 5p) and the feed reference exists for all four. Never invent a price Drew didn't state — render feed avg as reference where his word is absent (Vadarya, Strun Prime).
- The four drops ARE the acceptance fixtures for CG-002-B's first cut (logged tonight in his text doc, to be mirrored into the dock tomorrow).

## Open questions for tomorrow's CG-002-B package (Drew to rule; ZERO invention)

2. **qty > 1:** if he has 2 of a part and sells 1, does the sale decrement (qty 1 → 1/1 remaining) or remove entirely? Dock's `have` is currently boolean-ish (qty >= 1).
3. **Buyer class labels:** exact taxonomy — e.g., NOOB / MID / HIGH (or his exact words). Sales log should store Drew's label verbatim, never CG's guess.
4. **Sale editing:** can a sale be corrected/refunded after entry? (Assume yes eventually; simplest first cut could be append-only + a "wrong entry" delete.)
5. **Persistence home:** CG-002-B will touch `CG/baked/FIELDS.json` (DREW_SOURCED ledger) — which is also where F1 (`_doc_count` 24+58=82, should be 25+55=80) gets fixed. Confirm FIELDS.json is the store, or a new `CG/baked/trade.log.json`. **NOTE: must now also store NEW off-dock items and their parts (see Q1 answer).**
6. **Corufell interaction:** Corufell is 4+1 BP — CG-002-A must land BEFORE CG-002-B so Stock exists as a real slot to log/remove. Order is unchanged.

## Standing gates folded in

- F1: `_doc_count` fix parks in CG-002-B (FIELDS-touching toss).
- F3: `console.test.js` C5 persistence timeout → CG-002-C.
- F2: WASH mtime baseline capture gate — whichever toss first touches state.

## Status

- CG-002-A (CRAFT MODEL) remains planted at `CG/CG-002-A_CRAFTMODEL_TASK.md`; order: A → B → C.
- Dev paused until tomorrow by Drew. Nothing in this file is canon until Drew approves the CG-002-B package.