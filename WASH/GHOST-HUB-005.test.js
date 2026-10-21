"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — behavioral test suite (GHOST-HUB-005 Unit 4).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-005.test.js`.
 * Boots the server on its own port (4752). NO real opencode chat spawn in
 * tests (burn + nondeterminism) — validation failures only, mirroring
 * GHOST-HUB-003/004.
 *
 * Leaf scope: Bolt arrangement (b-bolt off council, into roster), server-side
 * council ordering (WASH hero first), the blank-tabs crash fix regression
 * (wireChatLanes sibling lookup + null guard), and the presentation markup
 * (hero / compact / divider copy) in the served shell.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const BASE = "http://127.0.0.1:4752";
const PORT = 4752;

const { startServer } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer({ port: PORT });
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4752: " + e.message);
  }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4752 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

test("T1 · server boots on 127.0.0.1:4752 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("T2 · /state.council id order is EXACTLY wash, 0-wake, 1-stone, x-xp", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  const ids = (state.council || []).map((a) => a.id);
  assert.deepEqual(
    ids,
    ["wash", "0-wake", "1-stone", "x-xp"],
    "council order must be server-side truth: wash, 0-wake, 1-stone, x-xp"
  );
});

test("T3 · /state — b-bolt OFF council, IN roster with displayName Bolt", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  assert.ok(
    !(state.council || []).some((a) => a.id === "b-bolt"),
    "council must NOT contain b-bolt (Bolt off HEAD COUNCIL)"
  );
  const bolt = (state.roster || []).find((a) => a.id === "b-bolt");
  assert.ok(bolt, "roster must contain a b-bolt record");
  assert.equal(bolt.displayName, "Bolt", "roster b-bolt displayName must be Bolt");
});

test("T4 · served hub.html carries the HCG arrangement markup (hero + compact + divider)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(html.includes("council hero"), 'hub.html must contain "council hero"');
  assert.ok(html.includes("council compact"), 'hub.html must contain "council compact"');
  assert.ok(
    html.includes("THE EXPERIENCER — ISOLATED LANE"),
    "hub.html must contain the exact divider copy THE EXPERIENCER — ISOLATED LANE"
  );
});

test("T5 · served hub.html carries the blank-tabs crash fix (sibling lookup + null guard)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(
    html.includes('lane.parentElement.querySelector(".chat-toggle")'),
    "wireChatLanes must use the sibling lookup lane.parentElement.querySelector(.chat-toggle)"
  );
  assert.ok(
    html.includes("if (!toggle) return;"),
    "wireChatLanes must carry the null guard if (!toggle) return; (blank-tabs regression lock)"
  );
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