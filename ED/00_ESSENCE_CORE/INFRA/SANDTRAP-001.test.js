"use strict";

/**
 * SANDTRAP-001.test.js — offline proof of the SANDTRAP SPAWN LAW (see
 * SANDTRAP_DISCIPLINE.md + spawn-safe.js in this folder).
 *
 * Node built-ins only — zero dependencies, zero LLM calls, no network.
 *
 * Run: node ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001.test.js
 * (plain assert script; also runnable via:
 *  node --test ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001.test.js)
 */

const assert = require("assert");
const { spawnSafe } = require("./spawn-safe.js");

let passed = 0;
const failed = [];

/**
 * ok(name, fn) — runs fn (may return a promise), records PASS/FAIL.
 */
function ok(name, fn) {
  return new Promise((resolve) => {
    Promise.resolve()
      .then(fn)
      .then(
        () => {
          passed += 1;
          console.log("PASS  " + name);
          resolve();
        },
        (err) => {
          failed.push(name + " — " + err.message);
          console.log("FAIL  " + name + " — " + err.message);
          resolve();
        }
      );
  });
}

(async () => {
  console.log("[SANDTRAP-001.test] proving the Sandtrap law offline (node " +
    process.version + ")...");

  // 1. Spawn captures output without a terminal.
  await ok(
    "1. spawn captures stdout without a terminal, exit 0 (sandtrap-ok)",
    () =>
      new Promise((resolve, reject) => {
        const child = spawnSafe(process.execPath, [
          "-e",
          "console.log('sandtrap-ok')",
        ]);
        let out = "";
        let errOut = "";
        child.stdout.on("data", (d) => (out += d.toString()));
        child.stderr.on("data", (d) => (errOut += d.toString()));
        child.on("error", reject);
        child.on("close", (code, signal) => {
          try {
            assert.strictEqual(
              code,
              0,
              "exit code must be 0 (got code=" + code +
                " signal=" + signal + " stderr=" + JSON.stringify(errOut) + ")"
            );
            assert.ok(
              out.includes("sandtrap-ok"),
              "stdout must contain 'sandtrap-ok' (got " + JSON.stringify(out) + ")"
            );
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      })
  );

  // 2. Law config is non-inheriting: stdin arm is "ignore", pipes for
  //    stdout/stderr — never the parent's live streams.
  await ok(
    "2. law config is non-inheriting (stdin=null, stdio[0]=null, pipes on 1/2)",
    () =>
      new Promise((resolve, reject) => {
        const child = spawnSafe(process.execPath, ["-e", ""]);
        try {
          assert.strictEqual(
            child.stdin,
            null,
            "child.stdin must be null (stdin arm ignored)"
          );
          assert.strictEqual(
            child.stdio[0],
            null,
            "child.stdio[0] must be null for the ignored stdin arm"
          );
          assert.ok(child.stdio[1], "child.stdio[1] must be a pipe stream");
          assert.ok(child.stdio[2], "child.stdio[2] must be a pipe stream");
          assert.notStrictEqual(
            child.stdout,
            process.stdout,
            "child stdout must NOT inherit parent stdout"
          );
          assert.notStrictEqual(
            child.stderr,
            process.stderr,
            "child stderr must NOT inherit parent stderr"
          );
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          child.on("error", () => {});
          child.on("close", () => {});
          try {
            child.kill();
          } catch (e) {
            /* already gone */
          }
        }
      })
  );

  // 3. Kill-point fires: timeoutMs=300 must kill a runaway child within 2000ms.
  await ok("3. kill-point fires (runaway child killed within 2000ms)", () =>
    new Promise((resolve, reject) => {
      const child = spawnSafe(
        process.execPath,
        ["-e", "setInterval(()=>{}, 1000)"],
        { timeoutMs: 300 }
      );
      const startedAt = Date.now();
      child.on("error", reject);
      child.on("close", (code, signal) => {
        const elapsed = Date.now() - startedAt;
        try {
          assert.ok(
            elapsed < 2000,
            "child must die within 2000ms (took " + elapsed + "ms)"
          );
          assert.ok(
            code !== null || signal !== null,
            "exitCode/signalCode must be set (code=" + code +
              ", signal=" + signal + ")"
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    })
  );

  // 4. Spawn error surfaces: missing bin fires the 'error' event (no throw).
  await ok("4. spawn error surfaces (missing bin -> 'error' event)", () =>
    new Promise((resolve, reject) => {
      let settled = false;
      const finish = (err) => {
        if (settled) return;
        settled = true;
        err ? reject(err) : resolve();
      };
      const child = spawnSafe(
        "sandtrap__definitely_missing_bin__" + process.pid,
        []
      );
      child.on("error", () => finish(null));
      child.on("close", () => {});
      setTimeout(
        () => finish(new Error("'error' event never fired within 3000ms")),
        3000
      ).unref();
    })
  );

  console.log("");
  console.log(
    "[SANDTRAP-001.test] " + passed + " passed, " + failed.length + " failed"
  );
  if (failed.length > 0) {
    for (const f of failed) {
      console.log("  FAILED: " + f);
    }
    process.exit(1);
  }
  console.log(
    "[SANDTRAP-001.test] ALL TESTS PASSED — Sandtrap law proven offline."
  );
  process.exit(0);
})();