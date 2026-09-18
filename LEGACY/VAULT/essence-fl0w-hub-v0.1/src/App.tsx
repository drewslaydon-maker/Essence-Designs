import React, { useState } from 'react';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { Header } from './components/Header';
import { EssenceHubLandingView } from './components/EssenceHubLandingView';
import { TaskGrimoireView } from './components/TaskGrimoireView';
import { JourneysSandboxView } from './components/JourneysSandboxView';
import { BallBreakView } from './components/ballbreak/BallBreakView';
import { PhysicsForgeView } from './components/PhysicsForgeView';
import { MomAtreyuHavenView } from './components/MomAtreyuHavenView';
import { JujuRealityAnchorView } from './components/JujuRealityAnchorView';
import { ShareWithMomModal } from './components/ShareWithMomModal';
import { LoreBibleModal } from './components/LoreBibleModal';
import { TicketModal } from './components/TicketModal';
import { INITIAL_TICKETS, INITIAL_GOAL } from './data/initialData';
import { Ticket, TicketStatus } from './types';
import { getAudioState } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isLoreBibleOpen, setIsLoreBibleOpen] = useState(false);
  const [isShareMomOpen, setIsShareMomOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(getAudioState());
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [goal, setGoal] = useState(INITIAL_GOAL);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleUpdateTicketStatus = (ticketId: string, nextStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus, updatedAt: new Date().toISOString() } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleToggleCriterion = (ticketId: string, criterionId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const updatedCriteria = t.acceptanceCriteria.map((c) =>
          c.id === criterionId ? { ...c, completed: !c.completed } : c
        );
        return { ...t, acceptanceCriteria: updatedCriteria };
      })
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          acceptanceCriteria: prev.acceptanceCriteria.map((c) =>
            c.id === criterionId ? { ...c, completed: !c.completed } : c
          ),
        };
      });
    }
  };

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-200 overflow-x-hidden flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Interactive Constellation Canvas */}
      <ConstellationCanvas />

      {/* Streamlined Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoreBible={() => setIsLoreBibleOpen(true)}
        onOpenShareMom={() => setIsShareMomOpen(true)}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pb-12">
        {/* 1. Essence Hub Landing Page (Tailored for Drew, Juju, and Mom) */}
        {activeTab === 'landing' && (
          <EssenceHubLandingView
            onNavigate={(tabId) => setActiveTab(tabId)}
            onOpenShareMom={() => setIsShareMomOpen(true)}
            onOpenLoreBible={() => setIsLoreBibleOpen(true)}
            tickets={tickets}
            goal={goal}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}

        {/* 2. Journeys Unto (Tavern RPG - Flagship) */}
        {activeTab === 'journeys' && (
          <JourneysSandboxView />
        )}

        {/* 3. Goal & Task Grimoire (Refined Kanban Board for Reasoning & Completion) */}
        {activeTab === 'grimoire' && (
          <TaskGrimoireView
            tickets={tickets}
            goal={goal}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAddTicket={handleAddTicket}
          />
        )}

        {/* 4. Ball Break (Mobile Momentum & Destruction Simulator) */}
        {activeTab === 'ballbreak' && (
          <BallBreakView />
        )}

        {/* 5. Physics Forge (Kinematics & Collision Sandbox) */}
        {activeTab === 'physics' && (
          <PhysicsForgeView />
        )}

        {/* 6. Mom's Haven (Atreyu Yarn Crafts & Mini-Games) */}
        {activeTab === 'mom' && (
          <MomAtreyuHavenView 
            onOpenShareModal={() => setIsShareMomOpen(true)} 
            onNavigateToJourneys={() => setActiveTab('journeys')}
          />
        )}

        {/* 7. Juju's Reality Anchor */}
        {activeTab === 'juju' && (
          <JujuRealityAnchorView />
        )}
      </main>

      {/* Selected Ticket Modal for Deep Reasoning & Acceptance Inspection */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onToggleCriterion={handleToggleCriterion}
          onUpdateStatus={handleUpdateTicketStatus}
        />
      )}

      {/* Master Lore Bible Modal (v0.2 Ground Truth) */}
      <LoreBibleModal
        isOpen={isLoreBibleOpen}
        onClose={() => setIsLoreBibleOpen(false)}
        onNavigateToSandbox={() => setActiveTab('journeys')}
      />

      {/* Share With Mom Modal */}
      <ShareWithMomModal
        isOpen={isShareMomOpen}
        onClose={() => setIsShareMomOpen(false)}
        onOpenMomTab={() => setActiveTab('mom')}
      />

      {/* Refined Minimalist Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#05070a]/95 py-3.5 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold">ESSENCE FL0W HUB</span>
          <span className="text-slate-700">•</span>
          <span>Sovereign Web Game Studio</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>Goal Tracking & Reasoning</span>
          <span>•</span>
          <span>HTML5 Canvas 2D</span>
          <span>•</span>
          <span>Deterministic 60 FPS</span>
        </div>
      </footer>
    </div>
  );
}
