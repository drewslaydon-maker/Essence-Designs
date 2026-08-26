# The Fracture / Prosis — Seed Doc⚠️ **This doc was rewritten 2026-08-23 to match actual code state.** Previous version claimed the build had bugs that were already fixed, and omitted systems that already exist. The code is canonical; this doc is now grounded in it.

React-based crew management game. Sisyphus/entropy theme: entropy as inevitability, not a villain to defeat.

## Core structure (current)
- **Five resource fronts:** Entropy, Systems, Reality Engine (RE), Salvage, Morale
- **Three crew roles:** Helm, Engineer, Aft (personal names: **Helm, Gene, Sal**)
- **ANCHOR persona triad:** Ricky, Maude, Dez- **Ground Truth Logic (GTL):** the resolution system determining which front is "optimal" each turn
- **Belief/Distrust meters:** trust-based mechanic layered on top of GTL
- **12 abilities across 4 cost-shapes:** `different_front_now` (Ricky), `same_front_later` (Maude), `deferred_compounding` (Dez), and `personal` — a fourth shape added2026-08-20 (Helm's Analyze, Gene's Dead Reckoning, Sal's Ration the Take). Multiple personal mitigations stack multiplicatively in the same round; not specifically tuned.
- **Barriers** (formerly "Banks"): user-facing rename2026-08-20. Internal variable names (`openBanks`, `tickBankGrowth`, `claimBank`, etc.) were deliberately not renamed.

The Fracture safety-valve (Systems/RE hitting 0 was patched up to 3 times per run) was **removed entirely** in the 2026-08-20/21 handoff. Systems ≤ 0 or RE ≤ 0 is now an immediate, direct loss condition.

## Locked design decisions (do not relitigate without Drew)
- Salvage is excluded from GTL's `optimalFront` resolution.
- Dez's defiance override fires only when `optimalFront === "re"`.
- Belief spend is a free heal to any player-chosen front (amount still open, see below).
- Personal abilities (`shape: "personal"`) are explicitly NOT a fix for game-state legibility. That work is separate and still open.
- Multiple mitigations from personal abilities stack multiplicatively in the same round.

## Bug status (current)
| # | Bug | Status |
|---|---|---|
| 1 | Morale self-reference (death spiral) | **Fixed 2026-08-20.** `pressureForMoraleDrain` no longer includes morale. |
| 2 | Stockpile redesign (was banking Salvage, should bank RE) | **Fixed 2026-08-20.** `stockpile` now banks RE; comment documents the redesign rationale. |
| 3 | Banking mechanic rework (compounding + exposure) | **Implemented.** First-pass constants — `BANK_GROWTH_RATE = 0.08`, `BANK_EXPOSURE_HAIRCUT = 0.30`, `BANKING_GTL_CREDIT = 0.4` — all flagged "FIRST PASS, flag for Monte Carlo." |
| 4 | Morale lever (no active lever after Analyze/Share dropped) | **Implemented 2026-08-20.** `MORALE_ON_CLAIM = 5` — barrier claims give +5 morale. |

## What's open right now (in priority order)
1. **Live-runtime verification.** Per the 2026-08-20/21 handoff: the current build has not been tested in a real browser since the Fracture removal + 4th-ability additions. This is the single highest-risk gap. Drew confirmed an offline playthrough pass; a smoke test now exists in `test/smoke.test.ts` for module-level invariants.
2. **Monte Carlo simulation harness.** Per the seed-doc hard rule "simulation-before-tuning is a hard rule, not a nice-to-have." Pure modules are now extracted (`gtl.ts`, `personas.ts`, `barriers.ts`, `mechanics.ts`) and accept injected RNG. Harness is next concrete work.
3. **Number tuning.** `BASE_HEAL = 15`, `BANK_GROWTH_RATE = 0.08`, `BANK_EXPOSURE_HAIRCUT = 0.30`, `BANKING_GTL_CREDIT = 0.4`, `MORALE_ON_CLAIM = 5` — all first-pass, all flagged. Do not tune by hand; use Monte Carlo output.
4. **Threat/event feedback clarity.** Most-repeated still-unaddressed request. Explicitly NOT solved by personal abilities. Separate work.
5. **Visible-state UI pass.** Per the original locked build order step6.
6. **Distribution decision.** `.exe` (Electron, Windows-only,150MB+) vs. web build (itch.io serves HTML directly, Mac/Linux/Windows covered) vs. Steam HTML build (needs Steamworks integration decisions). Decide before rebuilding UI in earnest.

## Open numbers (need Drew's input, do not invent)
- Claim bonus multiplier for deferred banks
- Base heal amount for Belief spend (`BASE_HEAL` placeholder)
- Any tuning of the five "FIRST PASS" constants — only after Monte Carlo

## Codebase / tooling (current)
- React JSX frontend (`the-fracture-playtest.tsx`), UI orchestration only
- TypeScript pure modules (strict mode): `types.ts`, `constants.ts`, `data.ts`, `events.ts`, `gtl.ts`, `personas.ts`, `barriers.ts`, `mechanics.ts`
- `node:test` smoke test in `test/smoke.test.ts` (run via `npm test`)
- Monte Carlo harness — **not yet built**, gated on Monte Carlo being next concrete work
- Persistence: `localStorage` shim with Claude-artifact API fallback (so the build runs anywhere)

## Working pattern for this project
Design-first, simulation-validated: articulate design intent → identify root cause → implement → test via Monte Carlo → only then adjust numbers. Julia's live playtest reactions are treated as equally valid structural signal alongside simulation output.

## Not yet validated (per 2026-08-20/21 handoff)
- Whether removing Fracture Events resolves or worsens the prior "Systems/RE never fail in simulation" problem — unknown until Monte Carlo runs against the new build.
- Whether multiplicative mitigation stacking across multiple personal abilities creates dominant strategies.
- Whether 4th-cost-shape abilities ("personal") create new bottlenecks in the deck-read or axis-compounding system.
