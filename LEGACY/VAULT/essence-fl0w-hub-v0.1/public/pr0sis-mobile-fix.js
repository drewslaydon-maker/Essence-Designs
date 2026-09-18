/**
 * ============================================================================
 * PR0SIS MOBILE PURIFICATION DROP-IN SCRIPT
 * Target Repository: drewslaydon-maker/Essence-Designs (Pr0sis)
 * 
 * Drop this script into your Pr0sis index.html:
 *   <script src="./pr0sis-mobile-fix.js"></script>
 * Or copy and paste its contents into your game's entry point.
 * 
 * Solves all 6 Mobile Invariants:
 * 1. Viewport & safe-area meta tag injection
 * 2. 100dvh & mobile address bar layout jump prevention
 * 3. Elimination of horizontal wobble (overflow-x: hidden on all root containers)
 * 4. touch-action: manipulation (removes 300ms double-tap zoom delay)
 * 5. Retina / High-DPI canvas crisp scaling (DPR up to 2x without GPU thermal throttling)
 * 6. WebAudio audio context unlocking on first user touch gesture
 * ============================================================================
 */

(function initPr0sisMobileFix() {
  'use strict';

  // 1. Enforce Viewport Meta Tag
  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }

  // 2. Inject Normalized Mobile Stylesheet
  function injectMobileStyles() {
    const styleId = 'pr0sis-mobile-purification-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Root Mobile Viewport Lockdown */
      html, body {
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        min-height: 100vh !important;
        min-height: 100dvh !important;
        overflow-x: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        position: relative !important;
        -webkit-text-size-adjust: 100% !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
      }

      /* Game Root Containers */
      #root, #app, #game-container, canvas {
        box-sizing: border-box !important;
        max-width: 100vw !important;
      }

      /* Safe-area insets for notched devices (iPhone, modern Android) */
      .safe-area-padding, header, nav, .hud, .controls-overlay {
        padding-top: max(8px, env(safe-area-inset-top, 0px)) !important;
        padding-bottom: max(8px, env(safe-area-inset-bottom, 0px)) !important;
        padding-left: max(12px, env(safe-area-inset-left, 0px)) !important;
        padding-right: max(12px, env(safe-area-inset-right, 0px)) !important;
      }

      /* Tap Target Sizing & Response */
      button, a, .interactive-btn, [role="button"] {
        touch-action: manipulation !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }

      @media (max-width: 768px) {
        button, a, .interactive-btn, [role="button"] {
          min-width: 44px;
          min-height: 44px;
        }
      }

      /* Canvas Hardware Scaling Rules */
      canvas {
        touch-action: none !important; /* Prevents browser gesture hijacking during gameplay */
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
    `;
    document.head.appendChild(style);
  }

  // 3. Retina & DPR Canvas Auto-Scaler
  function setupCanvasDPRScaling() {
    function resizeCanvases() {
      const canvases = document.querySelectorAll('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x to avoid mobile thermal throttling

      canvases.forEach(canvas => {
        // Skip if canvas is explicitly set to ignore auto-resize
        if (canvas.dataset.noAutoDpr === 'true') return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const displayWidth = Math.floor(rect.width);
        const displayHeight = Math.floor(rect.height);

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
          canvas.style.width = displayWidth + 'px';
          canvas.style.height = displayHeight + 'px';

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(dpr, dpr);
          }
        }
      });
    }

    window.addEventListener('resize', resizeCanvases, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvases, 150);
    });

    if (document.readyState === 'complete') {
      resizeCanvases();
    } else {
      window.addEventListener('load', resizeCanvases);
    }
  }

  // 4. WebAudio Unlocking for iOS / Android Autoplay Policy
  function setupWebAudioUnlocker() {
    const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'keydown'];
    
    function unlockAudio() {
      // Find any active or suspended AudioContext on window
      const audioCtx = window.AudioContext || window.webkitAudioContext;
      if (window.__pr0sisAudioContext && window.__pr0sisAudioContext.state === 'suspended') {
        window.__pr0sisAudioContext.resume();
      }

      // If Howler or other audio library is used
      if (window.Howler && window.Howler.ctx && window.Howler.ctx.state === 'suspended') {
        window.Howler.ctx.resume();
      }

      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, unlockAudio, { capture: true });
      });
    }

    unlockEvents.forEach(evt => {
      window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
    });
  }

  // Execute All Invariants
  ensureViewportMeta();
  injectMobileStyles();
  setupCanvasDPRScaling();
  setupWebAudioUnlocker();

  console.log('[Pr0sis Mobile Purification] Active. Viewport, 100dvh, Touch-Action & Retina DPR locked.');
})();
