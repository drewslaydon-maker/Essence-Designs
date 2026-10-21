"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — Behavioral test suite (GHOST-HUB-002 Unit 6).
 * Node built-in test runner: `node --test WASH/GHOST-HUB-002.test.js`.
 * Asserts BEHAVIOR against the live server + named files (not just file
 * contents). Host/port: 127.0.0.1:4749 (hub-server.js default).
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const WASH = __dirname;
const BASE = "http://127.0.0.1:4749";

const { startServer, readGraveyard } = require("./hub-server.js");

let server = null;

before(async () => {
  try {
    server = startServer();
  } catch (e) {
    throw new Error("failed to boot hub server on 127.0.0.1:4749: " + e.message);
  }
  // Wait for the server to accept connections (bounded poll).
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("hub server did not come up on 127.0.0.1:4749 in time");
});

after(async () => {
  if (server) {
    try { server.closeAllConnections(); } catch (e) { /* older node */ }
    await new Promise((resolve) => server.close(resolve));
  }
});

test("1. server boots on 127.0.0.1:4749 and GET / serves the hub shell", async () => {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "GET / status must be 200");
  const body = await res.text();
  assert.ok(body.includes("ESSENCE DESIGNS GHOST HUB"), "shell must carry the hub title");
});

test("2. /spawn returns ONE child-close response" +
     " (ok===true, exitCode===0, stdout has hub-spawn-ok, no double/short body)", async () => {
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
  assert.ok(Number.isInteger(data.pid) && data.pid > 0, "pid must be a real positive pid");
});

test("3. /state carries ground truth: council + specters + shadow seats + roster seals", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  const names = (arr) => (arr || []).map((a) => a.displayName);
  const councilNames = names(state.council);
  const councilIds = (state.council || []).map((a) => a.id);
  assert.deepEqual(
    councilIds,
    ["wash", "0-wake", "1-stone", "x-xp"],
    "council order must be wash, 0-wake, 1-stone, x-xp (GHOST-HUB-005)"
  );
  assert.ok(councilNames.includes("Wake"), "council must include Wake");
  assert.ok(councilNames.includes("WASH"), "council must include WASH");
  assert.ok(!councilIds.includes("b-bolt"), "council must NOT contain b-bolt (Bolt off HEAD COUNCIL)");
  const specterNames = names(state.specters);
  assert.ok(specterNames.includes("CG"), "specters must include CG");
  assert.ok(specterNames.includes("ES-GURU"), "specters must include ES-GURU");
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
  assert.ok(
    !(state.council || []).some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "council must contain NO shadow-auditor / timelord rows — shadow lives only in /state.shadow"
  );
  assert.ok(
    !(state.specters || []).some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "specters must contain NO shadow-auditor / timelord rows — shadow lives only in /state.shadow"
  );
  assert.ok(Array.isArray(state.roster), "roster must be an array");
  assert.ok(
    !state.roster.some((a) => a.id === "shadow-auditor" || a.id === "timelord"),
    "roster must contain NO shadow-auditor / timelord rows — shadow lives only in /state.shadow"
  );
  assert.ok(
    state.roster.some((a) => a.id === "b-bolt" && a.displayName === "Bolt"),
    "roster must carry b-bolt with displayName Bolt (GHOST-HUB-005)"
  );
  assert.ok(
    state.roster.every((a) => Array.isArray(a.seals)),
    "every roster entry must carry a seals array"
  );
  assert.ok(
    state.roster.some((a) => a.seals.includes("SANDTRAP-001") || a.seals.includes("WASH-001")),
    "live ledger seals SANDTRAP-001 or WASH-001 must appear on the roster"
  );
});

test("4. hub-agents.json personalization drives /state displayName/role", async () => {
  const seed = JSON.parse(fs.readFileSync(path.join(WASH, "hub-agents.json"), "utf8"));
  const seeded = seed.agents["1-stone"];
  assert.ok(seeded, "seed file must carry the 1-stone agent");
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  const state = await res.json();
  const stone = state.council.concat(state.roster).find((a) => a.id === "1-stone");
  assert.ok(stone, "1-stone must appear in /state");
  assert.equal(stone.displayName, seeded.displayName, "displayName must come from hub-agents.json");
  assert.equal(stone.role, seeded.role, "role must come from hub-agents.json");
});

