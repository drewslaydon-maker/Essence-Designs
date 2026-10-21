# CG-002-B REPORT — LOOT/TRADE LOG

**Done (each target):**
1. `CG/baked/trade.log.json` — CREATED, seed as specified (`schemaVersion:1`, empty `items/pickups/sales`, DREW_SOURCED `_doc`). Live ledger only; tests never touched it (temp `--trade` path).
2. `CG/console-server.js` — NEW `GET/POST /api/trade` (addPickup/addSale/addItem/undo-by-id; no-store; body cap 32768; validation per package; unknown op 400; undo unknown 404; write failures 500). Added `--trade` CLI flag (parallel to `--dock`) so tests isolate from the live ledger. Parse: PARSE OK.
3. `CG/dock.html` — trade surface, console mode only: SELL/DROP IN buttons, ADD DROP (off-dock, 1–8 parts, optional first pickup), "X / 11 today" counter, OFF-DOCK chips/rows in GLANCE + DEEP, every `fetch` behind the file:// guard, file:// shows "LOGGING NEEDS THE CG WINDOW" note. Script body `node --check` clean.
4. `CG/console.test.js` — C-suite green + 3 new oracles T1 (happy path), T2 (undo-by-id), T3 (validation refusals) = 69/69.
5. `CG/dock.test.js` — 58 baseline green + 3 new oracles T1 (seed schema), T2 (deriveQty math clone), T3 (OFF-DOCK/counter static) = 61/61.

**Gates:** `node --check` console-server 0 · dock.html 1 (expected — `.html` extension; extracted script 0) · console.test 0 · dock.test 0 · `node CG/console.test.js` 69/69 exit 0 · `node CG/dock.test.js` 61/61 exit 0.

**Seal:** `derived/dock.json` SHA256 `89D89819BE3F1AB80DB60F243942B839C04359B33EA55B5B731CAA3840BF0115`, mtime unchanged. FIELDS.json untouched.

**Findings/refusals (plainly):**
- Harness repairs in console.test.js (no assertion semantics changed, latent bugs exposed once POSTs actually flush): (a) `httpPost` never called `req.end()` — every POST hung; (b) C5-restart reassigned `const port`; (c) C6 oversized-body POST → server cap closes connection → ECONNRESET killed the run (wrapped + `Connection: close`); (d) C10 compared the temp copy against master (vacuous) — now asserts the true "master unchanged" invariant.
- addItem stamps `created` server-side (`todayLocal()`); SELL form has no date field (date = today); UNDO exists as endpoint + tested, no undo UI control (not in scope); `node --check CG/dock.html` cannot pass by construction — reported, not faked.