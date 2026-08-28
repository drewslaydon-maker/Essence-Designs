const NE = typeof NenEngine !== 'undefined' ? NenEngine : (typeof require !== 'undefined' ? require('./nen-engine.js') : null);

// Mock localStorage for Node.js environments
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
let memoryStore = {};

function getStorage() {
  if (isBrowser) return window.localStorage;
  return {
    getItem(key) { return memoryStore[key] || null; },
    setItem(key, value) { memoryStore[key] = String(value); },
    removeItem(key) { delete memoryStore[key]; }
  };
}

const SAVE_KEY = 'HEAVENS_NEN_CAMPAIGN_SAVE';

function saveCampaignState(campaignState) {
  try {
    const storage = getStorage();
    storage.setItem(SAVE_KEY, JSON.stringify(campaignState));
    return true;
  } catch (err) {
    return false;
  }
}

function loadCampaignState() {
  try {
    const storage = getStorage();
    const data = storage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

function clearCampaignState() {
  try {
    const storage = getStorage();
    storage.removeItem(SAVE_KEY);
    return true;
  } catch (err) {
    return false;
  }
}

function serializeBuild(fighter) {
  const payload = {
    name: fighter.name,
    category: fighter.category,
    maxHp: fighter.maxHp,
    maxAura: fighter.maxAura,
    baseAtk: fighter.baseAtk,
    baseDef: fighter.baseDef,
    speed: fighter.speed,
    hatsuList: fighter.hatsuList || []
  };

  const jsonStr = JSON.stringify(payload);
  const base64Str = typeof btoa === 'function' 
    ? btoa(jsonStr) 
    : Buffer.from(jsonStr).toString('base64');
    
  return `NEN-BUILD-v1-${base64Str}`;
}

function deserializeBuild(buildCode) {
  if (!buildCode || typeof buildCode !== 'string') {
    return null;
  }

  const prefix = 'NEN-BUILD-v1-';
  if (!buildCode.startsWith(prefix)) {
    return null;
  }

  try {
    const base64Str = buildCode.substring(prefix.length);
    const jsonStr = typeof atob === 'function'
      ? atob(base64Str)
      : Buffer.from(base64Str, 'base64').toString('utf8');

    const payload = JSON.parse(jsonStr);

    if (!payload.name || !payload.category) {
      return null;
    }

    return NE.createFighter(payload);
  } catch (err) {
    return null;
  }
}

const PersistenceEngine = {
  saveCampaignState,
  loadCampaignState,
  clearCampaignState,
  serializeBuild,
  deserializeBuild
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PersistenceEngine;
}
if (typeof window !== 'undefined') {
  window.PersistenceEngine = PersistenceEngine;
}
