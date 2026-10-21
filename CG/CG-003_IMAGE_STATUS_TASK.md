# CG-003 — MULTIMODAL IMAGE PASTING & CEPHALON STATUS ANIMATION

- **Seat:** DOER (`1-Stone`)
- **Planner:** `0-Wake`
- **Date:** 2026-10-14
- **Lane:** Lean Lane (`01_OPERATING_CORE.md` §13) — one user-visible capability, report ≤ 15 lines, existing suites green + 2 new oracles (`A4`, `A5`).

---

## 1. Objective

Upgrade **Cephalon Ghost (`CG/`)** with native **multimodal image pasting/viewing** and an **animated top-right Cephalon status indicator** (`LIVE` / `THINKING` / `WAITING`):
1. **Multimodal Image Support:** Drew can paste screenshots directly into chat (`Ctrl+V`) or drag/select image files. Images show as thumbnails in a staging tray before sending, render as interactive cards in the message stream, can be clicked to open in a full-resolution dark lightbox modal, and are forwarded to Gemini 3.8 Flash via `inlineData` parts so the agent can inspect gameplay screenshots (RimWorld colonies, Warframe builds, market trades).
2. **Cephalon Status Animation:** Replace plain text with a prominent, Cephalon-themed animated orb in the top header displaying real-time states:
   - **`LIVE` (Ready / Ambient):** Purple & gold breathing glow with slow rotating outer ring.
   - **`THINKING` (Active):** High-energy dual-ring spinning orbit and gold flare while Gemini is calculating.
   - **`WAITING` (Waiting / Error / Key Missing):** Amber/orange pulsing beacon.
3. **Loop & Payload Fixes:** Increase chat request body limit to 20 MB, fix Gemini function-response role formatting (`role: 'function'`), and prevent empty-turn fallback overwrites.

---

## 2. Scope Lock (Named Targets Only)

Touch **ONLY** the following files:
1. `CG/console-server.js` *(EDIT — 20MB body limit on chat, multimodal image parsing + inlineData payload, function response role fix)*
2. `CG/app.html` *(EDIT — clipboard paste listener, attachment tray, lightbox modal, animated Cephalon header orb with LIVE/THINKING/WAITING states)*
3. `CG/console.test.js` *(EDIT — keep all 78 existing assertions green + add oracles `A4` and `A5`)*

**Forbidden paths (do not touch):** `CG/derived/dock.json`, `CG/baked/FIELDS.json`, `CG/baked/trade.log.json`, `CG/dock.html`, `CG/dock.test.js`, `WASH/*`, `ED/*`.

---

## 3. Exact Specifications

### 3.1 `CG/console-server.js`

1. **Body Size Ceiling:**
   - In `pathname === '/api/agent/chat'`, increase `readJsonBody` max limit from `131072` (128 KB) to `20971520` (20 MB) to allow high-resolution base64 screenshots.
2. **Multimodal Image Parsing & History:**
   - Parse optional `images` array from `req` body: `[{ mimeType: string, data: string }]`.
   - Sanitize each image: strip any leading `data:image/...;base64,` prefix from `data`, ensure `mimeType` defaults to `image/png` if unspecified.
   - When saving history (`writeHistory`), store `images` on user message object:
     ```json
     { "role": "user", "text": "...", "images": [{ "mimeType": "image/png", "data": "..." }], "ts": "..." }
     ```
3. **Gemini GenerateContent Payload Construction:**
   - When building `contents` in `runGeminiAgentTurn`:
     - If the turn contains `images`, add `inlineData` part for each image:
       ```javascript
       const userParts = [];
       if (Array.isArray(turnImages)) {
         for (const img of turnImages) {
           if (img && img.data) {
             userParts.push({
               inlineData: {
                 mimeType: img.mimeType || 'image/png',
                 data: String(img.data).replace(/^data:image\/[a-z]+;base64,/i, '')
               }
             });
           }
         }
       }
       userParts.push({ text: messageText || '(attached image)' });
       ```
4. **Function Response Role Correction:**
   - In the tool execution loop: when appending tool results back to `contents`, use `role: 'function'` (per Gemini REST specification):
     ```javascript
     contents.push({ role: 'function', parts: responseParts });
     ```
   - Ensure `responseParts` uses `{ functionResponse: { name: fc.name, response: result } }`.
