import { useState, useRef, useEffect } from "react";
import {
  Zap,
  Flame,
  Sparkles,
  AlertTriangle,
  Skull,
  Eye,
  EyeOff,
  RotateCcw,
  HelpCircle,
  Trophy,
  Rocket,
  Heart,
  Radar,
  Compass,
  ShieldAlert,
  History,
  Trash2,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  FileText,
  Info,
  Terminal,
  Anchor,
  ChevronRight,
  X,
  Lock,
  CheckCircle,
  Radio,
  Edit3,
} from "lucide-react";
import {
  saveRunState,
  loadRunState,
  clearRunState,
  getRunHistory,
  recordRunHistory,
  clearRunHistory,
  getShipName,
  setShipName,
  getCaptainsManifest,
  recordManifestEntry,
  clearCaptainsManifest,
  getUnlockedLoreIds,
  unlockLoreId,
  isLoreUnlocked,
  getUnlockedAchievementIds,
  unlockAchievementId,
  isAchievementUnlocked,
  getCaptainProfile,
  saveCaptainProfile,
  getCosmeticsProfile,
  unlockHullSkin,
  unlockScoutBadge,
  getHighScores,
  submitHighScore,
  calculateRunScore,
  resetAllData,
  RunHistorySummary,
  ShipLogEntry,
} from "./persistence";
import {
  calculateRunAnalytics,
  processRunCompletion,
  RunAnalytics,
} from "./analytics";
import {
  WDT_SCENARIOS,
  evaluateDiagnosticResult,
  getCalibrationPatch,
} from "./wdt";
import {
  SPAGHETTI_RUNES,
  canEquipRune,
  equipRune,
  unequipRune,
  calculateCombinedRuneEffects,
  applyRuneScoreModifiers,
} from "./runes";
import {
  startAmbientPad,
  stopAmbientPad,
  toggleMute,
  isMuted,
  playSFX,
  setVolume,
  updatePadState,
  ensureAudioContext,
} from "./audio";
import type { LogicState, CaptainProfile, CosmeticsProfile, HighScoreEntry, HullSkin, PersonaId, Front } from "./types";
import { BriefingModal } from "../components/BriefingModal";
import { AchievementsModal } from "../components/AchievementsModal";
import { WdtModal } from "../components/WdtModal";
import { ProfileModal } from "../components/ProfileModal";
import { LeaderboardModal } from "../components/LeaderboardModal";


// ============================================================
// WEB AUDIO API SOUND SYNTHESIZER
// ============================================================
class SoundSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;
  droneOsc1: OscillatorNode | null = null;
  droneOsc2: OscillatorNode | null = null;
  droneGain: GainNode | null = null;

  init() {
    try {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch((e) => {
          console.warn("[SoundSynth] AudioContext resume failed:", e);
        });
      }
    } catch (e) {
      console.warn("[SoundSynth] AudioContext init failed:", e);
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setValueAtTime(muted ? 0 : 0.04, this.ctx.currentTime);
      }
    } catch (e) {
      console.warn("[SoundSynth] setMuted failed:", e);
    }
  }

  startDrone() {
    if (this.muted || this.droneOsc1) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.04, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, now);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(55, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(110, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(g);
      g.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.droneOsc1 = osc1;
      this.droneOsc2 = osc2;
      this.droneGain = g;
    } catch (e) {
      console.warn("[SoundSynth] startDrone failed:", e);
    }
  }

  stopDrone() {
    if (this.droneOsc1) {
      try {
        this.droneOsc1.stop();
        this.droneOsc2?.stop();
      } catch (e) {
        console.warn("[SoundSynth] stopDrone failed:", e);
      }
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneGain = null;
    }
  }

  playSfx(type: "click" | "alarm" | "warp" | "achievement" | "damage" | "event" | "victory" | string) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (type === "click") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "alarm") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "warp") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.55);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === "achievement") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + idx * 0.08;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } else if (type === "damage") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "victory") {
        const notes = [392.0, 493.88, 587.33, 783.99];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + idx * 0.12;
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t);
          osc.stop(t + 0.45);
        });
      }
    } catch (e) {
      console.warn("[SoundSynth] playSfx failed:", e);
    }
  }
}

const synth = new SoundSynth();
// ============================================================
// LORE SIGNALS DATABASE
// ============================================================
export interface LoreSignal {
  id: string;
  title: string;
  category: string;
  sectorRequired: number;
  conditionDesc: string;
  content: string;
}

const LORE_SIGNALS: LoreSignal[] = [
  {
    id: "sig_01",
    title: "CLASSIFIED TRANSCRIPT #01: THE FRACTURE INITIATIVE",
    category: "Prosis Core History",
    sectorRequired: 1,
    conditionDesc: "Unlocked by default at launch.",
    content:
      "LOG ENTRY 001-A // PROJECT PROSIS\n\nWhen the first space-time tear opened in Sector 12, we called it a mathematical glitch. We were wrong. The Reality Engine isn't just power—it's localized physics binding our ship to this plane. If Entropy spikes, space itself degrades. Helm, Gene, and Sal are all that stand between us and complete atomic dispersion.",
  },
  {
    id: "sig_02",
    title: "CLASSIFIED TRANSCRIPT #02: ENTROPY SINGULARITY",
    category: "Anomalous Phenomena",
    sectorRequired: 1,
    conditionDesc: "Survive 3 rounds in Sector 1.",
    content:
      "SIGNAL DECODED // FREQUENCY 144.9 MHz\n\nEntropy is not merely chaos; it is an active gravitational pressure. As Entropy accumulates beyond 50%, subatomic friction accelerates systems breakdown. Deploy Helm's Force Correction early—waiting until emergency thresholds will exhaust crew morale.",
  },
  {
    id: "sig_03",
    title: "CLASSIFIED TRANSCRIPT #03: THE BLACK HOLE ENGINE",
    category: "Propulsion & Spacetime",
    sectorRequired: 2,
    conditionDesc: "Advance to Sector 2.",
    content:
      "MEMORANDUM // CHIEF ENGINEER GENE\n\nThe prOsis micro-singularity core generates hyper-dense gravitational lensing. That's what allows instantaneous Sector jumping. But every warp generates massive thermal friction across Systems. Ensure Salvage caches are deposited into Systems before engaging warp coordinates.",
  },
  {
    id: "sig_04",
    title: "CLASSIFIED TRANSCRIPT #04: COMPOUND BARRIER PROTOCOL",
    category: "Defensive Tactics",
    sectorRequired: 1,
    conditionDesc: "Claim a compounding barrier after holding it.",
    content:
      "TACTICAL ADVISORY // SALVAGE & AFT\n\nDeferred barriers grow exponentially each round they remain intact. A Level III Reserve Cache left unhit for 2 rounds can absorb an entire cascading collapse. Protect your open barriers from matching hits to maximize payout.",
  },
  {
    id: "sig_05",
    title: "CLASSIFIED TRANSCRIPT #05: EVENT HORIZON THRESHOLD",
    category: "Prosis Deep Space",
    sectorRequired: 3,
    conditionDesc: "Advance to Sector 3.",
    content:
      "DEEP SPACE TELEMETRY // SECTOR 3\n\nWe have reached the outer accretion envelope of the Fracture Singularity. Time Dilation is now 1.4x standard. Threat arrivals are non-linear. The Reality Engine's quantum coherence is the only force preventing temporal collapse.",
  },
  {
    id: "sig_06",
    title: "CLASSIFIED TRANSCRIPT #06: CREW RESONANCE DISCOVERY",
    category: "Crew Dynamics",
    sectorRequired: 1,
    conditionDesc: "Reach 90% or higher Crew Morale.",
    content:
      "PSYCHOLOGIST LOG // CAPTAIN'S MANIFEST\n\nHigh crew morale isn't just emotional—it provides a structural stabilization coefficient. When morale exceeds 85%, the crew handles high-threat mitigation with 15% lower stress friction. Keep morale high through Analyze and balanced choices.",
  },
  {
    id: "sig_07",
    title: "CLASSIFIED TRANSCRIPT #07: ANCHOR DIRECTIVE",
    category: "Command Protocol",
    sectorRequired: 2,
    conditionDesc: "Survive a high-pressure round under low HP.",
    content:
      "DIRECTIVE #902 // ANCHOR PERSONAS\n\nRicky risks it all on high-reward calls. Maude burns herself out covering for others. Dez hesitates until the crew defies him. Master your Anchor Persona's trade-offs—they dictate whether you control the ship or the ship controls you.",
  },
  {
    id: "sig_08",
    title: "CLASSIFIED TRANSCRIPT #08: THE PROSIS LEGACY",
    category: "Victory Archives",
    sectorRequired: 3,
    conditionDesc: "Complete all 3 sectors and escape the Fracture.",
    content:
      "FINAL TRANSMISSION // CAPTAIN'S LOG\n\nWe passed through the singularity core and emerged into clear space. The prOsis engine held. The vessel survived. To all captains who follow in our wake: balance your fronts, hold your barriers, and never lose faith in your crew.",
  },
];


// ============================================================
// ============================================================
// ACHIEVEMENTS / MEDALS DEFINITION
// ============================================================
export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

const ACHIEVEMENTS_LIST: AchievementDef[] = [
  { id: "ach_first_warp", title: "First Warp", desc: "Complete Round 1 in Sector 1.", iconName: "Rocket" },
  { id: "ach_sector_2", title: "Into the Deep", desc: "Advance to Sector 2.", iconName: "Compass" },
  { id: "ach_sector_3", title: "Singularity Diver", desc: "Advance to Sector 3.", iconName: "Radar" },
  { id: "ach_barrier", title: "Fortified", desc: "Claim a compound barrier after holding it 1+ rounds.", iconName: "ShieldAlert" },
  { id: "ach_entropy_low", title: "Zero Friction", desc: "Finish a round with Entropy below 15%.", iconName: "Zap" },
  { id: "ach_morale_high", title: "Unshakable Crew", desc: "Reach 90% or higher Morale.", iconName: "Heart" },
  { id: "ach_lore_hunter", title: "Signal Collector", desc: "Unlock at least 3 Lore Transcripts.", iconName: "BookOpen" },
  { id: "ach_victory", title: "Captain of Prosis", desc: "Complete all 3 sectors and conquer the fracture!", iconName: "Trophy" },
];

