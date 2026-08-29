import { Compass, X } from "lucide-react";
import { WDT_SCENARIOS, evaluateDiagnosticResult, getCalibrationPatch } from "../wdt";

export function WdtModal({ setWdtOpen, wdtStep, setWdtStep, wdtAnswers, setWdtAnswers, COLORS, panelStyle, ANCHORS }: any) {
  return (
    <div id="wdtModal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(5, 8, 14, 0.92)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...panelStyle, maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", border: `1.5px solid ${COLORS.event}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.panelBorder}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Compass size={22} color={COLORS.event} />
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted }}>ONBOARDING DIAGNOSTIC</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.bone }}>QUANTUM CALIBRATION</h2>
            </div>
          </div>
          <button onClick={() => setWdtOpen(false)} className="action-btn" style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", padding: 6 }}><X size={20} /></button>
        </div>

        {wdtStep < WDT_SCENARIOS.length ? (
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.event, fontWeight: 700, marginBottom: 4 }}>
              SCENARIO {wdtStep + 1} OF {WDT_SCENARIOS.length} — {WDT_SCENARIOS[wdtStep].title}
            </div>
            <div style={{ fontSize: 14, color: COLORS.bone, marginBottom: 16, lineHeight: 1.5 }}>
              {WDT_SCENARIOS[wdtStep].question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WDT_SCENARIOS[wdtStep].options.map((opt: any) => {
                const selected = wdtAnswers[WDT_SCENARIOS[wdtStep].id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setWdtAnswers({ ...wdtAnswers, [WDT_SCENARIOS[wdtStep].id]: opt.id });
                      if (wdtStep + 1 <= WDT_SCENARIOS.length) {
                        setWdtStep(wdtStep + 1);
                      }
                    }}
                    className="action-btn"
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: `1px solid ${selected ? COLORS.event : COLORS.panelBorder}`,
                      background: selected ? `${COLORS.event}22` : COLORS.void,
                      color: COLORS.bone,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          (() => {
            const recPersona = evaluateDiagnosticResult(wdtAnswers);
            const patch = getCalibrationPatch(recPersona);
            return (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 12 }}>DIAGNOSTIC COMPLETE</div>
                <div style={{ fontSize: 16, color: COLORS.bone, marginBottom: 20 }}>
                  Recommended Anchor: <span style={{ color: ANCHORS[recPersona].color, fontWeight: 900 }}>{ANCHORS[recPersona].name}</span>
                </div>
                <div style={{ background: `${COLORS.event}11`, border: `1px solid ${COLORS.event}33`, padding: 16, borderRadius: 8, color: COLORS.bone, fontSize: 13, lineHeight: 1.5, textAlign: "left", marginBottom: 24 }}>
                  {patch}
                </div>
                <button
                  onClick={() => {
                    setWdtOpen(false);
                    setWdtStep(0);
                    setWdtAnswers({});
                  }}
                  className="action-btn"
                  style={{
                    background: COLORS.event,
                    color: COLORS.void,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ACKNOWLEDGE
                </button>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}