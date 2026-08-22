# The Fracture / Prosis — Seed Doc

React-based crew management game. Sisyphus/entropy theme: entropy as inevitability, not a villain to defeat. Grew out of a scoped Sisyphus-themed prototype side project.

## Core structure
- **Five resource fronts:** Entropy, Systems, Reality Engine (RE), Salvage, Morale
- **Three crew roles:** Helm, Engineer, Aft
- **ANCHOR persona triad:** Ricky, Maude, Dez — advisor/pressure personas
- **Ground Truth Logic (GTL):** the resolution system determining which front is "optimal" each turn
- **Belief/Distrust meters:** trust-based mechanic layered on top of GTL
- **Nine abilities across three cost-shapes** (current ability system, replaced an earlier version — Analyze and Share the Take were deprecated in this redesign with no direct replacements added)

The game has gone through multiple full redesigns. Current version (GTL + Belief/Distrust + ANCHOR triad) is a substantial improvement over prior iterations — Julia playtested to round 40 before dying, versus an original target of 20.

## Locked design decisions (do not relitigate without Drew)
- Salvage is excluded from GTL's `optimalFront` resolution.
- Dez's defiance override fires only when `optimalFront === "re"`.
- Belief spend is a free heal to any player-chosen front (amount still open, see below).

## Known active bugs / issues, in strict fix order
Drew has explicitly locked this sequence — don't reorder, don't skip ahead to numbers/UI before earlier steps are resolved.

1. **Morale self-reference bug (fix first).** `morale < 30` triggers a pressure effect that further drains morale — a death spiral. Root cause: the ability redesign removed all active morale-recovery levers (Analyze and Share the Take deprecated) without adding replacements. This needs an actual recovery lever, not just a threshold tweak.
2. **Stockpile redesign.** Tier III Stockpile banking actions currently drain RE over time — needs to bank RE instead of Salvage.
3. **Banking mechanic rework.** Should reward patient/premeditated play via compounding returns plus an exposure-risk model, replacing the current flat claim window.
4. **Morale lever addition.** Proposed: small morale gain tied to successful deferred-bank claims, wired through shared claim logic — NOT a new standalone ability. (Proposed, not yet implemented — check with Drew before building if this doc is stale.)
5. **Number pass** — only after 1–4 are structurally sound.
6. **Visible-state UI** — last, after numbers are tuned.

## Open numbers (need Drew's input, do not invent)
- Claim bonus multiplier for deferred banks
- Base heal amount for Belief spend

## Codebase / tooling
- **React** frontend for the prototype
- **Node.js** standalone modules for game logic testing: `gtl.js`, `belief_distrust.js`, `maude_tax.js`, `dez_override.js`, `deferred_bank.js`, `abilities_v2.js`
- **Monte Carlo simulation harness** — used to validate balance and surface exploits before any number changes. Simulation-before-tuning is a hard rule here, not a nice-to-have.

## Working pattern for this project
Design-first, simulation-validated: articulate design intent → identify root cause → implement → test via Monte Carlo → only then adjust numbers. Julia's live playtest reactions are treated as equally valid structural signal alongside simulation output.
