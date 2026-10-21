"use strict";

/* WASH — Ghost of Wake (browser client)
 * Sends messages to POST /chat, streams the ghost's reply inline,
 * stores the session id for resume, and fetches /state for the dashboard. */

(function () {
  const history = document.getElementById("history");
  const hint = document.getElementById("hint");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const stateEl = document.getElementById("state");
  const sessionPill = document.getElementById("session-pill");
  const clockPill = document.getElementById("clock-pill");

  let sessionId = null;
  let busy = false;

  /* ---------- tiny DOM/text helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s);
  }

  function addBubble(kind, meta, text) {
    const b = document.createElement("div");
    b.className = "bubble " + kind;
    if (meta) {
      const m = document.createElement("span");
      m.className = "meta";
      m.textContent = meta;
      b.appendChild(m);
    }
    const t = document.createElement("div");
    t.textContent = text;
    b.appendChild(t);
    history.appendChild(b);
    history.scrollTop = history.scrollHeight;
    return b;
  }

  /* ---------- /state dashboard ---------- */

  function renderState(data) {
    const blocks = [];
    const padText = data.pad || "";
    blocks.push(
      '<div class="state-block"><h3>PAD · excerpt</h3><pre>' +
        esc(padText.slice(0, 600)) +
        (padText.length > 600 ? "…" : "") +
        "</pre></div>",
    );
    const leaves =
      Array.isArray(data.leaves) && data.leaves.length
        ? data.leaves
            .map((l) => '<div class="leaf">' + esc(l) + "</div>")
            .join("")
        : '<div class="hint">no leaves in flight</div>';
    blocks.push('<div class="state-block"><h3>LEAVES IN FLIGHT</h3>' + leaves + "</div>");
    blocks.push(
      '<div class="state-block"><h3>CAPTAIN\'S LOG · last entry</h3><pre>' +
        esc(data.logDate || "—") +
        "</pre></div>",
    );
    stateEl.innerHTML = blocks.join("");
    sessionPill.textContent = "session: " + (sessionId ? shortId(sessionId) : "none");
    clockPill.innerHTML = '<span class="live-dot"></span> server ' + esc(data.serverTime || "—");
  }

  function shortId(id) {
    return id.length > 11 ? id.slice(0, 5) + "…" + id.slice(-5) : id;
  }

  function loadState() {
    fetch("/state")
      .then((r) => {
        if (!r.ok) throw new Error("state " + r.status);
        return r.json();
      })
      .then(renderState)
      .catch((e) => {
        stateEl.innerHTML =
          '<div class="hint">STATE UNREACHABLE — start WASH/server.js · ' + esc(e.message) + "</div>";
      });
  }

  /* ---------- /chat streaming ---------- */

  /*
   * opencode run --format json (v1.18.31) emits one JSON event per line with
   * a TOP-LEVEL sessionID on every event. Observed event types: step_start,
   * tool_use, text (part.type === "text", part.text = completion), step_finish.
   * (Discovered during WASH-001 execution; recorded in the report.)
   */
  function handleEventLine(line, ghostText) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch (e) {
      return false; // not JSON (e.g. stray stderr) — caller decides how to surface
    }
    function sid(obj) {
      if (!obj) return null;
      return typeof obj.sessionID === "string" && obj.sessionID
        ? obj.sessionID
        : typeof obj.session_id === "string" && obj.session_id
          ? obj.session_id
          : null;
    }
    const found = sid(ev) || sid(ev.properties);
    if (found && found !== sessionId) {
      sessionId = found;
      sessionPill.textContent = "session: " + shortId(sessionId);
    }

    if (ev.type === "text" && ev.part && ev.part.type === "text") {
      ghostText.textContent = ev.part.text || "";
    } else if (ev.type === "message.part.updated" && ev.part && ev.part.type === "text") {
      ghostText.textContent = ev.part.text || "";
    } else if (ev.type === "message.updated" && ev.message && Array.isArray(ev.message.parts)) {
      const text = ev.message.parts
        .filter((p) => p && p.type === "text")
        .map((p) => p.text || "")
        .join("");
      if (text) ghostText.textContent = text;
    }
    return true;
  }

  async function sendMessage(message) {
    if (busy) return;
    busy = true;
    sendBtn.disabled = true;
    input.value = "";
    document.body.classList.add("working");
    history.querySelector(".hint")?.remove();

    addBubble("you", "you", message);
    const ghost = addBubble("ghost run", "ghost · 0-wake", "");
    const ghostText = ghost.querySelector("div") || ghost;

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!res.ok) {
        let body = "";
        try {
          const j = await res.json();
          body = j.error || JSON.stringify(j);
        } catch (e) {
          body = await res.text().catch(() => "");
        }
        ghost.classList.remove("run");
        ghost.classList.add("error");
        ghostText.textContent = "ERROR " + res.status + " — " + body;
        ghost.querySelector(".meta")?.replaceChildren();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      ghost.querySelector(".meta")?.replaceChildren();
      ghost.querySelector(".meta").textContent = "ghost · 0-wake · streaming…";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl = buffer.indexOf("\n");
        while (nl !== -1) {
          const line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.trim()) handleEventLine(line, ghostText);
          nl = buffer.indexOf("\n");
        }
      }
      ghost.classList.remove("run");
      ghost.classList.add("done");
      ghost.querySelector(".meta").textContent =
        "ghost · 0-wake · done" + (sessionId ? " · session " + shortId(sessionId) : "");
    } catch (e) {
      ghost.classList.remove("run");
      ghost.classList.add("error");
      ghostText.textContent = "NETWORK ERROR — " + e.message;
      ghost.querySelector(".meta")?.replaceChildren();
    } finally {
      busy = false;
      sendBtn.disabled = false;
      document.body.classList.remove("working");
      input.focus();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message && !busy) sendMessage(message);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !busy) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });

  loadState();
})();