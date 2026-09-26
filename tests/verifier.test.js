const test = require('node:test');
const assert = require('node:assert');

let runDeterministicVerification;

test.before(async () => {
  const mod = await import('../lib/verifier.ts');
  runDeterministicVerification = mod.runDeterministicVerification;
});

test('verifier: 100/100 perfect score on compliant analysis', () => {
  const input = "Bhai kl parcel deliver ni hua, 4200 rupees deduct ho gye";
  const analysis = {
    tokens: [
      { raw: "Bhai", is_negation: false, start_idx: 0, end_idx: 4 },
      { raw: "ni", is_negation: true, start_idx: 23, end_idx: 25 },
      { raw: "4200", is_negation: false, start_idx: 36, end_idx: 40 }
    ],
    canonical_script: "भाई कल पार्सल डिलीवर नहीं हुआ, 4200 रुपये कट गए",
    english_translation: "Brother, parcel was not delivered, 4200 rupees were deducted.",
    intent: { label: "DELIVERY_ISSUE", confidence: 0.95 },
    entities: [{ type: "AMOUNT", value: "4200 rupees" }]
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.integrity_score, 100);
  assert.strictEqual(report.schema_valid, true);
  assert.strictEqual(report.span_alignment_valid, true);
  assert.strictEqual(report.numeric_parity, true);
  assert.strictEqual(report.negation_parity, true);
  assert.strictEqual(report.entities_preserved, true);
});

test('REGRESSION: Arabizi word "7awelt" must NOT be treated as a quantitative number', () => {
  const input = "Ya habibi el order ma wosel b4 5pm, 7awelt kaza mara, cancel it ASAP";
  const analysis = {
    tokens: [
      { raw: "Ya", is_negation: false, start_idx: 0, end_idx: 2 },
      { raw: "ma", is_negation: true, start_idx: 19, end_idx: 21 },
      { raw: "5pm", is_negation: false, start_idx: 31, end_idx: 34 },
      { raw: "7awelt", is_negation: false, start_idx: 36, end_idx: 42 }
    ],
    canonical_script: "يا حبيبي الطلب ما وصل قبل 5:00 مساءً، حاولت كذا مرة، إلغيه بأسرع وقت",
    english_translation: "My friend, the order did not arrive before 5:00 PM. I tried multiple times, please cancel it as soon as possible.",
    intent: { label: "CANCELLATION", confidence: 0.95 },
    entities: [{ type: "TIME", value: "5:00 PM" }]
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.numeric_parity, true, "Numeric parity should pass: 5pm preserved as 5:00 PM, 7awelt should not be flagged as missing number");
});

test('REGRESSION: Substring false-positive — quantity "5" must NOT pass when target says "500"', () => {
  const input = "Deliver 5 packages please";
  const analysis = {
    tokens: [
      { raw: "5", is_negation: false, start_idx: 8, end_idx: 9 }
    ],
    canonical_script: "Deliver 500 packages",
    english_translation: "Please deliver 500 packages.", // Target says 500, not 5
    intent: { label: "DELIVERY", confidence: 0.9 },
    entities: []
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.numeric_parity, false, "Numeric parity should FAIL because quantity 5 is not preserved as standalone quantity");
});

test('REGRESSION: Bidirectional negation parity — positive source flipping to negative translation must FAIL', () => {
  const input = "Please deliver the order today";
  const analysis = {
    tokens: [
      { raw: "deliver", is_negation: false, start_idx: 7, end_idx: 14 }
    ],
    canonical_script: "Please deliver the order today",
    english_translation: "Do not deliver the order today.", // Inverted polarity hallucination!
    intent: { label: "DELIVERY", confidence: 0.9 },
    entities: []
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.negation_parity, false, "Negation parity should FAIL when positive input is translated as negative");
});

test('REGRESSION: Entity grounding — hallucinated entity not present in input or output must FAIL', () => {
  const input = "Order deliver ni hua";
  const analysis = {
    tokens: [
      { raw: "ni", is_negation: true, start_idx: 14, end_idx: 16 }
    ],
    canonical_script: "Order deliver nahi hua",
    english_translation: "Order was not delivered.",
    intent: { label: "DELIVERY", confidence: 0.9 },
    entities: [{ type: "TRACKING_NUMBER", value: "XYZ_FAKE_99999" }] // Ungrounded hallucination!
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.entities_preserved, false, "Entity preservation should FAIL for ungrounded hallucinated entities");
});

test('HERO DEMO: "Wait for me parcel me rakh do" homograph preset passes 100/100 verification', async () => {
  const { DEMO_PRESETS } = await import('../data/presets.ts');
  const heroPreset = DEMO_PRESETS.find(p => p.id === "homograph_collision_hero");
  assert.ok(heroPreset, "Hero preset must exist in DEMO_PRESETS");

  const modAlign = await import('../lib/span-aligner.ts');
  const spanResult = modAlign.alignTokenSpans(heroPreset.text, heroPreset.expectedResult.tokens);
  assert.strictEqual(spanResult.all_spans_valid, true);

  const report = runDeterministicVerification(heroPreset.text, heroPreset.expectedResult, spanResult);
  assert.strictEqual(report.integrity_score, 100);
  assert.strictEqual(report.numeric_parity, true);
  assert.strictEqual(report.negation_parity, true);
  assert.strictEqual(report.entities_preserved, true);
  assert.strictEqual(report.span_alignment_valid, true);
});

