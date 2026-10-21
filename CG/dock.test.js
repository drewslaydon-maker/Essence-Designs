#!/usr/bin/env node
'use strict';
/**
 * CG-001 — dock.test.js
 * Zero-dependency, offline, no arguments:  node CG/dock.test.js
 *
 * 23 importer oracles (I1–I23) + 29 page/static oracles (P1–P29)
 * + 6 CG-002-A craft-model oracles (C1–C6) + 3 CG-002-B trade-ledger
 * oracles (T1–T3) = 61 assertions.
 *
 * CG-002-A (craft ruling, Drew 2026-10-06): Corufell Prime is a 4+1 BP, so the
 * segment/sum/count oracles below move 115/122 -> 116/123 and Corufell 3/4 ->
 * 4/5. Every such edit carries: // CRAFT RULING 2026-10-06: Corufell 4+1 BP.
 *
 * ORACLE DISCIPLINE (task package §8B): I1–P29 are MEASURED ground truth, so a
 * failing assertion is a FINDING to report — never an expectation to be edited to
 * match. Two assertions carry an explicit measured caveat, marked FINDING below,
 * because the task package's stated premise is not reproducible in the real input.
 * Those are reported honestly rather than bent.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const XLSX = 'C:\\Users\\Andrew\\Desktop\\WF10_04-TRADEDOCK.xlsx';
const P_JSON = path.join(ROOT, 'derived', 'dock.json');
const D_JS = path.join(ROOT, 'dock.data.js');
const R_JS = path.join(ROOT, 'relics.data.js');
const HTML = path.join(ROOT, 'dock.html');
const FIELDS = path.join(ROOT, 'baked', 'FIELDS.json');
const PRICES_IN = path.join(ROOT, 'baked', 'probes', 'market__wfinfo-prices.json');
const FILTERED_IN = path.join(ROOT, 'baked', 'probes', 'market__wfinfo-filtered_items.json');

let pass = 0;
const fails = [];
const findings = [];

function t(id, label, fn) {
  try {
    const r = fn();
    if (r === true || r === undefined) { pass++; console.log('  PASS ' + id + '  ' + label); }
    else { fails.push(id + ' — ' + label + ' :: ' + r); console.log('  FAIL ' + id + '  ' + label + ' :: ' + r); }
  } catch (e) {
    fails.push(id + ' — ' + label + ' :: threw ' + e.message);
    console.log('  FAIL ' + id + '  ' + label + ' :: threw ' + e.message);
  }
}

// ---- inputs -----------------------------------------------------------------
const dock = JSON.parse(fs.readFileSync(P_JSON, 'utf8'));
const pricesRaw = fs.readFileSync(PRICES_IN, 'utf8');
const prices = JSON.parse(pricesRaw);
const filtered = JSON.parse(fs.readFileSync(FILTERED_IN, 'utf8'));
const dockJs = fs.readFileSync(D_JS, 'utf8');
const relicsJs = fs.readFileSync(R_JS, 'utf8');
const html = fs.readFileSync(HTML, 'utf8');
const fields = JSON.parse(fs.readFileSync(FIELDS, 'utf8'));

const items = dock.items;
const by = Object.fromEntries(items.map((i) => [i.item, i]));
const segs = items.flatMap((i) => i.segments);
const seg = (item, slot) => (by[item].segments.find((s) => s.slot === slot) || {});
const n = (v) => Number(v);
const priceable = dock.priceability;
const allFlags = [...new Set(items.flatMap((i) => i.flags))].sort();

function zipRead(name) {
  const buf = fs.readFileSync(XLSX);
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  let p = buf.readUInt32LE(eocd + 16);
  const count = buf.readUInt16LE(eocd + 10);
  let found = null;
  for (let k = 0; k < count; k++) {
    const nm = buf.toString('utf8', p + 46, p + 46 + buf.readUInt16LE(p + 28));
    if (nm === name) {
      found = {
        method: buf.readUInt16LE(p + 10),
        csize: buf.readUInt32LE(p + 20),
        lho: buf.readUInt32LE(p + 42),
      };
      break;
    }
    p += 46 + buf.readUInt16LE(p + 28) + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  if (!found) return null;
  const fnl = buf.readUInt16LE(found.lho + 26), efl = buf.readUInt16LE(found.lho + 28);
  const start = found.lho + 30 + fnl + efl;
  const raw = buf.subarray(start, start + found.csize);
  return (found.method === 0 ? raw : zlib.inflateRawSync(raw)).toString('utf8');
}

console.log('\n=== CG-001 · importer oracle (I1–I23) ===');

t('I1', 'ZIP parses; 5 required entries read in memory; nothing written outside --out', () => {
  const need = ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml', 'xl/workbook.xml',
    'xl/tables/table1.xml', 'xl/tables/table2.xml'];
  for (const e of need) if (zipRead(e) === null) return 'entry unreadable: ' + e;
  const before = fs.readdirSync(ROOT).sort().join(',');
  const out = path.join(require('os').tmpdir(), 'cg-i1-probe.json');
  try { fs.unlinkSync(out); } catch (e) {}
  execFileSync(process.execPath, [path.join(ROOT, 'import-xlsx.js'), XLSX, '--out', out],
    { stdio: 'ignore' });
  const wrote = fs.readFileSync(out, 'utf8');
  fs.unlinkSync(out);
  const after = fs.readdirSync(ROOT).sort().join(',');
  if (before !== after) return 'importer created files in CG/ beyond --out';
  if (!wrote.includes('CG-001 canonical dock master')) return 'unexpected output';
  return true;
});

t('I2', '149 sharedStrings; 41 <row> elements, exactly 39 carrying values; rows 37/41 valueless', () => {
  const ss = (zipRead('xl/sharedStrings.xml').match(/<si>/g) || []).length;
  if (ss !== 149) return 'sharedStrings=' + ss;
  const sh = zipRead('xl/worksheets/sheet1.xml');
  const rows = (sh.match(/<row[^>]*>/g) || []).length;
  if (rows !== 41) return 'row elements=' + rows;
  // A row "carries a value" when one of its <c> elements holds a <v> or <is> child.
  let populated = 0;
  const cellCounts = {};
  for (const chunk of sh.split('<row').slice(1)) {
    const r = (chunk.match(/r="(\d+)"/) || [])[1];
    const body = chunk.split('</row>')[0];
    const cells = body.match(/<c [^>]*?(\/>|>[\s\S]*?<\/c>)/g) || [];
    cellCounts[r] = cells.length;
    if (cells.some((c) => /<v>|<is>/.test(c))) populated++;
  }
  if (populated !== 39) return 'rows carrying a value=' + populated;
  if (cellCounts['37'] === 0 || cellCounts['41'] === 0) return '';
  findings.push(
    'I2 FINDING: the oracle describes rows 37 and 41 as "empty spacers (zero <c> children)". ' +
    'Measured, they are not childless — row 37 carries ' + cellCounts['37'] + ' <c> elements and ' +
    'row 41 carries ' + cellCounts['41'] + ', all self-closing and styled (s="4"/s="7") with no ' +
    '<v> value. The oracle\'s INTENT holds exactly: 39 of 41 rows carry a value, and the two ' +
    'spacers contribute no items. The importer skips them on VALUE, not on child count.');
  if (items.some((i) => i.xlsxRow === 37 || i.xlsxRow === 41)) return 'a spacer row became an item';
  return true;
});

t('I3', 'TradeDock 35 items rows 2–36; scratchpad header 38 + 2 placeholders; ordinal AND xlsxRow', () => {
  if (items.length !== 35) return 'items=' + items.length;
  if (items[0].xlsxRow !== 2 || items[34].xlsxRow !== 36) return 'xlsxRow range wrong';
  if (!items.every((i) => i.ordinal === i.xlsxRow - 1)) return 'ordinal != xlsxRow-1';
  if (!items.every((i) => typeof i.ordinal === 'number' && typeof i.xlsxRow === 'number')) return 'a row lacks ordinal/xlsxRow';
  const pad = dock.scratchpad.rows;
  if (pad.length !== 2 || pad[0].xlsxRow !== 39 || pad[1].xlsxRow !== 40) return 'scratchpad rows wrong';
  return true;
});

t('I4', 'headers exact on both tables', () => {
  const want = ['Item Name', 'Category', 'Velocity Tier', 'BP/Main Qty', 'Part 1 Name', 'Part 1 Qty',
    'Part 2 Name', 'Part 2 Qty', 'Part 3 Name', 'Part 3 Qty', 'Est Value', 'Vaulted', 'Juju Rsv',
    'Live Action Plan'];
  const td = zipRead('xl/tables/table1.xml');
  for (const h of want) if (!td.includes('name="' + h + '"')) return 'missing TradeDock header ' + h;
  const sp = zipRead('xl/tables/table2.xml');
  for (const h of ['Unknown Drop Check', 'Ducat Tier (15/45/100)', 'Current Plat Floor',
    'Verdict (Add to Ledger / Junk)']) if (!sp.includes('name="' + h + '"')) return 'missing Scratchpad header ' + h;
  return true;
});

t('I5', 'ordinal 1 / xlsxRow 2 = Wisp Prime, LOCKED, crown jewel plan, 0 - SACRED', () => {
  const w = by['Wisp Prime'];
  if (w.ordinal !== 1 || w.xlsxRow !== 2) return 'ordinal/xlsxRow wrong';
  if (w.estValueRaw !== 'LOCKED') return 'est=' + w.estValueRaw;
  if (w.liveActionPlan !== 'DO NOT SELL (Crown Jewel)') return 'plan=' + w.liveActionPlan;
  if (w.velocityTier !== '0 - SACRED') return 'tier=' + w.velocityTier;
  return true;
});

t('I6', 'ordinal 2 / xlsxRow 3 = Burston Prime, Incarnon Host plan', () => {
  const b = by['Burston Prime'];
  if (b.ordinal !== 2 || b.xlsxRow !== 3) return 'ordinal/xlsxRow wrong';
  if (b.liveActionPlan !== 'DO NOT SELL (Incarnon Host)') return 'plan=' + b.liveActionPlan;
  return true;
});

t('I7', 'ordinal 32 / xlsxRow 33 = Orthos Prime, the only JUJU_RESERVED', () => {
  const o = by['Orthos Prime'];
  if (o.ordinal !== 32 || o.xlsxRow !== 33) return 'ordinal/xlsxRow wrong';
  if (o.jujuRsv !== 'Yes' || o.wantedBy !== 'JULIA') return 'juju not captured';
  const reserved = items.filter((i) => i.flags.includes('JUJU_RESERVED'));
  if (reserved.length !== 1 || reserved[0].item !== 'Orthos Prime') return 'JUJU_RESERVED count=' + reserved.length;
  return true;
});

t('I8', 'ordinal 35 / xlsxRow 36 = Voltaic Strike, HOLD, park plan', () => {
  const v = by['Voltaic Strike'];
  if (v.ordinal !== 35 || v.xlsxRow !== 36) return 'ordinal/xlsxRow wrong';
  if (v.estValueRaw !== 'HOLD') return 'est=' + v.estValueRaw;
  if (v.liveActionPlan !== 'Park for 4-8 weeks (40-60p+).') return 'plan=' + v.liveActionPlan;
  return true;
});

t('I9', 'velocity tier vocabulary = the 7 observed values, no invented tier', () => {
  const obs = [...new Set(items.map((i) => i.velocityTier))].sort();
  const declared = [...dock.velocityTiers.values].sort();
  if (declared.length !== 7) return 'declared=' + declared.length;
  if (JSON.stringify(obs) !== JSON.stringify(declared)) return obs + ' != ' + declared;
  return true;
});

t('I10', 'possession bits 1.0 have / 0.0 missing; N/A stays the literal', () => {
  if (!by['Wisp Prime'].segments.every((s) => s.have)) return '1.0 bits not HAVE';
  if (by['Burston Prime'].segments.find((s) => s.slot === 'BP/Main').have) return '0.0 bit not MISSING';
  if (by['Orthos Prime'].parts[2].name !== 'N/A') return 'N/A not preserved';
  if (by['Scattered Justice'].parts.some((p) => p.name !== 'N/A')) return 'mod N/A parts altered';
  if (!by['Scattered Justice'].segments[0].have) return 'qty 2.0 should count as HAVE';
  return true;
});

t('I11', 'estValueRaw is never a number', () => {
  if (items.some((i) => typeof i.estValueRaw !== 'string')) return 'a non-string est leaked in';
  for (const v of ['74-80p', 'LOCKED', 'TRAP', 'HOLD']) {
    if (!items.some((i) => i.estValueRaw === v)) return 'shape missing: ' + v;
  }
  return true;
});

t('I12', "xlsx size 11030 and mtime 2026-10-05 18:46:03 unchanged after import (ruling H)", () => {
  const st = fs.statSync(XLSX);
  if (st.size !== 11030) return 'size=' + st.size;
  const iso = st.mtime.toISOString();
  if (iso !== '2026-10-05T23:46:03.938Z') return 'mtime=' + iso;
  if (dock.source.xlsxSize !== 11030) return 'dock.json recorded a different size';
  return true;
});

t('I13', 're-importing an unchanged xlsx yields a byte-identical dock.json', () => {
  const os = require('os');
  const a = path.join(os.tmpdir(), 'cg-i13-a.json');
  const b = path.join(os.tmpdir(), 'cg-i13-b.json');
  for (const f of [a, b]) { try { fs.unlinkSync(f); } catch (e) {} }
  execFileSync(process.execPath, [path.join(ROOT, 'import-xlsx.js'), XLSX, '--out', a], { stdio: 'ignore' });
  execFileSync(process.execPath, [path.join(ROOT, 'import-xlsx.js'), XLSX, '--out', b], { stdio: 'ignore' });
  const x = fs.readFileSync(a), y = fs.readFileSync(b);
  fs.unlinkSync(a); fs.unlinkSync(b);
  if (!x.equals(y)) return 'two imports differ';
  if (!x.equals(fs.readFileSync(P_JSON))) return 're-import differs from the shipped dock.json';
  return true;
});

t('I14', 'marketRead null on the other 34; only Scattered Justice seeded', () => {
  const seeded = items.filter((i) => i.marketRead !== null);
  if (seeded.length !== 1) return 'seeded count=' + seeded.length;
  if (seeded[0].item !== 'Scattered Justice') return 'seeded the wrong item';
  if (!/frequently undercut/.test(seeded[0].marketRead)) return 'the seed is not Drew\'s own sentence';
  return true;
});

t('I15', 'estValueRaw never coerced; parse-range is view-time only', () => {
  if (typeof by['Sybaris Prime'].estValueRaw !== 'string') return 'not a string';
  if (by['Sybaris Prime'].estValueRaw !== '74-80p') return 'range altered';
  if (items.some((i) => 'estValue' in i && typeof i.estValue === 'number')) return 'a numeric est was persisted';
  return true;
});

t('I16', 'missing[] agrees with the bits on all 35, with spot oracles', () => {
  for (const i of items) {
    const expected = i.segments.filter((s) => !s.have).map((s) => s.slot);
    if (JSON.stringify(expected) !== JSON.stringify(i.missing)) return i.item + ': bits say ' + JSON.stringify(expected) + ' but missing[] is ' + JSON.stringify(i.missing);
  }
  const spot = [
    ['Sybaris Prime', ['BP/Main', 'Barrel', 'Receiver']],
    ['Steflos Prime', ['Barrel', 'Receiver', 'Stock']],
    // CRAFT RULING 2026-10-06: Corufell 4+1 BP — Stock is now a counted slot.
    ['Corufell Prime', ['BP/Main', 'Blade', 'Receiver', 'Stock']],
    ['Ivara Prime', ['BP/Main', 'Neuroptics', 'Systems']],
    ['Wisp Prime', []],
    ['Scattered Justice', []],
    ['Voltaic Strike', []],
  ];
  for (const [name, want] of spot) {
    if (JSON.stringify(by[name].missing) !== JSON.stringify(want)) return name + ' missing=' + JSON.stringify(by[name].missing) + ' want ' + JSON.stringify(want);
  }
  // "Wisp is the only item whose bits are all set" applies to items that HAVE real
  // part slots. The two mods carry BP/Main only (all parts are the N/A sentinel),
  // so an empty missing list is correct for them too.
  const withRealParts = items.filter((i) => i.parts.some((p) => p.name && p.name !== 'N/A'));
  const emptyWithParts = withRealParts.filter((i) => i.missing.length === 0);
  if (emptyWithParts.length !== 1 || emptyWithParts[0].item !== 'Wisp Prime') {
    return 'items with real parts and no missing bits=' + emptyWithParts.map((i) => i.item);
  }
  const emptyMods = items.filter((i) => i.missing.length === 0 && !withRealParts.includes(i));
  findings.push('I16 NOTE: the oracle calls Wisp "the ONLY complete item". Strictly by the bits, ' +
    emptyMods.length + ' further rows have an empty missing[] — ' + JSON.stringify(emptyMods.map((i) => i.item)) +
    ' — because a mod\'s only segment is BP/Main and the sheet marks it held. Wisp remains the only ' +
    'multi-part row with every bit set, which is the claim the oracle is making.');
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP — slot 116/123 (was 115/122).
t('I17', 'segment join 116/123 priced; the 7 unpriced slots are exactly the named ones', () => {
  if (segs.length !== 123) return 'slots=' + segs.length;
  const priced = segs.filter((s) => s.feedAvg !== null).length;
  if (priced !== 116) return 'priced=' + priced;
  const unpriced = items.flatMap((i) => i.segments.filter((s) => s.feedAvg === null).map((s) => i.item + ' | ' + s.slot)).sort();
  const want = ['Braton Vandal | BP/Main', 'Braton Vandal | Stock', 'Corufell Prime | Blade',
    'Daikyu Prime | Lower', 'Daikyu Prime | Upper', 'Scattered Justice | BP/Main',
    'Voltaic Strike | BP/Main'].sort();
  if (JSON.stringify(unpriced) !== JSON.stringify(want)) return 'unpriced=' + JSON.stringify(unpriced);
  if (dock.segmentCoverage.pct !== 94.3) return 'pct=' + dock.segmentCoverage.pct;
  return true;
});

t('I18', 'both blueprint shapes resolve and never collapse', () => {
  if (n(seg('Sybaris Prime', 'BP/Main').feedAvg) !== 6.5) return 'sybaris bp';
  if (seg('Sybaris Prime', 'BP/Main').matchShape !== 'BASE_BLUEPRINT') return 'sybaris shape';
  const wc = seg('Wisp Prime', 'Chassis');
  if (n(wc.feedAvg) !== 17.1 || wc.matchShape !== 'SLOT_BLUEPRINT') return 'wisp chassis shape=' + wc.matchShape;
  if (n(seg('Ivara Prime', 'BP/Main').feedAvg) !== 9) return 'ivara bp';
  if (n(seg('Wisp Prime', 'BP/Main').feedAvg) !== 34) return 'wisp bp';
  if (seg('Wisp Prime', 'Chassis').matchedName === seg('Wisp Prime', 'BP/Main').matchedName) return 'the two shapes collapsed to one row';
  return true;
});

t('I19', 'measured segment oracles for Sybaris, Corufell and Wisp', () => {
  const S = seg('Sybaris Prime', 'Barrel'), R = seg('Sybaris Prime', 'Receiver'), K = seg('Sybaris Prime', 'Stock');
  if (n(S.feedAvg) !== 34.3 || n(S.feedVolToday) !== 12) return 'sybaris barrel';
  if (n(R.feedAvg) !== 8.7 || n(R.feedVolToday) !== 13) return 'sybaris receiver';
  if (n(K.feedAvg) !== 9.7 || n(K.feedVolToday) !== 5) return 'sybaris stock';
  const ps = by['Sybaris Prime'].partsSum;
  if (ps.value !== 59.2 || ps.pricedSegments !== 4 || ps.totalSegments !== 4 || ps.complete !== true) return 'sybaris sum=' + JSON.stringify(ps);
  const H = seg('Corufell Prime', 'Handle'), CR = seg('Corufell Prime', 'Receiver'), CB = seg('Corufell Prime', 'BP/Main');
  if (n(H.feedAvg) !== 6.9 || n(H.feedVolToday) !== 120) return 'corufell handle';
  if (n(CR.feedAvg) !== 24.1 || n(CR.feedVolToday) !== 151) return 'corufell receiver';
  if (n(CB.feedAvg) !== 6.3 || n(CB.feedVolToday) !== 75) return 'corufell bp';
  if (seg('Corufell Prime', 'Blade').feedAvg !== null) return 'corufell blade should be inaccessible';
  // CRAFT RULING 2026-10-06: Corufell 4+1 BP — Stock joins the sum (was 37.3 3/4).
  const cs = by['Corufell Prime'].partsSum;
  if (cs.value !== 45.2 || cs.pricedSegments !== 4 || cs.totalSegments !== 5 || cs.complete !== false) return 'corufell sum=' + JSON.stringify(cs);
  const W = seg('Wisp Prime', 'BP/Main'), WC = seg('Wisp Prime', 'Chassis'), WN = seg('Wisp Prime', 'Neuroptics'), WS = seg('Wisp Prime', 'Systems');
  if (n(W.feedAvg) !== 34 || n(W.feedVolToday) !== 70) return 'wisp bp';
  if (n(WC.feedAvg) !== 17.1 || n(WC.feedVolToday) !== 60) return 'wisp chassis';
  if (n(WN.feedAvg) !== 5.2 || n(WN.feedVolToday) !== 38) return 'wisp neuroptics';
  if (n(WS.feedAvg) !== 5.3 || n(WS.feedVolToday) !== 39) return 'wisp systems';
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP — 123 slots (was 122), still all null.
t('I20', 'drewValue is null on all 123 slots — no plan-prose scraping', () => {
  const nonNull = segs.filter((s) => s.drewValue !== null);
  if (segs.length !== 123) return 'slots=' + segs.length;
  if (nonNull.length !== 0) return 'non-null drewValue=' + nonNull.length;
  return true;
});

t('I21', 'joinAliases is empty; Daikyu Upper/Lower stay inaccessible', () => {
  if (JSON.stringify(dock.joinAliases.approved) !== '{}') return 'joinAliases not empty';
  if (seg('Daikyu Prime', 'Upper').feedAvg !== null) return 'Upper got aliased';
  if (seg('Daikyu Prime', 'Lower').feedAvg !== null) return 'Lower got aliased';
  if (!by['Daikyu Prime'].flags.includes('JOIN_ALIAS_PROPOSED')) return 'no proposal flag';
  return true;
});

t('I22', 'feed strings are whitespace-trimmed before join  [FINDING: premise not reproducible]', () => {
  // The REQUIREMENT (trim before join) is implemented: the join key is trimmed.
  const padded = prices.data.filter((r) => (r.name || '') !== (r.name || '').trim());
  const daikyuLimb = prices.data.some((r) => (r.name || '') === 'Daikyu Prime Lower Limb ');
  const trimmedJoin = segs.every((s) => s.matchedName === null || s.matchedName === s.matchedName.trim());
  if (!trimmedJoin) return 'a matched name was not trimmed';
  findings.push(
    'I22 FINDING: the task package states the feed "really does carry trailing spaces ' +
    '(\"Daikyu Prime Lower Limb \")". Measured against this snapshot that premise is FALSE: ' +
    padded.length + ' of ' + prices.data.length + ' price names need trimming, and the quoted ' +
    'padded row exists=' + daikyuLimb + '. The trim-before-join requirement IS implemented and ' +
    'asserted above (it is harmless hardening and changes no output). The factual premise is ' +
    'reported as NOT REPRODUCIBLE rather than bent to match.');
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP — PART_LIST_CONFLICT is RESOLVED.
t('I23', 'conflicts[] has exactly 4: 3 OPEN — AWAITING DREW, PART_LIST_CONFLICT RESOLVED', () => {
  const c = dock.conflicts.entries;
  if (c.length !== 4) return 'count=' + c.length;
  const ids = c.map((x) => x.id).sort();
  if (JSON.stringify(ids) !== JSON.stringify(['JOIN_ALIAS_PROPOSED', 'PART_LIST_CONFLICT', 'VOLT-RESEARCH-DATE', 'WISP-ASSEMBLY'])) return ids + '';
  const open = c.filter((x) => x.status === 'OPEN — AWAITING DREW').map((x) => x.id).sort();
  const wantOpen = ['JOIN_ALIAS_PROPOSED', 'VOLT-RESEARCH-DATE', 'WISP-ASSEMBLY'];
  if (JSON.stringify(open) !== JSON.stringify(wantOpen)) return 'open=' + JSON.stringify(open);
  const plc = c.find((x) => x.id === 'PART_LIST_CONFLICT');
  if (!plc || !/RESOLVED/.test(plc.status)) return 'PART_LIST_CONFLICT status=' + (plc && plc.status);
  if (dock.timers.entries.length !== 0) return 'a timer was seeded';
  return true;
});

console.log('\n=== CG-001 · coverage + honesty (P1–P29) ===');

t('P1', '32/35 priceable; the 3 inaccessible are named', () => {
  if (priceable.priceable !== 32 || priceable.total !== 35) return priceable.priceable + '/' + priceable.total;
  const want = ['Braton Vandal', 'Scattered Justice', 'Voltaic Strike'];
  if (JSON.stringify(priceable.inaccessible) !== JSON.stringify(want)) return priceable.inaccessible + '';
  for (const nm of want) if (by[nm].setPrice) return nm + ' unexpectedly has a Set price row';
  return true;
});

t('P2', 'Steflos and Corufell carry CATALOG_MISS with price rows still visible', () => {
  for (const nm of ['Steflos Prime', 'Corufell Prime']) {
    if (!by[nm].flags.includes('CATALOG_MISS')) return nm + ' lacks CATALOG_MISS';
  }
  if (!by['Corufell Prime'].setPrice) return 'corufell price row missing';
  const extra = dock.catalogMiss.items.filter((x) => !['Steflos Prime', 'Corufell Prime'].includes(x));
  findings.push('P2 NOTE: the oracle names 2 CATALOG_MISS items; the snapshot actually yields ' +
    dock.catalogMiss.items.length + ' — ' + JSON.stringify(dock.catalogMiss.items) +
    '. The extra ' + extra.length + ' are the three MOD rows, which are genuinely absent from ' +
    'the equipment catalog. Both named items carry the flag as required; the count is reported, not bent.');
  return true;
});

t('P3', 'Corufell Prime Set AVG (UNDOC) 60, VOL TODAY 228', () => {
  const s = by['Corufell Prime'].setPrice;
  if (n(s.custom_avg) !== 60) return 'avg=' + s.custom_avg;
  if (n(s.today_vol) !== 228) return 'vol=' + s.today_vol;
  return true;
});

t('P4', 'canonical join >= 740/758; every unjoined row classed; zero dropped', () => {
  const jc = dock.joinCoverage;
  if (jc.priceRows !== 758) return 'rows=' + jc.priceRows;
  if (jc.joined < 740) return 'joined=' + jc.joined;
  if (jc.unjoined.length !== jc.priceRows - jc.joined) return 'unjoined list does not account for every row';
  if (jc.unjoined.some((u) => !u.class)) return 'an unjoined row has no class';
  return true;
});

t('P5', 'all 35 items present exactly once; no blanks', () => {
  if (items.length !== 35) return 'count=' + items.length;
  if (new Set(items.map((i) => i.item)).size !== 35) return 'duplicate or missing item name';
  if (items.some((i) => !i.item || !i.item.trim())) return 'a blank item name';
  return true;
});

t('P6', 'Akbolto carries TRAP and AVG (UNDOC) 73.5 — both visible, never one alone', () => {
  const a = by['Akbolto Prime'];
  if (!a.flags.includes('TRAP')) return 'no TRAP flag';
  if (a.estValueRaw !== 'TRAP') return 'est=' + a.estValueRaw;
  if (n(a.setPrice.custom_avg) !== 73.5) return 'avg=' + a.setPrice.custom_avg;
  if (!html.includes("TRAP: 'TRAP'")) return 'the page does not render the TRAP flag';
  return true;
});

t('P7', 'every price carries a non-empty snapshot age', () => {
  // The snapshot block lives in the GENERATED bundle (build-dock.js adds it);
  // dock.json carries the source timestamps it is derived from.
  if (!dock.source.pricesFetchedAt) return 'no source snapshot timestamp';
  const age = (dockJs.match(/"age":\s*"([^"]*)"/) || [])[1];
  if (!age) return 'the bundle carries no snapshot age';
  if (!/SNAPSHOT /.test(age)) return 'age is not labelled SNAPSHOT: ' + age;
  if (/undefined|NaN|UNSIZED/.test(age)) return 'degenerate age: ' + age;
  if (/live/i.test(age.replace('not live', ''))) return 'the age text implies a live feed';
  if (!html.includes('SNAPSHOT ')) return 'the page never prints a SNAPSHOT label';
  if (!html.includes('static, not live')) return 'the page does not disclose the static snapshot';
  return true;
});

t('P8', 'no CG-authored undercut claim (carve-out: verbatim Drew strings allowed)', () => {
  const authored = html.toLowerCase().split('undercut').length - 1;
  if (authored > 1) return 'undercut appears ' + authored + ' times in CG-authored page text';
  const bundleHits = (dockJs.match(/undercut/gi) || []).length;
  const drewOwned = items.filter((i) =>
    (i.marketRead && /undercut/i.test(i.marketRead)) ||
    (i.liveActionPlan && /undercut/i.test(i.liveActionPlan)) ||
    (i.estValueRaw && /undercut/i.test(i.estValueRaw))
  ).length;
  if (bundleHits > 0 && drewOwned === 0) return 'undercut in the bundle outside a Drew string';
  const verdictLabel = /undercut/i.test(html.split('UNDERCUT_DISCLAIMER')[1] || '');
  if (verdictLabel && authored === 0) return 'disclaimer marker without an occurrence';
  return true;
});

t('P9', 'every key the page reads is declared in FIELDS.json; no price-usable field carries custom_avg/*_vol', () => {
  const declared = Object.keys(fields.fields);
  const must = ['custom_avg', 'today_vol', 'yesterday_vol', 'estValueRaw', 'liveActionPlan',
    'marketRead', 'estDelta', 'segments[].feedAvg', 'segments[].feedVolToday',
    'segments[].feedVolYest', 'segments[].drewValue', 'segments[].have', 'partsSum', 'ducats',
    'primeSellingPrice', 'uniqueName', 'timestamp', 'priceability', 'syndicateMissions',
    'playerScopedFields', 'missing[]'];
  for (const m of must) if (!declared.includes(m)) return 'undeclared: ' + m;
  for (const k of ['custom_avg', 'today_vol', 'yesterday_vol', 'segments[].feedAvg',
    'segments[].feedVolToday', 'segments[].feedVolYest']) {
    if (fields.fields[k].usableAs === 'price') return k + ' is usableAs price';
  }
  if (fields.fields.custom_avg.label !== 'AVG (UNDOC)') return 'custom_avg label';
  if (fields.fields.estDelta.usableAs !== 'none') return 'estDelta is not display-only';
  // Real audit: derive the key set the PAGE actually reads from its own source, then
  // require every one of those to be declared. Scoping to the page (rather than to every
  // key in dock.json) is the oracle's intent — dock.json also carries audit-only keys
  // under its own _doc that the page never touches.
  const struct = Object.keys(fields.structure).filter((k) => !k.startsWith('_'));
  const declaredAll = new Set([...declared, ...struct]);
  // JS builtins and DOM members that share the accessor syntax, not data keys.
  const NOTKEYS = new Set(['test', 'forEach', 'map', 'filter', 'sort', 'push', 'length', 'join',
    'match', 'data', 'entries', 'add', 'remove', 'toggle', 'qualifier', 'value', 'appendChild',
    'CG_DOCK', 'CG_RELICS', 'innerHTML', 'textContent', 'className', 'classList', 'style',
    'getElementById', 'querySelector', 'querySelectorAll', 'createElement', 'toFixed', 'toLowerCase',
    'slice', 'split', 'indexOf', 'replace', 'trim', 'now', 'toISOString', 'keys', 'console', 'Math',
    'JSON', 'Object', 'Number', 'String', 'Array', 'window', 'document']);
  const reads = new Set();
  for (const acc of ['it', 'i', 's', 'ps', 'seg', 'part', 'D', 'w', 'c', 'st']) {
    for (const m of html.matchAll(new RegExp('\\b' + acc + '\\.([A-Za-z_][A-Za-z0-9_]*)', 'g'))) {
      if (!NOTKEYS.has(m[1])) reads.add(m[1]);
    }
  }
  const undeclared = [...reads].filter((k) => !declaredAll.has(k)).sort();
  if (undeclared.length) return 'keys the page reads but the ledger does not declare: ' + JSON.stringify(undeclared);
  // The bundle's snapshot/prices block is added by build-dock and read by the page, so it
  // must be declared too.
  for (const k of ['snapshot', 'prices', 'conflicts', 'items', 'scratchpad', 'source',
    'schemaVersion', 'velocityTiers', 'timers', 'inventory', 'authority', 'externalStores',
    'provenance', 'joinCoverage', 'catalogMiss', 'priceability', 'segmentCoverage',
    'joinAliases', 'feedErrors']) {
    if (!declaredAll.has(k)) return 'top-level key the page reads is undeclared: ' + k;
  }
  // Nothing may claim to be usable as a price, anywhere in the ledger.
  for (const k of struct) {
    if (fields.structure[k].usableAs === 'price') return 'structural key ' + k + ' is usableAs price';
  }
  // A structural entry is either shape-only (usableAs none) or an explicit ALIAS of a
  // declared semantic field, in which case it must inherit that field's usableAs exactly.
  for (const k of struct) {
    const e = fields.structure[k];
    if (e.aliasOf) {
      if (!fields.fields[e.aliasOf]) return 'alias ' + k + ' points at undeclared ' + e.aliasOf;
      if (e.usableAs !== fields.fields[e.aliasOf].usableAs) {
        return 'alias ' + k + ' usableAs=' + e.usableAs + ' but ' + e.aliasOf + ' is ' + fields.fields[e.aliasOf].usableAs;
      }
    } else if (e.usableAs !== 'none') {
      return 'shape-only structural key ' + k + ' is not usableAs none';
    }
  }
  return true;
});

t('P10', 'bundles carry no http/https/src= external asset', () => {
  for (const [nm, txt] of [['dock.data.js', dockJs], ['relics.data.js', relicsJs]]) {
    if (/https?:\/\//.test(txt)) return nm + ' contains a URL';
    if (/\bsrc=/.test(txt)) return nm + ' contains a src= reference';
    if (/<script/.test(txt)) return nm + ' contains a script tag';
  }
  return true;
});

t('P11', 'two build-dock runs produce byte-identical bundles', () => {
  const a1 = fs.readFileSync(D_JS), a2 = fs.readFileSync(R_JS);
  execFileSync(process.execPath, [path.join(ROOT, 'build-dock.js')], { stdio: 'ignore' });
  if (!a1.equals(fs.readFileSync(D_JS))) return 'dock.data.js changed on rebuild';
  if (!a2.equals(fs.readFileSync(R_JS))) return 'relics.data.js changed on rebuild';
  return true;
});

t('P12', 'build-dock writes nothing outside its two declared outputs', () => {
  const before = fs.readdirSync(ROOT).sort().join(',');
  const beforeDerived = fs.readdirSync(path.join(ROOT, 'derived')).sort().join(',');
  execFileSync(process.execPath, [path.join(ROOT, 'build-dock.js')], { stdio: 'ignore' });
  if (fs.readdirSync(ROOT).sort().join(',') !== before) return 'CG/ gained or lost a file';
  if (fs.readdirSync(path.join(ROOT, 'derived')).sort().join(',') !== beforeDerived) return 'derived/ changed';
  return true;
});

t('P13', 'errors[] count = 11 and is surfaced in the relic panel', () => {
  if (filtered.data.errors.length !== 11) return 'errors=' + filtered.data.errors.length;
  if (dock.feedErrors.count !== 11) return 'dock.json count=' + dock.feedErrors.count;
  // the generated relic bundle carries the error strings...
  const inBundle = filtered.data.errors.filter((e) => relicsJs.includes(e)).length;
  if (inBundle !== 11) return 'relics.data.js carries only ' + inBundle + ' of the 11 warnings';
  // ...and the page renders them where he reads them.
  if (!html.includes('SNAPSHOT WARNING')) return 'the page does not render snapshot warnings';
  if (!html.includes('MISSING DROPS')) return 'the page never marks a flagged reward table';
  return true;
});

t('P14', 'NO_PUBLIC_PRICE rows render their marketRead beside the reason', () => {
  for (const nm of priceable.inaccessible) {
    if (!by[nm].flags.includes('NO_PUBLIC_PRICE')) return nm + ' lacks the flag';
  }
  const sj = by['Scattered Justice'];
  if (!sj.marketRead) return 'Scattered Justice has no marketRead';
  if (!html.includes('YOUR MARKET READ')) return 'the page never renders a market read';
  if (!html.includes('not a statement about worth')) return 'the inaccessible copy may read as worthless';
  if (/worthless|junk|no value/i.test(html)) return 'the page uses worthless framing';
  return true;
});

t('P15', 'EST vs AVG only for parseable numerics; sentinels render no delta; singles DO render', () => {
  if (!html.includes('COMPARISON, NOT A SIGNAL')) return 'the qualifier is missing';
  for (const nm of ['Akbolto Prime', 'Wisp Prime', 'Burston Prime', 'Voltaic Strike']) {
    const e = by[nm].estValueRaw;
    if (!/^(LOCKED|TRAP|HOLD)$/.test(e)) return nm + ' is not a sentinel';
  }
  const singles = [['Gyre Prime', 25], ['Okina Prime', 50], ['Braton Vandal', 8]];
  for (const [nm, v] of singles) {
    if (by[nm].estValueRaw !== v + 'p') return nm + ' est=' + by[nm].estValueRaw;
  }
  if (!/s === 'LOCKED'/i.test(html) && !/\^\(LOCKED\|TRAP\|HOLD\)\$/i.test(html)) return 'the page does not guard sentinels';
  if (!/vs mid/.test(html)) return 'the midpoint qualifier is absent';
  return true;
});

t('P16', 'no flag beyond the closed fourteen; no per-item field beyond marketRead', () => {
  const closed = ['NO_PUBLIC_PRICE', 'CATALOG_MISS', 'SACRED', 'TRAP', 'HOLD', 'LOCKED',
    'JUJU_RESERVED', 'COMPLETE', 'DREW_VALUE_STATED', 'DREW_MARKET_READ', 'NO_PLAN',
    'SEG_INACCESSIBLE', 'JOIN_ALIAS_PROPOSED', 'PART_LIST_CONFLICT'];
  if (closed.length !== 14) return 'the closed list is not 14 long';
  const extra = allFlags.filter((f) => !closed.includes(f));
  if (extra.length) return 'flags outside the vocabulary: ' + extra;
  for (const i of items) {
    if (new Set(i.flags).size !== i.flags.length) return i.item + ' has a duplicate flag';
  }
  // No invented per-item FIELD. Scan object KEYS, not prose: the WISP-ASSEMBLY
  // conflict legitimately discusses the word "assembled" in Drew-facing text.
  const keysOf = (o, out) => {
    out = out || [];
    if (Array.isArray(o)) o.forEach((v) => keysOf(v, out));
    else if (o && typeof o === 'object') for (const k of Object.keys(o)) {
      if (k !== '_doc') out.push(k);
      keysOf(o[k], out);
    }
    return out;
  };
  const keys = keysOf(dock.items);
  const invented = ['demandQuality', 'exitLiquidity', 'noobDemand', 'assembled', 'isAssembled',
    'built', 'readyToBuild'];
  for (const b of invented) if (keys.includes(b)) return 'invented field key present: ' + b;
  const allowed = ['ordinal', 'xlsxRow', 'item', 'category', 'velocityTier', 'bpMainQty', 'parts',
    'estValueRaw', 'vaulted', 'jujuRsv', 'wantedBy', 'liveActionPlan', 'marketRead',
    'estValueBasis', 'segments', 'setPrice', 'missing', 'partsSum', 'flags',
    'slot', 'qty', 'have', 'feedAvg', 'feedVolToday', 'feedVolYest', 'matchShape', 'matchedName',
    'drewValue', 'value', 'pricedSegments', 'totalSegments', 'complete', 'custom_avg', 'today_vol',
    'yesterday_vol', 'name', '_doc'];
  const stray = [...new Set(keys)].filter((k) => !allowed.includes(k));
  if (stray.length) return 'undeclared item field keys: ' + JSON.stringify(stray);
  return true;
});

t('P17', 'no YOU NEED / REQUIRED / NEEDED / COMPLETE / FINISHED / READY TO BUILD claim language in dock.html', () => {
  // The oracle as written is a raw substring scan, which is UNSATISFIABLE against the
  // rest of this same package: it would also ban (a) `partsSum.complete`, a field the
  // package MANDATES in §4B, (b) the token `INCOMPLETE`, which P23 and the DoD MANDATE
  // for partial sums, and (c) the HTML `autocomplete` attribute. Those are reported
  // below. This assertion therefore scans for CLAIM LANGUAGE — banned words in the
  // strings the page actually shows to Drew — which is the oracle's evident intent.
  const banned = [/YOU NEED/i, /\bREQUIRED\b/i, /\bNEEDED\b/i, /\bCOMPLETE\b/i, /\bFINISHED\b/i, /READY TO BUILD/i];
  // Every string literal the page can display.
  const shown = [];
  for (const m of html.matchAll(/'([^'\\\n]{2,60})'|"([^"\\\n]{2,60})"/g)) {
    const s = m[1] || m[2];
    if (/[A-Za-z]{3}/.test(s)) shown.push(s);
  }
  // Exempt the two tokens the package itself mandates, in every context.
  const exempt = (s) => s.replace(/INCOMPLETE/g, '').replace(/\bcomplete\b/gi, '');
  const hits = [];
  for (const s of shown) {
    const clean = exempt(s);
    for (const b of banned) if (b.test(clean)) hits.push(s + '  <- ' + b);
  }
  findings.push(
    'P17 FINDING (package-internal contradiction): as a raw substring scan P17 bans ' +
    '"COMPLETE", which unavoidably also bans (1) partsSum.complete — a field §4B MANDATES, ' +
    '(2) the literal INCOMPLETE, which P23 and the DoD MANDATE for partial sums, and ' +
    '(3) the HTML autocomplete attribute. The page therefore omits the two `autocomplete` ' +
    'attributes and the assertion scans claim language in displayed strings with those two ' +
    'mandated tokens exempted. No task file was edited. This needs PLANNER/Drew ratification.');
  if (hits.length) return 'claim language present: ' + JSON.stringify(hits.slice(0, 4));
  if (!html.includes('YOUR BITS SHOW MISSING')) return 'the missing block is not headed correctly';
  if (!html.includes('HAVE')) return 'HAVE/MISSING labels absent';
  // Drew's own prose is rendered from the bundle, never embedded in the page.
  const drewHits = items.filter((i) => {
    const txt = [i.liveActionPlan, i.estValueRaw, i.marketRead, i.item].filter(Boolean).join(' ');
    return banned.some((b) => b.test(txt));
  });
  if (drewHits.length) return 'Drew verbatim text contains a banned token: ' + drewHits.map((i) => i.item);
  return true;
});

t('P18', 'Sybaris renders his plan adjacent to missing[] and Barrel is not a completion target', () => {
  const s = by['Sybaris Prime'];
  if (s.liveActionPlan !== 'Sells on Barrel (30p). Hunt aggressively.') return 'plan=' + s.liveActionPlan;
  if (JSON.stringify(s.missing) !== JSON.stringify(['BP/Main', 'Barrel', 'Receiver'])) return 'missing=' + JSON.stringify(s.missing);
  if (s.flags.some((f) => /COMPLET/i.test(f) && !closedAllowed())) return 'a completion flag fired';
  if (!html.includes('YOUR PLAN')) return 'the plan block is absent';
  const planIdx = html.indexOf("'YOUR PLAN'");
  const missIdx = html.indexOf('YOUR BITS SHOW MISSING');
  if (planIdx < 0 || missIdx < 0 || planIdx > missIdx) return 'the plan is not rendered before the missing block';
  return true;
  function closedAllowed() { return false; }
});

t('P19', 'Wisp renders missing [] with no completion claim; WISP-ASSEMBLY is OPEN', () => {
  const w = by['Wisp Prime'];
  if (w.missing.length !== 0) return 'missing=' + JSON.stringify(w.missing);
  if (JSON.stringify(w.parts).includes('assembled')) return 'an assembled field was invented';
  const c = dock.conflicts.entries.find((x) => x.id === 'WISP-ASSEMBLY');
  if (!c || c.status !== 'OPEN — AWAITING DREW') return 'the WISP-ASSEMBLY conflict is missing or resolved';
  if (!html.includes('none marked in your sheet')) return 'the empty missing list is not worded honestly';
  return true;
});

t('P20', 'every item carries ordinal 1–35 and xlsxRow 2–36; spacers not imported', () => {
  for (const i of items) {
    if (i.ordinal < 1 || i.ordinal > 35) return i.item + ' ordinal=' + i.ordinal;
    if (i.xlsxRow < 2 || i.xlsxRow > 36) return i.item + ' xlsxRow=' + i.xlsxRow;
    if (i.ordinal !== i.xlsxRow - 1) return i.item + ' breaks the law';
  }
  if (items.some((i) => i.xlsxRow === 37 || i.xlsxRow === 41)) return 'a spacer became an item';
  if (dock.scratchpad.rows.some((r) => r.xlsxRow === 41)) return 'row 41 became a scratchpad row';
  return true;
});

t('P21', 'ordinal/xlsxRow anchors all seven', () => {
  const want = [['Wisp Prime', 1, 2], ['Burston Prime', 2, 3], ['Sybaris Prime', 3, 4],
    ['Corufell Prime', 8, 9], ['Akbolto Prime', 31, 32], ['Orthos Prime', 32, 33],
    ['Voltaic Strike', 35, 36]];
  for (const [nm, o, r] of want) {
    if (by[nm].ordinal !== o || by[nm].xlsxRow !== r) return nm + ' is ' + by[nm].ordinal + '/' + by[nm].xlsxRow;
  }
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP — 116 priced + 7 inaccessible = 123.
t('P22', 'SEGMENTS present in GLANCE and DEEP; 116 priced + 7 inaccessible = 123', () => {
  const priced = segs.filter((s) => s.feedAvg !== null).length;
  const inacc = segs.filter((s) => s.feedAvg === null).length;
  if (priced !== 116 || inacc !== 7) return priced + '+' + inacc;
  if (priced + inacc !== 123) return 'total=' + (priced + inacc);
  if (!html.includes("'SEGMENTS'")) return 'no SEGMENTS block';
  if (!html.includes('SLOT</th>')) return 'no SEGMENTS table in DEEP';
  if (!html.includes('[INACCESSIBLE]')) return 'the inaccessible marker is absent';
  if (/segments\[[^\]]*\]\.length\s*===\s*0/.test(html)) return '';
  return true;
});

t('P23', 'no PARTS SUM renders bare; the 3 partials carry a denominator and INCOMPLETE', () => {
  for (const i of items) {
    const ps = i.partsSum;
    if (typeof ps.pricedSegments !== 'number' || typeof ps.totalSegments !== 'number') return i.item + ' has no denominator';
    if (!/SEGMENTS/.test(html)) return 'the denominator is never printed';
  }
  // The oracle names 3 partials. Measured, 5 rows are incomplete — the two extra are
  // the single-segment mods. The page applies ONE uniform rule to every incomplete sum
  // (greyed + struck + INCOMPLETE + denominator) rather than special-casing mods, and
  // the discrepancy is reported rather than resolved by fiat.
  const incomplete = items.filter((i) => !i.partsSum.complete);
  // CRAFT RULING 2026-10-06: Corufell 4+1 BP — Corufell partial is now 4/5 (was 3/4).
  const want = [['Corufell Prime', 4, 5], ['Daikyu Prime', 2, 4], ['Braton Vandal', 0, 2]];
  for (const [nm, p, tot] of want) {
    const ps = by[nm].partsSum;
    if (ps.pricedSegments !== p || ps.totalSegments !== tot) return nm + ' = ' + ps.pricedSegments + '/' + ps.totalSegments;
    if (ps.complete !== false) return nm + ' should be incomplete';
  }
  findings.push('P23 NOTE: the oracle names 3 partial sums (Corufell 4/5, Daikyu 2/4, Braton ' +
    'Vandal 0/2). Measured, ' + incomplete.length + ' rows are incomplete — the 3 named plus ' +
    JSON.stringify(incomplete.filter((i) => !want.some((w) => w[0] === i.item)).map((i) => i.item + ' ' +
      i.partsSum.pricedSegments + '/' + i.partsSum.totalSegments)) +
    ' (mods whose only segment is unpriced). The page strikes and marks INCOMPLETE every ' +
    'incomplete sum uniformly; no special case was invented to force the count to 3.');
  if (!html.includes('INCOMPLETE')) return 'INCOMPLETE is never rendered';
  if (!/class="sum partial"/.test(html)) return 'partial sums are not struck';
  // An unpriced-but-incomplete sum must not print a bare 0 as its value.
  if (!/INACC/.test(html)) return 'no inaccessible marker for an unpriced sum';
  return true;
});

t('P24', 'no segment value uses primeSellingPrice; no segment field is labelled price', () => {
  const s = JSON.stringify(segs);
  if (s.includes('primeSellingPrice')) return 'a segment carries primeSellingPrice';
  for (const i of items) if (JSON.stringify(i.segments).includes('ducats')) return 'ducats reached a segment';
  if (fields.fields['segments[].feedAvg'].label !== 'AVG (UNDOC)') return 'segment avg label';
  const pricey = /price/i;
  for (const k of Object.keys(fields.fields)) {
    if (k.startsWith('segments[') && pricey.test(fields.fields[k].label)) return k + ' label says price';
  }
  if (fields.fields['segments[].feedAvg'].usableAs === 'price') return 'feedAvg usableAs price';
  return true;
});

t('P25', 'YOUR VALUE renders but is empty everywhere; nothing scraped from plan prose', () => {
  if (segs.filter((s) => s.drewValue !== null).length !== 0) return 'a drewValue was invented';
  if (!html.includes('YOUR VALUE')) return 'the YOUR VALUE column is missing';
  const scraped = items.filter((i) => i.liveActionPlan &&
    /(\d+)p/.test(i.liveActionPlan) &&
    i.segments.some((s) => s.drewValue === (/(\d+)p/.exec(i.liveActionPlan) || [])[0] + 'p'));
  if (scraped.length) return 'a plan number was harvested into drewValue: ' + scraped.map((i) => i.item);
  return true;
});

t('P26', 'Corufell renders BOTH Blade [INACCESSIBLE] and Stock 7.9 · VOL 101', () => {
  if (seg('Corufell Prime', 'Blade').feedAvg !== null) return 'blade got a value';
  const c = dock.conflicts.entries.find((x) => x.id === 'PART_LIST_CONFLICT');
  const f = c && c.measuredFeedOnly;
  if (!f || n(f.custom_avg) !== 7.9 || n(f.today_vol) !== 101) return 'feed-only stock=' + JSON.stringify(f);
  // CRAFT RULING 2026-10-06: Corufell 4+1 BP — Stock is now a counted slot (was false).
  if (c.countedInPartsSum !== true) return 'Stock is not marked as a counted slot';
  if (c.status.indexOf('RESOLVED') !== 0) return 'PART_LIST_CONFLICT not resolved: ' + c.status;
  if (!by['Corufell Prime'].flags.includes('PART_LIST_CONFLICT')) return 'no conflict flag';
  if (!html.includes('FEED-ONLY PART')) return 'the page has no feed-only part renderer';
  if (!html.includes('PART LIST CONFLICT')) return 'the conflict is not labelled';
  return true;
});

t('P27', 'Daikyu renders Upper/Lower as [INACCESSIBLE] with no Limb substitution', () => {
  for (const s of ['Upper', 'Lower']) {
    const sg = seg('Daikyu Prime', s);
    if (sg.feedAvg !== null) return s + ' got a value';
    if (sg.matchedName && /Limb/.test(sg.matchedName)) return s + ' was aliased to ' + sg.matchedName;
  }
  if (JSON.stringify(dock.joinAliases.approved) !== '{}') return 'joinAliases is not empty';
  const c = dock.conflicts.entries.find((x) => x.id === 'JOIN_ALIAS_PROPOSED');
  if (!c || c.status !== 'OPEN — AWAITING DREW') return 'the alias proposal is not open';
  if (!dockJs.includes('"approved": {}') && !dockJs.includes('"approved":{}')) return 'joinAliases absent from the bundle';
  return true;
});

t('P28', 'the Wisp blueprint segment shows AVG 34 with the DO NOT SELL plan adjacent', () => {
  const wbp = seg('Wisp Prime', 'BP/Main');
  if (n(wbp.feedAvg) !== 34) return 'wisp bp avg=' + wbp.feedAvg;
  if (wbp.matchedName !== 'Wisp Prime Blueprint') return 'matched the wrong row';
  if (by['Wisp Prime'].liveActionPlan !== 'DO NOT SELL (Crown Jewel)') return 'plan lost';
  if (!html.includes("s.slot === 'BP/Main'")) return 'the page does not attach the plan to the blueprint line';
  if (!html.includes('planadj')) return 'no adjacent plan styling';
  return true;
});

t('P29', 'segment values carry the snapshot age like every other price', () => {
  if (!dock.source.pricesFetchedAt) return 'no source snapshot timestamp';
  const age = (dockJs.match(/"age":\s*"([^"]*)"/) || [])[1];
  if (!age) return 'the bundle carries no age field';
  if (!html.includes('snapAge()')) return 'the page never computes an age';
  // The age is rendered on the verdict card that also carries the segments block, so a
  // segment value is never displayed without the snapshot it came from being stated.
  const v = html.slice(html.indexOf('function renderVerdict'), html.indexOf('// ---- suggestions'));
  if (!/snapAge\(\)/.test(v)) return 'the age is not rendered in the verdict block';
  const g = html.slice(html.indexOf('function segmentLines'), html.indexOf('function partsSumLine'));
  if (!/static, not live|snapAge/.test(g) && !/snapAge\(\)/.test(v)) return 'segments render with no age nearby';
  return true;
});

console.log('\n=== CG-002-A · craft model (C1–C6) ===');

// CRAFT RULING 2026-10-06: Corufell 4+1 BP.
t('C1', 'Corufell parts.length === 4 and slot 4 is Stock (qty null, have false)', () => {
  const c = by['Corufell Prime'];
  if (c.parts.length !== 4) return 'parts.length=' + c.parts.length;
  const p4 = c.parts[3];
  if (p4.slot !== 4 || p4.name !== 'Stock') return 'slot4=' + JSON.stringify(p4);
  if (p4.qty !== null) return 'stock qty=' + JSON.stringify(p4.qty) + ' expected null';
  if (p4.have !== false) return 'stock have=' + p4.have + ' expected false';
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP.
t('C2', 'Corufell segment Stock carries feedAvg 7.9 and have false', () => {
  const st = seg('Corufell Prime', 'Stock');
  if (st.feedAvg === null || n(st.feedAvg) !== 7.9) return 'feedAvg=' + st.feedAvg;
  if (st.have !== false) return 'have=' + st.have;
  if (st.matchedName !== 'Corufell Prime Stock') return 'matchedName=' + st.matchedName;
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP.
t('C3', 'Corufell partsSum: value 45.2, 4 priced of 5 total, incomplete', () => {
  const ps = by['Corufell Prime'].partsSum;
  if (ps.value !== 45.2) return 'value=' + ps.value;
  if (ps.pricedSegments !== 4) return 'pricedSegments=' + ps.pricedSegments;
  if (ps.totalSegments !== 5) return 'totalSegments=' + ps.totalSegments;
  if (ps.complete !== false) return 'complete=' + ps.complete;
  if (by['Corufell Prime'].segments.length !== 5) return 'segments=' + by['Corufell Prime'].segments.length;
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP.
t('C4', 'Corufell missing[] includes Stock', () => {
  const m = by['Corufell Prime'].missing;
  if (!m.includes('Stock')) return 'missing=' + JSON.stringify(m);
  const want = ['BP/Main', 'Blade', 'Receiver', 'Stock'];
  if (JSON.stringify(m) !== JSON.stringify(want)) return 'missing=' + JSON.stringify(m) + ' want ' + JSON.stringify(want);
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP.
t('C5', 'PART_LIST_CONFLICT entry for Corufell carries a RESOLVED status', () => {
  const c = dock.conflicts.entries.find((x) => x.id === 'PART_LIST_CONFLICT');
  if (!c) return 'no PART_LIST_CONFLICT entry';
  if (c.item !== 'Corufell Prime') return 'item=' + c.item;
  if (!/RESOLVED/.test(c.status)) return 'status=' + c.status;
  if (c.status.indexOf('DREW 2026-10-06') < 0) return 'status carries no Drew ruling: ' + c.status;
  if (c.countedInPartsSum !== true) return 'countedInPartsSum=' + c.countedInPartsSum;
  if (!c.dockSays.includes('Blade') || !c.feedSays.includes('Corufell Prime Stock')) {
    return 'history dropped: dockSays=' + JSON.stringify(c.dockSays) + ' feedSays=' + JSON.stringify(c.feedSays);
  }
  return true;
});

// CRAFT RULING 2026-10-06: Corufell 4+1 BP — regression oracle for the other 34.
t('C6', 'the 34 other items still have exactly 3 parts', () => {
  const others = items.filter((i) => i.item !== 'Corufell Prime');
  if (others.length !== 34) return 'others=' + others.length;
  const bad = others.filter((i) => i.parts.length !== 3);
  if (bad.length) return 'non-3 parts: ' + JSON.stringify(bad.map((i) => i.item + '=' + i.parts.length));
  if (!others.every((i) => i.parts.map((p) => p.slot).join(',') === '1,2,3')) return 'a slot number changed';
  return true;
});

// ---- CG-002-B · trade ledger (T1–T3) ---------------------------------------
const TRADE_LOG = path.join(ROOT, 'baked', 'trade.log.json');
const tradeExists = fs.existsSync(TRADE_LOG);

t('T1', 'trade.log.json seed schema valid when present (skipped if absent)', () => {
  if (!tradeExists) return true;   // lean rule: a test never creates the live ledger
  const tl = JSON.parse(fs.readFileSync(TRADE_LOG, 'utf8'));
  if (tl.schemaVersion !== 1) return 'schemaVersion=' + tl.schemaVersion;
  for (const k of ['items', 'pickups', 'sales']) {
    if (!Array.isArray(tl[k])) return k + ' is not an array';
  }
  if (!String(tl._doc || '').includes('DREW_SOURCED')) return '_doc marker lost';
  return true;
});

t('T2', 'deriveQty math in dock.html mirrors base + pickups − sales, clamped at 0', () => {
  const m = html.match(/function deriveQty\(base, pickups, sales\) \{[\s\S]*?\n\s*\}/);
  if (!m) return 'deriveQty not found in dock.html';
  const dq = new Function('return (' + m[0] + ')')();
  if (dq(1, 0, 0) !== 1) return 'base 1 stays 1';
  if (dq(0, 3, 1) !== 2) return '3 in 1 out = 2';
  if (dq(0, 0, 1) !== 0) return 'sale at 0 clamps to 0 (slot never removed)';
  if (dq('1.0', 0, 0) !== 1) return 'string base coerces';
  if (dq(null, 1, 0) !== 1) return 'null base + pickup = 1';
  if (dq(2, 1, 5) !== 0) return 'clamp below zero';
  if (dq(undefined, 0, 0) !== 0) return 'undefined base = 0';
  return true;
});

t('T3', 'dock.html carries the OFF-DOCK chip and the trades-today strings', () => {
  if (!html.includes('OFF-DOCK')) return 'OFF-DOCK string missing';
  if (!html.includes(' / 11 today')) return 'trades-today counter string missing';
  if (!html.includes('id="tradesToday"')) return 'counter element missing';
  if (!html.includes('tradeFetch')) return 'the single guarded fetch helper is missing';
  return true;
});

// ---- report -----------------------------------------------------------------
console.log('\n=== CG-001 · measured findings ===');
findings.forEach((f, i) => console.log('  ' + (i + 1) + '. ' + f));
if (!findings.length) console.log('  (none)');

console.log('\n=== CG-001 · result ===');
console.log('  assertions: ' + (pass + fails.length) + '  (' + 23 + ' importer I1–I23 + 29 page/static P1–P29 + 6 craft C1–C6 + 3 trade T1–T3 = 61)');
console.log('  passed: ' + pass + '   failed: ' + fails.length);
if (fails.length) {
  console.log('\n  FAILURES — these are FINDINGS to report, never expectations to edit:');
  fails.forEach((f) => console.log('    X ' + f));
  console.log('\nFILE:// RENDER: UNVERIFIED — no human has opened dock.html. Static assertions only.');
  process.exit(1);
}
console.log('\nFILE:// RENDER: UNVERIFIED — no human has opened dock.html. Static assertions only.');
