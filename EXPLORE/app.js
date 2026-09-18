const ICONS = {
  pencil: "<path d=\"M4 20l.9-4.4L16.2 4.3a2.2 2.2 0 0 1 3.1 0l.4.4a2.2 2.2 0 0 1 0 3.1L8.4 19.1 4 20z\"/><path d=\"M13.5 7l3.5 3.5\"/>",
  gem: "<path d=\"M7 3h10l4 5-9 13L3 8l4-5z\"/><path d=\"M3 8h18M9.5 8l2.5 13M14.5 8l-2.5 13\"/>",
  compass: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M15.5 8.5l-2.2 4.8L8.5 15.5l2.2-4.8 4.8-2.2z\"/>",
  logbook: "<path d=\"M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z\"/><path d=\"M8 20V8h10M8 12h7M8 16h7\"/>",
  dice: "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"9\" r=\"1\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"15\" r=\"1\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"9\" r=\"1\" fill=\"currentColor\" opacity=\"0.4\"/>",
  vault: "<path d=\"M5 21V8a7 7 0 0 1 14 0v13H5z\"/><circle cx=\"12\" cy=\"11\" r=\"2.5\"/><path d=\"M12 13.5V17\"/>",
  streams: "<path d=\"M3 6c3 0 3 3 6 3s3-3 6-3 3 3 6 3M3 12c3 0 3-3 6-3s3 3 6 3 3-3 6-3M3 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3\"/>",
  blueprint: "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 7h8M8 11h8M8 15h5\"/>",
  folio: "<path d=\"M6 4h12v16H6z\"/><path d=\"M9 8h6M9 12h6M9 16h4\"/>",
  pad: "<rect x=\"5\" y=\"4\" width=\"14\" height=\"16\" rx=\"2\"/><path d=\"M9 9h6M9 13h6M12 17h.01\"/>",
  wheel: "<circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 4v3M12 17v3M4 12h3M17 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1\"/>",
  seedling: "<path d=\"M12 21v-7\"/><path d=\"M12 14C12 8 12 5 6 5c0 6 0 9 6 9zM12 11c0-4.5 2-7 6-7 0 4.5-2 7-6 7z\"/>",
  stack: "<path d=\"M5 8l7 3 7-3-7-3-7 3z\"/><path d=\"M5 12l7 3 7-3M5 16l7 3 7-3\"/>",
  shard: "<path d=\"M8 3h8l3 16-5 2-2-7-3 5-3-2L8 3z\"/><path d=\"M8.5 17l3-7 3 5\"/>",
  leaf: "<path d=\"M6 20C6 11 10 5 19 5c0 9-6 13-13 15z\"/><path d=\"M6 20c3-6 7-10 11-12\"/>",
  anvil: "<path d=\"M5 17h14v3H5z\"/><path d=\"M7 17c0-3 2-4.5 5-5V9H8V6h9v3h-4v3c3 .5 5 2 5 5\"/>",
  stone: "<path d=\"M7 5h10l3 6-3 8H7l-3-8 3-6z\"/><path d=\"M4 11h16M9 11l-1 8M15 11l1 8\"/>",
};