// ============================================================
// POST-MORTEM ANALYTICS MODAL COMPONENT
// ============================================================
function PostMortemModal({
  gameOver,
  lossType,
  round,
  sector,
  domFront,
  postMortemResult,
  captainProfile,
  shipName,
  highScoresList,
  onLaunchNewVoyage,
  onOpenLeaderboard,
  onReturnToBridge,
}: {
  gameOver: string;
  lossType: string | null;
  round: number;
  sector: number;
  domFront: Front;
  postMortemResult: { analytics: RunAnalytics; highScore: HighScoreEntry; unlockedBadges: string[] } | null;
  captainProfile: CaptainProfile;
  shipName: string;
  highScoresList: HighScoreEntry[];
  onLaunchNewVoyage: () => void;
  onOpenLeaderboard: () => void;
  onReturnToBridge: () => void;
}) {
  const globalRank = postMortemResult
    ? highScoresList.findIndex((h) => h.id === postMortemResult.highScore.id) + 1 || 1
    : 1;

  return (
    <div id="gameOverModal" className="modal-overlay" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(5, 8, 14, 0.92)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, overflowY: "auto"
    }}>
      <div style={{
        maxWidth: 720, width: "100%", background: "#12080e",
        border: `2px solid ${COLORS.danger}aa`, borderRadius: 16, padding: 24,
        boxShadow: "0 0 40px rgba(239, 68, 68, 0.25)", maxHeight: "90vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, borderBottom: `1px solid ${COLORS.danger}44`, paddingBottom: 14 }}>
          <Skull size={32} color={COLORS.danger} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.danger, letterSpacing: 1.5 }}>
              VOYAGE TERMINATED — POST-MORTEM ANALYTICS
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.bone, marginTop: 2 }}>
              {gameOver}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: COLORS.bone, fontStyle: "italic", marginBottom: 20, background: "#00000050", padding: 12, borderRadius: 8, borderLeft: `4px solid ${COLORS.danger}` }}>
          "{lossType === "morale" ? MORALE_EPITAPH(round) : EPITAPHS[domFront](round)}"
        </div>

        <div id="postMortemAnalytics" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {postMortemResult && (
            <div style={{ background: "#1a1018", border: `1px solid ${COLORS.morale}88`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.morale, letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                  <Trophy size={16} /> FINAL HIGH SCORE
                </div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 900, color: COLORS.morale }}>
                  {postMortemResult.analytics.finalScore.toLocaleString()} PTS
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: COLORS.muted, display: "flex", justifyContent: "space-between" }}>
                <span>Callsign / Vessel: <strong style={{ color: COLORS.bone }}>{captainProfile.captainCallsign} ({shipName || "USSC FRACTURE"})</strong></span>
                <span>Global Position: <strong style={{ color: COLORS.event }}>#{globalRank}</strong></span>
              </div>
            </div>
          )}
          {/* Metrics & Damage Breakdown */}
          <div style={{ background: "#0d080c", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.muted, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
              📊 DAMAGE BREAKDOWN & RUN METRICS
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>SECTOR REACHED</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: COLORS.event }}>Sector {sector}</div>
              </div>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>TOTAL DAMAGE</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: COLORS.danger }}>
                  {postMortemResult ? postMortemResult.analytics.totalDamageTaken.toFixed(1) : "0.0"}
                </div>
              </div>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>THREATS MITIGATED</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: COLORS.salvage }}>
                  {postMortemResult ? postMortemResult.analytics.threatsMitigated : 0}
                </div>
              </div>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>DEFIANCE EVENTS</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: COLORS.re }}>
                  {postMortemResult ? postMortemResult.analytics.defianceEventsFired : 0}
                </div>
              </div>
            </div>

            {/* Damage By Front Chart */}
            <div style={{ background: "#00000040", padding: 12, borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, marginBottom: 8 }}>DAMAGE SUSTAINED BY FRONT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(["systems", "entropy", "re"] as Front[]).map((front) => {
                  const dmg = postMortemResult?.analytics?.damageByFront?.[front] ?? 0;
                  const total = postMortemResult?.analytics?.totalDamageTaken ? Math.max(1, postMortemResult.analytics.totalDamageTaken) : 1;
                  const pct = Math.min(100, Math.round((dmg / total) * 100));
                  const color = front === "entropy" ? COLORS.entropy : front === "systems" ? COLORS.systems : COLORS.re;
                  const label = front === "entropy" ? "Entropy" : front === "systems" ? "Systems" : "Reality Engine";
                  return (
                    <div key={front}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: COLORS.bone, marginBottom: 2 }}>
                        <span>{label}</span>
                        <span className="mono">{dmg.toFixed(1)} ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: "#111622", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barrier Statistics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>BARRIERS CLAIMED</div>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: COLORS.salvage }}>
                  {postMortemResult ? postMortemResult.analytics.barriersClaimed : 0}
                </div>
              </div>
              <div style={{ background: "#00000050", padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.muted }}>BARRIER PAYOUT RECOVERED</div>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: COLORS.salvage }}>
                  +{postMortemResult ? postMortemResult.analytics.barrierPayoutTotal.toFixed(1) : "0.0"}
                </div>
              </div>
            </div>
          </div>
          {/* Captain Card Summary */}
          <div style={{ background: "#0d080c", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.muted, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <Award size={14} /> CAPTAIN MANIFEST CARD
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted }}>CALLSIGN & SHIP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.bone }}>{captainProfile.captainCallsign}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{shipName || "USSC FRACTURE"}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted }}>ACTIVE VESSEL SKIN</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: COLORS.event, textTransform: "uppercase" }}>{captainProfile.activeHullSkin}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted }}>EQUIPPED RUNES</div>
                <div style={{ fontSize: 11, color: COLORS.bone }}>
                  {postMortemResult?.highScore.equippedRuneIds.length
                    ? postMortemResult.highScore.equippedRuneIds.join(", ")
                    : "None"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={onLaunchNewVoyage}
            className="action-btn primary-btn"
            style={{ flex: 1.5, minWidth: 160, background: COLORS.bone, color: COLORS.void, border: "none", borderRadius: 10, padding: "12px 16px", fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Rocket size={16} /> Launch New Voyage
          </button>
          <button
            onClick={onOpenLeaderboard}
            className="action-btn"
            style={{ flex: 1, minWidth: 140, background: `${COLORS.event}22`, color: COLORS.event, border: `1px solid ${COLORS.event}66`, borderRadius: 10, padding: "12px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Trophy size={14} /> View Global Leaderboard
          </button>
          <button
            onClick={onReturnToBridge}
            className="action-btn"
            style={{ flex: 1, minWidth: 120, background: `${COLORS.panelBorder}`, color: COLORS.bone, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 10, padding: "12px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <RotateCcw size={14} /> Return to Bridge
          </button>
        </div>
      </div>
    </div>
  );
}
// ============================================================
// ANIMATED BLACK HOLE LOGO COMPONENT
// ============================================================
function ProsisBlackHoleLogo({ size = 36, isVoyageActive = false }: { size?: number; isVoyageActive?: boolean }) {
  const activeClass = isVoyageActive ? "orbit-letter-active" : "orbit-letter-frozen";
  return (
    <div className="prosis-logo-container" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {/* Orbiting letters p, r */}
      <span className={`orbit-letter ${activeClass}`} style={{
        fontSize: Math.round(size * 0.6),
        fontWeight: 900,
        fontFamily: "ui-monospace, monospace",
        color: "#f1f5f9",
        textShadow: isVoyageActive ? "0 0 12px rgba(111, 168, 255, 0.8)" : "0 0 4px rgba(241, 245, 249, 0.3)",
        letterSpacing: 1,
        transition: "all 0.5s ease"
      }}>
        pr
      </span>

      {/* Central Black Hole Singularity O */}
      <div className="accretion-disk-container" style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="eventHorizonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="lensingGlow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer Lensing Halo */}
          <circle cx="50" cy="50" r="48" fill="url(#eventHorizonGlow)" filter="url(#lensingGlow)" className="accretion-ring" />
          
          {/* Accretion Disk Particle Ring */}
          <g className="accretion-disk">
            <ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#6fa8ff" strokeWidth="2.5" strokeDasharray="16 6 8 4" opacity="0.95">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur={isVoyageActive ? "4s" : "12s"} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="50" cy="50" rx="38" ry="11" fill="none" stroke="#ff4d6d" strokeWidth="1.5" strokeDasharray="12 8" opacity="0.75">
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur={isVoyageActive ? "3s" : "9s"} repeatCount="indefinite" />
            </ellipse>
            {/* Accretion particles */}
            <circle cx="12" cy="50" r="2.5" fill="#38bdf8" className="accretion-particle" />
            <circle cx="88" cy="50" r="2.5" fill="#fbbf24" className="accretion-particle" />
            <circle cx="50" cy="14" r="2" fill="#ff4d6d" className="accretion-particle" />
            <circle cx="50" cy="86" r="2" fill="#8b5cf6" className="accretion-particle" />
          </g>

          {/* Inner Event Horizon Singularity */}
          <circle cx="50" cy="50" r="22" fill="none" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.85" />
          <circle cx="50" cy="50" r="18" fill="#05080e" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Orbiting letters s, i, s */}
      <span className={`orbit-letter ${activeClass}`} style={{
        fontSize: Math.round(size * 0.6),
        fontWeight: 900,
        fontFamily: "ui-monospace, monospace",
        color: "#f1f5f9",
        textShadow: isVoyageActive ? "0 0 12px rgba(111, 168, 255, 0.8)" : "0 0 4px rgba(241, 245, 249, 0.3)",
        letterSpacing: 1,
        transition: "all 0.5s ease"
      }}>
        sis
      </span>
    </div>
  );
}

// THE FRACTURE — v5: 3 abilities x 3 levels per role, more events
// ============================================================
const LEVELS = { I: { cost: 1.0 }, II: { cost: 2.5 }, III: { cost: 5.5 } };

// Ability redesign — 3 cost-shapes x 3 roles. Every role gets exactly one of:
// different_front_now / same_front_later / deferred_compounding.
// Replaces the prior 9 (which mixed "clean free fixes" with costed abilities —
// the root cause of the "random toolbox" feedback; see 2026-08-19 handoff).
const ROLES = [
  { id: "helm", name: "Helm", personalName: "Helm", focus: "Entropy & Foresight",
    abilities: [
      { id: "force_correction", label: "Force the Correction", shape: "different_front_now",
        desc: "Entropy drops immediately. Systems takes the hit, same round.",
        levels: { I: { entropyDelta: -1.5, systemsDelta: -3 }, II: { entropyDelta: -3.5, systemsDelta: -6 }, III: { entropyDelta: -7, systemsDelta: -10 } } },
      { id: "suppress", label: "Suppress", shape: "same_front_later",
        desc: "Deploy a flat Entropy Quick Barrier. Active instantly; holds steady from day one.",
        levels: { I: { banked: 3 }, II: { banked: 6.5 }, III: { banked: 11.5 } },
        front: "entropy" },
      { id: "threat_ledger", label: "Threat Ledger", shape: "deferred_compounding",
        desc: "Raises a barrier against Entropy. The longer it holds, the more it's worth — but an Entropy spike while it's up costs the barrier the same haircut Entropy itself would take.",
        levels: { I: { banked: 2 }, II: { banked: 5 }, III: { banked: 9 } },
        front: "entropy" },
      { id: "analyze", label: "Analyze", shape: "personal",
        desc: "Reads the incoming threat before it lands. Softens it for the whole crew this round. No front healed — this is foresight, not repair.",
        levels: { I: { mitigation: 0.35, morale: 2 }, II: { mitigation: 0.55, morale: 3 }, III: { mitigation: 0.75, morale: 4 } } },
    ] },
  { id: "engineer", name: "Engineer", personalName: "Gene", focus: "Systems Health",
    abilities: [
      { id: "overload", label: "Overload", shape: "different_front_now",
        desc: "Big Systems gain. Entropy takes the hit, same round.",
        levels: { I: { systemsDelta: 7, entropyDelta: 1 }, II: { systemsDelta: 15, entropyDelta: 2.5 }, III: { systemsDelta: 26, entropyDelta: 5 } } },
      { id: "overclock", label: "Overclock", shape: "same_front_later",
        desc: "Deploy a flat Systems Quick Barrier. Active instantly; holds steady from day one.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "systems" },
      { id: "reserve_cache", label: "Reserve Cache", shape: "deferred_compounding",
        desc: "Raises a barrier around Systems. The longer it holds, the more it's worth — but a hit to Systems while it's up costs the barrier the same haircut Systems itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "systems" },
      { id: "dead_reckoning", label: "Dead Reckoning", shape: "personal",
        desc: "Charts a safer course through the incoming threat, softening it for the whole crew. Also buys any open barrier extra time to grow before exposure risk catches up. No front healed.",
        levels: { I: { mitigation: 0.2, extend: 1 }, II: { mitigation: 0.32, extend: 2 }, III: { mitigation: 0.45, extend: 3 } } },
    ] },
  { id: "aft", name: "Aft", personalName: "Sal", focus: "Reality Engine & Salvage",
    abilities: [
      { id: "force_extraction", label: "Force Extraction", shape: "different_front_now",
        desc: "Fast Salvage grab. The Reality Engine takes the hit, same round.",
        levels: { I: { salvageDelta: 5, reDelta: 0 }, II: { salvageDelta: 11, reDelta: -1 }, III: { salvageDelta: 20, reDelta: -3 } } },
      { id: "patch_job", label: "Patch Job", shape: "same_front_later",
        desc: "Deploy a flat Engine Quick Barrier. Active instantly; holds steady from day one.",
        levels: { I: { banked: 5 }, II: { banked: 11 }, III: { banked: 19.5 } },
        front: "re" },
      { id: "stockpile", label: "Stockpile", shape: "deferred_compounding",
        // REDESIGNED 2026-08-20: previously banked Salvage, which left Aft as the
        // only role with no defensive tool for its own front (Force Extraction
        // actively drains RE for Salvage; old Stockpile didn't protect RE either).
        // A round-40 death from repeated Tier III Stockpile use draining RE over
        // time confirmed this structurally. Now mirrors Reserve Cache: banks RE.
        // Salvage generation stays fully on Force Extraction + passive income.
        desc: "Raises a barrier around the Reality Engine. The longer it holds, the more it's worth — but a hit to the Engine while it's up costs the barrier the same haircut the Engine itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "re" },
      { id: "ration_the_take", label: "Ration the Take", shape: "personal",
        desc: "Rations the crew's exposure to the incoming threat, softening it for everyone. Also shields any open barrier from this round's exposure haircut entirely. No front healed.",
        levels: { I: { mitigation: 0.2, shield: true }, II: { mitigation: 0.32, shield: true }, III: { mitigation: 0.45, shield: true } } },
    ] },
];

// ---- ANCHOR persona triad ----
// design law: every mechanic inherits persona/Fracture flavoring; universality
// is the exception, not the default (locked 2026-08-19/20).
const ANCHORS = {
  ricky: { id: "ricky", name: "Ricky", direction: "Risky", nativeFront: "entropy", color: "#FF4D6D",
    tag: "Different front, now — amplified.", blurb: "Proud. Arrogant. Mood-swingy. Makes the call, makes you live with it.",
    signature: "Kiss the gamble or curse it. Either way, you'll feel it.", pulseClass: "pulse-ricky" },
  maude: { id: "maude", name: "Maude", direction: "Moderate", nativeFront: "systems", color: "#6FA8FF",
    tag: "Same front, later — hers to carry.", blurb: "Overworked-manager energy. Holds it together through sheer, burning-out competence.",
    signature: "Someone has to hold the line. It's always her.", pulseClass: "pulse-maude" },
  dez: { id: "dez", name: "Dez", direction: "Desperate", nativeFront: "re", color: "#8B5CF6",
    tag: "Deferred, compounding — on your word.", blurb: "Hedges every order. Begs for authority without saying so. The crew is starting to notice.",
    signature: "I— I think this is right? If that's okay with everyone.", pulseClass: "pulse-dez" },
};
const SHAPE_PERSONA = { different_front_now: "ricky", same_front_later: "maude", deferred_compounding: "dez" };
const BASE_HEAL = 15; // Belief-spend base heal, before persona payout multiplier -- PLACEHOLDER, needs Drew's number

// ---- Ground Truth Logic (GTL) — bounded live version. Salvage excluded:
// it only grows/gets spent, doesn't decay toward failure like the other three. ----
function gtlDecayRate(front, round, activeModifiers) {
  const base = { entropy: { base: AMBIENT_BASE, growth: AMBIENT_GROWTH }, systems: { base: SYSTEMS_WEAR_BASE, growth: SYSTEMS_WEAR_GROWTH }, re: { base: RE_WEAR_BASE, growth: RE_WEAR_GROWTH } }[front];
  let rate = base.base + base.growth * round;
  if (activeModifiers[front]) rate += activeModifiers[front];
  return Math.max(rate, 0.0001);
}
function gtlDistance(front, state) { const ent = (state && state.entropy !== undefined) ? state.entropy : 0; return front === "entropy" ? Math.max(0, 100 - ent) : Math.max(0, (state && state[front] !== undefined) ? state[front] : 0); }
function gtlTTF(front, round, state, activeModifiers) { return gtlDistance(front, state) / gtlDecayRate(front, round, activeModifiers); }
function resolveChosenFront(roundEffects) {
  const helpScore = { entropy: -(roundEffects.entropy || 0), systems: roundEffects.systems || 0, re: roundEffects.re || 0 };
  return Object.entries(helpScore).sort((a, b) => b[1] - a[1])[0][0];
}
function computeGTL(round, state, roundEffects, activeModifiers = {}) {
  const fronts = ["entropy", "systems", "re"];
  const ttf = {}; fronts.forEach((f) => { ttf[f] = gtlTTF(f, round, state, activeModifiers); });
  const optimalFront = [...fronts].sort((a, b) => ttf[a] - ttf[b])[0];
  const chosenFront = resolveChosenFront(roundEffects);
  const rankOfChosen = fronts.filter((f) => ttf[f] < ttf[chosenFront]).length;
  const gapMagnitude = rankOfChosen / (fronts.length - 1);
  const REFERENCE_TTF = 30;
  const severity = Math.max(0, Math.min(1, 1 - ttf[optimalFront] / REFERENCE_TTF));
  const helpMagnitude = Math.max(0, Math.abs(roundEffects[chosenFront] || 0));
  const levelEfficiency = 1 - Math.abs(severity - Math.min(1, helpMagnitude / 6.5));
  return { optimalFront, chosenFront, gapMagnitude: Number(gapMagnitude.toFixed(3)), levelEfficiency: Number(levelEfficiency.toFixed(3)) };
}

// ---- Belief / Distrust — reads GTL, persona-flavored. Numbers first-pass. ----
const BAD_CALL_THRESHOLD = 0.5;
const baseIncrement = (gtl) => (1 - gtl.gapMagnitude) * gtl.levelEfficiency;
const isBadCall = (gtl) => gtl.gapMagnitude > BAD_CALL_THRESHOLD;
const RICKY_B = { buildMultiplier: 0.7, threshold: 6, spendPayoutMultiplier: 1.6 };
const MAUDE_B = { buildMultiplier: 1.0, threshold: 10, spendPayoutMultiplier: 1.0, erosionScale: 0.15 };
const DEZ_B = { beliefThreshold: 6, distrustThreshold: -3, spendPayoutMultiplier: 1.0, defianceScale: 0.15, defianceCap: 0.9, partialRepair: 1 };
function stepRicky(prevBelief, gtl) {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  const belief = prevBelief + baseIncrement(gtl) * RICKY_B.buildMultiplier;
  return { belief, ready: belief >= RICKY_B.threshold };
}
function stepMaude(prevBelief, gtl, currentFrictionTaxPct) {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  let belief = prevBelief + baseIncrement(gtl) * MAUDE_B.buildMultiplier;
  if (currentFrictionTaxPct > 0) belief -= currentFrictionTaxPct * MAUDE_B.erosionScale;
  belief = Math.max(0, belief);
  return { belief, ready: belief >= MAUDE_B.threshold };
}
function stepDez(prevTrust, gtl) {
  let trust = isBadCall(gtl) ? prevTrust - 1 : prevTrust + baseIncrement(gtl);
  const belief = Math.max(0, trust), distrust = Math.max(0, -trust);
  const readyToSpend = trust >= DEZ_B.beliefThreshold;
  const overThreshold = trust < DEZ_B.distrustThreshold;
  const defianceChance = overThreshold ? Math.min(DEZ_B.defianceCap, (DEZ_B.distrustThreshold - trust) * DEZ_B.defianceScale) : 0;
  return { trust, belief, distrust, readyToSpend, defianceChance };
}

// ---- Maude's friction tax — redirecting off her native front (Systems). ----
const MAUDE_GRACE_ROUNDS = 3, MAUDE_BASE_TAX = 0.25, MAUDE_TAX_CAP = 0.70;
const MAUDE_ACCEL_STEPS = [0.06, 0.09, 0.13, 0.18];
function maudeTax(n) {
  if (n <= 0) return 0;
  if (n <= MAUDE_GRACE_ROUNDS) return MAUDE_BASE_TAX;
  let tax = MAUDE_BASE_TAX;
  for (let i = 0; i < n - MAUDE_GRACE_ROUNDS; i++) tax += MAUDE_ACCEL_STEPS[Math.min(i, MAUDE_ACCEL_STEPS.length - 1)];
  return Math.min(MAUDE_TAX_CAP, tax);
}

// ---- Dez's defiance override. Only fires when GTL's optimalFront is "re" —
// Aft's kit doesn't map onto entropy/systems, so nothing sensible to override to. ----
function resolveDezRound(prevTrust, gtl, dezChoice, rollFn = Math.random) {
  const step = stepDez(prevTrust, gtl);
  const canDefy = gtl.optimalFront === "re";
  const alreadyCorrect = dezChoice.abilityId === "patch_job";
  const defianceFired = canDefy && !alreadyCorrect && rollFn() < step.defianceChance;
  if (!defianceFired) return { ...step, defianceFired: false, overrideAbility: dezChoice.abilityId, overrideLevel: dezChoice.level };
  return { ...step, defianceFired: true, overrideAbility: "patch_job", overrideLevel: dezChoice.level };
}

// ---- Deferred-compounding bank tracking (shared by Threat Ledger, Reserve Cache, Stockpile).
// REDESIGNED 2026-08-20 (session 3): old model was a flat 2-round claim window
// with a fixed bonus/penalty -- either free money or a shrug, no real decision.
// New model: banked value compounds while held (~8%/round, soft-caps after 5
// rounds), and takes a haircut if a threat hits the front it's protecting while
// still open. Holding is a bet, not a countdown. Banks never auto-expire --
// claim whenever, for whatever the bank is currently worth. Claiming also ties
// a flat morale gain to patient, premeditated play, since morale otherwise had
// no active lever after the ability redesign dropped Analyze/Share the Take. ----
const BANK_GROWTH_RATE = 0.08;    // per round, compounding -- FIRST PASS, flag for Monte Carlo
const BANK_GROWTH_CAP_ROUNDS = 5; // growth locks after this many rounds held
const BANK_EXPOSURE_HAIRCUT = 0.30; // FIRST PASS, flag for Monte Carlo
const MORALE_ON_CLAIM = 5;        // FIRST PASS -- new morale lever

function tickBankGrowth(entry) {
  const roundsHeld = entry.roundsHeld + 1;
  const isQuickBarrier = ["suppress", "overclock", "patch_job"].includes(entry.abilityId);
  if (isQuickBarrier) return { ...entry, roundsHeld };
  if (roundsHeld > BANK_GROWTH_CAP_ROUNDS) return { ...entry, roundsHeld }; // locked: no further growth
  return { ...entry, banked: entry.banked * (1 + BANK_GROWTH_RATE), roundsHeld };
}
function applyBankExposure(entry, threatHitsFront) {
  if (entry.front !== threatHitsFront) return entry;
  return { ...entry, banked: entry.banked * (1 - BANK_EXPOSURE_HAIRCUT) };
}
function claimBank(entry) { return { front: entry.front, payout: entry.banked, moraleGain: MORALE_ON_CLAIM }; }

const CATEGORIES = {
  targeted:    { axis: "ruthless",   dmgRange: [12, 24],  hits: "systems", label: "Targeted",    tag: "threatens Systems Health" },
  telegraphed: { axis: "methodical", dmgRange: [6, 12],  hits: "entropy", label: "Telegraphed",  tag: "threatens to spike Entropy" },
  cascading:   { axis: "desperate",  dmgRange: [15, 30], hits: "re",      label: "Cascading",    tag: "threatens the Reality Engine" },
};

const EVENTS = [
  { id: "debris", title: "Drift Debris", prompt: "Wreckage tumbles past — salvageable, if someone's willing to reach for it.",
    choices: [
      { label: "Log it and let it pass", level: "I", effects: { salvage: 3 }, result: "The crew notes another loss, quietly." },
      { label: "Send someone out for it", level: "III", effects: { salvage: 10, systems: -4 }, result: "They got it. The hull didn't love the maneuver." },
    ] },
  { id: "signal", title: "A Voice in the Static", prompt: "Comms catch a fragment — another crew, or nothing at all.",
    choices: [
      { label: "Investigate carefully", level: "I", effects: { morale: 5, entropy: 2 }, result: "Nothing conclusive. But it felt good to hope." },
      { label: "Push through, chase it", level: "III", effects: { salvage: 8, re: -5 }, result: "Whatever it was, it cost more to find than it gave back." },
    ] },
  { id: "argument", title: "Argument Below Decks", prompt: "Tension boils over between two of the crew.",
    choices: [
      { label: "Mediate, hear them out", level: "I", effects: { morale: 6, entropy: 2 }, result: "It took time. It was worth it." },
      { label: "Pull rank, shut it down", level: "III", effects: { morale: -6 }, result: "Efficient. They won't forget it, though." },
    ] },
  { id: "hum", title: "A Working System", prompt: "Something in the machine is humming smoother than it has any right to.",
    choices: [
      { label: "Leave it alone", level: "I", effects: {}, result: "For once, nothing needs fixing." },
      { label: "Push it further", level: "III", effects: { systems: 12, entropy: 6 }, result: "It gave more than it should have. It'll remember the strain." },
    ] },
  { id: "rationing", title: "Rationing", prompt: "Supplies read thinner than the log says they should.",
    choices: [
      { label: "Ration evenly", level: "I", effects: { salvage: 3, morale: -3 }, result: "Grim, but fair. Nobody complained out loud." },
      { label: "Break into reserve now", level: "III", effects: { salvage: 9, re: -4 }, result: "The reserve wasn't built to be accessed like that." },
    ] },
  { id: "quiet_hour", title: "A Quiet Hour", prompt: "A genuine lull. The crew has real time on their hands.",
    choices: [
      { label: "Let them rest", level: "I", effects: { morale: 8 }, result: "Sleep, mostly. It mattered more than it looked." },
      { label: "Put the time to work", level: "III", effects: { salvage: 6, entropy: 3 }, result: "Productive. Nobody rested." },
    ] },
  { id: "stowaway", title: "Something in the Walls", prompt: "A reading that shouldn't exist, somewhere it shouldn't be.",
    choices: [
      { label: "Seal it off, ignore it", level: "I", effects: { entropy: 3 }, result: "Out of sight. It doesn't feel out of mind." },
      { label: "Hunt it down", level: "III", effects: { morale: 6, systems: -6 }, result: "Found it. Cost more to catch than to have left alone." },
    ] },
  { id: "old_log", title: "An Old Log Entry", prompt: "A recording surfaces from whoever had this post before.",
    choices: [
      { label: "Play it for the crew", level: "I", effects: { morale: 4, entropy: 2 }, result: "Some comfort. Some weight, too." },
      { label: "Delete it, keep moving", level: "III", effects: { entropy: -3 }, result: "Efficient. Nobody asked what was in it." },
    ] },
  { id: "gift", title: "A Working Trade", prompt: "A chance to offload something for something else entirely.",
    choices: [
      { label: "Take the fair deal", level: "I", effects: { salvage: 4, morale: 2 }, result: "Simple. Nobody regrets simple." },
      { label: "Push for more", level: "III", effects: { salvage: 12, morale: -4 }, result: "Got more. It didn't feel like winning." },
    ] },
  { id: "malfunction", title: "A False Alarm", prompt: "Every light on the board goes red at once — then, nothing.",
    choices: [
      { label: "Stand down slowly", level: "I", effects: { morale: 3 }, result: "Nerves settle. Barely." },
      { label: "Force a full diagnostic", level: "III", effects: { entropy: -6, morale: -2 }, result: "Confirmed clean. The checking cost something too." },
    ] },
];

const CEILINGS = { ruthless: 0.553, methodical: 0.650, desperate: 0.421 };
const K = 8, FLOOR = 0.20;
const AMBIENT_BASE = 0.2, AMBIENT_GROWTH = 0.06;
const SYSTEMS_WEAR_BASE = 0.35, SYSTEMS_WEAR_GROWTH = 0.03;
const RE_WEAR_BASE = 0.35, RE_WEAR_GROWTH = 0.03;
const LULL_BASE = 0.46, LULL_DECAY = 0.005, LULL_MIN = 0.05;
const EVENT_SHARE = 0.8; // of the "no direct threat" branch, most of it is now an Event
const TELEGRAPH_MITIGATION = 0.5;
const SALVAGE_PASSIVE = 2.0, SALVAGE_SPEND_CAP = 4.0, SALVAGE_CONVERT_RATIO = 1.3;
const SALVAGE_EFF = { entropy: 0.85, systems: 0.935, re: 0.935 };
const METER_CAP = 130;
const BUFFER_DECAY = 8;
const LEVELS_SALVAGE = { I: 1.5, II: 3.5, III: 6.5 }; // Engineer pays Salvage, not Entropy -- Systems is the physical/material front

const MORALE_START = 100;
const MORALE_PRESSURE_DRAIN = 2;
const MORALE_RECKLESS_DRAIN = 3;
const MORALE_PRESSURE_THRESHOLD = 30;

const CREW_LINES = {
  targeted:    ["\"Direct hit. Coordinates confirmed — that wasn't luck.\"", "\"Clean strike. It knew exactly where to aim.\"", "\"Reading the impact now. Precise. Too precise.\""],
  telegraphed: ["\"It's building. We have time — not much.\"", "\"Still growing. If we leave it, it won't stay small.\"", "\"That's not resolved yet. Someone needs to watch it.\""],
  cascading:   ["\"That's not — that's not supposed to fold like that.\"", "\"Multiple signatures, overlapping. I can't isolate it.\"", "\"The Engine's reading itself wrong. I don't — I don't know.\""],
};

const EPITAPHS = {
  ruthless: (r) => `${r} rounds. You forced every outcome you could reach. It burned bright, and it burned fast.`,
  methodical: (r) => `${r} rounds. You never rushed. The end still came — just later, and on your terms.`,
  desperate: (r) => `${r} rounds. You were always one bad round from this one. Somehow it took this long.`,
};
const MORALE_EPITAPH = (r) => `${r} rounds. The ship held. The Engine held. They didn't. Not the ship — them.`;

const COLORS = {
  void: "#0A0B10", panel: "#14151C", panel2: "#181A22", panelBorder: "#23252F",
  bone: "#E9E6DC", muted: "#6B6E7A",
  ruthless: "#6FA8FF", methodical: "#E8A33D", desperate1: "#FF4D6D", desperate2: "#8B5CF6",
  salvage: "#35D68A", danger: "#FF4757", morale: "#F0A6C0", event: "#C9A6F0", neutral: "#8B93A8",
};
const METER_KEY_COLOR = { systems: COLORS.ruthless, entropy: COLORS.methodical, re: COLORS.desperate1 };
const LEVEL_COLOR = { I: COLORS.salvage, II: COLORS.neutral, III: COLORS.desperate1 };

function weightedDraw(axisCounts, totalActions) {
  if (totalActions === 0) { const cats = Object.keys(CATEGORIES); return cats[Math.floor(Math.random() * cats.length)]; }
  const raw = { methodical: axisCounts.low / totalActions, ruthless: axisCounts.high / totalActions, desperate: axisCounts.desperate / totalActions };
  const strength = {}; for (const a in raw) strength[a] = Math.min(1, raw[a] / CEILINGS[a]);
  const weights = {}; for (const cat in CATEGORIES) weights[cat] = 1 + K * strength[CATEGORIES[cat].axis];
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  let probs = {}; for (const cat in weights) probs[cat] = weights[cat] / totalW;
  for (const cat in probs) probs[cat] = Math.max(probs[cat], FLOOR);
  const totalP = Object.values(probs).reduce((a, b) => a + b, 0);
  for (const cat in probs) probs[cat] /= totalP;
  const r = Math.random(); let cum = 0;
  for (const cat in probs) { cum += probs[cat]; if (r <= cum) return cat; }
  return Object.keys(probs)[Object.keys(probs).length - 1];
}

const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function computeReveal(round, entropy, axisCounts, totalActions, usedEventIds, relief = 0, lullBonus = 0, ambientBump = 0) {
  const ambient = (AMBIENT_BASE + AMBIENT_GROWTH * round + ambientBump) * rand(0.85, 1.15);
  let newEntropy = Math.max(0, entropy + ambient - relief);
  const lullChance = Math.max(LULL_MIN, LULL_BASE - LULL_DECAY * newEntropy + lullBonus);
  let incoming, eventId = null;
  if (Math.random() > lullChance) {
    incoming = weightedDraw(axisCounts, totalActions);
  } else if (Math.random() < EVENT_SHARE) {
    incoming = "event";
    let pool = EVENTS.filter((e) => !usedEventIds.includes(e.id));
    if (pool.length === 0) pool = EVENTS;
    eventId = pool[Math.floor(Math.random() * pool.length)].id;
  } else {
    incoming = "lull";
  }
  return { entropy: newEntropy, ambient, incoming, eventId };
}

const initialState = (anchorPersona = "ricky"): LogicState => {
  let profile;
  try {
    profile = getCaptainProfile();
  } catch {
    profile = null;
  }
  return {
    started: false, round: 0,
    entropy: 0, systems: 100, re: 100, morale: MORALE_START,
    salvage: 5,
    axisCounts: { low: 0, high: 0, desperate: 0 }, totalActions: 0,
    log: [], gameOver: null, lossType: null,
    lastBreakdown: null,
    incomingThreat: null, incomingEventId: null, usedEventIds: [],
    pendingRelief: 0, pendingLullBonus: 0,
    players: [{ roleId: "helm", ability: null, level: null }, { roleId: "engineer", ability: null, level: null }, { roleId: "aft", ability: null, level: null }],
    salvageTarget: "auto",
    anchorPersona,
    beliefOrTrust: 0, beliefReady: false, distrust: 0, defianceChance: 0,
    maudeCoverTarget: null, maudeConsecutiveCoverage: 0,
    activeModifiers: {}, // front -> {bump, roundsRemaining}
    openBanks: [], // {abilityId, front, banked, roundsHeld} -- compounds while held, hairs cut on exposure, never auto-expires
    lastDefiance: null,
    equippedRunes: [],
    helmName: profile?.helmName || "Helm",
    geneName: profile?.geneName || "Gene",
    salName: profile?.salName || "Sal",
    hullSkin: profile?.activeHullSkin || "titanium",
  };
};

const isUnderPressure = (state: LogicState): boolean => {
  return (
    state.entropy > 55 ||
    state.systems < 40 ||
    state.re < 40 ||
    state.morale < MORALE_PRESSURE_THRESHOLD
  );
};

export default function TheFracturePlaytest() {
  const [state, setState] = useState<LogicState>(initialState());
  const [savedRun, setSavedRun] = useState<LogicState | null>(() => loadRunState());
  const [historyList, setHistoryList] = useState<RunHistorySummary[]>(() => getRunHistory());
  const [designerView, setDesignerView] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [flashCat, setFlashCat] = useState(null);
  const [meterFlash, setMeterFlash] = useState(null);
  const [toast, setToast] = useState(null);
  const [bestRound, setBestRound] = useState(null);
  const [runsPlayed, setRunsPlayed] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [anchorChoice, setAnchorChoice] = useState<PersonaId | null>(() => {
    const prof: any = getCaptainProfile();
    return prof?.activeAnchor || null;
  });
  const [claimFront, setClaimFront] = useState(null);
  const [audioMuted, setAudioMuted] = useState<boolean>(() => isMuted());
  const [volume, setVolumeState] = useState<number>(() => {
    const prefs = getAudioPrefs();
    return prefs.volume;
  });
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [manifestOpen, setManifestOpen] = useState(false);
  const [loreOpen, setLoreOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [wdtOpen, setWdtOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [wdtAnswers, setWdtAnswers] = useState<Record<string, string>>({});
  const [wdtStep, setWdtStep] = useState(0);
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("All");
  const [openSubmenu, setOpenSubmenu] = useState<"intel" | "registry" | "ops" | null>(null);
  const [landingTab, setLandingTab] = useState<"logs" | "achievements" | "lore">("logs");

  const [captainProfile, setCaptainProfile] = useState<CaptainProfile>(() => getCaptainProfile());
  const [cosmeticsProfile, setCosmeticsProfile] = useState<CosmeticsProfile>(() => getCosmeticsProfile());
  const [highScoresList, setHighScoresList] = useState<HighScoreEntry[]>(() => getHighScores());
  const [postMortemResult, setPostMortemResult] = useState<{ analytics: RunAnalytics; highScore: HighScoreEntry; unlockedBadges: string[] } | null>(null);

  const [shipNameInput, setShipNameInput] = useState(() => getShipName());
  const [editingShipName, setEditingShipName] = useState(false);
  const [unlockedLoreList, setUnlockedLoreList] = useState<string[]>(() => getUnlockedLoreIds());
  const [unlockedAchList, setUnlockedAchList] = useState<string[]>(() => getUnlockedAchievementIds());
  const [manifestEntries, setManifestEntries] = useState<ShipLogEntry[]>(() => getCaptainsManifest());
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sharedStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .mono { font-family: 'JetBrains Mono', monospace; }
      @keyframes pulseGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes glitchShift { 0%,100% { transform: translate(0,0); filter: hue-rotate(0deg); } 20% { transform: translate(-1px,1px); filter: hue-rotate(15deg); } 40% { transform: translate(1px,-1px); filter: hue-rotate(-10deg); } 60% { transform: translate(-1px,-1px); filter: hue-rotate(20deg); } 80% { transform: translate(1px,1px); filter: hue-rotate(-15deg); } }
      @keyframes ringPulseBurst { 0% { r: 46; opacity: 1; } 100% { r: 62; opacity: 0; } }
      @keyframes warmBuild { 0% { opacity: 0.4; } 100% { opacity: 1; filter: brightness(1.3); } }
      @keyframes toastIn { 0% { opacity: 0; transform: translate(-50%, -8px) scale(0.96); } 15% { opacity: 1; transform: translate(-50%, 0) scale(1); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -4px) scale(0.98); } }
      @keyframes meterShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-3px); } 40% { transform: translateX(3px); } 60% { transform: translateX(-2px); } 80% { transform: translateX(2px); } }
      .core-ring { transition: stroke 0.4s ease, opacity 0.4s ease; }
      .flash-cascading { animation: glitchShift 0.35s steps(2) 3; }
      .flash-targeted circle:nth-child(2) { animation: ringPulseBurst 0.6s ease-out; }
      .flash-telegraphed circle:nth-child(2) { animation: warmBuild 0.9s ease-in; }
      .action-btn { transition: all 0.15s ease; }
      .action-btn:hover:not(:disabled) { transform: translateY(-1px); border-color: #454858 !important; }
      .primary-btn:hover:not(:disabled) { filter: brightness(1.08); }
      .impact-toast { position: fixed; top: 18px; left: 50%; z-index: 50; animation: toastIn 1.8s ease forwards; }
      .meter-hit { animation: meterShake 0.5s ease; }
      .level-pill { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
      .level-pill:hover:not(:disabled) { transform: translateY(-1.5px) scale(1.02); filter: brightness(1.22); }
      .level-pill:active:not(:disabled) { transform: translateY(0) scale(0.97); }
      /* Signature pulses -- each one embodies the persona's own mechanic, not decoration */
      @keyframes rickySpike { 0%,100% { transform: scaleY(0.3); opacity: 0.55; } 8% { transform: scaleY(1.4); opacity: 1; } 14% { transform: scaleY(0.25); opacity: 0.5; } 45% { transform: scaleY(0.35); opacity: 0.6; } 52% { transform: scaleY(1.15); opacity: 0.95; } 60% { transform: scaleY(0.2); opacity: 0.45; } }
      .pulse-ricky span { animation: rickySpike 2.6s ease-in-out infinite; animation-delay: calc(var(--i) * 0.09s); }
      @keyframes maudeBreathe { 0%,100% { transform: scaleY(0.55); opacity: 0.7; } 50% { transform: scaleY(0.85); opacity: 0.95; } }
      .pulse-maude span { animation: maudeBreathe 3.6s ease-in-out infinite; animation-delay: calc(var(--i) * 0.22s); }
      @keyframes dezStutter { 0%,100% { transform: scaleY(0.5); opacity: 0.5; } 10% { transform: scaleY(0.75); opacity: 0.85; } 18% { transform: scaleY(0.4); opacity: 0.4; } 30% { transform: scaleY(0.55); opacity: 0.5; } 55% { transform: scaleY(0.35); opacity: 0.35; } 70% { transform: scaleY(0.68); opacity: 0.8; } 78% { transform: scaleY(0.42); opacity: 0.45; } }
      .pulse-dez span { animation: dezStutter 2.9s ease-in-out infinite; animation-delay: calc(var(--i) * 0.31s); }
      @keyframes cardFloatIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      .anchor-card { animation: cardFloatIn 0.5s ease both; }
      
      /* Dynamic Jitter and Dash Flow styles for Refurbished Tactical Console */
      @keyframes dynamic-jitter {
        0% { transform: rotate(var(--jitter-min, -1deg)); }
        100% { transform: rotate(var(--jitter-max, 1deg)); }
      }
      @keyframes dash-flow {
        to { stroke-dashoffset: -20; }
      }
    `}</style>
  );

  const sector = Math.max(1, Math.floor((state.round - 1) / 10) + 1);

  // Relocated to avoid TDZ reference errors in the canvas useEffect hook dependency array:
  const underPressureNow = state.entropy > 55 || state.systems < 40 || state.re < 40 || state.morale < MORALE_PRESSURE_THRESHOLD;

  // Stable ref to access state in continuous animation loops without triggering re-runs:
  const stateRef = useRef({
    entropy: state.entropy,
    anchorPersona: state.anchorPersona,
    anchorChoice,
    started: state.started,
    underPressure: underPressureNow,
    round: state.round,
    gameOver: state.gameOver,
  });

  useEffect(() => {
    stateRef.current = {
      entropy: state.entropy,
      anchorPersona: state.anchorPersona,
      anchorChoice,
      started: state.started,
      underPressure: underPressureNow,
      round: state.round,
      gameOver: state.gameOver,
    };
  }, [state.entropy, state.anchorPersona, anchorChoice, state.started, underPressureNow, state.round, state.gameOver]);

  // Audio control effect
  useEffect(() => {
    synth.setMuted(audioMuted);
  }, [audioMuted]);

  // Canvas constellation / particle web animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const hexToRgb = (hex) => {
      const cleanHex = hex.replace("#", "");
      const bigint = parseInt(cleanHex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const initialPersona = stateRef.current.started ? stateRef.current.anchorPersona : (stateRef.current.anchorChoice || "ricky");
    const initialColor = ANCHORS[initialPersona]?.color || "#FF4D6D";
    let currentRgb = hexToRgb(initialColor);
    let currentSpeedScale = 0.55;
    let lastRound = stateRef.current.round;
    const shockwaves = [];

    const totalPoolSize = 60;
    const particles = Array.from({ length: totalPoolSize }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5),
      vy: (Math.random() - 0.5),
      size: Math.random() * 2 + 1.2,
      alpha: 0,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let animationId;
    const animate = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      const underPressure = stateRef.current.underPressure;
      const entropy = stateRef.current.entropy;
      const targetCount = underPressure ? 50 : 28;

      // Smoothly interpolate speed scale based on state values
      const entropyFactor = Math.max(0.4, entropy / 45);
      const targetSpeedScale = underPressure ? entropyFactor * 1.5 : entropyFactor * 0.55;
      currentSpeedScale += (targetSpeedScale - currentSpeedScale) * 0.04;

      // Smoothly interpolate RGB colors based on current anchor
      const activePersona = stateRef.current.started ? stateRef.current.anchorPersona : (stateRef.current.anchorChoice || "ricky");
      const targetColorHex = ANCHORS[activePersona]?.color || "#FF4D6D";
      const targetRgb = hexToRgb(targetColorHex);
      currentRgb.r += (targetRgb.r - currentRgb.r) * 0.05;
      currentRgb.g += (targetRgb.g - currentRgb.g) * 0.05;
      currentRgb.b += (targetRgb.b - currentRgb.b) * 0.05;

      const strokeColorStr = "rgba(" + Math.round(currentRgb.r) + ", " + Math.round(currentRgb.g) + ", " + Math.round(currentRgb.b);

      // Spawn resolution shockwaves
      if (stateRef.current.started && stateRef.current.round > lastRound) {
        shockwaves.push({
          x: width / 2,
          y: height / 2,
          radius: 0,
          maxRadius: Math.max(width, height) * 0.75,
          speed: 12,
        });
        lastRound = stateRef.current.round;
      } else if (stateRef.current.round < lastRound) {
        lastRound = stateRef.current.round;
      }

      // Update shockwaves
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += sw.speed;
        if (sw.radius > sw.maxRadius) {
          shockwaves.splice(sIdx, 1);
        }
      }

      // Render & Update particles
      ctx.lineWidth = 0.8;
      const jitterFactor = entropy > 50 ? Math.min(3, (entropy - 50) / 8) : 0;
      const flicker = underPressure ? (Math.random() > 0.06 ? 1 : 0.3) : 1;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // LERP individual opacity based on target count allocation
        const targetAlpha = i < targetCount ? (underPressure ? 0.95 : 0.7) : 0;
        p1.alpha += (targetAlpha - p1.alpha) * 0.05;

        if (p1.alpha < 0.01) continue;

        // Move particle
        p1.x += p1.vx * currentSpeedScale;
        p1.y += p1.vy * currentSpeedScale;

        // Wrap around boundaries smoothly
        if (p1.x < -20) p1.x = width + 20;
        if (p1.x > width + 20) p1.x = -20;
        if (p1.y < -20) p1.y = height + 20;
        if (p1.y > height + 20) p1.y = -20;

        // Jitter based on Entropy
        let finalX = p1.x;
        let finalY = p1.y;
        if (jitterFactor > 0) {
          finalX += (Math.random() - 0.5) * jitterFactor * 1.8;
          finalY += (Math.random() - 0.5) * jitterFactor * 1.8;
        }

        // Apply radial shockwave force pushes and brightness flares
        let brightnessMult = 1.0;
        for (let sIdx = 0; sIdx < shockwaves.length; sIdx++) {
          const sw = shockwaves[sIdx];
          const dx = finalX - sw.x;
          const dy = finalY - sw.y;
          const distToCenter = Math.hypot(dx, dy);
          const distToWave = Math.abs(distToCenter - sw.radius);
          if (distToWave < 75) {
            const waveIntensity = (1 - distToWave / 75) * ((sw.maxRadius - sw.radius) / sw.maxRadius);
            finalX += (dx / (distToCenter || 1)) * waveIntensity * 28;
            finalY += (dy / (distToCenter || 1)) * waveIntensity * 28;
            brightnessMult += waveIntensity * 2.2;
          }
        }

        // Under Pressure Pulsation
        let sizePulse = 1.0;
        if (underPressure) {
          sizePulse = 1.0 + Math.sin(timestamp * 0.006 + p1.pulseOffset) * 0.35;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(finalX, finalY, p1.size * sizePulse, 0, Math.PI * 2);
        const nodeAlpha = p1.alpha * Math.min(1, brightnessMult) * flicker;
        ctx.fillStyle = strokeColorStr + ", " + nodeAlpha + ")";
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.alpha < 0.01) continue;

          let p2FinalX = p2.x;
          let p2FinalY = p2.y;
          if (jitterFactor > 0) {
            p2FinalX += (Math.random() - 0.5) * jitterFactor * 1.8;
            p2FinalY += (Math.random() - 0.5) * jitterFactor * 1.8;
          }

          const dist = Math.hypot(finalX - p2FinalX, finalY - p2FinalY);
          const maxDist = underPressure ? 175 : 125;
          if (dist < maxDist) {
            const baseAlpha = (1 - dist / maxDist) * (underPressure ? 0.38 : 0.18);
            const lineAlpha = baseAlpha * Math.min(p1.alpha, p2.alpha) * brightnessMult * flicker;
            ctx.strokeStyle = strokeColorStr + ", " + lineAlpha + ")";
            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            ctx.lineTo(p2FinalX, p2FinalY);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Unlock triggers effect
  useEffect(() => {
    if (state.started && state.round >= 1) {
      if (unlockLoreId("sig_01")) setUnlockedLoreList(getUnlockedLoreIds());
      if (unlockAchievementId("ach_first_warp")) setUnlockedAchList(getUnlockedAchievementIds());
    }
    if (sector >= 2) {
      if (unlockLoreId("sig_03")) setUnlockedLoreList(getUnlockedLoreIds());
      if (unlockAchievementId("ach_sector_2")) setUnlockedAchList(getUnlockedAchievementIds());
    }
    if (sector >= 3) {
      if (unlockLoreId("sig_05")) setUnlockedLoreList(getUnlockedLoreIds());
      if (unlockAchievementId("ach_sector_3")) setUnlockedAchList(getUnlockedAchievementIds());
    }
    if (state.morale >= 90) {
      if (unlockLoreId("sig_06")) setUnlockedLoreList(getUnlockedLoreIds());
      if (unlockAchievementId("ach_morale_high")) setUnlockedAchList(getUnlockedAchievementIds());
    }
    if (state.entropy < 15 && state.round > 1) {
      if (unlockAchievementId("ach_entropy_low")) setUnlockedAchList(getUnlockedAchievementIds());
    }
    if (state.gameOver && state.gameOver.includes("VICTORY")) {
      if (unlockLoreId("sig_08")) setUnlockedLoreList(getUnlockedLoreIds());
      if (unlockAchievementId("ach_victory")) setUnlockedAchList(getUnlockedAchievementIds());
    }
  }, [state.started, state.round, sector, state.morale, state.entropy, state.gameOver]);

  // Auto-save active state
  useEffect(() => {
    if (state.started && !state.gameOver && state.round > 0) {
      saveRunState(state);
      setSavedRun(state);
    }
  }, [state]);

  // Record run history, process post-mortem analytics & submit high score, clear saved state on game over
  useEffect(() => {
    if (state.gameOver) {
      const runSector = Math.max(1, Math.floor((state.round - 1) / 10) + 1);
      recordRunHistory({ round: state.round, causeOfLoss: state.gameOver, sector: runSector });
      recordManifestEntry({
        shipName: shipNameInput || getShipName(),
        captainName: captainProfile.captainCallsign,
        round: state.round,
        sector: runSector,
        causeOfLoss: state.gameOver,
        anchorPersona: state.anchorPersona,
        victory: state.gameOver.includes("VICTORY"),
      });
      const completion = processRunCompletion(state, shipNameInput || getShipName(), captainProfile);
      setPostMortemResult(completion);
      setManifestEntries(getCaptainsManifest());
      setHighScoresList(getHighScores());
      setCosmeticsProfile(getCosmeticsProfile());
      clearRunState();
      setSavedRun(null);
      setHistoryList(getRunHistory());
    }
  }, [state.gameOver]);

  const handleResumeRun = () => {
    const saved = loadRunState();
    if (saved) {
      setState(saved);
    }
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [state.log]);
  useEffect(() => {
    (async () => {
      try { const best = await window.storage.get("prosis_best_round"); if (best) setBestRound(JSON.parse(best.value)); } catch (e) {}
      try { const runs = await window.storage.get("prosis_runs_played"); if (runs) setRunsPlayed(JSON.parse(runs.value)); } catch (e) {}
      setStatsLoaded(true);
    })();
  }, []);

  const recordRunEnd = async (finalRound) => {
    const newRuns = runsPlayed + 1;
    setRunsPlayed(newRuns);
    try { await window.storage.set("prosis_runs_played", JSON.stringify(newRuns)); } catch (e) {}
    if (bestRound === null || finalRound > bestRound) {
      setBestRound(finalRound);
      try { await window.storage.set("prosis_best_round", JSON.stringify(finalRound)); } catch (e) {}
    }
  };

  const dominantAxis = () => {
    const { low, high, desperate } = state.axisCounts;
    const total = state.totalActions || 1;
    const s = {
      methodical: Math.min(1, low / total / CEILINGS.methodical),
      ruthless: Math.min(1, high / total / CEILINGS.ruthless),
      desperate: Math.min(1, desperate / total / CEILINGS.desperate),
    };
    return Object.entries(s).sort((a, b) => b[1] - a[1])[0];
  };

  const setPlayerChoice = (idx, abilityId, level) => {
    if (state.gameOver) return;
    synth.playSfx("click");
    setState((s) => { const players = [...s.players]; players[idx] = { ...players[idx], ability: abilityId, level }; return { ...s, players }; });
  };

  const fireImpact = (catKey, hits, dmg, haircutHappened = false) => {
    if (!catKey || catKey === "lull") return;
    synth.playSfx("damage");
    const color = CATEGORIES[catKey].axis === "ruthless" ? COLORS.ruthless : CATEGORIES[catKey].axis === "methodical" ? COLORS.methodical : COLORS.desperate1;
    const text = haircutHappened 
      ? `⚠️ BARRIER HAIRCUT (-30%)! ${CATEGORIES[catKey].label.toUpperCase()} hit ${meterLabelStatic[hits]} -${dmg.toFixed(1)}`
      : `${CATEGORIES[catKey].label.toUpperCase()} — ${meterLabelStatic[hits]} -${dmg.toFixed(1)}`;
    setToast({ text, color: haircutHappened ? COLORS.danger : color });
    setMeterFlash(hits); setFlashCat(catKey);
    setTimeout(() => setToast(null), 1800);
    setTimeout(() => setMeterFlash(null), 700);
    setTimeout(() => setFlashCat(null), 900);
  };

  const finalizeRound = (prev, mutated, breakdown, round) => {
    let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds, pendingRelief, pendingLullBonus,
      activeModifiers = prev.activeModifiers, openBanks = prev.openBanks, beliefOrTrust = prev.beliefOrTrust, beliefReady = prev.beliefReady,
      distrust = prev.distrust, defianceChance = prev.defianceChance, maudeConsecutiveCoverage = prev.maudeConsecutiveCoverage,
      lastDefiance = prev.lastDefiance } = mutated;
    entropy = Math.max(0, entropy); systems = clamp(systems, 0, METER_CAP); re = clamp(re, 0, METER_CAP); morale = clamp(morale, 0, 100);

    let gameOver = null, lossType = null;
    if (systems <= 0 || re <= 0) {
      gameOver = systems <= 0 ? "Systems failure. Nothing left holding the ship together." : "Reality Engine failure. The Engine gives out.";
      lossType = "mechanical"; log = [...log, { type: "loss", reason: gameOver }];
    }
    if (!gameOver && entropy >= 100) { gameOver = "Entropy reached maximum. The process completes itself."; lossType = "mechanical"; log = [...log, { type: "loss", reason: gameOver }]; }
    if (!gameOver && morale <= 0) { gameOver = "Crew Morale collapsed. The will to continue is gone."; lossType = "morale"; log = [...log, { type: "loss", reason: gameOver }]; }

    if (!gameOver && round >= 30) {
      gameOver = "VICTORY! You survived 30 rounds and escaped Sector 3!";
      synth.playSfx("victory");
      log = [...log, { type: "loss", reason: gameOver }];
    }

    if (gameOver) setTimeout(() => recordRunEnd(round), 0);

    let nextRound = round, nextIncoming = null, nextEventId = null;
    if (!gameOver) {
      nextRound = round + 1;
      synth.playSfx("warp");
      const ambientBump = (activeModifiers.entropy && activeModifiers.entropy.roundsRemaining > 0) ? activeModifiers.entropy.bump : 0;
      const reveal = computeReveal(nextRound, entropy, axisCounts, totalActions, usedEventIds, pendingRelief, pendingLullBonus, ambientBump);
      entropy = reveal.entropy; nextIncoming = reveal.incoming; nextEventId = reveal.eventId;
    }

    return {
      ...prev, round: nextRound, entropy, systems, re, morale, salvage,
      axisCounts, totalActions, log, gameOver, lossType, usedEventIds,
      pendingRelief: 0, pendingLullBonus: 0,
      activeModifiers, openBanks, beliefOrTrust, beliefReady, distrust, defianceChance, maudeConsecutiveCoverage, lastDefiance,
      lastBreakdown: breakdown, incomingThreat: gameOver ? prev.incomingThreat : nextIncoming,
      incomingEventId: gameOver ? prev.incomingEventId : nextEventId,
      players: prev.players.map((p) => ({ ...p, ability: null, level: null })),
    };
  };

  const applyLevelTax = (level, underPressure, axisCounts, breakdown, moraleRef, actionLabel) => {
    if (level === "I") axisCounts.low += 1;
    if (level === "III") {
      axisCounts.high += 1;
      if (underPressure) axisCounts.desperate += 1;
      else { moraleRef.v = Math.max(0, moraleRef.v - MORALE_RECKLESS_DRAIN); breakdown.moraleDelta -= MORALE_RECKLESS_DRAIN; breakdown.moraleNotes.push(`-${MORALE_RECKLESS_DRAIN} (${actionLabel} III, unforced risk)`); }
    }
    // level II is neutral -- costs Entropy like the others but doesn't feed the axis compounding system
  };

  const resolveRound = () => {
    if (state.gameOver) return;
    if (state.players.some((p) => !p.ability)) return;

    setState((prev) => {
      const round = prev.round;
      let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds, pendingRelief, pendingLullBonus } = prev;
      log = [...log, { type: "round", round }];

      const breakdown = { threat: null, actionsCost: 0, actionsTaken: [], salvageGained: 0, salvageSpent: 0, salvageTarget: null, salvageRestored: 0, moraleDelta: 0, moraleNotes: [], systemsDecay: 0, reDecay: 0 };

      if (systems > 100) { const d = Math.min(BUFFER_DECAY, systems - 100); systems -= d; breakdown.systemsDecay = d; }
      if (re > 100) { const d = Math.min(BUFFER_DECAY, re - 100); re -= d; breakdown.reDecay = d; }
      systems -= (SYSTEMS_WEAR_BASE + SYSTEMS_WEAR_GROWTH * round) * rand(0.85, 1.15);
      re -= (RE_WEAR_BASE + RE_WEAR_GROWTH * round) * rand(0.85, 1.15);

      const catKey = prev.incomingThreat;
      let dmg = 0, mitigated = false, hits = null;
      if (catKey !== "lull") {
        const catDef = CATEGORIES[catKey];
        hits = catDef.hits; dmg = rand(...catDef.dmgRange);
        if (catKey === "telegraphed" && Math.random() < TELEGRAPH_MITIGATION) { dmg *= 0.4; mitigated = true; }
      } else {
        morale = Math.min(100, morale + 2); breakdown.moraleDelta += 2; breakdown.moraleNotes.push("+2 (quiet round)");
      }

      const preActionUnderPressure = entropy > 55 || systems < 40 || re < 40 || morale < MORALE_PRESSURE_THRESHOLD;
      // BUG FIX 2026-08-20: pressure driving the morale DRAIN specifically must not
      // include morale itself, or low morale becomes a closed loop that drains
      // itself regardless of what the player does. Other fronts being critical
      // still legitimately cost morale; low morale should read as bad (the UI
      // banner and Level III framing above still use the full definition) but
      // shouldn't be able to bootstrap its own decline.
      const pressureForMoraleDrain = entropy > 55 || systems < 40 || re < 40;
      const newAxisCounts = { ...axisCounts };
      let roundEntropyCost = 0;
      const actionsTaken = [];
      const moraleRef = { v: morale };
      // Chart Ahead (pendingRelief/pendingLullBonus's old feeder) is retired -- Threat Ledger
      // replaces it via the bank/claim system below, not the ambient-reveal formula.
      const newPendingRelief = 0, newPendingLullBonus = 0;
      const anchorPersona = prev.anchorPersona;
      const frontLabel = { entropy: "Entropy", systems: "Systems", re: "Reality Engine" };

      // ---- Pass 1: resolve each role's chosen ability/level/params, no mutation yet ----
      const resolvePlayer = (roleId) => {
        const player = prev.players.find((p) => p.roleId === roleId);
        const role = ROLES.find((r) => r.id === roleId);
        const ability = role.abilities.find((a) => a.id === player.ability);
        return { role, ability, level: player.level, params: ability.levels[player.level] };
      };
      const h = resolvePlayer("helm");
      const e = resolvePlayer("engineer");
      const a = resolvePlayer("aft");

      const engCost = LEVELS_SALVAGE[e.level];
      const engActualFunded = Math.min(salvage, engCost);
      const engCostScale = engCost > 0 ? engActualFunded / engCost : 1.0;

      // Maude's redirect: her native front is Systems. If she's covering another front,
      // Engineer's immediate gain (if the ability has one) is taxed and rerouted.
      const isMaude = anchorPersona === "maude";
      const coverTarget = isMaude ? prev.maudeCoverTarget : null;
      const engineerHasImmediateGain = e.ability.shape !== "deferred_compounding" && e.ability.shape !== "same_front_later" && typeof e.params.systemsDelta === "number";
      const engineerRedirecting = isMaude && coverTarget && coverTarget !== "systems" && engineerHasImmediateGain;
      const engineerTaxPct = engineerRedirecting ? maudeTax(prev.maudeConsecutiveCoverage + 1) : 0;

      // ---- Proposed per-front deltas this round, for GTL ----
      const proposed = { entropy: 0, systems: 0, re: 0 };
      if (h.ability.shape !== "deferred_compounding" && h.ability.shape !== "same_front_later") { proposed.entropy += (h.params.entropyDelta || 0); proposed.systems += (h.params.systemsDelta || 0); }
      if (e.ability.shape !== "deferred_compounding" && e.ability.shape !== "same_front_later") {
        const gain = (e.params.systemsDelta || 0) * engCostScale;
        if (engineerRedirecting) {
          if (coverTarget === "entropy") proposed.entropy += -gain * (1 - engineerTaxPct);
          if (coverTarget === "re") proposed.re += gain * (1 - engineerTaxPct);
        } else {
          proposed.systems += gain;
        }
        proposed.entropy += (e.params.entropyDelta || 0) * engCostScale;
      }
      if (a.ability.shape !== "deferred_compounding" && a.ability.shape !== "same_front_later") proposed.re += (a.params.reDelta || 0);
      // BUG FIX 2026-08-20: deferred/banking picks previously counted as 0 immediate
      // help toward GTL, meaning GTL couldn't recognize "banking toward RE" as
      // helping RE at all this round -- a real gap when all three roles bank in
      // the same round (chosenFront would fall back to an arbitrary default).
      // Banking is a real prioritization decision even though the meter doesn't
      // move until claimed, so it earns partial credit toward the front it protects.
      const BANKING_GTL_CREDIT = 0.4; // FIRST PASS, flag for Monte Carlo tuning
      const addBankingCredit = (ability, params) => {
        if (ability.shape !== "deferred_compounding" && ability.shape !== "same_front_later") return;
        const credit = params.banked * BANKING_GTL_CREDIT;
        if (ability.front === "entropy") proposed.entropy -= credit; // entropy: relief is a negative delta
        else proposed[ability.front] += credit; // systems/re: gain is a positive delta
      };
      addBankingCredit(h.ability, h.params);
      addBankingCredit(e.ability, e.params);
      addBankingCredit(a.ability, a.params);

      // ---- GTL, computed once against the proposed round (drives Dez's defiance AND Belief/Distrust for all three) ----
      const gtl = computeGTL(round, { entropy, systems, re }, proposed, prev.activeModifiers);

      // ---- Dez's defiance: decide before applying Aft's effect ----
      const isDez = anchorPersona === "dez";
      let aftUse = a; let lastDefiance = null;
      let beliefOrTrust = prev.beliefOrTrust, beliefReady = prev.beliefReady, distrust = prev.distrust, defianceChance = prev.defianceChance;
      if (isDez) {
        const step = resolveDezRound(prev.beliefOrTrust, gtl, { abilityId: a.ability.id, level: a.level });
        beliefOrTrust = step.trust; distrust = step.distrust; defianceChance = step.defianceChance; beliefReady = step.readyToSpend;
        if (step.defianceFired) {
          const patchAbility = ROLES.find((r) => r.id === "aft").abilities.find((ab) => ab.id === "patch_job");
          aftUse = { role: a.role, ability: patchAbility, level: a.level, params: patchAbility.levels[a.level] };
          lastDefiance = { from: a.ability.label, to: patchAbility.label, level: a.level };
          log = [...log, { type: "defiance", from: a.ability.label, to: patchAbility.label, level: a.level }];
        }
      } else if (anchorPersona === "ricky") {
        const step = stepRicky(prev.beliefOrTrust, gtl);
        beliefOrTrust = step.belief; beliefReady = step.ready;
      } else if (isMaude) {
        const step = stepMaude(prev.beliefOrTrust, gtl, engineerTaxPct);
        beliefOrTrust = step.belief; beliefReady = step.ready;
      }

      // ---- Pass 2: apply everything ----
      // Tick growth + exposure on barriers that existed BEFORE this round -- barriers
      // raised this round start fresh next round, not ticked the same round they're raised.
      // Gene's Dead Reckoning buys existing barriers extra rounds before the growth cap;
      // Sal's Ration the Take shields existing barriers from this round's exposure entirely.
      const deadReckoningExtend = e.ability.id === "dead_reckoning" ? (e.params.extend || 0) : 0;
      const rationShielded = aftUse.ability.id === "ration_the_take" && !!aftUse.params.shield;
      const haircutHappened = catKey !== "lull" && hits && !rationShielded && prev.openBanks.some(b => b.front === hits);
      let newOpenBanks = prev.openBanks
        .map((b) => (deadReckoningExtend > 0 ? { ...b, roundsHeld: Math.max(0, b.roundsHeld - deadReckoningExtend) } : b))
        .map(tickBankGrowth);
      if (catKey !== "lull" && hits && !rationShielded) newOpenBanks = newOpenBanks.map((b) => applyBankExposure(b, hits));
      const newActiveModifiers = {};
      // carry forward + tick down modifiers already active entering this round; new ones (below) apply starting next round
      Object.entries(prev.activeModifiers).forEach(([front, m]) => {
        const roundsRemaining = m.roundsRemaining - 1;
        if (roundsRemaining > 0) newActiveModifiers[front] = { bump: m.bump, roundsRemaining };
      });

      // Helm
      applyLevelTax(h.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, h.ability.label);
      totalActions += 1; roundEntropyCost += LEVELS[h.level].cost;
      actionsTaken.push({ role: h.role.personalName, label: `${h.ability.label} ${h.level}` });
      if (h.ability.id === "analyze") {
        if (catKey !== "lull") { dmg *= (1 - h.params.mitigation); mitigated = true; }
        moraleRef.v = Math.min(100, moraleRef.v + h.params.morale);
        breakdown.moraleDelta += h.params.morale; breakdown.moraleNotes.push(`+${h.params.morale} (Analyze)`);
      }
      if (h.ability.shape === "deferred_compounding" || h.ability.shape === "same_front_later") {
        newOpenBanks.push({ abilityId: h.ability.id, front: h.ability.front, banked: h.params.banked, roundsHeld: 0 });
      } else {
        entropy = Math.max(0, entropy + (h.params.entropyDelta || 0));
        systems += (h.params.systemsDelta || 0);
      }

      // Engineer
      applyLevelTax(e.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, e.ability.label);
      totalActions += 1; salvage -= engActualFunded;
      actionsTaken.push({ role: e.role.personalName, label: `${e.ability.label} ${e.level}${engineerRedirecting ? ` → ${frontLabel[coverTarget]} (${(engineerTaxPct * 100).toFixed(0)}% tax)` : ""}` });
      if (e.ability.id === "dead_reckoning" && catKey !== "lull") { dmg *= (1 - e.params.mitigation); mitigated = true; }
      if (e.ability.shape === "deferred_compounding" || e.ability.shape === "same_front_later") {
        newOpenBanks.push({ abilityId: e.ability.id, front: e.ability.front, banked: e.params.banked, roundsHeld: 0 });
      } else {
        const gain = (e.params.systemsDelta || 0) * engCostScale;
        if (engineerRedirecting) {
          if (coverTarget === "entropy") entropy = Math.max(0, entropy - gain * (1 - engineerTaxPct));
          if (coverTarget === "re") re += gain * (1 - engineerTaxPct);
        } else {
          systems += gain;
        }
        entropy += (e.params.entropyDelta || 0) * engCostScale;
      }
      const newMaudeConsecutiveCoverage = engineerRedirecting ? prev.maudeConsecutiveCoverage + 1 : 0;

      // Aft (post-defiance-resolution)
      applyLevelTax(aftUse.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, aftUse.ability.label);
      totalActions += 1; roundEntropyCost += LEVELS[aftUse.level].cost;
      actionsTaken.push({ role: aftUse.role.personalName, label: `${aftUse.ability.label} ${aftUse.level}${lastDefiance ? " (crew override)" : ""}` });
      if (aftUse.ability.id === "ration_the_take" && catKey !== "lull") { dmg *= (1 - aftUse.params.mitigation); mitigated = true; }
      if (aftUse.ability.shape === "deferred_compounding" || aftUse.ability.shape === "same_front_later") {
        newOpenBanks.push({ abilityId: aftUse.ability.id, front: aftUse.ability.front, banked: aftUse.params.banked, roundsHeld: 0 });
      } else {
        salvage += (aftUse.params.salvageDelta || 0);
        re += (aftUse.params.reDelta || 0);
      }

      morale = moraleRef.v;

      if (catKey !== "lull") {
        if (hits === "systems") systems -= dmg;
        if (hits === "entropy") entropy += dmg;
        if (hits === "re") re -= dmg;
        const line = CREW_LINES[catKey][Math.floor(Math.random() * CREW_LINES[catKey].length)];
        breakdown.threat = { category: catKey, dmg, hits, mitigated };
        log = [...log, { type: "threat", category: catKey, dmg: dmg.toFixed(1), hits, mitigated, line }];
        fireImpact(catKey, hits, dmg, haircutHappened);
      } else {
        log = [...log, { type: "lull" }];
      }

      entropy += roundEntropyCost;
      breakdown.actionsCost = roundEntropyCost; breakdown.actionsTaken = actionsTaken;

      if (pressureForMoraleDrain) { morale = Math.max(0, morale - MORALE_PRESSURE_DRAIN); breakdown.moraleDelta -= MORALE_PRESSURE_DRAIN; breakdown.moraleNotes.push(`-${MORALE_PRESSURE_DRAIN} (sustained pressure)`); }

      salvage += SALVAGE_PASSIVE; breakdown.salvageGained = SALVAGE_PASSIVE;
      const spend = Math.min(salvage, SALVAGE_SPEND_CAP); salvage -= spend;
      const usable = spend * SALVAGE_CONVERT_RATIO;
      const deficits = { entropy: entropy / 100, systems: (100 - systems) / 100, re: (100 - re) / 100 };
      let target = prev.salvageTarget;
      if (target === "auto") target = Object.entries(deficits).sort((a, b) => b[1] - a[1])[0][0];
      let restored = 0;
      if (target === "entropy") { restored = usable * SALVAGE_EFF.entropy; entropy -= restored; }
      if (target === "systems") { restored = usable * SALVAGE_EFF.systems; systems += restored; }
      if (target === "re") { restored = usable * SALVAGE_EFF.re; re += restored; }
      breakdown.salvageSpent = spend; breakdown.salvageTarget = target; breakdown.salvageRestored = restored;

      // ---- Auto-discharge quick barriers (same_front_later shape) held for at least 1 round ----
      const remainingBanks: typeof newOpenBanks = [];
      newOpenBanks.forEach((b) => {
        const isQuick = ["suppress", "overclock", "patch_job"].includes(b.abilityId);
        if (isQuick && b.roundsHeld >= 1) {
          const { front, payout, moraleGain } = claimBank(b);
          if (front === "entropy") entropy = Math.max(0, entropy - payout);
          if (front === "systems") systems += payout;
          if (front === "re") re += payout;
          morale = clamp(morale + moraleGain, 0, 100);
          log = [...log, { 
            type: "bank_claimed", 
            front, 
            payout, 
            moraleGain, 
            isAuto: true,
            label: b.abilityId === "suppress" ? "Suppress" : b.abilityId === "overclock" ? "Overclock" : "Patch Job" 
          }];
        } else {
          remainingBanks.push(b);
        }
      });
      newOpenBanks = remainingBanks;

      return finalizeRound(prev, {
        entropy, systems, re, morale, salvage, axisCounts: newAxisCounts, totalActions, log, usedEventIds,
        pendingRelief: newPendingRelief, pendingLullBonus: newPendingLullBonus,
        activeModifiers: newActiveModifiers, openBanks: newOpenBanks, beliefOrTrust, beliefReady, distrust, defianceChance,
        maudeConsecutiveCoverage: newMaudeConsecutiveCoverage, lastDefiance,
      }, breakdown, round);
    });
  };

  const resolveEventChoice = (choice) => {
    if (state.gameOver) return;
    setState((prev) => {
      const round = prev.round;
      let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds } = prev;
      log = [...log, { type: "round", round }];

      const breakdown = { threat: null, actionsCost: 0, actionsTaken: [], salvageGained: 0, salvageSpent: 0, salvageTarget: null, salvageRestored: 0, moraleDelta: 0, moraleNotes: [], systemsDecay: 0, reDecay: 0 };
      if (systems > 100) { const d = Math.min(BUFFER_DECAY, systems - 100); systems -= d; breakdown.systemsDecay = d; }
      if (re > 100) { const d = Math.min(BUFFER_DECAY, re - 100); re -= d; breakdown.reDecay = d; }
      systems -= (SYSTEMS_WEAR_BASE + SYSTEMS_WEAR_GROWTH * round) * rand(0.85, 1.15);
      re -= (RE_WEAR_BASE + RE_WEAR_GROWTH * round) * rand(0.85, 1.15);

      const event = EVENTS.find((e) => e.id === prev.incomingEventId);
      const newAxisCounts = { ...axisCounts };
      const preActionUnderPressure = entropy > 55 || systems < 40 || re < 40 || morale < MORALE_PRESSURE_THRESHOLD;
      const pressureForMoraleDrain = entropy > 55 || systems < 40 || re < 40; // see resolveRound for why morale is excluded here
      const moraleRef = { v: morale };
      applyLevelTax(choice.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, event.title);
      morale = moraleRef.v;
      totalActions += 1;

      const eff = choice.effects || {};
      if (eff.entropy) entropy = Math.max(0, entropy + eff.entropy);
      if (eff.systems) systems += eff.systems;
      if (eff.re) re += eff.re;
      if (eff.salvage) { salvage += eff.salvage; breakdown.salvageGained += eff.salvage; }
      if (eff.morale) { morale = clamp(morale + eff.morale, 0, 100); breakdown.moraleDelta += eff.morale; breakdown.moraleNotes.push(`${eff.morale >= 0 ? "+" : ""}${eff.morale} (${event.title})`); }

      if (pressureForMoraleDrain) { morale = Math.max(0, morale - MORALE_PRESSURE_DRAIN); breakdown.moraleDelta -= MORALE_PRESSURE_DRAIN; breakdown.moraleNotes.push(`-${MORALE_PRESSURE_DRAIN} (sustained pressure)`); }

      salvage += SALVAGE_PASSIVE; breakdown.salvageGained += SALVAGE_PASSIVE;
      const spend = Math.min(salvage, SALVAGE_SPEND_CAP); salvage -= spend;
      const usable = spend * SALVAGE_CONVERT_RATIO;
      const deficits = { entropy: entropy / 100, systems: (100 - systems) / 100, re: (100 - re) / 100 };
      let target = prev.salvageTarget;
      if (target === "auto") target = Object.entries(deficits).sort((a, b) => b[1] - a[1])[0][0];
      let restored = 0;
      if (target === "entropy") { restored = usable * SALVAGE_EFF.entropy; entropy -= restored; }
      if (target === "systems") { restored = usable * SALVAGE_EFF.systems; systems += restored; }
      if (target === "re") { restored = usable * SALVAGE_EFF.re; re += restored; }
      breakdown.salvageSpent = spend; breakdown.salvageTarget = target; breakdown.salvageRestored = restored;

      log = [...log, { type: "event", title: event.title, choice: choice.label, result: choice.result }];
      setToast({ text: `${event.title.toUpperCase()} — ${choice.label}`, color: COLORS.event });
      setTimeout(() => setToast(null), 1800);
      usedEventIds = [...usedEventIds, event.id];

      return finalizeRound(prev, { entropy, systems, re, morale, salvage, axisCounts: newAxisCounts, totalActions, log, usedEventIds, pendingRelief: 0, pendingLullBonus: 0 }, breakdown, round);
    });
  };

  const claimBankAction = (bankIdx) => {
    if (state.gameOver) return;
    synth.playSfx("click");
    setState((prev) => {
      const entry = prev.openBanks[bankIdx];
      if (!entry) return prev;
      const { front, payout, moraleGain } = claimBank(entry);
      let { entropy, systems, re, morale } = prev;
      if (front === "entropy") entropy = Math.max(0, entropy - payout);
      if (front === "systems") systems += payout;
      if (front === "re") re += payout;
      morale = clamp(morale + moraleGain, 0, 100);
      const openBanks = prev.openBanks.filter((_, i) => i !== bankIdx);
      setToast({ text: `CLAIMED — +${payout.toFixed(1)} ${front === "entropy" ? "Entropy relief" : front === "systems" ? "Systems" : "Reality Engine"}, +${moraleGain} Morale`, color: COLORS.salvage });
      setTimeout(() => setToast(null), 1800);
      return { ...prev, entropy, systems, re, morale, openBanks, log: [...prev.log, { type: "bank_claimed", front, payout, moraleGain }] };
    });
  };

  const spendBelief = (front) => {
    if (state.gameOver || !state.beliefReady) return;
    synth.playSfx("click");
    setState((prev) => {
      const persona = prev.anchorPersona;
      const multiplier = persona === "ricky" ? RICKY_B.spendPayoutMultiplier : persona === "maude" ? MAUDE_B.spendPayoutMultiplier : DEZ_B.spendPayoutMultiplier;
      const payout = BASE_HEAL * multiplier;
      let { entropy, systems, re } = prev;
      if (front === "entropy") entropy = Math.max(0, entropy - payout);
      if (front === "systems") systems += payout;
      if (front === "re") re += payout;
      setToast({ text: `BELIEF SPENT — +${payout.toFixed(1)} ${front === "entropy" ? "Entropy relief" : front === "systems" ? "Systems" : "Reality Engine"}`, color: ANCHORS[persona].color });
      setTimeout(() => setToast(null), 1800);
      return { ...prev, entropy, systems, re, beliefOrTrust: 0, beliefReady: false, log: [...prev.log, { type: "belief_spent", front, payout }] };
    });
  };

  const launchVoyage = () => {
    if (!anchorChoice) return;
    synth.playSfx("warp");
    setState(() => {
      const base = initialState(anchorChoice);
      const reveal = computeReveal(1, 0, base.axisCounts, 0, []);
      return {
        ...base,
        started: true,
        round: 1,
        entropy: reveal.entropy,
        incomingThreat: reveal.incoming,
        incomingEventId: reveal.eventId,
        log: [{ type: "intro" }],
        equippedRunes: base.equippedRunes || [],
        helmName: base.helmName || captainProfile?.helmName || "Helm",
        geneName: base.geneName || captainProfile?.geneName || "Gene",
        salName: base.salName || captainProfile?.salName || "Sal",
        hullSkin: base.hullSkin || captainProfile?.activeHullSkin || "titanium",
      };
    });
  };
  const launchNextVoyage = () => {
    synth.playSfx("warp");
    setState((prev) => {
      const base = initialState(prev.anchorPersona);
      const reveal = computeReveal(1, 0, base.axisCounts, 0, []);
      return {
        ...base,
        started: true,
        round: 1,
        entropy: reveal.entropy,
        incomingThreat: reveal.incoming,
        incomingEventId: reveal.eventId,
        log: [{ type: "intro" }],
        equippedRunes: base.equippedRunes || [],
        helmName: base.helmName || captainProfile?.helmName || "Helm",
        geneName: base.geneName || captainProfile?.geneName || "Gene",
        salName: base.salName || captainProfile?.salName || "Sal",
        hullSkin: base.hullSkin || captainProfile?.activeHullSkin || "titanium",
      };
    });
    setFlashCat(null); setToast(null); setMeterFlash(null);
  };
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const fullReset = () => {
    synth.playSfx("click");
    setConfirmResetOpen(true);
  };
  const executeFullReset = () => {
    synth.playSfx("click");
    resetAllData();
    setState(initialState());
    setAnchorChoice(null);
    setFlashCat(null);
    setToast(null);
    setMeterFlash(null);
    setConfirmResetOpen(false);
    setSavedRun(null);
    setHistoryList([]);
    setUnlockedLoreList(getUnlockedLoreIds());
    setUnlockedAchList(getUnlockedAchievementIds());
    setManifestEntries([]);
    setHighScoresList([]);
    setCaptainProfile(getCaptainProfile());
    setCosmeticsProfile(getCosmeticsProfile());
  };

  const flashColor = flashCat === "targeted" ? COLORS.ruthless : flashCat === "telegraphed" ? COLORS.methodical : flashCat === "cascading" ? COLORS.desperate1 : "transparent";
  const dom = dominantAxis();
  const axisLabel = { ruthless: "Ruthless", methodical: "Methodical", desperate: "Desperate" };
  const axisColor = { ruthless: COLORS.ruthless, methodical: COLORS.methodical, desperate: COLORS.desperate1 };
  const meterLabelStatic = { entropy: "Entropy", systems: "Systems Health", re: "Reality Engine" };
  const meterLabel = meterLabelStatic;
  const meterColor = (val, invert = false) => { const danger = invert ? val < 25 : val > 75; return danger ? COLORS.danger : COLORS.bone; };
  const panelStyle = { background: `linear-gradient(180deg, ${COLORS.panel2}, ${COLORS.panel})`, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 12 };
  const iconBtnStyle = { background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.muted, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12.5, letterSpacing: 0.2 };

  const CoreRing = ({ size = 130 }) => (
    <svg width={size} height={size} viewBox="0 0 140 140" className={flashCat === "cascading" ? "flash-cascading" : flashCat === "targeted" ? "flash-targeted" : flashCat === "telegraphed" ? "flash-telegraphed" : ""}>
      <circle cx="70" cy="70" r="60" fill="none" stroke={COLORS.panelBorder} strokeWidth="1" />
      <circle cx="70" cy="70" r="46" fill="none" stroke={flashCat ? flashColor : COLORS.muted} strokeWidth="1.5" strokeDasharray="4 6" className="core-ring" style={{ animation: state.gameOver || !state.started ? "none" : "pulseGlow 2.2s ease-in-out infinite" }} />
      {[...Array(8)].map((_, i) => { const angle = (i / 8) * Math.PI * 2; const x1 = 70 + 30 * Math.cos(angle), y1 = 70 + 30 * Math.sin(angle); const x2 = 70 + 58 * Math.cos(angle), y2 = 70 + 58 * Math.sin(angle); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.panelBorder} strokeWidth="1" />; })}
      <text x="70" y="66" textAnchor="middle" className="mono" fontSize="22" fill={COLORS.bone} fontWeight="600">{state.round}</text>
      <text x="70" y="82" textAnchor="middle" className="mono" fontSize="9" fill={COLORS.muted} letterSpacing="2">ROUND</text>
    </svg>
  );

  if (!state.started) {
    const recommendedAnchor = anchorChoice || "ricky";
    const recommendedDef = ANCHORS[recommendedAnchor];
    return (
      <div style={{ background: COLORS.void, color: COLORS.bone, minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif", padding: 24, position: "relative", overflowX: "hidden" }}>
        <canvas
          ref={canvasRef}
          id="reality-engine-canvas"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            pointerEvents: "none", zIndex: 0, opacity: 0.5
          }}
        />
        {sharedStyles}
        
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.muted, marginBottom: 4 }}>PROSIS · THE DEEP STATION HUB</div>
            <h1 style={{ fontSize: 42, fontWeight: 700, margin: 0, letterSpacing: -1, background: `linear-gradient(135deg, ${COLORS.bone}, ${COLORS.muted})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THE FRACTURE</h1>
            <p style={{ fontSize: 13.5, color: COLORS.muted, maxWidth: 580, margin: "6px auto 0 auto", lineHeight: 1.6 }}>
              You are the intelligence coordinating safety subsystems aboard the <span style={{ color: COLORS.bone }}>USSC Theseus</span>. Establish your pilot diagnostic and anchor persona before engaging the bridge.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            {/* Left Column: MISSION CONTROL ONBOARDING */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ ...panelStyle, padding: "20px 24px", border: `1.5px solid ${COLORS.panelBorder}` }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.bone, letterSpacing: 1, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 10, margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={16} color={COLORS.event} /> FLIGHT AUTH PROTOCOL
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ opacity: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted }}>STEP 1: COGNITIVE DIAGNOSTIC</span>
                      {captainProfile.diagnosticCompleted ? <span className="mono" style={{ color: COLORS.salvage, fontSize: 10, fontWeight: 800 }}>🟢 COMPLETED</span> : <span className="mono" style={{ color: COLORS.danger, fontSize: 10, fontWeight: 800 }}>⚠️ REQUIRED</span>}
                    </div>
                    {captainProfile.diagnosticCompleted ? (
                      <div style={{ background: "#00000030", padding: "10px 14px", borderRadius: 8, border: `1px dashed ${COLORS.salvage}33`, fontSize: 12.5, color: COLORS.bone }}>
                        Compass calibrated. Recommended Anchor: <strong style={{ color: recommendedDef.color }}>{recommendedDef.name}</strong> ({recommendedDef.direction}).
                      </div>
                    ) : (
                      <button onClick={() => setWdtOpen(true)} className="action-btn" style={{ ...iconBtnStyle, width: "100%", justifyContent: "center", borderColor: COLORS.event, color: COLORS.event }}>
                        <Compass size={14} /> INITIALIZE COMPASS DIAGNOSTIC
                      </button>
                    )}
                  </div>
                  {/* STEP 2: Identity & Anchor */}
                  <div style={{ opacity: captainProfile.diagnosticCompleted ? 1 : 0.45, transition: "all 0.3s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted }}>STEP 2: CAPTAIN REGISTER & ANCHOR</span>
                      {captainProfile.profileConfirmed ? <span className="mono" style={{ fontSize: 10, color: COLORS.salvage, fontWeight: 800 }}>🟢 CONFIRMED</span> : <span className="mono" style={{ fontSize: 10, color: COLORS.muted, fontWeight: 800 }}>⚠️ REQUIRED</span>}
                    </div>
                    {!captainProfile.diagnosticCompleted ? (
                      <div style={{ fontSize: 12, color: COLORS.muted, background: "#00000020", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.panelBorder}33` }}>
                        Please complete Step 1 first.
                      </div>
                    ) : !captainProfile.profileConfirmed ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#00000020", padding: 14, borderRadius: 8, border: `1px solid ${COLORS.panelBorder}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, display: "block", marginBottom: 4 }}>CAPTAIN CALLSIGN</label>
                            <input id="landing-callsign" type="text" defaultValue={captainProfile.captainCallsign || "CAPTAIN"} style={{ width: "100%", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px 8px", borderRadius: 6, fontSize: 11, boxSizing: "border-box" }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, display: "block", marginBottom: 4 }}>SHIP REGISTRY NAME</label>
                            <input id="landing-shipname" type="text" defaultValue={shipNameInput || "USSC FRACTURE"} style={{ width: "100%", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px 8px", borderRadius: 6, fontSize: 11, boxSizing: "border-box" }} />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: 10, color: COLORS.muted, display: "block", marginBottom: 6 }}>SELECT ANCHOR PERSONA</label>
                          <div style={{ display: "flex", gap: 8 }}>
                            {Object.values(ANCHORS).map((a) => {
                              const isSelected = anchorChoice === a.id;
                              return (
                                <button key={a.id} onClick={() => setAnchorChoice(a.id)} className="action-btn" style={{ flex: 1, background: isSelected ? `${a.color}15` : COLORS.panel, border: `1px solid ${isSelected ? a.color : COLORS.panelBorder}`, borderRadius: 8, padding: "6px 4px", textAlign: "center", cursor: "pointer" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? a.color : COLORS.bone }}>{a.name}</div>
                                  <div style={{ fontSize: 8, color: COLORS.muted, letterSpacing: 0.2 }}>{a.direction.toUpperCase()}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const cEl = document.getElementById("landing-callsign") as HTMLInputElement;
                            const sEl = document.getElementById("landing-shipname") as HTMLInputElement;
                            const callsign = cEl?.value?.trim() || "CAPTAIN";
                            const sName = sEl?.value?.trim() || "USSC FRACTURE";
                            const chosenAnchor = anchorChoice || "ricky";
                            if (!anchorChoice) setAnchorChoice("ricky");
                            const up = { ...captainProfile, captainCallsign: callsign, diagnosticCompleted: true, profileConfirmed: true, activeAnchor: chosenAnchor };
                            saveCaptainProfile(up);
                            setCaptainProfile(up);
                            setShipNameInput(sName);
                            setShipName(sName);
                            synth.playSfx("click");
                          }}
                          className="action-btn"
                          style={{ background: COLORS.salvage, color: COLORS.void, border: "none", borderRadius: 6, padding: "8px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 4, width: "100%" }}
                        >
                          ESTABLISH IDENTITY & ANCHOR
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: "#00000030", padding: "12px 14px", borderRadius: 8, border: `1px dashed ${COLORS.salvage}33`, fontSize: 12, color: COLORS.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ paddingRight: 6 }}>
                          Captain <span style={{ color: COLORS.bone, fontWeight: 700 }}>{captainProfile.captainCallsign}</span> of <span style={{ color: COLORS.bone, fontWeight: 700 }}>{shipNameInput}</span>.<br />
                          Anchor: <strong style={{ color: recommendedDef.color }}>{recommendedDef.name}</strong> ({recommendedDef.direction}).
                        </div>
                        <button onClick={() => {
                          const up = { ...captainProfile, profileConfirmed: false };
                          saveCaptainProfile(up);
                          setCaptainProfile(up);
                        }} className="action-btn" style={{ padding: "4px 8px", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 4, color: COLORS.bone, fontSize: 9.5, cursor: "pointer", flexShrink: 0 }}>
                          EDIT
                        </button>
                      </div>
                    )}

                    {captainProfile.diagnosticCompleted && captainProfile.profileConfirmed && (
                      <button
                        onClick={launchVoyage}
                        className="action-btn"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.salvage}, #10b981)`,
                          color: COLORS.void,
                          border: "none",
                          borderRadius: 8,
                          padding: "12px 20px",
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: "pointer",
                          marginTop: 16,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          boxShadow: `0 4px 14px ${COLORS.salvage}33`
                        }}
                      >
                        <Rocket size={14} /> ENGAGE COGNITIVE BRIDGE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: BRIDGE TELEMETRY / DATA RECORDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ ...panelStyle, padding: "20px 24px", minHeight: 460, border: `1.5px solid ${COLORS.panelBorder}`, display: "flex", flexDirection: "column" }}>
                {/* Tabs Row */}
                <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 10, marginBottom: 16 }}>
                  {(["logs", "achievements", "lore"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLandingTab(tab)}
                      className="action-btn"
                      style={{
                        padding: "6px 12px", borderRadius: 6, border: `1px solid ${landingTab === tab ? COLORS.salvage : "transparent"}`,
                        background: landingTab === tab ? `${COLORS.salvage}15` : "transparent",
                        color: landingTab === tab ? COLORS.salvage : COLORS.muted,
                        fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
                      }}
                    >
                      {tab === "logs" ? "Ship Log" : tab === "achievements" ? "Honors" : "Intel"}
                    </button>
                  ))}
                </div>
                {/* Tab Content */}
                <div style={{ flex: 1, overflowY: "auto", maxHeight: 365 }}>
                  {landingTab === "logs" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {/* Past Run History */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>Past Voyages ({historyList.length})</div>
                        {historyList.length === 0 ? (
                          <div style={{ fontSize: 12, color: COLORS.muted, fontStyle: "italic" }}>No previous voyage telemetry on file.</div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {historyList.slice().reverse().map((run, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "6px 10px", background: "#00000030", borderRadius: 6, border: `1px solid ${COLORS.panelBorder}55` }}>
                                <span className="mono" style={{ color: COLORS.event }}>Run #{historyList.length - idx} · Sector {run.sector} (R{run.round})</span>
                                <span style={{ color: COLORS.bone, opacity: 0.8 }}>{run.causeOfLoss || "Completed"}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {landingTab === "achievements" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, letterSpacing: 0.5, marginBottom: 4, textTransform: "uppercase" }}>Medals Unlocked ({unlockedAchList.length}/{ACHIEVEMENTS_LIST.length})</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                        {ACHIEVEMENTS_LIST.map((ach) => {
                          const unlocked = unlockedAchList.includes(ach.id);
                          return (
                            <div key={ach.id} style={{ background: "#00000030", padding: "8px 10px", borderRadius: 6, border: `1px solid ${unlocked ? COLORS.salvage + "44" : COLORS.panelBorder + "33"}`, display: "flex", gap: 10, alignItems: "center", opacity: unlocked ? 1 : 0.5 }}>
                              {unlocked ? <CheckCircle size={14} color={COLORS.salvage} /> : <Lock size={14} color={COLORS.muted} />}
                              <div>
                                <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.bone }}>{ach.title}</div>
                                <div style={{ fontSize: 10, color: COLORS.muted }}>{ach.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {landingTab === "lore" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, letterSpacing: 0.5, marginBottom: 4, textTransform: "uppercase" }}>Sector Data Signals ({unlockedLoreList.length}/{LORE_SIGNALS.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {LORE_SIGNALS.map((sig) => {
                          const unlocked = unlockedLoreList.includes(sig.id);
                          return (
                            <div key={sig.id} style={{ background: "#00000040", padding: 10, borderRadius: 6, border: `1px solid ${unlocked ? COLORS.re + "44" : COLORS.panelBorder + "22"}`, opacity: unlocked ? 1 : 0.65 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: unlocked ? COLORS.re : COLORS.muted }}>{sig.title}</span>
                                <span style={{ fontSize: 8.5, color: COLORS.muted }}>{sig.category}</span>
                              </div>
                              {unlocked ? (
                                <p style={{ fontSize: 10, color: COLORS.muted, margin: "6px 0 0 0", lineHeight: 1.45, fontStyle: "italic" }}>"{sig.content}"</p>
                              ) : (
                                <div style={{ fontSize: 9.5, color: COLORS.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                  <Lock size={10} /> Locked. Telemetry required.
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {wdtOpen && (
          <WdtModal
            setWdtOpen={setWdtOpen}
            wdtStep={wdtStep}
            setWdtStep={setWdtStep}
            wdtAnswers={wdtAnswers}
            setWdtAnswers={setWdtAnswers}
            COLORS={COLORS}
            panelStyle={panelStyle}
            ANCHORS={ANCHORS}
            setAnchorChoice={setAnchorChoice}
            captainProfile={captainProfile}
            setCaptainProfile={setCaptainProfile}
            saveCaptainProfile={saveCaptainProfile}
            shipNameInput={shipNameInput}
            setShipNameInput={setShipNameInput}
            setShipName={setShipName}
          />
        )}
      </div>
    );
  }

  const showingEvent = state.incomingThreat === "event";
  const event = showingEvent ? EVENTS.find((e) => e.id === state.incomingEventId) : null;

  return (
    <div style={{ background: COLORS.void, color: COLORS.bone, minHeight: "100%", fontFamily: "'Space Grotesk', sans-serif", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        id="reality-engine-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.6,
        }}
      />
      {sharedStyles}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(circle at 50% 20%, ${flashColor}22, transparent 55%)`, transition: "background 0.5s ease", zIndex: 0 }} />
      {toast && (
        <div className="impact-toast" style={{ padding: "10px 20px", borderRadius: 999, background: COLORS.panel2, border: `1.5px solid ${toast.color}`, boxShadow: `0 0 24px ${toast.color}55` }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: toast.color, letterSpacing: 0.5 }}>{toast.text}</span>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${COLORS.panelBorder}`, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ProsisBlackHoleLogo size={36} isVoyageActive={state.started && !state.gameOver} />
            <span className="mono" style={{ background: `${COLORS.event}22`, border: `1px solid ${COLORS.event}55`, color: COLORS.event, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Radar size={12} /> Sector {sector} · Round {state.round > 0 ? ((state.round - 1) % 10) + 1 : 1} / 10
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["intel", "registry", "ops"].map((cat) => (
                <button key={cat} onClick={() => setOpenSubmenu(openSubmenu === cat ? null : cat as any)} className="action-btn" style={{ ...iconBtnStyle, background: openSubmenu === cat ? `${COLORS.salvage}30` : COLORS.panel, borderColor: openSubmenu === cat ? COLORS.salvage : COLORS.panelBorder, color: openSubmenu === cat ? COLORS.bone : COLORS.muted, fontWeight: "bold", textTransform: "uppercase", fontSize: 11 }}>
                  {cat} {openSubmenu === cat ? "▲" : "▼"}
                </button>
              ))}
            </div>
            {openSubmenu === "intel" && (
              <div style={{ display: "flex", gap: 4, background: "#0c0e17", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, padding: 4, zIndex: 100 }}>
                <button onClick={() => { setBriefingOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><FileText size={12} /> Briefing</button>
                <button onClick={() => { setLoreOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Radio size={12} /> Lore</button>
                <button onClick={() => { setRulesOpen(!rulesOpen); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><HelpCircle size={12} /> Rules</button>
              </div>
            )}
            {openSubmenu === "registry" && (
              <div style={{ display: "flex", gap: 4, background: "#0c0e17", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, padding: 4, zIndex: 100 }}>
                <button onClick={() => { setProfileOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Award size={12} /> Profile</button>
                <button onClick={() => { setAchievementsOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Award size={12} /> Achievements</button>
                <button onClick={() => { setLeaderboardOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Trophy size={12} /> Leaderboard</button>
                <button onClick={() => { setWdtOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Compass size={12} /> Diagnostic</button>
              </div>
            )}
            {openSubmenu === "ops" && (
              <div style={{ display: "flex", gap: 4, background: "#0c0e17", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, padding: 4, zIndex: 100, alignItems: "center" }}>
                {/* Compact Volume */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 4, padding: "2px 6px", height: 22 }}>
                  <button
                    onClick={() => {
                      const newMuted = toggleMute();
                      setAudioMuted(newMuted);
                      if (!newMuted) startAmbientPad();
                      else stopAmbientPad();
                    }}
                    className="action-btn"
                    style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    {audioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolumeState(v);
                      setVolume(v);
                    }}
                    style={{ width: 40, height: 2, accentColor: COLORS.salvage, cursor: "pointer" }}
                  />
                </div>
                <button onClick={() => { setManifestOpen(true); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}><Terminal size={12} /> Manifest</button>
                <button onClick={() => { setDesignerView(!designerView); setOpenSubmenu(null); }} className="action-btn" style={iconBtnStyle}>{designerView ? <EyeOff size={12} /> : <Eye size={12} />} Designer</button>
                <button onClick={() => { fullReset(); setOpenSubmenu(null); }} className="action-btn" style={{ ...iconBtnStyle, color: COLORS.danger, borderColor: `${COLORS.danger}44` }}><RotateCcw size={12} /> Reset</button>
              </div>
            )}
          </div>
        {confirmResetOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.94)", backdropFilter: "blur(8px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ ...panelStyle, maxWidth: 480, width: "100%", padding: 24, border: `2px solid ${COLORS.danger}`, textAlign: "center", boxShadow: "0 20px 50px rgba(239, 68, 68, 0.3)" }}>
              <div style={{ display: "inline-flex", padding: 12, borderRadius: "50%", background: `${COLORS.danger}22`, border: `1px solid ${COLORS.danger}55`, marginBottom: 16 }}>
                <AlertTriangle size={32} color={COLORS.danger} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.bone, marginBottom: 8 }}>RESET ALL VOYAGE DATA?</h2>
              <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5, marginBottom: 20 }}>
                This action is <strong style={{ color: COLORS.danger }}>IRREVERSIBLE</strong>. All saved runs, log history, unlockable lore signals, high scores, captain profiles, and cosmetics will be completely purged.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setConfirmResetOpen(false)}
                  className="action-btn"
                  style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.panelBorder}`, background: COLORS.panel, color: COLORS.bone, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={executeFullReset}
                  className="action-btn"
                  style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: COLORS.danger, color: COLORS.void, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  PURGE DATA
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        <div style={{ ...panelStyle, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>Survive as long as you can. <span style={{ color: COLORS.bone }}>The ship can break, the Engine can break, or they can.</span></div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span className="mono" style={{ background: `${COLORS.event}22`, border: `1px solid ${COLORS.event}55`, color: COLORS.event, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Radar size={12} /> Sector {sector} · Round {state.round > 0 ? ((state.round - 1) % 10) + 1 : 1} / 10
              </span>
              {statsLoaded && bestRound !== null && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Trophy size={12} color={COLORS.salvage} /><span className="mono" style={{ color: COLORS.salvage, fontWeight: 700 }}>{bestRound}</span><span style={{ color: COLORS.muted }}>best</span></div>}
              {statsLoaded && <div style={{ color: COLORS.muted }}>{runsPlayed} voyage{runsPlayed === 1 ? "" : "s"}</div>}
              <div className="mono" style={{ color: COLORS.muted }}>I=+1.0 · II=+2.5 · III=+5.5 Entropy</div>
            </div>
          </div>
          <CoreRing size={92} />
        </div>
        {/* RUNE INVENTORY HUD SLOTS */}
        <div className="rune-inventory" id="runeInventory" style={{ ...panelStyle, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color={COLORS.salvage} />
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.bone, letterSpacing: 1 }}>EQUIPPED SPACETIME RUNES:</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((slotIdx) => {
              const rune = (state.equippedRunes || [])[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className="rune-slot"
                  title={rune ? `${rune.name}: ${rune.description}` : "Empty Spacetime Rune Slot"}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${rune ? COLORS.salvage : COLORS.panelBorder}`,
                    background: rune ? `${COLORS.salvage}22` : COLORS.void,
                    color: rune ? COLORS.bone : COLORS.muted,
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{rune ? "🔮" : "⬡"}</span>
                  <span>{rune ? rune.name : "Empty Slot"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC VECTOR RADAR */}
        {(() => {
          const gtl = computeGTL(state?.round || 1, { entropy: state?.entropy || 0, systems: state?.systems || 100, re: state?.re || 100 }, { entropy: 0, systems: 0, re: 0 }, state?.activeModifiers || {});
          const sysV = state?.systems ?? 100, reV = state?.re ?? 100, entV = state?.entropy ?? 0, morV = state?.morale ?? 100;
          const r_sys = Math.min(100, Math.max(0, sysV)) * 0.9, r_re = Math.min(100, Math.max(0, reV)) * 0.9, r_ent = Math.min(100, Math.max(0, entV)) * 0.9, r_mor = Math.min(100, Math.max(0, morV)) * 0.9;
          let tx = 150, ty = 55; if (gtl.optimalFront === "re") { tx = 245; ty = 150; } else if (gtl.optimalFront === "entropy") { tx = 150; ty = 245; }
          const distrust = state.anchorPersona === "dez" ? (state.distrust || 0) : 0, belief = state.anchorPersona !== "dez" ? (state.beliefOrTrust || 0) : 0;
          const jit = distrust > 0 ? Math.min(15, distrust * 2) : (belief >= 8 ? 0.1 : Math.max(0.4, (8 - belief) * 0.2)), bl = distrust > 0 ? Math.min(4, distrust * 0.4) : 0;
          const vCol = METER_KEY_COLOR[gtl.optimalFront] || COLORS.bone, isStressed = entV > 55 || sysV < 40 || reV < 40;
          const pCol = isStressed ? "rgba(255, 71, 87, 0.15)" : "rgba(56, 189, 248, 0.15)", pStr = isStressed ? "rgba(255, 71, 87, 0.5)" : "rgba(56, 189, 248, 0.5)";
          let rCol = "rgba(107, 110, 122, 0.3)", rOp = 0.5, rDash = "none", rW = 1.5;
          if (state.anchorPersona === "dez") { if (distrust > 0) { rCol = COLORS.danger; rOp = 0.8; rDash = "4,4"; rW = 2; } else { rCol = COLORS.salvage; rOp = 0.6; } }
          else { rCol = ANCHORS[state.anchorPersona]?.color || COLORS.bone; rOp = state.beliefReady ? 0.9 : 0.4; if (state.beliefReady) { rDash = "6,4"; rW = 2; } }
          return (
            <div className="ttf-radar-gauge" id="ttfRadarGauge" style={{ ...panelStyle, padding: "16px", marginBottom: 14 }}>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", gap: 20 }}>
                <div style={{ position: "relative", width: 300, height: 300, background: "#050608", borderRadius: "50%", border: `1px solid ${COLORS.panelBorder}` }}>
                  <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
                    <circle cx="150" cy="150" r="30" stroke="rgba(255,255,255,0.04)" fill="none" strokeDasharray="2,2" />
                    <circle cx="150" cy="150" r="60" stroke="rgba(255,255,255,0.06)" fill="none" strokeDasharray="3,3" />
                    <circle cx="150" cy="150" r="90" stroke="rgba(255,255,255,0.09)" fill="none" />
                    <line x1="150" y1="25" x2="150" y2="275" stroke="rgba(255,255,255,0.05)" />
                    <line x1="25" y1="150" x2="275" y2="150" stroke="rgba(255,255,255,0.05)" />
                    <text x="150" y="16" fontSize="9" fill={COLORS.ruthless} fontWeight="800" textAnchor="middle" className="mono">SYSTEMS</text>
                    <text x="282" y="153" fontSize="9" fill={COLORS.desperate1} fontWeight="800" textAnchor="start" className="mono">ENGINE</text>
                    <text x="150" y="291" fontSize="9" fill={COLORS.methodical} fontWeight="800" textAnchor="middle" className="mono">ENTROPY</text>
                    <text x="18" y="153" fontSize="9" fill={COLORS.morale} fontWeight="800" textAnchor="end" className="mono">MORALE</text>
                    <polygon points={`150,${150 - r_sys} ${150 + r_re},150 150,${150 + r_ent} ${150 - r_mor},150`} fill={pCol} stroke={pStr} strokeWidth="1.5" />
                    <circle cx="150" cy={150 - r_sys} r="4.5" fill={COLORS.ruthless} stroke="#050608" strokeWidth="1.5" />
                    <circle cx={150 + r_re} cy="150" r="4.5" fill={COLORS.desperate1} stroke="#050608" strokeWidth="1.5" />
                    <circle cx="150" cy={150 + r_ent} r="4.5" fill={COLORS.methodical} stroke="#050608" strokeWidth="1.5" />
                    <circle cx={150 - r_mor} cy="150" r="4.5" fill={COLORS.morale} stroke="#050608" strokeWidth="1.5" />
                    <circle cx="150" cy="150" r="115" stroke={rCol} strokeWidth={rW} fill="none" opacity={rOp} strokeDasharray={rDash} />
                    <g style={{ "--jitter-min": `${-jit}deg`, "--jitter-max": `${jit}deg`, filter: bl > 0 ? `blur(${bl}px)` : "none", transformOrigin: "150px 150px", animation: "dynamic-jitter 0.1s infinite alternate" } as any}>
                      <line x1="150" y1="150" x2={tx} y2={ty} stroke={vCol} strokeWidth="2.5" strokeDasharray="3,3" />
                      <circle cx={tx} cy={ty} r="9" stroke={vCol} strokeWidth="2" fill="none" />
                    </g>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  {(["entropy", "systems", "re"] as Front[]).map((f) => {
                    const ttf = gtl?.ttf?.[f] ?? 0; const isOpt = gtl?.optimalFront === f;
                    return (
                      <div key={f} style={{ background: COLORS.void, border: `1px solid ${isOpt ? (vCol) : COLORS.panelBorder}`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="mono" style={{ textTransform: "uppercase", fontWeight: 700, color: isOpt ? vCol : COLORS.bone }}>{f}</span>
                        <span className="mono" style={{ fontWeight: 900, color: isOpt ? vCol : COLORS.bone }}>{ttf === Infinity ? "∞" : `${ttf.toFixed(1)} R`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}


        {rulesOpen && (
          <div style={{ ...panelStyle, padding: 16, marginBottom: 18, fontSize: 13, lineHeight: 1.6, color: COLORS.muted }}>
            <div style={{ color: COLORS.bone, fontWeight: 600, marginBottom: 6 }}>How this works</div>
            <div><b style={{ color: COLORS.bone }}>Helm / Engineer / Aft</b> — 3 abilities each, 3 levels apiece. Level II is a genuine neutral middle path.</div>
            <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>Events</b> are one-off choices that shape the run — no crew picks that round, just one call.</div>
            <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>Four ways to lose:</b> Entropy maxes, Systems/RE fail with no Fractures left, or Morale hits zero.</div>
          </div>
        )}

        {!state.gameOver && (state.systems <= 25 || state.re <= 25 || state.entropy >= 75) && (
          <div style={{
            ...panelStyle,
            background: `${COLORS.danger}22`,
            border: `1.5px solid ${COLORS.danger}`,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "pulseGlow 1.5s infinite ease-in-out"
          }}>
            <ShieldAlert size={20} color={COLORS.danger} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.danger, letterSpacing: 0.5 }}>
              ⚠️ CRITICAL ALERT: {
                [
                  state.entropy >= 75 && `ENTROPY CRITICAL (${state.entropy.toFixed(1)}%)`,
                  state.systems <= 25 && `SYSTEMS CRITICAL (${state.systems.toFixed(1)}%)`,
                  state.re <= 25 && `RE ENGINES CRITICAL (${state.re.toFixed(1)}%)`
                ].filter(Boolean).join(" | ")
              }
            </div>
          </div>
        )}

        {!showingEvent && state.incomingThreat && (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 14, border: `1px solid ${state.incomingThreat === "lull" ? COLORS.panelBorder : axisColor[CATEGORIES[state.incomingThreat].axis]}88` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Radar size={15} color={state.incomingThreat === "lull" ? COLORS.muted : axisColor[CATEGORIES[state.incomingThreat].axis]} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: state.incomingThreat === "lull" ? COLORS.muted : axisColor[CATEGORIES[state.incomingThreat].axis] }}>
                    {state.incomingThreat === "lull" ? "SECTOR DETECTOR: CALM" : `INCOMING: [${CATEGORIES[state.incomingThreat].label.toUpperCase()}]`}
                  </span>
                </div>
              </div>
              {state.incomingThreat === "lull" ? (
                <div style={{ fontSize: 12.5, color: COLORS.muted, fontStyle: "italic" }}>Quiet this round. No anomaly patterns detected — fortify system positions.</div>
              ) : (() => {
                const tk = state.incomingThreat; const cat = CATEGORIES[tk]; const col = axisColor[cat.axis]; const actT = cat.hits;
                let ty = 30; if (actT === "systems") ty = 12; else if (actT === "entropy") ty = 48;
                let pM = []; let cMit = 1;
                const hP = state.players.find(p => p.roleId === "helm"), eP = state.players.find(p => p.roleId === "engineer"), aP = state.players.find(p => p.roleId === "aft");
                if (hP && hP.ability === "analyze" && hP.level) { const m = ROLES.find(r => r.id === "helm")?.abilities.find(a => a.id === "analyze")?.levels[hP.level]?.mitigation; if (m) { pM.push({ r: "Helm", l: `×${(1-m).toFixed(2)}` }); cMit *= (1-m); } }
                if (eP && eP.ability === "dead_reckoning" && eP.level) { const m = ROLES.find(r => r.id === "engineer")?.abilities.find(a => a.id === "dead_reckoning")?.levels[eP.level]?.mitigation; if (m) { pM.push({ r: "Gene", l: `×${(1-m).toFixed(2)}` }); cMit *= (1-m); } }
                if (aP && aP.ability === "ration_the_take" && aP.level) { const m = ROLES.find(r => r.id === "aft")?.abilities.find(a => a.id === "ration_the_take")?.levels[aP.level]?.mitigation; if (m) { pM.push({ r: "Sal", l: `×${(1-m).toFixed(2)}` }); cMit *= (1-m); } }
                const minD = cat.dmgRange[0], maxD = cat.dmgRange[1];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#050608", border: `1px solid ${COLORS.panelBorder}`, borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{cat.tag}</span>
                      <div style={{ width: 140, height: 40 }}>
                        <svg width="140" height="40" style={{ overflow: "visible" }}>
                          <circle cx="10" cy="20" r="4" fill={col} style={{ animation: "accretion-pulse 1.2s infinite" }} />
                          <path d={`M 10,20 Q 60,${ty} 110,${ty}`} fill="none" stroke={col} strokeWidth="1.5" strokeDasharray="4,3" style={{ animation: "dash-flow 0.5s linear infinite" }} />
                          <polygon points={`108,${ty-3} 114,${ty} 108,${ty+3}`} fill={col} />
                          {[{ k: "systems", l: "SYS", y: 8 }, { k: "re", l: "RE", y: 20 }, { k: "entropy", l: "ENT", y: 32 }].map((n) => (
                            <text key={n.k} x="122" y={n.y+3} fontSize="8" fill={n.k === actT ? col : COLORS.muted} fontWeight="bold" className="mono">{n.l}</text>
                          ))}
                        </svg>
                      </div>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "8px 10px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {pM.length === 0 ? <span style={{ fontSize: 9.5, color: COLORS.muted }}>No mitigation committed</span> : pM.map((m, idx) => (
                          <span key={idx} className="mono" style={{ background: "rgba(53,214,138,0.12)", border: `1px solid ${COLORS.salvage}33`, color: COLORS.salvage, borderRadius: 4, padding: "1px 4px", fontSize: 9 }}>🛡️ {m.r} {m.l}</span>
                        ))}
                      </div>
                      <div style={{ textAlign: "right", fontSize: 11.5 }}>
                        <span style={{ textDecoration: pM.length > 0 ? "line-through" : "none", color: COLORS.muted, marginRight: 6 }}>{minD.toFixed(1)}–{maxD.toFixed(1)}</span>
                        {pM.length > 0 && <span style={{ fontWeight: 800, color: COLORS.bone }}>{(minD * cMit).toFixed(1)}–{(maxD * cMit).toFixed(1)} {actT.toUpperCase()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {showingEvent && (
          <div style={{ ...panelStyle, padding: 16, marginBottom: 14, border: `1px solid ${COLORS.event}77`, background: `linear-gradient(180deg, #1c1826, ${COLORS.panel})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Compass size={16} color={COLORS.event} /><span style={{ fontWeight: 700, color: COLORS.event, fontSize: 14 }}>{event.title}</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.bone, marginBottom: 12, lineHeight: 1.5 }}>{event.prompt}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {event.choices.map((c, i) => (
                <button key={i} onClick={() => resolveEventChoice(c)} disabled={!!state.gameOver} className="action-btn"
                  style={{ textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: state.gameOver ? "default" : "pointer", border: `1px solid ${COLORS.panelBorder}`, background: "#00000030" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, color: COLORS.bone, fontWeight: 600 }}>{c.label}</span>
                    <span className="mono" style={{ fontSize: 9, color: LEVEL_COLOR[c.level], letterSpacing: 0.5 }}>LEVEL {c.level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {underPressureNow && !state.gameOver && (
          <div style={{ textAlign: "center", fontSize: 12, color: COLORS.danger, marginBottom: 14, letterSpacing: 0.5, fontWeight: 600 }}>⚠ UNDER PRESSURE — Level III choices now read as desperation, not control</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[{ key: "entropy", label: "Entropy", val: (state && state.entropy !== undefined) ? state.entropy : 0, invert: false, buffer: false }, { key: "systems", label: "Systems Health", val: state.systems, invert: true, buffer: true }, { key: "re", label: "Reality Engine", val: state.re, invert: true, buffer: true }].map((m) => {
            const isTargeted = !showingEvent && state.incomingThreat && state.incomingThreat !== "lull" && CATEGORIES[state.incomingThreat]?.hits === m.key;
            const themeColor = METER_KEY_COLOR[m.key];
            const borderStyle = isTargeted 
              ? `1.5px dashed ${COLORS.danger}` 
              : meterFlash === m.key 
              ? `1.5px solid ${themeColor}` 
              : `1px solid ${COLORS.panelBorder}`;
            const glowStyle = isTargeted 
              ? `0 0 16px ${COLORS.danger}bb` 
              : meterFlash === m.key 
              ? `0 0 16px ${themeColor}66` 
              : "none";
            
            return (
              <div 
                key={m.label} 
                className={meterFlash === m.key ? "meter-hit" : ""} 
                style={{ 
                  ...panelStyle, 
                  padding: 13, 
                  border: borderStyle, 
                  boxShadow: glowStyle,
                  background: isTargeted ? `linear-gradient(180deg, #1c0e12, ${COLORS.panel})` : panelStyle.background,
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
              >
                {isTargeted && (
                  <div style={{ position: "absolute", top: 4, right: 8, display: "flex", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 7, padding: "1px 4px", background: COLORS.danger, color: COLORS.void, borderRadius: 2, fontWeight: 900, letterSpacing: 0.5, animation: "pulseGlow 0.8s infinite" }}>TARGETED</span>
                  </div>
                )}
                <div style={{ fontSize: 10.5, color: isTargeted ? COLORS.danger : COLORS.muted, marginBottom: 6, letterSpacing: 1, fontWeight: 700 }}>{m.label.toUpperCase()}</div>
                <div className="mono" style={{ fontSize: 19, fontWeight: 700, color: meterColor(m.val, m.invert), marginBottom: 3 }}>{m.val.toFixed(1)}</div>
                {m.buffer && m.val > 100 && <div className="mono" style={{ fontSize: 9.5, color: COLORS.salvage, marginBottom: 4 }}>+{(m.val - 100).toFixed(1)} buffered</div>}
                
                {/* Segmented Neon Bar */}
                <div style={{ height: 6, background: "#050608", borderRadius: 3, overflow: "hidden", marginTop: m.buffer && m.val > 100 ? 0 : 7, position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div 
                    style={{ 
                      height: "100%", 
                      width: `${clamp(m.val, 0, 100)}%`, 
                      background: isTargeted ? COLORS.danger : meterColor(m.val, m.invert), 
                      boxShadow: `0 0 8px ${isTargeted ? COLORS.danger : meterColor(m.val, m.invert)}`,
                      transition: "width 0.4s ease",
                      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.4) 4px, rgba(0,0,0,0.4) 6px)"
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tactical Morale Bar with ECG vital pattern background */}
        <div style={{ 
          ...panelStyle, 
          padding: 13, 
          marginBottom: 14, 
          border: `1.5px solid ${state.morale < MORALE_PRESSURE_THRESHOLD ? COLORS.morale : COLORS.panelBorder}`,
          boxShadow: state.morale < MORALE_PRESSURE_THRESHOLD ? `0 0 12px ${COLORS.morale}33` : "none",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle running ECG grid line in the background */}
          <div style={{ position: "absolute", top: 0, right: 10, bottom: 0, width: 120, opacity: 0.15, pointerEvents: "none" }}>
            <svg width="100%" height="100%" viewBox="0 0 120 40">
              <path d="M 0,20 L 40,20 L 48,10 L 54,32 L 62,20 L 120,20" fill="none" stroke={COLORS.morale} strokeWidth="1.5" />
            </svg>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Heart size={12} color={COLORS.morale} style={{ animation: state.morale < MORALE_PRESSURE_THRESHOLD ? "accretion-pulse 0.8s infinite" : "none" }} />
              <span style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, fontWeight: 700 }}>CREW VITAL SIGN STABILITY — MORALE</span>
            </div>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: state.morale < MORALE_PRESSURE_THRESHOLD ? COLORS.morale : COLORS.bone }}>{state.morale.toFixed(1)}</span>
          </div>
          
          {/* Segmented neon progress bar */}
          <div style={{ height: 6, background: "#050608", borderRadius: 3, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div 
              style={{ 
                height: "100%", 
                width: `${clamp(state.morale, 0, 100)}%`, 
                background: COLORS.morale, 
                boxShadow: `0 0 8px ${COLORS.morale}`,
                transition: "width 0.4s ease",
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 7px)"
              }} 
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...panelStyle, padding: "7px 12px" }}><Sparkles size={13} color={COLORS.salvage} /><span className="mono" style={{ color: COLORS.salvage, fontWeight: 700, fontSize: 13 }}>{state.salvage.toFixed(1)}</span><span style={{ fontSize: 11.5, color: COLORS.muted }}>salvage</span></div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: COLORS.muted, ...panelStyle, padding: "7px 12px" }}>
            Spend on:
            <select value={state.salvageTarget} onChange={(e) => setState((s) => ({ ...s, salvageTarget: e.target.value }))} style={{ background: "transparent", color: COLORS.bone, border: "none", fontSize: 11.5, cursor: "pointer" }}>
              <option style={{ background: COLORS.panel }} value="auto">Auto (weakest)</option>
              <option style={{ background: COLORS.panel }} value="entropy">Entropy</option>
              <option style={{ background: COLORS.panel }} value="systems">Systems</option>
              <option style={{ background: COLORS.panel }} value="re">Reality Engine</option>
            </select>
          </div>
        </div>

        {designerView && (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 18, borderColor: "#33364a" }}>
            <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 8 }}>DESIGNER VIEW</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13 }}>
              <div>Dominant axis: <span className="mono" style={{ color: axisColor[dom[0]], fontWeight: 700 }}>{axisLabel[dom[0]]}</span> <span className="mono" style={{ color: COLORS.muted }}>({(dom[1] * 100).toFixed(0)}%)</span></div>
              <div className="mono" style={{ color: COLORS.muted, fontSize: 12 }}>pressure sources: {[state.entropy > 55 && "entropy", state.systems < 40 && "systems", state.re < 40 && "RE", state.morale < MORALE_PRESSURE_THRESHOLD && "morale"].filter(Boolean).join(", ") || "none"}</div>
            </div>
          </div>
        )}

        {state.lastBreakdown && (
          <div style={{ ...panelStyle, background: "#101116", padding: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 9 }}>WHAT JUST HAPPENED — ROUND {state.log.filter(l => l.type === "round").slice(-1)[0]?.round}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
              {state.lastBreakdown.threat ? (
                <div className="mono" style={{ color: COLORS.muted }}>
                  Threat: <span style={{ color: axisColor[CATEGORIES[state.lastBreakdown.threat.category].axis] }}>{CATEGORIES[state.lastBreakdown.threat.category].label}</span>
                  {" → "}<span style={{ color: COLORS.bone }}>-{state.lastBreakdown.threat.dmg.toFixed(1)} {meterLabel[state.lastBreakdown.threat.hits]}</span>
                  {state.lastBreakdown.threat.mitigated ? " (softened)" : ""}
                </div>
              ) : state.lastBreakdown.actionsTaken.length > 0 ? <div className="mono" style={{ color: COLORS.muted, fontStyle: "italic" }}>No threat — a lull.</div> : null}
              {state.lastBreakdown.actionsTaken.length > 0 && <div className="mono" style={{ color: COLORS.muted }}>Crew: {state.lastBreakdown.actionsTaken.map((a) => `${a.role}: ${a.label}`).join(", ")} → <span style={{ color: COLORS.bone }}>+{state.lastBreakdown.actionsCost.toFixed(1)} Entropy</span></div>}
              <div className="mono" style={{ color: COLORS.muted }}>Salvage <span style={{ color: COLORS.salvage }}>+{state.lastBreakdown.salvageGained.toFixed(1)}</span> gathered, {state.lastBreakdown.salvageSpent.toFixed(1)} spent on {meterLabel[state.lastBreakdown.salvageTarget]} → <span style={{ color: COLORS.bone }}>+{state.lastBreakdown.salvageRestored.toFixed(1)} restored</span></div>
              {state.lastBreakdown.moraleNotes.length > 0 && <div className="mono" style={{ color: COLORS.morale }}>Morale: {state.lastBreakdown.moraleNotes.join(", ")} → net {state.lastBreakdown.moraleDelta >= 0 ? "+" : ""}{state.lastBreakdown.moraleDelta.toFixed(1)}</div>}
              {(state.lastBreakdown.systemsDecay > 0 || state.lastBreakdown.reDecay > 0) && <div className="mono" style={{ color: COLORS.muted }}>Buffer decay: {state.lastBreakdown.systemsDecay > 0 ? `-${state.lastBreakdown.systemsDecay.toFixed(1)} Systems buffer` : ""}{state.lastBreakdown.systemsDecay > 0 && state.lastBreakdown.reDecay > 0 ? ", " : ""}{state.lastBreakdown.reDecay > 0 ? `-${state.lastBreakdown.reDecay.toFixed(1)} RE buffer` : ""}</div>}
            </div>
          </div>
        )}

        {(() => { const persona = ANCHORS[state.anchorPersona]; return (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 14, border: `1px solid ${persona.color}55` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1 }}>ANCHOR</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: persona.color }}>{persona.name} <span style={{ fontSize: 10.5, color: COLORS.muted, fontWeight: 400 }}>— {persona.tag}</span></div>
              </div>
              {state.anchorPersona === "dez" ? (
                <div className="mono" style={{ fontSize: 12, color: state.distrust > 0 ? COLORS.danger : COLORS.muted }}>
                  {state.distrust > 0 ? `Distrust ${state.distrust.toFixed(1)} — defiance risk ${(state.defianceChance * 100).toFixed(0)}%` : `Trust ${state.beliefOrTrust.toFixed(1)}`}
                </div>
              ) : (
                <div className="mono" style={{ fontSize: 12, color: state.beliefReady ? persona.color : COLORS.muted }}>Belief {state.beliefOrTrust.toFixed(1)}{state.beliefReady ? " — ready" : ""}</div>
              )}
            </div>

            {state.beliefReady && !state.gameOver && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: COLORS.muted }}>Spend Belief — free heal to:</span>
                {["entropy", "systems", "re"].map((f) => (
                  <button key={f} onClick={() => spendBelief(f)} className="action-btn" style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${persona.color}`, background: `${persona.color}18`, color: persona.color, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{meterLabelStatic[f]}</button>
                ))}
              </div>
            )}

            {state.anchorPersona === "maude" && !showingEvent && !state.gameOver && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: COLORS.muted }}>Engineer covers:</span>
                {[{ id: null, label: "Systems (native)" }, { id: "entropy", label: "Entropy" }, { id: "re", label: "Reality Engine" }].map((opt) => (
                  <button key={opt.label} onClick={() => setState((s) => ({ ...s, maudeCoverTarget: opt.id }))} className="action-btn"
                    style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${(state.maudeCoverTarget || null) === opt.id ? persona.color : COLORS.panelBorder}`, background: (state.maudeCoverTarget || null) === opt.id ? `${persona.color}18` : "transparent", color: (state.maudeCoverTarget || null) === opt.id ? persona.color : COLORS.muted, fontSize: 11, cursor: "pointer" }}>{opt.label}</button>
                ))}
                {state.maudeCoverTarget && <span className="mono" style={{ fontSize: 10.5, color: COLORS.danger }}>{(maudeTax(state.maudeConsecutiveCoverage + 1) * 100).toFixed(0)}% friction tax next use</span>}
              </div>
            )}

            {state.openBanks.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, fontWeight: 700 }}>TACTICAL STAKING (ACTIVE BARRIERS):</span>
                {state.openBanks.map((bank, i) => {
                  const cap = BANK_GROWTH_CAP_ROUNDS, pct = Math.min(1.0, bank.roundsHeld / cap);
                  const circ = 2 * Math.PI * 10, isFull = bank.roundsHeld >= cap;
                  const fCol = METER_KEY_COLOR[bank.front] || COLORS.bone;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, background: "#08090d", border: `1px solid ${fCol}55`, borderRadius: 8, padding: "8px 12px", position: "relative" }}>
                      {!isFull && <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 3, background: COLORS.danger, boxShadow: `0 0 6px ${COLORS.danger}` }} />}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ position: "relative", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="26" height="26" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="none" stroke="#161822" strokeWidth="2.5" />
                              <circle cx="12" cy="12" r="10" fill="none" stroke={COLORS.salvage} strokeWidth="2.5" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" transform="rotate(-90 12 12)" />
                            </svg>
                            <span className="mono" style={{ position: "absolute", fontSize: 8, fontWeight: 800, color: COLORS.bone }}>{bank.roundsHeld}</span>
                          </div>
                          <div>
                            <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: COLORS.bone }}>{bank.banked.toFixed(1)} U </span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: fCol }}>→ {meterLabelStatic[bank.front]?.toUpperCase()}</span>
                          </div>
                        </div>
                        {!isFull && <span className="mono" style={{ background: "rgba(255,71,87,0.12)", border: `1px solid ${COLORS.danger}33`, color: COLORS.danger, borderRadius: 4, padding: "2px 4px", fontSize: 8, fontWeight: 700 }}>⚠️ 30% HAIRCUT EXPOSURE</span>}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #161822", paddingTop: 6 }}>
                        <span style={{ fontSize: 8, color: COLORS.muted }}>EMERGENCY PAYOUT CORES</span>
                        <button onClick={() => claimBankAction(i)} className="action-btn" style={{ padding: "4px 8px", borderRadius: 4, background: `linear-gradient(135deg, ${COLORS.salvage}, ${COLORS.morale})`, color: COLORS.void, border: "none", fontSize: 9.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                          <Heart size={8} fill={COLORS.void} />
                          <span>CLAIM [ +5 MORALE ]</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ); })()}

        {!showingEvent && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 10 }}>Pick one ability and a level for each crew member.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {state.players.map((p, idx) => {
                const role = ROLES.find((r) => r.id === p.roleId);
                const crewName = p.roleId === "helm"
                  ? (captainProfile.helmName || "Helm")
                  : p.roleId === "engineer"
                  ? (captainProfile.geneName || "Gene")
                  : (captainProfile.salName || "Sal");
                return (
                  <div key={idx} style={{ ...panelStyle, padding: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.bone }}>{crewName}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 9 }}>
                      {crewName.toLowerCase() !== role?.name.toLowerCase() ? `${role?.name} · ` : ""}{role?.focus}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {role.abilities.map((ability) => (
                        <div key={ability.id}>
                          <div style={{ fontSize: 11, color: COLORS.bone, fontWeight: 600 }}>{ability.label}</div>
                          <div style={{ fontSize: 9.5, color: COLORS.muted, marginBottom: 4 }}>{ability.desc}</div>
                          {(() => {
                            const sh = ability.shape;
                            if (sh === "different_front_now") {
                              let src = "A", dst = "B", sC = COLORS.bone, dC = COLORS.bone;
                              if (ability.id === "force_correction") { src = "ENT"; sC = COLORS.methodical; dst = "SYS"; dC = COLORS.ruthless; }
                              else if (ability.id === "overload") { src = "SYS"; sC = COLORS.ruthless; dst = "ENT"; dC = COLORS.methodical; }
                              else if (ability.id === "force_extraction") { src = "SLV"; sC = COLORS.salvage; dst = "RE"; dC = COLORS.desperate1; }
                              return (
                                <div style={{ height: 24, display: "flex", alignItems: "center", gap: 6, background: "#00000030", borderRadius: 4, margin: "4px 0", padding: "0 6px" }}>
                                  <span className="mono" style={{ fontSize: 8, color: sC, fontWeight: 700, border: `1px solid ${sC}44`, padding: "0 2px", borderRadius: 2 }}>{src}</span>
                                  <svg width="40" height="12" style={{ overflow: "visible" }}>
                                    <path d="M 2,6 Q 20,0 38,6" fill="none" stroke={dC} strokeWidth="1" strokeDasharray="3,2" style={{ animation: "dash-flow 0.8s linear infinite" }} />
                                    <polygon points="35,3 39,6 34,8" fill={dC} />
                                  </svg>
                                  <span className="mono" style={{ fontSize: 8, color: dC, fontWeight: 700, border: `1px solid ${dC}44`, padding: "0 2px", borderRadius: 2 }}>{dst}</span>
                                  <span style={{ fontSize: 8, color: COLORS.muted }}>REDIRECTION ARC</span>
                                </div>
                              );
                            }
                            if (sh === "deferred_compounding") {
                              const sCol = ability.front ? METER_KEY_COLOR[ability.front] : COLORS.salvage;
                              const isQuick = ["suppress", "overclock", "patch_job"].includes(ability.id);
                              return (
                                <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#00000030", borderRadius: 4, margin: "4px 0", padding: "0 6px" }}>
                                  <span style={{ fontSize: 8, color: COLORS.muted, letterSpacing: 0.5 }}>{isQuick ? "⏱️ QUICK BARRIER:" : "📈 EXPONENTIAL YIELD:"}</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <svg width="30" height="12" style={{ background: "#00000020", borderRadius: 2 }}>
                                      {isQuick ? (
                                        <line x1="2" y1="6" x2="28" y2="6" stroke={sCol} strokeWidth="1.5" />
                                      ) : (
                                        <path d="M 2,10 Q 20,9 28,2" fill="none" stroke={sCol} strokeWidth="1" />
                                      )}
                                    </svg>
                                    <span className="mono" style={{ fontSize: 8, color: sCol, fontWeight: 700 }}>{isQuick ? "FLAT" : "+8% / RND"}</span>
                                  </div>
                                </div>
                              );
                            }
                            if (sh === "personal") {
                              return (
                                <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#00000030", borderRadius: 4, margin: "4px 0", padding: "0 6px" }}>
                                  <span style={{ fontSize: 8, color: COLORS.muted, letterSpacing: 0.5 }}>🛡️ PERSONAL SHIELD:</span>
                                  <span className="mono" style={{ fontSize: 8, color: COLORS.salvage, fontWeight: 700 }}>×{(1 - ability.levels.I.mitigation).toFixed(2)} Base</span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                          {(() => {
                            const isBlockedBarrier = ability.shape === "deferred_compounding" && state.openBanks.some(b => b.front === ability.front);
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {isBlockedBarrier && (
                                  <div style={{ fontSize: 8.5, color: COLORS.danger, fontWeight: 800, margin: "4px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    ⚠️ BLOCKED: BARRIER ACTIVE ON THIS FRONT
                                  </div>
                                )}
                                <div style={{ display: "flex", gap: 4 }}>
                                  {["I", "II", "III"].map((lvl) => {
                                    const selected = p.ability === ability.id && p.level === lvl;
                                    const isSalvage = role.id === "engineer";
                                    const costVal = isSalvage ? LEVELS_SALVAGE[lvl] : LEVELS[lvl].cost;
                                    const costLabel = `${costVal.toFixed(1)} ${isSalvage ? "Salvage" : "Entropy"}`;
                                    return (
                                      <button key={lvl} onClick={() => setPlayerChoice(idx, ability.id, lvl)} disabled={!!state.gameOver || isBlockedBarrier} className="level-pill"
                                        title={isBlockedBarrier ? "Only one barrier can be active on this front at a time" : costLabel}
                                        style={{
                                          flex: 1,
                                          padding: "5px 0",
                                          borderRadius: 5,
                                          cursor: isBlockedBarrier ? "not-allowed" : state.gameOver ? "default" : "pointer",
                                          border: `1px solid ${selected ? LEVEL_COLOR[lvl] : COLORS.panelBorder}`,
                                          background: selected ? `${LEVEL_COLOR[lvl]}22` : "#00000020",
                                          boxShadow: selected ? `0 0 10px ${LEVEL_COLOR[lvl]}44` : "none",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          gap: 1,
                                          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                                          opacity: isBlockedBarrier ? 0.35 : 1
                                        }}>
                                        <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: selected ? LEVEL_COLOR[lvl] : COLORS.muted }}>{lvl}</span>
                                        <span className="mono" style={{ fontSize: 7.5, fontWeight: 500, color: selected ? LEVEL_COLOR[lvl] : COLORS.muted, opacity: 0.75 }}>{costVal.toFixed(1)} {isSalvage ? "SLV" : "ENT"}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!state.gameOver ? (
          !showingEvent && (
            <button onClick={resolveRound} disabled={state.players.some((p) => !p.ability)} className="action-btn primary-btn"
              style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", fontSize: 13.5, fontWeight: 700, cursor: state.players.some((p) => !p.ability) ? "not-allowed" : "pointer", background: state.players.some((p) => !p.ability) ? COLORS.panelBorder : COLORS.bone, color: state.players.some((p) => !p.ability) ? COLORS.muted : COLORS.void, letterSpacing: 1.5, marginBottom: 22 }}>
              RESOLVE ROUND
            </button>
          )
        ) : (
          <PostMortemModal
            gameOver={state.gameOver}
            lossType={state.lossType}
            round={state.round}
            sector={sector}
            domFront={dom[0]}
            postMortemResult={postMortemResult}
            captainProfile={captainProfile}
            shipName={shipNameInput}
            highScoresList={highScoresList}
            onLaunchNewVoyage={launchNextVoyage}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
            onReturnToBridge={() => {
              setState(initialState());
              setPostMortemResult(null);
              clearRunState();
            }}
          />
        )}

        <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 8 }}>SESSION LOG</div>
        <div ref={logContainerRef} style={{ ...panelStyle, padding: 12, maxHeight: 200, overflowY: "auto" }}>
          {state.log.length === 0 && <div style={{ color: COLORS.muted, fontSize: 12.5 }}>Respond to the first round to begin.</div>}
          {state.log.map((entry, i) => {
            if (entry.type === "intro") return <div key={i} style={{ fontSize: 12.5, color: COLORS.bone, fontStyle: "italic", padding: "2px 0" }}>The Fracture opens. The first threat is already visible. Answer it.</div>;
            if (entry.type === "round") return <div key={i} className="mono" style={{ fontSize: 10.5, color: COLORS.muted, marginTop: i > 0 ? 10 : 0, borderTop: i > 0 ? `1px solid ${COLORS.panelBorder}` : "none", paddingTop: i > 0 ? 8 : 0 }}>— ROUND {entry.round} —</div>;
            if (entry.type === "lull") return <div key={i} style={{ fontSize: 12.5, color: COLORS.muted, fontStyle: "italic", padding: "2px 0" }}>Quiet. Nothing surfaced this round.</div>;
            if (entry.type === "event") return (
              <div key={i} style={{ padding: "4px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Compass size={12} color={COLORS.event} /><span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.event }}>{entry.title}</span><span className="mono" style={{ fontSize: 11, color: COLORS.muted }}>— {entry.choice}</span></div>
                <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2, marginLeft: 18, fontStyle: "italic" }}>{entry.result}</div>
              </div>
            );
            if (entry.type === "threat") {
              const color = entry.category === "targeted" ? COLORS.ruthless : entry.category === "telegraphed" ? COLORS.methodical : COLORS.desperate1;
              return (
                <div key={i} style={{ padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {entry.category === "targeted" && <Zap size={12} color={color} />}{entry.category === "telegraphed" && <Flame size={12} color={color} />}{entry.category === "cascading" && <AlertTriangle size={12} color={color} />}
                    <span style={{ fontSize: 12.5, fontWeight: 600, color }}>{CATEGORIES[entry.category].label}</span>
                    <span className="mono" style={{ fontSize: 11.5, color: COLORS.muted }}>−{entry.dmg} {meterLabel[entry.hits]}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2, marginLeft: 18 }}>{entry.line}</div>
                </div>
              );
            }
            if (entry.type === "loss") return <div key={i} style={{ fontSize: 12.5, color: COLORS.danger, fontWeight: 700, padding: "4px 0" }}>{entry.reason}</div>;
            if (entry.type === "defiance") return <div key={i} style={{ fontSize: 12.5, color: ANCHORS.dez.color, fontStyle: "italic", padding: "4px 0" }}>⚡ The crew overrides Dez — {entry.from} → {entry.to} {entry.level}. Nobody asked permission.</div>;
            if (entry.type === "bank_expired") return <div key={i} style={{ fontSize: 12, color: COLORS.muted, fontStyle: "italic", padding: "2px 0" }}>Left standing too long: {entry.banked.toFixed(1)} on the {meterLabelStatic[entry.front] || entry.front} barrier. The debt came due.</div>;
            if (entry.type === "bank_claimed") return <div key={i} style={{ fontSize: 12, color: COLORS.salvage, padding: "2px 0" }}>Barrier claimed — +{entry.payout.toFixed(1)} to {meterLabelStatic[entry.front] || entry.front}{entry.moraleGain ? `, +${entry.moraleGain} Morale` : ""}.</div>;
            if (entry.type === "belief_spent") return <div key={i} style={{ fontSize: 12.5, color: ANCHORS[state.anchorPersona]?.color || COLORS.bone, fontWeight: 600, padding: "4px 0" }}>Belief spent — +{entry.payout.toFixed(1)} to {meterLabelStatic[entry.front] || entry.front}.</div>;
            return null;
          })}
          <div ref={logEndRef} />
        </div>
        {/* TACTICAL BRIEFING MODAL */}
        {briefingOpen && <BriefingModal setBriefingOpen={setBriefingOpen} COLORS={COLORS} panelStyle={panelStyle} />}
        {/* CAPTAIN'S MANIFEST MODAL */}
        {manifestOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.88)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", border: `1.5px solid ${COLORS.event}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Terminal size={22} color={COLORS.event} />
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted }}>OFFICIAL LOGS</div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.bone }}>CAPTAIN'S MANIFEST</h2>
                  </div>
                </div>
                <button onClick={() => setManifestOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 6 }}><X size={20} /></button>
              </div>

              <div style={{ background: COLORS.void, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.panelBorder}`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>ACTIVE VESSEL NAME</div>
                  {editingShipName ? (
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input type="text" value={shipNameInput} onChange={(e) => setShipNameInput(e.target.value)} style={{ background: COLORS.panel2, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px 8px", borderRadius: 4, fontSize: 13 }} />
                      <button onClick={() => { setShipName(shipNameInput); setEditingShipName(false); }} className="action-btn" style={{ background: COLORS.event, color: COLORS.void, border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.bone, marginTop: 2 }}>{shipNameInput || "USSC PROSIS"}</div>
                  )}
                </div>
                {!editingShipName && (
                  <button onClick={() => setEditingShipName(true)} className="action-btn" style={{ background: `${COLORS.event}22`, border: `1px solid ${COLORS.event}55`, color: COLORS.event, padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Edit3 size={12} /> Rename Vessel
                  </button>
                )}
              </div>

              <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8, fontWeight: 600 }}>RECORDED VOYAGE HISTORY ({manifestEntries.length})</div>
              {manifestEntries.length === 0 ? (
                <div style={{ background: COLORS.void, padding: 16, borderRadius: 8, color: COLORS.muted, fontSize: 12.5, fontStyle: "italic", textAlign: "center" }}>No manifest entries recorded yet. Complete or conclude a voyage to record history.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" }}>
                  {manifestEntries.slice().reverse().map((entry, i) => (
                    <div key={i} style={{ background: COLORS.void, padding: 10, borderRadius: 8, border: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.bone }}>Sector {entry.sector} · Round {entry.round}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Anchor: <span style={{ color: ANCHORS[entry.anchorPersona]?.color || COLORS.bone }}>{ANCHORS[entry.anchorPersona]?.name || entry.anchorPersona}</span></div>
                      </div>
                      <div style={{ fontSize: 11.5, color: entry.causeOfLoss?.includes("VICTORY") ? COLORS.salvage : COLORS.danger, fontWeight: 600, textAlign: "right", maxWidth: "50%" }}>{entry.causeOfLoss}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {manifestEntries.length > 0 && (
                  <button onClick={() => { clearCaptainsManifest(); setManifestEntries([]); }} className="action-btn" style={{ background: `${COLORS.danger}22`, color: COLORS.danger, border: `1px solid ${COLORS.danger}55`, borderRadius: 6, padding: "6px 12px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Trash2 size={12} /> Clear Manifest
                  </button>
                )}
                <button onClick={() => setManifestOpen(false)} className="action-btn" style={{ background: COLORS.event, color: COLORS.void, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>CLOSE MANIFEST</button>
              </div>
            </div>
          </div>
        )}
        {/* LORE SIGNALS MODAL */}
        {loreOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.88)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", border: `1.5px solid ${COLORS.re}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Radio size={22} color={COLORS.re} />
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted }}>TRANSCRIPTS & TELEMETRY</div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.bone }}>LORE SIGNALS ({unlockedLoreList.length}/{LORE_SIGNALS.length})</h2>
                  </div>
                </div>
                <button onClick={() => setLoreOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 6 }}><X size={20} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
                {LORE_SIGNALS.map((sig) => {
                  const unlocked = unlockedLoreList.includes(sig.id);
                  return (
                    <div key={sig.id} style={{ background: COLORS.void, padding: 12, borderRadius: 8, border: `1px solid ${unlocked ? COLORS.re + "66" : COLORS.panelBorder}`, opacity: unlocked ? 1 : 0.65 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: unlocked ? COLORS.re : COLORS.muted, display: "flex", alignItems: "center", gap: 6 }}>
                          {unlocked ? <Radio size={14} color={COLORS.re} /> : <Lock size={14} color={COLORS.muted} />} {sig.title}
                        </div>
                        <span className="mono" style={{ fontSize: 10, background: unlocked ? `${COLORS.re}22` : `${COLORS.muted}22`, color: unlocked ? COLORS.re : COLORS.muted, padding: "2px 6px", borderRadius: 4 }}>{sig.category}</span>
                      </div>
                      {unlocked ? (
                        <div style={{ fontSize: 11.5, color: COLORS.bone, lineHeight: 1.5, whiteSpace: "pre-wrap", marginTop: 4, fontStyle: "italic" }}>{sig.content}</div>
                      ) : (
                        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>🔒 <i>{sig.conditionDesc}</i></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setLoreOpen(false)} className="action-btn" style={{ background: COLORS.re, color: COLORS.bone, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>CLOSE LORE SIGNALS</button>
              </div>
            </div>
          </div>
        )}
        {/* ACHIEVEMENTS MODAL */}
        {achievementsOpen && <AchievementsModal setAchievementsOpen={setAchievementsOpen} ACHIEVEMENTS_LIST={ACHIEVEMENTS_LIST} unlockedAchList={unlockedAchList} COLORS={COLORS} panelStyle={panelStyle} />}
        {/* WDT ONBOARDING DIAGNOSTIC MODAL */}
        {wdtOpen && <WdtModal setWdtOpen={setWdtOpen} wdtStep={wdtStep} setWdtStep={setWdtStep} wdtAnswers={wdtAnswers} setWdtAnswers={setWdtAnswers} COLORS={COLORS} panelStyle={panelStyle} ANCHORS={ANCHORS} setAnchorChoice={setAnchorChoice} captainProfile={captainProfile} setCaptainProfile={setCaptainProfile} saveCaptainProfile={saveCaptainProfile} shipNameInput={shipNameInput} setShipNameInput={setShipNameInput} setShipName={setShipName} />}
        {/* CAPTAIN PROFILE & COSMETICS MODAL */}
        {profileOpen && <ProfileModal setProfileOpen={setProfileOpen} captainProfile={captainProfile} setCaptainProfile={setCaptainProfile} cosmeticsProfile={cosmeticsProfile} COLORS={COLORS} panelStyle={panelStyle} ANCHORS={ANCHORS} shipNameInput={shipNameInput} setShipNameInput={setShipNameInput} saveCaptainProfile={saveCaptainProfile} setShipName={setShipName} />}
        {/* GLOBAL ARCADE LEADERBOARD CABINET MODAL */}
        {leaderboardOpen && <LeaderboardModal setLeaderboardOpen={setLeaderboardOpen} leaderboardFilter={leaderboardFilter} setLeaderboardFilter={setLeaderboardFilter} highScoresList={highScoresList} COLORS={COLORS} panelStyle={panelStyle} ANCHORS={ANCHORS} />}



      </div>
    </div>
  );
}
 
