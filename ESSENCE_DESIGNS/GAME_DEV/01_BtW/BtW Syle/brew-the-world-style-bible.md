# BREW the WORLD — World / Style Bible

*Working reference document. Visual direction, tone, UI language. Companion to the cast bible.*

\---

## Core Design Principle

**The UI never announces wrongness. The player does the noticing, or doesn't — the same failure every complicit villager in the story makes.** No creeping corruption in the menus, no darkening chrome, no glitch effects as guilt accrues. The interface is stable and warm from the first frame to the last. Horror lives entirely in what's shown — environment, sprite detail, dialogue, consequence — never in how it's shown. This governs every section below; when in doubt, push the discomfort into the art, not the frame around it.

\---

## Reference Touchstones

**Primary anchors:**

* **Octopath Traveler (HD-2D)** — detailed pixel sprites inside 3D dioramas, dramatic directional lighting, bloom, depth-of-field vignetting. The load-bearing quality to borrow isn't the tech, it's the *diorama effect*: everything looks composed, curated, a little too perfect — a snow globe. That serves the thesis directly. The village should look gorgeous in a way that's quietly suspicious.
* **Classic FF (FF6-era specifically)** — the sharper reference for theme, not just look. Imperial/Vector spaces vs. rural/natural spaces render in starkly different palettes using the same engine, no UI change. Structurally a cheerful-looking RPG that becomes an apocalypse story without the interface ever flinching — direct precedent for the core design principle above.

**Secondary, worth pulling from selectively:**

* **Live A Live** — same HD-2D register as Octopath, proof the art style doesn't cap how dark content can go.
* **Moonlighter / Potion Permit** — weaker visual fidelity, but the closer genre cousins for shop-ledger and inventory UI, since Octopath has no comparable shopkeeping loop.

\---

## Visual Identity Overview

**Rendering approach:** True HD-2D — pixel-art sprites rendered inside real 3D environments, with a custom shader pipeline driving bloom, depth-of-field, and dynamic directional lighting. Not an approximation of Octopath's look; the actual technique. This is a real engine commitment (Unity or Unreal, custom shader work) to carry into the step 6 tooling decision — noted here so it isn't a surprise later, not re-litigated now.

**Sprite scale \& detail:** Character sprites detailed enough to read individually at shopkeeping-sim conversation distance — closer and more legible than Octopath's typical overworld scale, since BREW lives in dialogue and counter-interactions far more than exploration. Full idle/walk/gesture animation sets per named character; the 25-character cast is the reason this line item matters, not decoration — every one of them needs to be readable as a person in a two-line dialogue exchange, not just a sprite passing through.

**Environments:** Modeled 3D dioramas per location, lit and lensed like Octopath's — tilt-shift depth of field, warm directional light in village/shop spaces, colder or harsher light where Orchard presence intrudes. Palette does the tonal work FF6 proved out; the lighting engine does the mood work Octopath proved out. Neither ever touches the UI layer.

