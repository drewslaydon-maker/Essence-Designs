/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  BaseballPitch,
  BaseballState,
  FlyPitchType,
  UserPitchThrow,
  PilotId,
  MechaCustomization,
} from '../types';
import { FlyBrainConnectome } from '../simulation/flyBrainConnectome';
import { PILOT_ROSTER } from '../simulation/pilotData';
import { audio } from '../services/audioService';
import {
  CircleDot,
  Trophy,
  Zap,
  Play,
  Crosshair,
  Target,
  Sparkles,
  Brain,
  RotateCcw,
  Radio,
  Check,
  Flame,
} from 'lucide-react';

interface BaseballProtocolProps {
  connectome: FlyBrainConnectome;
  onAwardCredits?: (amount: number) => void;
  customization?: MechaCustomization;
}

export const BaseballProtocol: React.FC<BaseballProtocolProps> = ({
  connectome,
  onAwardCredits,
  customization,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [drillMode, setDrillMode] = useState<'BATTING' | 'PITCHING'>('PITCHING');

  // Active Fly Pitcher on the Mound
  const [pitcherPilotId, setPitcherPilotId] = useState<PilotId>(
    customization?.activePilotId || 'SHIN_FLY'
  );
  const [windupPhase, setWindupPhase] = useState<'IDLE' | 'WINDUP' | 'RELEASE'>('IDLE');
  const [flyAutonomousMode, setFlyAutonomousMode] = useState(true);
  const [autoBullpenActive, setAutoBullpenActive] = useState(false);

  // Batting State
  const [battingState, setBattingState] = useState<BaseballState>({
    drillMode: 'BATTING',
    strikes: 0,
    balls: 0,
    outs: 0,
    runs: 0,
    score: 0,
    currentPitch: null,
    pitchHistory: [],
    flyPilotPrediction: {
      loomingExpansionRate: 0,
      estimatedArrivalTimeMs: 0,
      confidence: 96,
    },
    pitchingStats: {
      strikeouts: 0,
      walks: 0,
      hitsAllowed: 0,
      pitchesThrown: 0,
    },
  });

  const [autoSwingMode, setAutoSwingMode] = useState(true);
  const [lastHitFeedback, setLastHitFeedback] = useState<{
    text: string;
    subtext: string;
    color: string;
    isHomeRun?: boolean;
  } | null>(null);

  // Pitching Mode State
  const [selectedPitchType, setSelectedPitchType] = useState<FlyPitchType>('SACCADE_FASTBALL');
  const [selectedQuadrant, setSelectedQuadrant] = useState<number>(4); // 0-8
  const [activeUserPitch, setActiveUserPitch] = useState<UserPitchThrow | null>(null);
  const [pitchingFeedback, setPitchingFeedback] = useState<{
    text: string;
    subtext: string;
    color: string;
  } | null>(null);

  // Live Fly Decision Telemetry
  const [flyPitchCall, setFlyPitchCall] = useState<{
    pitchType: FlyPitchType;
    quadrant: number;
    speedMph: number;
    quote: string;
    neuralTrigger: string;
  }>({
    pitchType: 'SACCADE_FASTBALL',
    quadrant: 4,
    speedMph: 104,
    quote: '"I have to throw a strike... Saccade Fastball loaded!"',
    neuralTrigger: '[Descending Motor DNa01]: +42mV Action Potential Spike',
  });

  const activePilotData = PILOT_ROSTER[pitcherPilotId] || PILOT_ROSTER.SHIN_FLY;

  // Generate autonomous pitch call based on active fly pilot's neurobiology
  const generateFlyPitchCall = useCallback((pilotId: PilotId) => {
    let type: FlyPitchType = 'SACCADE_FASTBALL';
    let quad = 4;
    let speed = 104;
    let quote = '';
    let trigger = '';

    if (pilotId === 'SHIN_FLY') {
      const types: FlyPitchType[] = ['SACCADE_FASTBALL', 'HALTERE_CURVE', 'COMPOUND_SPLITTER'];
      type = types[Math.floor(Math.random() * types.length)];
      // Cautious corners: 6 (bottom-left), 7 (bottom-center), 8 (bottom-right)
      const quads = [6, 7, 8, 3, 5];
      quad = quads[Math.floor(Math.random() * quads.length)];
      if (type === 'SACCADE_FASTBALL') {
        speed = 103 + Math.floor(Math.random() * 3);
        quote = '"I must not fly away... Father, watch this Saccade Fastball!"';
        trigger = '[Giant Fiber Escape & PS1 Saccade Axon]: +44mV Peak Spike';
      } else if (type === 'HALTERE_CURVE') {
        speed = 85 + Math.floor(Math.random() * 3);
        quote = '"Focusing haltere balance... sweeping curve to the low corner."';
        trigger = '[Haltere Campaniform Sensilla]: Angular Gyro Yaw Torque';
      } else {
        speed = 78 + Math.floor(Math.random() * 4);
        quote = '"Please swing over it... Compound Splitter diving into the dirt."';
        trigger = '[Lobula Plate Motion T4/T5]: Optic Lead Stalling Pattern';
      }
    } else if (pilotId === 'ASU_MAG') {
      const types: FlyPitchType[] = ['SACCADE_FASTBALL', 'SACCADE_FASTBALL', 'HALTERE_CURVE'];
      type = types[Math.floor(Math.random() * types.length)];
      // Aggressive high-and-tight sectors: 0, 1, 2
      const quads = [0, 1, 2, 4];
      quad = quads[Math.floor(Math.random() * quads.length)];
      if (type === 'SACCADE_FASTBALL') {
        speed = 105 + Math.floor(Math.random() * 3);
        quote = '"ANTA BAKA SACHIEL! Try hitting this 107 MPH heat at your eyes!"';
        trigger = '[LC10 Visual Target Pursuit & Thoracic Motor]: 240 Hz Wingbeat';
      } else {
        speed = 86 + Math.floor(Math.random() * 3);
        quote = '"Watch this vicious Haltere break snap right across the plate!"';
        trigger = '[Haltere Torque Motor DNa02]: Violent Lateral Yaw Force';
      }
    } else {
      // REI_VA
      const types: FlyPitchType[] = ['SUCROSE_SINKER', 'COMPOUND_SPLITTER', 'HALTERE_CURVE'];
      type = types[Math.floor(Math.random() * types.length)];
      // Surgical low and edge sectors: 3, 5, 7
      const quads = [3, 5, 7, 6, 8];
      quad = quads[Math.floor(Math.random() * quads.length)];
      if (type === 'SUCROSE_SINKER') {
        speed = 89 + Math.floor(Math.random() * 3);
        quote = '"Sachiel contact probability: 11%. Delivering Sucrose Sinker below the knees."';
        trigger = '[Gustatory Sugar Labellum Circuit]: Satiety-Weighted Trajectory';
      } else if (type === 'COMPOUND_SPLITTER') {
        speed = 77 + Math.floor(Math.random() * 3);
        quote = '"Elementary motion detector null-point calculated. Splitting trajectory."';
        trigger = '[E-PG Central Complex Ring Compass]: Static Heading Stability';
      } else {
        speed = 84 + Math.floor(Math.random() * 3);
        quote = '"A.T. Field geometry aligned. Painting the outside corner."';
        trigger = '[Optic Lobe Motion Field]: Phase-Harmonic Curve';
      }
    }

    setFlyPitchCall({
      pitchType: type,
      quadrant: quad,
      speedMph: speed,
      quote,
      neuralTrigger: trigger,
    });
    setSelectedPitchType(type);
    setSelectedQuadrant(quad);
  }, []);

  // Update pitch call when pitcher changes
  useEffect(() => {
    generateFlyPitchCall(pitcherPilotId);
  }, [pitcherPilotId, generateFlyPitchCall]);

  // ==========================================
  // 1. BATTING SIMULATION LOGIC (Looming Peak)
  // ==========================================

  const throwBattingPitch = useCallback(() => {
    audio.playPitchWhoosh();
    setLastHitFeedback(null);

    const pitchTypes: BaseballPitch['ballType'][] = ['FASTBALL', 'CURVEBALL', 'CHANGEUP', 'ANGEL_SINKER'];
    const selectedType = pitchTypes[Math.floor(Math.random() * pitchTypes.length)];

    let speed = 99;
    if (selectedType === 'CHANGEUP') speed = 82;
    if (selectedType === 'CURVEBALL') speed = 87;
    if (selectedType === 'ANGEL_SINKER') speed = 104;

    const newPitch: BaseballPitch = {
      id: `PITCH_${Date.now()}`,
      ballType: selectedType,
      speedMph: speed,
      position: { x: (Math.random() - 0.5) * 6, y: -2, z: 60 },
      targetLocation: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
      isSwung: false,
      swingTiming: null,
      result: 'PENDING',
      exitVelocityMph: 0,
      distanceFt: 0,
    };

    setBattingState((prev) => ({
      ...prev,
      currentPitch: newPitch,
    }));
  }, []);

  const executeSwing = useCallback(() => {
    setBattingState((prev) => {
      if (!prev.currentPitch || prev.currentPitch.isSwung) return prev;

      const pitch = { ...prev.currentPitch };
      pitch.isSwung = true;

      const zDist = pitch.position.z;
      const timingDelta = zDist - 1.9;
      pitch.swingTiming = timingDelta;

      let result: BaseballPitch['result'] = 'STRIKE';
      let exitVel = 0;
      let distFt = 0;
      let feedbackText = 'SWING AND A MISS';
      let feedbackSub = 'MISSED THE LOOMING SWEET SPOT';
      let feedbackColor = 'text-red-400';
      let scoreInc = 0;
      let runsInc = 0;
      let newStrikes = prev.strikes;
      let newOuts = prev.outs;

      if (Math.abs(timingDelta) <= 0.35) {
        result = 'HOME_RUN';
        exitVel = Math.round(112 + Math.random() * 8);
        distFt = Math.round(470 + Math.random() * 45);
        feedbackText = 'GIANT FIBER CRUSH // GRAND SLAM!';
        feedbackSub = `PEAK LOOMING REFLEX SYNC [${exitVel} MPH // ${distFt} FT]`;
        feedbackColor = 'text-emerald-400';
        scoreInc = 500;
        runsInc = 4;
        newStrikes = 0;
        audio.playBatHit(true);
        audio.playCrowdCheer();
        if (onAwardCredits) onAwardCredits(250);
      } else if (Math.abs(timingDelta) <= 0.8) {
        result = 'DOUBLE';
        exitVel = Math.round(98 + Math.random() * 6);
        distFt = Math.round(340 + Math.random() * 30);
        feedbackText = 'SOLID CONTACT // EXTRA-BASE HIT!';
        feedbackSub = `GOOD TIMING [${distFt} FT INTO THE GAP]`;
        feedbackColor = 'text-cyan-400';
        scoreInc = 200;
        runsInc = 1;
        newStrikes = 0;
        audio.playBatHit(false);
        if (onAwardCredits) onAwardCredits(100);
      } else if (Math.abs(timingDelta) <= 1.4) {
        result = 'FOUL';
        feedbackText = 'FOUL BALL // DEFLECTED';
        feedbackSub = timingDelta > 0 ? 'SWUNG TOO EARLY' : 'SWUNG TOO LATE';
        feedbackColor = 'text-amber-400';
        if (newStrikes < 2) newStrikes++;
        audio.playBatHit(false);
      } else {
        result = 'STRIKE';
        newStrikes++;
        feedbackText = 'WHIFF // STRIKE';
        feedbackSub = timingDelta > 0 ? 'SWUNG WAY TOO EARLY' : 'SWUNG WAY TOO LATE';
        feedbackColor = 'text-red-400';
        audio.playPitchWhoosh();
      }

      if (newStrikes >= 3) {
        newOuts++;
        newStrikes = 0;
        feedbackText = 'STRIKEOUT // YOU ARE OUT!';
        feedbackColor = 'text-red-500';
        audio.playStrikeoutWhistle();
      }

      setLastHitFeedback({
        text: feedbackText,
        subtext: feedbackSub,
        color: feedbackColor,
        isHomeRun: result === 'HOME_RUN',
      });

      return {
        ...prev,
        strikes: newStrikes,
        outs: newOuts >= 3 ? 0 : newOuts,
        runs: prev.runs + runsInc,
        score: prev.score + scoreInc,
        currentPitch: pitch,
        pitchHistory: [pitch, ...prev.pitchHistory.slice(0, 6)],
      };
    });
  }, [onAwardCredits]);

  // ==========================================
  // 2. FLY PITCHING SIMULATION (Fly on the Mound!)
  // ==========================================

  const throwFlyPitch = useCallback(() => {
    if (activeUserPitch || windupPhase !== 'IDLE') return;

    // 1. Wind-up Animation phase
    setWindupPhase('WINDUP');
    audio.playRadioChirp();

    // The Fly delivers after brief biological windup
    setTimeout(() => {
      setWindupPhase('RELEASE');
      audio.playPitchWhoosh();
      setPitchingFeedback(null);

      const qx = ((flyPitchCall.quadrant % 3) - 1) * 0.75;
      const qy = (Math.floor(flyPitchCall.quadrant / 3) - 1) * 0.75;

      let speed = flyPitchCall.speedMph;
      let breakX = 0;
      let breakY = 0;

      if (flyPitchCall.pitchType === 'SACCADE_FASTBALL') {
        breakX = (Math.random() - 0.5) * 0.1;
        breakY = 0.05;
      } else if (flyPitchCall.pitchType === 'HALTERE_CURVE') {
        breakX = -0.55;
        breakY = 0.45;
      } else if (flyPitchCall.pitchType === 'SUCROSE_SINKER') {
        breakX = 0.15;
        breakY = 0.75;
      } else if (flyPitchCall.pitchType === 'COMPOUND_SPLITTER') {
        breakX = (Math.random() - 0.5) * 0.2;
        breakY = 0.95;
      }

      const newPitch: UserPitchThrow = {
        id: `FLY_PITCH_${Date.now()}`,
        type: flyPitchCall.pitchType,
        speedMph: speed,
        targetZone: { x: qx, y: qy },
        actualBreak: { x: breakX, y: breakY },
        z: 60,
        batterSwung: false,
        batterContact: 'LOOKING',
        result: 'STRIKE',
        pitcherPilotId,
        pitcherQuote: flyPitchCall.quote,
        neuralTrigger: flyPitchCall.neuralTrigger,
      };

      setActiveUserPitch(newPitch);

      setTimeout(() => {
        setWindupPhase('IDLE');
      }, 200);
    }, 280);
  }, [activeUserPitch, windupPhase, flyPitchCall, pitcherPilotId]);

  // Continuous Fly Bullpen Routine (Flies pitch autonomously in rhythm)
  useEffect(() => {
    if (!autoBullpenActive || drillMode !== 'PITCHING') return;

    const interval = setInterval(() => {
      if (!activeUserPitch && windupPhase === 'IDLE') {
        generateFlyPitchCall(pitcherPilotId);
        throwFlyPitch();
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [autoBullpenActive, drillMode, activeUserPitch, windupPhase, pitcherPilotId, generateFlyPitchCall, throwFlyPitch]);

  // Spacebar controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (drillMode === 'BATTING') {
          if (!battingState.currentPitch || battingState.currentPitch.isSwung) {
            throwBattingPitch();
          } else {
            executeSwing();
          }
        } else {
          if (!activeUserPitch && windupPhase === 'IDLE') {
            throwFlyPitch();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drillMode, battingState.currentPitch, activeUserPitch, windupPhase, throwBattingPitch, executeSwing, throwFlyPitch]);

  // ==========================================
  // BATTING MAIN FLIGHT ANIMATION LOOP (60 FPS)
  // ==========================================
  useEffect(() => {
    if (drillMode !== 'BATTING') return;

    let animId: number;

    const loop = () => {
      setBattingState((prev) => {
        if (!prev.currentPitch || prev.currentPitch.position.z <= -10) {
          return prev;
        }

        const p = { ...prev.currentPitch };
        const ftPerFrame = (p.speedMph * 1.467) / 60;
        p.position.z -= ftPerFrame;

        if (p.ballType === 'CURVEBALL') {
          p.position.x += Math.sin((60 - p.position.z) * 0.1) * 0.18;
          p.position.y += 0.05;
        } else if (p.ballType === 'ANGEL_SINKER') {
          p.position.y += ((60 - p.position.z) / 60) * 0.15;
        }

        const currentAngularSize = 4 / Math.max(0.5, p.position.z);
        const nextAngularSize = 4 / Math.max(0.5, p.position.z - ftPerFrame);
        const loomingExpansion = Math.max(0, (nextAngularSize - currentAngularSize) * 35);

        connectome.feedSensoryData({
          angelRelativeAngle: (p.position.x / 10) * 0.4,
          angelDistance: p.position.z * 10,
          loomingExpansionVelocity: loomingExpansion,
          opticFlowLeft: p.position.x > 0 ? 0.3 : 0,
          opticFlowRight: p.position.x < 0 ? 0.3 : 0,
          sugarLureActive: false,
          lightStrobeActive: false,
        });
        connectome.step();

        if (autoSwingMode && !p.isSwung && p.position.z <= 2.1 && p.position.z >= 1.6) {
          executeSwing();
        }

        if (!p.isSwung && p.position.z < -2) {
          p.isSwung = true;
          p.result = 'STRIKE';
          const newStrikes = prev.strikes + 1;
          const newOuts = newStrikes >= 3 ? prev.outs + 1 : prev.outs;

          if (newStrikes >= 3) audio.playStrikeoutWhistle();

          setLastHitFeedback({
            text: newStrikes >= 3 ? 'CALLED STRIKE THREE // OUT!' : 'CALLED STRIKE // LOOKING',
            subtext: 'PITCH CROSSED THE STRIKE ZONE UNCONTESTED',
            color: 'text-amber-400',
          });

          return {
            ...prev,
            strikes: newStrikes >= 3 ? 0 : newStrikes,
            outs: newOuts >= 3 ? 0 : newOuts,
            currentPitch: p,
          };
        }

        return {
          ...prev,
          currentPitch: p,
          flyPilotPrediction: {
            loomingExpansionRate: loomingExpansion,
            estimatedArrivalTimeMs: Math.max(0, Math.round((p.position.z / (p.speedMph * 1.467)) * 1000)),
            confidence: 98,
          },
        };
      });

      renderBattingCanvas();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [drillMode, autoSwingMode, connectome, executeSwing]);

  // ==========================================
  // FLY PITCHING MAIN FLIGHT ANIMATION LOOP (60 FPS)
  // ==========================================
  useEffect(() => {
    if (drillMode !== 'PITCHING' || !activeUserPitch) return;

    let animId: number;

    const pitchLoop = () => {
      setActiveUserPitch((prev) => {
        if (!prev) return null;

        const ftPerFrame = (prev.speedMph * 1.467) / 60;
        const nextZ = prev.z - ftPerFrame;

        // When ball crosses home plate (z <= 1.5ft)
        if (nextZ <= 1.5 && !prev.batterSwung) {
          const progress = 1 - Math.max(0, nextZ / 60);
          const finalX = prev.targetZone.x + prev.actualBreak.x * progress;
          const finalY = prev.targetZone.y + prev.actualBreak.y * progress;

          const inZone = Math.abs(finalX) <= 1.05 && Math.abs(finalY) <= 1.05;

          let contact: UserPitchThrow['batterContact'] = 'LOOKING';
          let outcome: UserPitchThrow['result'] = 'STRIKE';
          let feedTitle = 'STRIKE // WHIFF!';
          let feedSub = `${activePilotData.name.split(' ')[0]} tricked Sachiel into swinging over the ball!`;
          let feedColor = 'text-emerald-400';

          if (inZone) {
            if (prev.speedMph >= 104 && Math.random() < 0.65) {
              contact = 'WHIFF';
              outcome = 'STRIKE';
              feedTitle = `${prev.speedMph} MPH HEAT BLOWN BY SACHIEL!`;
              feedSub = `${activePilotData.name} blows pure fastball right past the Angel!`;
              audio.playBatHit(false);
            } else if (Math.random() < 0.35) {
              contact = 'FOUL';
              outcome = 'STRIKE';
              feedTitle = 'FOUL BALL // DEFLECTED';
              feedSub = 'Angel ticked the ball off its A.T. Field bat';
              feedColor = 'text-amber-400';
              audio.playBeep(260, 'triangle', 0.1);
            } else {
              contact = 'FLYOUT';
              outcome = 'OUT';
              feedTitle = 'WEAK POP FLY // EASY OUT!';
              feedSub = 'Routine flyout caught by EVA-066 outfielders';
              feedColor = 'text-cyan-400';
              audio.playBatHit(false);
            }
          } else {
            if (Math.abs(prev.actualBreak.x) > 0.3 || Math.abs(prev.actualBreak.y) > 0.5) {
              contact = 'WHIFF';
              outcome = 'STRIKE';
              feedTitle = 'TRICKED! SWINGING STRIKE!';
              feedSub = 'Vicious break deceived Sachiel outside the strike zone!';
              audio.playBatHit(false);
            } else {
              contact = 'LOOKING';
              outcome = 'BALL';
              feedTitle = 'BALL // OUTSIDE';
              feedSub = 'Missed the strike zone matrix';
              feedColor = 'text-neutral-400';
              audio.playBeep(180, 'sine', 0.1);
            }
          }

          setPitchingFeedback({
            text: feedTitle,
            subtext: feedSub,
            color: feedColor,
          });

          // Update Pitching stats in Batting State
          setBattingState((b) => {
            let newStrikes = b.strikes;
            let newBalls = b.balls;
            let newOuts = b.outs;
            let newKs = b.pitchingStats.strikeouts;
            let newBBs = b.pitchingStats.walks;

            if (outcome === 'STRIKE') {
              newStrikes++;
              if (newStrikes >= 3) {
                newKs++;
                newOuts++;
                newStrikes = 0;
                newBalls = 0;
                audio.playStrikeoutWhistle();
                if (onAwardCredits) onAwardCredits(350);
              }
            } else if (outcome === 'BALL') {
              newBalls++;
              if (newBalls >= 4) {
                newBBs++;
                newStrikes = 0;
                newBalls = 0;
              }
            } else if (outcome === 'OUT') {
              newOuts++;
              newStrikes = 0;
              newBalls = 0;
              if (onAwardCredits) onAwardCredits(150);
            }

            if (newOuts >= 3) {
              newOuts = 0;
            }

            return {
              ...b,
              strikes: newStrikes,
              balls: newBalls,
              outs: newOuts,
              pitchingStats: {
                ...b.pitchingStats,
                strikeouts: newKs,
                walks: newBBs,
                pitchesThrown: b.pitchingStats.pitchesThrown + 1,
              },
            };
          });

          return {
            ...prev,
            z: nextZ,
            batterSwung: contact !== 'LOOKING',
            batterContact: contact,
            result: outcome,
          };
        }

        // Finish pitch when ball travels past plate
        if (nextZ <= -5) {
          generateFlyPitchCall(pitcherPilotId);
          return null;
        }

        return { ...prev, z: nextZ };
      });

      renderPitchingCanvas();
      animId = requestAnimationFrame(pitchLoop);
    };

    animId = requestAnimationFrame(pitchLoop);
    return () => cancelAnimationFrame(animId);
  }, [drillMode, activeUserPitch, onAwardCredits, activePilotData, generateFlyPitchCall, pitcherPilotId]);

  // ==========================================
  // CANVAS RENDER: BATTING STADIUM
  // ==========================================
  const renderBattingCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);
    const cx = w / 2;
    const cy = h / 2;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#030712');
    skyGrad.addColorStop(0.6, '#0f172a');
    skyGrad.addColorStop(1, '#05070a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Wireframe pyramid
    ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 180, cy - 80);
    ctx.lineTo(cx, cy - 140);
    ctx.lineTo(cx + 180, cy - 80);
    ctx.stroke();
    ctx.restore();

    // Home plate
    const plateY = h - 60;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, plateY + 22);
    ctx.lineTo(cx - 20, plateY);
    ctx.lineTo(cx - 20, plateY - 16);
    ctx.lineTo(cx + 20, plateY - 16);
    ctx.lineTo(cx + 20, plateY);
    ctx.closePath();
    ctx.fill();

    // Strike Zone
    const szTop = cy - 70;
    const szBottom = cy + 40;
    const szLeft = cx - 50;
    const szRight = cx + 50;

    ctx.strokeStyle = 'rgba(255, 140, 0, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(szLeft, szTop, szRight - szLeft, szBottom - szTop);

    // Ball Flight
    const pitch = battingState.currentPitch;
    if (pitch && pitch.position.z > -5) {
      const scale = 320 / Math.max(1, pitch.position.z + 5);
      const bx = cx + pitch.position.x * scale;
      const by = cy + pitch.position.y * scale;
      const ballRadius = Math.max(4, 18 * (scale / 12));

      ctx.save();
      ctx.fillStyle = pitch.ballType === 'ANGEL_SINKER' ? '#ff3366' : '#ffffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(bx, by, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Eva Unit-066 Progressive Bat
    ctx.save();
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 12;

    const batAngle = pitch?.isSwung ? -Math.PI * 0.22 : Math.PI * 0.35;
    const batRootX = cx + 80;
    const batRootY = plateY + 10;
    const batEndX = batRootX - Math.cos(batAngle) * 85;
    const batEndY = batRootY - Math.sin(batAngle) * 85;

    ctx.beginPath();
    ctx.moveTo(batRootX, batRootY);
    ctx.lineTo(batEndX, batEndY);
    ctx.stroke();
    ctx.restore();
  };

  // ==========================================
  // CANVAS RENDER: PITCHING STADIUM (FLY ON THE MOUND!)
  // ==========================================
  const renderPitchingCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);
    const cx = w / 2;
    const cy = h / 2;

    // Deep Tokyo-3 Night Stadium View
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#06040d');
    skyGrad.addColorStop(0.5, '#120b22');
    skyGrad.addColorStop(1, '#040306');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Infield dirt fan lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, h);
    ctx.lineTo(cx - 280, cy + 20);
    ctx.moveTo(cx, h);
    ctx.lineTo(cx + 280, cy + 20);
    ctx.stroke();
    ctx.restore();

    // Distant Home Plate (z ≈ 60ft away)
    const distantPlateY = cy + 45;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 16, distantPlateY, 32, 9);

    // 9-Quadrant Strike Zone at Home Plate
    const szW = 75;
    const szH = 85;
    const szLeft = cx - szW / 2;
    const szTop = distantPlateY - szH - 10;

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(szLeft, szTop, szW, szH);

    // Grid lines for 9 quadrants
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.moveTo(szLeft + szW / 3, szTop);
    ctx.lineTo(szLeft + szW / 3, szTop + szH);
    ctx.moveTo(szLeft + (szW * 2) / 3, szTop);
    ctx.lineTo(szLeft + (szW * 2) / 3, szTop + szH);
    ctx.moveTo(szLeft, szTop + szH / 3);
    ctx.lineTo(szLeft + szW, szTop + szH / 3);
    ctx.moveTo(szLeft, szTop + (szH * 2) / 3);
    ctx.lineTo(szLeft + szW, szTop + (szH * 2) / 3);
    ctx.stroke();

    // Highlight fly's selected aim quadrant
    const targetQuad = flyPitchCall.quadrant;
    const aimRow = Math.floor(targetQuad / 3);
    const aimCol = targetQuad % 3;
    const cellW = szW / 3;
    const cellH = szH / 3;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.fillRect(szLeft + aimCol * cellW, szTop + aimRow * cellH, cellW, cellH);

    // Aim Crosshair Reticle
    const aimX = szLeft + (aimCol + 0.5) * cellW;
    const aimY = szTop + (aimRow + 0.5) * cellH;
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(aimX, aimY, 7, 0, Math.PI * 2);
    ctx.moveTo(aimX - 11, aimY);
    ctx.lineTo(aimX + 11, aimY);
    ctx.moveTo(aimX, aimY - 11);
    ctx.lineTo(aimX, aimY + 11);
    ctx.stroke();

    // Angel Batter Standing in the Batter's Box (Sachiel)
    const batterX = cx - 55;
    const batterY = distantPlateY - 20;
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(batterX, batterY - 45, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Sachiel Mask
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(batterX, batterY - 40);
    ctx.lineTo(batterX + 6, batterY - 35);
    ctx.lineTo(batterX, batterY - 30);
    ctx.fill();

    // Sachiel Torso & Spider Leg joints
    ctx.beginPath();
    ctx.moveTo(batterX, batterY - 34);
    ctx.lineTo(batterX + 5, batterY);
    ctx.lineTo(batterX - 12, batterY + 22);
    ctx.moveTo(batterX + 5, batterY);
    ctx.lineTo(batterX + 15, batterY + 22);
    ctx.moveTo(batterX + 2, batterY - 25);
    ctx.lineTo(batterX + 20, batterY - 35);
    ctx.stroke();

    // Angel A.T. Field Bat
    const batterSwung = activeUserPitch?.batterSwung;
    const angelBatAngle = batterSwung ? Math.PI * 0.45 : -Math.PI * 0.25;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(batterX + 20, batterY - 35);
    ctx.lineTo(
      batterX + 20 + Math.cos(angelBatAngle) * 45,
      batterY - 35 + Math.sin(angelBatAngle) * 45
    );
    ctx.stroke();
    ctx.restore();

    // ==========================================
    // THE DROSOPHILA FLY PITCHER ON THE MOUND!
    // ==========================================
    const moundCenterY = h - 50;
    const pitcherX = cx;
    const pitcherY = moundCenterY;

    ctx.save();

    // Dirt mound circle
    ctx.fillStyle = '#3a2512';
    ctx.beginPath();
    ctx.ellipse(pitcherX, pitcherY + 25, 110, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5a3818';
    ctx.lineWidth = 2;
    ctx.stroke();

    // White Pitcher's Rubber Slab
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(pitcherX - 25, pitcherY + 15, 50, 8);

    // Pilot Chitin Colors
    const pilotColor = activePilotData.primaryColor;
    const eyeColor = activePilotData.accentColor;

    // Wing flapping oscillation (~200Hz visual buzz)
    const wingFlap = Math.sin(Date.now() * 0.05);
    const isWindingUp = windupPhase === 'WINDUP';
    const isReleasing = windupPhase === 'RELEASE';

    // 1. Translucent Fly Wings
    ctx.save();
    ctx.fillStyle = 'rgba(200, 240, 255, 0.25)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2;

    const wingAngleLeft = isWindingUp ? -0.8 : -0.3 + wingFlap * 0.15;
    const wingAngleRight = isWindingUp ? 0.8 : 0.3 - wingFlap * 0.15;

    // Left Wing
    ctx.save();
    ctx.translate(pitcherX - 10, pitcherY - 20);
    ctx.rotate(wingAngleLeft);
    ctx.beginPath();
    ctx.ellipse(0, -32, 14, 38, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(pitcherX + 10, pitcherY - 20);
    ctx.rotate(wingAngleRight);
    ctx.beginPath();
    ctx.ellipse(0, -32, 14, 38, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // 2. Chitin Abdomen (Segmented fly tail)
    ctx.fillStyle = pilotColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(pitcherX, pitcherY + 5, 18, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Abdominal stripes
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 2.5;
    for (let s = -8; s <= 12; s += 7) {
      ctx.beginPath();
      ctx.arc(pitcherX, pitcherY + s, 16, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // 3. Thorax & EVA Armor Pylons
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(pitcherX, pitcherY - 14, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // EVA Shoulder Pylons
    ctx.fillStyle = pilotColor;
    ctx.fillRect(pitcherX - 25, pitcherY - 30, 8, 22);
    ctx.fillRect(pitcherX + 17, pitcherY - 30, 8, 22);
    ctx.strokeStyle = eyeColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(pitcherX - 25, pitcherY - 30, 8, 22);
    ctx.strokeRect(pitcherX + 17, pitcherY - 30, 8, 22);

    // 4. Fly Head & Compound Eyes
    const headY = pitcherY - 32;
    ctx.fillStyle = '#171717';
    ctx.beginPath();
    ctx.arc(pitcherX, headY, 13, 0, Math.PI * 2);
    ctx.fill();

    // Left & Right Compound Eyes (Huge glowing ommatidia)
    ctx.save();
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 12;

    // Left eye
    ctx.beginPath();
    ctx.ellipse(pitcherX - 11, headY - 1, 9, 13, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.beginPath();
    ctx.ellipse(pitcherX + 11, headY - 1, 9, 13, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Compound Eye Facet Grids
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pitcherX - 15, headY - 8);
    ctx.lineTo(pitcherX - 7, headY + 6);
    ctx.moveTo(pitcherX + 15, headY - 8);
    ctx.lineTo(pitcherX + 7, headY + 6);
    ctx.stroke();

    // Aristae Feathery Antennae
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pitcherX - 4, headY - 11);
    ctx.quadraticCurveTo(pitcherX - 12, headY - 24, pitcherX - 18, headY - 20);
    ctx.moveTo(pitcherX + 4, headY - 11);
    ctx.quadraticCurveTo(pitcherX + 12, headY - 24, pitcherX + 18, headY - 20);
    ctx.stroke();

    // EVA Baseball Cap perched on the fly's head
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(pitcherX, headY - 10, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Cap visor bill
    ctx.fillStyle = pilotColor;
    ctx.beginPath();
    ctx.ellipse(pitcherX, headY - 11, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cap stencil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(activePilotData.evaUnit.replace('UNIT-', 'EVA-'), pitcherX, headY - 12);

    // 5. Forelegs & Baseball Claws
    const legY = isWindingUp ? pitcherY - 28 : pitcherY - 8;
    const handX = pitcherX + 22;

    ctx.strokeStyle = pilotColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(pitcherX + 10, pitcherY - 12);
    ctx.lineTo(pitcherX + 22, legY);
    ctx.stroke();

    // Regulation Baseball held in fly's tarsus (unless pitch is flying)
    if (!activeUserPitch) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(handX, legY, 9, 0, Math.PI * 2);
      ctx.fill();

      // Red seams
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(handX - 3, legY, 6, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(handX + 3, legY, 6, (Math.PI * 2) / 3, (Math.PI * 4) / 3);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // ==========================================
    // RENDER FLY PITCH FLIGHT TOWARD PLATE
    // ==========================================
    if (activeUserPitch) {
      const p = activeUserPitch;
      const progress = 1 - Math.max(0, p.z / 60); // 0 at mound, 1 at plate

      const flightX = cx + (p.targetZone.x * (szW / 2) + p.actualBreak.x * 25 * progress);
      const flightY = moundCenterY - 30 - progress * (moundCenterY - 30 - (szTop + szH / 2)) + p.actualBreak.y * 30 * progress;
      const ballR = Math.max(3.5, 14 * (1 - progress * 0.68));

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(flightX, flightY, ballR, 0, Math.PI * 2);
      ctx.fill();

      // Motion Trail
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = ballR * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx + 22, moundCenterY - 30);
      ctx.lineTo(flightX, flightY);
      ctx.stroke();
      ctx.restore();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-neutral-200 select-none overflow-y-auto p-3 sm:p-4 font-mono">
      {/* Top Banner: Mode Selector & Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-500/30 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-black border border-orange-500/40 rounded">
            <button
              onClick={() => {
                audio.playBeep(640);
                setDrillMode('PITCHING');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase transition-all ${
                drillMode === 'PITCHING'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>1. Fly Pitcher Sim [The Mound]</span>
            </button>

            <button
              onClick={() => {
                audio.playBeep(520);
                setDrillMode('BATTING');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase transition-all ${
                drillMode === 'BATTING'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>2. Batting Drill [Looming Peak]</span>
            </button>
          </div>
        </div>

        {/* Live Count & Synchro Score */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-3 bg-black/80 px-3 py-1.5 border border-neutral-800 rounded">
            <div>
              <span className="text-neutral-500 block text-[9px]">BALLS</span>
              <span className="text-cyan-400 font-bold font-teko text-base">{battingState.balls}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px]">STRIKES</span>
              <span className="text-amber-400 font-bold font-teko text-base">{battingState.strikes}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px]">OUTS</span>
              <span className="text-red-400 font-bold font-teko text-base">{battingState.outs}</span>
            </div>
            <div className="border-l border-neutral-700 pl-3">
              <span className="text-neutral-500 block text-[9px]">K (STRIKEOUTS)</span>
              <span className="text-purple-400 font-bold font-teko text-base">
                {battingState.pitchingStats.strikeouts}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-950/40 border border-orange-500/40 rounded text-orange-400">
            <Trophy className="w-4 h-4" />
            <span className="font-bold font-teko text-lg leading-none">{battingState.score} PTS</span>
          </div>
        </div>
      </div>

      {/* Main Stadium & Controls Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-[480px]">
        {/* Left 2 Cols: Stadium Canvas */}
        <div className="lg:col-span-2 relative bg-neutral-900/80 border border-neutral-800 rounded-lg overflow-hidden flex flex-col min-h-[420px]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

          {/* Flash Feedback Banner */}
          {drillMode === 'PITCHING' && pitchingFeedback && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 p-3 bg-black/90 border-2 border-purple-500 rounded-lg text-center z-10 backdrop-blur-md shadow-2xl animate-pulse">
              <div className={`text-xl font-bold font-teko tracking-wider ${pitchingFeedback.color}`}>
                {pitchingFeedback.text}
              </div>
              <div className="text-[11px] text-neutral-300 font-mono mt-0.5">
                {pitchingFeedback.subtext}
              </div>
            </div>
          )}

          {drillMode === 'BATTING' && lastHitFeedback && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 p-3 bg-black/90 border-2 border-orange-500 rounded-lg text-center z-10 backdrop-blur-md shadow-2xl animate-pulse">
              <div className={`text-xl font-bold font-teko tracking-wider ${lastHitFeedback.color}`}>
                {lastHitFeedback.text}
              </div>
              <div className="text-[11px] text-neutral-300 font-mono mt-0.5">
                {lastHitFeedback.subtext}
              </div>
            </div>
          )}

          {/* Bottom Overlay: Pitcher Bio-HUD */}
          {drillMode === 'PITCHING' ? (
            <div className="absolute bottom-3 left-3 p-2.5 bg-black/85 border border-purple-500/50 rounded text-xs max-w-md z-10">
              <div className="flex items-center justify-between text-purple-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>ACE PITCHER: {activePilotData.name}</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {windupPhase === 'WINDUP' ? '⚡ WINDING UP...' : 'ON RUBBER'}
                </span>
              </div>

              <div className="text-[11px] italic text-neutral-200 bg-neutral-900/80 p-1.5 rounded border-l-2 border-purple-500 mb-1 font-serif">
                {flyPitchCall.quote}
              </div>

              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>{flyPitchCall.neuralTrigger}</span>
                <span className="text-emerald-400 font-bold font-mono">SECTOR #{flyPitchCall.quadrant + 1}</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 p-2.5 bg-black/85 border border-cyan-500/40 rounded text-xs max-w-sm z-10">
              <div className="text-cyan-400 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GIANT FIBER LOOMING PEAK [η(t)]</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">SWEET SPOT: 1.8FT</span>
              </div>
              <div className="w-56 h-2 bg-neutral-800 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-red-400 transition-all"
                  style={{
                    width: `${Math.min(100, battingState.flyPilotPrediction.loomingExpansionRate * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>ETA: {battingState.flyPilotPrediction.estimatedArrivalTimeMs} ms</span>
                <span className="text-emerald-400 font-bold">CRUSH GRAND SLAMS</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Control Deck & Telemetry */}
        <div className="flex flex-col gap-3">
          {/* Pitching Mode: FLY PITCHING CONTROLS */}
          {drillMode === 'PITCHING' ? (
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-700/50 pb-1.5">
                <span className="font-bold text-purple-400 uppercase">FLY PITCHER CONTROLS</span>
                <span className="text-[10px] text-neutral-400">BATTER: SACHIEL</span>
              </div>

              {/* Pitcher Selection: Pick which fly takes the mound! */}
              <div>
                <div className="text-[10px] text-neutral-400 uppercase mb-1">Select Fly Pitcher on Mound:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['SHIN_FLY', 'ASU_MAG', 'REI_VA'] as PilotId[]).map((pid) => {
                    const p = PILOT_ROSTER[pid];
                    const isSelected = pitcherPilotId === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => {
                          audio.playRadioChirp();
                          setPitcherPilotId(pid);
                        }}
                        className={`p-1.5 rounded text-left border transition-all ${
                          isSelected
                            ? 'bg-purple-950 border-purple-400 text-white font-bold'
                            : 'bg-black/50 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] leading-tight truncate">{p.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-amber-400">{p.evaUnit}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fly Pitch Selection Card */}
              <div className="p-2.5 bg-black/60 border border-purple-500/40 rounded space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">FLY ARMED PITCH:</span>
                  <span className="text-purple-300 font-bold font-mono">
                    {flyPitchCall.pitchType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">PROJECTED HEAT:</span>
                  <span className="text-amber-400 font-bold font-mono">{flyPitchCall.speedMph} MPH</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">TARGET QUADRANT:</span>
                  <span className="text-emerald-400 font-bold font-mono">Sector #{flyPitchCall.quadrant + 1}</span>
                </div>
              </div>

              {/* Trigger Fly Pitch Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={throwFlyPitch}
                  disabled={!!activeUserPitch || windupPhase !== 'IDLE'}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 disabled:opacity-40 text-black font-bold font-teko text-lg uppercase rounded transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Let {activePilotData.name.split(' ')[0]} Pitch [Space]</span>
                </button>
              </div>

              {/* Continuous Fly Bullpen Toggle */}
              <button
                type="button"
                onClick={() => setAutoBullpenActive(!autoBullpenActive)}
                className={`w-full py-1.5 rounded border text-xs uppercase font-mono transition-colors flex items-center justify-center gap-1.5 ${
                  autoBullpenActive
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                <RotateCcw className={`w-3 h-3 ${autoBullpenActive ? 'animate-spin' : ''}`} />
                <span>Continuous Bullpen Routine: {autoBullpenActive ? 'ACTIVE [EVERY 3.2S]' : 'OFF'}</span>
              </button>

              <div className="text-[11px] text-neutral-400 leading-relaxed bg-black/40 p-2 rounded border border-neutral-800">
                <strong>Connectome Pitching:</strong> The flies choose their own pitch arsenal, paint the strike zone, and adjust velocity using haltere mechanosensors and saccade motor neurons!
              </div>
            </div>
          ) : (
            /* Batting Controls */
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-700/50 pb-1.5">
                <span className="font-bold text-orange-400 uppercase">BATTER CONTROLS</span>
                <span className="text-[10px] text-neutral-400">EVA PROGRESSIVE BAT</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={throwBattingPitch}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold font-teko text-base uppercase rounded transition-colors shadow-md shadow-orange-500/20"
                >
                  <Play className="w-4 h-4" />
                  <span>Launch Pitch [Space]</span>
                </button>

                <button
                  type="button"
                  onClick={executeSwing}
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-teko text-base uppercase rounded transition-colors"
                >
                  Swing Bat
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAutoSwingMode(!autoSwingMode)}
                className={`w-full py-1.5 rounded border text-xs uppercase font-mono transition-colors ${
                  autoSwingMode
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                Auto-Fly Looming Timing: {autoSwingMode ? 'ACTIVE [PEAK HR CALIBRATED]' : 'OFF [MANUAL]'}
              </button>
            </div>
          )}

          {/* Performance Calibration Log */}
          <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex-1 flex flex-col text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1 mb-2">
              <span className="font-bold text-neutral-300 uppercase">MOUND TELEMETRY LOG</span>
              <span className="text-purple-400 font-bold font-teko text-base">
                {battingState.pitchingStats.strikeouts} K&apos;s // {battingState.pitchingStats.pitchesThrown} PITCHES
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 text-[11px]">
              <div className="p-2 bg-neutral-950 border border-neutral-800 rounded space-y-1">
                <div className="text-neutral-400 text-[10px]">CURRENT SPECIMEN REPUTATION:</div>
                <div className="text-emerald-400 font-bold">
                  {battingState.pitchingStats.strikeouts >= 5
                    ? '★ ACE TOKYO-3 CLOSER'
                    : 'ROOKIE BIO-PITCHER'}
                </div>
                <div className="text-neutral-400 text-[10px]">
                  Each strikeout against Sachiel awards <span className="text-amber-400 font-bold">+350 PTS</span> to the fly pilots!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
