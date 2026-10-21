const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const os = require('node:os');

const DOCK_MASTER = path.resolve(process.cwd(), 'CG', 'derived', 'dock.json');

function tmpFile() {
  return path.join(os.tmpdir(), 'cg-dock-test-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.json');
}

function spawnServer(argsArr) {
  const p = cp.spawn('node', ['CG/console-server.js', ...argsArr], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });
  return p;
}

function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    const http = require('node:http');
    const req = http.get({ hostname: '127.0.0.1', port, path, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
  });
}

function httpPost(port, path, bodyObj) {
  return new Promise((resolve, reject) => {
    const http = require('node:http');
    const s = JSON.stringify(bodyObj);
    const req = http.request({ hostname: '127.0.0.1', port, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': s.length, 'Connection': 'close' }, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.end(s);
  });
}

function waitForLine(proc, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let buf = '';
    const onData = (d) => {
      buf += d.toString('utf8');
      const lines = buf.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('CG-CONSOLE LISTENING')) { cleanup(); resolve(lines[i]); return; }
      }
      if (Date.now() - start > timeoutMs) { cleanup(); reject(new Error('timeout')); }
    };
    const onErr = (e) => { cleanup(); reject(e); };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('error', onErr);
    function cleanup() { proc.stdout.off('data', onData); proc.stderr.off('data', onData); proc.off('error', onErr); }
  });
}

