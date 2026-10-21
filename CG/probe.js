'use strict';
/**
 * CG-000 — WORLDSTATE RECON PROBE  (v2, surface-corrected)
 * Leaf: CG-000 · Executor: DOER (1-Stone) · Date: 2026-10-05
 *
 * CONTRACT: CG-000_TASK.md §4 (4A resolution, 4B Q1-Q5, 4C orderability,
 *          4D worldstate baseline, 4E discipline).
 *
 * WHY v2: run 1 executed the §4C endpoint list verbatim and got 17/17 HTTP 404.
 * That is a ROUTER-level 404 ("Cannot GET /items/<X>/orders"), not a statement
 * about the items. Reporting "NOT-ORDERABLE" off a dead route would be a false
 * inference, so v2 first establishes the live surface from the API's own
 * OpenAPI spec (/openapi.json) and then derives each verdict from routes that
 * actually answer. CONTROL PROBES are used throughout to separate
 * "this data is absent" from "this endpoint is closed to everyone".
 *
 * HARD CONSTRAINTS:
 *   - Node built-ins only (global fetch, node:fs, node:path). No package.json,
 *     no node_modules, no npm install.
 *   - Every probe writes a raw JSON snapshot to CG/baked/probes/.
 *   - Sequential, polite spacing. HTTP 429 is recorded as a finding, then
 *     backed off. Never hammered.
 *   - ZERO INVENTED FIELDS. A capability is VERIFIED only when a literal field
 *     path was observed in a real payload. Absence is INACCESSIBLE.
 *
 * EXIT: 0 = full run, every probe recorded a verdict, snapshots written.
 *       1 = run produced nothing reportable (no directory, unhandled failure,
 *           or zero verdicts).
 *       process.exit() is mandatory: Node's global fetch leaves the socket pool
 *       open and the loop will not drain on its own (observed in UNIT 0).
 */

const fs = require('node:fs');
const path = require('node:path');

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const ACCOUNT_ID = '11121350';
const PROBE_DIR = path.join(__dirname, 'baked', 'probes');
const UA = 'CG-000-recon/2.0 (read-only public-surface probe)';
const TIMEOUT_MS = 25000;
const SPACE_MS = 700;
const BACKOFF_MS = 6000;
const API = 'https://api.warframestat.us';

// Spec-supplied control identifier. If THIS fails too, the failure is a property
// of the surface, not of Drew's account.
const CONTROL_PROFILE = 'Tobiah';
// IGNs named in CG-000_TASK.md §1.
const DREW_IGNS = ['drew.slaydon', 'Jubbiles'];

const internalErrors = [];
let verdictCount = 0;

// ---------------------------------------------------------------------------
// HELPERS (zero deps)
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (l) => console.log(l === undefined ? '' : l);
const pad = (s, n) => { s = String(s); return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length); };
const clip = (s, n) => {
  s = String(s === undefined || s === null ? '' : s).replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1) + '\u2026';
};
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  return file;
}

// ---------------------------------------------------------------------------
// HTTP — sequential, polite, 429-aware
// ---------------------------------------------------------------------------