**Camera:** Mostly fixed, dramatic angles per scene (not free-roaming 3D camera) — closer to Octopath's per-location camera setups than a true 3D game's camera freedom. Reserve tighter vignette framing for dialogue-critical beats and the sphere-swing moments specifically (Sparrow's choice, Barley's crux, Kirkwood's broadcast) — those get the camera language a battle transition would get in a JRPG, without needing an actual battle system to justify it.

\---

## Color Language

**Core principle:** Every character's color identity is drawn from the literal real-world referent of their name — not an assigned "hero blue / villain red" scheme, but grounded, motivated color. This makes the palette an extension of the naming convention rather than a separate signaling system: the same attentive player who clocks that a name is botanical gets rewarded again when they notice the color is doing the same work. This lives entirely in character/environment art — sprite palettes, portrait lighting, scene dressing. It never touches UI chrome, per the core design principle.

**Botanical (family / major-narrative-carrying):** Drawn straight from the actual plant. Because most of these plants are medicinal-or-toxic (sage, hemlock, mugwort, clover), the palette carries a built-in beautiful/dangerous duality that needs no extra design work — it's already true of the plants themselves. These characters also get the gentlest, most painterly lighting treatment in the HD-2D pipeline, since they're the emotional center — which means Hemlock, of all people, gets rendered as tenderly as Fennel. That's not an error, it's the point.

* Fennel — feathery yellow-green
* Sage — dusty grey-green (the name already is the color)
* Cedar — warm reddish wood-brown against evergreen
* Marigold — saturated gold-orange, hearth-warm
* Clover — plain bright grass-green
* Daisy — white and yellow, legibly the "purity" palette
* Mugwort — silvery-green, faintly otherworldly, matching The Undoctored's Star card
* **Hemlock** — pale flower-white against poison-green stem. Critically: this personal palette stays warm and organic even when he's standing in cold Orchard-institutional environments (see below). It's Pine's color, not the doctrine's, and it never fully leaves him. The visual proof his fear names directly — the man and the doctrine are still in tension, on screen, every time he's on it.

**Food (everyday village life, often closest to the Hollows thesis):** Warm, saturated, appetite-coded tones — Barley's warm wheat-gold, Butter's pale creamy yellow, Lemon's bright citrus. Deliberately the "nourishment" palette, which is not incidental: Barley and Lemon are the two characters carrying the humanize/dehumanize crux, and nourishment-colors on characters wrestling with whether people get treated as human or as resource is a cheap, durable irony.

**Animal (instinct, camouflage, resistance-adjacent):** Earthier, muted, naturalistic — Fox's rust-orange, Owl's mottled grey-brown, Sparrow's soft unassuming brown (hidden in plain sight, same as her actual role), Badger's black-and-white banding read literally into his design as a visual for his double life. These read as "blends into the village" colors, same job the animal-naming tier already does narratively.

**Elemental (craft, land, raw material):** Harder-edged, more graphic than the organic botanical palette — Flint's spark-orange against grey stone, Loam's rich earth-brown, and Ash/Ember/Coal as a literal forge-toned trio (pale soot-grey, glowing orange-red, black-with-ember-undertone) that visually binds Badger's family together as a unit even independent of the blood-relation complexity already on the page.

**Orchard vs. village overlay:** The FF6 trick sits underneath all of the above — Orchard/institutional spaces render colder, harsher, more saturated-but-artificial; village/organic spaces render warm and naturalistic. Character palettes (above) hold constant across both; only the environment shifts. This is what makes Hemlock's scenes read as dissonant without any UI or dialogue telling the player to feel that — his color is village-warm, his surroundings are Orchard-cold, every time.

**The Hollows:** Rendered desaturated — grey, drained, at or near monochrome. The mechanism is direct: named characters get color born from their name; the Hollows, stripped of voice and (mostly) stripped of name, are stripped of color too. **Lemon is the deliberate exception** — a faint bleed of her original food-category yellow shows through the grey, visible proof that her personhood is recoverable, not gone. That flicker of color is doing the same job the "same character, opposite use by player sphere" mechanic already does in the cast bible, just at the pixel level instead of the dialogue level.

\---

## Character Sprite Design Language

**Core principle:** The naming-scheme logic extends past color into silhouette and costume. Each category gets a distinct shape grammar, readable at HD-2D conversation distance before a player reads a single line of dialogue — the same "who's carrying weight" signal the names already send, now legible at a glance.

**Botanical (family / major-narrative-carrying):** Flowing, organic silhouettes — soft drape, layered robes and shawls, actual embroidered plant motifs at collar/cuff/hem specific to the character's own plant (marigold blooms worked into Marigold's shawl, sage sprigs at Sage's collar). Heirloom-quality fabric and visible tailoring, distinct from the plainer utilitarian cut everyone else wears — narrative weight reads as literal craftsmanship. Fennel, despite being a working shopkeeper, keeps a botanical embroidery detail on her apron that marks her tier even inside a mundane occupation. **Hemlock is the deliberate exception to the softness rule:** his hemlock-flower motifs are real and botanical-accurate, but forced into a rigid, structured, near-military cut — organic pattern under imposed order, the silhouette itself performing "doctrine over devotion" without a word of dialogue.

**Food (everyday village life):** Round, soft, practical shapes — aprons, rolled sleeves, simple smocks. The "salt of the earth" utilitarian tier. Barley is the interesting case: an Orchard-issue enforcer's uniform cut, but food-category softness underneath in texture and color — visual proof he hasn't fully hardened into the role, worn exactly where Barley's whole arc lives.

**Animal (instinct, camouflage, resistance-adjacent):** Costuming pulls literal features from the actual animal — Owl in layered, feather-textured cloaks; Badger's black-and-white banding rendered as a literal striped forge apron and gloves; Fox in weathered leather and fur-trim wraps, built for the outdoors over the shop counter; Sparrow in neat, practical tailor's dress with a single feather-pin, small and easy to overlook — which is the whole point of her. Weasel breaks from the rural register entirely: sleek, fitted, a vest-and-ledger silhouette that reads as office-work dropped into a farming village, matching "slippery" and "proximity to power" at a glance.

**Elemental (craft, land, raw material):** Harder, more angular shapes than the organic botanical curve — tool-belts, leather work-aprons, visible wear and soot. Loam in sturdy, soil-toned farmwear. Flint dusted grey with a literal stone-and-metal tool-belt. Ash, Ember, and Coal share a visual family unit independent of the blood complexity already on the page — matching soot-marked smith aprons and small metal-band accessories (rings, cuffs) standing in for the ribbon-or-fabric family motif the other tiers might use, since metal is their shared language instead.

**Swing characters:** One costume element per swing character reads as genuinely ambiguous — worn in a way that could be read as compliance or as quiet resistance, never confirmed by the art itself. Cedar's requisition coat could be sharply maintained (order) or just slightly too careful, like a man hiding fraying at the seams (repeating what broke him). This stays subtle enough not to spoil the mechanic, but rewards a second look once a player already suspects someone's a swing.

**The Hollows:** No category motif at all. Not animal, not food, not elemental — the naming-scheme visual language requires a name to hang off of, and the Hollows have had theirs taken. Their silhouettes are deliberately generic, stripped of the tailoring/texture specificity every named character gets, matching the desaturation from the color language section. Lemon carries a single food-category detail surviving underneath — the same recoverable-personhood signal as her color bleed, now doubled at the silhouette level.

\---

## Environment \& World Dressing

**Core principle:** The Orchard/village palette split from the color language section isn't just "two zones with two color grades." Propaganda and state presence physically intrude *into* the warm spaces — that's the actual design ask. A fully cold, institutional space is easy; the harder and more thesis-relevant work is the Orchard's fingerprints sitting quietly inside a scene that still reads as cozy.

**Fennel's shop:** The warmest space in the game, and deliberately where the most damning environmental evidence lives, in plain sight. Ingredient crates stamped with Orchard requisition codes she's stopped seeing. A mandatory "Orchard-Approved Supplier" placard by the door, small and unremarkable. Paperwork on the counter that's just paperwork — until an attentive player reads what it's actually authorizing. None of this is hidden. It's ambient, the way her own secret is ambient to her. The shop should be a space a player wants to linger in and only gradually realizes they've been reading the evidence the whole time.

**The village square:** The diorama at its warmest — and the site of a statue or plaque to **Pine**, moss-softened, a little overgrown, mostly walked past without a glance. This is the single most direct physical version of Hemlock's fear: a monument nobody connects to the man standing in front of them. Worth treating as a recurring background element across multiple scenes rather than a one-time reveal beat, so its ordinariness is earned rather than staged.

**Propaganda intrusion motifs:** Orchard posters and notices rendered in the *village's* warm color grading, not the Orchard's cold one — the point isn't that propaganda looks alien here, it's that it's been fully absorbed into the visual normalcy of the place. Picker patrol presence at the edges of otherwise cozy market scenes; a requisition checkpoint dressed like just another market stall until a player looks at what's actually being checked.

**State-adjacent and resistance-adjacent workspaces, by character:**

* **Weasel's requisition office** — cold, institutional, by-the-book — except for one incongruous warm detail that doesn't belong there: something personal, a small object tied to Sage, never explained in the room itself.
* **Marigold's clinic** — village-warm on the surface, but dressed with the specific tension her Fear names: cover and reality that can't quite reconcile, visible in small inconsistencies a returning player would eventually notice (supplies that don't match what she's officially treating people for).
* **Owl's archive** — dense, cluttered, warm lamplight, deliberately the most "lived-in scholar" space in the game — and the one place that visually explains his Fear (irrelevance/erasure) just by existing: too many books for too few visitors.
* **Badger's forge / Nessa's docks** — treated as one continuous space split across two trades, per their cast-bible connection — visual continuity (matching soot/salt textures, shared color accents) between the forge and the boat that's doing more narrative work than either location individually.

**The village edge:** Mugwort's wild garden is the one space with zero Orchard signage of any kind — no requisition stamps, no propaganda, nothing state-touched. Overgrown, untamed, visually the single space in the game that hasn't been normalized by anything. The fields and treeline beyond the village proper are the transition zone into threat — where Picker sweeps happen and Hollows appear, palette sliding from village-warm toward the desaturated grey established for the Hollows themselves, with no hard cut between them.

\---

## UI/HUD Design

**The one rule that governs everything below:** no visible relationship, trust, or reputation meters. No hearts, no friendship points, no numeric bar that fills as a character warms to Fennel. This is a genre norm worth naming explicitly because it's the one most games in this space break by default (Stardew's hearts, most cozy-sim relationship systems) — and breaking it here would directly undercut the core design principle. Sparrow's swing, Ash's swing, Kirkwood's swing all depend on accumulated player choices, and none of that accumulation is allowed to surface as a number. The player has to read it the way they'd read a real person: through what NPCs say, how a scene plays differently than it would have, never through a UI telling them where they stand.

