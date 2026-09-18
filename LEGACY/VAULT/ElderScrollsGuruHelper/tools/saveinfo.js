var fs = require('fs');
var file = process.argv[2];
if (!file) { console.error('usage: node saveinfo.js <file.omwsave>'); process.exit(1); }
var b = fs.readFileSync(file);

function t4(p) { return b.toString('ascii', p, p + 4); }
function u32(p) { return b.readUInt32LE(p); }
var REC = /^[A-Z0-9_]{4}$/;

var off = 8 + u32(4);
var records = [];
while (off + 16 <= b.length) {
    var t = t4(off);
    if (!REC.test(t)) break;
    var size = b.readUInt32LE(off + 4);
    if (t === 'SAVE' || t === 'PLAY') records.push({ t: t, off: off, size: size });
    off += 8 + size;
    if (off + 16 > b.length) break;
}

function subs(rec, fn) {
    var p = rec.off + 8;
    var end = rec.off + 8 + rec.size;
    while (p + 8 <= end) {
        var t = t4(p);
        if (!REC.test(t)) break;
        var sz = b.readUInt32LE(p + 4);
        fn(t, p + 8, sz);
        p += 8 + sz;
    }
}

for (var i = 0; i < records.length; i++) {
    var r = records[i];
    console.log('=== ' + r.t + ' size=' + r.size + ' ===');
    subs(r, function(t, d, sz) {
        if (t === 'PLNA') console.log('  name       ' + b.toString('utf8', d, d + sz).replace(/\u0000+$/, ''));
        else if (t === 'PLLE') console.log('  level      ' + b.readUInt32LE(d));
        else if (t === 'PLCL') console.log('  classId    ' + b.toString('ascii', d, d + sz).replace(/\u0000+$/, ''));
        else if (t === 'PLCN') console.log('  className  ' + b.toString('utf8', d, d + sz).replace(/\u0000+$/, ''));
        else if (t === 'PLCE') console.log('  cell       ' + b.toString('utf8', d, d + sz).replace(/\u0000+$/, ''));
        else if (t === 'TSTM') { console.log('  gameHour   ' + b.readFloatLE(d)); console.log('  day        ' + b.readUInt32LE(d + 4)); console.log('  month      ' + b.readUInt32LE(d + 8)); console.log('  year       ' + b.readUInt32LE(d + 12)); }
        else if (t === 'TIME') console.log('  timePlayed ' + b.readDoubleLE(d));
    });
}
