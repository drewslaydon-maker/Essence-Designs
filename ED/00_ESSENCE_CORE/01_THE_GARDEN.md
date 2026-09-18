# THE BEDROCK TREE / ESSENCE GARDEN

*The living, growing taxonomy of how ESSENCE DESIGNS categorizes and executes work.*

---

## 🌿 THE LEAF SYSTEM (Task & Execution Hierarchy)
The "Leaf" system is our methodology for tracking micro-tasks and execution branches. A Leaf is an actionable task package.

- **Primary Leaves (e.g., Leaf 3):** Core execution tasks that push a milestone forward. 
- **Audit/Correction Leaves (e.g., Leaf 3.5 or Leaf X-Audit):** If a primary leaf uncovers a fundamental flaw or system leak (like Leaf 3 uncovering the guardrail leak), we branch into a fractional or designated audit leaf. This acknowledges that the correction was born *out of* the primary leaf, rather than interrupting the numerical sequence.
- **Planted:** When a Leaf is completed and its code merged/verified, the Leaf is considered "Planted" in the Garden.

---

## 🌳 PLANTED LEAVES & MILESTONE ACHIEVEMENTS

### 🟢 Leaf 3: Escaping the Token Wall (Planted: 2026-08-29)
- **Objective**: Deconstruct and modularize `the-fracture-playtest.tsx` UI to bypass the 16k token limit and eliminate runtime initialization crashes.
- **Key Deliverables**:
  - Extracted 5 dedicated React modal components into `components/`: `BriefingModal.tsx`, `AchievementsModal.tsx`, `WdtModal.tsx`, `ProfileModal.tsx`, and `LeaderboardModal.tsx`.
  - Established the SVG **ProsisBlackHoleLogo** with interactive orbital letter animation (`p`, `r`, `s`, `i`, `s`).
  - Implemented optional chaining and defensive fallbacks across GTL radar math and meter mapping loops to prevent cold-launch panic crashes.
  - Updated `build-html.js` build pipeline to transpile and auto-sync `02_PROSIS/index.html` and root `index.html`.
  - Passed all 46/46 headless tests. `index.html` standalone package verified fully functional and accessible.

---

## 🎮 THE GAME NUMBERING SYSTEM (Scope & Chronology)
Game directories are prefixed with numbers (e.g., 1_BtW, 2_PROSIS). This numbering must mean something.

**The Codified Rule: The Number represents Chronological Origin / Foundation.**
- 0_: The foundational genesis project (e.g., 0_BtW should theoretically hold this spot, as it is the project that birthed the studio's ambition).
- 1_ through 99_: Sequentially numbered based on when the project was first conceived or added to the studio's active roster, *not* its current priority. 
- **Priority** is handled entirely by folder placement (ON_DECK, BROKEN, PARKED, or Root). The number is its immutable ID.

---

## 🏛️ STUDIO DISTRICTS (The Knowledge Base)
To prevent stopping game dev to hunt for or rebuild foundational knowledge, the studio is divided into operational "Districts."

1. **THE ENGINE (00_ESSENCE_CORE):** The unchangeable truth. Rules, definitions, and operational scripts. (The Bible, The Guardrails, The INFRA).
2. **THE LOGS (02_THE_LOGS/05_CAPTAINS_LOG):** The chronological history and daily reflections.
3. **THE DESIGNS (01_THE_DESIGNS/):** The architectural planning and reference districts.
   - /DISCOVERIES/: Hard-won lessons. (e.g., "Reality has the final vote", "Consoles answer questions").
   - /INFLUENCES/: Games, mechanics, media, and math that inspire our design (e.g., Mob Psycho, Balatro math, Kojima surrealism).
   - /FRAMEWORKS/: Reusable design patterns (e.g., Ways & Whys, Wants/Needs/Laws).

---

*This document is watered and maintained to ensure the studio never loses its roots.*