**Dialogue box:** Warm wood-and-parchment texture, a light botanical vine-and-leaf border — but the box itself stays visually identical regardless of who's speaking. Character-specific color and silhouette language lives in the portrait art (per the sprite design section), never in the box chrome. This keeps the UI genuinely stable rather than quietly becoming another place the naming-scheme visual system leaks into "the frame," which would blur the line the core principle depends on.

**Brewing interface:** The central loop, and the single most thematically loaded screen if it's handled wrong. It has to feel exactly as cozy, tactile, and low-stakes as any crafting screen in a comfort game — ingredient slots, a cauldron, warm steam animation — with zero visual differentiation between a recipe that stays local and one that quietly becomes war supply. No red flag, no warning tint, no "restricted ingredient" badge. That absence is the design. The chill is supposed to come later, retroactively, when a player realizes they've been making the same interface work for both the whole time.

**Shop ledger:** Directly downstream of Fennel's central secret and Weasel's connection to it. Deliberately unremarkable — columns, quantities, standard bookkeeping-sim presentation, nothing visually distinct from any other management screen. Critically: no automatic tagging of which ingredients or sales trace back to the war. If a player wants to know what their ledger actually represents, that has to come from dialogue, from world context, from paying attention — never from a UI label doing the work for them.

**Map/navigation:** Light-touch given vertical-slice scope — simple wayfinding within a single zone, nothing elaborate needed until the slice expands past one area. Not worth over-designing now.

