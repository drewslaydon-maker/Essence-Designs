const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('usage: node inspect-save.js <file.omwsave> [maxRecords]'); process.exit(1); }
const buf = fs.readFileSync(path);
const maxRecords = process.argv[3] ? parseInt(process.argv[3]) : 40;

const type = (p) => buf.toString('ascii', p, p + 4);
const u32 = (p) => buf.readUInt32LE(p);

const marker = Buffer.from('SAVE');
let off = buf.indexOf(marker, 8);
if (off < 0) { console.error('no SAVE record found'); process.exit(1); }
console.log('first record at', off.toString(16));

let printed = 0;
while (printed < maxRecords && off + 8 <= buf.length) {
    const t = type(off);
    const size = u32(off + 4);
    console.log(String(printed).padStart(3) + '  ' + off.toString(16).padStart(6) + ')  ' + t + '  payload=' + size);
    off = off + 8 + size;
    if (!/^[A-Z0-9_]+$/.test(type(off))) break;
    printed++;
}
console.log('end offset:', off, 'of', buf.length);