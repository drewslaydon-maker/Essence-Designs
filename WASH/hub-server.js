"use strict";

/**
 * ESSENCE DESIGNS GHOST HUB — Server (GHOST-HUB-002 repaired)
 * Zero-dependency Node HTTP + SSE console on 127.0.0.1:4749.
 * Serves the hub UI, relays agent spawns via spawn-safe.js (Sandtrap law),
 * and relays real chat lanes to seated opencode agents (GHOST-HUB-003).
 * Reads TK_MANIFEST.md and ground truth (seats / shadow council / ledger /
 * MILESTONES registry) for /state, personalized through hub-agents.json.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawnSafe } = require("../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js");

const HOST = "127.0.0.1";
const PORT = 4749;
const ROOT = path.resolve(__dirname, "..");
const TK_MANIFEST_FILE = path.join(ROOT, "ED", "00_ESSENCE_CORE", "INFRA", "TK_MANIFEST.md");
const MILESTONES_FILE = path.join(ROOT, "ED", "01_THE_DESIGNS", "MILESTONES.md");
const LEDGER_DIR = path.join(ROOT, "ED", "02_THE_LOGS", "06_THE_LEDGER");
const AGENTS_DIR = path.join(__dirname, "..", ".opencode", "agents");
const SHADOW_COUNCIL_DIR = path.join(ROOT, "LEGACY", "VAULT", "00_SHADOW_COUNCIL");
const GRAVEYARD_DIR = path.join(ROOT, "LEGACY", "Graveyard"); // GHOST-HUB-009: read-only live mirror
const HUB_AGENTS_FILE = path.join(__dirname, "hub-agents.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
};

const STATIC_FILES = {
  "/": { file: "hub.html", mime: MIME[".html"] },
  "/hub.html": { file: "hub.html", mime: MIME[".html"] },
  "/hub.css": { file: "hub.css", mime: MIME[".css"] },
  "/icon.ico": { file: "icon.ico", mime: MIME[".ico"] },
};

/**
 * Resolve the opencode launcher (exact WASH/server.js pattern).
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

// Known codes when the .opencode/agents/ dir is missing (fallback, never crash).
const FALLBACK_SEAT_CODES = ["0-wake", "1-stone", "b-bolt", "x-xp"];

// Ledger seat dir names (ground truth: 06_THE_LEDGER/README.md).
const SEAT_DIR_MAP = {
  "0-wake": "0-WAKE",
  "1-stone": "1-STONE",
  "b-bolt": "B-BOLT",
  "x-xp": "X-XP",
};

function safeRead(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (e) {
    return null;
  }
}

function parseTKManifest(md) {
  const tools = [];
  if (!md) return tools;
  const lines = md.split(/\r?\n/);
  let inTable = false;
  for (const line of lines) {
    if (line.trim().startsWith("| Tool |")) {
      inTable = true;
      continue;
    }
    if (inTable && line.trim().startsWith("|---")) continue;
    if (inTable && line.trim().startsWith("|")) {
      const parts = line.split("|").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 4) {
        tools.push({
          tool: parts[0],
          purpose: parts[1],
          access: parts[2],
          notes: parts[3],
        });
      }
    }
    if (inTable && !line.trim().startsWith("|") && line.trim() !== "") {
      inTable = false;
    }
  }
  return tools;
}

/**
 * Personalization surface (WASH/hub-agents.json). On miss, returns an empty
 * config object — the server still boots on ground-truth defaults.
 */
function hubAgents() {
  const raw = safeRead(HUB_AGENTS_FILE);
  if (!raw) return { version: 1, note: "", agents: {} };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.agents && typeof parsed.agents === "object") {
      return parsed;
    }
    return { version: 1, note: "", agents: {} };
  } catch (e) {
    return { version: 1, note: "", agents: {} };
  }
}

