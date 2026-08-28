import { test } from "node:test";
import assert from "node:assert/strict";

import { initialState } from "../mechanics";
import {
  clearRunHistory,
  clearRunState,
  getRunHistory,
  HISTORY_KEY,
  loadRunState,
  recordRunHistory,
  SAVE_KEY,
  saveRunState,
} from "../persistence";

test("persistence: SAVE_KEY and HISTORY_KEY export expected values", () => {
  assert.strictEqual(SAVE_KEY, "PROSIS_RUN_SAVE_v1");
  assert.strictEqual(HISTORY_KEY, "PROSIS_RUN_HISTORY_v1");
});

test("persistence: saveRunState, loadRunState, and clearRunState work as expected", () => {
  clearRunState();
  assert.strictEqual(loadRunState(), null);

  const state = initialState("ricky");
  state.round = 5;
  state.entropy = 42;

  saveRunState(state);
  const loaded = loadRunState();
  assert.ok(loaded);
  assert.strictEqual(loaded?.round, 5);
  assert.strictEqual(loaded?.entropy, 42);

  clearRunState();
  assert.strictEqual(loadRunState(), null);
});

test("persistence: recordRunHistory and getRunHistory append and retrieve records", () => {
  const initialHistory = getRunHistory();
  const summary1 = { round: 3, causeOfLoss: "entropy overflow", sector: 1 };
  recordRunHistory(summary1);

  const history = getRunHistory();
  assert.strictEqual(history.length, initialHistory.length + 1);
  const last = history[history.length - 1];
  assert.ok(last);
  assert.strictEqual(last.round, 3);
  assert.strictEqual(last.causeOfLoss, "entropy overflow");
  assert.strictEqual(last.sector, 1);

  clearRunHistory();
  assert.strictEqual(getRunHistory().length, 0);
});
