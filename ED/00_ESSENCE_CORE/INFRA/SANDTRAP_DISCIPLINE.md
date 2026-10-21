# SANDTRAP — Studio Spawn Discipline (the Law)

> Codified 2026-09-20 (SANDTRAP-001). Drew named the terminal/window gates
> the **Sandtrap**. Genesis ran agents in safe mode because a spawned child
> that inherits a live terminal can lock the window chain. WASH proved the
> fix in-process (2026-09-20): a **piped stdin stalls `opencode run`** —
> the child must spawn with stdin ignored and stdout/stderr piped.
> This law makes every studio spawn Sandtrap-safe.

## The Law (mandatory for every studio subprocess spawn)

1. **Never inherit a live terminal.** Every spawn of a subprocess from a
   studio server/agent/console MUST use
   `stdio: ["ignore", "pipe", "pipe"]` (stdin ignored; stdout/stderr piped
   for capture/relay).
2. **Hide the window.** Use `windowsHide: true` on Windows so a stray
   window cannot take focus from the terminal chain.
3. **Every spawn gets a kill-point.** Attach a timeout kill (WASH uses a
   10-minute safety kill) and a full kill on parent teardown/response close.
   No child outlives its context.
4. **Handle error surfaces.** Attach `error` (spawn failure) and `close`
   (cleanup) handlers on every child. Never treat spawn as fire-and-forget.
5. **Resolve real binaries by path.** npm `.ps1`/`.cmd` shims cannot be
   spawned directly by Node — resolve the real executable (WASH pattern:
   `resolveOpencode()` with an env override).
6. **Use the helper.** Studio servers/servers of ghost agents MUST use
   `spawn-safe.js` (this folder) or equivalently encode the law. Hand-rolled
   spawns that violate the law are Sandtrap risks.

## Boundaries (what this law is NOT)

- This discipline covers the **studio infra harness only**. The opencode
  config/agent-spawn layer (`.opencode/`, `opencode.json`, multi-window boot
  discipline) is a **follow-up leaf** (ruled by Drew 2026-09-20).

## Verification checklist (for any future spawn)

- [ ] `stdio` = `["ignore","pipe","pipe"]` (or explicitly justified)
- [ ] `windowsHide: true` on Windows
- [ ] kill-point (timeout + teardown) attached
- [ ] `error` + `close` handlers attached
- [ ] real binary resolved (no shim spawn)
- [ ] helper used where available