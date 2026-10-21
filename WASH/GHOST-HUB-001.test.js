"use strict";

/* GHOST-HUB-001 — Offline test suite (zero dependencies, zero LLM calls).
 * Runner: node --test WASH/GHOST-HUB-001.test.js
 * Uses Node's built-in node:test (Node v24.19.0). Every test boots its own
 * server instance on 127.0.0.1:4749 and shuts it down. */

const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const { startServer } = require("./hub-server.js");
const fs = require("fs");
const path = require("path");

const PORT = 4749;
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;

let server = null;

async function withServer(fn) {
  server = startServer({ port: PORT });
  await new Promise((res) => server.on("listening", res));
  try {
    return await fn();
  } finally {
    await new Promise((res) => server.close(res));
    server = null;
  }
}

// Test 1: Server boots + serves HTML
test("1 · server boots bound to 127.0.0.1 on port 4749", async () => {
  await withServer(async () => {
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);
    await conn.text(); // REPAIR-2: consume body so the pooled socket isn't mid-response when the server closes (SSE ECONNRESET)
  });
});

test("2 · GET / serves the GHOST HUB shell with the title", async () => {
  await withServer(async () => {
    const res = await fetch(`${BASE}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("ESSENCE DESIGNS GHOST HUB"), "index.html must contain hub title");
    assert.ok(html.includes("HEAD COUNCIL GHOSTS"), "must have council tab");
    assert.ok(html.includes("SPECIFIED SPECTERS"), "must have specters tab");
    assert.ok(html.includes("AGENT ROSTER"), "must have roster tab");
    assert.ok(html.includes("TK MANIFEST"), "must link TK Manifest");
    assert.ok(html.includes("Sandtrap-secured"), "must show version badge");
  });
});

test("3 · GET /hub.css and /hub.html serve 200", async () => {
  await withServer(async () => {
    const css = await fetch(`${BASE}/hub.css`);
    assert.strictEqual(css.status, 200);
    const cssText = await css.text();
    assert.ok(cssText.includes("pad-purple"), "CSS must carry PAD purple");
    assert.ok(cssText.includes("pad-gold"), "CSS must carry PAD gold");
    assert.ok(cssText.includes("hub-symbol"), "CSS must have WASH symbol styles");

    const html = await fetch(`${BASE}/hub.html`);
    assert.strictEqual(html.status, 200);
  });
});

// Test 4: SSE stream opens
test("4 · GET /events returns text/event-stream and emits heartbeat", async () => {
  await withServer(async () => {
    const res = await fetch(`${BASE}/events`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get("content-type").includes("text/event-stream"));

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let gotHeartbeat = false;
    let attempts = 0;

    while (!gotHeartbeat && attempts < 50) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith(": heartbeat")) {
          gotHeartbeat = true;
          break;
        }
      }
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    assert.ok(gotHeartbeat, "SSE must emit heartbeat within timeout");
    reader.cancel();
  });
});

// Test 5: Spawn-safe integration
test("5 · POST /spawn with benign command returns { pid, agent }, child exits 0", async () => {
  await withServer(async () => {
    const res = await fetch(`${BASE}/spawn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bin: "node",
        args: ["-e", "console.log('hub-spawn-ok')"],
        agent: "test-agent",
        timeoutMs: 30000,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(typeof data.pid === "number" && data.pid > 0, "must return pid");
    assert.strictEqual(data.agent, "test-agent", "must echo agent name");
    assert.strictEqual(data.spawned, true, "must indicate spawned");
  });
});

// Test 6: TK Manifest readable via /state
test("6 · GET /state includes tkManifest array parsed from TK_MANIFEST.md", async () => {
  await withServer(async () => {
    const res = await fetch(`${BASE}/state`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get("content-type").includes("application/json"));
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(Array.isArray(body.tkManifest), "tkManifest must be array");
    assert.ok(body.tkManifest.length > 0, "tkManifest must have entries");
    const first = body.tkManifest[0];
    assert.ok(typeof first.tool === "string", "tool field");
    assert.ok(typeof first.purpose === "string", "purpose field");
    assert.ok(typeof first.access === "string", "access field");
    assert.ok(typeof first.notes === "string", "notes field");
    // Check roster present
    assert.ok(Array.isArray(body.roster), "roster must be array");
    // Check council and specters
    assert.ok(Array.isArray(body.council), "council must be array");
    assert.ok(Array.isArray(body.specters), "specters must be array");
  });
});

// Test 7: electron-main.js syntax validates
test("7 · electron-main.js syntax validates (node --check)", async () => {
  const { spawnSync } = require("child_process");
  const result = spawnSync("node", ["--check", "electron-main.js"], {
    cwd: __dirname,
    encoding: "utf8",
  });
  assert.strictEqual(result.status, 0, `electron-main.js syntax check failed: ${result.stderr}`);
});

// Test 8: hub-server.js requires spawn-safe.js from correct path
test("8 · hub-server.js requires spawn-safe.js from ../ED/00_ESSENCE_CORE/INFRA/", async () => {
  const content = fs.readFileSync(path.join(__dirname, "hub-server.js"), "utf8");
  assert.ok(content.includes("require(\"../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js\")"),
    "must require spawn-safe.js from INFRA");
});

// Test 9: electron-main.js loads http://127.0.0.1:4749
test("9 · electron-main.js loads http://127.0.0.1:4749", async () => {
  const content = fs.readFileSync(path.join(__dirname, "electron-main.js"), "utf8");
  assert.ok(content.includes("http://127.0.0.1:4749"), "must load hub URL");
});

// Test 10: TK Manifest file exists and is readable
test("10 · TK_MANIFEST.md exists at ED/00_ESSENCE_CORE/INFRA/TK_MANIFEST.md", async () => {
  const manifestPath = path.join(__dirname, "..", "ED", "00_ESSENCE_CORE", "INFRA", "TK_MANIFEST.md");
  assert.ok(fs.existsSync(manifestPath), "TK_MANIFEST.md must exist");
  const content = fs.readFileSync(manifestPath, "utf8");
  assert.ok(content.includes("TOOLKIT MANIFEST"), "must have title");
  assert.ok(content.includes("Tool Registry"), "must have registry section");
  assert.ok(content.includes("spawn-safe.js"), "must list spawn-safe.js");
});

console.log("=== GHOST-HUB-001 Test Suite Loaded ===");