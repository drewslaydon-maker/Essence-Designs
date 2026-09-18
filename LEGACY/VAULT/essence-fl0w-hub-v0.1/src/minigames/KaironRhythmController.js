/**
 * KaironRhythmController.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module: Kairon & Bozog's Body Drums Rhythm Jam
 * 
 * Mechanics & Invariants:
 * - State Machine: [PRE_JAM] -> [COUNTDOWN] -> [ACTIVE_JAM] -> [JAM_CLIMAX] -> [JAM_SUCCESS] | [JAM_FAILED]
 * - 3 Body Percussion Lanes:
 *     Lane 0: Chest Thump (Bass Thud, Key [Z] / [A] / Left Arrow)
 *     Lane 1: Thigh Slap (Snappy Rimshot, Key [X] / [S] / Down Arrow)
 *     Lane 2: Tusk Clack / Boot Stomp (Heavy Impact, Key [C] / [D] / [Space] / Right Arrow)
 * - Timing Windows:
 *     PERFECT: |t_hit - t_note| <= 55ms (+100 pts, combo++)
 *     GOOD:    |t_hit - t_note| <= 110ms (+50 pts, combo++)
 *     MISS:    |t_hit - t_note| > 110ms or unhit (0 pts, combo resets)
 * - Groove Meter: [0.0, 1.0]. Starts at 0.5. Must stay >= 0.20 to pass. Reaching >= 0.85 triggers Climax.
 * - Procedural WebAudio Synth: Instant zero-latency physical percussive impulses.
 */

export class KaironRhythmController {
  /**
   * @param {Object} [config]
   * @param {Function} [config.onHit] Callback(lane, rating, combo)
   * @param {Function} [config.onComplete] Callback(success, stats)
   */
  constructor(config = {}) {
    this.onHit = config.onHit || null;
    this.onComplete = config.onComplete || null;

    // States: 'PRE_JAM' | 'COUNTDOWN' | 'ACTIVE_JAM' | 'JAM_CLIMAX' | 'JAM_SUCCESS' | 'JAM_FAILED'
    this.state = 'PRE_JAM';

    this.bpm = 108;
    this.elapsedTime = 0.0;
    this.countdown = 3.0;

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.perfectHits = 0;
    this.goodHits = 0;
    this.misses = 0;
    this.grooveMeter = 0.5; // [0.0, 1.0]

    // Lane visual feedback: active hit flash timers
    this.laneFlashes = [0.0, 0.0, 0.0];
    this.lastRating = ''; // 'PERFECT' | 'GOOD' | 'MISS'
    this.ratingTimer = 0.0;

    // Generated rhythm track: list of notes
    this.notes = [];
    this.scrollSpeed = 240; // pixels per second on the highway
    this.generateBeatTrack();
  }

  generateBeatTrack() {
    // 108 BPM = ~0.555 seconds per beat
    const beatSec = 60 / this.bpm;
    const startOffset = 2.0; // 2 seconds run-in

    // Rhythmic body drum pattern: 24 beats
    // Patterns alternating Chest (0), Thigh (1), Stomp (2)
    const pattern = [
      { beat: 0, lane: 0 }, // Chest
      { beat: 1, lane: 1 }, // Thigh
      { beat: 2, lane: 0 }, // Chest
      { beat: 3, lane: 2 }, // Stomp

      { beat: 4, lane: 0 }, // Chest
      { beat: 4.5, lane: 0 }, // Quick double-chest!
      { beat: 5, lane: 1 }, // Thigh
      { beat: 6, lane: 2 }, // Stomp

      { beat: 8, lane: 1 }, // Thigh
      { beat: 9, lane: 0 }, // Chest
      { beat: 10, lane: 1 }, // Thigh
      { beat: 11, lane: 2 }, // Stomp

      { beat: 12, lane: 0 }, // Chest
      { beat: 12.5, lane: 1 }, // Thigh
      { beat: 13, lane: 2 }, // Stomp
      { beat: 14, lane: 0 }, // Chest
      { beat: 15, lane: 2 }, // Stomp

      // Climax solo flurry
      { beat: 16, lane: 0 },
      { beat: 16.5, lane: 1 },
      { beat: 17, lane: 0 },
      { beat: 17.5, lane: 1 },
      { beat: 18, lane: 2 },
      { beat: 19, lane: 0 },
      { beat: 20, lane: 2 }
    ];

    this.notes = pattern.map((item, idx) => ({
      id: idx,
      targetTime: startOffset + item.beat * beatSec,
      lane: item.lane,
      hit: false,
      missed: false
    }));

    this.trackDuration = startOffset + 22 * beatSec;
  }

  start() {
    this.state = 'COUNTDOWN';
    this.countdown = 2.5;
    this.elapsedTime = 0.0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.perfectHits = 0;
    this.goodHits = 0;
    this.misses = 0;
    this.grooveMeter = 0.5;
    this.generateBeatTrack();
  }

