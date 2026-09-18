/**
 * DialoguePacer.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module 2: JRPG Dialogue Pacer & Universal Two-Tap Input Buffer
 * 
 * Invariants Enforced:
 * - State Machine: [IDLE] -> [STREAMING] -> [AWAITING_INPUT] -> [NODE_RESOLVED] -> [IDLE]
 * - Typewriter Cadence: 25ms base char delay; +150ms clause pause (/,|;/); +350ms terminal pause (/\.|\!|\?/)
 * - Universal Two-Tap Input Contract:
 *     * Tap 1 (during STREAMING): Instantly completes typewriter stream and prints full buffer; transitions to AWAITING_INPUT.
 *     * Tap 2 (during AWAITING_INPUT): Advances node, emits EVT_TEXT_ADVANCE.
 * - Prompt Metric: Bobbing prompt '▼ [TAP / SPACE]' exclusively during AWAITING_INPUT:
 *     Y_pos = Y_anchor + sin(6.0 * t) * 4.0px.
 * - AU-02 Invariant: 50 rapid input taps within 500ms must not hang frames and must advance exactly 1 node.
 */

export class DialoguePacer {
  /**
   * @param {Object} [config]
   * @param {number} [config.baseCharDelayMs=25]
   * @param {number} [config.clausePauseMs=150]
   * @param {number} [config.terminalPauseMs=350]
   * @param {number} [config.inputDebounceMs=60]
   * @param {Function} [config.onAdvance]
   * @param {Function} [config.onComplete]
   * @param {Function} [config.onChar]
   */
  constructor(config = {}) {
    this.baseCharDelayMs = config.baseCharDelayMs ?? 25;
    this.clausePauseMs = config.clausePauseMs ?? 150;
    this.terminalPauseMs = config.terminalPauseMs ?? 350;
    this.inputDebounceMs = config.inputDebounceMs ?? 60;

    this.onAdvance = config.onAdvance || null;
    this.onComplete = config.onComplete || null;
    this.onChar = config.onChar || null;

    // States: 'IDLE' | 'STREAMING' | 'AWAITING_INPUT' | 'NODE_RESOLVED'
    this.state = 'IDLE';

    // Script Node Data
    this.currentNode = null;
    this.fullText = '';
    this.charIndex = 0;
    this.displayedText = '';

    // Cadence timing accumulators
    this.pauseRemainingMs = 0;
    this.charTimerMs = 0;

    // Total elapsed time for bobbing prompt animation
    this.animTime = 0.0;

    // Input buffer tracking for AU-02 rapid tap debouncing
    this.lastInputTimestamp = -99999;
    this.nodesAdvancedCount = 0;
  }

  /**
   * Load and begin streaming a script dialogue node
   * @param {Object} node { id, speaker, avatar, color, text }
   */
  startNode(node) {
    if (!node || !node.text) {
      this.state = 'IDLE';
      this.currentNode = null;
      this.fullText = '';
      this.displayedText = '';
      return;
    }

    this.currentNode = node;
    this.fullText = node.text;
    this.charIndex = 0;
    this.displayedText = '';
    this.pauseRemainingMs = 0;
    this.charTimerMs = 0;
    this.state = 'STREAMING';
  }

  /**
   * Universal Two-Tap Input Handler
   * @param {number} [nowMs] Timestamp in milliseconds
   * @returns {{ consumed: boolean, action: 'skip_stream'|'advance_node'|'debounced'|'none' }}
   */
  handleInput(nowMs = Date.now()) {
    const deltaMs = nowMs - this.lastInputTimestamp;

    // AU-02: Debounce rapid chatter taps within inputDebounceMs
    if (deltaMs < this.inputDebounceMs && deltaMs >= 0) {
      return { consumed: false, action: 'debounced' };
    }

    this.lastInputTimestamp = nowMs;

    // Tap 1: Complete current text stream instantly
    if (this.state === 'STREAMING') {
      this.charIndex = this.fullText.length;
      this.displayedText = this.fullText;
      this.pauseRemainingMs = 0;
      this.state = 'AWAITING_INPUT';
      return { consumed: true, action: 'skip_stream' };
    }

    // Tap 2: Advance node from AWAITING_INPUT
    if (this.state === 'AWAITING_INPUT') {
      this.state = 'NODE_RESOLVED';
      this.nodesAdvancedCount++;
      if (this.onAdvance) {
        this.onAdvance(this.currentNode);
      }
      return { consumed: true, action: 'advance_node' };
    }

    return { consumed: false, action: 'none' };
  }

  /**
   * Frame update for typewriter cadence and bobbing prompt
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    const safeDt = Math.max(0.0, Math.min(0.1, dt));
    this.animTime += safeDt;

    if (this.state !== 'STREAMING') return;

    let dtMs = safeDt * 1000.0;

    // Process pause delays (for commas, periods, exclamation marks)
    if (this.pauseRemainingMs > 0) {
      this.pauseRemainingMs -= dtMs;
      if (this.pauseRemainingMs > 0) {
        return;
      }
      dtMs = Math.abs(this.pauseRemainingMs);
      this.pauseRemainingMs = 0;
    }

    this.charTimerMs += dtMs;

    while (this.charTimerMs >= this.baseCharDelayMs && this.charIndex < this.fullText.length) {
      this.charTimerMs -= this.baseCharDelayMs;
      const char = this.fullText[this.charIndex];
      this.charIndex++;
      this.displayedText = this.fullText.slice(0, this.charIndex);

      // Trigger character speech audio callback (Deltarune vocal blip)
      if (this.onChar && char && char.trim() !== '') {
        try {
          this.onChar(char, this.currentNode, this.charIndex);
        } catch {
          // Audio errors must never break pacer
        }
      }

      // Check for syntax pauses
      if (/[.,;:!?]/.test(char)) {
        if (/[.!?]/.test(char)) {
          // Terminal pause: +350ms
          this.pauseRemainingMs = this.terminalPauseMs;
          break;
        } else if (/[,;]/.test(char)) {
          // Clause pause: +150ms
          this.pauseRemainingMs = this.clausePauseMs;
          break;
        }
      }
    }

    if (this.charIndex >= this.fullText.length) {
      this.displayedText = this.fullText;
      this.state = 'AWAITING_INPUT';
    }
  }

  /**
   * Calculate bobbing prompt metrics for canvas rendering
   * @param {number} [anchorY=0]
   * @returns {{ visible: boolean, y: number, alpha: number, label: string }}
   */
  getPromptMetric(anchorY = 0) {
    if (this.state !== 'AWAITING_INPUT') {
      return { visible: false, y: anchorY, alpha: 0.0, label: '' };
    }

    // Y_pos = Y_anchor + sin(6.0 * t) * 4.0px
    const yOffset = Math.sin(6.0 * this.animTime) * 4.0;
    // Alpha pulse between 0.60 and 1.00
    const alpha = 0.80 + 0.20 * Math.cos(6.0 * this.animTime);

    return {
      visible: true,
      y: anchorY + yOffset,
      alpha,
      label: '▼ [TAP / SPACE]',
    };
  }

  getDisplayText() {
    return this.displayedText;
  }

  isAwaitingInput() {
    return this.state === 'AWAITING_INPUT';
  }

  isStreaming() {
    return this.state === 'STREAMING';
  }

  isIdle() {
    return this.state === 'IDLE';
  }
}