async function httpGet(url, tag) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': UA, accept: '*/*' } });
    const text = await res.text();
    let data = null, parseError = null;
    if (text.trim()) { try { data = JSON.parse(text); } catch (e) { parseError = e.message; } }
    return { url, tag, status: res.status, ok: res.ok, ms: Date.now() - t0,
             contentType: res.headers.get('content-type'), text, data, parseError, error: null };
  } catch (e) {
    return { url, tag, status: 0, ok: false, ms: Date.now() - t0, contentType: null,
             text: '', data: null, parseError: null, error: `${e.name}: ${e.message}` };
  } finally { clearTimeout(timer); }
}

function envelope(r, extra) {
  return Object.assign({
    _probe: { url: r.url, tag: r.tag, httpStatus: r.status, ok: r.ok, durationMs: r.ms,
              contentType: r.contentType, transportError: r.error, bodyParseError: r.parseError,
              fetchedAt: new Date().toISOString(), accountId: ACCOUNT_ID },
    data: r.data,
    rawBody: r.data === null && r.text ? r.text : undefined,
  }, extra || {});
}

async function probe(tag, url, fileStem, extra) {
  const r = await httpGet(url, tag);
  writeJson(path.join(PROBE_DIR, fileStem + '.json'), envelope(r, extra));
  say(`  [${pad(tag, 26)}] HTTP ${pad(r.status || 'ERR', 4)} ${pad(r.ms + 'ms', 7)} ${clip(r.error || r.url, 58)}`);
  verdictCount++;
  if (r.status === 429) { say('  -> 429 = legitimate finding; backing off, no retry storm.'); await sleep(BACKOFF_MS); }
  else await sleep(SPACE_MS);
  return r;
}

// ---------------------------------------------------------------------------
// PAYLOAD SHAPE SCANNER — grounds every VERIFIED claim in a literal field path
// ---------------------------------------------------------------------------

function scanPaths(root, maxDepth) {
  maxDepth = maxDepth || 14;
  const paths = [], names = new Set();
  let nodes = 0, truncated = false;
  const stack = [[root, '$', 0]];
  while (stack.length) {
    if (++nodes > 400000) { truncated = true; break; }
    const [node, p, depth] = stack.pop();
    if (node === null || typeof node !== 'object') continue;
    if (Array.isArray(node)) {
      paths.push({ path: p, type: 'array', len: node.length });
      names.add('[]');
      if (depth < maxDepth && node.length) stack.push([node[0], p + '[0]', depth + 1]);
      continue;
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      const child = p + '.' + k;
      paths.push({ path: child, type: v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v });
      names.add(k);
      if (v !== null && typeof v === 'object' && depth < maxDepth) stack.push([v, child, depth + 1]);
    }
  }
  return { paths, names: [...names].sort(), nodes, truncated };
}
const findPaths = (scan, re) => scan.paths.filter((p) => re.test(p.path)).map((p) => p.path);

function shapeOf(root, p) {
  let cur = root;
  for (const part of p.replace(/^\$/, '').split('.').filter(Boolean)) {
    if (cur === null || cur === undefined) return 'null';
    cur = cur[/^\[\d+\]$/.test(part) ? 0 : part];
  }
  if (cur === undefined) return '(absent)';
  if (cur === null) return 'null';
  if (Array.isArray(cur)) return `[${cur.length}] of ` + (cur.length && typeof cur[0] === 'object' ? 'object' : typeof cur[0]);
  if (typeof cur === 'object') { const ks = Object.keys(cur); return '{' + ks.slice(0, 4).join(',') + (ks.length > 4 ? ',…' : '') + '}'; }
  return JSON.stringify(cur);
}

// ---------------------------------------------------------------------------
// MARKET ITEM LIST — names exactly as written in CG-000_TASK.md §4C
// ---------------------------------------------------------------------------

const MARKET_ITEMS = [
  { group: 'Drew — live/liquidating',      name: 'Braton Vandal' },
  { group: 'Drew — live/liquidating',      name: 'Scattered Justice' },
  { group: 'Drew — long-term hold',        name: 'Voltaic Strike' },
  { group: 'Drew — S-tier set target',     name: 'Sybaris Prime' },
  { group: 'Drew — S-tier set target',     name: 'Steflos Prime' },
  { group: 'Drew — S-tier set target',     name: 'Baza Prime' },
  { group: 'Drew — S-tier set target',     name: 'Valkyr Prime' },
  { group: 'Drew — S-tier set target',     name: 'Ivara Prime' },
  { group: 'Drew — in-flight gap',         name: 'Wisp Prime' },
  { group: 'Drew — in-flight gap',         name: 'Volt' },
  { group: 'Drew — in-flight gap',         name: 'Hek' },
  { group: 'Drew — in-flight gap',         name: 'Atomos' },
  { group: 'Drew — in-flight gap',         name: 'Neurode' },
  { group: 'Drew — buyout doctrine',       name: 'Stalking Fan' },
  { group: 'Drew — buyout doctrine',       name: 'Crimson Dervish' },
  { group: 'Julia — gap (record only)',    name: 'Zenurik' },
  { group: 'Julia — gap (record only)',    name: 'Railjack' },
];

// Concepts, not tradeable SKUs. Probe the literal name; only spend extra
// requests on the nearest concrete candidate if the literal name yields
// nothing. Both attempts are recorded; nothing is asserted as truth.
const ALIAS_FORMS = { Zenurik: ['Zenurik Blueprint'], Railjack: ['Railjack Blueprint'] };

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  say('===================================================================');
  say(' CG-000 WORLDSTATE RECON PROBE  v2 (surface-corrected)');
  say(` node ${process.version} · account ${ACCOUNT_ID} · ${new Date().toISOString()}`);
  say(' READ-ONLY. No game files, no account data, no hub, no VCS.');
  say('===================================================================');

  try { fs.mkdirSync(PROBE_DIR, { recursive: true }); }
  catch (e) { say('FATAL: cannot create ' + PROBE_DIR); internalErrors.push(e.message); process.exit(1); }

  const findings = {
    leaf: 'CG-000', probeVersion: '2.0', runAt: new Date().toISOString(),
    nodeVersion: process.version, accountId: ACCOUNT_ID,
    controlProfile: CONTROL_PROFILE,
    discipline: { timeoutMs: TIMEOUT_MS, spacingMs: SPACE_MS, backoffMs: BACKOFF_MS, sequential: true },
    sections: {},
  };

  // =========================================================================
  // 4F — ESTABLISH THE LIVE SURFACE (the OpenAPI spec is ground truth)
  // =========================================================================
  say('');
  say('--- 4F  LIVE SURFACE (OpenAPI spec = structural ground truth) ---');
  const spec = await probe('openapi spec', `${API}/openapi.json`, 'surface__openapi');
  let specPaths = [];
  if (spec.ok && spec.data && spec.data.paths) {
    specPaths = Object.keys(spec.data.paths);
    const orderRoutes = specPaths.filter((p) => /order/i.test(p));
    const craftRoutes = specPaths.filter((p) => /craft|foundry|research|dojo|build/i.test(p));
    const questRoutes = specPaths.filter((p) => /quest/i.test(p));
    const profileRoutes = specPaths.filter((p) => /profile/i.test(p));
    findings.sections.surface = {
      specVersion: spec.data.info && spec.data.info.version,
      totalPaths: specPaths.length,
      allPaths: specPaths,
      orderRoutes, craftRoutes, questRoutes, profileRoutes,
      securitySchemes: (spec.data.components && spec.data.components.securitySchemes) || null,
      structuralFindings: {
        ordersRoutesInSpec: orderRoutes,
        craftingOrResearchRoutesInSpec: craftRoutes,
        questRoutesInSpec: questRoutes,
      },
    };
    say(`  spec version ${findings.sections.surface.specVersion} · ${specPaths.length} routes`);
    say(`  routes matching /order/i        : ${orderRoutes.length ? orderRoutes.join(', ') : 'NONE'}`);
    say(`  routes matching /craft|foundry|research|dojo/ : ${craftRoutes.length ? craftRoutes.join(', ') : 'NONE'}`);
    say(`  routes matching /quest/i        : ${questRoutes.length ? questRoutes.join(', ') : 'NONE'}`);
    say(`  routes matching /profile/i      : ${profileRoutes.join(', ')}`);
  } else {
    findings.sections.surface = { error: 'spec unavailable', httpStatus: spec.status, detail: clip(spec.text, 200) };
    say(`  spec unavailable: HTTP ${spec.status} ${clip(spec.error || spec.text, 100)}`);
  }

  // =========================================================================
  // 4A — ACCOUNT RESOLUTION (all 8 candidates + control + param sweep)
  // =========================================================================
  say('');
  say('--- 4A  ACCOUNT RESOLUTION (every candidate; never stop early) ---');

  const candidates = [
    { platform: 'PC',              url: 'https://api.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'PS4',             url: 'https://api-ps4.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'XB1',             url: 'https://api-xb1.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'Switch',          url: 'https://api-swi.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'Mobile',          url: 'https://api-mob.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'Android',         url: 'https://api-and.warframe.com/cdn/getProfileViewingData.php?playerId=' + ACCOUNT_ID },
    { platform: 'multi (warframestat)', url: `${API}/profile/${ACCOUNT_ID}` },
    { platform: 'multi (wfcd.gg)',  url: `https://api.wfcd.gg/profile/${ACCOUNT_ID}` },
  ];

  const resolution = [];
  for (const c of candidates) {
    const r = await probe(c.platform, c.url, 'profile__' + slug(c.platform));
    let verdict, detail;
    if (r.error) { verdict = 'TRANSPORT-ERROR'; detail = r.error; }
    else if (r.status === 403) { verdict = 'FORBIDDEN'; detail = 'HTTP 403 — closed to unauthenticated callers (empty body)'; }
    else if (r.status === 409) { verdict = 'WRONG-PARAM-CONTRACT'; detail = clip(r.text, 90) + ' — endpoint alive, wants a different parameter name'; }
    else if (r.status === 404) { verdict = 'UNRESOLVED'; detail = clip(r.text, 90) + ' — route/ID not exposed'; }
    else if (r.ok && r.data) { verdict = 'HTTP-OK'; detail = clip(JSON.stringify(r.data), 90); }
    else { verdict = 'UNRESOLVED'; detail = `HTTP ${r.status} ` + clip(r.text, 80); }
    resolution.push({ platform: c.platform, url: c.url, httpStatus: r.status, verdict, detail });
    say(`      ${pad(c.platform, 24)} -> ${verdict}`);
  }

  // Control sweep: is the failure about OUR id, or about everyone?
  say('  control sweep (is failure id-specific or surface-wide?)');
  const controls = [
    { label: 'warframestat /profile/' + CONTROL_PROFILE, url: `${API}/profile/${CONTROL_PROFILE}`,
      tests: 'spec-supplied example identifier (README/spec example "Tobiah")' },
    { label: 'warframestat /profile/' + CONTROL_PROFILE + '/stats', url: `${API}/profile/${CONTROL_PROFILE}/stats`,
      tests: 'profile stats route' },
    { label: 'warframestat /profile/' + CONTROL_PROFILE + '/xpInfo', url: `${API}/profile/${CONTROL_PROFILE}/xpInfo`,
      tests: 'profile xp/mastery route' },
    { label: 'warframestat /profile/' + CONTROL_PROFILE + '/arsenal', url: `${API}/profile/${CONTROL_PROFILE}/arsenal`,
      tests: 'arsenal route (spec: requires Twitch integration)' },
    { label: 'warframestat /profile/' + ACCOUNT_ID + '?withItem=true', url: `${API}/profile/${ACCOUNT_ID}?withItem=true`,
      tests: 'our id with item detail requested' },
    { label: 'legacy PC accountId+contentId', url: `https://api.warframe.com/cdn/getProfileViewingData.php?accountId=${ACCOUNT_ID}&contentId=2&language=en`,
      tests: 'corrected legacy param contract (accountId/contentId), our id' },
    { label: 'legacy PC accountId+contentId CONTROL', url: `https://api.warframe.com/cdn/getProfileViewingData.php?accountId=${CONTROL_PROFILE}&contentId=2&language=en`,
      tests: 'corrected legacy param contract, control id' },
  ];
  for (const d of DREW_IGNS) {
    controls.push({ label: 'arsenal: ' + d, url: `${API}/profile/${d}/arsenal`,
      tests: 'Drew IGN named in CG-000_TASK.md §1, arsenal-by-username route' });
  }

  const controlResults = [];
  for (const c of controls) {
    const r = await probe(c.label, c.url, 'control__' + slug(c.label));
    controlResults.push({ label: c.label, url: c.url, tests: c.tests, httpStatus: r.status,
                          ok: r.ok, bodySample: clip(r.text, 200), transportError: r.error });
    say(`      ${pad(c.label, 44)} HTTP ${r.status || 'ERR'} ${clip(r.text, 60)}`);
  }

  const controlResolves = controlResults.some((c) => c.ok && c.httpStatus === 200);
  const profileVerdict = controlResolves ? 'ID-SPECIFIC-ABSENCE' : 'SURFACE-CLOSED';
  findings.sections.accountResolution = {
    candidatesProbed: candidates.length,
    resolution,
    controlSweep: controlResults,
    controlResolves,
    profileVerdict,
    platformVerdict: 'UNRESOLVED — no candidate endpoint resolved',
    interpretation: controlResolves
      ? 'The profile surface answers for at least one identifier, so our ID is genuinely absent.'
      : 'Even the API spec\'s own example identifier fails, so profile access is closed surface-wide. Our ID cannot be tested through it.',
  };
  say('');
  say(`  PROFILE VERDICT: ${profileVerdict}`);
  say(`  PLATFORM: UNRESOLVED — no candidate endpoint resolved 11121350. Drew must state it.`);

  // =========================================================================
  // 4B — PROFILE CAPABILITIES Q1-Q5
  // =========================================================================
  say('');
  say('--- 4B  CAPABILITIES Q1-Q5 (player-scoped vs public-metadata split) ---');

  // Player-scoped: only a resolved profile payload can answer these.
  const playerQuestions = [
    { id: 'Q1', ask: 'Research / dojo timer with completion date?', why: "Drew's Volt research completes Wednesday — free if exposed" },
    { id: 'Q2', ask: 'Any player-foundry crafting queue?', why: "Drew's Wisp Prime (12h+3d), Julia's Hek/Atomos — believed not exposed anywhere" },
    { id: 'Q3f', ask: 'Player-OWNED prime parts / resources / mods / relics', why: 'Layer-B inventory' },
    { id: 'Q3g', ask: 'Player quest-completion keys', why: 'Progression / Julia TWW gate' },
    { id: 'Q4a', ask: 'Player credits', why: 'Economy' },
    { id: 'Q4b', ask: 'Player platinum', why: 'Economy' },
    { id: 'Q4c', ask: 'Player mastery rank', why: 'Progression' },
    { id: 'Q4d', ask: 'Player syndicate standings', why: 'Progression' },
    { id: 'Q5',  ask: 'Quest progress granular enough for STARTED vs COMPLETE?', why: "Julia's TWW progress gate" },
  ];
  const sourcesTried = candidates.map((c) => c.url).concat(controlResults.map((c) => c.url));

  const capabilityAnswers = [];
  let resolvedProfile = null;
  for (const c of candidates) {
    if (c.verdict === 'HTTP-OK' && c.detail) { resolvedProfile = c; break; }
  }
  if (resolvedProfile) {
    const r = await httpGet(resolvedProfile.url, 'profile-payload-analysis');
    const scan = scanPaths(r.data);
    for (const q of playerQuestions) {
      const re = new RegExp(q.id === 'Q5' ? 'status|complete|progress|done' : q.ask.split(/[ /]/).filter((w) => w.length > 3).join('|'), 'i');
      const hits = findPaths(scan, re);
      capabilityAnswers.push({ id: q.id, ask: q.ask, why: q.why, scope: 'player',
        verdict: hits.length ? '[VERIFIED]' : '[INACCESSIBLE]', fieldPaths: hits.slice(0, 20),
        exampleShape: hits.length ? shapeOf(r.data, hits[0]) : null, sourcesTried });
    }
  } else {
    for (const q of playerQuestions) {
      capabilityAnswers.push({ id: q.id, ask: q.ask, why: q.why, scope: 'player',
        verdict: '[INACCESSIBLE]', fieldPaths: [], exampleShape: null, sourcesTried,
        reason: `No profile payload obtainable. Profile surface verdict: ${profileVerdict}. ` +
                `Spec declares no research/dojo/crafting/quest route at all (structural absence).` });
    }
  }
  for (const a of capabilityAnswers) say(`  ${pad(a.id, 4)} ${pad(a.verdict, 16)} ${pad(a.ask, 56)}`);
  findings.sections.profileCapabilities = capabilityAnswers;

  // =========================================================================
  // 4D — WORLDSTATE BASELINE (patch-diff anchor)
  // =========================================================================
  say('');
  say('--- 4D  WORLDSTATE BASELINE (patch-diff anchor) ---');
  const wsUrl = `${API}/pc/en`;
  const ws = await probe('worldstate /pc/en', wsUrl, 'worldstate__pc-en');
  let worldstate = { url: wsUrl, httpStatus: ws.status, ok: ws.ok, topLevelKeys: [],
                     streamDate: null, timestamp: null, snapshotStem: 'worldstate__pc-en' };
  if (ws.ok && ws.data && typeof ws.data === 'object') {
    worldstate.topLevelKeys = Object.keys(ws.data);
    worldstate.streamDate = ws.data.streamDate !== undefined ? ws.data.streamDate : null;
    worldstate.timestamp = ws.data.timestamp !== undefined ? ws.data.timestamp : null;
    worldstate.note = worldstate.streamDate === null
      ? 'Field `streamDate` is ABSENT from the payload; the live timestamp field is `timestamp`.'
      : 'streamDate present.';
    writeJson(path.join(PROBE_DIR, 'worldstate__pc-en.keys.json'), {
      snapshotAt: new Date().toISOString(), url: wsUrl,
      streamDate: worldstate.streamDate, timestamp: worldstate.timestamp,
      topLevelKeys: worldstate.topLevelKeys,
      keyTypes: Object.fromEntries(worldstate.topLevelKeys.map((k) =>
        [k, Array.isArray(ws.data[k]) ? `array(${ws.data[k].length})` : typeof ws.data[k]])),
    });
    say(`  timestamp: ${worldstate.timestamp}   streamDate: ${worldstate.streamDate} (${worldstate.note})`);
    say(`  top-level keys (${worldstate.topLevelKeys.length}): ${worldstate.topLevelKeys.join(', ')}`);
  } else {
    say(`  worldstate unavailable: HTTP ${ws.status} ${clip(ws.error || ws.text, 100)}`);
  }
  const tsR = await probe('worldstate /pc/timestamp', `${API}/pc/timestamp`, 'worldstate__pc-timestamp');
  if (tsR.ok && tsR.data) { worldstate.timestampEndpoint = tsR.data; say(`  /pc/timestamp -> ${JSON.stringify(tsR.data)}`); }
  findings.sections.worldstate = worldstate;

  // =========================================================================
  // 4C — MARKET ORDERABILITY (derived from routes that actually answer)
  // =========================================================================
  say('');
  say('--- 4C  MARKET ORDERABILITY (ORDERABLE = a live public PRICE signal exists) ---');
  say('  NOTE: the §4C endpoint list (/items/<X>/orders, getItemOrders.php) returns a');
  say('        router-level 404 for every item and is absent from the OpenAPI spec.');
  say('        Verdict is therefore derived from: item-DB tradable flag, /wfinfo/prices,');
  say('        /wfinfo/filtered_items, and /pricecheck.');

  // One fetch each of the two aggregate price datasets; membership is then
  // tested locally so we do not spend 17 requests per dataset.
  const pricesR = await probe('wfinfo prices', `${API}/wfinfo/prices`, 'market__wfinfo-prices');
  const prices = Array.isArray(pricesR.data) ? pricesR.data : null;
  const priceMap = prices ? new Map(prices.map((r) => [r.name, r])) : null;
  const fiR = await probe('wfinfo filtered_items', `${API}/wfinfo/filtered_items`, 'market__wfinfo-filtered_items');
  const filtered = fiR.data && typeof fiR.data === 'object' ? fiR.data : null;
  say(`  wfinfo/prices: ${prices ? prices.length + ' rows' : 'UNAVAILABLE'}`);
  say(`  wfinfo/filtered_items: ${filtered ? Object.keys(filtered).join(', ') : 'UNAVAILABLE'}`);

  // 4C-MANDATED — the two endpoints named verbatim in CG-000_TASK.md §4C are
  // probed for EVERY item regardless of what the surface sweep finds. They are
  // expected to fail (router-level 404); that expectation is itself the finding
  // and must stay reproducible, not be silently dropped after discovery.
  say('  4C-MANDATED: replaying the exact §4C endpoint list for every item');
  const mandated = [];
  for (const item of MARKET_ITEMS) {
    const pair = [
      { endpoint: 'warframestat.us/items/<ITEM>/orders', url: `${API}/items/${encodeURIComponent(item.name)}/orders` },
      { endpoint: 'warframe.com/cdn/getItemOrders.php?item=<ITEM>', url: `https://api.warframe.com/cdn/getItemOrders.php?item=${encodeURIComponent(item.name)}` },
    ];
    const results = [];
    for (const p of pair) {
      const r = await probe(item.name, p.url, 'mandated__orders__' + slug(item.name) + '__' + slug(p.endpoint));
      results.push({ endpoint: p.endpoint, url: p.url, httpStatus: r.status, ok: r.ok,
                     routerSays: r.data ? (r.data.message || r.data.error || null) : clip(r.text, 80),
                     transportError: r.error });
    }
    mandated.push({ item: item.name, results });
  }
  findings.sections.mandatedOrderEndpoints = {
    note: 'CG-000_TASK.md §4C names exactly these two endpoints. Both return a router-level 404 for every probed item; neither appears in the OpenAPI spec.',
    endpoint1: '/items/<ITEM>/orders',
    endpoint2: '/cdn/getItemOrders.php?item=<ITEM>',
    mandated,
  };
  say(`  4C-MANDATED: ${mandated.length} items x 2 endpoints probed and recorded`);

  const pricesIndex = prices ? prices.map((r) => r.name) : [];
  /**
   * Naming conventions in /wfinfo/prices, established by observation:
   *   exact  "<Item>"            e.g. "Redeemer Prime Blade"
   *   set    "<Item> Set"        e.g. "Sybaris Prime Set"
   *   parts  "<Item> <Part>"     e.g. "Sybaris Prime Barrel", "Wisp Prime Blueprint"
   * `related` rows use the base token (trailing " Prime" stripped) so that a
   * request for "Volt" surfaces the "Volt Prime *" rows as RELATED, never as a
   * verdict for the bare item. Related rows are recorded, not granted.
   */
  function priceRowsFor(nm) {
    if (!pricesIndex.length) return { exact: [], set: [], related: [] };
    const key = String(nm).toLowerCase();
    const base = key.replace(/\s*prime\s*$/, '').trim();
    const pick = (pred) => prices.filter((r) => pred(String(r.name).toLowerCase()));
    return {
      exact: pick((n) => n === key),
      set: pick((n) => n === key + ' set'),
      related: pick((n) => n.includes(base)),
    };
  }

  const orderability = [];
  for (const item of MARKET_ITEMS) {
    const names = [item.name].concat(ALIAS_FORMS[item.name] || []);
    const forms = [];
    let itemDb = null, priceSignal = null, verdict = 'NOT-ORDERABLE', resolvedName = null;

    for (const nm of names) {
      const dbUrl = `${API}/items/${encodeURIComponent(nm)}?only=name,uniqueName,type,category,tradable,masterable,components,set,ducats,quantity`;
      const dbR = await probe(item.name, dbUrl, 'market__item__' + slug(nm));

      let exists = false, tradable = null, itype = null, cat = null, uniq = null, comps = [];
      if (dbR.ok && dbR.data && typeof dbR.data === 'object' && dbR.data.name) {
        exists = true; tradable = dbR.data.tradable !== undefined ? dbR.data.tradable : null;
        itype = dbR.data.type || null; cat = dbR.data.category || null; uniq = dbR.data.uniqueName || null;
        if (Array.isArray(dbR.data.components)) {
          comps = dbR.data.components.map((c) => ({
            name: c.name, count: c.itemCount !== undefined ? c.itemCount : null,
            primeSellingPrice: c.primeSellingPrice !== undefined ? c.primeSellingPrice : undefined,
            tradable: c.tradable, dropSources: Array.isArray(c.drops) ? c.drops.length : null,
          }));
        }
        itemDb = { queriedName: nm, exists, tradable, type: itype, category: cat, uniqueName: uniq, components: comps };
        resolvedName = nm;
      }

      const inPrices = priceMap ? priceMap.has(nm) : false;
      const prow = priceRowsFor(nm);
      const inEqmt = !!(filtered && filtered.eqmt && filtered.eqmt[nm]);
      const pcUrl = `${API}/pricecheck/find/${encodeURIComponent(nm)}`;
      const pcR = await probe(item.name, pcUrl, 'market__pricecheck__' + slug(nm));
      const pcNonEmpty = Array.isArray(pcR.data) && pcR.data.length > 0;

      const namedSignal = prow.exact.length || prow.set.length ? prow.exact.concat(prow.set) : null;
      forms.push({ queriedName: nm, itemDbExists: exists, tradable,
                   inWfinfoPricesExact: !!(namedSignal && namedSignal.length),
                   inWfinfoPricesSet: prow.set.length > 0,
                   wfinfoPriceRows: namedSignal,
                   relatedPriceRows: prow.related,
                   inFilteredEqmt: inEqmt,
                   eqmtRow: inEqmt ? filtered.eqmt[nm] : null,
                   pricecheckHttp: pcR.status, pricecheckNonEmpty: pcNonEmpty,
                   pricecheckSample: pcNonEmpty ? clip(JSON.stringify(pcR.data), 200) : clip(pcR.text, 120) });

      const signal = (namedSignal && namedSignal.length)
        ? { via: 'wfinfo/prices', name: namedSignal.map((r) => r.name).join(' + '), value: namedSignal }
        : (pcNonEmpty ? { via: 'pricecheck/find', name: nm, value: pcR.data } : null);
      if (signal) priceSignal = signal;
      if (exists && !resolvedName) resolvedName = nm;
      if (priceSignal) break; // stay polite once a real signal is found
    }

    if (priceSignal) verdict = 'ORDERABLE';
    const relatedOnly = !priceSignal
      ? [...new Set(forms.flatMap((f) => (f.relatedPriceRows || []).map((r) => r.name)))]
      : [];
    const rec = {
      group: item.group, item: item.name, verdict,
      resolvedItemName: resolvedName,
      priceSignal: priceSignal || null,
      relatedPriceRows: relatedOnly,
      itemDb,
      formsProbed: forms,
      reading: priceSignal
        ? 'A live public price row exists for this item name; an undercut could be computed against custom_avg, subject to the field-semantics caveat in §4.'
        : (relatedOnly.length
            ? 'No public price row for this exact name, but RELATED rows exist: ' + relatedOnly.join(', ') + '. Those belong to a differently-named item and are recorded, not granted.'
            : 'No live public price signal exists for this item. The in-game order book is not exposed by any reachable public route.'),
    };
    orderability.push(rec);
    say(`  ${pad(item.name, 18)} ${verdict.padEnd(14)} exists=${itemDb ? (itemDb.exists ? 'Y' : 'N') : '?'} ` +
        `tradable=${itemDb && itemDb.tradable !== null ? itemDb.tradable : '?'} ` +
        `prices=${priceSignal ? priceSignal.via : (relatedOnly.length ? 'none (related:' + relatedOnly.length + ')' : 'none')}`);
  }

  findings.sections.orderability = orderability;

  const orderableNames = orderability.filter((o) => o.verdict === 'ORDERABLE').map((o) => o.item);
  const notOrderableNames = orderability.filter((o) => o.verdict === 'NOT-ORDERABLE').map((o) => o.item);
  const existsButUnpriced = orderability.filter((o) => o.verdict === 'NOT-ORDERABLE' && o.itemDb && o.itemDb.exists)
    .map((o) => ({ item: o.item, tradable: o.itemDb.tradable, type: o.itemDb.type, uniqueName: o.itemDb.uniqueName }));
  const notEvenItems = orderability.filter((o) => !o.itemDb || !o.itemDb.exists).map((o) => o.item);
  const tradableButUnpriced = existsButUnpriced.filter((e) => e.tradable === true).map((e) => e.item);
  const relatedOnlyItems = orderability.filter((o) => o.verdict === 'NOT-ORDERABLE' && o.relatedPriceRows.length)
    .map((o) => ({ item: o.item, relatedPriceRows: o.relatedPriceRows }));

  findings.sections.tradeDoctrineComputability = {
    question: 'Is the 1-Plat Undercut computable from public data?',
    answer: orderableNames.length === 0
      ? 'NO. Zero probed items exposed any public price signal. The in-game order book is not exposed by the primary public API at all.'
      : `PARTIALLY — computable for ${orderableNames.length} of ${MARKET_ITEMS.length} probed items, and only against a coarse average row, never against a live order book.`,
    orderableSubset: orderableNames,
    notOrderableSubset: notOrderableNames,
    existsButNoPublicPrice: existsButUnpriced,
    notAnItemAtAll: notEvenItems,
    inGameTradableButNoPublicPrice: tradableButUnpriced,
    relatedRowsOnly: relatedOnlyItems,
    fieldSemanticsCaveat: 'The API does not document what today_vol / yesterday_vol / custom_avg mean. /wfinfo/prices states its shape depends on an externally configured source. CG must not treat custom_avg as a live asking price without Drew confirming what it represents.',
    doctrineConsequence: orderableNames.length === 0
      ? 'Trade-credit-driven only. No order-driven engine is possible on this surface. CG must source prices from Drew (or a third-party overlay/API) and track them as derived Layer-B facts.'
      : 'Split engine: prime items have a coarse public average to reason from; mods, packs and the liquidating stock have NO public price at all and must move on trade credits with Drew-supplied numbers. Never treat the average as a live order.',
  };
  say('');
  say(`  ORDERABLE (${orderableNames.length}): ${orderableNames.join(', ') || '(none)'}`);
  say(`  NOT-ORDERABLE (${notOrderableNames.length}): ${notOrderableNames.join(', ') || '(none)'}`);
  say(`  in-game tradable=true but NO public price: ${tradableButUnpriced.join(', ') || '(none)'}`);
  say(`  not an item in the public DB at all: ${notEvenItems.join(', ') || '(none)'}`);
  if (relatedOnlyItems.length) {
    say('  related price rows (recorded, NOT granted):');
    for (const r of relatedOnlyItems) say(`      ${r.item} -> ${r.relatedPriceRows.join(', ')}`);
  }

  // =========================================================================
  // FINDINGS FILE + MATRIX PRINT
  // =========================================================================
  const totalFiles = fs.readdirSync(PROBE_DIR).filter((f) => f.endsWith('.json')).length;
  Object.assign(findings, { snapshotCount: totalFiles, verdictsRecorded: verdictCount, internalErrors });
  writeJson(path.join(PROBE_DIR, '_probe-findings.json'), findings);

  say('');
  say('--- MATRIX SUMMARY ---');
  say(`  spec routes                    : ${specPaths.length}`);
  say(`  account endpoints probed       : ${candidates.length} + ${controlResults.length} controls`);
  say(`  platforms resolved             : (NONE)`);
  say(`  profile surface verdict        : ${profileVerdict}`);
  say(`  market items w/ hard verdict   : ${orderability.length}/${MARKET_ITEMS.length}`);
  say(`  worldstate keys                : ${worldstate.topLevelKeys.length}`);
  say(`  snapshots on disk              : ${totalFiles} files in CG/baked/probes/`);

  say('');
  say('--- CAPABILITY VERDICTS (player-scoped) ---');
  for (const a of capabilityAnswers) say(`  ${pad(a.id, 4)} ${a.verdict}  ${a.ask}`);

  say('');
  say('--- NOT-DONE (read-only recon leaf) ---');
  say('  .opencode/agents/cg.md  NOT created (CG-001, Drew-routed)');
  say('  WASH/** / hub files     NOT touched');
  say('  CG/derived/             NOT created (CG-001+)');
  say('  git                     NO add / NO commit (VCS HOLD)');
  say('  account data            NOT written — Warframe has no local account file');
  say('');
  say('===================================================================');

  if (internalErrors.length || verdictCount === 0 || totalFiles === 0) {
    say('RESULT: FAILED — run produced nothing reportable.');
    for (const e of internalErrors) say('  internal error: ' + e);
    process.exit(1);
  }
  say('RESULT: OK — recon complete. Snapshots in CG/baked/probes/.');
  process.exit(0);
}

main().catch((e) => { say('UNHANDLED: ' + (e && e.stack ? e.stack : e)); process.exit(1); });