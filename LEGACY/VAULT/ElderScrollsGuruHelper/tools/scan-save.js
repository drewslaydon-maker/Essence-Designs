const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('usage: node scan-save.js <file.omwsave> [fromByte] [byteWindow]'); process.exit(1); }
const buf = fs.readFileSync(path);
const from = process.argv[3] ? parseInt(process.argv[3]) : 0;
const window = process.argv[4] ? parseInt(process.argv[4]) : buf.length - from;

const type = (p) => buf.toString('ascii', p, p + 4);
const u32 = (p) => buf.readUInt32LE(p);

const candidates = [];
for (let p = from; p < from + window && p + 12 <= buf.length; p++) {
    const t = type(p);
    if (/^[A-Z0-9_]{4}$/.test(t)) {
        const size = u32(p + 4);
        if (size > 0 && size < buf.length) {
            candidates.push({ off: p, t: t, size: size, tail: type(p + 8 + Math.min(size, 24)) });
        }
    }
}
// dedupe consecutive (same record spans), print unique record starts in order
let last = -48;
for (const c of candidates) {
    if (c.off - last < 8) continue;
    last = c.off;
    console.log(c.off.toString(16).padStart(6) + ')  ' + c.t + '  size=' + c.size + '   tail=' + JSON.stringify(c.tail));
}