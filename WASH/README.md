# WASH — Ghost of Wake (v0.1)

A browser console that is the ghost of **0-Wake**: the same planner seat,
same `.opencode/` config, same session engine — spoken through a browser
window instead of the OS terminal. When the terminal opencode can't be
reached, WASH keeps the studio drivable (no more Google AI fallbacks).

Zero dependencies. Node built-ins only. No API cost. Built under
**WASH-001** (2026-09-20), additive-only leaf.

## Launch

```
node WASH/server.js
```

Then open <http://127.0.0.1:4748>.

No install step — `node` is the only dependency, and it loads its built-ins
(`http`, `fs`, `child_process`, `path`) only. The `opencode` binary is
located by path under the npm global install (`opencode-ai/bin/opencode.exe`);
override with the `WASH_OPENCODE` env var if it ever moves.

## Capabilities v0.1

- **Read truth + Pad** — the state dashboard fetches `GET /state`: the Pad's
  raw text, the leaves in flight (lines starting with `- [` in the Pad's
  Leaves in Flight section), and the last captain's-log entry date.
- **Chat with the planner seat** — `POST /chat` spawns
  `opencode run --agent 0-wake --format json --auto --title "WASH: …"`
  in the repo root, streams the JSON event lines back to the browser as they
  arrive, captures the session id, and resumes the next turn with
  `--continue --session <id>`.
- **The ghost plants leaves itself** — exactly like 0-Wake in the terminal:
  it writes `*_TASK.md` files through its own `opencode run` tools.
- **Routing to DOER in v0.1** — the ghost names the leaf file and tells Drew
  which window to point. Windows are never spawned from the browser.

## NOT in v0.1 (Drew's rulings)

- No remote access.
- No auth.
- No TUI features.
- No multi-agent control.
- No spawning windows.
- No file-management UI.
- No server-side write endpoints — the server is **read + relay only**; the
  ghost writes through its own `opencode run` tools.

## Security

- Bound to `127.0.0.1` only (never `0.0.0.0`); localhost is the security
  boundary — no auth in v0.1.
- Permission engine on ghost runs is `--auto` (auto-approve anything not
  explicitly denied); the localhost binding + the planner prompt are the
  guardrails (browser chat cannot show ask-prompts).
- Route whitelist only: `/`, `/style.css`, `/app.js`, `/state`,
  `POST /chat`. Everything else is 404 — no path-traversal surface.

## Tests

```
node --test WASH/wash.test.js
```

Deterministic and fully offline — the suite boots the server on
`127.0.0.1:4748`, exercises every route (including traversal attempts),
and never executes a live `/chat` LLM call.

## Files

| File | Role |
|---|---|
| `server.js` | Zero-dep Node HTTP server — static, `/state`, `/chat` relay |
| `index.html` | Console shell (chat + dashboard) |
| `style.css` | PAD purple/gold theme |
| `app.js` | Chat streaming + state dashboard client |
| `wash.test.js` | Offline test suite |
| `README.md` | This file |
| `.gitignore` | `node_modules/` (future-safe) |