/** Default ground-truth agents (read-only). Config merges over these. */
function defaultAgents() {
  const agents = {};

  // Seats from .opencode/agents/*.md (code = stem).
  let seatCodes = [];
  try {
    seatCodes = fs.readdirSync(AGENTS_DIR)
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(/\.md$/, ""));
  } catch (e) {
    // dir missing — use the four known codes
  }
  if (!seatCodes.length) seatCodes = FALLBACK_SEAT_CODES.slice();

  const seatMeta = {
    "0-wake": { displayName: "Wake", role: "PLANNER", tagline: "The planner seat. Reads truth, specs leaves, never builds." },
    "1-stone": { displayName: "Stone", role: "DOER", tagline: "The build lane. Executes the approved task package, halts." },
    "b-bolt": { displayName: "COURRIER", role: "COURRIER", tagline: "Bridge role. Ferries verified records between windows." },
    "x-xp": { displayName: "XP", role: "EXPERIENCER", tagline: "The play lane. Experiencer's workspace." },
  };

  for (const code of seatCodes) {
    const meta = seatMeta[code] || { displayName: code, role: "SEAT", tagline: "" };
    agents[code] = {
      id: code,
      displayName: meta.displayName,
      role: meta.role,
      section: "council",
      tagline: meta.tagline,
      status: "active",
      access: "",
    };
  }

  // WASH — the live ghost (verified 2026-09-20).
  agents.wash = {
    id: "wash",
    displayName: "WASH",
    role: "SEER",
    section: "council",
    tagline: "Outside seer. Read-only walks, artifact filing, live ghost.",
    status: "live",
    access: "",
  };

  // Specters per mandate (CG READ-ONLY; ES-GURU isolated chat).
  agents.cg = {
    id: "cg",
    displayName: "CG",
    role: "Cephalon Ghost",
    section: "specters",
    tagline: "Warframe helper — seated specter, READ-ONLY by default.",
    status: "seated",
    access: "READ-ONLY",
  };
  agents["es-guru"] = {
    id: "es-guru",
    displayName: "ES-GURU",
    role: "Elder Scrolls Guide",
    section: "specters",
    tagline: "MW/OBL game-play lane, isolated chat.",
    status: "seated",
    access: "isolated chat",
  };

  // Shadow council per 00_SHADOW_COUNCIL/00_README.md: SHADOW AUDITOR +
  // TIMELORD dormant. COURRIER is the ratified B-Bolt seat — its shadow card
  // is derived in buildState() from the b-bolt seat data.
  agents["shadow-auditor"] = {
    id: "shadow-auditor",
    displayName: "SHADOW AUDITOR",
    role: "Shadow Council",
    section: "shadow",
    tagline: "Standing fishhook — fresh-context drift audit.",
    status: "dormant",
    access: "read-only by charter",
  };
  agents.timelord = {
    id: "timelord",
    displayName: "TIMELORD",
    role: "Shadow Council",
    section: "shadow",
    tagline: "Record keeper of the permanent record.",
    status: "dormant",
    access: "read-only by charter",
  };

  return agents;
}

/** Merge rule: config.agents[id] overrides/defaults; unknown ids added as-is. */
function mergeAgents(defaults) {
  const config = hubAgents();
  const out = {};
  for (const [id, d] of Object.entries(defaults)) {
    const c = config.agents[id] || {};
    out[id] = {
      id,
      displayName: c.displayName || d.displayName,
      role: c.role || d.role,
      section: c.section || d.section,
      tagline: c.tagline || d.tagline,
      status: c.status || d.status,
      access: c.access !== undefined ? c.access : d.access,
    };
  }
  for (const [id, c] of Object.entries(config.agents)) {
    if (out[id]) continue; // already merged above
    out[id] = {
      id,
      displayName: c.displayName || id,
      role: c.role || "AGENT",
      section: c.section || "council",
      tagline: c.tagline || "",
      status: c.status || "unknown",
      access: c.access || "",
    };
  }
  return out;
}

/** Major milestones from MILESTONES.md PART 2 registry (status Complete / Active Target). */
function parseMajorMilestones() {
  const md = safeRead(MILESTONES_FILE);
  const out = [];
  if (!md) return out;
  for (const line of md.split(/\r?\n/)) {
    const idMatch = line.match(/^\|\s*\*\*M([\d.]+)\*\*/);
    if (!idMatch) continue;
    const parts = line.split("|").map(s => s.trim());
    const statusCell = parts[4] || "";
    if (/Complete/.test(statusCell) || /Active Target/.test(statusCell)) {
      out.push(`M${idMatch[1]}`);
    }
  }
  return out;
}

/**
 * GHOST-HUB-009: calendar GOALS — the same MILESTONES.md registry rows
 * parseMajorMilestones reads (status Complete / Active Target), carried as
 * { id, title, status } for the hub calendar surface. Title/status come from
 * the bold `**...**` cell content (no fabricated data — raw registry truth).
 */
