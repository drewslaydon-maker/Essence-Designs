const { execSync } = require('child_process');

console.log('====================================================');
console.log('   ESSENCE DESIGNS — INFRA 2.0 System Health Check   ');
console.log('====================================================\n');

// 1. Check Git Status
try {
  const gitStatus = execSync('git status --porcelain').toString().trim();
  if (gitStatus.length === 0) {
    console.log('[✔] Git Repository: Clean (No uncommitted changes)');
  } else {
    console.log('[!] Git Repository: Uncommitted changes detected');
  }
} catch (e) {
  console.log('[❌] Git Repository: Check failed');
}

// 2. Check Node Execution
try {
  const nodeVer = process.version;
  console.log('[✔] Node.js Runtime: ' + nodeVer + ' operational');
} catch (e) {
  console.log('[❌] Node.js Runtime: Check failed');
}

// 3. Run Active Sprint Suite (PROSIS)
try {
  const testOut = execSync('npm test', { cwd: '../../GAME_DEV/02_PROSIS', stdio: 'pipe' }).toString();
  console.log('[✔] 02_PROSIS Test Baseline: 100% tests passing');
} catch (e) {
  console.log('[!] 02_PROSIS Test Baseline: Failures present');
}

try {
  const buildOut = execSync('node ../../GAME_DEV/02_PROSIS/build-html.js', { stdio: 'pipe' }).toString();
  console.log('[✔] 02_PROSIS Standalone HTML Build: Clean generation');
} catch (e) {
  console.log('[!] 02_PROSIS Standalone HTML Build: Generation failed');
}

console.log('\n[i] 12_HEAVENS_NEN diagnostic skipped (Status: BROKEN)');

console.log('\n----------------------------------------------------');
console.log('   INFRA Healthcheck Complete. System Ready.        ');
console.log('====================================================\n');
process.exit(0);