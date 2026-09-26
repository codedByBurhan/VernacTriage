"use client";

import React, { useState } from "react";
import { ArrowRight, Terminal, ShieldCheck, Sparkles, FileText, CheckCircle2, Zap, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onOpenDocs: () => void;
}

export function HeroSection({ onOpenDocs }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"collision" | "arabizi" | "hinglish">("collision");

  const examples = {
    collision: {
      name: "Cross-Lingual Collision",
      pair: "Hinglish (Hindi-English)",
      rawWords: [
        { text: "Wait for", type: "plain" },
        { text: "me", type: "en_pronoun", note: "English Pronoun [9..11]" },
        { text: "parcel box", type: "plain" },
        { text: "me", type: "hi_locative", note: "Hindi 'में' [23..25]" },
        { text: "rakh do plz", type: "plain" },
      ],
      disambiguation: "Resolves 2nd 'me' as Hindi locative postposition (में / inside box) instead of pronoun duplicate.",
      canonical: "वेट फॉर मी, पार्सल बॉक्स में रख दो प्लीज",
      english: "Wait for me, please put the parcel in the box.",
      json: {
        intent: "DELIVERY_INSTRUCTION",
        target: "LOGISTICS_SERVICE",
        action: "UPDATE_DELIVERY_NOTES",
      },
    },
    arabizi: {
      name: "Arabizi Escalation",
      pair: "Arabizi (Arabic-English)",
      rawWords: [
        { text: "Ya habibi el order", type: "plain" },
        { text: "ma wosel", type: "hi_locative", note: "Arabic Negation 'ما وصل'" },
        { text: "b4", type: "en_pronoun", note: "Alphanumeric 'before'" },
        { text: "5pm,", type: "plain" },
        { text: "7awelt", type: "hi_locative", note: "7 = Hā' / 'حاولت'" },
        { text: "cancel it ASAP", type: "en_pronoun", note: "Urgent Imperative" },
      ],
      disambiguation: "Substitutes Arabizi digits (7→ح) and English phonetics (b4→before) with negation parity intact.",
      canonical: "يا حبيبي الطلب ما وصل قبل 5:00 مساءً، حاولت، إلغيه بأسرع وقت",
      english: "My friend, the order did not arrive before 5:00 PM. I tried, please cancel it ASAP.",
      json: {
        intent: "CANCELLATION_REQUEST",
        target: "CUSTOMER_SUPPORT",
        priority: "P1",
      },
    },
    hinglish: {
      name: "Hinglish Logistics",
      pair: "Hinglish (Hindi-English)",
      rawWords: [
        { text: "Bhai", type: "plain" },
        { text: "kl", type: "en_pronoun", note: "Phonetic 'कल' (yesterday)" },
        { text: "parcel deliver", type: "plain" },
        { text: "ni hua,", type: "hi_locative", note: "Negation 'नहीं हुआ'" },
        { text: "plz refund initiate kr do", type: "plain" },
      ],
      disambiguation: "Locks phonetic negation ('ni' → नहीं) to prevent customer dispute misrouting.",
      canonical: "भाई कल पार्सल डिलीवर नहीं हुआ, प्लीज रिफंड इनिशिएट कर दो",
      english: "Brother, the parcel was not delivered yesterday. Please initiate the refund.",
      json: {
        intent: "DELIVERY_ISSUE",
        target: "LOGISTICS_SERVICE",
        action: "INITIATE_REFUND",
      },
    },
  };

  const current = examples[activeTab];

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Copy */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27272a] bg-[#0f0f12] text-xs font-mono text-[#a1a1aa]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#fafafa] font-medium">LINGUISTIC INTELLIGENCE INFRASTRUCTURE</span>
            <span className="text-[#3f3f46]">●</span>
            <span>GEMINI FLASH</span>
            <span className="text-[#3f3f46]">●</span>
            <span className="text-[#10b981]">DETERMINISTIC VERIFIED</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#fafafa] leading-[1.08]">
            The Lexical Compiler <br className="hidden sm:inline" />
            <span className="text-[#a1a1aa]">for the Unwritten Internet.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
            Reconstruct code-switched vernaculars (Hinglish, Arabizi) into canonical native script, 
            standardized business English, and deterministic machine payloads with zero semantic drift.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <a
              href="#compiler"
              className="px-5 py-2.5 rounded-lg bg-[#fafafa] hover:bg-white text-[#09090b] font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Try Live Compiler</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#architecture"
              className="px-5 py-2.5 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f12] text-[#fafafa] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Architecture</span>
            </a>

            <button
              type="button"
              onClick={onOpenDocs}
              className="px-4 py-2.5 rounded-lg border border-transparent hover:border-[#27272a] bg-transparent text-[#71717a] hover:text-[#a1a1aa] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
          </div>
        </div>

        {/* Refined Live Transformation Visual Terminal */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#27272a] bg-[#0f0f12] shadow-2xl overflow-hidden">
            {/* Minimalist Top Window Chrome */}
            <div className="px-4 py-2.5 border-b border-[#27272a] bg-[#09090b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                </div>
                <span className="text-[#a1a1aa] font-semibold text-[11px] hidden sm:inline">
                  transformation_schematic.v1
                </span>
              </div>

              {/* Sample Switcher Tabs */}
              <div className="flex items-center gap-1.5">
                {(["collision", "arabizi", "hinglish"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#18181b] border border-[#3f3f46] text-[#fafafa] font-semibold"
                        : "text-[#71717a] hover:text-[#a1a1aa]"
                    }`}
                  >
                    {tab === "collision"
                      ? "Homograph Collision"
                      : tab === "arabizi"
                      ? "Arabizi Escalation"
                      : "Hinglish Logistics"}
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#10b981]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AST Traceability: 100%</span>
              </div>
            </div>

            {/* Main Visual Workspace: Left Input -> Middle Engine -> Right Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#27272a] p-4 sm:p-6 bg-[#09090b]/40 gap-6 lg:gap-0">
              {/* Left Column: Raw Ingest & Disambiguation Details (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:pr-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#71717a] uppercase text-[10px] tracking-wider">
                      Input Stream [Raw Vernacular]
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#22d3ee] text-[10px] font-mono">
                      {current.pair}
                    </span>
                  </div>

                  {/* Raw Text with Token Highlight Cards */}
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#09090b] space-y-3">
                    <div className="font-mono text-sm sm:text-base text-[#fafafa] leading-relaxed flex flex-wrap items-center gap-1.5">
                      {current.rawWords.map((w, idx) => {
                        if (w.type === "en_pronoun") {
                          return (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#18181b] border border-[#3f3f46] text-[#fafafa] font-bold inline-block"
                              title={w.note}
                            >
                              {w.text}
                            </span>
                          );
                        }
                        if (w.type === "hi_locative") {
                          return (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#22d3ee]/15 border border-[#22d3ee] text-[#22d3ee] font-bold inline-block"
                              title={w.note}
                            >
                              {w.text}
                            </span>
                          );
                        }
                        return <span key={idx}>{w.text}</span>;
                      })}
                    </div>

                    {/* Token Annotation Pills */}
                    <div className="pt-2 border-t border-[#27272a]/60 space-y-1.5 text-[11px] font-mono">
                      {current.rawWords
                        .filter((w) => w.note)
                        .map((w, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[#a1a1aa]">
                            <span className="text-[#10b981]">●</span>
                            <span className="text-[#fafafa] font-semibold">{w.text}:</span>
                            <span className="text-[#71717a]">{w.note}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Linguistic Logic Banner */}
                <div className="p-3 rounded-lg border border-[#27272a] bg-[#0f0f12] text-xs font-mono text-[#a1a1aa] flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-[#22d3ee] shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">{current.disambiguation}</p>
                </div>
              </div>

              {/* Right Column: 3-Layer Enterprise Reconstruction (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-3.5 lg:pl-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#71717a] uppercase text-[10px] tracking-wider">
                    Compiled Output [Canonical &amp; Typed Enterprise]
                  </span>
                  <span className="text-[#10b981] text-[10px] font-mono font-semibold">
                    100/100 Invariant Score
                  </span>
                </div>

                {/* Layer 1: Canonical Native Script */}
                <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#09090b] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block tracking-wider">
                    Layer 1: Canonical Native Script
                  </span>
                  <p className="text-base sm:text-lg font-devanagari text-[#fafafa] leading-snug">
                    {current.canonical}
                  </p>
                </div>

                {/* Layer 2: Business English */}
                <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#09090b] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block tracking-wider">
                    Layer 2: Standardized Business English
                  </span>
                  <p className="text-sm font-sans text-[#fafafa] font-medium leading-relaxed">
                    &quot;{current.english}&quot;
                  </p>
                </div>

                {/* Layer 3: Machine Action Payload */}
                <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#09090b] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#71717a]">
                    <span>Layer 3: Typed Enterprise Action Payload</span>
                    <span className="text-[#22d3ee] font-semibold">JSON CONTRACT</span>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-[#0f0f12] border border-[#27272a]/70 text-[11px] font-mono text-[#22d3ee] overflow-x-auto leading-relaxed">
                    {JSON.stringify(current.json, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Bottom Footer Caption */}
            <div className="px-4 py-3 border-t border-[#27272a] bg-[#09090b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#71717a]">
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">✓ Zero Semantic Drift</span>
                <span className="text-[#3f3f46]">|</span>
                <span>Latency: ~640ms</span>
                <span className="text-[#3f3f46]">|</span>
                <span>Gemini Flash Engine</span>
              </div>

              <a
                href="#compiler"
                className="text-[#fafafa] hover:text-[#10b981] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>Test Custom Input in Playground</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