function parseCalendarGoals() {
  const md = safeRead(MILESTONES_FILE);
  const out = [];
  if (!md) return out;
  for (const line of md.split(/\r?\n/)) {
    const idMatch = line.match(/^\|\s*\*\*M([\d.]+)\*\*/);
    if (!idMatch) continue;
    const parts = line.split("|").map(s => s.trim());
    const statusCell = parts[4] || "";
    if (!/Complete/.test(statusCell) && !/Active Target/.test(statusCell)) continue;
    const bold = (cell) => {
      const m = cell.match(/\*\*([^*]+)\*\*/);
      return m ? m[1].trim() : cell.replace(/\*\*/g, "").trim();
    };
    out.push({
      id: `M${idMatch[1]}`,
      title: bold(parts[2] || ""),
      status: bold(statusCell),
    });
  }
  return out;
}

/**
 * GHOST-HUB-009: calendar ACCOMPLISHMENTS — the sealed leaf codes per seat
 * from the ledger (the same seatSeals source the roster carries), shaped as
 * { seat, title }. No fabricated titles — the seal code is the title.
 */
function parseCalendarAccomplishments() {
  const out = [];
  for (const code of Object.keys(SEAT_DIR_MAP)) {
    for (const seal of seatSeals(code)) {
      out.push({ seat: code, title: seal });
    }
  }
  return out.sort((a, b) => a.seat.localeCompare(b.seat) || a.title.localeCompare(b.title));
}

/**
 * GHOST-HUB-009: live-read of the local graveyard mirror (LEGACY/Graveyard).
 * Tombstones/ holds the permanent purge records (filename pattern
 * 00_YYYY-MM-DD_*.md); H1 is parsed as the title, the filename date as the
 * date, and the first non-heading line as the summary. Purgatory/ exists
 * alongside as pending staging — noted when present. Read-only; never throws
 * (a missing mirror returns an honest empty note).
 */