function glyph(name, extraAttrs) {
  const attrs = extraAttrs || "";
  return `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${ICONS[name] || ICONS.stone}</svg>`;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function timeAgo(iso) {
  if (!iso) return "never";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function fmtLocal(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function topEls(sel) {
  return {
    loading: document.getElementById("loading"),
    mapBoard: document.getElementById("map-board"),
    padsRow: document.getElementById("pads-row"),
    footer: document.getElementById("footer"),
    gitPill: document.getElementById("git-pill"),
    clockPill: document.getElementById("clock-pill"),
  };
}

function seedStars() {
  const svg = document.querySelector(".starfield");
  svg.setAttribute("viewBox", "0 0 1440 900");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  let dots = "";
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1440;
    const y = Math.random() * 900;
    const r = 0.5 + Math.random() * 1.1;
    const o = 0.15 + Math.random() * 0.5;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#e8b943" opacity="${o.toFixed(2)}"/>`;
  }
  svg.innerHTML = dots;
}

function renderRegions(domain, els) {
  const board = els.mapBoard;
  board.innerHTML = "";
  const regions = domain.regions;

  function regionEl(r) {
    const el = document.createElement("section");
    el.className = `region ${r.id}${r.id === "engine" ? " last" : ""}`;
    let subHtml = "";
    if (r.subs && r.subs.length) {
      subHtml = `<div class="region-subs">${r.subs.map((s) => `<span class="sub-node">${glyph(s.icon)}${esc(s.name)}</span>`).join("")}</div>`;
    }
    let stoneHtml = "";
    if (r.stone > 0) {
      stoneHtml = `<div class="stone-pile" title="not-for-people files (json / infra)">${glyph("stone")} ${r.stone} stone</div>`;
    }
    const gridHtml = r.id === "games" ? `<div class="parcel-grid"></div>` : "";
    el.innerHTML = `
      <div class="region-head">${glyph(r.icon)}<h2>${esc(r.label)}</h2></div>
      <div class="region-path">${esc(r.path)}</div>
      ${subHtml}
      ${gridHtml}
      ${stoneHtml}`;
    return el;
  }

  const columns = {
    games: "games",
    engine: "engine",
    designs: "designs",
    logs: "logs",
    vault: "vault",
  };

  for (const r of regions) {
    board.appendChild(regionEl(r));
  }

  const gamesRegion = board.querySelector(".region.games .parcel-grid");
  for (const p of domain.parcels) {
    const btn = document.createElement("button");
    btn.className = `parcel state-${p.state}${p.priority ? ` state-${p.priority}` : ""}${p.icon === "wheel" ? " wheel-parcel" : ""}`;
    const iconClass = p.icon === "wheel" ? "wheel-glyph" : "";
    const wheelStyle = p.icon === "wheel" ? ' style="color:#e8b943"' : "";
    btn.innerHTML = `
      <span class="glyph ${iconClass}"${wheelStyle}>${ICONS[p.icon] || ICONS.stone}</span>
      <div class="p-name">${esc(p.name)}</div>
      <div class="p-meta">${esc(p.state)}${p.priority ? " · " + esc(p.priority) : ""}</div>
      <div class="p-path">${esc(p.rel)}</div>`;
    btn.addEventListener("click", () => openOverlay(p, domain));
    gamesRegion.appendChild(btn);
  }
}

function renderPads(pads, els) {
  const row = els.padsRow;
  row.innerHTML = "";
  for (const p of pads) {
    const card = document.createElement("div");
    card.className = "pad-card";
    card.innerHTML = `${glyph(p.icon)}
      <div>
        <div class="p-title">${esc(p.label)}</div>
        <div class="p-when">${esc(p.file)} · ${timeAgo(p.mtime)}</div>
      </div>`;
    row.appendChild(card);
  }
}

function renderChrome(domain, els) {
  const g = domain.git;
  if (g.hasCommits) {
    els.gitPill.innerHTML = `<span class="stone-dot"></span> ${esc(g.shortHash)}${g.dirtyCount ? " · " + g.dirtyCount + " pending" : ""}`;
    els.gitPill.title = `${g.subject} (${g.date})`;
  } else {
    els.gitPill.innerHTML = `<span class="stone-dot"></span> no commits yet — repo freshly staged`;
  }
  els.clockPill.textContent = fmtLocal(domain.generatedAt);
  els.footer.innerHTML = [
    `domain refreshed ${timeAgo(domain.generatedAt)}`,
    `${domain.regions.length} regions`,
    `${domain.parcels.length} parcels`,
    "◼ stone = json / infra — not for people",
    "EXPLORE v0.5 — read-only gate",
  ].map((x) => `<span>${esc(x)}</span>`).join("");
}

let currentOverlay = null;

function openOverlay(p, domain) {
  closeOverlay();
  const backdrop = document.createElement("div");
  backdrop.className = "overlay-backdrop";
  backdrop.style.zIndex = "30";
  const card = document.createElement("div");
  card.className = "overlay-card";

  const metaLines = [
    `state: ${p.state}${p.priority ? " · " + p.priority : ""}`,
    `${p.rawName}`,
    `${p.rel}`,
    `touched ${timeAgo(p.mtime)}`,
  ];

  card.innerHTML = `
    <button class="overlay-close" aria-label="close">✕</button>
    <div class="overlay-head"><span class="glyph" style="${p.icon === "wheel" ? "color:#e8b943" : ""}">${ICONS[p.icon] || ICONS.stone}</span><h2>${esc(p.name)}</h2></div>
    <div class="overlay-meta">${metaLines.map((l) => `${esc(l)}<br/>`).join("")}</div>
    <div id="overlay-body"></div>`;

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
  currentOverlay = { backdrop, card };

  card.querySelector(".overlay-close").addEventListener("click", closeOverlay);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeOverlay();
  });

  const body = card.querySelector("#overlay-body");
  if (p.icon === "wheel" || (p.priority === "MAIN")) {
    loadGates(body, card);
  } else {
    body.innerHTML = `<div class="tape-wrapper">
      <span class="tape">UNDER CONSTRUCTION</span>
      <div class="tape-note">Test operations for this parcel are not wired yet. Placeholder expectations only — reasons for the gap will be surfaced in a later pass, per the Test-Ops reach ruling.</div>
    </div>`;
  }
}

