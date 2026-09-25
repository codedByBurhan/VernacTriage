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
      detected_pair: "Hinglish (Hindi-English)",
      detected_languages: ["Hindi", "English"],
      phenomena: [
        "Code-Switching (Hindi matrix + English nouns/verbs)",
        "Phonetic Romanization ('kl' -> कल, 'ni' -> नहीं)",
        "Informal Phonetic Abbreviations ('plz' -> please, 'wrna' -> वरना)",
        "Imperative Suffixing ('kro', 'kr do')"
      ],
      pragmatic_register: {
        tone: "Pleading-Urgent",
        cultural_markers: ["Bhai", "plz", "na", "wrna", "ASAP"]
      },
      tokens: [
        {
          raw: "Bhai",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "भाई",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Romanized Honorific",
          script: "Devanagari",
          normalized: "भाई",
          confidence: 0.99,
          explanation: "Hindi vocative honorific for brother"
        },
        {
          raw: "kl",
          detected_language: "hi",
          classification: "phonetic_ear",
          normalized_source: "कल",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Phonetic Abbreviation",
          script: "Devanagari",
          normalized: "कल",
          confidence: 0.97,
          explanation: "Phonetic shorthand for 'kal' (yesterday/tomorrow, context: past)"
        },
        {
          raw: "parcel",
          detected_language: "en",
          classification: "standard",
          normalized_source: "parcel",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "पार्सल",
          confidence: 0.99,
          explanation: "English noun integrated into Hindi grammar"
        },
        {
          raw: "deliver",
          detected_language: "en",
          classification: "standard",
          normalized_source: "deliver",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "डिलीवर",
          confidence: 0.99,
          explanation: "English verb stem"
        },
        {
          raw: "ni",
          detected_language: "hi",
          classification: "phonetic_ear",
          normalized_source: "नहीं",
          is_negation: true,
          collision: null,
          language: "Hindi",
          type: "Phonetic Negation",
          script: "Devanagari",
          normalized: "नहीं",
          confidence: 0.99,
          explanation: "Crucial negation marker 'nahi' spelled phonetically as 'ni'"
        },
        {
          raw: "hua",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "हुआ",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Romanized Auxiliary",
          script: "Devanagari",
          normalized: "हुआ",
          confidence: 0.98,
          explanation: "Past tense copula/aspect"
        },
        {
          raw: "plz",
          detected_language: "en",
          classification: "phonetic_ear",
          normalized_source: "please",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Phonetic Slang",
          script: "Latin",
          normalized: "please",
          confidence: 0.99,
          explanation: "Standard internet shortform for 'please'"
        },
        {
          raw: "check",
          detected_language: "en",
          classification: "standard",
          normalized_source: "check",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "चेक",
          confidence: 0.99,
          explanation: "English verb loanword"
        },
        {
          raw: "kro",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "करो",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Romanized Imperative",
          script: "Devanagari",
          normalized: "करो",
          confidence: 0.98,
          explanation: "Imperative verb form of 'karna'"
        },
        {
          raw: "na",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "ना",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Discourse Particle",
          script: "Devanagari",
          normalized: "ना",
          confidence: 0.95,
          explanation: "Persuasive discourse tag particle (not negation in this context)"
        },
        {
          raw: "wrna",
          detected_language: "hi",
          classification: "phonetic_ear",
          normalized_source: "वरना",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Phonetic Conjunction",
          script: "Devanagari",
          normalized: "वरना",
          confidence: 0.98,
          explanation: "Phonetic spelling for 'warna' (otherwise / or else)"
        },
        {
          raw: "refund",
          detected_language: "en",
          classification: "standard",
          normalized_source: "refund",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "रिफंड",
          confidence: 0.99,
          explanation: "Business noun"
        },
        {
          raw: "initiate",
          detected_language: "en",
          classification: "standard",
          normalized_source: "initiate",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "इनिशिएट",
          confidence: 0.99,
          explanation: "Business verb"
        },
        {
          raw: "kr",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "कर",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Light Verb Stem",
          script: "Devanagari",
          normalized: "कर",
          confidence: 0.98,
          explanation: "Conjunct verb operator"
        },
        {
          raw: "do",
          detected_language: "hi",
          classification: "transliterated",
          normalized_source: "दो",
          is_negation: false,
          collision: null,
          language: "Hindi",
          type: "Vector Auxiliary",
          script: "Devanagari",
          normalized: "दो",
          confidence: 0.98,
          explanation: "Benefactive auxiliary verb 'dena'"
        },
        {
          raw: "ASAP",
          detected_language: "en",
          classification: "standard",
          normalized_source: "as soon as possible",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Acronym",
          script: "Latin",
          normalized: "ASAP (as soon as possible)",
          confidence: 0.99,
          explanation: "Urgency acronym"
        }
      ],
      canonical_script: "भाई कल पार्सल डिलीवर नहीं हुआ, प्लीज चेक करो ना वरना रिफंड इनिशिएट कर दो ASAP",
      canonical_native_script: "भाई कल पार्सल डिलीवर नहीं हुआ, प्लीज चेक करो ना वरना रिफंड इनिशिएट कर दो ASAP",
      english_translation: "Brother, the parcel was not delivered yesterday. Please check it, or else initiate the refund as soon as possible.",
      standard_english: "Brother, the parcel was not delivered yesterday. Please check it, or else initiate the refund as soon as possible.",
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
      action_dispatch: {
        target_service: "LOGISTICS_SERVICE",
        endpoint_action: "EXPEDITE_DELIVERY",
        parameters: {
          priority_level: "P1",
          requires_agent_review: true
        }
      },
      verification: {
        schema_valid: true,
        span_alignment_valid: true,
        numeric_parity: true,
        negation_parity: true,
        entities_preserved: true,
        integrity_score: 100,
        audit_logs: [
          "[PASS] Schema valid: Response conforms to strictly typed JSON schema.",
          "[PASS] Span alignment: Token character offsets deterministically aligned.",
          "[PASS] Numeric parity: Quantitative numerical values preserved.",
          "[PASS] Negation parity: Negation [ni] preserved in English translation.",
          "[PASS] Entity preservation: Extracted business entities validated and grounded."
        ],
        numbers_preserved: true,
        negation_preserved: true,
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
      detected_pair: "Arabizi (Arabic-English)",
      detected_languages: ["Arabic (Levantine)", "English"],
      phenomena: [
        "Arabizi Numerals ('7' for Arabic voiceless pharyngeal fricative /ح/ - Ḥā')",
        "Alphanumeric English Contraction ('b4' -> before)",
        "Code-Switching (Arabic dialect particles + English loanwords)",
        "Intensifier Reduplication ('ktir ktir' -> very heavy / a lot)"
      ],
      pragmatic_register: {
        tone: "Colloquial-Familiar",
        cultural_markers: ["Yalla", "ya", "bro", "7awel"]
      },
      tokens: [
        {
          raw: "Yalla",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "يلا",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Romanized Interjection",
          script: "Arabic",
          normalized: "يلا",
          confidence: 0.99,
          explanation: "Common Levantine/Gulf urge particle 'come on / hurry'"
        },
        {
          raw: "ya",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "يا",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Vocative Particle",
          script: "Arabic",
          normalized: "يا",
          confidence: 0.99,
          explanation: "Arabic vocative call 'O / hey'"
        },
        {
          raw: "bro",
          detected_language: "en",
          classification: "standard",
          normalized_source: "brother",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Colloquial Slang",
          script: "Latin",
          normalized: "أخي (bro)",
          confidence: 0.98,
          explanation: "Informal English address term"
        },
        {
          raw: "el",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "الـ",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Romanized Definite Article",
          script: "Arabic",
          normalized: "الـ",
          confidence: 0.99,
          explanation: "Levantine definite article 'al-'"
        },
        {
          raw: "traffic",
          detected_language: "en",
          classification: "standard",
          normalized_source: "traffic",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Loanword",
          script: "Latin",
          normalized: "سير / ترافيك",
          confidence: 0.99,
          explanation: "English traffic loanword"
        },
        {
          raw: "ktir",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "كتير",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Romanized Adjective",
          script: "Arabic",
          normalized: "كتير",
          confidence: 0.98,
          explanation: "Levantine for 'much / very'"
        },
        {
          raw: "ktir",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "كتير",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Reduplication Intensifier",
          script: "Arabic",
          normalized: "كتير",
          confidence: 0.98,
          explanation: "Repetition expressing 'extremely / intense'"
        },
        {
          raw: "zameh",
          detected_language: "ar",
          classification: "transliterated",
          normalized_source: "زحمة",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Romanized Noun",
          script: "Arabic",
          normalized: "زحمة",
          confidence: 0.97,
          explanation: "Levantine dialect spelling for 'za7ma' (traffic congestion)"
        },
        {
          raw: "today",
          detected_language: "en",
          classification: "standard",
          normalized_source: "today",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Temporal",
          script: "Latin",
          normalized: "اليوم",
          confidence: 0.99,
          explanation: "Temporal adverb"
        },
        {
          raw: "7awel",
          detected_language: "ar",
          classification: "alphanumeric_sub",
          normalized_source: "حاول",
          is_negation: false,
          collision: null,
          language: "Arabic",
          type: "Arabizi Numeral ('7' = ح)",
          script: "Arabic",
          normalized: "حاول",
          confidence: 0.99,
          explanation: "Imperative verb 'hawel' (try) using '7' for 'ح'"
        },
        {
          raw: "to",
          detected_language: "en",
          classification: "standard",
          normalized_source: "to",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Infinitive Marker",
          script: "Latin",
          normalized: "أن",
          confidence: 0.99,
          explanation: "Standard English grammar"
        },
        {
          raw: "arrive",
          detected_language: "en",
          classification: "standard",
          normalized_source: "arrive",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Standard Verb",
          script: "Latin",
          normalized: "تصل",
          confidence: 0.99,
          explanation: "English verb"
        },
        {
          raw: "b4",
          detected_language: "en",
          classification: "alphanumeric_sub",
          normalized_source: "before",
          is_negation: false,
          collision: null,
          language: "English",
          type: "Phonetic / Alphanumeric",
          script: "Latin",
          normalized: "before (قبل)",
          confidence: 0.99,
          explanation: "Internet contraction for 'before'"
        },
        {
          raw: "8:00",
          detected_language: "unknown",
          classification: "standard",
          normalized_source: "8:00",
          is_negation: false,
          collision: null,
          language: "Other",
          type: "Time Numeral",
          script: "Latin",
          normalized: "8:00 (الساعة 8:00)",
          confidence: 0.99,
          explanation: "Exact time entity"
        }
      ],
      canonical_script: "يلا يا bro، الـ traffic كتير كتير زحمة today، حاول to arrive قبل 8:00",
      canonical_native_script: "يلا يا bro، الـ traffic كتير كتير زحمة today، حاول to arrive قبل 8:00",
      english_translation: "Come on brother, the traffic is very congested today, try to arrive before 8:00.",
      standard_english: "Come on brother, the traffic is very congested today, try to arrive before 8:00.",
      intent: {
        label: "TRAFFIC_DELAY",
        confidence: 0.96
      },
      entities: [
        { type: "TIME_DEADLINE", value: "before 8:00" },
        { type: "CONDITION", value: "heavy traffic (ktir ktir zameh)" },
        { type: "ACTION_REQ", value: "try to arrive early" }
      ],
      action_dispatch: {
        target_service: "LOGISTICS_SERVICE",
        endpoint_action: "EXPEDITE_DELIVERY",
        parameters: {
          priority_level: "P2",
          requires_agent_review: false
        }
      },
      verification: {
        schema_valid: true,
        span_alignment_valid: true,
        numeric_parity: true,
        negation_parity: true,
        entities_preserved: true,
        integrity_score: 100,
        audit_logs: [
          "[PASS] Schema valid: Response conforms to strictly typed JSON schema.",
          "[PASS] Span alignment: Token character offsets deterministically aligned.",
          "[PASS] Numeric parity: Quantitative numerical values preserved (8:00).",
          "[PASS] Negation parity: Polarity consistency verified (non-negative).",
          "[PASS] Entity preservation: Extracted business entities validated and grounded."
        ],
        numbers_preserved: true,
        negation_preserved: true,
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