function readGraveyard(dirOverride) {
  const root = dirOverride || GRAVEYARD_DIR;
  const tombsDir = path.join(root, "Tombstones");
  let files = null;
  try {
    files = fs.readdirSync(tombsDir);
  } catch (e) {
    return { tombstones: [], note: "no graveyard mirror present" };
  }
  const tombstones = files
    .filter(f => /\.md$/i.test(f))
    .map(f => {
      const m = f.match(/^(\d{2})_(\d{4}-\d{2}-\d{2})_(.+)\.md$/i);
      const date = m ? m[2] : "";
      const body = safeRead(path.join(tombsDir, f)) || "";
      const h1 = body.match(/^#\s+(.+)$/m);
      const title = h1 ? h1[1].trim() : f.replace(/\.md$/i, "").replace(/[-_]/g, " ");
      const summary = (body.split(/\r?\n/).find(l => l.trim() && !l.trim().startsWith("#")) || "").trim();
      return { file: f, title, date, summary };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.file.localeCompare(b.file));
  const hasPurgatory = fs.existsSync(path.join(root, "Purgatory"));
  const out = { tombstones };
  if (hasPurgatory) out.note = "Purgatory/ present (pending staging)";
  return out;
}

/** Sealed leaf codes per seat from the ledger: <SEAT>/<date>/*-TASK.md + *-REPORT.md. */
function seatSeals(seatCode) {
  const dirName = SEAT_DIR_MAP[seatCode] || seatCode.toUpperCase();
  const seatDir = path.join(LEDGER_DIR, dirName);
  const seals = new Set();
  let files = [];
  try {
    const dateDirs = fs.readdirSync(seatDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);
    for (const dateDir of dateDirs) {
      try {
        files = files.concat(fs.readdirSync(path.join(seatDir, dateDir)));
      } catch (e) { /* skip unreadable date dir */ }
    }
  } catch (e) {
    // no entry in the ledger for this seat — empty seals
  }
  const SUFFIXES = ["-TASK.md", "-REPORT.md", "_TASK.md", "_REPORT.md"];
  for (const f of files) {
    for (const suffix of SUFFIXES) {
      if (f.endsWith(suffix)) {
        seals.add(f.slice(0, -suffix.length));
        break;
      }
    }
  }
  return Array.from(seals).sort();
}

function buildAgents() {
  return mergeAgents(defaultAgents());
}

// HCG arrangement (GHOST-HUB-005, Drew ruling 2026-09-20): WASH hero first,
// then Wake (direct format driver), then Stone (shoots after Wake's plan),
// XP last (self-guided, isolated). Unknown/future ids append at the end.
const COUNCIL_ORDER = ["wash", "0-wake", "1-stone", "x-xp"];

function buildState() {
  const tkManifestMd = safeRead(TK_MANIFEST_FILE);
  const tkManifest = parseTKManifest(tkManifestMd);
  const agents = buildAgents();
  const majorMilestones = parseMajorMilestones();

  // Sectioned views — council / specters / shadow come from the merged sections.
  // GHOST-HUB-009 ruling reversal (Drew 2026-09-21): the shadow-section agents
  // (shadow-auditor, timelord) are carried in /state.shadow as their dormant
  // seats. They stay OUT of council and OUT of roster — .shadow is their only
  // lane. (This reverses the GHOST-HUB-003 "shadow hidden" ruling of 2026-09-20.)
  const council = [];
  const specters = [];
  const shadow = [];

  for (const a of Object.values(agents)) {
    if (a.section === "shadow") {
      shadow.push(a); // GHOST-HUB-009: dormant shadow seats emitted in /state.shadow
      continue; // shadow seats never enter council/specters
    }
    if (a.section === "specters") specters.push(a);
    else if (a.section === "council") council.push(a); // section-locked: roster agents never land here
  }

  // Council order — Drew's HCG arrangement (WASH hero → Wake → Stone → XP);
  // unknown/future ids append at the end, stable sort.
  council.sort((a, b) => {
    const ia = COUNCIL_ORDER.indexOf(a.id);
    const ib = COUNCIL_ORDER.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // Roster — every VISIBLE agent, bearing seals (per seat) + major milestones + level.
  const roster = [];
  for (const a of Object.values(agents)) {
    if (a.section === "shadow") continue; // GHOST-HUB-009: shadow lives only in /state.shadow — no roster rows
    const seals = SEAT_DIR_MAP[a.id] ? seatSeals(a.id) : [];
    roster.push({
      id: a.id,
      displayName: a.displayName,
      role: a.role,
      section: a.section,
      status: a.status,
      tagline: a.tagline,
      access: a.access,
      seals,
      majorMilestones,
      level: seals.length + majorMilestones.length,
    });
  }

  // GHOST-HUB-009: calendar surface — goals (MILESTONES registry), seals-led
  // accomplishments, and an HONEST-empty timeSpent: there is no TIMEKEEPER
  // data source yet (TIMEKEEPER.md does not exist; TIMEKEEPER-001 never
  // executed). No fabricated time data — the note states the truth.
  const calendar = {
    goals: parseCalendarGoals(),
    accomplishments: parseCalendarAccomplishments(),
    timeSpent: [],
    timeSpentNote: "no TIMEKEEPER data yet (TIMEKEEPER-001 not executed)",
  };

  return {
    ok: true,
    council,
    specters,
    shadow,
    roster,
    tkManifest,
    calendar,
    serverTime: new Date().toISOString(),
    port: PORT,
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

function handleSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-store",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(": connected\n\n");

  const heartbeat = setInterval(() => {
    try {
      res.write(`: heartbeat ${new Date().toISOString()}\n\n`);
    } catch (e) {
      clearInterval(heartbeat);
    }
  }, 2000); // GHOST-HUB-001-REPAIR: 2s keepalive — 15s outran the suite's 5s window

  req.on("close", () => {
    clearInterval(heartbeat);
  });
}

function drainBody(req, maxBytes, cb) {
  let body = "";
  let tooBig = false;
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    body += chunk;
    if (Buffer.byteLength(body, "utf8") > maxBytes) {
      tooBig = true;
      req.destroy();
    }
  });
  req.on("end", () => cb(tooBig, body));
}

/** Discovered while building: opencode JSON events carry the session id in `properties.sessionID` (exact WASH/server.js helper). */
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

/**
 * Seated opencode agent map, derived at request time from .opencode/agents/*.md
 * stems. Unknown/seated-specter codes are NOT on the map → 400.
 */
function seatedAgentMap() {
  // GHOST-HUB-008: WASH owns its own agent file (.opencode/agents/wash.md) —
  // the 0-wake alias is GONE. Wash resolves via the directory scan below.
  const map = {};
  let codes = [];
  try {
    codes = fs.readdirSync(AGENTS_DIR)
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(/\.md$/, ""));
  } catch (e) {
    /* agents dir missing — no seats resolve */
  }
  for (const code of codes) {
    if (!map[code]) map[code] = code;
  }
  return map;
}

function handleChat(req, res) {
  drainBody(req, 1024 * 1024, (tooBig, body) => {
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

    const requestedAgent = typeof parsed.agent === "string" ? parsed.agent.trim() : "";
    const agentCode = requestedAgent ? seatedAgentMap()[requestedAgent] : null;
    if (!agentCode) {
      return sendJson(res, 400, {
        error: "agent " + (requestedAgent || "(missing)") + " has no seated opencode agent file",
      });
    }

    const sessionId =
      typeof parsed.sessionId === "string" && parsed.sessionId.trim()
        ? parsed.sessionId.trim()
        : null;

    const title = agentCode.toUpperCase() + ": " + message.slice(0, 40);
    const args = ["run", "--agent", agentCode, "--format", "json", "--auto", "--title", title];
    if (sessionId) args.push("--continue", "--session", sessionId);
    args.push(message);

    let child;
    try {
      // Sandtrap law: spawn-safe (ignore/pipes, hidden window, 10-min kill-point).
      child = spawnSafe(OPENCODE_BIN, args, { cwd: ROOT, timeoutMs: 600000 });
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
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      });
      console.log(
        `[GHOST HUB] chat started pid=${child.pid} agent=${agentCode} session=${sessionSeen || sessionId || "new"}`,
      );
    });

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
      if (!started) {
        try {
          sendJson(res, 500, { error: "opencode exited before spawn (exit " + code + ")" });
        } catch (e) {
          /* already responded */
        }
        return;
      }
      try {
        // Final session=<sid> line when a session was seen (continue pattern).
        res.end(sessionSeen ? "\nsession=" + sessionSeen : "");
      } catch (e) {
        /* already closed */
      }
      console.log(
        `[GHOST HUB] chat exit=${code || 0}${signal ? " signal=" + signal : ""}${
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

function handleSpawn(req, res) {
  drainBody(req, 1024 * 1024, (tooBig, body) => {
    if (tooBig) return sendJson(res, 400, { error: "body too large" });
    let parsed = {};
    try {
      parsed = JSON.parse(body || "{}");
    } catch (e) {
      return sendJson(res, 400, { error: "invalid JSON body" });
    }
    const bin = typeof parsed.bin === "string" ? parsed.bin.trim() : "";
    const args = Array.isArray(parsed.args) ? parsed.args.filter(a => typeof a === "string") : [];
    const timeoutMs = typeof parsed.timeoutMs === "number" && parsed.timeoutMs > 0 ? parsed.timeoutMs : 600000;
    const cwd = typeof parsed.cwd === "string" && parsed.cwd.trim() ? parsed.cwd.trim() : ROOT;

    if (!bin) {
      return sendJson(res, 400, { error: "bin must be a non-empty string" });
    }

    let child;
    try {
      child = spawnSafe(bin, args, { cwd, timeoutMs });
    } catch (e) {
      return sendJson(res, 500, { error: "failed to spawn: " + e.message });
    }

    let stdout = "";
    let stderr = "";
    let exited = false;

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("error", (err) => {
      if (exited) return;
      exited = true;
      try {
        sendJson(res, 500, { error: "spawn error: " + err.message });
      } catch (e) { /* already responded */ }
    });

    // Single response — sent ONCE, on child close, with stdout/stderr/exitCode.
    child.on("close", (code, signal) => {
      if (exited) return;
      exited = true;
      try {
        sendJson(res, 200, {
          ok: true,
          spawned: true, // GHOST-HUB-001-REPAIR: original 001 test contract
          pid: child.pid,
          agent: parsed.agent || "unknown",
          exitCode: code,
          signal: signal,
          stdout: stdout.slice(0, 5000),
          stderr: stderr.slice(0, 5000),
        });
      } catch (e) { /* already responded */ }
    });
  });
}

function startServer(opts = {}) {
  const { port = PORT } = opts;
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
      if (pathname === "/graveyard") return sendJson(res, 200, readGraveyard()); // GHOST-HUB-009
      if (pathname === "/events") return handleSSE(req, res);
      if (pathname === "/tk-manifest") {
        const md = safeRead(TK_MANIFEST_FILE);
        if (md) {
          res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "no-store" });
          res.end(md);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("TK Manifest not found");
        }
        return;
      }
      const asset = STATIC_FILES[pathname];
      if (asset) return sendFile(res, asset.file, asset.mime);
    }
    if (req.method === "POST" && pathname === "/chat") return handleChat(req, res);
    if (req.method === "POST" && pathname === "/spawn") return handleSpawn(req, res);

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("not found");
  });

  server.listen(port, HOST, () => {
    console.log(`[GHOST HUB] listening on http://${HOST}:${port}`);
  });
  return server;
}

module.exports = {
  ROOT,
  HOST,
  PORT,
  TK_MANIFEST_FILE,
  buildState,
  startServer,
  resolveOpencode,
  extractSessionId,
  readGraveyard, // GHOST-HUB-009: exported for the missing-mirror never-throw test
};

if (require.main === module) {
  const server = startServer();
  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}