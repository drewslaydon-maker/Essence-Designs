"use strict";

/**
 * WASH — Ghost of Wake (server)
 * Zero-dependency Node HTTP console on 127.0.0.1:4748.
 * Reads the studio's truth + Pad, and relays a ghost 0-Wake chat by spawning
 * `opencode run --agent 0-wake --format json --auto` in the repo root.
 * Read + relay only. No write endpoints.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4748;
const ROOT = path.resolve(__dirname, "..");
const PAD_FILE = path.join(ROOT, "ED", "02_ESSENCE_PAD.md");
const LOG_FILE = path.join(ROOT, "ED", "02_THE_LOGS", "05_CAPTAINS_LOG", "00_LOG_2026.md");
const CHAT_TIMEOUT_MS = 10 * 60 * 1000; // 10-minute safety kill
const MAX_BODY_BYTES = 1024 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const STATIC_FILES = {
  "/": { file: "index.html", mime: MIME[".html"] },
  "/style.css": { file: "style.css", mime: MIME[".css"] },
  "/app.js": { file: "app.js", mime: MIME[".js"] },
};

/**
 * Resolve the opencode launcher.
 * The npm global bin holds `opencode.ps1` / `opencode.cmd` shims that Node's
 * child_process cannot spawn directly, so we use the real executable by path.
 * Override with WASH_OPENCODE (env) if the install location ever moves.
 */
function resolveOpencode() {
  if (process.env.WASH_OPENCODE && fs.existsSync(process.env.WASH_OPENCODE)) {
    return process.env.WASH_OPENCODE;
  }
  const npmBin = path.join(
    process.env.APPDATA || "",
    "npm",
    "node_modules",
    "opencode-ai",
    "bin",
    "opencode.exe",
  );
  if (fs.existsSync(npmBin)) return npmBin;
  return "opencode"; // fallback: let the OS PATH resolution try; may ENOENT
}
const OPENCODE_BIN = resolveOpencode();

