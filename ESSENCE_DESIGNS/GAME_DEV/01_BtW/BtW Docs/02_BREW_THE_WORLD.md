# Brew the World (BtW) — Seed Doc

Narrative shopkeeping game for Steam. Cozy potion-sim surface concealing the protagonist's complicity in a totalitarian war state — the tension between "cozy game" genre expectations and the actual moral weight of the story is the point.

## World & cast
- Protagonist: **Fennel**
- Setting: **The Fields**
- Ruling faction: **The Orchard**
- Resistance: **The Weeds**
- Cast: 33+ named characters, full codex built (filterable HTML artifact, modal detail views)
- Naming convention: botanical, animal, food, and elemental schemes, with deliberate symbolic weight baked into component words (e.g., "Hemlock" = "hem" + "lock" — containment/restriction embedded in the name itself). New character names should follow this scheme and carry similar intentional double meanings.

## Structure
- Six-act macro structure — **locked**
- Vertical slice — **scoped**, not yet built
- Mechanical skeleton fully designed; scene drafts have begun

## Absolute design constraints (do not violate)
- **No-visible-relationship-meters rule:** the UI must never surface relationship/trust state directly to the player. This is not a preference, it's a hard constraint.
- **War-supply and local-use recipes must be visually identical** in the brewing interface. The interface must never mark or flag complicity — the player should be able to brew war-supply potions without the UI tipping them off that that's what they're doing. This is core to the game's thesis (cozy surface hiding complicity).

## Remaining open work
- Deep character pass: want / fear / secret / voice for each cast member (not yet done for full cast)
- Finalizing the relationship web (Mermaid diagram in progress — see tooling notes below)
- Building concrete overlap-zone mechanics (where systems intersect — not yet specified further; ask Drew for current definition of "overlap zones" if this term needs to be operationalized)
- Vertical slice build itself

## Tooling notes
- World/style bible: complete, eight sections
- Cast codex: HTML/CSS artifact, 33 characters, filterable, modal detail views
- Relationship diagram: Mermaid, with documented syntax gotchas — semicolons inside edge labels break parsing, em-dashes are invalid in labels, bidirectional dotted-arrows are unreliable and should be avoided or double-checked
