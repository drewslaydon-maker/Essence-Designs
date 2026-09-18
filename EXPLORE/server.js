"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_PORT = 4747;

const REGION_DEFS = [
  { id: "engine", label: "THE ENGINE", path: path.join("ED", "00_ESSENCE_CORE"), icon: "gem" },
  { id: "designs", label: "THE DESIGNS", path: path.join("ED", "01_THE_DESIGNS"), icon: "compass" },
  { id: "logs", label: "THE LOGS", path: path.join("ED", "02_THE_LOGS"), icon: "logbook" },
  { id: "games", label: "THE GAMES", path: path.join("ED", "03_THE_GAMES"), icon: "dice" },
  { id: "vault", label: "LEGACY VAULT", path: path.join("LEGACY", "VAULT"), icon: "vault" },
];

const PAD_DEFS = [
  { id: "bible", label: "THE BIBLE", file: path.join("ED", "00_ESSENCE_BIBLE.md"), icon: "pad" },
  { id: "pad", label: "THE PAD", file: path.join("ED", "02_ESSENCE_PAD.md"), icon: "pad" },
  { id: "milestones", label: "MILESTONES", file: path.join("ED", "01_THE_DESIGNS", "MILESTONES.md"), icon: "compass" },
  { id: "log", label: "CAPTAIN'S LOG", file: path.join("ED", "02_THE_LOGS", "05_CAPTAINS_LOG", "00_LOG_2026.md"), icon: "logbook" },
];

const STATE_DIRS = ["ACTIVE/MAIN", "ACTIVE/SUPPORTING", "ON_DECK", "BROKEN", "PARKED", "TOOLKIT"];
const STATE_META = {
  "ACTIVE/MAIN": { state: "ACTIVE", icon: "wheel", priority: "MAIN" },
  "ACTIVE/SUPPORTING": { state: "ACTIVE", icon: "seedling", priority: "SUPPORTING" },
  ON_DECK: { state: "ON_DECK", icon: "stack", priority: null },
  BROKEN: { state: "BROKEN", icon: "shard", priority: null },
  PARKED: { state: "PARKED", icon: "leaf", priority: null },
  TOOLKIT: { state: "TOOLKIT", icon: "anvil", priority: null },
};

const WHEEL_IDS = new Set(["06"]);

function mtime(rel) {
  try {
    return fs.statSync(path.join(ROOT, rel)).mtime.toISOString();
  } catch (e) {
    return null;
  }
}

function scanParcels() {
  const parcels = [];
  for (const dir of STATE_DIRS) {
    const abs = path.join(ROOT, "ED", "03_THE_GAMES", ...dir.split("/"));
    let entries;
    try {
      entries = fs.readdirSync(abs, { withFileTypes: true });
    } catch (e) {
      continue;
    }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const isTool = dir === "TOOLKIT";
      const idMatch = isTool ? null : ent.name.match(/^(\d{2})_(.+)$/);
      const meta = STATE_META[dir];
      const relay = path.join("ED", "03_THE_GAMES", dir, ent.name);
      parcels.push({
        id: idMatch ? idMatch[1] : null,
        name: isTool ? ent.name.replace(/^\d{2}_/, "") : idMatch ? idMatch[2] : ent.name,
        rawName: ent.name,
        rel: relay.replace(/\\/g, "/"),
        state: meta.state,
        priority: meta.priority,
        icon: isTool ? meta.icon : WHEEL_IDS.has(idMatch ? idMatch[1] : "x") ? "wheel" : meta.icon,
        parcelType: isTool ? "tool" : "game",
        mtime: mtime(relay),
      });
    }
  }
  return parcels;
}

function countStone(rel, maxDepth) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return 0;
  let count = 0;
  const walk = (dir, depth) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const ent of entries) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (depth < maxDepth) walk(full, depth + 1);
      } else if (path.extname(ent.name) === ".json") {
        count += 1;
      }
    }
  };
  walk(abs, 0);
  return count;
}

function readGit() {
  const log = spawnSync("git", ["log", "-1", "--pretty=%h|%s|%cI"], { cwd: ROOT, encoding: "utf8", timeout: 10000 });
  const status = spawnSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8", timeout: 30000 });
  const has = log.status === 0 && log.stdout && log.stdout.trim();
  let hash = null;
  let subject = null;
  let date = null;
  if (has) {
    const parts = log.stdout.trim().split("|");
    hash = parts[0] || null;
    subject = parts[1] || null;
    date = parts[2] || null;
  }
  let dirtyCount = null;
  if (status.status === 0) {
    dirtyCount = status.stdout ? status.stdout.trim().split(/\r?\n/).filter(Boolean).length : 0;
  }
  return { hasCommits: !!has, shortHash: hash, subject, date, dirtyCount };
}

const LAG_APP = path.join(
  ROOT,
  "ED", "03_THE_GAMES", "ACTIVE", "MAIN", "06_LOTUS_ADVERSITY_GAME",
  "Lotus-Adversity-Game-main", "Lotus_Adversity_Game",
);

