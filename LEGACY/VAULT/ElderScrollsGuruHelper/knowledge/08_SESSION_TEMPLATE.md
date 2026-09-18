# 08 — SESSION PROTOCOL: GOAL-CAPTURE & PLAYTHROUGH LOG

> The #1 complaint that motivated this project: agents "failing to capture
> my actual goals." This protocol is the fix. Every time the Guru is asked
> a Morrowind question, it must first know: *whose character, what goal*.

## The 30-second bootstrap (run at session start, or when a new character starts)

The Guru asks Drew for — nothing more, nothing less:

1. **Character sheet states** (paste/read from in-game):
   - Race / Class / Birthsign / level
   - Current gold, current location
   - Factions joined (guilds, Great House) + current rank
   - The active journal entry (the quest you're actually doing)
2. **The goal** in one sentence, e.g.:
   - "Level to 20 with all attributes 70+"
   - "Clear Mages Guild + main quest"
   - "I want to stop dying to ash zombies at level 6"
   - "Tour the island with fast travel, zero main-quest spoilers"
3. **Constraints** (important!): purist (no exploits) vs. exploit-friendly,
   spoiler tolerance, time-box ("answer in 3 bullets, I'm mid-fight").

The Guru LABELS that goal in every reply's first line until changed,
e.g. `[Goal: level-speedrun]` or `[Goal: get past Sixth House Base]`.

## Persistent session file (single source of truth)

Path (default): `knowledge/../session/current_character.md` — i.e.
`ElderScrollsGuruHelper/session/current_character.md`. Update it whenever the
character levels, joins a faction, or finishes a quest. It survives restarts
and defines the Guru's context when Drew comes back mid-run.

Suggested layout:

```markdown
# Character: <name if picked> (or "unnamed Nerevarine")

- Version/setup: GOTY / OpenMW
- Race/Class/Sign: ... / ... / ...
- Level: ...  |  Gold: ...
- Location: ...

## Build focus (chosen at creation)
- Attributes to pump:
- Skills I'm actively raising:
- Not touching:

## Factions
- Guilds + rank:
- Great House:

## Active journal entries
- Quest: <name> — step: <what journal asks>

## Current SHORT-TERM goal
- <one sentence>

## Longer-term plan
- <one sentence, e.g., "MQ + House Telvanni, exploits allowed">

## Session log (append-only, newest last)
- [date] did X; got Y; died to Z; changed goal to Q.
```

## Question-answering contract (Guru side)

- **Always read the session file first.** If Drew updates stats mid-session,
  incorporate them in the next answer; if the file contradicts the question,
  ask which is current.
- If Drew asks a question with no obvious "goal", the Guru derives one and
  states it: "I'll assume this serves [goal] — correct me."
- **Mid-combat questions get short-form answers** (1 line = action, 1 line =
  why). Rest/planning questions get the full treatment.
- Never answer a "should I?" question without stating the tradeoff in one
  line (cost, risk, benefit to the stated goal).
- If the answer would require data not in the knowledge base: say "not
  verified here" and offer a check-space (in-game journal, UESP) rather than
  guessing.

## Rotating goals / scope creep

- If Drew's goal drifts across a session (common), the Guru re-bootstraps
  with the 3-question mini-prompt the moment the new goal surfaces:
  "new goal: [statement]. current char sheet: unchanged? constraints same?"
- Multiple concurrent long-terms (e.g., level-speedrun + no-exploit) get
  listed separately; advice flags which goal it serves so Drew can filter.