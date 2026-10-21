"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — behavioral test suite (GHOST-HUB-004 Unit 3).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-004.test.js`.
 * Boots the server on its own port (4751). NO real opencode chat spawn in
 * tests (burn + nondeterminism) — mirroring 003's approach. The hub is a
 * static client here: the suite asserts served shell + CSS deltas + state
 * regression + spawn regression.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const BASE = "http://127.0.0.1:4751";
const PORT = 4751;

const { startServer } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer({ port: PORT });
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4751: " + e.message);
  }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4751 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

test("T1 · server boots on 127.0.0.1:4751 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("T2 · served hub.html footer carries v0.3 — and no v0.2 residue", async () => {
  const res = await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET /hub.html status must be 200");
  const html = await res.text();
  assert.ok(html.includes("v0.3 — Sandtrap-secured"), "footer badge must read v0.3 — Sandtrap-secured");
  assert.ok(!html.includes("v0.2 — Sandtrap-secured"), "footer must not read v0.2");
});

test("T3 · served hub.html carries the presentation-pass markup (toggle, meta-row, lane)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(html.includes('class="chat-toggle"'), 'hub.html must contain class="chat-toggle"');
  assert.ok(html.includes('class="meta-row"'), 'hub.html must contain class="meta-row"');
  assert.ok(html.includes(".chat-lane"), "hub.html must contain .chat-lane blocks");
  assert.ok(html.includes("sessionCache"), "hub.html must carry the session persistence cache");
});

test("T4 · served hub.css carries the presentation deltas (tokens + collapsed lane + toggle + meta-row)", async () => {
  const res = await fetch(`${BASE}/hub.css`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET /hub.css status must be 200");
  const css = await res.text();
  assert.ok(css.includes(".chat-lane.open"), "hub.css must carry .chat-lane.open");
  assert.ok(css.includes(".chat-toggle"), "hub.css must carry .chat-toggle");
  assert.ok(css.includes(".meta-row"), "hub.css must carry .meta-row");
  assert.ok(css.includes("--serif:"), "hub.css must carry the --serif token");
  assert.ok(css.includes("--mono:"), "hub.css must carry the --mono token");
  assert.ok(css.includes("radial-gradient"), "hub.css must carry the layered body gradient");
});

test("T5 · /state regression — shadow carries the dormant seats, council order wash/0-wake/1-stone/x-xp, Bolt off council", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  assert.ok(Array.isArray(state.shadow), "shadow must be an array");
  assert.ok(
    (state.shadow || []).some((a) => a.id === "shadow-auditor"),
    "shadow must carry shadow-auditor (GHOST-HUB-009 ruling reversal)"
  );
  assert.ok(
    (state.shadow || []).some((a) => a.id === "timelord"),
    "shadow must carry timelord (GHOST-HUB-009 ruling reversal)"
  );
  assert.ok(
    (state.shadow || []).every((a) => a.status === "dormant"),
    "shadow seats must be dormant (GHOST-HUB-009)"
  );
  const councilIds = (state.council || []).map((a) => a.id);
  assert.deepEqual(
    councilIds,
    ["wash", "0-wake", "1-stone", "x-xp"],
    "council order must be wash, 0-wake, 1-stone, x-xp (GHOST-HUB-005)"
  );
  assert.ok(!councilIds.includes("b-bolt"), "council must NOT contain b-bolt (Bolt off HEAD COUNCIL)");
  assert.ok(
    !(state.council || []).some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "council must exclude shadow-auditor / timelord — shadow lives only in /state.shadow"
  );
  assert.ok(
    !(state.roster || []).some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "roster must exclude shadow-auditor / timelord — shadow lives only in /state.shadow"
  );
  assert.ok(
    (state.roster || []).some((a) => a.id === "b-bolt" && a.displayName === "Bolt"),
    "roster must carry b-bolt with displayName Bolt (GHOST-HUB-005)"
  );
  assert.ok(Array.isArray(state.tkManifest), "tkManifest must be an array");
  assert.ok(state.tkManifest.length > 0, "tkManifest must not be empty");
});

test("T6 · /spawn regression — single child-close response (Sandtrap spawn)", async () => {
  const res = await fetch(`${BASE}/spawn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bin: "node",
      args: ["-e", "console.log('hub-spawn-ok')"],
      agent: "test",
      timeoutMs: 5000,
    }),
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(res.status, 200, "/spawn must answer 200");
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    assert.fail("response body is not a single JSON object (double response?): " + text.slice(0, 200));
  }
  assert.equal(data.ok, true, "child-close shape must carry ok===true");
  assert.equal(data.exitCode, 0, "benign node -e command must exit 0");
  assert.ok(data.stdout.includes("hub-spawn-ok"), "stdout must include hub-spawn-ok");
});