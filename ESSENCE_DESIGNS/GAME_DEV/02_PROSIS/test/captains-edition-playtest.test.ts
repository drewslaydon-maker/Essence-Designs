import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getShipName,
  setShipName,
  getCaptainsManifest,
  recordManifestEntry,
  clearCaptainsManifest,
  getUnlockedLoreIds,
  unlockLoreId,
  isLoreUnlocked,
  getUnlockedAchievementIds,
  unlockAchievementId,
  isAchievementUnlocked,
  calculateRunScore,
  getHighScores,
  submitHighScore,
  clearHighScores,
  getCaptainProfile,
  saveCaptainProfile,
  clearCaptainProfile,
  getCosmeticsProfile,
  unlockHullSkin,
  unlockScoutBadge,
  clearCosmeticsProfile,
} from "../persistence";
import { calculateRunAnalytics, processRunCompletion } from "../analytics";
import { initialState } from "../mechanics";
import { computeReveal } from "../gtl";
import type { LogEntry, LogicState } from "../types";
import {
  SPAGHETTI_RUNES,
  canEquipRune,
  equipRune,
  unequipRune,
  calculateCombinedRuneEffects,
  applyRuneScoreModifiers,
  MAX_RUNES_PER_RUN,
} from "../runes";
import {
  WDT_SCENARIOS,
  evaluateDiagnosticResult,
  getCalibrationPatch,
} from "../wdt";
import {
  getAudioPrefs,
  saveAudioPrefs,
  startAmbientPad,
  stopAmbientPad,
  toggleMute,
  isMuted,
  playSFX,
  AUDIO_PREFS_KEY,
} from "../audio";
import fs from "node:fs";
import path from "node:path";

