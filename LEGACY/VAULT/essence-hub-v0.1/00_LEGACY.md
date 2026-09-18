# ESSENCE_HUB v0.1 — LEGACY ANNOTATION

> Annotated **2026-09-17** by Big Pickle (opencode) under explicit direction
> from Drew Slaydon (second audit repass, ED FLOW 2.0 lock-down).

## Status

**RETIRED.** Archived here whole, unmodified except for pruning of local
runtime artifacts: `node_modules/`, `.env` (live secret dropped), `agent.log`,
and a stray `random.py` stub.

## What it was

The ESSENCE 3.0 "cloud-native API hub": an Express/Node server on port 5555
with a Gemini-powered **THINKER** (strategic planner, `/api/thinker`) and
**DOER** (terminal executor, `/api/doer`), an SSE log stream (`/stream`), a
minimal web UI (`ui/index.html`), and the **Purgatory Protocol**
(`scripts/purgatory.js`, `scripts/graveyard.js`) for storage sweeps.

It loaded `INFRA/03_AGENT_PROTOCOLS.md` as injected system context for both
agents.

## Why it retired

Under **ED FLOW 2.0**, layer 3 is **OpenCode-native**: the primary agent
(ESSENCE) + the wizard-level primary tooling + the repo itself. The HUB's
remote Thinker/Doer orchestration duplicated that loop rather than serving it,
kept old doctrine wired into running tooling, and was judged by Drew to
conflict with the light, tight framework. Its architecture truth moved into
`INFRA/SYSTEM_ARCH.md` (rewritten); `03_AGENT_PROTOCOLS.md` is archived in
`LEGACY/VAULT/00_ESSENCE_3.0/`.

## Contents preserved

- `server.js`, `start_essence_hub.bat`
- `agents/thinker.js`, `agents/doer.js`
- `scripts/purgatory.js`, `scripts/graveyard.js`
- `ui/index.html`, `.env.example`, `package.json`, `package-lock.json`
- `integrations/` (empty)