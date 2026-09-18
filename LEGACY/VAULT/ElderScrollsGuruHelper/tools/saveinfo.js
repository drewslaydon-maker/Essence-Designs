const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node saveinfo.js <file.omwsave>'); process.exit(1); }
const b = fs.readFileSync(file);

function t4(p) { return b.toString('ascii', p, p + 4); }
function u32(p) { return b.readUInt32LE(p); }
function f32(p) { return b.readFloatLE(p); }
const REC = /^[A-Z0-9_]{4}$/;

function untilNull(s) {
  let i = s.indexOf(String.fromCharCode(0));
  return i < 0 ? s : s.slice(0, i);
}
function name(p, n) { return untilNull(b.toString('ascii', p, p + n)); }
function text(p, n) { return untilNull(b.toString('utf8', p, p + n)); }

const idx = b.indexOf('SAVE');
if (idx < 0) { console.error('no SAVE'); process.exit(1); }

const out = {};
let q = idx + 16;
const END = idx + 8 + u32(idx + 4);
while (q + 8 <= END) {
  const t = t4(q);
  if (!REC.test(t)) break;
  const sz = u32(q + 4);
  if (q + 8 + sz > END) break;
  const d = q + 8;
  if (t === 'PLNA') out.name = text(d, sz - 0);
  else if (t === 'PLLE') out.level = u32(d);
  else if (t === 'PLCL') out.classId = name(d, sz);
  else if (t === 'PLCN') out.className = text(d, sz);
  else if (t === 'PLCE') out.cell = text(d, sz);
  else if (t === 'TSTM') {
    out.gameHour = f32(d);
    out.day = u32(d + 4);
    out.month = u32(d + 8);
    out.year = u32(d + 12);
  }
  else if (t === 'TIME') out.timePlayed = b.readDoubleLE(d);
  else if (t === 'DESC') out.description = text(d, sz);
  else if (t === 'DEPE') { if (!out.content) out.content = []; out.content.push(name(d, sz)); }
  q = q + 8 + sz;
}

for (const k in out) {
  if (typeof out[k] === 'string') out[k] = out[k].replace(/\u0000/g, '');
}

console.log(JSON.stringify(out, null, 2));