describe("Captain's Edition Headless Feature Playtest", () => {
  it("Ship Naming & Manifest Persistence", () => {
    setShipName("USSC VOID WALKER");
    assert.strictEqual(getShipName(), "USSC VOID WALKER");

    clearCaptainsManifest();
    assert.strictEqual(getCaptainsManifest().length, 0);

    const entry1 = recordManifestEntry({
      shipName: getShipName(),
      captainName: "Ricky",
      sector: 1,
      round: 8,
      causeOfLoss: "Systems collapsed under cascading pressure.",
      anchorPersona: "ricky",
    });

    assert.ok(entry1.id);
    assert.ok(entry1.date);
    const logs1 = getCaptainsManifest();
    assert.strictEqual(logs1.length, 1);
    assert.strictEqual(logs1[0]?.shipName, "USSC VOID WALKER");

    const entry2 = recordManifestEntry({
      shipName: getShipName(),
      captainName: "Maude",
      sector: 3,
      round: 30,
      causeOfLoss: "VICTORY! Escaped Sector 3!",
      anchorPersona: "maude",
    });

    const logs2 = getCaptainsManifest();
    assert.strictEqual(logs2.length, 2);
    // Manifest prepends latest entry first
    assert.strictEqual(logs2[0]?.causeOfLoss, "VICTORY! Escaped Sector 3!");
    assert.strictEqual(logs2[1]?.causeOfLoss, "Systems collapsed under cascading pressure.");
  });

  it("Lore Signal Unlocks Progression", () => {
    unlockLoreId("sig_01");
    assert.ok(isLoreUnlocked("sig_01"));

    unlockLoreId("sig_03");
    unlockLoreId("sig_05");
    unlockLoreId("sig_06");
    unlockLoreId("sig_08");

    const unlocked = getUnlockedLoreIds();
    assert.ok(unlocked.includes("sig_01"));
    assert.ok(unlocked.includes("sig_03"));
    assert.ok(unlocked.includes("sig_05"));
    assert.ok(unlocked.includes("sig_06"));
    assert.ok(unlocked.includes("sig_08"));
  });

  it("Achievements Medal Collection Progression", () => {
    unlockAchievementId("ach_first_warp");
    unlockAchievementId("ach_sector_2");
    unlockAchievementId("ach_sector_3");
    unlockAchievementId("ach_morale_high");
    unlockAchievementId("ach_victory");

    const unlockedAch = getUnlockedAchievementIds();
    assert.ok(unlockedAch.length >= 5);
    assert.ok(isAchievementUnlocked("ach_victory"));
  });

  it("Standalone index.html Modal Wiring Integrity Check", () => {
    const p1 = path.resolve(process.cwd(), "index.html");
    const p2 = path.resolve(process.cwd(), "ESSENCE_DESIGNS/GAME_DEV/02_PROSIS/index.html");
    const targetPath = fs.existsSync(p1) ? p1 : p2;
    assert.ok(fs.existsSync(targetPath), `index.html must exist at ${targetPath}`);
    const htmlContent = fs.readFileSync(targetPath, "utf-8");

    // Check modal states exist
    assert.ok(htmlContent.includes("briefingOpen"), "briefingOpen state must exist");
    assert.ok(htmlContent.includes("manifestOpen"), "manifestOpen state must exist");
    assert.ok(htmlContent.includes("loreOpen"), "loreOpen state must exist");
    assert.ok(htmlContent.includes("achievementsOpen"), "achievementsOpen state must exist");
    assert.ok(htmlContent.includes("wdtOpen"), "wdtOpen state must exist");
    assert.ok(htmlContent.includes("profileOpen"), "profileOpen state must exist");
    assert.ok(htmlContent.includes("leaderboardOpen"), "leaderboardOpen state must exist");

    // Check modal element IDs exist
    assert.ok(htmlContent.includes("wdtModal"), "wdtModal must exist");
    assert.ok(htmlContent.includes("profileModal"), "profileModal must exist");
    assert.ok(htmlContent.includes("leaderboardModal"), "leaderboardModal must exist");

    // Check modal title headers exist
    assert.ok(htmlContent.includes("TACTICAL BRIEFING"), "Tactical Briefing modal title must exist");
    assert.ok(htmlContent.includes("CAPTAIN'S MANIFEST"), "Captain's Manifest modal title must exist");
    assert.ok(htmlContent.includes("LORE SIGNALS"), "Lore Signals modal title must exist");
    assert.ok(htmlContent.includes("ACHIEVEMENTS"), "Achievements modal title must exist");
    assert.ok(htmlContent.includes("QUANTUM CALIBRATION"), "WDT modal title must exist");
    assert.ok(htmlContent.includes("CAPTAIN PROFILE"), "Captain Profile modal title must exist");
    assert.ok(htmlContent.includes("ARCADE LEADERBOARD"), "Leaderboard modal title must exist");

    // Check HUD element containers exist
    assert.ok(htmlContent.includes("rune-slot") || htmlContent.includes("runeInventory"), "rune-slot must exist");
    assert.ok(htmlContent.includes("ttf-radar-gauge") || htmlContent.includes("ttfRadarGauge") || htmlContent.includes("RADAR GAUGE"), "ttf-radar-gauge must exist");

    // Check black hole SVG logo component
    assert.ok(htmlContent.includes("eventHorizonGlow"), "Black Hole SVG logo must exist");
    assert.ok(htmlContent.includes("prOsis"), "prOsis logo text must exist");
  });

  it("Audio Engine Headless Safety & Preference Persistence", () => {
    assert.strictEqual(AUDIO_PREFS_KEY, "PROSIS_AUDIO_PREFS_v1");

    // Test preferences default and saving
    const defaultPrefs = getAudioPrefs();
    assert.strictEqual(typeof defaultPrefs.muted, "boolean");

    saveAudioPrefs({ muted: true, volume: 0.4 });
    assert.strictEqual(getAudioPrefs().muted, true);
    assert.strictEqual(getAudioPrefs().volume, 0.4);

    saveAudioPrefs({ muted: false, volume: 0.8 });
    assert.strictEqual(getAudioPrefs().muted, false);
    assert.strictEqual(getAudioPrefs().volume, 0.8);

    // Test toggleMute
    const newMuted = toggleMute();
    assert.strictEqual(isMuted(), newMuted);

    // Test headless execution safety (no window/AudioContext)
    assert.doesNotThrow(() => {
      startAmbientPad();
      stopAmbientPad();
      playSFX("warp_transit");
      playSFX("ui_click");
      playSFX("alert_threat");
      playSFX("barrier_claim");
    });
  });

  it("WDT Diagnostic Calculation", () => {
    assert.ok(WDT_SCENARIOS.length >= 3);

    // Scenario answers favoring Ricky (option a)
    const rickyAnswers: Record<string, string> = {
      wdt_01: "wdt_01_opt_a",
      wdt_02: "wdt_02_opt_a",
      wdt_03: "wdt_03_opt_a",
      wdt_04: "wdt_04_opt_a",
    };
    const rickyDominant = evaluateDiagnosticResult(rickyAnswers);
    assert.strictEqual(rickyDominant, "ricky");

    // Scenario answers favoring Maude (option b)
    const maudeAnswers: Record<string, string> = {
      wdt_01: "wdt_01_opt_b",
      wdt_02: "wdt_02_opt_b",
      wdt_03: "wdt_03_opt_b",
      wdt_04: "wdt_04_opt_b",
    };
    const maudeDominant = evaluateDiagnosticResult(maudeAnswers);
    assert.strictEqual(maudeDominant, "maude");

    // Scenario answers favoring Dez (option c)
    const dezAnswers: Record<string, string> = {
      wdt_01: "wdt_01_opt_c",
      wdt_02: "wdt_02_opt_c",
      wdt_03: "wdt_03_opt_c",
      wdt_04: "wdt_04_opt_c",
    };
    const dezDominant = evaluateDiagnosticResult(dezAnswers);
    assert.strictEqual(dezDominant, "dez");

    // Calibration patch generation
    const patchRicky = getCalibrationPatch("ricky");
    assert.strictEqual(patchRicky.personaId, "ricky");
    assert.ok(patchRicky.svg.includes("<svg"));

    const patchMaude = getCalibrationPatch("maude");
    assert.strictEqual(patchMaude.personaId, "maude");
    assert.ok(patchMaude.recommendedLoadout.startingRuneId);

    const patchDez = getCalibrationPatch("dez");
    assert.strictEqual(patchDez.personaId, "dez");
    assert.ok(patchDez.title);
  });

  it("Rune Equipping & Math", () => {
    assert.strictEqual(MAX_RUNES_PER_RUN, 3);
    assert.ok(SPAGHETTI_RUNES.length >= 6);

    const rune0 = SPAGHETTI_RUNES[0]!;
    const rune1 = SPAGHETTI_RUNES[1]!;
    const rune2 = SPAGHETTI_RUNES[2]!;
    const rune3 = SPAGHETTI_RUNES[3]!;

    let runes: typeof SPAGHETTI_RUNES = [];
    assert.ok(canEquipRune(runes, rune0.id));

    runes = equipRune(runes, rune0);
    runes = equipRune(runes, rune1);
    runes = equipRune(runes, rune2);
    assert.strictEqual(runes.length, 3);

    // Slot cap enforcement
    assert.strictEqual(canEquipRune(runes, rune3.id), false);
    const cappedRunes = equipRune(runes, rune3);
    assert.strictEqual(cappedRunes.length, 3);

    // Duplicate enforcement
    assert.strictEqual(canEquipRune(runes, rune0.id), false);

    // Unequip
    runes = unequipRune(runes, rune0.id);
    assert.strictEqual(runes.length, 2);
    assert.ok(canEquipRune(runes, rune0.id));

    // Effect combining math
    const testSet = [rune0, rune1]; // Chronos Anchor (1.25 mult, 5 shield) & Singularity Catalyst (1.15 mult, 5000 flat)
    const combined = calculateCombinedRuneEffects(testSet);
    assert.strictEqual(combined.scoreMultiplier, 1.40);
    assert.strictEqual(combined.flatScore, 5000);
    assert.strictEqual(combined.moraleShielding, 5);

    // Score multiplier calculation
    const baseScore = 1000;
    const finalScore = applyRuneScoreModifiers(baseScore, testSet);
    // (1000 + 5000) * 1.40 = 8400
    assert.strictEqual(finalScore, 8400);
  });

  it("High Score Calculation & Leaderboard Persistence", () => {
    // Formula math verification
    const rounds = 10;
    const sector = 2;
    const morale = 80;
    const entropy = 20;
    const runeCount = 2;
    const score = calculateRunScore(rounds, sector, morale, entropy, runeCount);
    // (10 * 1000) + (2 * 5000) + (80 * 50) - (20 * 30) + (2 * 2500) = 10000 + 10000 + 4000 - 600 + 5000 = 28400
    assert.strictEqual(score, 28400);

    // Floor at 0 minimum
    const negativeScore = calculateRunScore(0, 0, 0, 500, 0);
    assert.strictEqual(negativeScore, 0);

    // Leaderboard persistence & sorting
    clearHighScores();
    assert.strictEqual(getHighScores().length, 0);

    submitHighScore({
      shipName: "SS Vanguard",
      captainCallsign: "NEXUS",
      score: 15000,
      rounds: 12,
      sector: 2,
      morale: 50,
      entropy: 10,
      anchorPersona: "ricky",
      hullSkin: "chrome",
      equippedRuneIds: ["chronos-anchor"],
    });

    submitHighScore({
      shipName: "SS Eclipse",
      captainCallsign: "ACE",
      score: 35000,
      rounds: 25,
      sector: 3,
      morale: 90,
      entropy: 5,
      anchorPersona: "maude",
      hullSkin: "gold",
      equippedRuneIds: ["chronos-anchor", "singularity-catalyst"],
    });

    submitHighScore({
      shipName: "SS Nova",
      captainCallsign: "ROOKIE",
      score: 5000,
      rounds: 4,
      sector: 1,
      morale: 30,
      entropy: 40,
      anchorPersona: "dez",
      hullSkin: "titanium",
      equippedRuneIds: [],
    });

    const leaderboard = getHighScores();
    assert.strictEqual(leaderboard.length, 3);
    assert.strictEqual(leaderboard[0]?.score, 35000);
    assert.strictEqual(leaderboard[0]?.captainCallsign, "ACE");
    assert.strictEqual(leaderboard[1]?.score, 15000);
    assert.strictEqual(leaderboard[2]?.score, 5000);
  });

  it("Captain Profile & Cosmetics Progression", () => {
    clearCaptainProfile();
    clearCosmeticsProfile();

    const defaultProfile = getCaptainProfile();
    assert.strictEqual(defaultProfile.captainCallsign, "CAPTAIN");
    assert.strictEqual(defaultProfile.helmName, "Helm");
    assert.strictEqual(defaultProfile.geneName, "Gene");
    assert.strictEqual(defaultProfile.salName, "Sal");

    const defaultCosmetics = getCosmeticsProfile();
    assert.strictEqual(defaultCosmetics.unlockedHullSkins.length, 1);
    assert.strictEqual(defaultCosmetics.unlockedHullSkins[0], "titanium");
    assert.strictEqual(defaultCosmetics.unlockedBadges.ricky.length, 0);
    assert.strictEqual(defaultCosmetics.unlockedBadges.maude.length, 0);
    assert.strictEqual(defaultCosmetics.unlockedBadges.dez.length, 0);

    // Custom crew renaming
    const updatedProfile = saveCaptainProfile({
      captainCallsign: "STARS",
      helmName: "Sasha",
      geneName: "Dr. Vance",
      salName: "Jax",
    });
    assert.strictEqual(updatedProfile.helmName, "Sasha");
    assert.strictEqual(updatedProfile.geneName, "Dr. Vance");
    assert.strictEqual(updatedProfile.salName, "Jax");
    assert.strictEqual(getCaptainProfile().helmName, "Sasha");

    // Hull skin unlocks
    unlockHullSkin("chrome");
    unlockHullSkin("gold");
    const cosmeticsWithSkins = getCosmeticsProfile();
    assert.ok(cosmeticsWithSkins.unlockedHullSkins.includes("chrome"));
    assert.ok(cosmeticsWithSkins.unlockedHullSkins.includes("gold"));

    // Scout Badge tracking
    unlockScoutBadge("ricky", "badge_ricky_clutch");
    unlockScoutBadge("maude", "badge_maude_shield");
    unlockScoutBadge("dez", "badge_dez_defiance");
    const cosmeticsWithBadges = getCosmeticsProfile();
    assert.ok(cosmeticsWithBadges.unlockedBadges.ricky.includes("badge_ricky_clutch"));
    assert.ok(cosmeticsWithBadges.unlockedBadges.maude.includes("badge_maude_shield"));
    assert.ok(cosmeticsWithBadges.unlockedBadges.dez.includes("badge_dez_defiance"));
  });

  it("Post-Mortem Analytics Engine Test", () => {
    const mockLog: LogEntry[] = [
      { type: "threat", category: "targeted", dmg: "15.5", hits: "systems", mitigated: false },
      { type: "threat", category: "telegraphed", dmg: "20.0", hits: "entropy", mitigated: true },
      { type: "threat", category: "cascading", dmg: 10, hits: "re", mitigated: false },
      { type: "bank_claimed", front: "systems", payout: 25.5, moraleGain: 5 },
      { type: "defiance", from: "Shield Overdrive", to: "Quantum Anchor", level: "III" },
    ];

    const analytics = calculateRunAnalytics(mockLog, 15, 2, 75, 20, 2);

    assert.strictEqual(analytics.totalDamageTaken, 45.5);
    assert.strictEqual(analytics.damageByFront.systems, 15.5);
    assert.strictEqual(analytics.damageByFront.entropy, 20.0);
    assert.strictEqual(analytics.damageByFront.re, 10.0);
    assert.strictEqual(analytics.barriersClaimed, 1);
    assert.strictEqual(analytics.barrierPayoutTotal, 25.5);
    assert.strictEqual(analytics.threatsMitigated, 1);
    assert.strictEqual(analytics.defianceEventsFired, 1);
    assert.ok(analytics.finalScore > 0);
  });

  it("End-to-End Run Completion Test", () => {
    clearHighScores();
    clearCaptainsManifest();

    const mockState: LogicState = {
      started: true,
      round: 12,
      entropy: 40,
      systems: 0,
      re: 80,
      morale: 60,
      salvage: 10,
      axisCounts: { low: 5, high: 5, desperate: 2 },
      totalActions: 12,
      log: [
        { type: "threat", category: "targeted", dmg: 30, hits: "systems", mitigated: false },
        { type: "defiance", from: "Repair", to: "Emergency Shield", level: "II" },
      ],
      gameOver: "Systems failure. Nothing left holding the ship together.",
      lossType: "mechanical",
      lastBreakdown: null,
      incomingThreat: null,
      incomingEventId: null,
      usedEventIds: [],
      pendingRelief: 0,
      pendingLullBonus: 0,
      players: [],
      salvageTarget: "auto",
      anchorPersona: "dez",
      beliefOrTrust: 50,
      beliefReady: false,
      distrust: 20,
      defianceChance: 0.1,
      maudeCoverTarget: null,
      maudeConsecutiveCoverage: 0,
      activeModifiers: {},
      openBanks: [],
      lastDefiance: null,
      equippedRunes: [],
    };

    const captainProfile = getCaptainProfile();
    const completion = processRunCompletion(mockState, "USSC ENDEAVOUR", captainProfile);

    assert.ok(completion.analytics);
    assert.ok(completion.highScore);
    assert.strictEqual(completion.highScore.shipName, "USSC ENDEAVOUR");
    assert.strictEqual(completion.highScore.rounds, 12);
    assert.strictEqual(completion.highScore.sector, 2);

    const highScores = getHighScores();
    assert.ok(highScores.some((h) => h.id === completion.highScore.id));
  });

  it("HTML Orbital Logo & Post-Mortem Modal Verification", () => {
    const p1 = path.resolve(process.cwd(), "index.html");
    const p2 = path.resolve(process.cwd(), "ESSENCE_DESIGNS/GAME_DEV/02_PROSIS/index.html");
    const htmlPath = fs.existsSync(p1) ? p1 : p2;
    assert.ok(fs.existsSync(htmlPath), `index.html must exist at ${htmlPath}`);

    const htmlContent = fs.readFileSync(htmlPath, "utf-8");

    // Verify orbital logo elements & keyframe classes
    assert.ok(htmlContent.includes("prosis-logo-container"), "Must contain prosis orbital logo container");
    assert.ok(htmlContent.includes("accretion-disk"), "Must contain accretion-disk CSS class");
    assert.ok(htmlContent.includes("accretion-ring"), "Must contain accretion-ring CSS class");
    assert.ok(htmlContent.includes("accretion-particle"), "Must contain accretion-particle CSS class");
    assert.ok(htmlContent.includes("orbit-letter"), "Must contain orbit-letter CSS class");

    // Verify Game Over & Post-Mortem Modal elements
    assert.ok(htmlContent.includes("gameOverModal"), "Must contain gameOverModal element");
    assert.ok(htmlContent.includes("postMortemAnalytics"), "Must contain postMortemAnalytics element");
  });

  it("Launch Voyage State Verification", () => {
    const base = initialState("ricky");
    assert.strictEqual(base.started, false);

    // Trigger launchVoyage state transformation
    const reveal = computeReveal(1, 0, base.axisCounts, 0, []);
    const launchedState: LogicState = {
      ...base,
      started: true,
      round: 1,
      entropy: reveal.entropy,
      incomingThreat: reveal.incoming,
      incomingEventId: reveal.eventId,
      log: [{ type: "intro" }],
      equippedRunes: base.equippedRunes || [],
      helmName: base.helmName || "Helm",
      geneName: base.geneName || "Gene",
      salName: base.salName || "Sal",
      hullSkin: base.hullSkin || "titanium",
    };

    assert.strictEqual(launchedState.started, true);
    assert.strictEqual(launchedState.round, 1);
    assert.ok(Array.isArray(launchedState.equippedRunes), "equippedRunes must be an array");
    assert.ok(launchedState.helmName, "helmName must be populated");
    assert.ok(launchedState.geneName, "geneName must be populated");
    assert.ok(launchedState.salName, "salName must be populated");
    assert.ok(launchedState.hullSkin, "hullSkin must be populated");
  });

});