function loadGates(body, card) {
  body.innerHTML = `<div class="gates-block"><div class="gates-verdict away">running sealing gates…</div></div>`;
  fetch("/api/gates")
    .then((r) => r.json())
    .then((res) => renderGates(body, res))
    .catch(() => {
      body.innerHTML = `<div class="gates-block"><div class="gates-verdict away">gate runner unreachable</div></div>`;
    });
}

function renderGates(body, res) {
  let verdict = "";
  if (res.state === "ok") {
    const cls = res.overall ? "sealed" : "leak";
    const label = res.overall
      ? `${glyph("gem")} AIRSEALED — all gates green`
      : `${glyph("shard")} LAB LEAK — one or more gates failed`;
    verdict = `<div class="gates-verdict ${cls}">${label}</div>`;
  } else {
    verdict = `<div class="gates-verdict away">${glyph("stone")} runner ${esc(res.state)}</div>
      <div class="gate-run-meta">${esc(res.reason || "")}</div>`;
  }

  const gateList = (res.gates || [])
    .map(
      (g) => `<div class="gate"><div class="g-head"><span class="g-badge ${g.pass ? "pass" : "fail"}">${g.pass ? "PASS" : "FAIL"}</span>${esc(g.title)}</div>
        ${g.details.length ? `<div class="g-details">${g.details.map((d) => `· ${esc(d)}`).join("<br/>")}</div>` : ""}</div>`,
    )
    .join("");

  const runMeta =
    res.state === "ok"
      ? `<div class="gate-run-meta">${res.gates.length} gates · ${res.durationMs}ms · exit ${res.exitCode} · ${timeAgo(res.stamp)}</div>`
      : `<div class="gate-run-meta">via bun run lab:verify · Lotus_Adversity_Game</div>`;

  body.innerHTML = `<div class="gates-block">
    ${verdict}
    ${res.state === "ok" ? gateList : ""}
    <button class="gate-repair">↻ RE-RUN GATES</button>
    ${runMeta}
  </div>`;

  body.querySelector(".gate-repair").addEventListener("click", () => {
    body.querySelector(".gates-block").innerHTML = `<div class="gates-block"><div class="gates-verdict away">running sealing gates…</div></div>`;
    fetch("/api/gates?re=1")
      .then((r) => r.json())
      .then((res2) => renderGates(body, res2))
      .catch(() => {});
  });
}

function closeOverlay() {
  if (currentOverlay) {
    currentOverlay.backdrop.remove();
    currentOverlay = null;
  }
}

function renderDomain(domain) {
  const els = topEls();
  els.loading.hidden = true;
  els.mapBoard.hidden = false;
  els.padsRow.hidden = false;
  renderRegions(domain, els);
  renderPads(domain.pads, els);
  renderChrome(domain, els);
}

function boot() {
  seedStars();
  document.getElementById("brand-icon").innerHTML = glyph("pencil");
  fetch("/api/domain")
    .then((r) => r.json())
    .then(renderDomain)
    .catch(() => {
      const els = topEls();
      els.loading.textContent = "LEDGER UNREACHABLE — start EXPLORE/server.js";
    });

  const es = new EventSource("/events");
  es.addEventListener("domain", (e) => {
    try {
      renderDomain(JSON.parse(e.data));
    } catch (err) {
      /* keep last render */
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });
}

boot();