test("5. electron-main.js spawns hub-server.js with a kill path (D2 static guard)", () => {
  const src = fs.readFileSync(path.join(WASH, "electron-main.js"), "utf8");
  assert.ok(src.includes("hub-server.js"), "electron-main.js must reference hub-server.js");
  assert.ok(
    src.includes("killServerChild") || /\.kill\(/.test(src),
    "electron-main.js must carry a kill path for the server child"
  );
  const r = spawnSync(process.execPath, ["--check", path.join(WASH, "electron-main.js")], {
    encoding: "utf8",
  });
  assert.equal(r.status, 0, "node --check electron-main.js must pass: " + r.stderr);
});

test("6. native wrapper: package.json shape + electron binary present", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(WASH, "package.json"), "utf8"));
  assert.ok(
    Array.isArray(pkg.trustedDependencies) && pkg.trustedDependencies.includes("electron"),
    "trustedDependencies must include electron"
  );
  assert.equal(pkg.scripts && pkg.scripts.native, "electron .", "scripts.native must be 'electron .'");
  assert.ok(
    fs.existsSync(path.join(WASH, "node_modules", "electron", "dist", "electron.exe")),
    "electron binary must exist after the Wheel treatment"
  );
});

test("7. no fake spawn UI in hub.html (D5 regression)", () => {
  const html = fs.readFileSync(path.join(WASH, "hub.html"), "utf8");
  assert.ok(!html.includes("hub-spawn-ok"), 'hub.html must not contain "hub-spawn-ok"');
  assert.ok(!html.includes('alert("Spawned'), 'hub.html must not contain alert("Spawned');
});

test("8. TK manifest still readable via /state", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  const state = await res.json();
  assert.ok(Array.isArray(state.tkManifest), "tkManifest must be an array");
  assert.ok(state.tkManifest.length > 0, "tkManifest must not be empty");
});

test("9. /graveyard live-reads the local mirror — LOCKDOWN_PURGES tombstone, never throws", async () => {
  const res = await fetch(`${BASE}/graveyard`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200, "/graveyard must answer 200 (never 500)");
  const body = await res.json();
  assert.ok(Array.isArray(body.tombstones), "/graveyard tombstones must be an array");
  const tomb = body.tombstones.find((t) => t.file === "00_2026-09-17_LOCKDOWN_PURGES.md");
  assert.ok(tomb, "/graveyard must contain the LOCKDOWN_PURGES tombstone");
  assert.equal(tomb.date, "2026-09-17", "tombstone date must parse from the filename");
  assert.ok(
    /LOCKDOWN PURGES/.test(tomb.title),
    "tombstone title must come from the markdown H1 (TOMBSTONE — 2026-09-17 LOCKDOWN PURGES)"
  );
  assert.ok(typeof tomb.summary === "string" && tomb.summary.length > 0, "tombstone must carry a summary");
  assert.ok(
    body.note && /Purgatory/.test(body.note),
    "/graveyard must note that Purgatory/ exists alongside Tombstones/"
  );
  // Missing-mirror branch — never throws, honest empty note.
  const miss = readGraveyard(path.join(__dirname, "no-such-graveyard-dir"));
  assert.ok(Array.isArray(miss.tombstones) && miss.tombstones.length === 0, "missing mirror tombstone list must be []");
  assert.equal(miss.note, "no graveyard mirror present", "missing mirror must carry the honest note");
});

test("10. /state.calendar — goals from MILESTONES, accomplishments from seals, timeSpent honest-empty", async () => {
  const res = await fetch(`${BASE}/state`, { signal: AbortSignal.timeout(5000) });
  assert.equal(res.status, 200);
  const state = await res.json();
  assert.ok(state.calendar, "/state must carry the calendar object (GHOST-HUB-009)");
  assert.ok(Array.isArray(state.calendar.goals), "calendar.goals must be an array");
  assert.ok(state.calendar.goals.length > 0, "calendar.goals must not be empty (MILESTONES registry)");
  for (const g of state.calendar.goals) {
    assert.ok(typeof g.id === "string" && g.id.length > 0, "each goal must carry an id");
    assert.ok(typeof g.title === "string" && g.title.length > 0, "each goal must carry a title");
    assert.ok(typeof g.status === "string" && g.status.length > 0, "each goal must carry a status");
  }
  assert.ok(
    state.calendar.goals.some((g) => /Active Target/.test(g.status)),
    "calendar.goals must include an Active Target milestone (M8)"
  );
  assert.ok(Array.isArray(state.calendar.accomplishments), "calendar.accomplishments must be an array");
  assert.ok(
    state.calendar.accomplishments.some((a) => a.seat === "1-stone" && a.title === "SANDTRAP-001"),
    "calendar.accomplishments must carry the 1-stone SANDTRAP-001 seal"
  );
  assert.deepEqual(state.calendar.timeSpent, [], "calendar.timeSpent must be [] (honest-empty, NO TIMEKEEPER source)");
  assert.equal(
    state.calendar.timeSpentNote,
    "no TIMEKEEPER data yet (TIMEKEEPER-001 not executed)",
    "calendar.timeSpentNote must state the truth"
  );
});