**Open question, not yet decided:** whether the tarot spread ever surfaces as actual in-game content — a character codex/journal screen using the card framing — versus staying purely a design-document tool that never appears on screen. That's new scope either way, so I'd flag it for a real decision rather than assume it into the bible.

\---

## Lighting \& Atmosphere

**Resolving the open question from the top of this document:** yes, the *world* is allowed to darken — lighting, weather, seasonal color grading — even though the UI never does. That's not a contradiction of the core principle, it's the principle's natural completion: if horror has to live entirely in what's shown, the world needs somewhere to actually carry that weight, and lighting/atmosphere is where it goes instead of the interface.

**Seasonal arc as the primary escalation vehicle:** Given the shop's harvest→brew→sell loop, the calendar is already diegetic — no need to invent a separate "darkness meter." Open the game in late summer/harvest abundance, warm and gold, and let the season itself turn colder and starker as complicity deepens. This is the single most natural, already-motivated way to darken the world, because an agrarian village visibly changing with the seasons needs no justification at all.

**Day/night as the two-chains split, made atmospheric:** Daytime carries the Chain of Power's visible normalcy — shop hours, customers, Orchard presence in daylight. Night carries the Chain of Resistance — Sage's real work, smuggling, the conversations that don't happen at the counter. This maps the lore's existing structure directly onto lighting without adding anything new to track.

**Weather — use sparingly:** Rain and overcast for tension, clear skies for the version of normalcy the Orchard sells. This is a genre-standard tool and it's easy to overuse into unintentional pathetic fallacy that starts functioning like a UI tell ("it's raining, something bad is about to happen"). Reserve it for a handful of specific beats rather than a constant mood-setter — the sphere-swing moments (Sparrow's choice, Barley's crux) are candidates, not everyday scenes.

**HD-2D-specific techniques:** Bloom on warm light sources — hearth fires, lanterns, brewing steam — contrasted against the harder-edged cold light already established for Orchard spaces. God-rays and light-shaft treatment reserved for hope-coded beats specifically; Mugwort's scenes are the clearest candidate given her Star-card tarot position, and it should stay rare enough to mean something when it happens. The village-square Pine monument is worth a deliberate lighting arc of its own — softer and easier to miss early, colder and harder to ignore as the Hemlock reveal approaches — the same "recurring background element, not a staged reveal" treatment already established for it in the environment section.

\---

## Typography \& Text Presentation

**Dialogue text:** A single, consistent, warm humanist typeface for all spoken dialogue across the entire cast — no per-character fonts. With 25 named characters, font-switching per speaker would be production overhead with diminishing returns; character voice should come from writing (word choice, rhythm, what each person says and doesn't) rather than typographic gimmick. This is also just consistent with the core UI principle — the dialogue box stays neutral chrome regardless of who's speaking, and the text inside it should too.

**The one place typography *is* allowed to carry thematic weight:** in-world documents, rendered as diegetic objects in the environment rather than surfaced through any UI codex. Two registers, directly extending the institutional/personal split already established in color and environment:

* **Institutional text** — Orchard propaganda, requisition forms, official notices — stamped, stenciled, uniform. Bureaucratic and impersonal by design, matching the cold-Orchard palette wherever it physically appears.
* **Personal/hidden text** — Owl's marginalia, Sparrow's messages hidden in linings, handwritten notes, banned texts — warmer, varied, visibly human-made, matching the village-warm palette even when its content is dangerous.

This means a banned text hidden in a lining and a requisition stamp on a crate are legible as opposed registers *before* a player reads either one — the same "attentive player gets rewarded early" logic the naming scheme, color language, and sprite design have all been running this whole session. And critically, these documents are readable *in the world*, not summarized or flagged by any UI — finding and actually reading one is the same noticing-work every other system in this bible has been protecting.

\---

*Compiled reference — carries forward alongside Claude's memory of this project.*

