"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — behavioral test suite (GHOST-HUB-003 Unit 4).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-003.test.js`.
 * Boots the server on its own port (4750). NO real opencode chat spawn in
 * tests (burn + nondeterminism) — validation failures only, mirroring
 * wash.test.js.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const WASH = __dirname;
const BASE = "http://127.0.0.1:4750";
const PORT = 4750;

const { startServer } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer({ port: PORT });
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4750: " + e.message);
  }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4750 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

test("T1 · server boots on 127.0.0.1:4750 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("T2 · /state — shadow carries the dormant seats, council order wash/0-wake/1-stone/x-xp, Bolt off council", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  assert.ok(Array.isArray(state.shadow), "shadow must be an array");
  const shadowIds = (state.shadow || []).map((a) => a.id);
  assert.ok(
    shadowIds.includes("shadow-auditor"),
    "shadow must carry shadow-auditor (GHOST-HUB-009 ruling reversal)"
  );
  assert.ok(
    shadowIds.includes("timelord"),
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
    (state.roster || []).some((a) => a.id === "b-bolt" && a.displayName === "Bolt"),
    "roster must carry b-bolt with displayName Bolt (GHOST-HUB-005)"
  );
  assert.ok(
    !(state.roster || []).some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "roster must exclude shadow-auditor / timelord — shadow lives only in /state.shadow"
  );
});

test("T3 · tkManifest non-empty + toolkit tab in served hub.html", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  const state = await res.json();
  assert.ok(Array.isArray(state.tkManifest), "tkManifest must be an array");
  assert.ok(state.tkManifest.length > 0, "tkManifest must not be empty");
  const html = await (await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(html.includes('data-tab="toolkit"'), 'hub.html must contain data-tab="toolkit"');
  assert.ok(html.includes('<section id="toolkit"'), 'hub.html must contain <section id="toolkit"');
});

test("T4 · served hub.html carries a collapsed SHADOW COUNCIL bottom section (GHOST-HUB-009)", async () => {
  const html = await (await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) })).text();
  // Ruling reversal: the old GHOST-HUB-003 "hub must NOT contain SHADOW COUNCIL"
  // is dead — the roster bottom now carries a collapsed shadow section.
  assert.ok(html.includes("SHADOW COUNCIL"), "hub.html must contain a SHADOW COUNCIL bottom section");
  assert.ok(
    html.includes('class="shadow-council"'),
    "hub.html must carry the shadow-council structural hook (V-D-003 owns styling)"
  );
  assert.ok(
    html.includes("renderShadow(data.shadow || [])"),
    "hub.html must render the shadow section from /state.shadow"
  );
});

test("T5 · POST /chat validation failures → 400 { error } (no LLM spawn)", async () => {
  const post = (body) =>
    fetch(`${BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

  const missingMessage = await post({ agent: "0-wake" });
  assert.equal(missingMessage.status, 400, "missing message must 400");
  assert.ok((await missingMessage.json()).error, "error field present for missing message");

  const missingAgent = await post({ message: "hello" });
  assert.equal(missingAgent.status, 400, "missing agent must 400");
  assert.ok((await missingAgent.json()).error, "error field present for missing agent");

  const unseated = await post({ agent: "cg", message: "hello" });
  assert.equal(unseated.status, 400, "unseated agent cg must 400 (no spawn)");
  const unseatedJson = await unseated.json();
  assert.ok(unseatedJson.error, "error field present for unseated agent");
  assert.ok(
    unseatedJson.error.includes("cg"),
    "error must name the rejected agent code"
  );
});

test("T6 · /spawn regression — single child-close response", async () => {
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