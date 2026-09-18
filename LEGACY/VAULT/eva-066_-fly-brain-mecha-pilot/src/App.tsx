/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GameMode, ConnectomeState, MechaCustomization } from './types';
import { FlyBrainConnectome } from './simulation/flyBrainConnectome';
import { NervHeader } from './components/NervHeader';
import { BattleCockpit } from './components/BattleCockpit';
import { ConnectomeMonitor } from './components/ConnectomeMonitor';
import { BaseballProtocol } from './components/BaseballProtocol';
import { HangarArmory } from './components/HangarArmory';
import { GendoIntroModal } from './components/GendoIntroModal';
import { TacticalBriefingModal } from './components/TacticalBriefingModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('BATTLE');
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isGendoIntroOpen, setIsGendoIntroOpen] = useState(true);
  const [syncRatio, setSyncRatio] = useState(78.4);
  const [synchroCredits, setSynchroCredits] = useState(500);

  // Mecha & Pilot Customization
  const [customization, setCustomization] = useState<MechaCustomization>({
    activePilotId: 'SHIN_FLY',
    paintjob: 'TEST_TYPE_01',
    visorStyle: 'COMPOUND_HEX',
    upgrades: {
      ommatidiaLevel: 0,
      giantFiberLevel: 0,
      octopamineLevel: 0,
      needleLevel: 0,
    },
    synchroCredits: 500,
  });

  // Biological Fly Brain Connectome singleton
  const connectomeRef = useRef<FlyBrainConnectome>(new FlyBrainConnectome());
  const [connectomeState, setConnectomeState] = useState<ConnectomeState>(connectomeRef.current.state);

  // Periodic poll of connectome state for global header & monitors
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectomeState({ ...connectomeRef.current.state });
      setSyncRatio(connectomeRef.current.state.syncRatio);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleAwardCredits = (amount: number) => {
    setSynchroCredits((prev) => prev + amount);
    setCustomization((prev) => ({
      ...prev,
      synchroCredits: prev.synchroCredits + amount,
    }));
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      {/* Top NERV Diagnostics Header */}
      <NervHeader
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        syncRatio={syncRatio}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenGendoIntro={() => setIsGendoIntroOpen(true)}
        customization={customization}
        synchroCredits={synchroCredits}
      />

      {/* Main Viewport Container */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {currentMode === 'BATTLE' && (
          <BattleCockpit
            connectome={connectomeRef.current}
            connectomeState={connectomeState}
            onSyncRatioChange={setSyncRatio}
            customization={customization}
            onAwardCredits={handleAwardCredits}
          />
        )}

        {currentMode === 'HANGAR_ARMORY' && (
          <HangarArmory
            customization={customization}
            onUpdateCustomization={setCustomization}
            onLaunchBattle={() => setCurrentMode('BATTLE')}
            synchroPoints={synchroCredits}
          />
        )}

        {currentMode === 'BASEBALL_DRILL' && (
          <BaseballProtocol
            connectome={connectomeRef.current}
            onAwardCredits={handleAwardCredits}
            customization={customization}
          />
        )}

        {currentMode === 'CONNECTOME_LAB' && (
          <ConnectomeMonitor
            connectome={connectomeRef.current}
            connectomeState={connectomeState}
          />
        )}
      </main>

      {/* Gendo Ikar-fly Opening Directive Cinematic */}
      <GendoIntroModal
        isOpen={isGendoIntroOpen}
        onClose={() => setIsGendoIntroOpen(false)}
      />

      {/* Tactical Lore & Science Briefing Modal */}
      <TacticalBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />
    </div>
  );
}
