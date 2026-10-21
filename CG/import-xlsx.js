#!/usr/bin/env node
'use strict';
/**
 * CG-001 — import-xlsx.js
 * The canonical importer. Built to task package CG/CG-001_TASK.md.
 *
 * READS  : Drew's xlsx (READ-ONLY, ruling H) + the two CG-000 market snapshots
 *          + CG/drew/CRAFT_OVERRIDES.json (Drew-sourced craft override table).
 * WRITES : CG/derived/dock.json and nothing else, ever.
 *
 * Zero dependencies. Node built-ins only. An xlsx is a ZIP of XML and Node has no
 * built-in unzip, so the ZIP central directory is parsed here and entries are
 * inflated with node:zlib inflateRawSync. Entries are read IN MEMORY — nothing is
 * extracted to disk.
 *
 * Determinism: no wall-clock value is written anywhere. `source.importedAt` is
 * derived from the xlsx's own mtime and every market timestamp comes from the
 * inputs' own `_probe.fetchedAt`, so an unchanged xlsx re-imports byte-identically
 * (oracle I13).
 *
 *   node CG/import-xlsx.js                                  # Drew's xlsx, default out
 *   node CG/import-xlsx.js "<path>" --out CG/derived/dock.json
 *   node CG/import-xlsx.js --force                          # overwrite + print the diff
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DREW_XLSX = 'C:\\Users\\Andrew\\Desktop\\WF10_04-TRADEDOCK.xlsx';
const PROBES = path.join(__dirname, 'baked', 'probes');
const PRICES_IN = path.join(PROBES, 'market__wfinfo-prices.json');
const FILTERED_IN = path.join(PROBES, 'market__wfinfo-filtered_items.json');
const DEFAULT_OUT = path.join(__dirname, 'derived', 'dock.json');
const CRAFT_OVERRIDES_IN = path.join(__dirname, 'drew', 'CRAFT_OVERRIDES.json');

// The only ZIP entries this importer reads. In memory, read-only (oracle I1).
const REQUIRED_ENTRIES = [
  'xl/sharedStrings.xml',
  'xl/worksheets/sheet1.xml',
  'xl/workbook.xml',
  'xl/tables/table1.xml',
  'xl/tables/table2.xml',
];

const NA = 'N/A';                              // sentinel: this set has no such part. NEVER nulled.
const SENTINELS = ['LOCKED', 'TRAP', 'HOLD']; // Drew's words, not numbers.
const CLOSED_FLAGS = [
  'NO_PUBLIC_PRICE', 'CATALOG_MISS', 'SACRED', 'TRAP', 'HOLD', 'LOCKED',
  'JUJU_RESERVED', 'COMPLETE', 'DREW_VALUE_STATED', 'DREW_MARKET_READ', 'NO_PLAN',
  'SEG_INACCESSIBLE', 'JOIN_ALIAS_PROPOSED', 'PART_LIST_CONFLICT',
];
const VELOCITY_TIERS = [
  '0 - SACRED', '1 - S-Tier', '2 - A-Tier', '3 - B-Tier',
  '4 - C-Tier', '5 - F-Tier', '6 - Market',
];

// Drew's verbatim free text (ruling L). Only Scattered Justice is seeded; the other
// 34 items carry null. Stored verbatim, never interpreted, never scored.
//
// This is an exact substring of Drew's own method sentence (quoted in the task
// package's METHOD BLOCK): "…and my own analysis based on volume, and market
// interactions like if it is frequently undercut, or if it is bought by noobs like
// my scattered justices tend to be." No CG-authored wording is mixed in, because
// marketRead is his prose and CG may only print it.
//
// FINDING for the receipt: whether this excerpt, or his whole method sentence,
// belongs on the Scattered Justice row is Drew's call — CG seeded only the excerpt
// that is unambiguously about that item.
const SEEDED_MARKET_READ = {
  'Scattered Justice':
    'my own analysis based on volume, and market interactions like if it is frequently undercut, or if it is bought by noobs like my scattered justices tend to be',
};

// ---------------------------------------------------------------------------
// ZIP: central directory + inflateRawSync. Nothing extracted to disk.
// ---------------------------------------------------------------------------

function zipEntries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('xlsx: not a ZIP (no end-of-central-directory record)');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('xlsx: corrupt central directory');
    out.push({
      name: buf.toString('utf8', p + 46, p + 46 + buf.readUInt16LE(p + 28)),
      method: buf.readUInt16LE(p + 10),
      compressedSize: buf.readUInt32LE(p + 20),
      localHeaderOffset: buf.readUInt32LE(p + 42),
    });
    p += 46 + buf.readUInt16LE(p + 28) + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return out;
}

function zipRead(buf, entries, name) {
  const e = entries.find((x) => x.name === name);
  if (!e) throw new Error('xlsx: required entry missing — ' + name);
  if (buf.readUInt32LE(e.localHeaderOffset) !== 0x04034b50) {
    throw new Error('xlsx: corrupt local header — ' + name);
  }
  const fnl = buf.readUInt16LE(e.localHeaderOffset + 26);
  const efl = buf.readUInt16LE(e.localHeaderOffset + 28);
  const start = e.localHeaderOffset + 30 + fnl + efl;
  const raw = buf.subarray(start, start + e.compressedSize);
  if (e.method === 0) return raw;
  if (e.method === 8) return zlib.inflateRawSync(raw);
  throw new Error('xlsx: unsupported compression method ' + e.method + ' — ' + name);
}

// ---------------------------------------------------------------------------
// Minimal XML readers. Every cell value is carried as the string the sheet holds.
// ---------------------------------------------------------------------------

function xmlDecode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&');
}

function sharedStrings(xml) {
  const out = [];
  for (const chunk of xml.split('<si>').slice(1)) {
    let text = '';
    for (const m of chunk.split('</si>')[0].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) text += m[1];
    out.push(xmlDecode(text));
  }
  return out;
}

function sheetGrid(xml, shared) {
  const grid = {};
  for (const rowChunk of xml.split('<row').slice(1)) {
    const r = Number((rowChunk.match(/r="(\d+)"/) || [])[1]);
    const cells = {};
    for (const cm of rowChunk.matchAll(/<c ([^>]*?)(\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cm[1];
      const col = (attrs.match(/r="([A-Z]+)\d+"/) || [])[1];
      const type = (attrs.match(/t="([^"]+)"/) || [])[1];
      const inner = cm[3] || '';
      const v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      const is = (inner.match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1];
      let val = null;
      if (type === 's') val = shared[Number(v)];
      else if (type === 'inlineStr') val = xmlDecode(is || '');
      else if (v !== undefined) val = xmlDecode(v);
      if (val !== null && val !== undefined) cells[col] = val;
    }
    grid[r] = cells;
  }
  return grid;
}

function tableDef(xml) {
  const ref = (xml.match(/ref="([A-Z]+\d+:[A-Z]+\d+)"/) || [])[1];
  const cols = [];
  for (const m of xml.matchAll(/<tableColumn [^>]*name="([^"]*)"/g)) cols.push(xmlDecode(m[1]));
  return { ref, cols };
}

// ---------------------------------------------------------------------------
// Segments (ruling N)
// ---------------------------------------------------------------------------

/**
 * The segment slots are read from Drew's cells:
 *   - `BP/Main Qty` is ALWAYS a segment. Its bit says possession, not existence,
 *     so a 0.0 blueprint is still a segment (Corufell's BP is priced 6.3).
 *   - each `Part N Name` that is not the `N/A` sentinel is a segment.
 * `N/A` rows never become segments — they are preserved verbatim in parts[] only.
 */
