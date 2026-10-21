"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — behavioral test suite (GHOST-HUB-007 Unit 2).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-007.test.js`.
 * Boots the server on its own port (4754). NO real opencode chat spawn in
 * tests (burn + nondeterminism) — validation failures only, mirroring
 * GHOST-HUB-003/004/005/006.
 *
 * Leaf scope: WASH chat lane collapse fix — unique per-lane UI keys
 * (data-lane) so the WASH lane (data-agent="0-wake") no longer collides with
 * the WAKE council lane in laneVisual; restores keyed by lane; sessions keyed
 * per lane; and the mid-stream re-render guard so a working lane is never
 * detached by the 30s tick. Plus 006/005 ground-truth + /spawn regressions.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const BASE = "http://127.0.0.1:4754";
const PORT = 4754;

const { startServer } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer({ port: PORT });
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4754: " + e.message);
  }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4754 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

const count = (s, needle) => s.split(needle).length - 1;

test("T1 · server boots on 127.0.0.1:4754 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("T2 · served hub.html carries the GHOST-HUB-007 chat lane collapse fix", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(html.includes('data-lane="'), 'hub.html must carry unique lane identity: data-lane="');
  assert.ok(html.includes('data-agent="'), 'hub.html must keep the network stem: data-agent="');
  assert.ok(
    html.includes("laneVisual[lane.dataset.lane]"),
    'capture/restore must key by the unique lane: laneVisual[lane.dataset.lane]'
  );
  assert.ok(
    html.includes('el.querySelector(".chat-lane.working")'),
    'renderCouncil must guard mid-stream with el.querySelector(".chat-lane.working")'
  );
  assert.ok(
    html.includes("sessionCache[laneId]"),
    "session resume must be keyed per lane: sessionCache[laneId]"
  );
});

test("T3 · served hub.html retains 006 ground truth (console shell pass)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(count(html, "era-stamp") >= 2, "hub.html must carry the era stamp in header AND footer");
  assert.ok(html.includes("council-split"), 'hub.html must contain "council-split"');
  assert.ok(html.includes("xp-toggle"), 'hub.html must contain "xp-toggle"');
  assert.ok(html.includes("lane-head"), 'hub.html must contain "lane-head"');
  for (const token of ["sym-wash", "sym-wake", "sym-stone", "sym-bolt", "sym-xp", "sym-cg", "sym-es-guru"]) {
    assert.ok(html.includes(token), `hub.html must contain ${token}`);
  }
  assert.ok(
    html.includes('lane.classList.toggle("working"'),
    'hub.html must wire the working class: lane.classList.toggle("working")'
  );
});

test("T4 · served hub.html retains 005 ground truth (blank-tabs crash fix)", async () => {
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

test("T5 · served hub.css retains hub working keyframes + council divider", async () => {
  const css = await (await fetch(`${BASE}/hub.css`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(css.includes("@keyframes hubWorking"), "hub.css must contain @keyframes hubWorking");
  assert.ok(css.includes(".council-divider"), "hub.css must contain .council-divider");
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