/** Pad leaves heuristic: lines starting with "- [" inside the Leaves in Flight section. */
function extractLeaves(padText) {
  const lines = String(padText || "").split(/\r?\n/);
  const out = [];
  let inLeaves = false;
  for (const raw of lines) {
    if (/^#{1,6}\s+/.test(raw)) {
      inLeaves = /Leaves in Flight/i.test(raw.replace(/^#{1,6}\s+/, "").trim());
      continue;
    }
    if (inLeaves && /^\s*-\s+\*{0,2}\[/.test(raw)) out.push(raw.trim());
  }
  return out;
}

/** Captain's log heuristic: last `### ` entry whose heading carries a Month Day date. */
function lastLogDate(logText) {
  const re = /^###\s+.*?([A-Z][a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?/;
  let last = null;
  for (const raw of String(logText || "").split(/\r?\n/)) {
    const m = raw.match(re);
    if (m) last = `${m[1]} ${m[2]}`;
  }
  return last;
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (e) {
    return null;
  }
}

function buildState() {
  const pad = safeRead(PAD_FILE);
  const log = safeRead(LOG_FILE);
  return {
    ok: pad !== null,
    pad: pad || "",
    leaves: extractLeaves(pad || ""),
    logDate: lastLogDate(log),
    serverTime: new Date().toISOString(),
    port: DEFAULT_PORT,
  };
}

function sendJson(res, code, obj) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(obj));
}

function sendFile(res, file, fallbackMime) {
  const abs = path.join(__dirname, file); // whitelist-only; no traversal surface
  try {
    const body = fs.readFileSync(abs);
    const mime = MIME[path.extname(abs)] || fallbackMime;
    res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
}

/** Discovered while building: opencode JSON events carry the session id in `properties.sessionID`. */
function extractSessionId(line) {
  try {
    const ev = JSON.parse(line);
    const p = ev.properties || ev;
    if (p && typeof p.sessionID === "string" && p.sessionID) return p.sessionID;
    if (p && typeof p.session_id === "string" && p.session_id) return p.session_id;
  } catch (e) {
    /* not JSON — not a session id carrier */
  }
  return null;
}

function handleChat(req, res) {
  let body = "";
  let tooBig = false;
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    body += chunk;
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      tooBig = true;
      req.destroy();
    }
  });
  req.on("error", () => {
    try {
      sendJson(res, 400, { error: "request body error" });
    } catch (e) {
      /* already responded */
    }
  });
  req.on("end", () => {
    if (tooBig) return sendJson(res, 400, { error: "body too large" });

    let parsed = {};
    try {
      parsed = JSON.parse(body || "{}");
    } catch (e) {
      return sendJson(res, 400, { error: "invalid JSON body" });
    }
    const message = typeof parsed.message === "string" ? parsed.message.trim() : "";
    if (!message) {
      return sendJson(res, 400, { error: "message must be a non-empty string" });
    }
    const sessionId =
      typeof parsed.sessionId === "string" && parsed.sessionId.trim()
        ? parsed.sessionId.trim()
        : null;

    const title = `WASH: ${message.slice(0, 40)}`;
    const args = ["run", "--agent", "0-wake", "--format", "json", "--auto", "--title", title];
    if (sessionId) args.push("--continue", "--session", sessionId);
    args.push(message);

    let child;
    try {
      child = spawn(OPENCODE_BIN, args, {
        cwd: ROOT,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"], // stdin must be ignored: a piped stdin stalls opencode run (WASH-001 discovery)
      });
    } catch (e) {
      return sendJson(res, 500, { error: "failed to spawn opencode: " + e.message });
    }

    let started = false;
    let sessionSeen = null;

    child.on("error", (err) => {
      if (!started) {
        try {
          sendJson(res, 500, { error: "failed to spawn opencode: " + err.message });
        } catch (e) {
          /* headers already sent */
        }
      } else {
        try {
          res.end();
        } catch (e) {
          /* already closed */
        }
      }
    });

    child.on("spawn", () => {
      started = true;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      console.log(
        `[WASH] chat started pid=${child.pid} session=${sessionSeen || sessionId || "new"}`,
      );
    });

    const killTimer = setTimeout(() => {
      try {
        child.kill();
      } catch (e) {
        /* already gone */
      }
    }, CHAT_TIMEOUT_MS);

    const relay = (stream) => {
      let buf = "";
      stream.setEncoding("utf8");
      stream.on("data", (chunk) => {
        if (!started || res.writableEnded) return;
        buf += chunk;
        let idx;
        while ((idx = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (!sessionSeen) {
            const sid = extractSessionId(trimmed);
            if (sid) sessionSeen = sid;
          }
          try {
            res.write(trimmed + "\n");
          } catch (e) {
            /* client gone */
          }
        }
      });
    };
    relay(child.stdout);
    relay(child.stderr);

    child.on("close", (code, signal) => {
      clearTimeout(killTimer);
      if (!started) {
        try {
          sendJson(res, 500, { error: "opencode exited before spawn (exit " + code + ")" });
        } catch (e) {
          /* already responded */
        }
        return;
      }
      try {
        res.end();
      } catch (e) {
        /* already closed */
      }
      console.log(
        `[WASH] chat exit=${code || 0}${signal ? " signal=" + signal : ""}${
          sessionSeen ? " session=" + sessionSeen : ""
        }`,
      );
    });

    res.on("close", () => {
      if (child && child.exitCode === null) {
        try {
          child.kill();
        } catch (e) {
          /* already gone */
        }
      }
    });
  });
}

function startServer(opts) {
  const { port = DEFAULT_PORT } = opts || {};
  const server = http.createServer((req, res) => {
    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    } catch (e) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("bad request");
      return;
    }
    const pathname = url.pathname;

    if (req.method === "GET") {
      if (pathname === "/state") return sendJson(res, 200, buildState());
      const asset = STATIC_FILES[pathname];
      if (asset) return sendFile(res, asset.file, asset.mime);
    }
    if (req.method === "POST" && pathname === "/chat") return handleChat(req, res);

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("not found");
  });

  server.listen(port, HOST, () => {
    console.log(`[WASH] listening on http://${HOST}:${port}`);
  });
  return server;
}

module.exports = {
  ROOT,
  HOST,
  DEFAULT_PORT,
  OPENCODE_BIN,
  resolveOpencode,
  extractLeaves,
  lastLogDate,
  buildState,
  startServer,
};

if (require.main === module) {
  const server = startServer();
  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}