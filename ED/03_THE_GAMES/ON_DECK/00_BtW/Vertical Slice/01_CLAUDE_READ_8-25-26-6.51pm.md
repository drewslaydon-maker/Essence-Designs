

❯ I'm rebuilding brew-the-world-day-1.html, an existing HTML/JS single-file vertical slice for a narrative shopkeeper game. The file works and has real content in it — don't discard it, restructure it. Read the whole file before changing anything.



&#x20; Reference docs (read these first)

&#x20; brew-the-world-vertical-slice-plan.md — locked scope, just revised this session

&#x20; brew-the-world-vs-quickref.md — the 17 Day 1 characters, want/fear/secret/color

&#x20; brew-the-world-vs-image-suggestions.md — visual direction per character

&#x20; brew-the-world-cast-bible.md, brew-the-world-style-bible.md, brew-the-world-combat-encounter-system.md — full project reference if anything above is ambiguous

&#x20; What's wrong with the current build (fix these — this is the actual task)

&#x20; Location flow is wrong. The current build renders Shop/Market/Treeline as three zones side by side in one persistent stage, with Fennel walking between them. It should be true VN-style: one full-screen location at a time, swapping on transition. No persistent multi-zone map. The existing modals (reasoning window, combat, brewing) already work as full-screen overlays — extend that same pattern to the locations themselves.

&#x20; Kirkwood is present; he nd absent until roughlyAct 3. Remove him from the interactive CHARACTERS/DIALOGUE data and the

&#x20; breakfast scene. Don't j absence should register(an empty place at the table, or one acknowledgment line from another family member). Open question, don't guess: which character carries that line —

&#x20; Cedar, Sage, Clover, or e you think reads bestand flag it clearly as a guess in your summary so I can override it fast.

&#x20; Home isn't a real location. The breakfast scene is currently a text modal layered over whatever zone is on screen, never an actual place. It needs to become a real scene — the first location of Day 1, before the shop opens — not a popup.

&#x20; Brewing is an open recipiven. Right now all 4recipes sit in one always-visible list, gated only by ingredients. Replace this with orders arriving one at a time — a customer or standing obligatpresents a specific ordefills it, then the nextorder surfaces. Include and at least onewar-supply order in the sequence, and they must be visually and structurally identical in the UI — same order-card treatment, same flow, no tag or badge distinguishing them. That distinction is data-only, never rendered.     Character definition \& v



&#x20; The current build's character "portraits" are single capital-letter glyphs on a flat category-colored background — not enough to actually distinguish 17 characters from each other. Fix this alongside the structural rework, not as an afterthought:



&#x20; Give each Day 1 character their locked individual color, not just their category default. Most are already specified in brew-the-world-vs-quickref.md (Fennel feathery yellow-green, Cedar warm reddish wood-brown, Sage dusty grey-green, Clover bright grass-green, Daisy white/yellow, Fox rust-orange, Mugwort silvery-green, Coal black-with-ember-undertone, Badger black-and-white banding, Loam rich earth-brown, Marigold saturated gold-orange, Barley warm wheat-gold). For the characters still on proposed-not-locked colors (FalMillet, Ferret, Weasel), record rather thaninventing new ones — flag them as proposals in your summary, same as the docs do, but don't leave them on generic category color.

&#x20; Replace the letter-glyph portraits with simple category-appropriate silhshapes (SVG or CSS is fiet). The style bible'ssilhouette grammar gives you the shape language directly: soft flowing curves for botanical, round practical shapes for food, animal-feature silhouettes for animal, angular tool-marked shapes for elemental. Doesn't need to be a full character illustration — even an abstracted category-shaped icon in the character's own color is a big step up from a bare letter, and it's consistent with the game's whole "signal weight before the player reads a word" design logic.

&#x20; Add the environmental storytelling the style bible calls for and the current shop is missing entirely: at least one Orchard requisition stamp visible on a crate, and the "Orchard-Approved Supplier" placard by the shop door. Smaambient, not commented o "the UI never announceswrongness" rule. This was flagged as a gap in an earlier audit and never addressed.                                                              General visual polish pawarm aesthetic alreadyestablished — the current build's tone and palette are right, just underbuilt. Bloom or glow on warm light sources (hearth, lanterns, brewing steam) versus flatter treatment in any Orchard-adjacent framing; a scene-transition animation (a soft crossfade is enough) between the new full-screen locations from item 1, so the VN-style swap doesn't feel like a hard cut; texture dialogue box per the styment, consistent chromeregardless of speaker — this rule doesn't change, just give it actual texture instead of a flat panel).                                               Preserve from the existiod, don't rewrite itThe dialogue voice and tell-matched to the castbible, just re-host it in the new scene structure and new portrait treatment above, don't regenerate the writing itself.

&#x20; Weasel's 4-line leniency sequence, verbatim.                            The combat command set (and its framing text.

&#x20; The reasoning window's descriptive text (the tin cup, the Hollow at the marsh edge) — the prose is strong, keep it.

&#x20; The categoryClass() fix (food/animal/elemental checked before botanical, to avoid the "non-botanical" substring bug).

&#x20; Non-negotiable constraints — don't relitigate, build inside them

&#x20; No visible relationship/trust/reputation meters, anywhere, even as a debug placeholder.

&#x20; No visual distinction anywhere in the UI between war-supply and local content — recipes, orders, ingredients. The kind field pattern already used in the current RECIPES array (stored, never rendered) is correct — keep that approach for orders too.

&#x20; Fennel's combat kit stays diegetic — scythe as a harvesting tool, not a weapon; consumables are spells.

&#x20; Dialogue box chrome stays visually identical regardless of speaker, even with the added texture above.

&#x20; Visual polish never becomes a wrongness signal — no red flags, no warning

&#x20; tints, no restricted-iteuch more polished the UIgets.

&#x20; One more known gap, not yet scoped in — flag, don't fix yet



&#x20; The reasoning window before the Hollow encounter currently always leads into combat — there's no actual de-escalation/retreat path before combat starts, only inside it. Known issue, out of scope for this pass unless I say otherwise. Don't fix it opportunistically; note it in your summary if the location-flow rework happens to touch it.



&#x20; Deliverable



&#x20; A single rebuilt brew-the-world-day-1.html. Summarize what you changed, whyou preserved, and flag especially the Kirkwoodbridge-line question and the unlocked-color proposals) so I can review fast rather than re-read the whole diff.

