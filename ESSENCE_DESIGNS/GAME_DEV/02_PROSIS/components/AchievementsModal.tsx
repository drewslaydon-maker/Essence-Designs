import { Award, X, CheckCircle, Lock } from "lucide-react";

export function AchievementsModal({ setAchievementsOpen, ACHIEVEMENTS_LIST, unlockedAchList, COLORS, panelStyle }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.88)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", border: `1.5px solid ${COLORS.salvage}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Award size={22} color={COLORS.salvage} />
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted }}>MEDALS & HONORS</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.bone }}>ACHIEVEMENTS ({unlockedAchList.length}/{ACHIEVEMENTS_LIST.length})</h2>
            </div>
          </div>
          <button onClick={() => setAchievementsOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 6 }}><X size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, maxHeight: 380, overflowY: "auto" }}>
          {ACHIEVEMENTS_LIST.map((ach: any) => {
            const unlocked = unlockedAchList.includes(ach.id);
            return (
              <div key={ach.id} style={{ background: COLORS.void, padding: 10, borderRadius: 8, border: `1px solid ${unlocked ? COLORS.salvage + "66" : COLORS.panelBorder}`, display: "flex", gap: 10, alignItems: "center", opacity: unlocked ? 1 : 0.5 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: unlocked ? `${COLORS.salvage}22` : `${COLORS.muted}11`, border: `1px solid ${unlocked ? COLORS.salvage : COLORS.muted}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {unlocked ? <CheckCircle size={16} color={COLORS.salvage} /> : <Lock size={14} color={COLORS.muted} />}
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: unlocked ? COLORS.bone : COLORS.muted }}>{ach.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{ach.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setAchievementsOpen(false)} className="action-btn" style={{ background: COLORS.salvage, color: COLORS.void, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>CLOSE ACHIEVEMENTS</button>
        </div>
      </div>
    </div>
  );
}