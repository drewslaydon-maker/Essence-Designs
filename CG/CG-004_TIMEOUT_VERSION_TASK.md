# CG-004 — GEMINI TIMEOUT RESILIENCE, IMAGE OPTIMIZATION & V1.0.0 STAMP

- **Seat:** DOER (`1-Stone`)
- **Planner:** `0-Wake`
- **Date:** 2026-10-14
- **Lane:** Lean Lane (`01_OPERATING_CORE.md` §13) — one user-visible capability / fix package, report ≤ 15 lines, existing suites green + new oracles (`A7`, `A8`).

---

## 1. Objective & Diagnosis

During live testing with Warframe account status syncing and screenshots, Cephalon Ghost encountered a `SYSTEM ERROR: Gemini request timed out`. Drew also directed applying an official version (`v1.0.0`) as CG is now Drew's verified daily-driver companion.

### Diagnosis
1. **45s Hard Timeout (`CG/console-server.js:618`):** `callGeminiGenerateContent` hardcoded `timeout: 45000`. Multimodal vision processing of Warframe screenshots + tool execution on Gemini 3.8 Flash routinely exceeds 45 seconds under network jitter or vision tokenization load.
2. **History Bloat / Image Re-uploading (`CG/console-server.js:667`):** `history.slice(-24)` re-included raw base64 `inlineData` for *all* images in the last 24 turns. Each subsequent message re-sent prior multi-megabyte screenshots, exploding payload sizes and triggering timeouts.
3. **Uncompressed Raw PNGs (`CG/app.html:998`):** Clipboard pasting reads full uncompressed PNGs (4–10 MB).
4. **No Retry Logic:** A single transient network hiccup causes an immediate unrecoverable failure.

---

## 2. Scope Lock (Named Targets Only)

Touch **ONLY** the following 4 files:
1. `CG/console-server.js` *(EDIT — 120s timeout, 1-retry with backoff, history image pruning, version exposure)*
2. `CG/app.html` *(EDIT — v1.0.0 branding, canvas downscaling/compression on paste/upload, chat retry button on error)*
3. `CG/electron-main.js` *(EDIT — v1.0.0 window title)*
4. `CG/console.test.js` *(EDIT — fix A1 mode brittleness, add A7 version oracle, add A8 timeout oracle)*

**Forbidden paths (do not touch):** `CG/derived/dock.json`, `CG/baked/*`, `CG/dock.html`, `CG/dock.test.js`, `WASH/*`, `ED/*`.

---

## 3. Exact Specifications

### 3.1 `CG/console-server.js`

1. **Version Constant & State Exposure:**
   - Define `const CG_VERSION = '1.0.0';` near the top of `console-server.js`.
   - In `getAgentState(...)`, include `version: CG_VERSION` in the returned object.
2. **120-Second Timeout & Auto-Retry:**
   - In `callGeminiGenerateContent`, increase `timeout` from `45000` to `120000` (120,000 ms = 2 minutes).
   - Implement a 1-retry fallback for transient network errors / timeouts: if the initial call fails due to `timeout` or HTTP 503/429, wait 1500 ms and attempt a single retry before rejecting.
3. **Historical Image Pruning (Prevent History Bloat):**
   - In `runGeminiAgentTurn`, when building `contents` from `history.slice(-24)`:
     - For the **immediate turn** (the user message being executed right now), attach all provided images as `inlineData` parts.
     - For **older past turns in history**, do *not* re-send full base64 `inlineData`. Instead, if `h.images` was present, append a lightweight text summary part: `[Attached image analyzed in prior turn]`. This preserves conversational continuity without re-uploading 10+ MB of stale base64 data on every chat message.

### 3.2 `CG/app.html`

1. **v1.0.0 Branding:**
   - Update `<title>`: `<title>CEPHALON GHOST v1.0.0 — Personal Gaming Agent</title>`.
   - Update `.brand-title`: `<div class="brand-title">CEPHALON GHOST v1.0.0 // PERSONAL AGENT</div>`.
2. **Client-Side Image Optimization:**
   - When an image is pasted (`handlePaste`) or selected (`handleFileSelect`), optimize oversized bitmaps using an off-screen `<canvas>` before storing in `stagedImages`:
     - If `image.naturalWidth > 1920` or `image.naturalHeight > 1920`: scale down proportionally so the max dimension is 1920px.
     - Export as `image/jpeg` with quality `0.88` (or `image/png` if original file size is under 800 KB).
     - This reduces screenshot payloads from 8 MB to ~400–700 KB while keeping game UI text, numbers, and stats completely sharp and legible for Gemini OCR.
3. **Chat Error UX & Retry Action:**
   - When an error occurs in `sendChatMessage` (status != 200 or catch block):
     - Display an inline `[RETRY]` button inside the error message element: `<button class="btn" style="margin-top:6px;font-size:11px;" onclick="retryLastChatMessage()">[ RETRY REQUEST ]</button>`.
     - Implement `retryLastChatMessage()`: re-sends the last failed message and staged images without requiring the user to re-type or re-paste.

### 3.3 `CG/electron-main.js`

1. Update window title in `createWindow()`:
   ```javascript
   title: "CEPHALON GHOST v1.0.0",
   ```

### 3.4 `CG/console.test.js`

1. **Fix `A1` Mode Brittleness:**
   - In oracle `A1`, replace the fragile check `ast.activeMode === 'rimworld'` with `typeof ast.activeMode === 'string' && Array.isArray(ast.modes) && ast.modes.includes('warframe')`. (Ensures test suite passes even if `CG/agent/config.json` was switched to `warframe` during Drew's live testing).
2. **Add Oracle `A7` (Version Reporting):**
   - Assert `ast.version === '1.0.0'`.
3. **Add Oracle `A8` (Gemini Timeout Ceiling):**
   - Inspect `console-server.js` source code or exported constants to verify `timeout: 120000` (or `GEMINI_TIMEOUT_MS >= 120000`).

---

## 4. Definition of Done (DoD)

1. `CG_VERSION = '1.0.0'` declared in `CG/console-server.js` and returned in `/api/agent/state`.
2. `CG/console-server.js` Gemini request timeout increased to 120,000 ms with single retry on transient timeout/503.
3. `CG/console-server.js` prunes stale base64 image data from older history turns when constructing Gemini `contents`.
4. `CG/app.html` displays `v1.0.0`, scales oversized pasted screenshots through canvas to ≤ 1920px max dimension, and offers an inline `[ RETRY REQUEST ]` button on errors.
5. `CG/electron-main.js` sets window title to `CEPHALON GHOST v1.0.0`.
6. `node CG/console.test.js` passes all assertions (≥ 84 passed, 0 failed).
7. `node CG/dock.test.js` passes all 61 assertions (0 regressions).
8. Report written to `CG/CG-004_REPORT.md` (≤ 15 lines).
