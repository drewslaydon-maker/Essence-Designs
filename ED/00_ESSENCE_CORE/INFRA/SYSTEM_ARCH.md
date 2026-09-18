# ESSENCE System Architecture & Operational Blueprint

*Last refreshed: 2026-09-17 (ED FLOW 2.0 lock-down — second audit repass).*

---

## PART 1: CORE OPERATIONAL DOCTRINE

- **The Prime Directive:** "Simple + Creative + Tested = Good."
- **The Structural Law:** "Skeleton before flesh." Mechanically and
  structurally validate systems before committing to visual states, narrative
  texturing, or manual number tuning.
- **The Agent Guardrail:** Direct pushback is valued over hollow validation.
  AI collaborators must hold structural positions under pressure and flag
  architectural contradictions immediately.
- **The Console Principle:** Consoles answer questions; they do not own truth.
  External tools (Trello, fixed boards, GAIS) mirror the repo, never the
  reverse.

## PART 2: THE LAYERS (how the system is built)

| Layer | Form | Era verdict |
|---|---|---|
| 0 | Notion manual build | DEAD |
| 1 | File-structure VCS + Cline/Continue | DEAD |
| 2 | Google AI Studio + fl0w hub + GitHub Pages | LEGACY (archived in `LEGACY/VAULT/`) |
| 3 | OpenCode + ESSENCE agent + the repo itself | LIVE = ED FLOW 2.0 |

Layer 3 is **OpenCode-native**. There is no remote orchestration tier: the
primary agent loads a boot contract (`AGENTS.md`), reads the codified
operating core (`ED_FLOW/01_OPERATING_CORE.md`), and executes only approved
task packages. The former ESSENCE_HUB (Thinker/Doer, port 5555) was retired
in the 2026-09-17 repass and archived at
`LEGACY/VAULT/essence-hub-v0.1/`.

## PART 3: SYSTEM INTERACTIONS & OUTSIDE ELEMENTS

- **Boot contract** — root `AGENTS.md` is auto-loaded by every opencode
  session. It funnels sessions into the boot sequence in
  `ED_FLOW/01_OPERATING_CORE.md`.
- **Truth flow** — `ED/00_ESSENCE_BIBLE.md` is the repository index at the
  top of `ED/`; `ED/00_ESSENCE_CORE/` is the unchangeable truth
  (`01_THE_GARDEN.md`, `ED_FLOW/`, `INFRA/`).
  `02_THE_LOGS/` records history. `01_THE_DESIGNS/` holds planning and
  reference. `03_THE_GAMES/` holds the games.
- **Permission guardrails** — enforced in `opencode.json` (edit = ask,
  shell allowlist = git, web = allow). Described in the operating core.
- **VCS invariants** — `.gitignore` excludes `node_modules/`, `.env`,
  `desktop.ini`, the PAD (`02_ESSENCE_PAD.md`), and the whole of
  `LEGACY/Graveyard/`. Repo committed with clear messages (`docs:`,
  `feat:`, `fix:`, `infra:`).
- **Junk purge doctrine** — the Vault (`LEGACY/VAULT/`) is the collection /
  filtration room; the Graveyard (`LEGACY/Graveyard/`) is the bank for
  purge targets. Purged material is **deleted, not kept**; each purge
  writes a permanent tombstone record under
  `LEGACY/Graveyard/Tombstones/` (what / when / why). `Purgatory/` is
  transitional staging only.

## PART 4: RETIRED & PURGED (2026-09-17)

| Former component | Disposition |
|---|---|
| `ESSENCE_HUB/` | → `LEGACY/VAULT/essence-hub-v0.1/` + `00_LEGACY.md` |
| `INFRA/03_AGENT_PROTOCOLS.md` | → `LEGACY/VAULT/00_ESSENCE_3.0/` (superseded by operating core) |
| `WORKSHOP/QUARANTINE/Legacy_2.0_Dash/` | → `LEGACY/VAULT/00_ESSENCE_3.0/` |
| `THE_GRID/` (AUTH_SPEC, TUNNEL_GUIDE) | → `LEGACY/VAULT/00_ESSENCE_3.0/THE_GRID/` (vaulted) |
| `SYSTEM_DEPS/` (package.json + node_modules) | **PURGED** — deleted; tombstone `00_2026-09-17_LOCKDOWN_PURGES.md` |
| `WORKSHOP/` (empty TEMPLATES/TEST_BENCH) | **PURGED** — deleted; tombstone same |
| `CORTEX/` (empty placeholder) | **PURGED** — deleted; tombstone same |

---

*Any change to execution tooling or the operating model must be reflected in
`ED_FLOW/` and this document to prevent drift.*