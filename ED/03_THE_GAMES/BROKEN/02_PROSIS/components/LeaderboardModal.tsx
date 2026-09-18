import { X } from "lucide-react";

const DEFAULT_HIGH_SCORES = [
  {
    id: "default_1",
    shipName: "USSC THESEUS",
    captainCallsign: "VANCE",
    score: 48500,
    rounds: 30,
    sector: 3,
    morale: 85,
    entropy: 10,
    anchorPersona: "ricky",
    hullSkin: "titanium",
    equippedRuneIds: [],
    timestamp: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: "default_2",
    shipName: "USSC PROMETHEUS",
    captainCallsign: "JAX",
    score: 39200,
    rounds: 25,
    sector: 3,
    morale: 60,
    entropy: 35,
    anchorPersona: "maude",
    hullSkin: "titanium",
    equippedRuneIds: [],
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: "default_3",
    shipName: "USSC ENDEAVOUR",
    captainCallsign: "ROOK",
    score: 24100,
    rounds: 18,
    sector: 2,
    morale: 45,
    entropy: 40,
    anchorPersona: "dez",
    hullSkin: "titanium",
    equippedRuneIds: [],
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  }
];

export function LeaderboardModal({ setLeaderboardOpen, leaderboardFilter, setLeaderboardFilter, highScoresList, COLORS, panelStyle, ANCHORS }: any) {
  return (
    <div id="leaderboardModal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "20px 24px", border: `2px solid ${COLORS.morale}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: COLORS.bone }}>ARCADE LEADERBOARD</h2>
          <button onClick={() => setLeaderboardOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer" }}><X size={18} /></button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["All", "ricky", "maude", "dez"].map((tab) => {
            const isActive = leaderboardFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setLeaderboardFilter(tab)}
                className="action-btn"
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: `1px solid ${isActive ? COLORS.morale : COLORS.panelBorder}`,
                  background: isActive ? `${COLORS.morale}22` : COLORS.void,
                  color: isActive ? COLORS.morale : COLORS.muted,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Leaderboard List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
          {(() => {
            const scoresToRender = (highScoresList && highScoresList.length > 0) ? highScoresList : DEFAULT_HIGH_SCORES;
            const filtered = scoresToRender.filter((entry: any) => {
              if (leaderboardFilter === "All") return true;
              return entry.anchorPersona === leaderboardFilter;
            }).slice(0, 10);

            if (filtered.length === 0) {
              return (
                <div style={{ textAlign: "center", padding: 20, color: COLORS.muted, fontSize: 12 }}>
                  No high scores recorded yet.
                </div>
              );
            }

            return filtered.map((entry: any, idx: number) => (
              <div
                key={entry.id || idx}
                style={{
                  background: COLORS.void,
                  border: `1px solid ${idx === 0 ? COLORS.morale : COLORS.panelBorder}`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.bone }}>
                    #{idx + 1} {entry.shipName} <span style={{ fontSize: 10, color: COLORS.muted }}>({entry.captainCallsign || "CAPTAIN"})</span>
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>
                    Sector {entry.sector} · Round {entry.rounds} · Hull: {entry.hullSkin || "titanium"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 900, color: COLORS.salvage }}>
                    {entry.score.toLocaleString()} PTS
                  </div>
                  <div style={{ fontSize: 10, color: ANCHORS[entry.anchorPersona]?.color || COLORS.muted, fontWeight: 700, textTransform: "capitalize" }}>
                    {entry.anchorPersona}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setLeaderboardOpen(false)} className="action-btn" style={{ background: COLORS.morale, color: COLORS.void, border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            CLOSE LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
}