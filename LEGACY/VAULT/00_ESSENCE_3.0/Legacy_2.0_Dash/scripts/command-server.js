const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Paths to files
const MILESTONES_PATH = path.resolve("C:\\Users\\Andrew\\Projects\\ESSENCE_DESIGNS\\DOCS\\MILESTONES.md");
const STATE_PATH = path.resolve("C:\\Users\\Andrew\\Projects\\ESSENCE_DESIGNS\\00_ESSENCE_CORE\\INFRA\\dashboard-state.json");
const ROOT_KILL_PATH = path.resolve("C:\\Users\\Andrew\\Projects\\.agent_kill");
const INFRA_KILL_PATH = path.resolve("C:\\Users\\Andrew\\Projects\\ESSENCE_DESIGNS\\00_ESSENCE_CORE\\INFRA\\.kill");

let activeProcesses = [];
let isKilled = fs.existsSync(ROOT_KILL_PATH) || fs.existsSync(INFRA_KILL_PATH);
let buildStatus = { status: "IDLE", lastRun: null, logs: "" };
let healthStatus = { status: "IDLE", lastRun: null, logs: "" };

const DEFAULT_DELIVERABLES = [
  { id: "deliv1", text: "Deconstruct and modularize the-fracture-playtest.tsx", checked: true },
  { id: "deliv2", text: "Extract 5 dedicated React modal components into components/", checked: true },
  { id: "deliv3", text: "Establish SVG ProsisBlackHoleLogo with orbital animation", checked: true },
  { id: "deliv4", text: "Implement optional chaining and defensive GTL radar math loops", checked: true },
  { id: "deliv5", text: "Update build-html.js build pipeline to auto-sync index.html", checked: true },
  { id: "deliv6", text: "Execute Trello sync to mirror local status", checked: false },
  { id: "deliv7", text: "Deliver playable Prosis playtest package to Phil", checked: false }
];

