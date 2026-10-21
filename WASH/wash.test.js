"use strict";

/* WASH — offline test suite (zero dependencies, zero LLM calls).
 * Runner: node --test WASH/wash.test.js
 * Uses Node's built-in node:test (Node v24.19.0). Every test boots its own
 * server instance on 127.0.0.1:4748 and shuts it down. No /chat LLM call is
 * ever executed here — only validation failures (400) are exercised. */

const { test } = require("node:test");
const assert = require("node:assert");
const { startServer } = require("./server.js");

const PORT = 4748;

async function withServer(fn) {
  const server = startServer({ port: PORT });
  await new Promise((res) => server.on("listening", res));
  try {
    return await fn();
  } finally {
    await new Promise((res) => server.close(res));
  }
}

test("1 · server boots bound to 127.0.0.1 on port 4748", async () => {
  await withServer(async () => {
    const conn = await fetch(`http://127.0.0.1:${PORT}/`);
    assert.strictEqual(conn.status, 200);
  });
});

test("2 · GET / serves the WASH shell with the title", async () => {
  await withServer(async () => {
    const res = await fetch(`http://127.0.0.1:${PORT}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("WASH"), "index.html must contain WASH");
    assert.ok(html.includes("Ghost of Wake"), "index.html must brand the ghost");
    assert.ok(html.includes("app.js"), "index.html must load app.js");
  });
});

test("3 · GET /style.css and /app.js serve 200", async () => {
  await withServer(async () => {
    const css = await fetch(`http://127.0.0.1:${PORT}/style.css`);
    assert.strictEqual(css.status, 200);
    assert.ok((await css.text()).includes("purple"), "style.css must carry the PAD family");
    const js = await fetch(`http://127.0.0.1:${PORT}/app.js`);
    assert.strictEqual(js.status, 200);
  });
});

test("4 · GET /state serves JSON with pad and leaves present", async () => {
  await withServer(async () => {
    const res = await fetch(`http://127.0.0.1:${PORT}/state`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get("content-type").includes("application/json"));
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(typeof body.pad === "string" && body.pad.length > 0, "pad field");
    assert.ok(Array.isArray(body.leaves), "leaves field");
    assert.ok(typeof body.logDate === "string", "logDate field");
    assert.ok(typeof body.serverTime === "string", "serverTime field");
    assert.strictEqual(body.port, PORT);
  });
});

test("5 · path traversal / out-of-whitelist never leaks files", async () => {
  await withServer(async () => {
    // URL-normalized traversal: /../opencode.json -> /opencode.json -> 404
    const t1 = await fetch(`http://127.0.0.1:${PORT}/../opencode.json`);
    assert.strictEqual(t1.status, 404);
    const t1body = await t1.text();
    assert.ok(!t1body.includes("opencode"), "traversal must not return repo content");

    // Encoded traversal attempt
    const t2 = await fetch(`http://127.0.0.1:${PORT}/..%2F..%2Fopencode.json`);
    assert.strictEqual(t2.status, 404);

    // A real repo file that is NOT on the whitelist must stay hidden (server.js leak check)
    const t3 = await fetch(`http://127.0.0.1:${PORT}/server.js`);
    assert.strictEqual(t3.status, 404);

    // Ed district file (out of whitelist) must not be served
    const t4 = await fetch(`http://127.0.0.1:${PORT}/ED/02_ESSENCE_PAD.md`);
    assert.strictEqual(t4.status, 404);
  });
});

test("6 · unknown route returns 404", async () => {
  await withServer(async () => {
    const res = await fetch(`http://127.0.0.1:${PORT}/nope.txt`);
    assert.strictEqual(res.status, 404);
  });
});

test("7 · POST /chat with missing / empty message returns 400 { error }", async () => {
  await withServer(async () => {
    const missing = await fetch(`http://127.0.0.1:${PORT}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(missing.status, 400);
    const missingJson = await missing.json();
    assert.ok(missingJson.error, "error field present");

    const empty = await fetch(`http://127.0.0.1:${PORT}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });
    assert.strictEqual(empty.status, 400);
    const emptyJson = await empty.json();
    assert.ok(emptyJson.error, "error field present");
  });
});

test("8 · shell pass deltas — working animation + readability", async () => {
  await withServer(async () => {
    const css = await fetch(`http://127.0.0.1:${PORT}/style.css`);
    assert.strictEqual(css.status, 200);
    const cssText = await css.text();
    assert.ok(cssText.includes("body.working"), "style.css must drive body.working");
    assert.ok(cssText.includes("@keyframes washWorking"), "style.css must carry washWorking keyframes");
    assert.ok(cssText.includes("font-size: 10.5px"), "style.css must lift .bubble .meta to 10.5px");

    const js = await fetch(`http://127.0.0.1:${PORT}/app.js`);
    assert.strictEqual(js.status, 200);
    const jsText = await js.text();
    assert.ok(jsText.includes('classList.add("working")'), "app.js must add body.working");
    assert.ok(jsText.includes('classList.remove("working")'), "app.js must remove body.working");

    const idx = await fetch(`http://127.0.0.1:${PORT}/`);
    assert.strictEqual(idx.status, 200);
    const html = await idx.text();
    assert.ok(html.includes("WASH"), "index.html must still serve the WASH shell (regression)");
  });
});