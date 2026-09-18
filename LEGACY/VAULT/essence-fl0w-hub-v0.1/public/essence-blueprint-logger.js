/**
 * ============================================================================
 * ESSENCE FL0W HUB - BLUEPRINT LOGGER COMPONENT (v0.2 Refined)
 * Directive: [SYSTEM: DIRECTOR-OMEGA]
 * Architecture: Isolated Vanilla JS IIFE / ES6 Module
 * Target Wrapper: #essence-blueprint-logger
 * Design: Compact, mobile-first summary cards with drill-down accordions
 * ============================================================================
 */

(function (global) {
  'use strict';

  const LOGGER_ID = 'essence-blueprint-logger';
  const STYLE_ID = 'essence-blueprint-logger-styles';

  const SCOPED_CSS = `
#${LOGGER_ID} {
  --ebl-bg: #070a13;
  --ebl-surface: #0c1220;
  --ebl-surface-card: #101828;
  --ebl-border: rgba(56, 189, 248, 0.28);
  --ebl-border-gold: rgba(245, 158, 11, 0.35);
  --ebl-cyan: #38bdf8;
  --ebl-gold: #fbbf24;
  --ebl-emerald: #34d399;
  --ebl-rose: #f43f5e;
  --ebl-text: #f1f5f9;
  --ebl-muted: #94a3b8;
  --ebl-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --ebl-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: max(10px, env(safe-area-inset-top, 0px)) max(12px, env(safe-area-inset-right, 0px)) max(12px, env(safe-area-inset-bottom, 0px)) max(12px, env(safe-area-inset-left, 0px));
  background: var(--ebl-bg);
  color: var(--ebl-text);
  font-family: var(--ebl-font-sans);
  font-size: 13px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
}

#${LOGGER_ID} *,
#${LOGGER_ID} *::before,
#${LOGGER_ID} *::after {
  box-sizing: border-box;
}

#${LOGGER_ID} .ebl-panel {
  width: 100%;
  max-width: 100%;
  background: var(--ebl-surface);
  border: 1px solid var(--ebl-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.6);
}

#${LOGGER_ID} .ebl-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid var(--ebl-border);
}

#${LOGGER_ID} .ebl-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

#${LOGGER_ID} .ebl-rune {
  font-family: var(--ebl-font-mono);
  font-size: 16px;
  color: var(--ebl-cyan);
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
}

#${LOGGER_ID} .ebl-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #f8fafc;
  font-family: var(--ebl-font-mono);
}

#${LOGGER_ID} .ebl-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

#${LOGGER_ID} .ebl-btn {
  appearance: none;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.9);
  color: var(--ebl-text);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-family: var(--ebl-font-mono);
  cursor: pointer;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  touch-action: manipulation;
  transition: all 0.15s ease;
}

#${LOGGER_ID} .ebl-btn:hover {
  background: rgba(30, 41, 59, 0.95);
  border-color: var(--ebl-cyan);
  color: #ffffff;
}

#${LOGGER_ID} .ebl-btn-primary {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.4);
  color: var(--ebl-cyan);
  font-weight: 600;
}

#${LOGGER_ID} .ebl-body-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Overview Summary Bento Cards */
#${LOGGER_ID} .ebl-grid-overview {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 640px) {
  #${LOGGER_ID} .ebl-grid-overview {
    grid-template-columns: 1fr 1fr;
  }
}

#${LOGGER_ID} .ebl-summary-card {
  padding: 12px;
  background: var(--ebl-surface-card);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

#${LOGGER_ID} .ebl-summary-card-gold {
  border-color: rgba(245, 158, 11, 0.25);
}

#${LOGGER_ID} .ebl-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

#${LOGGER_ID} .ebl-card-title {
  font-family: var(--ebl-font-mono);
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
}

#${LOGGER_ID} .ebl-badge {
  font-size: 10px;
  font-family: var(--ebl-font-mono);
  padding: 2px 7px;
  border-radius: 9999px;
  border: 1px solid currentColor;
}

#${LOGGER_ID} .ebl-badge-cyan {
  color: var(--ebl-cyan);
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.35);
}

#${LOGGER_ID} .ebl-badge-gold {
  color: var(--ebl-gold);
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
}

#${LOGGER_ID} .ebl-card-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

#${LOGGER_ID} .ebl-pill {
  font-size: 10px;
  font-family: var(--ebl-font-mono);
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  color: #cbd5e1;
  white-space: nowrap;
}

#${LOGGER_ID} .ebl-pill.warn {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fda4af;
  background: rgba(244, 63, 94, 0.1);
}

#${LOGGER_ID} .ebl-drill-btn {
  appearance: none;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(15, 23, 42, 0.7);
  color: var(--ebl-cyan);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-family: var(--ebl-font-mono);
  cursor: pointer;
  width: 100%;
  text-align: center;
  min-height: 36px;
  touch-action: manipulation;
  transition: all 0.15s ease;
}

#${LOGGER_ID} .ebl-drill-btn:hover {
  background: rgba(56, 189, 248, 0.12);
  border-color: var(--ebl-cyan);
}

#${LOGGER_ID} .ebl-drill-btn-gold {
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--ebl-gold);
}

#${LOGGER_ID} .ebl-drill-btn-gold:hover {
  background: rgba(245, 158, 11, 0.12);
  border-color: var(--ebl-gold);
}

/* Collapsible Detailed Sections */
#${LOGGER_ID} .ebl-detailed-wrap {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

#${LOGGER_ID} .ebl-detailed-wrap.is-open {
  display: flex;
}

#${LOGGER_ID} details.ebl-item-accordion {
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 6px;
  background: rgba(10, 15, 26, 0.8);
  overflow: hidden;
}

#${LOGGER_ID} details.ebl-item-accordion[open] {
  border-color: var(--ebl-border);
}

#${LOGGER_ID} details.ebl-item-accordion.gold[open] {
  border-color: var(--ebl-border-gold);
}

#${LOGGER_ID} summary.ebl-item-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  background: rgba(15, 23, 42, 0.9);
  font-family: var(--ebl-font-mono);
  font-size: 11.5px;
  font-weight: 600;
  min-height: 38px;
  touch-action: manipulation;
  list-style: none;
}

#${LOGGER_ID} summary.ebl-item-summary::-webkit-details-marker {
  display: none;
}

#${LOGGER_ID} .ebl-item-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

#${LOGGER_ID} .ebl-item-arrow {
  font-size: 10px;
  color: var(--ebl-muted);
  transition: transform 0.2s ease;
}

#${LOGGER_ID} details[open] .ebl-item-arrow {
  transform: rotate(90deg);
}

#${LOGGER_ID} .ebl-item-detail {
  padding: 8px 12px;
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  font-size: 11.5px;
  background: #060911;
}

#${LOGGER_ID} .ebl-code-block {
  margin-top: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  background: #020408;
  border: 1px solid rgba(51, 65, 85, 0.6);
  font-family: var(--ebl-font-mono);
  font-size: 10px;
  color: #7dd3fc;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

#${LOGGER_ID} .ebl-footer-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(8, 12, 22, 0.95);
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  font-family: var(--ebl-font-mono);
  font-size: 10.5px;
  color: var(--ebl-muted);
}
`;

  const TEMPLATE_HTML = `
<div class="ebl-panel" role="region" aria-label="Essence Blueprint Logger">
  <!-- Header -->
  <header class="ebl-header">
    <div class="ebl-title-group">
      <span class="ebl-rune" aria-hidden="true">ᛉ ᛏ</span>
      <h2 class="ebl-title">ARCHITECTURAL BLUEPRINTS & INVARIANTS</h2>
    </div>
    <div class="ebl-controls">
      <button type="button" class="ebl-btn ebl-btn-primary" id="ebl-btn-copy-raw">
        <span>📋 Copy Specs</span>
      </button>
    </div>
  </header>

  <!-- Content -->
  <div class="ebl-body-container">
    
    <!-- Compact Summary Grid (Shows high-level status first) -->
    <div class="ebl-grid-overview">
      
      <!-- Card A: Pr0sis Mobile -->
      <div class="ebl-summary-card">
        <div class="ebl-card-head">
          <div class="ebl-card-title">
            <span style="color:var(--ebl-cyan)">●</span>
            <span>PR0SIS Mobile Health</span>
          </div>
          <span class="ebl-badge ebl-badge-cyan">6 FIXES ACTIVE</span>
        </div>

        <div class="ebl-card-pills">
          <span class="ebl-pill warn">viewport-fit=cover</span>
          <span class="ebl-pill warn">100dvh searchbar</span>
          <span class="ebl-pill">touch-action</span>
          <span class="ebl-pill">retina DPR 2x</span>
          <span class="ebl-pill">audio unlock</span>
          <span class="ebl-pill warn">overflow-x:hidden</span>
        </div>

        <button type="button" class="ebl-drill-btn" id="ebl-toggle-section-a">
          ▼ Toggle 6 Pr0sis Mobile Fixes
        </button>
      </div>

      <!-- Card B: Journeys Unto v2 -->
      <div class="ebl-summary-card ebl-summary-card-gold">
        <div class="ebl-card-head">
          <div class="ebl-card-title">
            <span style="color:var(--ebl-gold)">●</span>
            <span>JOURNEYS UNTO v2</span>
          </div>
          <span class="ebl-badge ebl-badge-gold">4 PILLARS</span>
        </div>

        <div class="ebl-card-pills">
          <span class="ebl-pill">Fixed dt (1/60s)</span>
          <span class="ebl-pill">Origin (0,0) Scene</span>
          <span class="ebl-pill" style="color:#6ee7b7;border-color:rgba(16,185,129,0.4)">Kinematic ES-Module (Aider Online)</span>
          <span class="ebl-pill">Prologue Chronicle</span>
        </div>

        <button type="button" class="ebl-drill-btn ebl-drill-btn-gold" id="ebl-toggle-section-b">
          ▼ Toggle 4 Blueprint Pillars
        </button>
      </div>

    </div>

    <!-- Collapsible Drill-Down A: PR0SIS Items -->
    <div class="ebl-detailed-wrap" id="ebl-wrap-a">
      <div style="font-family:var(--ebl-font-mono);font-size:11px;color:var(--ebl-cyan);padding:2px 4px;font-weight:600">
        PR0SIS INDIVIDUAL MOBILE SPECIFICATIONS:
      </div>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>1. Viewport Meta-Tag & Safe Area Scale</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">CRITICAL</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Enforce viewport-fit=cover and dynamic safe area padding to prevent notch and home indicator clipping.</p>
          <div class="ebl-code-block">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"&gt;
padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);</div>
        </div>
      </details>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>2. Dynamic Viewport Height (100dvh)</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">INSPECTION</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Eliminate canvas jumps when mobile browser address bars expand/collapse during scroll.</p>
          <div class="ebl-code-block">min-height: 100vh; min-height: 100dvh; max-width: 100vw; overflow-x: hidden;</div>
        </div>
      </details>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>3. Touch-Action & 300ms Delay Elimination</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">LATENCY</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Eliminate double-tap zoom delay on mobile WebKit and ensure minimum 44x44px touch targets.</p>
          <div class="ebl-code-block">touch-action: manipulation; min-width: 44px; min-height: 44px;</div>
        </div>
      </details>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>4. High-DPI Canvas Retina Scaling (DPR)</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">RENDERING</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Scale canvas backing store dimensions by devicePixelRatio (capped at 2.0x) while keeping CSS style width at 100%.</p>
          <div class="ebl-code-block">const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
canvas.width = Math.floor(rect.width * dpr);
canvas.height = Math.floor(rect.height * dpr);
ctx.scale(dpr, dpr);</div>
        </div>
      </details>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>5. WebAudio Mobile Touch Unlock Guard</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">AUDIO</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Resume suspended AudioContext on first user touch gesture to comply with mobile autoplay policies.</p>
          <div class="ebl-code-block">const unlock = () => { if (audioCtx.state === 'suspended') audioCtx.resume(); };
window.addEventListener('touchstart', unlock, { once: true });</div>
        </div>
      </details>

      <details class="ebl-item-accordion">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>6. Root Overflow-x Reset & Container Math</span>
          </span>
          <span class="ebl-badge ebl-badge-cyan">LAYOUT</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Clamp body and canvas wrapper to 100vw boundary with strict box-sizing: border-box.</p>
          <div class="ebl-code-block">html, body { width: 100%; max-width: 100vw; overflow-x: hidden; margin: 0; box-sizing: border-box; }</div>
        </div>
      </details>
    </div>

    <!-- Collapsible Drill-Down B: JOURNEYS UNTO Items -->
    <div class="ebl-detailed-wrap" id="ebl-wrap-b">
      <div style="font-family:var(--ebl-font-mono);font-size:11px;color:var(--ebl-gold);padding:2px 4px;font-weight:600">
        JOURNEYS UNTO V2 ARCHITECTURAL PILLARS:
      </div>

      <details class="ebl-item-accordion gold">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>1. Fixed-Timestep Simulation Loop (Accumulator)</span>
          </span>
          <span class="ebl-badge ebl-badge-gold">LOOP</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Deterministic fixed dt (1/60s) updates with render interpolation alpha.</p>
          <div class="ebl-code-block">accumulator += Math.min(frameTime, 0.25);
while (accumulator >= FIXED_DT) { update(FIXED_DT); accumulator -= FIXED_DT; }
render(accumulator / FIXED_DT);</div>
        </div>
      </details>

      <details class="ebl-item-accordion gold">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>2. World Origin Scene Graph & Entity Registry</span>
          </span>
          <span class="ebl-badge ebl-badge-gold">SCENE</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Entity-Component registry rooted at (0, 0) with camera viewport tracking.</p>
          <div class="ebl-code-block">Entity: { id: string, pos: Vec2, vel: Vec2, bounds: AABB }
Camera.lookAt(player.pos, lerpFactor = 0.1);</div>
        </div>
      </details>

      <details class="ebl-item-accordion gold" open>
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>3. Pure ES-Module Kinematic Physics Controller</span>
          </span>
          <span class="ebl-badge" style="color:#6ee7b7;background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4)">AIDER ONLINE</span>
        </summary>
        <div class="ebl-item-detail">
          <div style="margin-bottom:6px;padding:6px 8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:4px;color:#a7f3d0;font-size:11px">
            ✨ <strong>DIRECTIVE:</strong> Create pure ES-module kinematic physics controller. Zero side-effects, deterministic mass-drag Newton-Euler integration, and normalized input abstraction.
          </div>
          <p style="margin:0;color:var(--ebl-muted)">Pure ES module kinematic physics: mass inertia, drag deceleration coefficient, 8-way vector normalization, and unified Keyboard + Gamepad + Touch inputs.</p>
          <div class="ebl-code-block">// Pure ES-Module Kinematic Physics Step
export class KinematicPhysicsController {
  step(state, input, dt) {
    const mag = Math.hypot(input.x, input.y);
    const normX = mag > 0 ? input.x / mag : 0;
    const normY = mag > 0 ? input.y / mag : 0;
    // a = F_input / mass - drag * v
    state.vx += ((normX * accel) / mass) * dt;
    state.vy += ((normY * accel) / mass) * dt;
    state.vx *= Math.exp(-friction * dt);
    state.vy *= Math.exp(-friction * dt);
    state.x += state.vx * dt; state.y += state.vy * dt;
    return state;
  }
}</div>
        </div>
      </details>

      <details class="ebl-item-accordion gold">
        <summary class="ebl-item-summary">
          <span class="ebl-item-left">
            <span class="ebl-item-arrow">▶</span>
            <span>4. Prologue Dialogue & Narrative Engine</span>
          </span>
          <span class="ebl-badge ebl-badge-gold">AUDIO</span>
        </summary>
        <div class="ebl-item-detail">
          <p style="margin:0;color:var(--ebl-muted)">Typewriter dialogue with pentatonic WebAudio rune chimes and state transition hooks.</p>
          <div class="ebl-code-block">Chronicle.streamText({ text: '...', cadenceMs: 35, onComplete: () => director.transition('IN_GAME') });</div>
        </div>
      </details>
    </div>

  </div>

  <!-- Footer -->
  <footer class="ebl-footer-bar">
    <div>Repo: <code style="color:var(--ebl-cyan)">drewslaydon-maker/Essence-Designs</code></div>
    <div id="ebl-status-timestamp">Director OMEGA: Active Invariant Guard</div>
  </footer>
</div>
`;

  const EssenceBlueprintLogger = {
    _mounted: false,
    _container: null,

    initStyles: function () {
      if (document.getElementById(STYLE_ID)) return;
      const styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      styleEl.textContent = SCOPED_CSS;
      document.head.appendChild(styleEl);
    },

    mount: function (target) {
      if (this._mounted && document.getElementById(LOGGER_ID)) {
        return document.getElementById(LOGGER_ID);
      }
      this.initStyles();

      let targetEl = null;
      if (typeof target === 'string') {
        targetEl = document.querySelector(target);
      } else if (target instanceof HTMLElement) {
        targetEl = target;
      }

      const container = document.createElement('div');
      container.id = LOGGER_ID;
      container.innerHTML = TEMPLATE_HTML;

      if (targetEl) {
        targetEl.appendChild(container);
      } else {
        document.body.appendChild(container);
      }

      this._container = container;
      this._mounted = true;
      this._bindEvents();
      return container;
    },

    unmount: function () {
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
      this._mounted = false;
      this._container = null;
    },

    _bindEvents: function () {
      if (!this._container) return;

      const toggleA = this._container.querySelector('#ebl-toggle-section-a');
      const wrapA = this._container.querySelector('#ebl-wrap-a');
      const toggleB = this._container.querySelector('#ebl-toggle-section-b');
      const wrapB = this._container.querySelector('#ebl-wrap-b');
      const copyBtn = this._container.querySelector('#ebl-btn-copy-raw');

      if (toggleA && wrapA) {
        toggleA.addEventListener('click', () => {
          const isOpen = wrapA.classList.toggle('is-open');
          toggleA.textContent = isOpen ? '▲ Hide Pr0sis Fixes' : '▼ Toggle 6 Pr0sis Mobile Fixes';
        });
      }

      if (toggleB && wrapB) {
        toggleB.addEventListener('click', () => {
          const isOpen = wrapB.classList.toggle('is-open');
          toggleB.textContent = isOpen ? '▲ Hide Blueprint Pillars' : '▼ Toggle 4 Blueprint Pillars';
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const raw = `=== ESSENCE FL0W HUB ARCHITECTURAL BLUEPRINTS ===
Repository: drewslaydon-maker/Essence-Designs

SECTION A: PR0SIS MOBILE FIXES
1. Viewport Meta-Tag (<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">)
2. 100dvh Mobile Search Bar Fix (min-height: 100dvh; max-width: 100vw; overflow-x: hidden)
3. Touch-Action 300ms Delay (touch-action: manipulation; min 44x44px targets)
4. Canvas Retina DPR (scale backing store by Math.min(devicePixelRatio, 2.0))
5. WebAudio Mobile Touch Unlock (audioCtx.resume() on touchstart)
6. Root Overflow Reset (html, body { max-width: 100vw; overflow-x: hidden; })

SECTION B: JOURNEYS UNTO V2
1. Fixed-Timestep Loop (60 FPS accumulator with render alpha interpolation)
2. World Origin (0,0) Scene Graph & Entity-Component Registry
3. Kinematic Character Controller (8-way normalized vector, lerp dampening)
4. Prologue Dialogue Engine (Typewriter cadence with WebAudio chimes)
`;
          navigator.clipboard.writeText(raw).then(() => {
            const prev = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => { copyBtn.innerHTML = prev; }, 2000);
          });
        });
      }
    }
  };

  global.EssenceBlueprintLogger = EssenceBlueprintLogger;

  if (typeof document !== 'undefined') {
    const handleReady = () => {
      const el = document.querySelector('[data-auto-mount="essence-blueprint-logger"]');
      if (el) EssenceBlueprintLogger.mount(el);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleReady);
    } else {
      handleReady();
    }
  }

})(typeof window !== 'undefined' ? window : this);
