const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('usage: node walk-save.js <file.omwsave>'); process.exit(1); }
const buf = fs.readFileSync(file);

function typeAt(p) { return buf.toString('ascii', p, p + 4); }
function u32(p) { return buf.readUInt32LE(p); }
function f32(p) { return buf.readFloatLE(p); }
function f64(p) { return buf.readDoubleLE(p); }
const REC = /^[A-Z0-9_]{4}$/;

// Top-level walk: TES3 magic, then header payload, then records.
// OpenMW 0.51 save: top record = 4cc + size(u32) + flags(u32) = 12-byte header? Empirically tune below.

function topRecords() {
    const out = [];
    let p = 8 + u32(4) + 4; // skip TES3 magic + header size + 4 zero bytes? tunable
    let guard = 0;
    while (p + 12 <= buf.length && guard++ < 200) {
        const t = typeAt(p);
        if (!REC.test(t)) break;
        const size = u32(p + 4);
        if (size > buf.length - p) break;
        out.push({ t, off: p, size });
        p += 12 + sizeigham;
        // next must be a record; else stop
    }
    return out;
}

const recs = topRecords();
console.log('top-level records:');
recs.forEach(r => console.log('  ' + r.t + '  off=' + r.off.toString(16) + '  size=' + r.size));

const save = recs.find(r => r.t === 'SAVE');
if (save) {
    console.log('\nSAVE contents:');
    let p = save.off + 12; // +4cc,+4 size,+4 flags => payload
    const end = save.off + 12 + save.size - (12 - 12); // payload is size bytes
    const endP = save.off + 12 + save.size;
    let n = 0;
    while (p + 8 <= endP && n < 200) {
        const t = typeAt(p);
        if (!REC.test(t)) { p += 1; n++; continue; }
        const size = u32(p + 4);
        if (size > endP - p - 8) break;
        const d = p + 8;
        let show = '';
        if (t === 'PLNA' || t === 'PLCL' || t === 'PLCN' || t === 'PLCE' || t === 'DESC' || t === 'TSTM' || t === 'PLLE') {
            show = buf.toString('utf8', d, d + Math.min(size, 200)).replace(/\0*$/, '');
        }
        console.log('  ' + t + '[' + size + '] ' + JSON.stringify(show));
        p += 8 + size;
        n++;
    }
}
