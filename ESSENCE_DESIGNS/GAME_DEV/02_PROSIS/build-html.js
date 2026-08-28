import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filesToCompile = [
  "types.ts",
  "constants.ts",
  "data.ts",
  "events.ts",
  "gtl.ts",
  "personas.ts",
  "barriers.ts",
  "mechanics.ts",
  "persistence.ts",
  "test/the-fracture-playtest.tsx",
];

function cleanCode(code) {
  code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
  code = code.replace(/import\s+['"][^'"]+['"];?/g, "");
  code = code.replace(/export\s+default\s+function\s+/g, "function ");
  code = code.replace(/export\s+const\s+/g, "var ");
  code = code.replace(/export\s+let\s+/g, "var ");
  code = code.replace(/export\s+var\s+/g, "var ");
  code = code.replace(/export\s+function\s+/g, "function ");
  code = code.replace(/export\s+interface\s+/g, "interface ");
  code = code.replace(/export\s+type\s+/g, "type ");
  code = code.replace(/export\s*\{[\s\S]*?\};?/g, "");
  code = code.replace(/^const\s+/gm, "var ");
  code = code.replace(/^let\s+/gm, "var ");
  return code;
}

let compiledScriptContent = "";

for (const file of filesToCompile) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    compiledScriptContent += `\n// --- Source: ${file} ---\n` + cleanCode(content) + "\n";
  }
}

const styles = `
:root{--bg-dark:#0b0e14;--bg-panel:#141a24;--border-panel:#212b3a;--text-bone:#f1f5f9;--text-muted:#94a3b8;--color-entropy:#ff4d6d;--color-systems:#6fa8ff;--color-re:#8b5cf6;--color-salvage:#34d399;--color-morale:#fbbf24;--color-danger:#ef4444;--color-event:#38bdf8}
*{box-sizing:border-box;margin:0;padding:0}
body{background-color:var(--bg-dark);color:var(--text-bone);font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px 12px;overflow-x:hidden}
.mono{font-family:ui-monospace,monospace}
.meter-container{background:#080a0f;border:1px solid var(--border-panel);border-radius:8px;padding:10px;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
.meter-track{height:8px;background:#111622;border-radius:4px;overflow:hidden;position:relative;margin-top:6px}
.meter-bar{height:100%;border-radius:4px;transition:width .4s cubic-bezier(.4,0,.2,1)}
.action-btn{transition:all .2s;outline:0}
.action-btn:hover:not(:disabled){filter:brightness(1.2);transform:translateY(-1px)}
.action-btn:active:not(:disabled){transform:translateY(0)}
.level-pill{transition:all .15s}
.level-pill:hover:not(:disabled){filter:brightness(1.25)}
.anchor-card{transition:all .25s}
.anchor-card:hover{border-color:rgba(255,255,255,.3)!important}
`;

const iconList = ["Zap","Flame","Sparkles","AlertTriangle","Skull","Eye","EyeOff","RotateCcw","HelpCircle","Trophy","Rocket","Heart","Radar","Compass","ShieldAlert","History","Trash2"];
const iconDefs = iconList.map(n => `const ${n} = createLucideIcon("${n}");`).join("\n");

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PROSIS — The Fracture Playtest</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>${styles}</style>
</head>
<body>
  <div id="root" style="width: 100%; max-width: 900px;"></div>
  <script type="text/babel">
    function Icon({ name, size = 16, color = "currentColor", style, className }) {
      const iconData = window.lucide && window.lucide.icons && window.lucide.icons[name];
      if (!iconData) {
        return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, verticalAlign: "middle", ...style }} />;
      }
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", ...style }} className={className}>
          {iconData.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
        </svg>
      );
    }
    const createLucideIcon = (name) => (props) => <Icon name={name} {...props} />;
    ${iconDefs}

    ${compiledScriptContent}

    ReactDOM.createRoot(document.getElementById('root')).render(<TheFracturePlaytest />);
  </script>
</body>
</html>
`;

const outputPath = path.join(__dirname, "index.html");
fs.writeFileSync(outputPath, htmlTemplate, "utf-8");
console.log(`Successfully generated standalone HTML at: ${outputPath}`);
