"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Zap,
  CheckCircle2,
  Code2,
  Terminal,
  Sparkles,
  Layers,
  ArrowDown,
} from "lucide-react";

interface HeroSectionProps {
  onOpenDocs: () => void;
}

export function HeroSection({ onOpenDocs }: HeroSectionProps) {
  const [viewMode, setViewMode] = useState<"schematic" | "code">("schematic");
  const [activePreset, setActivePreset] = useState<"collision" | "arabizi" | "hinglish">("collision");

  const presetData = {
    collision: {
      name: "Homograph Collision",
      dialect: "Hinglish (Devanagari-Latn)",
      rawInput: "Wait for me parcel box me rakh do plz",
      annotations: [
        { token: "me [1st]", label: "English Pronoun (me)", color: "text-[#fafafa] bg-[#18181b] border-[#3f3f46]" },
        { token: "me [2nd]", label: "Hindi Locative (में / in)", color: "text-[#22d3ee] bg-[#22d3ee]/15 border-[#22d3ee]/40" },
      ],
      canonicalScript: "वेट फॉर मी, पार्सल बॉक्स में रख दो प्लीज",
      englishTranslation: "Wait for me, please put the parcel in the box.",
      actionDispatch: {
        intent: "DELIVERY_INSTRUCTION",
        target: "LOGISTICS_SERVICE",
        action: "UPDATE_DELIVERY_NOTES",
      },
      insight: "Syntactically disambiguates homographic 'me' tokens into English pronoun vs Hindi locative postposition 'में'.",
    },
    arabizi: {
      name: "Arabizi Escalation",
      dialect: "Arabizi (Arabic-Latn)",
      rawInput: "Ya habibi el order ma wosel b4 5pm, 7awelt, cancel it ASAP",
      annotations: [
        { token: "7awelt", label: "7 = Hā' / 'حاولت'", color: "text-[#22d3ee] bg-[#22d3ee]/15 border-[#22d3ee]/40" },
        { token: "b4 5pm", label: "Contraction 'before 5pm'", color: "text-[#fafafa] bg-[#18181b] border-[#3f3f46]" },
      ],
      canonicalScript: "يا حبيبي الطلب ما وصل قبل 5:00 مساءً، حاولت، إلغيه بأسرع وقت",
      englishTranslation: "My friend, the order did not arrive before 5:00 PM. I tried, please cancel it ASAP.",
      actionDispatch: {
        intent: "CANCELLATION_REQUEST",
        target: "CUSTOMER_SUPPORT",
        priority: "P1",
      },
      insight: "Reconstructs ASCII numeral phonetic substitutions (7→ح) with negation parity and urgency grounding intact.",
    },
    hinglish: {
      name: "Hinglish Logistics",
      dialect: "Hinglish (Hindi-English)",
      rawInput: "Bhai kl parcel deliver ni hua, plz refund initiate kr do ASAP",
      annotations: [
        { token: "kl", label: "Phonetic 'कल' (yesterday)", color: "text-[#fafafa] bg-[#18181b] border-[#3f3f46]" },
        { token: "ni hua", label: "Negation 'नहीं हुआ'", color: "text-[#10b981] bg-[#10b981]/15 border-[#10b981]/40" },
      ],
      canonicalScript: "भाई कल पार्सल डिलीवर नहीं हुआ, प्लीज रिफंड इनिशिएट कर दो ASAP",
      englishTranslation: "Brother, the parcel was not delivered yesterday. Please initiate the refund as soon as possible.",
      actionDispatch: {
        intent: "DELIVERY_ISSUE",
        target: "LOGISTICS_SERVICE",
        action: "INITIATE_REFUND",
      },
      insight: "Enforces strict negation parity ('ni' → नहीं) to prevent customer dispute misrouting.",
    },
  };

  const current = presetData[activePreset];

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

        {/* Hero Visual: Transformation Terminal with vernactriage-transformation.png centerpiece */}
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

              {/* View Mode Toggle (Schematic Graphic vs Code Stream) */}
              <div className="flex items-center p-0.5 rounded-lg border border-[#27272a] bg-[#0f0f12]">
                <button
                  type="button"
                  onClick={() => setViewMode("schematic")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "schematic"
                      ? "bg-[#18181b] text-[#fafafa] font-semibold shadow-xs"
                      : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#10b981]" />
                  <span>Schematic View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("code")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "code"
                      ? "bg-[#18181b] text-[#fafafa] font-semibold shadow-xs"
                      : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  <Code2 className="w-3 h-3 text-[#22d3ee]" />
                  <span>Code Stream</span>
                </button>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center gap-1">
                {(["collision", "arabizi", "hinglish"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivePreset(tab)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                      activePreset === tab
                        ? "bg-[#18181b] border border-[#3f3f46] text-[#fafafa]"
                        : "text-[#71717a] hover:text-[#a1a1aa]"
                    }`}
                  >
                    {tab === "collision" ? "Collision" : tab === "arabizi" ? "Arabizi" : "Hinglish"}
                  </button>
                ))}
              </div>
            </div>

            {/* Smoothly Transitioning Content Container */}
            <div className="p-5 sm:p-7 bg-[#09090b]/50">
              <AnimatePresence mode="wait">
                {viewMode === "schematic" ? (
                  /* MODE 1: VISUAL SCHEMATIC WITH CLEAR ASSET DISPLAY */
                  <motion.div
                    key="schematic"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Centered Graphic Showcase */}
                    <div className="relative rounded-2xl border border-[#27272a] bg-[#09090b] p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                      {/* Header Sub-caption */}
                      <div className="w-full relative z-10 flex items-center justify-between text-[11px] font-mono text-[#71717a] mb-6">
                        <span className="flex items-center gap-1.5 text-[#10b981]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          STAGE 01: RAW UNWRITTEN STREAM
                        </span>
                        <span className="hidden sm:inline text-[#a1a1aa] font-semibold">
                          ISOMETRIC LINGUISTIC RECONSTRUCTION
                        </span>
                        <span className="flex items-center gap-1.5 text-[#22d3ee]">
                          STAGE 05: CANONICAL SCRIPT
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                        </span>
                      </div>

                      {/* The Brand Asset: Premium Isometric SaaS Hero Illustration */}
                      <div className="relative z-10 w-full flex items-center justify-center py-4 sm:py-6">
                        <Image
                          src="/assets/premium-enterprise-saas-hero-illustration--isometr.png"
                          alt="VernacTriage Transformation Schematic: Left wing shows code-switched alphanumeric stream; central pillar represents compiler gate; right wing shows canonical Devanagari and Arabic reconstruction"
                          width={1536}
                          height={768}
                          className="w-full max-w-[520px] sm:max-w-[660px] md:max-w-[760px] lg:max-w-[820px] h-auto object-contain select-none transition-transform duration-300 hover:scale-[1.01]"
                          priority
                        />
                      </div>

                      {/* Crosshair indicators - Clean, technical, NO emoji */}
                      <div className="w-full relative z-10 mt-6 flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                        <span>[+] Matrix Code-Switching Ingest</span>
                        <span className="text-[#a1a1aa] font-medium tracking-wide">[ Contextual Disambiguation Engine ]</span>
                        <span>[+] Canonical Orthography Output</span>
                      </div>
                    </div>

                    {/* Flanking Live Context Comparison for the Active Preset */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      {/* Left: Raw Dialect Stream */}
                      <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                            Source Input [{current.dialect}]
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-[#22d3ee]">
                            Raw Buffer
                          </span>
                        </div>
                        <p className="text-sm font-mono text-[#fafafa] leading-relaxed">
                          &quot;{current.rawInput}&quot;
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {current.annotations.map((ann, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded border text-[11px] font-medium ${ann.color}`}
                            >
                              {ann.token} → {ann.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Canonical & Target Resolution */}
                      <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                            Compiled Enterprise Target
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-[10px] text-[#10b981] font-semibold">
                            100/100 Verified
                          </span>
                        </div>
                        <p className="text-base font-devanagari text-[#fafafa]">
                          {current.canonicalScript}
                        </p>
                        <p className="text-xs font-sans text-[#a1a1aa]">
                          &quot;{current.englishTranslation}&quot;
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* MODE 2: DEEP CODE STREAM VIEW (JSON & PIPELINE TELEMETRY) */
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs font-mono"
                  >
                    {/* Left: Token Analysis Breakdown (5 cols) */}
                    <div className="lg:col-span-5 space-y-3.5">
                      <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-3">
                        <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                          Ingestion Stream Details
                        </span>
                        <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a] text-[#fafafa] font-mono text-sm">
                          {current.rawInput}
                        </div>
                        <div className="p-3 rounded-lg border border-[#27272a] bg-[#09090b] text-[11px] text-[#a1a1aa] flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-[#22d3ee] shrink-0 mt-0.5" />
                          <p>{current.insight}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-2">
                        <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                          Deterministic Invariants
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded bg-[#09090b] border border-[#27272a] text-[#10b981]">
                            ✓ Numeric Parity: PASS
                          </div>
                          <div className="p-2 rounded bg-[#09090b] border border-[#27272a] text-[#10b981]">
                            ✓ Negation Parity: PASS
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Typed JSON Machine Payload (7 cols) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase text-[#71717a]">
                          <span>Structured Enterprise Dispatch</span>
                          <span className="text-[#22d3ee] font-semibold">JSON CONTRACT</span>
                        </div>
                        <pre className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[11px] text-[#22d3ee] overflow-x-auto leading-relaxed">
                          {JSON.stringify(current.actionDispatch, null, 2)}
                        </pre>
                      </div>

                      <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#0f0f12] space-y-1.5">
                        <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                          Canonical Script Layer
                        </span>
                        <p className="text-base font-devanagari text-[#fafafa]">
                          {current.canonicalScript}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
