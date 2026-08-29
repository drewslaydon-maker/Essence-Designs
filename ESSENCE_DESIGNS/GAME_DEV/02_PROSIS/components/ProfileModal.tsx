import { X } from "lucide-react";
import type { HullSkin, PersonaId } from "../types";

export function ProfileModal({ setProfileOpen, captainProfile, setCaptainProfile, cosmeticsProfile, COLORS, panelStyle, ANCHORS, shipNameInput, setShipNameInput, saveCaptainProfile, setShipName }: any) {
  return (
    <div id="profileModal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "20px 24px", border: `1.5px solid ${COLORS.morale}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: COLORS.bone }}>CAPTAIN PROFILE</h2>
          <button onClick={() => setProfileOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: COLORS.void, padding: 10, borderRadius: 8 }}>
              <label style={{ fontSize: 10, color: COLORS.muted }}>Vessel Name</label>
              <input type="text" value={shipNameInput} onChange={(e: any) => setShipNameInput(e.target.value)} style={{ width: "100%", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px 8px", borderRadius: 4, fontSize: 12 }} />
            </div>
            <div style={{ flex: 1, background: COLORS.void, padding: 10, borderRadius: 8 }}>
              <label style={{ fontSize: 10, color: COLORS.muted }}>Captain Call-Sign</label>
              <input type="text" value={captainProfile.captainCallsign} onChange={(e: any) => setCaptainProfile({ ...captainProfile, captainCallsign: e.target.value })} style={{ width: "100%", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px 8px", borderRadius: 4, fontSize: 12 }} />
            </div>
          </div>

          <div style={{ background: COLORS.void, padding: 10, borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.systems, marginBottom: 4 }}>CREW ROSTER</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <input type="text" value={captainProfile.helmName} onChange={(e: any) => setCaptainProfile({ ...captainProfile, helmName: e.target.value })} style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px", borderRadius: 4, fontSize: 11 }} />
              <input type="text" value={captainProfile.geneName} onChange={(e: any) => setCaptainProfile({ ...captainProfile, geneName: e.target.value })} style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px", borderRadius: 4, fontSize: 11 }} />
              <input type="text" value={captainProfile.salName} onChange={(e: any) => setCaptainProfile({ ...captainProfile, salName: e.target.value })} style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.bone, padding: "4px", borderRadius: 4, fontSize: 11 }} />
            </div>
          </div>

          <div style={{ background: COLORS.void, padding: 10, borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.salvage, marginBottom: 4 }}>HULL SKIN</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {(["titanium", "chrome", "gold", "singularity"] as HullSkin[]).map((skin: any) => {
                const isUnlocked = cosmeticsProfile.unlockedHullSkins.includes(skin);
                const isActive = captainProfile.activeHullSkin === skin;
                return (
                  <button key={skin} disabled={!isUnlocked} onClick={() => { if (isUnlocked) setCaptainProfile({ ...captainProfile, activeHullSkin: skin }); }} className="action-btn" style={{ padding: "4px", borderRadius: 4, border: `1px solid ${isActive ? COLORS.salvage : COLORS.panelBorder}`, background: isActive ? `${COLORS.salvage}22` : COLORS.panel, color: isUnlocked ? COLORS.bone : COLORS.muted, fontSize: 11 }}>
                    {skin} {isActive ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: COLORS.void, padding: 10, borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.event }}>UNLOCKED SCOUT BADGES</div>
            <div style={{ display: "flex", gap: 8, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
              {(["ricky", "maude", "dez"] as PersonaId[]).map((p: any) => (
                <div key={p}><span style={{ color: ANCHORS[p].color }}>{p}:</span> {(cosmeticsProfile.unlockedBadges[p] || []).length}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { setShipName(shipNameInput); saveCaptainProfile(captainProfile); setProfileOpen(false); }} className="action-btn" style={{ background: COLORS.morale, color: COLORS.void, border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
}