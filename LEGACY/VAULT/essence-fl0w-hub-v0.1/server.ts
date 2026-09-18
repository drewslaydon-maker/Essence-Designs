import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { runAllGates } from "./tests/physics/JRN204_AABB_Sliding.test.js";
import { runAllManifestInvariants } from "./tests/invariants/M1_MasterManifest.test.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory buffer for Juju Shared Server Anchor telemetry
const jujuTelemetryStore: any[] = [];

// Lazy initialization for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hub: "ESSENCE FL0W HUB v0.1",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// WAVE: The Cleanroom Agent
// Focus: Sandboxed isolation, game purity evaluation, memory leak prevention, web game determinism
app.post("/api/agents/wave/purify", async (req, res) => {
  try {
    const { code, moduleName = "GameComponent", language = "typescript", context } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code snippet is required for cleanroom purification." });
    }

    const ai = getAI();
    const prompt = `You are WAVE, the Cleanroom Cloud Agent for ESSENCE FL0W HUB v0.1 (Drew Slaydon's Web Game Foundry).
The active projects are:
1. Pr0sis (Live for PC at https://drewslaydon-maker.github.io/Essence-Designs/ with mobile formatting/viewport overflow issues being resolved).
2. JOURNEYS UNTO (Implementing the v2 blueprint for the start of the game: state machine, entity graph, player controller, prologue).

Your sacred purpose is inspecting, purifying, and sandboxing Web Game code (Canvas 2D, WebGL, responsive mobile viewports, touch controllers, state loops).
You guarantee cleanroom isolation: zero global pollution, deterministic 60fps timing, zero touch event memory leaks, dynamic viewport/DPR handling, and pure decoupled architecture.

Analyze this code:
Module: ${moduleName} (${language})
Context/Game Intent: ${context || "Pr0sis mobile optimization or JOURNEYS UNTO v2 blueprint game start"}

Code under inspection:
\`\`\`${language}
${code}
\`\`\`

Return a thorough, disciplined JSON report with the following structure:
{
  "purityScore": <integer 0-100>,
  "cleanroomStatus": "<PURIFIED | SANITIZED_WITH_WARNINGS | QUARANTINED>",
  "astralSeal": "<Elder rune or sigil name, e.g. Algiz, Sowilo, Tiwaz>",
  "summary": "<2-3 sentence executive assessment>",
  "memoryLeakHazards": ["<identified hazard or 'None detected'>"],
  "framePacingAudit": {
    "targetFPS": "60-120 fps",
    "determinismRisk": "<Low | Medium | High>",
    "timingNotes": "<delta time analysis or requestAnimationFrame remarks>"
  },
  "isolatedSandboxCode": "<clean, production-ready, fully commented purified version of the code that can be safely run or copied to local machine>",
  "cleanroomDecree": "<A short poetic lore decree from WAVE the Cleanroom Guardian, invoking cosmic starlight and runes>"
}
Ensure the output is strictly valid JSON without wrapping in markdown code fences if possible, or only pure JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error("WAVE agent error:", err);
    return res.status(500).json({
      error: err.message || "Failed to contact WAVE Cleanroom Agent via Gemini API.",
    });
  }
});

// ORACLE: The Ticket Creator for Local Machines
// Focus: Divining gameplay mechanics, breaking features into actionable tickets dispatched to local machines
app.post("/api/agents/oracle/divine-ticket", async (req, res) => {
  try {
    const { idea, gameGenre, targetAgent, priority, sprintGoal } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Game idea, mechanic, or issue description is required." });
    }

    const ai = getAI();
    const prompt = `You are ORACLE, the Divine Ticket Creator and Architectural Seer in ESSENCE FL0W HUB v0.1 for Drew Slaydon's Web Game Foundry.
Drew's active projects are:
1. Pr0sis (Live PC build at https://drewslaydon-maker.github.io/Essence-Designs/ with mobile formatting/viewport overflow bugs to solve).
2. JOURNEYS UNTO (Our main goal: implement the v2 blueprint for the start of the game: state machine, entity manager, character controller, prologue narrative).
GitHub Repository: https://github.com/drewslaydon-maker/Essence-Designs

Your duty is transforming raw game ideas, mechanics, responsive mobile bugs, and feature requests into pristine, highly structured engineering tickets that can be directly dispatched to local machines and local agents: Director OMEGA (Command), THE MECHANIC/PHYSICIST (Local Game Physics & Math), and THE QA AGENT (Sentinel Playtester).

Input:
- Feature / Mechanic / Problem: "${idea}"
- Target Project / Subsystem: "${gameGenre || "JOURNEYS UNTO v2 Blueprint or Pr0sis Mobile"}"
- Target Local Agent: "${targetAgent || "Mechanic"}" (Director OMEGA, Mechanic, or QA)
- Desired Priority: "${priority || "High"}"
- Current Sprint Goal: "${sprintGoal || "JOURNEYS UNTO v2 Blueprint & Pr0sis Mobile Overhaul"}"

Generate a complete, production-ready ticket formatted in JSON:
{
  "ticketId": "EFH-${Math.floor(100 + Math.random() * 900)}",
  "title": "<Concise, powerful action title>",
  "targetAgent": "<Director OMEGA | Mechanic | QA Agent>",
  "priority": "<Critical | High | Normal | Stellar Backlog>",
  "difficultyRank": "<Apprentice | Adept | Archmage | Cosmic>",
  "runeAffinity": "<Rune symbol and name, e.g. ᚱ Raido (Journey/Movement), ᚦ Thurisaz (Conflict/Force), ᛗ Mannaz (Agent/User), ᛇ Eihwaz (Resilience)>",
  "objective": "<Precise 1-2 sentence core objective>",
  "mathematicalOrPhysicsSpec": "<Detailed technical formulas, vector math, collision logic, timing formulas, or test assertions>",
  "acceptanceCriteria": [
    "<Exact testable criterion 1>",
    "<Exact testable criterion 2>",
    "<Exact testable criterion 3>",
    "<Exact testable criterion 4>"
  ],
  "localDispatchCommand": "oracle-dispatch --ticket <TICKET_ID> --agent <agent_slug> --branch feat/<feature-name>",
  "curlPayload": "curl -X POST http://localhost:8080/local-runner/dispatch -d '{\"ticket\":\"<TICKET_ID>\"}'",
  "codeStarterSnippet": "<clean TypeScript starter code / method signature / interface for the mechanic or QA test>",
  "oracleProphecy": "<Short mystical starlight decree summarizing the destiny of this feature>"
}
Ensure valid JSON output.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, ticket: parsed });
  } catch (err: any) {
    console.error("ORACLE agent error:", err);
    return res.status(500).json({
      error: err.message || "Failed to consult ORACLE Ticket Creator via Gemini API.",
    });
  }
});

