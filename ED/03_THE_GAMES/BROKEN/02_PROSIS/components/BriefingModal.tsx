import { FileText, X, Rocket, Radar, ShieldAlert, Volume2, BookOpen } from "lucide-react";

export function BriefingModal({ setBriefingOpen, COLORS, panelStyle }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.88)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", border: `1.5px solid ${COLORS.systems}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={22} color={COLORS.systems} />
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted }}>1-MINUTE PLAYBOOK</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.bone }}>TACTICAL BRIEFING</h2>
            </div>
          </div>
          <button onClick={() => setBriefingOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 6 }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13, lineHeight: 1.5, color: COLORS.muted }}>
          <div style={{ background: `${COLORS.systems}15`, border: `1px solid ${COLORS.systems}44`, borderRadius: 8, padding: 12 }}>
            <div style={{ color: COLORS.systems, fontWeight: 700, fontSize: 14, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><Rocket size={15} /> PRIMARY GOAL</div>
            <div style={{ color: COLORS.bone }}>Survive <b>3 Sectors (30 Rounds total / 10 rounds per sector)</b> without letting Entropy hit 100%, Systems or RE collapse to 0%, or Morale deplete.</div>
          </div>
          <div>
            <div style={{ color: COLORS.bone, fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Radar size={15} color={COLORS.event} /> THE 5 FRONTS & METERS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
              <div style={{ background: COLORS.void, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.panelBorder}` }}><span style={{ color: COLORS.systems, fontWeight: 700 }}>1. Systems:</span> Ship hull integrity (0-100%).</div>
              <div style={{ background: COLORS.void, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.panelBorder}` }}><span style={{ color: COLORS.re, fontWeight: 700 }}>2. Reality Engine:</span> Quantum engine (0-100%).</div>
              <div style={{ background: COLORS.void, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.panelBorder}` }}><span style={{ color: COLORS.morale, fontWeight: 700 }}>3. Morale:</span> Crew fortitude (0-100%).</div>
              <div style={{ background: COLORS.void, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.panelBorder}` }}><span style={{ color: COLORS.salvage, fontWeight: 700 }}>4. Salvage:</span> Repairs & barrier banking.</div>
              <div style={{ background: COLORS.void, padding: 8, borderRadius: 6, border: `1px solid ${COLORS.panelBorder}` }}><span style={{ color: COLORS.entropy, fontWeight: 700 }}>5. Entropy:</span> Spacetime distortion (0-100%).</div>
            </div>
          </div>
          <div>
            <div style={{ color: COLORS.bone, fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><ShieldAlert size={15} color={COLORS.morale} /> CORE LOOP: THREATS & ANCHORS</div>
            <div style={{ marginBottom: 8 }}>Each round, an <b>Anomaly</b> attacks one or more fronts. You must choose an <b>Anchor Persona</b> (Ricky, Maude, or Dez) to lead the response.</div>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li><span style={{ color: COLORS.bone }}>Ricky (Risky / Entropy):</span> High variance, rewards aggressive plays.</li>
              <li><span style={{ color: COLORS.bone }}>Maude (Methodical / Systems):</span> Steady, predictable, builds combo streaks over time.</li>
              <li><span style={{ color: COLORS.bone }}>Dez (Defiant / RE):</span> Hoards trust, then spends it on massive saves. Might disobey orders if distrust gets too high.</li>
            </ul>
          </div>
          <div>
            <div style={{ color: COLORS.bone, fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Volume2 size={15} color={COLORS.re} /> GAMEPLAY TIPS</div>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Banking Salvage into <b>Barriers</b> protects a specific front for future rounds.</li>
              <li>Read the <b>Action Log</b> to see why things happened.</li>
              <li>Equip <b>Spacetime Runes</b> to modify your run before you launch.</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setBriefingOpen(false)} className="action-btn" style={{ background: COLORS.systems, color: COLORS.void, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen size={16} /> CLOSE BRIEFING
          </button>
        </div>
      </div>
    </div>
  );
}