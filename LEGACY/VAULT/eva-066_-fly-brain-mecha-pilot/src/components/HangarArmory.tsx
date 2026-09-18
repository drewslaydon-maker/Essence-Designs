/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PilotId, PaintjobId, VisorStyleId, MechaCustomization } from '../types';
import { PILOT_ROSTER, PAINTJOB_CATALOG, VISOR_CATALOG, UPGRADE_CATALOG } from '../simulation/pilotData';
import { deliberateFlyProcurement, FLY_PERSONALITIES, FlyDeliberationResult } from '../simulation/flyProcurement';
import { audio } from '../services/audioService';
import {
  Shield,
  Zap,
  Eye,
  Flame,
  Sword,
  Sparkles,
  Check,
  Lock,
  Play,
  UserCheck,
  Brain,
  AlertTriangle,
  Radio,
  Vote,
  RefreshCw,
} from 'lucide-react';

interface HangarArmoryProps {
  customization: MechaCustomization;
  onUpdateCustomization: (updater: (prev: MechaCustomization) => MechaCustomization) => void;
  onLaunchBattle: () => void;
  synchroPoints: number;
}

export const HangarArmory: React.FC<HangarArmoryProps> = ({
  customization,
  onUpdateCustomization,
  onLaunchBattle,
  synchroPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'PILOTS' | 'PAINTJOBS' | 'VISORS' | 'UPGRADES'>('PILOTS');
  const [purchasedPaintjobs, setPurchasedPaintjobs] = useState<PaintjobId[]>([
    'TEST_TYPE_01',
    ...(customization.paintjob !== 'TEST_TYPE_01' ? [customization.paintjob] : []),
  ]);
  const [purchasedVisors, setPurchasedVisors] = useState<VisorStyleId[]>([
    'COMPOUND_HEX',
    ...(customization.visorStyle !== 'COMPOUND_HEX' ? [customization.visorStyle] : []),
  ]);

  // Fly Pilot Autonomous Requisition State
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [flyMessage, setFlyMessage] = useState<string | null>(null);
  const [lastDeliberation, setLastDeliberation] = useState<FlyDeliberationResult | null>(null);
  const [humanInterceptModal, setHumanInterceptModal] = useState<{
    targetName: string;
    action: () => void;
    flyQuote: string;
  } | null>(null);

  const currentPilot = PILOT_ROSTER[customization.activePilotId];
  const currentPaint = PAINTJOB_CATALOG[customization.paintjob];
  const currentVisor = VISOR_CATALOG[customization.visorStyle];
  const currentPersonality = FLY_PERSONALITIES[customization.activePilotId] || FLY_PERSONALITIES.SHIN_FLY;

  // Let the Fly Pilot autonomously pick and requisition upgrades/cosmetics
  const handleFlyDeliberate = () => {
    setIsDeliberating(true);
    audio.playRadioChirp();
    audio.playBeep(520, 'triangle', 0.1);

    setTimeout(() => {
      const outcome = deliberateFlyProcurement(
        customization,
        synchroPoints,
        purchasedPaintjobs,
        purchasedVisors
      );

      setIsDeliberating(false);
      setLastDeliberation(outcome.result);
      setFlyMessage(outcome.result.quote);
      setPurchasedPaintjobs(outcome.newPurchasedPaintjobs);
      setPurchasedVisors(outcome.newPurchasedVisors);

      if (outcome.result.purchased) {
        audio.playBeep(880, 'triangle', 0.25);
        onUpdateCustomization(() => outcome.newCustomization);
      } else {
        audio.playBeep(320, 'sine', 0.15);
      }
    }, 450);
  };

  const handleSelectPilot = (pilotId: PilotId) => {
    audio.playRadioChirp();
    const personality = FLY_PERSONALITIES[pilotId];
    setFlyMessage(`"${personality.name} taking command of Cage-07. Connectome synced."`);
    onUpdateCustomization((prev) => ({
      ...prev,
      activePilotId: pilotId,
      paintjob: pilotId === 'SHIN_FLY' ? 'TEST_TYPE_01' : pilotId === 'ASU_MAG' ? 'PRODUCTION_02' : 'PROTOTYPE_00',
    }));
  };

  // Intercept human direct attempt to force an upgrade or paintjob
  const interceptHumanPurchase = (itemName: string, directAction: () => void) => {
    audio.playRadioChirp();
    setHumanInterceptModal({
      targetName: itemName,
      action: directAction,
      flyQuote: currentPersonality.quotes.humanRefusal,
    });
  };

  const executeHumanOverride = () => {
    if (humanInterceptModal) {
      humanInterceptModal.action();
      audio.playBeep(700, 'triangle', 0.15);
      setFlyMessage(`"Human operator override accepted... but the specimen's ommatidia remain skeptical."`);
      setHumanInterceptModal(null);
    }
  };

  const directBuyPaintjob = (paintId: PaintjobId) => {
    const config = PAINTJOB_CATALOG[paintId];
    if (purchasedPaintjobs.includes(paintId)) {
      onUpdateCustomization((prev) => ({ ...prev, paintjob: paintId }));
      audio.playBeep(600);
      return;
    }

    if (synchroPoints >= config.cost) {
      audio.playBeep(880, 'triangle', 0.15);
      setPurchasedPaintjobs((prev) => [...prev, paintId]);
      onUpdateCustomization((prev) => ({
        ...prev,
        paintjob: paintId,
        synchroCredits: Math.max(0, prev.synchroCredits - config.cost),
      }));
    }
  };

  const directBuyVisor = (visorId: VisorStyleId) => {
    const config = VISOR_CATALOG[visorId];
    if (purchasedVisors.includes(visorId)) {
      onUpdateCustomization((prev) => ({ ...prev, visorStyle: visorId }));
      audio.playBeep(600);
      return;
    }

    if (synchroPoints >= config.cost) {
      audio.playBeep(880, 'triangle', 0.15);
      setPurchasedVisors((prev) => [...prev, visorId]);
      onUpdateCustomization((prev) => ({
        ...prev,
        visorStyle: visorId,
        synchroCredits: Math.max(0, prev.synchroCredits - config.cost),
      }));
    }
  };

  const directUpgradeTier = (upgradeKey: keyof MechaCustomization['upgrades']) => {
    const currentTier = customization.upgrades[upgradeKey];
    if (currentTier >= 3) return;

    let catalogItem = UPGRADE_CATALOG.ommatidia;
    if (upgradeKey === 'giantFiberLevel') catalogItem = UPGRADE_CATALOG.giantFiber;
    if (upgradeKey === 'octopamineLevel') catalogItem = UPGRADE_CATALOG.octopamine;
    if (upgradeKey === 'needleLevel') catalogItem = UPGRADE_CATALOG.needle;

    const nextTierCost = catalogItem.tiers[currentTier + 1].cost;
    if (synchroPoints >= nextTierCost) {
      audio.playBeep(750, 'sawtooth', 0.2);
      onUpdateCustomization((prev) => ({
        ...prev,
        upgrades: {
          ...prev.upgrades,
          [upgradeKey]: currentTier + 1,
        },
        synchroCredits: Math.max(0, prev.synchroCredits - nextTierCost),
      }));
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 text-neutral-100 flex flex-col p-3 sm:p-5 overflow-y-auto select-none font-mono">
      {/* Top Hangar Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-orange-500/40">
        <div>
          <div className="text-[10px] text-orange-400 font-mono tracking-widest uppercase flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>NERV BIO-MECHANICAL ARMORED DOCK // CAGE-07 // FLY PROCUREMENT OVERRIDE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-teko text-white tracking-wider flex items-center gap-2">
            <span>DROSOPHILA HANGAR & SPECIMEN ARMORY</span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-950 border border-orange-500/50 text-orange-400 font-mono">
              ACTIVE SPECIMEN: {currentPilot.unitName}
            </span>
          </h1>
        </div>

        {/* Synchro Point Balance & Sortie Button */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-black/80 border border-amber-500/50 rounded flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[9px] text-neutral-400 font-mono uppercase">SPECIMEN MERIT RESERVE</div>
              <div className="text-lg font-bold font-teko text-amber-400 leading-none">
                {synchroPoints.toLocaleString()} PTS
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLaunchBattle}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-black font-extrabold text-sm uppercase rounded transition-all shadow-lg shadow-orange-600/30 font-teko tracking-wider"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch Sortie [EVA Cockpit]</span>
          </button>
        </div>
      </div>

      {/* FLY AUTONOMOUS REQUISITION CONSOLE (Flies pick their gear!) */}
      <div className="max-w-7xl mx-auto w-full my-3 p-3.5 bg-gradient-to-r from-neutral-900 via-purple-950/40 to-neutral-900 border-2 border-purple-500/60 rounded-lg shadow-xl shadow-purple-950/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Fly Avatar with active pilot badge */}
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative shrink-0 shadow-lg"
              style={{
                backgroundColor: currentPilot.primaryColor + '33',
                borderColor: currentPilot.accentColor,
              }}
            >
              <Brain className="w-6 h-6 text-white animate-pulse" />
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded bg-black border border-neutral-600 text-amber-400">
                EVA
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-white uppercase font-teko tracking-wider text-base">
                  {currentPilot.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono rounded flex items-center gap-1">
                  <Check className="w-3 h-3" /> FLIES CONTROL REQUISITIONS
                </span>
                <span className="text-[10px] text-purple-300 font-mono">
                  Priority: {currentPersonality.upgradePriority[0].replace('Level', '')}
                </span>
              </div>

              {/* Fly Thought / Radio Dialogue */}
              <div className="text-xs italic text-neutral-200 bg-black/60 px-3 py-1.5 rounded border-l-2 border-purple-400 font-serif leading-relaxed">
                {isDeliberating
                  ? '⚡ [SYNAPTIC SPIKES DETECTED] Drosophila brain connectome evaluating catalog...'
                  : flyMessage || currentPersonality.quotes.savingUp('Next Calibration', 0)}
              </div>
            </div>
          </div>

          {/* Autonomous Deliberation Action Button */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleFlyDeliberate}
              disabled={isDeliberating}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs font-mono uppercase font-bold transition-all shadow-lg ${
                isDeliberating
                  ? 'bg-purple-800 text-white cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-black shadow-purple-600/30'
              }`}
            >
              <Vote className={`w-4 h-4 ${isDeliberating ? 'animate-spin' : ''}`} />
              <span>{isDeliberating ? 'Fly Deliberating...' : 'Let Fly Pick Upgrade / Cosmetic'}</span>
            </button>
          </div>
        </div>

        {/* Directive disclaimer */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between text-[10px] text-neutral-400">
          <span>
            NERV Directive 066: Lilin humans cannot dictate mecha cosmetics or weapons. Flies deliberate via
            synaptic instinct.
          </span>
          <span className="text-amber-400 font-mono font-bold">
            Equipped: {currentPaint.name} • Visor: {currentVisor.name}
          </span>
        </div>
      </div>

      {/* Human Intercept Dialogue Modal (When user tries to manually choose) */}
      {humanInterceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-neutral-900 border-2 border-orange-500 rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-orange-400 border-b border-neutral-700 pb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-base font-teko uppercase tracking-wider text-white">
                FLIES ARE IN COMMAND // OPERATOR INTERCEPTION
              </h3>
            </div>

            <div className="p-3 bg-black/80 border-l-4 border-orange-500 rounded text-xs leading-relaxed italic text-neutral-200 font-serif">
              <span className="text-[10px] not-italic text-amber-400 font-mono block uppercase mb-1">
                {currentPilot.name} transmission:
              </span>
              {humanInterceptModal.flyQuote}
            </div>

            <div className="text-xs text-neutral-300">
              You clicked on <strong className="text-orange-400">{humanInterceptModal.targetName}</strong>. The fly
              pilot prefers autonomous biological equipment selection!
            </div>

            <div className="flex gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setHumanInterceptModal(null);
                  handleFlyDeliberate();
                }}
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-emerald-500 text-black font-bold text-xs uppercase rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Let Fly Pick Instead</span>
              </button>

              <button
                type="button"
                onClick={executeHumanOverride}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] uppercase rounded transition-colors"
                title="Force manual Lilin selection"
              >
                Persuade Fly (Override)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2 pt-2 pb-4">
        {[
          { id: 'PILOTS', label: '1. Pilot Roster [Children]', icon: UserCheck },
          { id: 'PAINTJOBS', label: '2. Chitin Paintjobs', icon: Shield },
          { id: 'VISORS', label: '3. Compound Visors', icon: Eye },
          { id: 'UPGRADES', label: '4. Bio-Neural Upgrades', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playBeep(450);
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-black font-bold shadow-md shadow-orange-500/20'
                  : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: PILOT ROSTER */}
      {activeTab === 'PILOTS' && (
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(PILOT_ROSTER) as PilotId[]).map((pid) => {
            const pilot = PILOT_ROSTER[pid];
            const isSelected = customization.activePilotId === pid;
            const personality = FLY_PERSONALITIES[pid];

            return (
              <div
                key={pid}
                onClick={() => handleSelectPilot(pid)}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${pilot.badgeBg} shadow-xl shadow-purple-950/40`
                    : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-3">
                    <span className="text-xs font-mono text-neutral-400 tracking-wider">
                      {pilot.callsign}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                        <Check className="w-3 h-3" /> ACTIVE SPECIMEN
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-teko text-white tracking-wider">
                    {pilot.name}
                  </h3>
                  <div className="text-xs font-mono text-amber-400 mb-2">{pilot.unitName}</div>

                  <blockquote className="text-xs italic text-neutral-300 bg-black/40 p-2.5 rounded border-l-2 border-orange-500 mb-3 leading-relaxed font-serif">
                    {pilot.quote}
                  </blockquote>

                  <div className="text-xs text-neutral-200 mb-3">
                    <strong className="text-orange-400 block text-[11px] font-mono uppercase mb-0.5">
                      Procurement Will & Instinct:
                    </strong>
                    <span className="text-neutral-300 text-xs">
                      Prefers {personality.preferredPaintjob.replace('_', ' ')} Chitin. Priority upgrade:{' '}
                      <span className="text-emerald-400 font-bold">
                        {personality.upgradePriority[0].replace('Level', '')}
                      </span>
                    </span>
                  </div>

                  {/* Stat Multipliers */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/50 p-2 rounded">
                    <div>
                      <span className="text-neutral-400">GF AGILITY:</span>{' '}
                      <span className="text-emerald-400 font-bold">{(pilot.stats.gfAgility * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">FIREPOWER:</span>{' '}
                      <span className="text-red-400 font-bold">{(pilot.stats.attackPower * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">A.T. BARRIER:</span>{' '}
                      <span className="text-cyan-400 font-bold">{(pilot.stats.atFieldPower * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">ENERGY CAP:</span>{' '}
                      <span className="text-amber-400 font-bold">{(pilot.stats.energyCap * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-mono">{pilot.bioArchetype}</span>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded uppercase font-mono ${
                      isSelected ? 'bg-orange-500 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {isSelected ? 'In Command' : 'Put In Command'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: PAINTJOBS */}
      {activeTab === 'PAINTJOBS' && (
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(PAINTJOB_CATALOG) as PaintjobId[]).map((paintId) => {
            const config = PAINTJOB_CATALOG[paintId];
            const isEquipped = customization.paintjob === paintId;
            const isOwned = purchasedPaintjobs.includes(paintId) || config.cost === 0;
            const isFlyFavorite = currentPersonality.preferredPaintjob === paintId;

            return (
              <div
                key={paintId}
                className={`p-4 rounded-lg border-2 flex flex-col justify-between ${
                  isEquipped
                    ? 'border-orange-500 bg-orange-950/20 shadow-lg shadow-orange-950/40'
                    : 'border-neutral-800 bg-neutral-900/60'
                }`}
              >
                <div>
                  <div className="h-28 w-full rounded-md flex items-center justify-center relative overflow-hidden mb-3 border border-neutral-700 bg-black/60">
                    <div
                      className="w-16 h-16 rounded-full border-4 shadow-xl flex items-center justify-center transition-transform hover:scale-110"
                      style={{
                        backgroundColor: config.hullColor,
                        borderColor: config.glowColor,
                        boxShadow: `0 0 20px ${config.glowColor}55`,
                      }}
                    >
                      <Shield className="w-8 h-8 text-white opacity-80" />
                    </div>

                    {isFlyFavorite && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900 border border-purple-400 text-purple-200">
                        ★ {currentPilot.name.split(' ')[0]}&apos;s Favorite
                      </span>
                    )}

                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-neutral-400">
                      {config.chitinFinish}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-teko text-white tracking-wider flex items-center justify-between">
                    <span>{config.name}</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mb-3">{config.description}</p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    {isOwned ? (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">OWNED</span>
                    ) : (
                      <span className="text-xs font-mono text-amber-400 font-bold">{config.cost} PTS</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isFlyFavorite) {
                        interceptHumanPurchase(config.name, () => directBuyPaintjob(paintId));
                      } else {
                        directBuyPaintjob(paintId);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                      isEquipped
                        ? 'bg-emerald-600 text-white font-bold'
                        : isOwned
                        ? 'bg-orange-500 hover:bg-orange-400 text-black font-bold'
                        : synchroPoints >= config.cost
                        ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isEquipped ? 'Equipped' : isOwned ? 'Equip' : 'Fly Request'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: VISORS */}
      {activeTab === 'VISORS' && (
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(VISOR_CATALOG) as VisorStyleId[]).map((vId) => {
            const config = VISOR_CATALOG[vId];
            const isEquipped = customization.visorStyle === vId;
            const isOwned = purchasedVisors.includes(vId) || config.cost === 0;
            const isFlyFavorite = currentPersonality.preferredVisor === vId;

            return (
              <div
                key={vId}
                className={`p-4 rounded-lg border-2 flex flex-col justify-between ${
                  isEquipped
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-950/40'
                    : 'border-neutral-800 bg-neutral-900/60'
                }`}
              >
                <div>
                  <div className="h-28 w-full rounded-md flex items-center justify-center relative mb-3 border border-neutral-700 bg-black/80">
                    <div
                      className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center animate-spin"
                      style={{
                        borderColor: config.reticleColor,
                        animationDuration: '10s',
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: config.reticleColor }}
                      />
                    </div>

                    {isFlyFavorite && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900 border border-purple-400 text-purple-200">
                        ★ {currentPilot.name.split(' ')[0]}&apos;s Preferred HUD
                      </span>
                    )}

                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-neutral-400">
                      {config.gridStyle}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-teko text-white tracking-wider">
                    {config.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mb-3">{config.description}</p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    {isOwned ? (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">OWNED</span>
                    ) : (
                      <span className="text-xs font-mono text-amber-400 font-bold">{config.cost} PTS</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isFlyFavorite) {
                        interceptHumanPurchase(config.name, () => directBuyVisor(vId));
                      } else {
                        directBuyVisor(vId);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                      isEquipped
                        ? 'bg-cyan-500 text-black font-bold'
                        : isOwned
                        ? 'bg-orange-500 hover:bg-orange-400 text-black font-bold'
                        : synchroPoints >= config.cost
                        ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isEquipped ? 'Equipped' : isOwned ? 'Equip' : 'Fly Request'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: BIO-NEURAL UPGRADES */}
      {activeTab === 'UPGRADES' && (
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'ommatidiaLevel' as const, catalog: UPGRADE_CATALOG.ommatidia, icon: Eye, color: 'text-amber-400' },
            { key: 'giantFiberLevel' as const, catalog: UPGRADE_CATALOG.giantFiber, icon: Zap, color: 'text-emerald-400' },
            { key: 'octopamineLevel' as const, catalog: UPGRADE_CATALOG.octopamine, icon: Flame, color: 'text-purple-400' },
            { key: 'needleLevel' as const, catalog: UPGRADE_CATALOG.needle, icon: Sword, color: 'text-cyan-400' },
          ].map(({ key, catalog, icon: Icon, color }) => {
            const currentTier = customization.upgrades[key];
            const isMax = currentTier >= 3;
            const nextTier = !isMax ? catalog.tiers[currentTier + 1] : null;
            const isTopPriority = currentPersonality.upgradePriority[0] === key;

            return (
              <div
                key={key}
                className={`p-4 rounded-lg flex flex-col justify-between border-2 ${
                  isTopPriority
                    ? 'bg-neutral-900/90 border-purple-500/70 shadow-lg shadow-purple-950/40'
                    : 'bg-neutral-900/80 border-neutral-700/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <h4 className="font-bold text-sm text-white font-mono">{catalog.title}</h4>
                      {isTopPriority && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-400 text-purple-300 font-bold">
                          #1 PRIORITY
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-orange-400 font-bold">
                      TIER {currentTier} / 3
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 mb-3">{catalog.description}</p>

                  {/* Tier Indicators */}
                  <div className="space-y-1.5 mb-3">
                    {catalog.tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-xs flex items-center justify-between border ${
                          idx <= currentTier
                            ? 'bg-neutral-800/80 border-orange-500/40 text-neutral-200'
                            : 'bg-black/30 border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${idx <= currentTier ? 'bg-orange-400' : 'bg-neutral-700'}`} />
                          <span className="font-semibold">{tier.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">{tier.boostDescription}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  {isMax ? (
                    <span className="text-xs font-mono text-emerald-400 font-bold">MAXIMUM CALIBRATION</span>
                  ) : (
                    <div className="text-xs font-mono">
                      <span className="text-neutral-400">NEXT TIER: </span>
                      <span className="text-amber-400 font-bold">{nextTier?.cost} PTS</span>
                    </div>
                  )}

                  {!isMax && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isTopPriority) {
                          interceptHumanPurchase(catalog.title, () => directUpgradeTier(key));
                        } else {
                          directUpgradeTier(key);
                        }
                      }}
                      className="px-4 py-1.5 rounded text-xs font-mono uppercase font-bold transition-colors bg-purple-600 hover:bg-purple-500 text-white"
                    >
                      Fly Calibrate [+1 Tier]
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