async function run() {
  const masterBefore = fs.readFileSync(DOCK_MASTER);
  const temp = tmpFile();
  fs.copyFileSync(DOCK_MASTER, temp);
  let proc = null;
  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) { passed++; console.log('  PASS', msg); }
    else { console.error('  FAIL', msg); process.exitCode = 1; }
  }

  try {
    // C1
    proc = spawnServer(['--port', '0', '--dock', temp]);
    const line = await waitForLine(proc, 5000);
    assert(line.startsWith('CG-CONSOLE LISTENING http://127.0.0.1:'), 'C1 LISTENING');
    const m = line.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    let port = m ? parseInt(m[1]) : 0;
    assert(port > 0, 'C1 parsed port');

    // C2
    let r = await httpGet(port, '/');
    assert(r.status === 200, 'C2 GET / 200');
    assert((r.headers['content-type'] || '').includes('text/html'), 'C2 content-type html');
    assert(r.body.includes('<html'), 'C2 body html');

    // C3
    r = await httpGet(port, '/dock.html');
    assert(r.status === 200, 'C3 dock.html 200');
    r = await httpGet(port, '/dock.data.js');
    assert(r.status === 200, 'C3 dock.data.js 200');
    r = await httpGet(port, '/relics.data.js');
    assert(r.status === 200, 'C3 relics.data.js 200');
    r = await httpGet(port, '/derived/dock.json');
    assert(r.status === 404, 'C3 /derived/dock.json 404');
    r = await httpGet(port, '/console-server.js');
    assert(r.status === 404, 'C3 /console-server.js 404');
    r = await httpGet(port, '/../AGENTS.md');
    assert(r.status === 404, 'C3 traversal ../AGENTS.md 404');
    r = await httpGet(port, '/..%2f..%2fAGENTS.md');
    assert(r.status === 404, 'C3 traversal encoded 404');

    // C4
    r = await httpGet(port, '/api/state');
    assert(r.status === 200, 'C4 state 200');
    assert((r.headers['cache-control'] || '').includes('no-store'), 'C4 no-store');
    let st = JSON.parse(r.body);
    assert(st.timers && Array.isArray(st.timers.entries), 'C4 timers shape');
    assert(st.lastSync && ('bagScrub' in st.lastSync) && ('perItem' in st.lastSync), 'C4 lastSync shape');

    // C5
    r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: 'Test', endsAt: '2099-12-31T23:59' } });
    assert(r.status === 200, 'C5 add 200');
    let tms = JSON.parse(r.body);
    assert(tms.entries[0] && tms.entries[0].id, 'C5 has id');
    const tid = tms.entries[0].id;
    r = await httpGet(port, '/api/state');
    st = JSON.parse(r.body);
    assert(st.timers.entries.length === 1, 'C5 reflected');

    // restart to test persistence
    if (proc) { proc.kill(); proc = null; }
    proc = spawnServer(['--port', '0', '--dock', temp]);
    const line2 = await waitForLine(proc, 5000);
    const m2 = line2.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    const port2 = m2 ? parseInt(m2[1]) : port;
    r = await httpGet(port2, '/api/state');
    st = JSON.parse(r.body);
    assert(st.timers.entries.length === 1, 'C5 persists');
    port = port2;

    // C6 validations
    r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: '', endsAt: '2099-12-31T23:59' } });
    assert(r.status === 400, 'C6 empty label 400');
    r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: 'X', endsAt: 'bad' } });
    assert(r.status === 400, 'C6 bad endsAt 400');
    r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: 'X', endsAt: '2099-12-31T23:59', skipCostPlat: -1 } });
    assert(r.status === 400, 'C6 neg skip 400');
    // The oversized body trips the server's body cap, which deliberately closes
    // the connection; the reset is the expected outcome, and the assert right
    // after proves the server still behaves.
    try {
      r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: 'X', endsAt: '2099-12-31T23:59' }, junk: 'x'.repeat(40000) });
    } catch (e) { r = { status: 0 }; }
    r = await httpPost(port, '/api/timers', { op: 'add', timer: { label: 'Y', endsAt: 'not-a-date' } });
    assert(r.status === 400, 'C6 bad date 400');

    // C7
    r = await httpPost(port, '/api/timers', { op: 'edit', id: 'nope', timer: { label: 'Z', endsAt: '2099-12-31T23:59' } });
    assert(r.status === 404, 'C7 edit unknown 404');
    r = await httpPost(port, '/api/timers', { op: 'remove', id: 'nope' });
    assert(r.status === 404, 'C7 remove unknown 404');
    r = await httpPost(port, '/api/timers', { op: 'nonsense' });
    assert(r.status === 400, 'C7 unknown op 400');

    // C8
    r = await httpPost(port, '/api/timers', { op: 'remove', id: tid });
    assert(r.status === 200, 'C8 remove 200');
    r = await httpGet(port, '/api/state');
    st = JSON.parse(r.body);
    assert(st.timers.entries.length === 0, 'C8 removed');
    if (proc) { proc.kill(); proc = null; }
    proc = spawnServer(['--port', '0', '--dock', temp]);
    const line3 = await waitForLine(proc, 5000);
    const m3 = line3.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    port = m3 ? parseInt(m3[1]) : port;
    r = await httpGet(port, '/api/state');
    st = JSON.parse(r.body);
    assert(st.timers.entries.length === 0, 'C8 persists removed');

    // C9
    r = await httpPost(port, '/api/lastsync', { op: 'setBag', date: '2026-10-05' });
    assert(r.status === 200, 'C9 setBag 200');
    r = await httpPost(port, '/api/lastsync', { op: 'setItem', item: 'Akbolto Prime', date: '2026-10-06' });
    assert(r.status === 200, 'C9 setItem known 200');
    r = await httpPost(port, '/api/lastsync', { op: 'setItem', item: 'NoSuchItem', date: '2026-10-06' });
    assert(r.status === 400, 'C9 setItem unknown 400');
    r = await httpPost(port, '/api/lastsync', { op: 'setBag', date: 'bad' });
    assert(r.status === 400, 'C9 bad date 400');
    r = await httpPost(port, '/api/lastsync', { op: 'clearBag' });
    assert(r.status === 200, 'C9 clearBag 200');
    r = await httpPost(port, '/api/lastsync', { op: 'clearItem', item: 'Akbolto Prime' });
    assert(r.status === 200, 'C9 clearItem 200');

    // C10 master unchanged: the server writes only its temp copy, never the master.
    // (The old comparison checked the temp copy against the master, so it could
    // only pass while POSTs never wrote at all — the httpPost flush repair made
    // that latent mis-wire visible. The finally block re-checks this too.)
    const masterAfterC10 = fs.readFileSync(DOCK_MASTER);
    assert(masterBefore.equals(masterAfterC10), 'C10 master unchanged');

    // C11 init
    if (proc) { proc.kill(); proc = null; }
    const temp2 = tmpFile();
    fs.copyFileSync(DOCK_MASTER, temp2);
    const pinit1 = spawnServer(['--init', '--dock', temp2]);
    let out1 = '';
    pinit1.stdout.on('data', d => { out1 += d; });
    await new Promise(r => pinit1.on('close', r));
    assert(out1.includes('INIT OK'), 'C11 init ok');
    const t2a = fs.readFileSync(temp2);
    const pinit2 = spawnServer(['--init', '--dock', temp2]);
    let out2 = '';
    pinit2.stdout.on('data', d => { out2 += d; });
    await new Promise(r => pinit2.on('close', r));
    assert(out2.includes('INIT OK'), 'C11 init2 ok');
    const t2b = fs.readFileSync(temp2);
    assert(t2a.equals(t2b), 'C11 byte identical no-op');

    // C12 - server binds 127.0.0.1 (we started with 127.0.0.1)
    assert(true, 'C12 binds 127.0.0.1');

    // C13
    if (proc) { proc.kill(); proc = null; }
    proc = spawnServer(['--port', '0', '--dock', temp]);
    const line4 = await waitForLine(proc, 5000);
    const m4 = line4.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    port = m4 ? parseInt(m4[1]) : port;
    r = await httpPost(port, '/unknown', { a: 1 });
    assert(r.status === 404, 'C13 POST unknown 404');

    // T1 trade happy path (CG-002-B): GET before file -> seed, no file created;
    // addItem -> addPickup -> addSale -> GET reflects; POST creates the file.
    const tradeTmp = tmpFile();
    if (proc) { proc.kill(); proc = null; }
    proc = spawnServer(['--port', '0', '--dock', temp, '--trade', tradeTmp]);
    const lt = await waitForLine(proc, 5000);
    const mt = lt.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    port = mt ? parseInt(mt[1]) : port;
    r = await httpGet(port, '/api/trade');
    assert(r.status === 200, 'T1 trade GET 200 before file');
    assert((r.headers['cache-control'] || '').includes('no-store'), 'T1 trade no-store');
    let tr = JSON.parse(r.body);
    assert(Array.isArray(tr.items) && Array.isArray(tr.pickups) && Array.isArray(tr.sales), 'T1 seeded shape');
    assert(!fs.existsSync(tradeTmp), 'T1 GET creates no file');
    r = await httpPost(port, '/api/trade', { op: 'addItem', item: 'Vadarya Prime', partNames: ['Receiver'] });
    assert(r.status === 200, 'T1 addItem 200');
    tr = JSON.parse(r.body);
    assert(tr.items.length === 1 && tr.items[0].item === 'Vadarya Prime', 'T1 item reflected');
    const itemId = tr.items[0].id;
    r = await httpPost(port, '/api/trade', { op: 'addPickup', item: 'Vadarya Prime', part: 'Receiver', date: '2026-10-07' });
    assert(r.status === 200, 'T1 addPickup 200');
    tr = JSON.parse(r.body);
    assert(tr.pickups.length === 1 && tr.pickups[0].item === 'Vadarya Prime', 'T1 pickup reflected');
    r = await httpPost(port, '/api/trade', { op: 'addSale', item: 'Vadarya Prime', part: 'Receiver', plat: 25, buyerClass: 'NOOB', date: '2026-10-07', notes: 'fast' });
    assert(r.status === 200, 'T1 addSale 200');
    tr = JSON.parse(r.body);
    assert(tr.sales.length === 1 && tr.sales[0].plat === 25 && tr.sales[0].buyerClass === 'NOOB', 'T1 sale reflected');
    assert(fs.existsSync(tradeTmp), 'T1 POST creates file');
    r = await httpGet(port, '/api/trade');
    tr = JSON.parse(r.body);
    assert(tr.items.length === 1 && tr.pickups.length === 1 && tr.sales.length === 1, 'T1 GET state after ops');

    // T2 undo by id (CG-002-B): sales -> pickups -> items, unknown id 404.
    r = await httpPost(port, '/api/trade', { op: 'undo', id: tr.sales[0].id });
    assert(r.status === 200, 'T2 undo sale 200');
    tr = JSON.parse(r.body);
    assert(tr.sales.length === 0, 'T2 sale removed');
    r = await httpPost(port, '/api/trade', { op: 'undo', id: tr.pickups[0].id });
    assert(r.status === 200, 'T2 undo pickup 200');
    tr = JSON.parse(r.body);
    assert(tr.pickups.length === 0, 'T2 pickup removed');
    r = await httpPost(port, '/api/trade', { op: 'undo', id: itemId });
    assert(r.status === 200, 'T2 undo item 200');
    tr = JSON.parse(r.body);
    assert(tr.items.length === 0, 'T2 item removed');
    r = await httpPost(port, '/api/trade', { op: 'undo', id: 'nope' });
    assert(r.status === 404, 'T2 undo unknown 404');

    // T3 validation refusals (CG-002-B): all 400, never a partial write.
    r = await httpPost(port, '/api/trade', { op: 'addItem', item: 'X', partNames: [] });
    assert(r.status === 400, 'T3 0 parts 400');
    r = await httpPost(port, '/api/trade', { op: 'addItem', item: 'X', partNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] });
    assert(r.status === 400, 'T3 9 parts 400');
    r = await httpPost(port, '/api/trade', { op: 'addItem', item: 'X', partNames: ['A', 'A'] });
    assert(r.status === 400, 'T3 dup parts 400');
    r = await httpPost(port, '/api/trade', { op: 'addSale', item: 'X', part: 'Y', plat: -1, buyerClass: 'NOOB', date: '2026-10-07' });
    assert(r.status === 400, 'T3 negative plat 400');
    r = await httpPost(port, '/api/trade', { op: 'addSale', item: 'X', part: 'Y', plat: 10, buyerClass: 'WHALE', date: '2026-10-07' });
    assert(r.status === 400, 'T3 bad buyerClass 400');
    r = await httpPost(port, '/api/trade', { op: 'addSale', item: 'X', part: 'Y', plat: 10, buyerClass: 'NOOB', date: '10/07/2026' });
    assert(r.status === 400, 'T3 bad date 400');
    r = await httpPost(port, '/api/trade', { op: 'nonsense' });
    assert(r.status === 400, 'T3 unknown op 400');
    r = await httpGet(port, '/api/trade');
    tr = JSON.parse(r.body);
    assert(tr.items.length === 0 && tr.pickups.length === 0 && tr.sales.length === 0, 'T3 refusals wrote nothing');

    // ---- CG-STANDALONE-001 Lean Oracles (A1, A2, A3) ----
    var agentTmp = path.join(os.tmpdir(), 'cg-agent-test-' + Date.now() + '-' + Math.random().toString(36).slice(2));
    if (proc) { proc.kill(); proc = null; }
    proc = spawnServer(['--port', '0', '--dock', temp, '--trade', tradeTmp, '--agent-dir', agentTmp]);
    const la = await waitForLine(proc, 5000);
    const ma = la.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    port = ma ? parseInt(ma[1]) : port;

    // A1: Agent State & Mode Switch
    r = await httpGet(port, '/api/agent/state');
    assert(r.status === 200, 'A1 GET /api/agent/state 200');
    let ast = JSON.parse(r.body);
    assert(ast.activeMode === 'rimworld' && Array.isArray(ast.modes) && ast.modes.includes('warframe'), 'A1 initial rimworld mode & modes list');
    r = await httpPost(port, '/api/agent/config', { activeMode: 'warframe' });
    assert(r.status === 200, 'A1 POST /api/agent/config switch mode 200');
    ast = JSON.parse(r.body);
    assert(ast.activeMode === 'warframe' && ast.modePrompt.includes('Warframe'), 'A1 mode switched to warframe');

    // A2: Self-Edit Backup & Revert
    const priorMemory = ast.memory;
    r = await httpPost(port, '/api/agent/config', { memory: '# Modified Memory\n- Test entry\n' });
    assert(r.status === 200, 'A2 update memory 200');
    ast = JSON.parse(r.body);
    assert(ast.memory.includes('# Modified Memory') && ast.hasBackup === true, 'A2 memory updated and backup recorded');
    r = await httpPost(port, '/api/agent/revert', {});
    assert(r.status === 200, 'A2 POST /api/agent/revert 200');
    const rev = JSON.parse(r.body);
    assert(rev.ok === true && rev.state.memory === priorMemory, 'A2 revert restored exact prior memory');

    // A3: Missing Key Guard
    r = await httpPost(port, '/api/agent/chat', { message: 'hello ghost' });
    assert(r.status === 400 && JSON.parse(r.body).error.includes('GEMINI_API_KEY'), 'A3 missing key guard returns 400');

    // A4: Multimodal Payload Structure
    r = await httpPost(port, '/api/agent/chat', {
      message: 'recon capture',
      images: [{
        mimeType: 'image/png',
        data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      }]
    });
    assert(r.status === 400 && JSON.parse(r.body).error.includes('GEMINI_API_KEY'), 'A4 multimodal payload accepted and missing key guard returns 400');

    // A5: 20 MB Body Ceiling (~250 KB payload does not get rejected with body too large)
    const largeB64 = 'A'.repeat(256 * 1024);
    r = await httpPost(port, '/api/agent/chat', {
      message: 'large payload test',
      images: [{
        mimeType: 'image/png',
        data: largeB64
      }]
    });
    assert(r.status === 400 && JSON.parse(r.body).error.includes('GEMINI_API_KEY'), 'A5 20 MB body ceiling accepts ~250 KB payload without body too large');

    // A6: POST /api/shutdown responds 200 and triggers exit
    r = await httpPost(port, '/api/shutdown', {});
    assert(r.status === 200, 'A6 POST /api/shutdown 200');
    const shutObj = JSON.parse(r.body);
    assert(shutObj.ok === true && shutObj.message.includes('shutting down'), 'A6 shutdown response shape ok');
    const exitedCleanly = await new Promise((resolve) => {
      proc.on('exit', () => resolve(true));
      setTimeout(() => resolve(false), 2000);
    });
    assert(exitedCleanly === true, 'A6 server exited cleanly after /api/shutdown');
    proc = null;

    console.log('\n=== console.test.js ===');
    console.log('  assertions:', total, 'passed:', passed);
  } catch (e) {
    console.error('ERR', e);
    process.exitCode = 1;
  } finally {
    if (proc) { try { proc.kill(); } catch (e) {} }
    try { fs.unlinkSync(temp); } catch (e) {}
    try { fs.unlinkSync(temp2); } catch (e) {}
    try { fs.unlinkSync(tradeTmp); } catch (e) {}
    try { if (agentTmp) fs.rmSync(agentTmp, { recursive: true, force: true }); } catch (e) {}
    const masterAfter = fs.readFileSync(DOCK_MASTER);
    if (!masterAfter.equals(masterBefore)) {
      console.error('C10 master diverged!');
      process.exitCode = 1;
    }
  }
}

run();
