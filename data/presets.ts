import { DemoPreset } from "@/lib/types";

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "hinglish_delivery",
    name: "1. Hinglish Delivery Complaint",
    badge: "Hinglish (Hindi + English)",
    language: "Hinglish",
    text: "Bhai kl parcel deliver ni hua, plz check kro na wrna refund initiate kr do ASAP",
    expectedResult: {
      original_text: "Bhai kl parcel deliver ni hua, plz check kro na wrna refund initiate kr do ASAP",
      detected_languages: ["Hindi", "English"],
      phenomena: [
        "Code-Switching (Hindi matrix + English nouns/verbs)",
        "Phonetic Romanization ('kl' -> कल, 'ni' -> नहीं)",
        "Informal Phonetic Abbreviations ('plz' -> please, 'wrna' -> वरना)",
        "Imperative Suffixing ('kro', 'kr do')"
      ],
      tokens: [
        { raw: "Bhai", language: "Hindi", type: "Romanized Honorific", script: "Devanagari", normalized: "भाई", confidence: 0.99, explanation: "Hindi vocative for brother" },
        { raw: "kl", language: "Hindi", type: "Phonetic Abbreviation", script: "Devanagari", normalized: "कल", confidence: 0.97, explanation: "Phonetic short form for 'kal' (yesterday/tomorrow, context: past)" },
        { raw: "parcel", language: "English", type: "Standard Loanword", script: "Latin", normalized: "पार्सल", confidence: 0.99, explanation: "English noun integrated into Hindi grammar" },
        { raw: "deliver", language: "English", type: "Standard Loanword", script: "Latin", normalized: "डिलीवर", confidence: 0.99, explanation: "English verb stem" },
        { raw: "ni", language: "Hindi", type: "Phonetic Negation", script: "Devanagari", normalized: "नहीं", confidence: 0.99, explanation: "Crucial negation marker 'nahi' spelled phonetically as 'ni'" },
        { raw: "hua", language: "Hindi", type: "Romanized Auxiliary", script: "Devanagari", normalized: "हुआ", confidence: 0.98, explanation: "Past tense copula/aspect" },
        { raw: "plz", language: "English", type: "Phonetic Slang", script: "Latin", normalized: "please", confidence: 0.99, explanation: "Standard internet shortform for 'please'" },
        { raw: "check", language: "English", type: "Standard Loanword", script: "Latin", normalized: "चेक", confidence: 0.99, explanation: "English verb loanword" },
        { raw: "kro", language: "Hindi", type: "Romanized Imperative", script: "Devanagari", normalized: "करो", confidence: 0.98, explanation: "Imperative verb form of 'karna'" },
        { raw: "na", language: "Hindi", type: "Discourse Particle", script: "Devanagari", normalized: "ना", confidence: 0.95, explanation: "Persuasive sentence-final tag particle" },
        { raw: "wrna", language: "Hindi", type: "Phonetic Conjunction", script: "Devanagari", normalized: "वरना", confidence: 0.98, explanation: "Phonetic spelling for 'warna' (otherwise / or else)" },
        { raw: "refund", language: "English", type: "Standard Loanword", script: "Latin", normalized: "रिफंड", confidence: 0.99, explanation: "Business noun" },
        { raw: "initiate", language: "English", type: "Standard Loanword", script: "Latin", normalized: "इनिशिएट", confidence: 0.99, explanation: "Business verb" },
        { raw: "kr", language: "Hindi", type: "Light Verb Stem", script: "Devanagari", normalized: "कर", confidence: 0.98, explanation: "Conjunct verb operator" },
        { raw: "do", language: "Hindi", type: "Vector Auxiliary", script: "Devanagari", normalized: "दो", confidence: 0.98, explanation: "Benefactive auxiliary verb 'dena'" },
        { raw: "ASAP", language: "English", type: "Acronym", script: "Latin", normalized: "ASAP (as soon as possible)", confidence: 0.99, explanation: "Urgency acronym" }
      ],
      canonical_script: "भाई कल पार्सल डिलीवर नहीं हुआ, प्लीज चेक करो ना वरना रिफंड इनिशिएट कर दो ASAP",
      english_translation: "Brother, the parcel was not delivered yesterday. Please check it, or else initiate the refund as soon as possible.",
      intent: {
        label: "DELIVERY_ISSUE",
        confidence: 0.98
      },
      entities: [
        { type: "STATUS", value: "not delivered (ni hua)" },
        { type: "ITEM", value: "parcel" },
        { type: "TIMEFRAME", value: "yesterday (kl)" },
        { type: "REQUESTED_ACTION", value: "refund initiate" },
        { type: "URGENCY", value: "ASAP" }
      ],
      verification: {
        entities_preserved: true,
        numbers_preserved: true,
        negation_preserved: true,
        schema_valid: true,
        details: {
          numbers_found_original: [],
          numbers_found_target: [],
          negation_markers_found: ["ni (नहीं)"],
          negation_preserved_in_english: true,
          issues: []
        }
      },
      model_source: "demo-fallback"
    }
  },
  {
    id: "arabizi_traffic",
    name: "2. Arabizi Traffic Delay",
    badge: "Arabizi (Arabic 3rb + English)",
    language: "Arabizi",
    text: "Yalla ya bro, el traffic ktir ktir zameh today, 7awel to arrive b4 8:00",
    expectedResult: {
      original_text: "Yalla ya bro, el traffic ktir ktir zameh today, 7awel to arrive b4 8:00",
      detected_languages: ["Arabic (Levantine)", "English"],
      phenomena: [
        "Arabizi Numerals ('7' for Arabic voiceless pharyngeal fricative /ح/ - Ḥā')",
        "Alphanumeric English Contraction ('b4' -> before)",
        "Code-Switching (Arabic dialect particles + English loanwords)",
        "Intensifier Reduplication ('ktir ktir' -> very heavy / a lot)"
      ],
      tokens: [
        { raw: "Yalla", language: "Arabic", type: "Romanized Interjection", script: "Arabic", normalized: "يلا", confidence: 0.99, explanation: "Common Levantine/Gulf urge particle 'come on / hurry'" },
        { raw: "ya", language: "Arabic", type: "Vocative Particle", script: "Arabic", normalized: "يا", confidence: 0.99, explanation: "Arabic vocative call 'O / hey'" },
        { raw: "bro", language: "English", type: "Colloquial Slang", script: "Latin", normalized: "أخي (bro)", confidence: 0.98, explanation: "Informal English address term" },
        { raw: "el", language: "Arabic", type: "Romanized Definite Article", script: "Arabic", normalized: "الـ", confidence: 0.99, explanation: "Levantine definite article 'al-'" },
        { raw: "traffic", language: "English", type: "Standard Loanword", script: "Latin", normalized: "سير / ترافيك", confidence: 0.99, explanation: "English traffic loanword" },
        { raw: "ktir", language: "Arabic", type: "Romanized Adjective", script: "Arabic", normalized: "كتير", confidence: 0.98, explanation: "Levantine for 'much / very'" },
        { raw: "ktir", language: "Arabic", type: "Reduplication Intensifier", script: "Arabic", normalized: "كتير", confidence: 0.98, explanation: "Repetition expressing 'extremely / intense'" },
        { raw: "zameh", language: "Arabic", type: "Romanized Noun", script: "Arabic", normalized: "زحمة", confidence: 0.97, explanation: "Levantine dialect spelling for 'za7ma' (traffic congestion)" },
        { raw: "today", language: "English", type: "Standard Temporal", script: "Latin", normalized: "اليوم", confidence: 0.99, explanation: "Temporal adverb" },
        { raw: "7awel", language: "Arabic", type: "Arabizi Numeral ('7' = ح)", script: "Arabic", normalized: "حاول", confidence: 0.99, explanation: "Imperative verb 'hawel' (try) using '7' for 'ح'" },
        { raw: "to", language: "English", type: "Infinitive Marker", script: "Latin", normalized: "أن", confidence: 0.99, explanation: "Standard English grammar" },
        { raw: "arrive", language: "English", type: "Standard Verb", script: "Latin", normalized: "تصل", confidence: 0.99, explanation: "English verb" },
        { raw: "b4", language: "English", type: "Phonetic / Alphanumeric", script: "Latin", normalized: "before (قبل)", confidence: 0.99, explanation: "Internet contraction for 'before'" },
        { raw: "8:00", language: "Other", type: "Time Numeral", script: "Latin", normalized: "8:00 (الساعة 8:00)", confidence: 0.99, explanation: "Exact time entity" }
      ],
      canonical_script: "يلا يا bro، الـ traffic كتير كتير زحمة today، حاول to arrive قبل 8:00",
      english_translation: "Come on brother, the traffic is very congested today, try to arrive before 8:00.",
      intent: {
        label: "TRAFFIC_DELAY",
        confidence: 0.96
      },
      entities: [
        { type: "TIME_DEADLINE", value: "before 8:00" },
        { type: "CONDITION", value: "heavy traffic (ktir ktir zameh)" },
        { type: "ACTION_REQ", value: "try to arrive early" }
      ],
      verification: {
        entities_preserved: true,
        numbers_preserved: true,
        negation_preserved: true,
        schema_valid: true,
        details: {
          numbers_found_original: ["8:00"],
          numbers_found_target: ["8:00"],
          negation_markers_found: [],
          negation_preserved_in_english: true,
          issues: []
        }
      },
      model_source: "demo-fallback"
    }
  }
];