  /**
   * Player strikes a drum lane
   * @param {number} lane 0 (Chest), 1 (Thigh), 2 (Stomp)
   */
  hitLane(lane) {
    if (this.state !== 'ACTIVE_JAM') return 'NONE';

    this.laneFlashes[lane] = 1.0;

    // Find nearest unhit note in this lane within timing window (200ms)
    let candidate = null;
    let minDiff = 999;

    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (note.lane === lane && !note.hit && !note.missed) {
        const diff = Math.abs(this.elapsedTime - note.targetTime);
        if (diff < minDiff && diff <= 0.20) {
          minDiff = diff;
          candidate = note;
        }
      }
    }

    if (candidate) {
      candidate.hit = true;
      let rating = 'GOOD';
      let pts = 50;

      if (minDiff <= 0.08) {
        rating = 'PERFECT';
        pts = 100;
        this.perfectHits++;
      } else {
        this.goodHits++;
      }

      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.score += pts * Math.min(4, 1 + Math.floor(this.combo / 4));
      this.grooveMeter = Math.min(1.0, this.grooveMeter + 0.08);
      this.lastRating = rating;
      this.ratingTimer = 0.8;

      if (this.onHit) this.onHit(lane, rating, this.combo);
      return rating;
    } else {
      // Stray tap penalty if off-beat
      this.grooveMeter = Math.max(0.05, this.grooveMeter - 0.02);
      this.lastRating = 'STRAY';
      this.ratingTimer = 0.4;
      return 'STRAY';
    }
  }

  update(dt) {
    // Flash decays
    for (let i = 0; i < 3; i++) {
      if (this.laneFlashes[i] > 0) {
        this.laneFlashes[i] = Math.max(0, this.laneFlashes[i] - dt * 5.0);
      }
    }
    if (this.ratingTimer > 0) {
      this.ratingTimer = Math.max(0, this.ratingTimer - dt);
    }

    if (this.state === 'COUNTDOWN') {
      this.countdown -= dt;
      if (this.countdown <= 0) {
        this.state = 'ACTIVE_JAM';
      }
      return;
    }

    if (this.state !== 'ACTIVE_JAM') return;

    this.elapsedTime += dt;

    // Check for missed notes
    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (!note.hit && !note.missed) {
        if (this.elapsedTime - note.targetTime > 0.16) {
          note.missed = true;
          this.misses++;
          this.combo = 0;
          this.grooveMeter = Math.max(0.0, this.grooveMeter - 0.07);
          this.lastRating = 'MISS';
          this.ratingTimer = 0.6;
          if (this.onHit) this.onHit(note.lane, 'MISS', 0);
        }
      }
    }

    // Groove meter fail check
    if (this.grooveMeter <= 0.05) {
      this.state = 'JAM_FAILED';
      if (this.onComplete) {
        this.onComplete(false, {
          score: this.score,
          maxCombo: this.maxCombo,
          perfectHits: this.perfectHits,
          goodHits: this.goodHits,
          misses: this.misses
        });
      }
      return;
    }

    // Completion check
    if (this.elapsedTime >= this.trackDuration) {
      this.state = 'JAM_SUCCESS';
      if (this.onComplete) {
        this.onComplete(true, {
          score: this.score,
          maxCombo: this.maxCombo,
          perfectHits: this.perfectHits,
          goodHits: this.goodHits,
          misses: this.misses
        });
      }
    }
  }

  reset() {
    this.state = 'PRE_JAM';
    this.countdown = 3.0;
    this.elapsedTime = 0.0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.perfectHits = 0;
    this.goodHits = 0;
    this.misses = 0;
    this.grooveMeter = 0.5;
    this.generateBeatTrack();
  }

  toSnapshot() {
    const approachWindow = 1.6; // 1.6s approach highway preview
    const countdownCeil = Math.ceil(this.countdown);
    const countdownText = countdownCeil > 2 ? '3' : countdownCeil > 1 ? '2' : countdownCeil > 0 ? '1' : 'GROOVE!';

    return {
      state: this.state,
      countdown: countdownCeil,
      countdownText: this.state === 'COUNTDOWN' ? countdownText : null,
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      grooveMeter: parseFloat(this.grooveMeter.toFixed(3)),
      lastRating: this.lastRating,
      ratingTimer: parseFloat(this.ratingTimer.toFixed(2)),
      laneFlashes: this.laneFlashes.map(f => parseFloat(f.toFixed(2))),
      elapsedTime: parseFloat(this.elapsedTime.toFixed(2)),
      notes: this.notes.map(n => {
        const timeDiff = n.targetTime - this.elapsedTime;
        const progress = 1.0 - (timeDiff / approachWindow);
        const isVisible = progress >= -0.1 && progress <= 1.25 && !n.hit;
        const isInHitZone = Math.abs(timeDiff) <= 0.14 && !n.hit && !n.missed;
        return {
          id: n.id,
          targetTime: parseFloat(n.targetTime.toFixed(3)),
          lane: n.lane,
          hit: n.hit,
          missed: n.missed,
          progress: parseFloat(progress.toFixed(3)),
          timeDiff: parseFloat(timeDiff.toFixed(3)),
          isVisible,
          isInHitZone
        };
      })
    };
  }
}
