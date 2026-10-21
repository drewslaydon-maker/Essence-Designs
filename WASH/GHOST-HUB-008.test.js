"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — behavioral test suite (GHOST-HUB-008).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-008.test.js`.
 * Boots the server on its own port (4755). NO real opencode chat spawn in
 * tests (burn + nondeterminism) — validation failures only, mirroring
 * GHOST-HUB-003/004/005/006/007. The live wire capture is Unit 1 of the
 * leaf (GHOST-HUB-008.fixture.ndjson) and is validated read-only in T8.
 *
 * Leaf scope: WASH identity + clean transcript fix —
 * 1. .opencode/agents/wash.md becomes a real seated agent; the wash→0-wake
 *    alias is GONE from hub-server.js seatedAgentMap() and from hub.html
 *    chatLane()'s agentStem.
 * 2. hub.html renders the NDJSON /chat stream as readable text only (the
 *    WASH console parser ported in as handleHubEvent), with [meta] lines
 *    for non-JSON strays and per-turn "you"/ghost-reply UI contract.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const BASE = "http://127.0.0.1:4755";
const PORT = 4755;
const REPO = path.resolve(__dirname, "..");
const WASH_AGENT_FILE = path.join(REPO, ".opencode", "agents", "wash.md");
const SERVER_FILE = path.join(__dirname, "hub-server.js");
const FIXTURE_FILE = path.join(__dirname, "GHOST-HUB-008.fixture.ndjson");

const { startServer } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer({ port: PORT });
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4755: " + e.message);
  }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4755 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

const count = (s, needle) => s.split(needle).length - 1;

test("T1 · server boots on 127.0.0.1:4755 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("T2 · .opencode/agents/wash.md exists on disk and identifies as WASH", () => {
  assert.ok(
    fs.existsSync(WASH_AGENT_FILE),
    "wash.md must exist at .opencode/agents/wash.md"
  );
  const md = fs.readFileSync(WASH_AGENT_FILE, "utf8");
  assert.ok(md.includes("# WASH"), "wash.md must carry the # WASH heading");
  assert.ok(md.includes("ghost of 0-Wake"), "wash.md must self-identify as the ghost of 0-Wake");
  assert.ok(md.includes("mode: primary"), "wash.md frontmatter must be mode: primary");
});

test("T3 · hub-server.js no longer aliases wash → 0-wake; carries the 008 map comment", () => {
  const src = fs.readFileSync(SERVER_FILE, "utf8");
  assert.ok(
    !src.includes('wash: "0-wake"'),
    "seatedAgentMap() must not contain the wash: \"0-wake\" alias"
  );
  assert.ok(
    src.includes("GHOST-HUB-008: WASH owns its own agent file"),
    "hub-server.js must carry the GHOST-HUB-008 map comment"
  );
});

test("T4 · served hub.html carries the identity fix (WASH lane posts agent=wash)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(
    !html.includes('a.id === "wash" ? "0-wake" : a.id'),
    "hub.html must NOT keep the 0-wake alias stem"
  );
  assert.ok(html.includes("const agentStem = a.id;"), "hub.html must resolve the stem as the lane id");
  assert.ok(
    html.includes('data-agent="${escapeHtml(agentStem)}"'),
    'hub.html must keep data-agent="${escapeHtml(agentStem)}"'
  );
});

test("T5 · served hub.html carries the clean NDJSON renderer", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(html.includes("handleHubEvent("), "hub.html must carry handleHubEvent(");
  assert.ok(
    html.includes('ev.part.type === "text"'),
    'hub.html must carry the text-part extraction token ev.part.type === "text"'
  );
  assert.ok(
    !html.includes("data:"),
    "hub.html must not carry raw data-URI residue"
  );
  assert.ok(html.includes("[meta]"), "hub.html must surface non-JSON strays as [meta]");
});

test("T6 · served hub.html retains prior ground truths (007 / 006 / 005)", async () => {
  const html = await (await fetch(`${BASE}/hub.html`, { signal: AbortSignal.timeout(5000) })).text();
  // GHOST-HUB-007: per-lane identity + mid-stream guard + per-lane sessions.
  assert.ok(html.includes('data-lane="'), 'hub.html must carry data-lane="');
  assert.ok(html.includes('data-agent="'), 'hub.html must carry data-agent="');
  assert.ok(
    html.includes("laneVisual[lane.dataset.lane]"),
    "hub.html must carry laneVisual[lane.dataset.lane]"
  );
  assert.ok(
    html.includes('el.querySelector(".chat-lane.working")'),
    'hub.html must carry el.querySelector(".chat-lane.working")'
  );
  assert.ok(html.includes("sessionCache[laneId]"), "hub.html must carry sessionCache[laneId]");
  // GHOST-HUB-006: console shell ground truths.
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
  // GHOST-HUB-005: blank-tabs crash fix.
  assert.ok(
    html.includes('lane.parentElement.querySelector(".chat-toggle")'),
    "wireChatLanes must use the sibling lookup lane.parentElement.querySelector(.chat-toggle)"
  );
  assert.ok(
    html.includes("if (!toggle) return;"),
    "wireChatLanes must carry the null guard if (!toggle) return;"
  );
});

test("T7 · served hub.css retains hub working keyframes + council divider", async () => {
  const css = await (await fetch(`${BASE}/hub.css`, { signal: AbortSignal.timeout(5000) })).text();
  assert.ok(css.includes("@keyframes hubWorking"), "hub.css must contain @keyframes hubWorking");
  assert.ok(css.includes(".council-divider"), "hub.css must contain .council-divider");
});

test("T8 · fixture grounding — real captured NDJSON stream parses to readable text", () => {
  assert.ok(fs.existsSync(FIXTURE_FILE), "fixture must exist on disk");
  const raw = fs.readFileSync(FIXTURE_FILE, "utf8");
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  assert.ok(lines.length >= 2, "fixture must hold at least an event line and a session line");
  for (const line of lines) {
    if (line.startsWith("session=")) continue;
    assert.doesNotThrow(() => JSON.parse(line), "every non-session line must parse as JSON");
  }
  // Walk the fixture with the documented extraction logic (app.js 96-129 /
  // hub.html handleHubEvent): final text = last text-part payload.
  let final = "";
  for (const line of lines) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch (e) {
      continue; // stray — the renderer surfaces [meta]
    }
    if (ev.type === "text" && ev.part && ev.part.type === "text") {
      final = ev.part.text || "";
    } else if (ev.type === "message.part.updated" && ev.part && ev.part.type === "text") {
      final = ev.part.text || "";
    } else if (ev.type === "message.updated" && ev.message && Array.isArray(ev.message.parts)) {
      const text = ev.message.parts
        .filter((p) => p && p.type === "text")
        .map((p) => p.text || "")
        .join("");
      if (text) final = text;
    }
  }
  assert.ok(final.length > 0, "extracted final text must be non-empty");
  assert.ok(final.includes("OK"), "extracted final text must contain the capture reply OK");
  assert.ok(!final.trimStart().startsWith("{"), "extracted render must not start with JSON brace residue");
});

test("T9 · /spawn regression — single child-close response (Sandtrap spawn)", async () => {
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