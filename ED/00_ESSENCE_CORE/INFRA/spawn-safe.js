"use strict";

/**
 * spawn-safe — the SANDTRAP SPAWN LAW as code (see SANDTRAP_DISCIPLINE.md).
 * Zero-dependency child spawn that never inherits a live terminal:
 * stdin ignored, stdout/stderr piped, window hidden, kill-point attached.
 */

const { spawn } = require("child_process");

/**
 * @param {string} bin   resolved executable path (no shims)
 * @param {string[]} args
 * @param {object} [opts]
 *   cwd       working directory
 *   env       env override (default: process.env)
 *   timeoutMs safety kill (default 600000 = 10 min, WASH precedent)
 * @returns {ChildProcess} child with .stdout/.stderr pipes + kill-point
 */
function spawnSafe(bin, args, opts = {}) {
  const { cwd, env = process.env, timeoutMs = 600000, windowsHide = true } =
    opts;
  const child = spawn(bin, args, {
    cwd,
    env,
    windowsHide,
    stdio: ["ignore", "pipe", "pipe"], // THE LAW — never inherit a terminal
  });

  let killTimer = null;
  if (timeoutMs > 0) {
    killTimer = setTimeout(() => {
      try {
        child.kill();
      } catch (e) {
        /* already gone */
      }
    }, timeoutMs);
  }
  child.on("close", () => {
    if (killTimer) {
      clearTimeout(killTimer);
      killTimer = null;
    }
  });
  return child;
}

module.exports = { spawnSafe };