import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

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
  code = code.replace(/export\s+default\s+/g, "");
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

const iconList = ["Zap","Flame","Sparkles","AlertTriangle","Skull","Eye","EyeOff","RotateCcw","HelpCircle","Trophy","Rocket","Heart","Radar","Compass","ShieldAlert","History","Trash2","Volume2","VolumeX","BookOpen","Award","FileText","Info","Terminal","Anchor","ChevronRight","X","Lock","CheckCircle","Radio","Edit3"];
const iconDefs = iconList.map(n => `var ${n} = createLucideIcon("${n}");`).join("\n");

const headerCode = `
var useState = React.useState;
var useRef = React.useRef;
var useEffect = React.useEffect;
var useMemo = React.useMemo;
var useCallback = React.useCallback;

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, function(_, c) { return c.toUpperCase(); });
}

function Icon(props) {
  var name = props.name;
  var size = props.size || 16;
  var color = props.color || "currentColor";
  var style = props.style;
  var className = props.className;
  var icons = window.lucide && window.lucide.icons;
  var iconData = icons && (icons[name] || icons[name.toLowerCase()] || icons[toKebabCase(name)] || icons[toCamelCase(name)]);
  if (!iconData) {
    return React.createElement("span", {
      style: Object.assign({ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, verticalAlign: "middle" }, style),
      className: className
    });
  }
  return React.createElement(
    "svg",
    Object.assign(
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: Object.assign({ display: "inline-block", verticalAlign: "middle" }, style),
        className: className
      }
    ),
    iconData.map(function(item, i) {
      var tag = item[0];
      var attrs = item[1];
      return React.createElement(tag, Object.assign({ key: i }, attrs));
    })
  );
}

var createLucideIcon = function(name) {
  return function(props) {
    return React.createElement(Icon, Object.assign({ name: name }, props));
  };
};

${iconDefs}
`;

let fullSource = headerCode;

for (const file of filesToCompile) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    fullSource += `\n// --- Source: ${file} ---\n` + cleanCode(content) + "\n";
  }
}

const transpileResult = ts.transpileModule(fullSource, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.None,
    removeComments: false,
  },
});

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

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PROSIS — The Fracture Playtest</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>${styles}</style>
</head>
<body>
  <div id="root" style="width: 100%; max-width: 900px;"></div>
  <script>
    ${transpileResult.outputText}

    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(TheFracturePlaytest, null));
  </script>
</body>
</html>
`;

const outputPath = path.join(__dirname, "index.html");
fs.writeFileSync(outputPath, htmlTemplate, "utf-8");
console.log(`Successfully generated standalone HTML at: ${outputPath}`);

