# FRAMEWORKS

*Reusable design patterns and cognitive models for ESSENCE DESIGNS.*

---

## 1. Ways & Whys
A framework for character and player motivation.
- **The Way:** The literal, mechanical direction a person or player is going. (e.g., "I am grinding for Salvage.")
- **The Why:** The underlying psychological or narrative reason they pursue it. (e.g., "Because I need to repair the Reality Engine to feel in control of the entropy.")

## 2. Wants / Needs / Laws
A framework for boundaries and agreements between the designer and the player.
- **Wants:** What the player *thinks* they desire (e.g., infinite power, an easy win).
- **Needs:** What the player *actually* requires to feel engaged (e.g., friction, meaningful choices, near-miss failures).
- **Laws:** The immutable rules of the game universe that enforce the Needs and restrict the Wants.

## 3. The Encounter Framework (The Anatomy of Conflict)
Every encounter, whether a boss fight or a narrative conversation, must define:
1. **The Stakes:** What is permanently lost if the player fails?
2. **The Resolution Vector:** How does the player mechanically express their intent?
3. **The Emotional Fallout:** How does the game state change permanently based on the outcome?

## 4. The Character Framework (The Anchor Triad)
A narrative pattern ensuring characters exist for mechanical and thematic reasons, not just set dressing. 
Example from PROSIS (Ricky, Maude, Dez):
1. **The Pragmatist:** Cares only about survival and efficiency.
2. **The Idealist:** Cares about morale, ethics, and the human cost.
3. **The Wildcard:** The chaotic variable that forces the player to adapt when systems fail.

## 5. The Deterministic QA Ledger (WAVE_STATE_LOG)
A deterministic QA / audit-ledger pattern: a single authoritative "directive log" that
registers enacted state repairs, invariant guarantees, and cleanroom-seal conditions for a
codebase, so auditors can verify a module returns to pure Zero State. Ported from the fl0w
hub v0.1 (`LEGACY/VAULT/essence-fl0w-hub-v0.1/`) during the **fl0w survivor port**
(2026-09-17). Full pattern: `WAVE_STATE_LOG.md`.

## 6. The fl0w Ticket / Spec Schema
The ticket + sprint schema that governed the retired layer-2 hub's kanban and spec system
(Ticket, SprintGoal, AgentProfile, GitRepoState, CleanroomReport). Kept as reference schema
for any future spec system — the non-persisted kanban *runtime* was ruled dead weight.
Ported from the fl0w hub v0.1 during the **fl0w survivor port** (2026-09-17).
Live at `fl0w-ticket-schema/` (`types.ts` + `data/initialData.ts`).