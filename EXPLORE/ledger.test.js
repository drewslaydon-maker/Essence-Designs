"use strict";

const assert = require("assert");
const { buildDomain, scanParcels, runLagGates, startServer } = require("./server.js");

let failures = 0;
const pending = [];
function check(name, fn) {
  pending.push(
    (async () => {
      try {
        await fn();
        console.log(`PASS  ${name}`);
      } catch (e) {
        failures += 1;
        console.log(`FAIL  ${name} — ${e.message}`);
      }
    })(),
  );
}

check("domain has exactly 5 regions in canonical order", () => {
  const d = buildDomain();
  assert.strictEqual(d.regions.length, 5);
  assert.deepStrictEqual(
    d.regions.map((r) => r.id),
    ["engine", "designs", "logs", "games", "vault"],
  );
  assert.strictEqual(d.generatedAt && typeof d.generatedAt === "string", true);
});

check("engine + designs carry their icon-language subnodes", () => {
  const d = buildDomain();
  const engine = d.regions.find((r) => r.id === "engine");
  const designs = d.regions.find((r) => r.id === "designs");
  assert.deepStrictEqual(
    engine.subs.map((s) => s.name),
    ["ED_FLOW", "INFRA"],
  );
  assert.deepStrictEqual(
    designs.subs.map((s) => s.name),
    ["DISCOVERIES", "FRAMEWORKS", "INFLUENCES"],
  );
  assert.strictEqual(engine.subs[0].icon, "streams");
  assert.strictEqual(engine.subs[1].icon, "blueprint");
});

check("LAG is THE WHEEL parcel — ACTIVE / MAIN / id 06 / gold", () => {
  const parcels = scanParcels();
  const lag = parcels.find((p) => p.id === "06");
  assert.ok(lag, "LAG parcel missing");
  assert.strictEqual(lag.name, "LOTUS_ADVERSITY_GAME");
  assert.strictEqual(lag.state, "ACTIVE");
  assert.strictEqual(lag.priority, "MAIN");
  assert.strictEqual(lag.icon, "wheel");
  assert.strictEqual(lag.parcelType, "game");
});

check("roster placement matches the catalog (BROKEN / ON_DECK / PARKED)", () => {
  const parcels = scanParcels();
  const games = parcels.filter((p) => p.parcelType === "game");
  const tools = parcels.filter((p) => p.parcelType === "tool");
  const ids = new Map(games.filter((p) => p.id).map((p) => [p.id, p]));
  assert.strictEqual(ids.get("02").state, "BROKEN");
  assert.strictEqual(ids.get("12").state, "BROKEN");
  assert.strictEqual(ids.get("00").state, "ON_DECK");
  assert.strictEqual(ids.get("01").state, "ON_DECK");
  assert.strictEqual(ids.get("04").state, "ON_DECK");
  assert.ok(ids.get("03").state === "PARKED");
  assert.ok(ids.get("05").state === "PARKED");
  assert.ok(ids.get("07").state === "PARKED");
  assert.ok(ids.get("08").state === "PARKED");
  assert.ok(ids.get("09").state === "PARKED");
  assert.ok(ids.get("10").state === "PARKED");
  assert.ok(ids.get("11").state === "PARKED");
  assert.strictEqual(games.length, 13);
  assert.strictEqual(tools.length, 2);
  assert.strictEqual(tools.filter((t) => t.icon === "anvil").length, 2);
});

check("parcel paths are forward-slash rels, no node_modules leak", () => {
  for (const p of scanParcels()) {
    assert.ok(typeof p.rel === "string" && p.rel.includes("ED/03_THE_GAMES"));
    assert.ok(!p.rel.includes("node_modules"));
    assert.strictEqual(p.rel.includes("\\"), false);
  }
});

check("region stone counts are integers (json / infra piles)", () => {
  const d = buildDomain();
  for (const r of d.regions) {
    assert.ok(Number.isInteger(r.stone) && r.stone >= 0, `stone for ${r.id}`);
  }
});

check("pads row lists the four canonical documents with mtimes", () => {
  const d = buildDomain();
  assert.deepStrictEqual(
    d.pads.map((p) => p.id),
    ["bible", "pad", "milestones", "log"],
  );
  for (const p of d.pads) {
    assert.ok(p.mtime && new Date(p.mtime).getTime() > 0, `pads.${p.id}`);
    assert.ok(typeof p.icon === "string");
  }
});

check("git reads the repo honestly (post-seed)", () => {
  const d = buildDomain();
  assert.strictEqual(typeof d.git.hasCommits, "boolean");
  assert.strictEqual(d.git.hasCommits, true);
  assert.ok(typeof d.git.shortHash === "string" && d.git.shortHash.length > 0, "shortHash");
  assert.ok(Number.isInteger(d.git.dirtyCount) && d.git.dirtyCount >= 0, "dirtyCount");
});

check("LAG gate runner degrades gracefully with valid shape", () => {
  const res = runLagGates();
  assert.ok(["ok", "unavailable", "error"].includes(res.state), `state=${res.state}`);
  assert.ok(typeof res.stamp === "string" && new Date(res.stamp).getTime() > 0);
  if (res.state === "ok") {
    assert.strictEqual(typeof res.overall, "boolean");
    assert.ok(Array.isArray(res.gates) && res.gates.length >= 1);
    for (const g of res.gates) {
      assert.strictEqual(typeof g.title, "string");
      assert.strictEqual(typeof g.pass, "boolean");
    }
  } else if (res.state === "unavailable") {
    assert.ok(typeof res.reason === "string" && res.reason.length > 0);
  }
});

check("live HTTP: /api/domain serves the domain model", async () => {
  const server = startServer({ port: 0, watch: false });
  await new Promise((resolve) => server.on("listening", resolve));
  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/api/domain`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type").includes("application/json"), true);
    const body = await res.json();
    assert.ok(body.generatedAt);
    assert.strictEqual(body.regions.length, 5);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

check("live HTTP: / serves the map shell", async () => {
  const server = startServer({ port: 0, watch: false });
  await new Promise((resolve) => server.on("listening", resolve));
  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("<title>ESSENCE DESIGNS — EXPLORE</title>"));
    assert.ok(html.includes("app.js"));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

check("live HTTP: static + assets serve with correct MIME", async () => {
  const server = startServer({ port: 0, watch: false });
  await new Promise((resolve) => server.on("listening", resolve));
  try {
    const port = server.address().port;
    const css = await fetch(`http://127.0.0.1:${port}/style.css`);
    assert.strictEqual(css.status, 200);
    assert.ok(css.headers.get("content-type").includes("text/css"));
    const js = await fetch(`http://127.0.0.1:${port}/app.js`);
    assert.strictEqual(js.status, 200);
    assert.ok(js.headers.get("content-type").includes("javascript"));
    const missing = await fetch(`http://127.0.0.1:${port}/nope.txt`);
    assert.strictEqual(missing.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

check("live HTTP: /api/gates returns valid shape over the wire", async () => {
  const server = startServer({ port: 0, watch: false });
  await new Promise((resolve) => server.on("listening", resolve));
  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/api/gates`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(["ok", "unavailable", "error"].includes(body.state));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

console.log("");
Promise.all(pending).then(() => {
  if (failures === 0) {
    console.log(`LEDGER TEST PASSED — ${pending.length}/${pending.length}.`);
  } else {
    console.log(`LEDGER TEST FAILED — ${failures} of ${pending.length} red.`);
    process.exitCode = 1;
  }
});