function runLagGates() {
  const stamp = () => new Date().toISOString();
  const bun = spawnSync("bun", ["--version"], { encoding: "utf8", timeout: 10000 });
  if (bun.error || bun.status !== 0) {
    return { state: "unavailable", reason: "runner unavailable — bun not installed in this environment", stamp: stamp() };
  }
  if (!fs.existsSync(path.join(LAG_APP, "node_modules"))) {
    return { state: "unavailable", reason: "LAG dependencies not installed — run `bun install` in Lotus_Adversity_Game/", stamp: stamp() };
  }
  const t0 = Date.now();
  const res = spawnSync("bun", ["run", "lab:verify"], { cwd: LAG_APP, encoding: "utf8", timeout: 120000 });
  const gates = [];
  const lines = String(res.stdout || "").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^(PASS|FAIL)\s+(.+)$/);
    if (m) {
      gates.push({ pass: m[1] === "PASS", title: m[2].trim(), details: [] });
    } else if (gates.length && /^\s{6}/.test(line) && line.trim()) {
      gates[gates.length - 1].details.push(line.trim());
    }
  }
  return {
    state: "ok",
    overall: res.status === 0,
    exitCode: res.status,
    durationMs: Date.now() - t0,
    gates,
    stamp: stamp(),
  };
}

function buildDomain() {
  const regions = REGION_DEFS.map((r) => ({
    id: r.id,
    label: r.label,
    icon: r.icon,
    path: r.path.replace(/\\/g, "/"),
    mtime: mtime(r.path),
    stone: countStone(r.path, 2),
  }));
  regions.find((r) => r.id === "engine").subs = [
    { name: "ED_FLOW", icon: "streams" },
    { name: "INFRA", icon: "blueprint" },
  ];
  regions.find((r) => r.id === "designs").subs = [
    { name: "DISCOVERIES", icon: "folio" },
    { name: "FRAMEWORKS", icon: "folio" },
    { name: "INFLUENCES", icon: "folio" },
  ];
  return {
    generatedAt: new Date().toISOString(),
    git: readGit(),
    pads: PAD_DEFS.map((p) => ({ id: p.id, label: p.label, icon: p.icon, file: p.file.replace(/\\/g, "/"), mtime: mtime(p.file) })),
    regions,
    parcels: scanParcels(),
  };
}

const gateCache = { at: 0, data: null };
function cachedLagGates(force) {
  const now = Date.now();
  if (!force && gateCache.data && now - gateCache.at < 15000) return gateCache.data;
  const data = runLagGates();
  if (data.state === "ok" || force) {
    gateCache.at = now;
    gateCache.data = data;
  }
  return data;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const STATIC_FILES = {
  "/": { file: "index.html", mime: MIME[".html"], noStore: true },
  "/style.css": { file: "style.css", mime: MIME[".css"], noStore: true },
  "/app.js": { file: "app.js", mime: MIME[".js"], noStore: true },
};

function startServer(opts) {
  const { port = DEFAULT_PORT, watch = true } = opts || {};
  const clients = new Set();
  let rev = 0;

  function broadcast() {
    const data = JSON.stringify(buildDomain());
    rev += 1;
    const payload = `event: domain\ndata: ${data}\n\n`;
    for (const client of clients) {
      try {
        client.write(`id: ${rev}\n${payload}`);
      } catch (e) {
        clients.delete(client);
      }
    }
  }

  function handleApi(req, res, url) {
    if (url.pathname === "/api/domain") {
      return json(res, 200, buildDomain());
    }
    if (url.pathname === "/api/gates") {
      const force = url.searchParams.get("re") === "1";
      return json(res, 200, cachedLagGates(force));
    }
    if (url.pathname === "/api/health") {
      return json(res, 200, { status: "ok", service: "ESSENCE EXPLORE Ledger", rev });
    }
    if (url.pathname === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
      res.write(`retry: 2000\n`);
      res.write(`event: domain\ndata: ${JSON.stringify(buildDomain())}\n\n`);
      clients.add(res);
      const ping = setInterval(() => {
        try {
          res.write(`: ping\n\n`);
        } catch (e) {
          clearInterval(ping);
        }
      }, 25000);
      res.on("close", () => {
        clearInterval(ping);
        clients.delete(res);
      });
      return true;
    }
    return false;
  }

  function json(res, code, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(code, { "Content-Type": MIME[".json"], "Cache-Control": "no-store" });
    res.end(body);
    return true;
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/") || url.pathname === "/events") {
      try {
        if (handleApi(req, res, url)) return;
      } catch (e) {
        return json(res, 500, { error: String(e.message || e) });
      }
      return json(res, 404, { error: "not found" });
    }
    const asset = STATIC_FILES[url.pathname];
    if (asset) {
      const full = path.join(__dirname, asset.file);
      if (fs.existsSync(full)) {
        res.writeHead(200, {
          "Content-Type": asset.mime,
          "Cache-Control": asset.noStore ? "no-store" : "no-cache",
        });
        return res.end(fs.readFileSync(full));
      }
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  });

  server.listen(port, () => {
    console.log(`EXPLORE Ledger live at http://localhost:${server.address().port}`);
  });

  if (watch) {
    let timer = null;
    const relevant = (rel) => {
      if (rel === null) return true;
      const parts = rel.replace(/\\/g, "/").split("/");
      if (parts[0] === ".git" || parts.includes("node_modules")) return false;
      if (parts[0] === "LEGACY") return parts.length <= 3 && parts[1] === "VAULT";
      return true;
    };
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(broadcast, 300);
    };
    try {
      fs.watch(ROOT, { recursive: true }, (_, filename) => {
        if (relevant(filename)) schedule();
      });
    } catch (e) {
      console.error("recursive watch unavailable:", e.message);
    }
  }

  return server;
}

module.exports = { ROOT, DEFAULT_PORT, buildDomain, scanParcels, runLagGates, cachedLagGates, startServer };

if (require.main === module) {
  const server = startServer();
  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}