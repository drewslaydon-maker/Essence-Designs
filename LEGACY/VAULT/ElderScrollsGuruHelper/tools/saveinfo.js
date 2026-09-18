const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node saveinfo.js <file.omwsave>'); process.exit(1); }
const b = fs.readFileSync(file039);
const b2 = fs.readFileSync(file);

// top-level: records are 12-byte headers (type + u32 size + 4 bytes pad)
const REC = /^[A-Z0-9_]{4}$/;
function t4(p) { return b2.toString('ascii', p, p + 4); }
function u32(p) { return b2.readUInt32LE(p); }
function f32(p) { return b2.readFloatLE(p); }
function f64(p) { return b2.readDoubleLE(p); }

let off = 8 + u32(4) + 4;
if (t4(off) !== 'SAVE') { off = 8 + u32(4); }
if (t4(off) !== 'SAVE' && t4(off + 4) === 'SAVE') { off = off + 4; }

const saveBody = off + 8;
const saveEnd = saveBody + u32(off + 4);

const out = { header: {}, play: {} };

let p = saveBody;
while (p + 8 <= saveEnd) {
    const t = t4(p);
    if (!REC.test(t)) break;
    const sz = u32(p + 4);
    const d = p + 8;
    const end = d + sz;
    if (t === 'PLNA') out.header.name = b2.toString('utf8', d, end).replace(/[\u0000]+$/, '');
    else if (t === 'PLLE') out.header.level = u32(d);
    else if (t === 'PLCL') out.header.classId = b2.toString('ascii', d, end).replace(/[\u0000]+$/, '');
    else if (t === 'PLCN') out.header.className = b2.toString('utf8', d, end).replace(/[\u0000]+$/, '');
    else if (t === 'PLCE') out.header.cell = b2.toString('utf8', d, end).replace(/[\u0000]+$/, '');
    else if (t === 'TSTM') {
        out.header.gameHour = f32(d);
        out.header.day = u32(d + 24);
        out.header.month = u32(d + 28);
        out.header.year = u32(d + 32);
    }
    else if (t === 'TIME') out.header.timePlayed = f64(d);
    else if (t === 'DESC') out.header.desc = b2.toString('utf8', d, end).replace(/[\u0000]+$/, '');
    else if (t === 'DEPE') { if (!out.header.contentFiles) out.header.contentFiles = []; out.header.contentFiles.push(b2.toString('ascii', d, end).replace(/[\u0000]+$/, '')); }
    else if (t === 'SCRN') breakキュム;
    p = p + 8 + sz;
}

console.log(JSON.stringify(out.header, null, 2));