5. **Tool Fallback Hygiene:**
   - Only set `'Done — executed: ' + ...` if `finalReply` is empty and at least one tool call was executed. If `finalReply` contains model text, preserve model text.

### 3.2 `CG/app.html`

1. **Animated Cephalon Status Orb (Top Header):**
   - Insert status widget in header (top right, left of KEY badge):
     ```html
     <div id="agentStatusWidget" class="agent-status-widget status-live" title="Agent Status: LIVE">
       <div class="orb-container">
         <span class="orb-ring ring-outer"></span>
         <span class="orb-ring ring-inner"></span>
         <span class="orb-core"></span>
       </div>
       <span id="agentStatusBadge" class="agent-status-badge">LIVE</span>
     </div>
     ```
   - CSS styling:
     - Obsidian & gold/purple palette matching Cephalon theme.
     - `.status-live`: purple core (`#5a359c`) with gold breathing glow (`#d4af37`), outer ring rotates slowly (`spin 12s linear infinite`).
     - `.status-thinking`: bright golden core flare (`#f3cf55`), dual rings rotate in opposite directions (`spin 1.2s linear infinite`, `spin-reverse 0.9s linear infinite`), vibrant pulse glow.
     - `.status-waiting`: amber core pulse (`#f5a623`), stationary rings with slow warning fade.
   - JS helper: `setAgentStatus(state, label)` where `state` is `'live'` | `'thinking'` | `'waiting'`.
     - Idle / Ready -> `setAgentStatus('live', 'LIVE')`.
     - While chat is sending -> `setAgentStatus('thinking', 'THINKING')`.
     - Key missing / error / offline -> `setAgentStatus('waiting', 'WAITING')` or `'ERROR'`.
2. **Image Pasting & File Selection:**
   - Add `paste` listener on `document` and `#chatInput`:
     - If clipboard contains image items (`item.type.startsWith('image/')`), read via `FileReader` as DataURL.
     - Add to in-memory staging array `pendingImages: [{ mimeType, data }]`.
     - Render thumbnail preview chips inside an `#imageTray` above `#chatInput`.
   - Add a file upload button `[+ IMG]` beside `#sendBtn` with hidden `<input type="file" id="imageFileInput" accept="image/*" multiple>` so Drew can either paste or browse files.
   - Each thumbnail chip has a close button `[×]` to remove before sending.
   - Clear `#imageTray` upon sending.
3. **Chat Stream Rendering:**
   - When rendering messages with `images`: display responsive image thumbnail cards (`.chat-img-thumb`).
   - Clicking any thumbnail opens the Lightbox Modal.
4. **Lightbox Modal Viewer:**
   - Full-window modal overlay (`#lightboxModal`) with centered image preview, dimensions/size hint, and `[CLOSE]` button or click-anywhere-to-close (`Esc` key supported).

### 3.3 `CG/console.test.js`

Add oracles `A4` and `A5` at the end of the test run:
- **`A4` (Multimodal Payload Structure):** POST `/api/agent/chat` with `{ message: "recon capture", images: [{ mimeType: "image/png", data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" }] }` returns 400 with missing key guard (verifying multimodal payload parsed and validated cleanly before API key check).
- **`A5` (20 MB Body Ceiling):** POST `/api/agent/chat` with a payload of ~250 KB does not get rejected with HTTP 400 "body too large" (confirming the 128 KB ceiling was lifted to 20 MB).

---

## 4. Definition of Done (DoD)

1. `CG/console-server.js` accepts up to 20 MB payloads on `/api/agent/chat` and properly formats `inlineData` image parts for Gemini API.
2. `CG/app.html` allows pasting images (`Ctrl+V`), shows pending attachment thumbnails, renders image cards in chat, includes full-size lightbox viewer, and displays the animated Cephalon status orb (`LIVE` / `THINKING` / `WAITING`).
3. All 78 existing assertions in `CG/console.test.js` pass, plus new oracles `A4` and `A5` pass (80+ total).
4. `CG/dock.test.js` continues to pass 61/61.
5. Report written to `CG/CG-003_REPORT.md` (≤ 15 lines).