// Helper to read and write state
function readState() {
  try {
    if (fs.existsSync(STATE_PATH)) {
      const content = fs.readFileSync(STATE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to read state:", e);
  }
  writeState(DEFAULT_DELIVERABLES);
  return DEFAULT_DELIVERABLES;
}

function writeState(state) {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write state:", e);
  }
}

// MD Parser for Objective & Milestones
function parseMilestonesMD() {
  const result = {
    objective: "Active sprint objective could not be parsed.",
    milestones: []
  };

  if (!fs.existsSync(MILESTONES_PATH)) {
    return result;
  }

  try {
    const md = fs.readFileSync(MILESTONES_PATH, "utf-8");
    const lines = md.split(/\r?\n/);

    let inObjective = false;
    let objLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("PART 1: CURRENT ACTIVE SPRINT OBJECTIVE") || line.includes("PART 1")) {
        inObjective = true;
        continue;
      }
      if (inObjective) {
        if (line.trim().startsWith("---") || (line.startsWith("##") && !line.includes("PART 1") && !line.startsWith("###"))) {
          break;
        }
        objLines.push(line);
      }
    }
    if (objLines.length > 0) {
      result.objective = objLines.join("\n").trim();
    }

    let inRegistry = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("PART 2: STUDIO MILESTONE REGISTRY") || line.includes("PART 2")) {
        inRegistry = true;
        continue;
      }
      if (inRegistry) {
        if (line.trim().startsWith("---") || (line.startsWith("##") && !line.includes("PART 2"))) {
          inRegistry = false;
          continue;
        }
        
        const cols = line.split("|").map(col => col.trim());
        if (cols.length >= 6) {
          const id = cols[1].replace(/\*/g, "").trim();
          const title = cols[2].replace(/\*/g, "").trim();
          const target = cols[3].replace(/\*/g, "").trim();
          const statusRaw = cols[4].trim();
          const exitCondition = cols[5].replace(/\*/g, "").trim();

          // Skip header and divider rows
          if (id && id !== "ID" && !id.startsWith("---") && !id.startsWith("milestone")) {
            let isComplete = statusRaw.toLowerCase().includes("complete") || statusRaw.includes("Complete");
            let isActive = statusRaw.toLowerCase().includes("active") || statusRaw.includes("Active");
            let isOnDeck = statusRaw.toLowerCase().includes("deck") || statusRaw.includes("On Deck");
            let isBroken = statusRaw.toLowerCase().includes("broken") || statusRaw.includes("Broken");
            
            let statusText = "Pending";
            if (isComplete) statusText = "Complete";
            else if (isActive) statusText = "Active Target";
            else if (isOnDeck) statusText = "On Deck";
            else if (isBroken) statusText = "Broken";

            result.milestones.push({
              id,
              title,
              target,
              statusRaw,
              statusText,
              exitCondition,
              isComplete,
              isActive
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("MD Parsing failed:", e);
  }

  return result;
}

// Git Status utility
function getGitStatus() {
  try {
    const gitStatus = execSync("git status --porcelain", { timeout: 3000 }).toString().trim();
    if (gitStatus.length === 0) {
      return { isClean: true, files: [], summary: "Workspace Git is completely clean." };
    } else {
      const files = gitStatus.split("\n").map(f => f.trim());
      return {
        isClean: false,
        files: files,
        summary: `${files.length} uncommitted file(s) detected.`
      };
    }
  } catch (e) {
    return { isClean: false, files: [], error: true, summary: "Failed to check Git status." };
  }
}

// Safe exec helper to track active processes
function trackExec(cmd, cwd, onComplete) {
  const proc = exec(cmd, { cwd }, (err, stdout, stderr) => {
    activeProcesses = activeProcesses.filter(p => p !== proc);
    onComplete(err, stdout, stderr);
  });
  activeProcesses.push(proc);
  return proc;
}

// ------------------- API ROUTES -------------------

// 1. Core Status Endpoint
app.get("/api/status", (req, res) => {
  const mdData = parseMilestonesMD();
  const deliverables = readState();
  const gitStatus = getGitStatus();

  res.json({
    currentObjective: mdData.objective,
    milestones: mdData.milestones,
    deliverables: deliverables,
    pulse: {
      git: gitStatus,
      build: buildStatus,
      health: healthStatus,
      isKilled: isKilled,
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed,
      nodeVersion: process.version,
      platform: process.platform,
      serverTime: new Date().toISOString()
    }
  });
});

// 2. Deliverables Update (Check/Uncheck)
app.post("/api/deliverables", (req, res) => {
  if (isKilled) return res.status(403).json({ error: "System is in emergency halt." });

  const { id, checked } = req.body;
  if (!id) return res.status(400).json({ error: "Missing deliverable ID" });

  let state = readState();
  const idx = state.findIndex(item => item.id === id);
  if (idx !== -1) {
    state[idx].checked = !!checked;
    writeState(state);
    return res.json({ success: true, updated: state[idx] });
  }

  res.status(404).json({ error: "Deliverable not found" });
});

// 3. Add Custom Deliverable
app.post("/api/deliverables/add", (req, res) => {
  if (isKilled) return res.status(403).json({ error: "System is in emergency halt." });

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Deliverable text is required" });

  let state = readState();
  const newItem = {
    id: "custom_" + Date.now(),
    text: text.trim(),
    checked: false
  };
  state.push(newItem);
  writeState(state);
  res.json({ success: true, item: newItem });
});

// 4. Delete Deliverable
app.post("/api/deliverables/delete", (req, res) => {
  if (isKilled) return res.status(403).json({ error: "System is in emergency halt." });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing deliverable ID" });

  let state = readState();
  const filtered = state.filter(item => item.id !== id);
  if (filtered.length !== state.length) {
    writeState(filtered);
    return res.json({ success: true });
  }

  res.status(404).json({ error: "Deliverable not found" });
});

// 5. Build HTML Trigger POST
app.post("/api/build", (req, res) => {
  if (isKilled) return res.status(403).json({ error: "System is in emergency halt." });

  buildStatus.status = "BUILDING";
  buildStatus.logs = "Starting 'node build-html.js'...\n";
  
  const prosisDir = path.resolve("C:\\Users\\Andrew\\Projects\\ESSENCE_DESIGNS\\GAME_DEV\\02_PROSIS");

  trackExec("node build-html.js", prosisDir, (err, stdout, stderr) => {
    buildStatus.lastRun = new Date().toISOString();
    if (err) {
      buildStatus.status = "FAILED";
      buildStatus.logs += `ERROR:\n${err.message}\n\nSTDERR:\n${stderr}\n\nSTDOUT:\n${stdout}`;
      console.error("Build failed:", err);
    } else {
      buildStatus.status = "SUCCESS";
      buildStatus.logs += `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
      console.log("Build completed successfully.");
    }
  });

  res.json({ success: true, status: "BUILD_STARTED" });
});

// 6. Project Health Check Trigger POST
app.post("/api/healthcheck", (req, res) => {
  if (isKilled) return res.status(403).json({ error: "System is in emergency halt." });

  healthStatus.status = "RUNNING";
  healthStatus.logs = "Running workspace health check diagnostics...\n";

  const infraDir = path.resolve("C:\\Users\\Andrew\\Projects\\ESSENCE_DESIGNS\\00_ESSENCE_CORE\\INFRA");

  trackExec("node scripts/healthcheck.js", infraDir, (err, stdout, stderr) => {
    healthStatus.lastRun = new Date().toISOString();
    if (err) {
      healthStatus.status = "FAILED";
      healthStatus.logs += `DIAGNOSTICS ENCOUNTERED ERRORS:\n${err.message}\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
    } else {
      healthStatus.status = "SUCCESS";
      healthStatus.logs += `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
    }
  });

  res.json({ success: true, status: "HEALTHCHECK_STARTED" });
});

// 7. Emergency Kill Switch POST
app.post("/api/kill", (req, res) => {
  console.log("⚠️ ⚠️ EMERGENCY KILL SWITCH ACTIVATED! HALTING SYSTEM... ⚠️ ⚠️");
  isKilled = true;

  try {
    fs.writeFileSync(ROOT_KILL_PATH, "EMERGENCY HALT TRIGGERED ON " + new Date().toISOString() + "\n", "utf-8");
    fs.writeFileSync(INFRA_KILL_PATH, "EMERGENCY HALT TRIGGERED ON " + new Date().toISOString() + "\n", "utf-8");
    console.log("✔ Kill marker files written to workspace.");
  } catch (e) {
    console.error("Failed to write kill markers:", e);
  }

  console.log(`Killing ${activeProcesses.length} active child processes...`);
  activeProcesses.forEach((proc, index) => {
    try {
      proc.kill("SIGKILL");
      console.log(`[✔] Terminated child process #${index + 1} (PID: ${proc.pid})`);
    } catch (e) {
      console.error(`Failed to terminate process PID ${proc.pid}:`, e);
    }
  });
  activeProcesses = [];

  res.json({
    success: true,
    message: "EMERGENCY RECOVERY TRIGGERED. ALL SYSTEM RUNTIMES SHUT DOWN. KILL STACK PLANTED."
  });

  setTimeout(() => {
    console.log("Shutting down command server process.");
    process.exit(1);
  }, 1000);
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`   ESSENCE MOBILE COMMAND SERVER ACTIVE              `);
  console.log(`   URL: http://localhost:${PORT}                      `);
  console.log(`   Local Server Status: [ONLINE]                     `);
  console.log(`====================================================`);
});