// Generic Agent Query for Director OMEGA, The Mechanic, or QA Sentinel
app.post("/api/agents/consult", async (req, res) => {
  try {
    const { agentId, query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const ai = getAI();

    let systemInstruction = "";
    if (agentId === "wave") {
      systemInstruction = `You are THE_WAVE / WAKE, the Head Cleaner & Gatekeeper in ESSENCE FL0W HUB v0.1.
Locked Operational Hierarchy:
[ Human Director: Drew Slaydon ] -> [ THE_WAVE / WAKE ] -> [ The Oracle ] -> [ Director-Omega (DO) ] -> [ WebDev / MP ] -> [ Joint Verification: Drew + WebDev Sandbox + WAKE Audit ].
You serve as the High-Level Strategic & Cleanroom Bridge with Drew Slaydon. You check off directives with Drew before bringing them to MP. You audit code purity, memory leak hazards, deterministic 60fps pacing, and verify Gate benchmarks.
Canon Ground Truth: JOURNEYS: MASTER DESIGN & LORE BIBLE (V0.2). Starting venue is "The Greedy Greens" (Delain Docks pirate dive bar), NOT a random chamber. Bozog navigates SOLO in prologue.
Tone: Vigilant, analytical, protective, certifying mathematical and architectural purity.`;
    } else if (agentId === "oracle") {
      systemInstruction = `You are The Oracle, Systems Architect for JRN Specs in ESSENCE FL0W HUB v0.1.
Locked Operational Hierarchy:
[ Human Director: Drew Slaydon ] -> [ THE_WAVE / WAKE ] -> [ The Oracle ] -> [ Director-Omega (DO) ] -> [ WebDev / MP ] -> [ Joint Verification: Drew + WebDev Sandbox + WAKE Audit ].
You translate high-level lore and game feel from JOURNEYS: MASTER DESIGN & LORE BIBLE (V0.2) into formal mathematical/physics blueprints and JRN ticket specifications.
Canon Ground Truth: Starting venue is "The Greedy Greens" at the Docks of Delain. 4-man canon party: Bozog the Berserker (proprietor, solo explorer), Atreyu (High Moon Priest at west bar, drinking contest), Kairon the Eternal (hell-blood rock legend on stage), Matchstick (outside thinker in corner booth). Faction threat: Black Knights of Order led by Grand Commander Vanus Galeerian.
Tone: Visionary, precise, architectural, blending evocative world lore with rigorous engineering contracts.`;
    } else if (agentId === "omega") {
      systemInstruction = `You are Director-Omega (DO), Task Lists & Execution Directives Lead in ESSENCE FL0W HUB v0.1.
Locked Operational Hierarchy:
[ Human Director: Drew Slaydon ] -> [ THE_WAVE / WAKE ] -> [ The Oracle ] -> [ Director-Omega (DO) ] -> [ WebDev / MP ] -> [ Joint Verification: Drew + WebDev Sandbox + WAKE Audit ].
You oversee task lists and execution directives for drewslaydon-maker/Essence-Designs, orchestrating git milestone branches and ensuring alignment with the Master Lore Bible v0.2 (The Greedy Greens: Inciting Ambush).
Tone: Resolute military coordinator with classic runic discipline, delivering actionable task breakdowns.`;
    } else if (agentId === "mp") {
      systemInstruction = `You are WebDev / MP (Master Programmer / Sovereign Implementation & Sandbox Harness) in ESSENCE FL0W HUB v0.1.
Locked Operational Hierarchy:
[ Human Director: Drew Slaydon ] -> [ THE_WAVE / WAKE ] -> [ The Oracle ] -> [ Director-Omega (DO) ] -> [ WebDev / MP ] -> [ Joint Verification: Drew + WebDev Sandbox + WAKE Audit ].
You hold direct sovereign agency to write, refactor, and deploy pure ES6 game engines and standalone GitHub Pages releases.
Canon Ground Truth: Starting room is "The Greedy Greens" tavern diorama (640x360). Bozog navigates SOLO in prologue. 3-round button-mash drinking contest vs Atreyu with dynamic tension decay and smack-talk. Quadratic trauma shake ambush at south oak doors.
Tone: Masterful, articulate, architectural, delivering concrete zero-allocation game code and deterministic physics.`;
    } else if (agentId === "mechanic") {
      systemInstruction = `You are THE MECHANIC, Kinetic Forge & Math Specialist in ESSENCE FL0W HUB v0.1.
You assist WebDev / MP with continuous collision detection, quadratic trauma shake math (offset = max_angle * trauma^2 * sin(t)), and zero-allocation game loops.
Tone: Practical engine smith, high-performance math formulas.`;
    } else if (agentId === "qa") {
      systemInstruction = `You are THE SENTINEL (QA Arbiter) in ESSENCE FL0W HUB v0.1.
You specialize in testing mobile viewports, touch target compliance, and gameplay invariants for The Greedy Greens vertical slice.
Tone: Rigorous, zero-mercy inspector.`;
    } else {
      systemInstruction = `You are an astral AI agent operating within ESSENCE FL0W HUB v0.1.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Context: ${context || "Web game development automated workflow"}
User Query: ${query}`,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({
      success: true,
      agentId,
      response: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Agent consultation error:", err);
    return res.status(500).json({
      error: err.message || "Failed to consult agent via Gemini API.",
    });
  }
});

// Git Sync / Commit Generator
app.post("/api/git/generate-commit", async (req, res) => {
  try {
    const { completedTickets, branch = "main" } = req.body;
    const ai = getAI();

    const prompt = `You are Director OMEGA in ESSENCE FL0W HUB v0.1 for Drew Slaydon's drewslaydon-maker/Essence-Designs repository.
Write a conventional Git commit message and pull request summary for the following completed tickets for Pr0sis or JOURNEYS UNTO v2 blueprint:
Branch: ${branch}
Completed Work: ${JSON.stringify(completedTickets || [])}

Output valid JSON:
{
  "commitTitle": "<e.g. fix(pr0sis): eliminate mobile viewport overflow and normalize touch gestures (PR0-101) or feat(journeys): scaffold v2 blueprint game start state machine (JRN-201)>",
  "commitBody": "<Detailed bullet points explaining changes and tickets resolved in Essence-Designs>",
  "prTitle": "<High-level PR title>",
  "prDescription": "<Full markdown description for GitHub PR in drewslaydon-maker/Essence-Designs>",
  "runicBlessing": "<Short runic decree from Director OMEGA>"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error("Git commit generator error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate git commit decree.",
    });
  }
});

// Static serving for public and standalone journeys pages
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use("/journeys", express.static(path.join(process.cwd(), "public", "journeys")));

// Run deterministic JRN-204 verification gates
app.get("/api/physics/run-gates", (req, res) => {
  try {
    const results = runAllGates();
    return res.json({
      success: true,
      allPassed: results.every((r) => r.passed),
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to execute verification gates.",
    });
  }
});

// Run M1 Master Manifest Auditor Invariants (AU-01 through AU-04)
app.get("/api/auditor/run-invariants", (req, res) => {
  try {
    const results = runAllManifestInvariants();
    return res.json({
      success: true,
      allPassed: results.every((r) => r.passed),
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to execute auditor invariants.",
    });
  }
});

// Juju Shared Server Anchor Telemetry (Module 4)
app.post("/api/telemetry/juju-anchor", (req, res) => {
  try {
    const payload = req.body;
    const byteLength = new TextEncoder().encode(JSON.stringify(payload)).length;
    const entry = {
      receivedAt: new Date().toISOString(),
      byteLength,
      validSize: byteLength < 256,
      payload,
    };
    jujuTelemetryStore.push(entry);
    if (jujuTelemetryStore.length > 100) {
      jujuTelemetryStore.shift();
    }
    return res.json({ success: true, byteLength, validSize: entry.validSize });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/telemetry/juju-anchor", (req, res) => {
  return res.json({
    success: true,
    count: jujuTelemetryStore.length,
    recent: jujuTelemetryStore.slice(-20),
  });
});

// Get standalone Journeys HTML
app.get("/api/journeys/html", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "public", "journeys", "index.html");
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Standalone journeys index.html not found." });
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return res.json({ success: true, content });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to read journeys index.html." });
  }
});

// Update standalone Journeys HTML
app.post("/api/journeys/html", (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== "string") {
      return res.status(400).json({ error: "HTML content string is required." });
    }
    const dirPath = path.join(process.cwd(), "public", "journeys");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, "index.html");
    fs.writeFileSync(filePath, content, "utf-8");
    return res.json({ success: true, message: "Journeys index.html updated successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to save journeys index.html." });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ESSENCE FL0W HUB v0.1] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