function segmentSlots(item) {
  const slots = ['BP/Main'];
  for (const p of item.parts) if (p.name && p.name !== NA) slots.push(p.name);
  return slots;
}

/**
 * Feed join for one segment (ruling N). The blueprint distinction is load-bearing:
 * `<Base> Blueprint` and `<Base> <Slot> Blueprint` are DIFFERENT feed rows and must
 * never collapse. Candidates are attempted in a fixed order; the first hit wins and
 * the shape that hit is recorded so the page can show it on hover.
 *
 * A part slot NEVER falls back to `<Base> Blueprint`: that row is the blueprint's
 * own value, and borrowing it would price a missing part with the BP's number —
 * exactly the collapse oracle I18 forbids. An unhit part stays [INACCESSIBLE].
 *
 * NO semantic aliasing is applied anywhere here. Daikyu's `Upper`/`Lower` stay
 * unpriced until Drew approves an alias into joinAliases (which is EMPTY in CG-001).
 */
function joinSegment(base, slot, feed) {
  const isBlueprint = slot === 'BP/Main';
  const attempts = isBlueprint
    ? [{ name: base + ' Blueprint', shape: 'BASE_BLUEPRINT' }]
    : [
        { name: base + ' ' + slot, shape: 'EXACT_SET_NAME' },
        { name: base + ' ' + slot + ' Blueprint', shape: 'SLOT_BLUEPRINT' },
      ];
  for (const a of attempts) {
    const row = feed.get(a.name.trim());   // whitespace-trimmed before join (oracle I22)
    if (row) return { row, matchShape: a.shape, matchedName: a.name.trim() };
  }
  return { row: null, matchShape: null, matchedName: null };
}

