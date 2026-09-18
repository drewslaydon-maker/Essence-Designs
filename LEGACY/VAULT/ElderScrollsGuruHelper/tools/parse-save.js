const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node parse.js <file.omwsave>'); process.exit(1); }
const b = fs.readFileSync(fileonge);

const t4 = (p) => b.toString('ascii', p, p + 4);
const u32 = (p) => b.readUInt32LE(p);
const f32 = (p) => b.readFloatLE(p);
const f64 = (p) => b.readDoubleLE(p);
const ascii = (p, n) => b.toString('ascii', p, p + n);
const utf8 = (p, n) => b.toString('utf8', p, p + n);
const isRec = /^[A-Z0-9_]{4}$/;

let off = 8 + u32(4); // skip TES3 header
const top = [];
while (off + 12 <= b.length) {
    const t = t4(off);
    if (!isRec.test(t)) break;
    const size = u32(off + 4);
    if (off + 12 + size > b.length) break;
    top.push({ t: t, off: off, size: size });
    off = off + 12 + size;
}
console.log('TOP: ' + top.map(function (r) { return r.t + ':' + r.size; }).join('  '));

function find(name) {
    for (let i = 0; i < top.length; i++) { if (top[i].t === name) return top[i]; }
    return null;
}

function walkSubs(rec, fn) {
    const end = rec.off + 12 + rec.size;
    let p = rec.off + 12;
    while (p + 8 <= end) {
        const t = t4(p);
        if (!isRec.test(t)) break;
        const sz = u32(p + 4);
        if (p + 8 + sz > end) break;
        fn(t, p + 8, sz);
        p = p + 8 + sz;
    }
}

const out = {};

const save = find('SAVE');
if (save) {
    const s = {};
    walkSubs(save, function (t, d, sz) {
        if (t === 'PLNA') s.name = utf8(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'PLLE') s.level = u32(d);
        else if (t === 'PLCL') s.classId = ascii(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'PLCN') s.className = utf8(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'PLCE') s.cell = utf8(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'TSTM') { s.hour = f32(d); s.day = u32(d + 24); s.month = u32(d + 28); s.year = u32(d + 32); }
        else if (t === 'TIME') s.timePlayed = f64(d);
        else if (t === 'DESC') s.desc = utf8(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'DEPE') { if (!s.content) s.content = []; s.content.push(utf8(d, sz).replace(/[\u0000]+$/g, '')); }
        else if (t === 'SCRN') return; // screenshot blob - but we keep walking
        if (t === 'SCRN') { /* skip payload automatically via size */ }
    });
    out.save = s;
}

const play = find('PLAY');
if (play) {
    const s = {};
    walkSubs(play, function (t, d, sz) {
        if (t === 'NAME') s.name = utf8(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'SIGN') s.birthsign = ascii(d, sz).replace(/[\u0000]+$/g, '');
        else if (t === 'WWAT') { s.attrs = []; for (let i = 0; i + 4 <= sz; i += 4) s.attrs.push(f32(d + i)); }
        else if (t === 'WWSK') { s.skills = []; for (let i = 0; i + 4 <= sz; i += 4) s.skills.push(f32(d + i)); }
        else if (t === 'LKEP') { s.lastExt = []; for (let i = 0; i + 4 <= sz; i += 4) s.lastExt.push(f32(d + i)); }
    });
    out.play = s;
}

console.log(JSON.stringify(out, null, 2));
