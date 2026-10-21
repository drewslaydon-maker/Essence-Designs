# TOOLKIT MANIFEST (TK)

> The Machine makes itself READABLE to humans. Source of truth for every tool
> the studio agents can reach, why it exists, and who has access.
> Home: `ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md` — linked from GHOST HUB.

## Tool Registry

| Tool | Purpose | Access | Notes |
|------|---------|--------|-------|
| `opencode-edit` | File edits via opencode | Wake, Stone, Bolt, XP | Core edit primitive |
| `b-bolt` | Cross-window ferry (Courier) | Bolt only | Moves receipts, never writes |
| `bash` | Shell allowlist (git, node, etc.) | All seats | Guardrailed in opencode.json |
| `web-fetch` | External research | Wake, XP | Allowlisted domains |
| `spawn-safe.js` | Sandtrap-spawn helper | All servers/ghosts | `ED/00_ESSENCE_CORE/INFRA/` |
| `E(SC) test runner` | Deterministic QA gates | Stone, XP | `node --test` / custom |
| `opencode session engine` | Agent resume/persist | All seats | `.opencode/session/` |
| `fs walk / read` | Filesystem inspection | All seats | Read-only by default |

## Access Policy

- **Default:** READ-ONLY on all game data/files (CG guardrail).
- **Elevated:** Explicit task package names write targets.
- **Courier-only:** `b-bolt` — ferries, never writes another workspace's records.