// ---------------------------------------------------------------------------
// Craft overrides (CG-002-A — Drew's word, 2026-10-06)
// ---------------------------------------------------------------------------

/**
 * Reads CG/drew/CRAFT_OVERRIDES.json — the DREW_SOURCED override table.
 * When it names an item, its `parts` list is authoritative for that item's SLOT
 * LIST; xlsx cells still supply the qty where a cell exists, and a part with no
 * cell carries qty null -> have false. Items it does not name keep the exact
 * CG-001 behavior: the 3 part cells read verbatim, `N/A` preserved.
 *
 * Overflow safety: 1..8 names, no duplicates, refuse loudly. 8 is a cap, not a
 * feature — no item uses it and none may be inferred into the table.
 */
function loadCraftOverrides() {
  if (!fs.existsSync(CRAFT_OVERRIDES_IN)) {
    throw new Error('craft overrides: ' + CRAFT_OVERRIDES_IN + ' is missing (Drew-sourced table required)');
  }
  const raw = JSON.parse(fs.readFileSync(CRAFT_OVERRIDES_IN, 'utf8'));
  const out = {};
  for (const key of Object.keys(raw)) {
    if (key === '_doc') continue;
    const entry = raw[key];
    const parts = entry && entry.parts;
    if (!Array.isArray(parts)) {
      throw new Error('craft override "' + key + '": parts must be a list of names');
    }
    if (parts.length < 1 || parts.length > 8) {
      throw new Error('craft override "' + key + '": parts must hold 1..8 names, got ' + parts.length);
    }
    const seen = new Set();
    for (const p of parts) {
      if (typeof p !== 'string' || !p.trim()) {
        throw new Error('craft override "' + key + '": every part must be a non-empty name');
      }
      if (seen.has(p)) throw new Error('craft override "' + key + '": duplicate part "' + p + '"');
      seen.add(p);
    }
    out[key] = entry;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Importer
// ---------------------------------------------------------------------------

function buildDock(input, out) {
  const src = fs.statSync(input);
  const buf = fs.readFileSync(input);
  const entries = zipEntries(buf);
  for (const need of REQUIRED_ENTRIES) {
    if (!entries.find((e) => e.name === need)) throw new Error('xlsx: missing required entry ' + need);
  }

  const shared = sharedStrings(zipRead(buf, entries, 'xl/sharedStrings.xml').toString('utf8'));
  const grid = sheetGrid(zipRead(buf, entries, 'xl/worksheets/sheet1.xml').toString('utf8'), shared);
  zipRead(buf, entries, 'xl/workbook.xml'); // read (I1): confirms the single-sheet workbook
  const tradeDock = tableDef(zipRead(buf, entries, 'xl/tables/table1.xml').toString('utf8'));
  const scratch = tableDef(zipRead(buf, entries, 'xl/tables/table2.xml').toString('utf8'));

  // CG-000 snapshots — the ONLY market inputs. Nothing is fetched.
  const pricesJson = JSON.parse(fs.readFileSync(PRICES_IN, 'utf8'));
  const filteredJson = JSON.parse(fs.readFileSync(FILTERED_IN, 'utf8'));
  const priceRows = Array.isArray(pricesJson.data) ? pricesJson.data : [];
  const feed = new Map(); // trimmed feed name -> row
  for (const r of priceRows) if (typeof r.name === 'string') feed.set(r.name.trim(), r);
  const eqmt = (filteredJson.data && filteredJson.data.eqmt) || {};
  const filteredErrors = (filteredJson.data && filteredJson.data.errors) || [];

  const items = [];
  const craftOverrides = loadCraftOverrides(); // CG-002-A — read once, before any row
  let ordinal = 0;
  for (let r = 2; r <= 36; r++) {              // TradeDock A1:N36 = header + rows 2..36
    const c = grid[r] || {};
    const name = c.A;
    if (!name) continue;                      // defensive skip of a blank spacer
    ordinal += 1;

    // Drew's 3 part cells, N/A preserved verbatim (CG-001 exact behavior).
    const xlsxParts = [
      { slot: 1, name: c.E === undefined ? null : c.E, qty: c.F === undefined ? null : c.F },
      { slot: 2, name: c.G === undefined ? null : c.G, qty: c.H === undefined ? null : c.H },
      { slot: 3, name: c.I === undefined ? null : c.I, qty: c.J === undefined ? null : c.J },
    ];
    // CG-002-A — when Drew's craft override table names this item, its parts list
    // is authoritative for the SLOT LIST. Slots 1..3 keep the xlsx cell qty (the
    // cells exist); an override part with no cell (Corufell's Stock) carries
    // qty null -> have false until Drew logs a pickup or updates the sheet.
    const override = craftOverrides[name];
    const parts = override
      ? override.parts.map((pname, i) => (i < xlsxParts.length
          ? { slot: i + 1, name: pname, qty: xlsxParts[i].qty }
          : { slot: i + 1, name: pname, qty: null }))
      : xlsxParts;

    const item = {
      _doc: 'One TradeDock row, carried verbatim. No cell coerced, no field invented.',
      ordinal,                                 // 1..35, header excluded
      xlsxRow: r,                              // 2..36; ordinal = xlsxRow - 1
      item: name,
      category: c.B === undefined ? null : c.B,
      velocityTier: c.C === undefined ? null : c.C,
      bpMainQty: c.D === undefined ? null : c.D,
      parts,                                   // 3 cells by default; N override slots when Drew says so
      estValueRaw: c.K === undefined ? null : c.K,   // Drew's exact string, never a number
      vaulted: c.L === undefined ? null : c.L,
      jujuRsv: c.M === undefined ? null : c.M,
      wantedBy: c.M === 'Yes' ? 'JULIA' : null,      // ruling G
      liveActionPlan: c.N === undefined ? null : c.N, // Drew's words, always rendered
      marketRead: SEEDED_MARKET_READ[name] || null,   // ruling L; null on 34 of 35
      estValueBasis: 'DREW_WORD',
    };

    // qty lookup per segment slot (BP/Main comes from column D)
    const qtyFor = (slot) => {
      if (slot === 'BP/Main') return item.bpMainQty;
      const p = item.parts.find((x) => x.name === slot);
      return p ? p.qty : null;
    };

    const slots = segmentSlots(item);
    item.segments = slots.map((slot) => {
      const { row, matchShape, matchedName } = joinSegment(name, slot, feed);
      return {
        _doc: 'One segment slot (ruling N). Values are CG-derived from the feed snapshot; never a price.',
        slot,
        qty: qtyFor(slot),
        // Possession is Drew's own bit: 1.0 means HAVE. Scattered Justice carries 2.0
        // for a mod quantity, which is also a HAVE; 0.0 is the only MISSING value.
        have: Number(qtyFor(slot)) >= 1,
        feedAvg: row ? row.custom_avg : null,        // FAIR-VALUE REFERENCE, still UNDOCUMENTED
        feedVolToday: row ? row.today_vol : null,    // trend only
        feedVolYest: row ? row.yesterday_vol : null, // trend only
        matchShape: matchShape,
        matchedName,
        drewValue: null,                             // null on ALL 123 slots in CG-002-A
      };
    });

    // parts[] gains `have` so the verbatim cells carry the possession bit too.
    for (const p of item.parts) {
      p.have = p.name !== null && Number(p.qty) >= 1;
    }

    // The set's own feed row, if the snapshot has one.
    const setRow = feed.get((name + ' Set').trim());
    item.setPrice = setRow
      ? {
          _doc: 'The set row from the feed snapshot. custom_avg is a FAIR-VALUE REFERENCE, not a price.',
          custom_avg: setRow.custom_avg,
          today_vol: setRow.today_vol,
          yesterday_vol: setRow.yesterday_vol,
          matchedName: (name + ' Set').trim(),
        }
      : null;

    // missing[] — arithmetic on Drew's own stated possession bits. Not invention.
    item.missing = item.segments.filter((s) => !s.have).map((s) => s.slot);

    // partsSum — the denominator is ALWAYS present, so a partial sum can never
    // present itself as a total (ruling N).
    const priced = item.segments.filter((s) => s.feedAvg !== null && s.feedAvg !== undefined);
    item.partsSum = {
      _doc: 'Derived sum of segment feedAvg. NEVER a bare number: the denominator is always carried.',
      value: priced.length
        ? Number(priced.reduce((a, s) => a + Number(s.feedAvg), 0).toFixed(1))
        : null,
      pricedSegments: priced.length,
      totalSegments: item.segments.length,
      complete: priced.length === item.segments.length,
    };

    // flags[] — closed vocabulary of exactly fourteen. Nothing outside it.
    const inCatalog = Object.prototype.hasOwnProperty.call(eqmt, name);
    const flags = [];
    if (!setRow) flags.push('NO_PUBLIC_PRICE');
    if (!inCatalog) flags.push('CATALOG_MISS');
    if (item.velocityTier === '0 - SACRED') flags.push('SACRED');
    if (item.estValueRaw === 'TRAP') flags.push('TRAP');
    if (item.estValueRaw === 'HOLD') flags.push('HOLD');
    if (item.estValueRaw === 'LOCKED') flags.push('LOCKED');
    if (item.wantedBy === 'JULIA') flags.push('JUJU_RESERVED');
    if (item.missing.length === 0) flags.push('COMPLETE');
    if (item.estValueRaw && !SENTINELS.includes(item.estValueRaw)) flags.push('DREW_VALUE_STATED');
    if (item.marketRead) flags.push('DREW_MARKET_READ');
    if (!item.liveActionPlan) flags.push('NO_PLAN');
    if (!item.partsSum.complete) flags.push('SEG_INACCESSIBLE');
    if (name === 'Daikyu Prime') flags.push('JOIN_ALIAS_PROPOSED');
    if (name === 'Corufell Prime') flags.push('PART_LIST_CONFLICT');
    item.flags = CLOSED_FLAGS.filter((f) => flags.includes(f));

    items.push(item);
  }

  // --- join coverage: the CANONICAL feed->catalog join (oracle P4) -------------
  // The feed names a part with a trailing " Blueprint" that the catalog stores
  // without it (only the price feed appends it), so both sides are compared in a
  // canonical, blueprint-stripped form. Every unjoined row is classed and NONE is
  // dropped: an unjoined row is a fact about the feed, not an error to hide.
  const catalogItems = new Set(Object.keys(eqmt));
  const catalogParts = new Set();
  const catalogPartsCanon = new Set();
  for (const v of Object.values(eqmt)) {
    for (const p of Object.keys(v.parts || {})) {
      catalogParts.add(p);
      catalogPartsCanon.add(p.replace(/ Blueprint$/, ''));
    }
  }
  const ignoredNames = new Set(Object.keys((filteredJson.data && filteredJson.data.ignored_items) || {}));

  const unjoined = [];
  const joinedByClass = {};
  const tally = (c) => { joinedByClass[c] = (joinedByClass[c] || 0) + 1; };
  for (const r of priceRows) {
    const n = typeof r.name === 'string' ? r.name.trim() : '';
    if (!n) { unjoined.push({ name: n, class: 'UNNAMED_ROW' }); continue; }
    const noBp = n.replace(/ Blueprint$/, '');
    if (catalogParts.has(n)) { tally('JOINED_CATALOG_PART_EXACT'); continue; }
    if (catalogPartsCanon.has(noBp)) { tally('JOINED_CATALOG_PART_CANON'); continue; }
    if (/ Set$/.test(n)) {
      if (catalogItems.has(n.replace(/ Set$/, ''))) { tally('JOINED_CATALOG_SET'); continue; }
      unjoined.push({ name: n, class: 'CATALOG_MISS_SET' });
      continue;
    }
    if (ignoredNames.has(n) || ignoredNames.has(noBp)) { tally('JOINED_IGNORED_BY_FEED'); continue; }
    // Everything left belongs to an item the catalog does not carry.
    const base = / Prime$/.test(noBp) ? noBp : noBp.replace(/ [A-Z][A-Za-z]*$/, '');
    if (catalogItems.has(base)) { tally('JOINED_CATALOG_ITEM'); continue; }
    unjoined.push({
      name: n,
      class: / Prime$/.test(noBp) ? 'CATALOG_MISS_ITEM' : 'CATALOG_MISS_PART',
      catalogMissFor: / Prime$/.test(noBp) ? noBp : base,
    });
  }
  const unjoinedByClass = {};
  for (const u of unjoined) unjoinedByClass[u.class] = (unjoinedByClass[u.class] || 0) + 1;
  const canonicalJoined = Object.keys(joinedByClass).reduce((a, k) => a + joinedByClass[k], 0);

  // --- scratchpad rows 39..40 ---
  const scratchRows = [];
  for (let r = 39; r <= 40; r++) {
    const c = grid[r] || {};
    scratchRows.push({
      _doc: 'Scratchpad row. SESSION ONLY in the browser; never written back to the xlsx.',
      xlsxRow: r,
      unknownDropCheck: c.A === undefined ? null : c.A,
      ducatTier: c.B === undefined ? null : c.B,
      currentPlatFloor: c.C === undefined ? null : c.C,
      verdict: c.D === undefined ? null : c.D,
    });
  }

  // --- measured conflict payloads (measured from the feed, not hardcoded) ---
  const corufellStock = feed.get('Corufell Prime Stock');
  const daikyuUpperLimb = feed.get('Daikyu Prime Upper Limb');
  const daikyuLowerLimb = feed.get('Daikyu Prime Lower Limb');

  const conflicts = [
    {
      _doc: 'Open conflict. Carried forward unresolved. CG never picks a date.',
      id: 'VOLT-RESEARCH-DATE',
      status: 'OPEN — AWAITING DREW',
      observed: 'intake: "Wednesday"',
      reported: 'Drew: "3 days from today = 2026-10-08"',
      gap: 'two sources, no reconciliation; no Volt timer is seeded (ruling E)',
    },
    {
      _doc: 'Open conflict. The sheet cannot express foundry state. No assembled field was invented.',
      id: 'WISP-ASSEMBLY',
      status: 'OPEN — AWAITING DREW',
      observed: 'Wisp Prime: BP+Chassis+Neuroptics+Systems all 1.0 — the only complete row',
      reported: 'Drew: final Wisp piece still not crafted',
      gap: "no assembly/foundry state exists; `have` is possession only",
      question: 'Does CG need an ASSEMBLED state distinct from possession? If so it is a NEW LEAF.',
    },
    {
      _doc: 'Open conflict. A proposal, not an alias. joinAliases stays empty until Drew approves.',
      id: 'JOIN_ALIAS_PROPOSED',
      status: 'OPEN — AWAITING DREW',
      item: 'Daikyu Prime',
      dockSays: ['Lower', 'Upper'],
      feedSays: ['Daikyu Prime Lower Limb', 'Daikyu Prime Upper Limb'],
      measuredInFeed: {
        'Daikyu Prime Lower Limb': daikyuLowerLimb ? daikyuLowerLimb.custom_avg : null,
        'Daikyu Prime Upper Limb': daikyuUpperLimb ? daikyuUpperLimb.custom_avg : null,
      },
      gap: 'no semantic alias without Drew approval, so Lower/Upper stay [INACCESSIBLE]',
    },
    {
      _doc: 'Conflict, RESOLVED by Drew; history retained, never deleted. Stock is now a counted slot in partsSum.',
      id: 'PART_LIST_CONFLICT',
      status: 'RESOLVED — DREW 2026-10-06 (4+1 BP)',
      note: 'Stock is now a counted slot: the 4th part of Corufell Prime\'s 4+1 BP, carried by CG/drew/CRAFT_OVERRIDES.json and counted in partsSum.',
      item: 'Corufell Prime',
      dockSays: ['Blade'],
      feedSays: ['Corufell Prime Stock'],
      measuredFeedOnly: corufellStock
        ? {
            name: 'Corufell Prime Stock',
            custom_avg: corufellStock.custom_avg,
            today_vol: corufellStock.today_vol,
            yesterday_vol: corufellStock.yesterday_vol,
          }
        : null,
      countedInPartsSum: true,
      gap: 'was: the feed had no Blade row and the dock had no Stock row — both sides were shown. Resolved 2026-10-06: Stock is a dock slot now; Blade still has no feed row and stays [INACCESSIBLE].',
    },
  ];

  const priceable = items.filter((i) => i.setPrice).length;
  const totalSegments = items.reduce((a, i) => a + i.segments.length, 0);
  const pricedSegments = items.reduce((a, i) => a + i.partsSum.pricedSegments, 0);

  return {
    _doc: "CG-001 canonical dock master. Drew's TradeDock, imported verbatim. Edit here (or via the CG seat), then run node CG/build-dock.js.",
    schemaVersion: 'cg-001',
    source: {
      _doc: 'Provenance. importedAt is the xlsx mtime, NOT wall-clock, so re-imports are byte-identical.',
      xlsxPath: input,
      xlsxSize: src.size,
      xlsxMtime: src.mtime.toISOString(),
      importedAt: src.mtime.toISOString(),
      pricesFetchedAt: pricesJson._probe ? pricesJson._probe.fetchedAt : null,
      filteredFetchedAt: filteredJson._probe ? filteredJson._probe.fetchedAt : null,
      sharedStrings: shared.length,
      tradeDockRef: tradeDock.ref,
      scratchpadRef: scratch.ref,
    },
    velocityTiers: {
      _doc: 'The observed vocabulary, verbatim. No invented tier.',
      values: VELOCITY_TIERS,
    },
    items,
    scratchpad: {
      _doc: "Drew's four Scratchpad columns. Live-editable in the browser for this session only; never saved back to the xlsx.",
      headers: scratch.cols,
      rows: scratchRows,
    },
    conflicts: {
      _doc: 'Conflict registry. Three are OPEN; PART_LIST_CONFLICT was RESOLVED by Drew 2026-10-06 (Corufell 4+1 BP). History is retained, never deleted.',
      entries: conflicts,
    },
    timers: {
      _doc: 'EMPTY by ruling E. Out of scope in CG-001; no Volt timer is seeded.',
      entries: [],
    },
    inventory: {
      _doc: 'Player-scoped inventory is INACCESSIBLE from every automated source (CG-000 §6). Nothing here is real.',
      state: '[INACCESSIBLE]',
    },
    authority: {
      _doc: "Precedence when sources disagree. Drew's word outranks any CG derivation.",
      order: [
        'liveActionPlan (DREW)',
        'marketRead (DREW)',
        'estValueRaw (DREW)',
        'feed custom_avg (FAIR-VALUE REFERENCE)',
        'CG NEVER outranks Drew',
      ],
    },
    externalStores: {
      _doc: "Google Sheets dock REJECTED: ruling F is overturned. Write authority is Drew's; CG may never acquire it.",
      googleSheetsDock: { status: 'REJECTED', why: 'ruling F overturned; dock.json is the single canonical master' },
      writePolicy: 'FORBIDDEN',
    },
    provenance: {
      _doc: 'How this file came to be.',
      source: 'DREW_XLSX_IMPORT',
      importer: 'CG/import-xlsx.js',
    },
    joinCoverage: {
      _doc: 'Canonical feed->catalog join against the 758-row snapshot. Every unjoined row is classed; nothing is dropped.',
      priceRows: priceRows.length,
      joined: canonicalJoined,
      unjoinedCount: unjoined.length,
      joinedByClass,
      unjoinedByClass,
      unjoined,
    },
    catalogMiss: {
      _doc: 'Dock items absent from the eqmt catalog. Their price rows still render.',
      items: items.filter((i) => i.flags.includes('CATALOG_MISS')).map((i) => i.item),
    },
    priceability: {
      _doc: 'Dock targets with a public Set row in the snapshot. NO_PUBLIC_PRICE is not "no value".',
      priceable,
      total: items.length,
      inaccessible: items.filter((i) => !i.setPrice).map((i) => i.item),
    },
    segmentCoverage: {
      _doc: 'Ruling N per-segment coverage across every slot on the dock.',
      pricedSegments,
      totalSegments,
      pct: Number(((pricedSegments / totalSegments) * 100).toFixed(1)),
    },
    joinAliases: {
      _doc: 'Explicitly approved semantic aliases. EMPTY in CG-001 — Daikyu Upper->Upper Limb is a PROPOSAL, not an alias.',
      approved: {},
    },
    feedErrors: {
      _doc: 'The snapshot\'s own errors[], surfaced prominently in the relic panel (ruling K).',
      count: filteredErrors.length,
      entries: filteredErrors,
    },
  };
}

function main(argv) {
  let input = DREW_XLSX;
  let out = DEFAULT_OUT;
  let force = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') out = path.resolve(argv[++i] || '');
    else if (argv[i] === '--force') force = true;
    else if (!argv[i].startsWith('--')) input = path.resolve(argv[i]);
  }

  console.log('input : ' + input);
  console.log('output: ' + out);

  const dock = buildDock(input, out);
  const json = JSON.stringify(dock, null, 2) + '\n';

  // Re-import guard. A re-import that reproduces the canonical master byte for byte is
  // a no-op and must exit 0 (Unit 7 runs the bare command). Only a DIVERGENT file is
  // protected: dock.json is the canonical master, so replacing it needs --force.
  if (fs.existsSync(out)) {
    const prior = fs.readFileSync(out, 'utf8');
    if (prior === json) {
      console.log('dock.json unchanged (byte-identical re-import) — nothing written');
      report(dock, out, true);
      return;
    }
    console.log('--- dock.json divergence vs existing file ---');
    const oldObj = JSON.parse(prior);
    const changed = [];
    for (const k of new Set([...Object.keys(oldObj), ...Object.keys(dock)])) {
      if (JSON.stringify(oldObj[k]) !== JSON.stringify(dock[k])) { changed.push(k); console.log('  CHANGED: ' + k); }
    }
    console.log('--- end divergence ---');
    if (!force) {
      console.error('REFUSING to overwrite the divergent canonical master ' + out);
      console.error('dock.json is the canonical master. Re-run with --force to replace it.');
      process.exit(2);
    }
    console.log('--force: replacing the divergent master.');
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, json, 'utf8');
  report(dock, out, false);
}

function report(dock, out, unchanged) {
  const jc = dock.joinCoverage;
  console.log((unchanged ? 'verified ' : 'wrote ') + out);
  console.log(
    'items=' + dock.items.length +
    '  segments=' + dock.segmentCoverage.pricedSegments + '/' + dock.segmentCoverage.totalSegments +
    ' (' + dock.segmentCoverage.pct + '%)' +
    '  priceable=' + dock.priceability.priceable + '/' + dock.items.length +
    '  join=' + jc.joined + '/' + jc.priceRows +
    '  unjoined=' + jc.unjoinedCount +
    '  conflicts=' + dock.conflicts.entries.length +
    '  errors=' + dock.feedErrors.count
  );
  if (corufellReport(dock)) console.log('corufell: ' + corufellReport(dock));
}

function corufellReport(dock) {
  const c = dock.items.find((i) => i.item === 'Corufell Prime');
  if (!c) return null;
  const blade = c.segments.find((s) => s.slot === 'Blade');
  const stock = c.segments.find((s) => s.slot === 'Stock');
  return 'Blade=' + (blade.feedAvg === null ? '[INACCESSIBLE]' : blade.feedAvg) +
    '  Stock=' + (stock && stock.feedAvg !== null ? stock.feedAvg + (stock.have ? ' HAVE' : ' MISSING') : '[INACCESSIBLE]');
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error('import-xlsx FAILED: ' + err.message);
    process.exit(1);
  }
}

module.exports = { buildDock, zipEntries, zipRead, CLOSED_FLAGS, VELOCITY_TIERS };