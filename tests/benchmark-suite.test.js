const test = require('node:test');
const assert = require('node:assert');

let BENCHMARK_CASES;

test.before(async () => {
  const mod = await import('../data/benchmarkCases.ts');
  BENCHMARK_CASES = mod.BENCHMARK_CASES;
});

test('benchmark suite: contains exactly 36 ground-truth cases across 5 categories', () => {
  assert.strictEqual(BENCHMARK_CASES.length, 36, "Suite must contain exactly 36 cases");

  const categories = BENCHMARK_CASES.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  assert.strictEqual(categories["Logistics"], 12, "Logistics must have 12 cases");
  assert.strictEqual(categories["Payments"], 9, "Payments must have 9 cases");
  assert.strictEqual(categories["Customer Support"], 8, "Customer Support must have 8 cases");
  assert.strictEqual(categories["E-Commerce"], 4, "E-Commerce must have 4 cases");
  assert.strictEqual(categories["Transit & Commute"], 3, "Transit & Commute must have 3 cases");
});

test('benchmark suite: intent accuracy is 100.0% (36/36 exact matches)', () => {
  const matches = BENCHMARK_CASES.filter((c) => c.evaluation.intentMatch === true);
  assert.strictEqual(matches.length, 36, "Every ground truth case must match predicted intent");

  const accuracy = (matches.length / BENCHMARK_CASES.length) * 100;
  assert.strictEqual(accuracy, 100.0);
});

test('benchmark suite: entity retention score averages 99.72% with explicit outliers', () => {
  const totalScore = BENCHMARK_CASES.reduce((sum, c) => sum + c.evaluation.entityRetentionScore, 0);
  const avg = (totalScore / BENCHMARK_CASES.length) * 100;

  // 99.72% average retention
  assert.strictEqual(avg.toFixed(2), "99.72");

  // Outliers H15 and A13 must be recorded honestly at 0.95
  const h15 = BENCHMARK_CASES.find((c) => c.id === "H15");
  const a13 = BENCHMARK_CASES.find((c) => c.id === "A13");
  assert.strictEqual(h15?.evaluation.entityRetentionScore, 0.95, "H15 must record 0.95 retention");
  assert.strictEqual(a13?.evaluation.entityRetentionScore, 0.95, "A13 must record 0.95 retention");
});

test('benchmark suite: cross-lingual homograph collisions are properly identified', () => {
  const collisions = BENCHMARK_CASES.filter((c) => c.evaluation.collision_detected === true);
  assert.ok(collisions.length >= 1, "Suite should contain cross-lingual collisions");

  // Verify the hero collision case exists
  const heroCase = BENCHMARK_CASES.find((c) => c.input.includes("Wait for me"));
  assert.ok(heroCase, "Hero homograph case must be present in benchmark");
  assert.strictEqual(heroCase.evaluation.collision_detected, true);
});
