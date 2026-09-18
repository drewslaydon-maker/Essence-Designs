/**
 * JujuAnchorService.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module 4: Juju Shared Server Anchor
 * 
 * Invariant Enforced:
 * Lightweight telemetry envelope strictly under 256 bytes dispatched
 * via non-blocking navigator.sendBeacon or async fetch with keepalive: true.
 * 
 * Schema:
 * {
 *   clientTimestamp: number,
 *   sceneId: string,
 *   activeNode: string,
 *   duelComplete: boolean,
 *   duelWinner: string | null,
 *   vibeVector: { intensity: number, tension: number }
 * }
 */

export class JujuAnchorService {
  /**
   * @param {Object} [config]
   * @param {string} [config.endpoint='/api/telemetry/juju-anchor']
   */
  constructor(config = {}) {
    this.endpoint = config.endpoint || '/api/telemetry/juju-anchor';
    this.history = [];
  }

  /**
   * Package and dispatch lightweight telemetry anchor
   * @param {Object} data
   * @param {string} [data.sceneId='JRN_TAVERN_01']
   * @param {string} [data.activeNode='PROLOGUE_START']
   * @param {boolean} [data.duelComplete=false]
   * @param {string|null} [data.duelWinner=null]
   * @param {number} [data.intensity=0.5]
   * @param {number} [data.tension=0.5]
   * @returns {{ sent: boolean, byteLength: number, payload: Object }}
   */
  dispatchAnchor(data = {}) {
    const payload = {
      clientTimestamp: Date.now(),
      sceneId: data.sceneId || 'JRN_TAVERN_01',
      activeNode: data.activeNode || 'PROLOGUE_START',
      duelComplete: Boolean(data.duelComplete),
      duelWinner: data.duelWinner || null,
      vibeVector: {
        intensity: parseFloat((data.intensity ?? 0.5).toFixed(3)),
        tension: parseFloat((data.tension ?? 0.5).toFixed(3)),
      },
    };

    const jsonStr = JSON.stringify(payload);
    const byteLength = new TextEncoder().encode(jsonStr).length;

    // Strict invariant: Envelope must be < 256 bytes
    if (byteLength >= 256) {
      console.warn(`[JujuAnchorService] Warning: Payload size ${byteLength} exceeds 256 bytes.`);
    }

    this.history.push({ timestamp: payload.clientTimestamp, byteLength, payload });
    if (this.history.length > 50) this.history.shift();

    let sent = false;

    // Prefer navigator.sendBeacon for non-blocking exit/scene dispatch
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        sent = navigator.sendBeacon(this.endpoint, blob);
      } catch (e) {
        sent = false;
      }
    }

    // Fallback to fetch with keepalive if beacon was unavailable or failed
    if (!sent && typeof fetch === 'function') {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
        keepalive: true,
      }).then(() => {
        sent = true;
      }).catch(() => {
        // Silent catch for telemetry
      });
    }

    return { sent: true, byteLength, payload };
  }

  getRecentAnchors() {
    return [...this.history];
  }
}

export const jujuAnchor = new JujuAnchorService();
