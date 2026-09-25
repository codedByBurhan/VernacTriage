"use client";

import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Binary,
  Ban,
  Tag,
  Crosshair,
  BarChart3,
  Terminal,
} from "lucide-react";

interface LandingSectionProps {
  onOpenConsole: (presetId?: string) => void;
  onOpenEvaluation: () => void;
}

export function LandingSection({
  onOpenConsole,
  onOpenEvaluation,
}: LandingSectionProps) {
  return (
    <div className="space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[#a1a1aa] text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
          Enterprise Cross-Dialect Linguistic Intelligence
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f4f4f5] leading-[1.1]">
          Understand what your customers <br className="hidden sm:block" />
          <span className="text-[#a1a1aa]">actually said.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto font-sans leading-relaxed">
          VernacTriage reconstructs code-switched, phonetic, and romanized
          customer messages into canonical language, structured intent, and
          auditable business data.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenConsole()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#f4f4f5] hover:bg-white text-[#09090b] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Triage Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenEvaluation}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#f4f4f5] font-medium text-sm transition-colors cursor-pointer"
          >
            View Evaluation (36 Cases)
          </button>
        </div>
      </section>

      {/* HERO PRODUCT VISUAL: Real Product Pipeline Representation */}
      <section className="max-w-5xl mx-auto">
        <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 sm:p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f22] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#a1a1aa]" />
              <span className="font-semibold uppercase tracking-wider text-[#f4f4f5]">
                Real-Time Linguistic Reconstruction
              </span>
            </div>
            <span className="text-[10px] text-[#71717a]">
              Pipeline: Raw → Token Spans → Canonical Script → Integrity Gate
            </span>
          </div>

          {/* Visual Progression */}
          <div className="space-y-4 font-mono text-xs">
            {/* Step 1: Raw Customer Message */}
            <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#71717a] uppercase tracking-wider">
                <span>01 Raw Customer Message (Hinglish Code-Switched)</span>
                <span className="text-[#a1a1aa]">Input Stream</span>
              </div>
              <p className="text-sm text-[#f4f4f5] font-mono">
                &ldquo;Wait for me parcel box me rakh do plz&rdquo;
              </p>
            </div>

            {/* Step 2: Token Stream & Span Alignment */}
            <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-2">
              <div className="flex items-center justify-between text-[10px] text-[#71717a] uppercase tracking-wider">
                <span>02 Token Reconstruction &amp; Disambiguation</span>
                <span className="text-[#22c55e]">Exact Character Offsets</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  Wait <span className="text-[9px] text-[#71717a]">[0..4]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  for <span className="text-[9px] text-[#71717a]">[5..8]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-blue-500/30 text-blue-300">
                  me <span className="text-[9px] text-blue-400/70">EN·PRON [9..11]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  parcel <span className="text-[9px] text-[#71717a]">[12..18]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  box <span className="text-[9px] text-[#71717a]">[19..22]</span>
                </span>
                <span className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
                  me <span className="text-[9px] text-amber-400">HI·POSTP [23..25] ⚠ COLLISION</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-amber-500/30 text-amber-200">
                  rakh <span className="text-[9px] text-amber-400/70">HI·VERB [26..30]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  do <span className="text-[9px] text-[#71717a]">[31..33]</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                  plz <span className="text-[9px] text-[#71717a]">[34..37]</span>
                </span>
              </div>
            </div>

            {/* Step 3: Dual Canonical Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                  03 Canonical Native Script
                </span>
                <p className="text-sm font-sans text-[#f4f4f5]">
                  वेट फॉर मी, पार्सल बॉक्स में रख दो प्लीज
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                  04 Standard Business English
                </span>
                <p className="text-sm font-sans text-[#a1a1aa]">
                  &ldquo;Wait for me, please put the parcel in the box.&rdquo;
                </p>
              </div>
            </div>

            {/* Step 4: Deterministic Audit & Action Bar */}
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[#22c55e] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>INTEGRITY GATE: 100/100</span>
                </div>
                <span className="text-[#71717a] hidden sm:inline">•</span>
                <span className="text-[#a1a1aa] hidden sm:inline">
                  Intent: DELIVERY_INSTRUCTION
                </span>
                <span className="text-[#71717a] hidden md:inline">•</span>
                <span className="text-[#a1a1aa] hidden md:inline">
                  Tone: Familiar-Colloquial
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenConsole("hinglish_collision")}
                className="px-3 py-1 rounded bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-[#f4f4f5] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Inspect in Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3 CONCEPTUAL STEPS */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
            From messy input to structured intelligence
          </h2>
          <p className="text-sm text-[#a1a1aa] max-w-xl mx-auto">
            A three-stage lexical architecture built for mission-critical enterprise workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 01 Reconstruct */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
            <span className="font-mono text-xs font-bold text-[#6366f1]">01</span>
            <h3 className="text-base font-semibold text-[#f4f4f5]">Reconstruct</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
              Morphological decomposition of code-switched vernaculars. Resolves
              phonetic spellings, Arabizi numerals, and homograph collisions to
              canonical native scripts.
            </p>
          </div>

          {/* 02 Verify */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
            <span className="font-mono text-xs font-bold text-[#22c55e]">02</span>
            <h3 className="text-base font-semibold text-[#f4f4f5]">Verify</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
              Deterministic post-generation invariant assertions. Audits exact
              character span offsets, numerical parity, negation polarity, and
              entity retention with zero self-evaluation bias.
            </p>
          </div>

          {/* 03 Dispatch */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
            <span className="font-mono text-xs font-bold text-[#a1a1aa]">03</span>
            <h3 className="text-base font-semibold text-[#f4f4f5]">Dispatch</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
              Downstream operational action payloads formatted for immediate ERP,
              CRM, or ticketing automation with priority levels and traceable key-values.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: DESIGNED FOR MESSY REAL-WORLD LANGUAGE */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f4f4f5]">
            Designed for messy real-world language
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Engineered specifically for the linguistic phenomena that cause generic NLP models to fail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Hinglish Example Card */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
              <span className="text-[#a1a1aa] font-semibold uppercase text-[10px]">
                Case 01 · Hinglish Cross-Lingual Collision
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Homograph Disambiguation
              </span>
            </div>

            <p className="text-sm text-[#f4f4f5] bg-[#09090b] p-3 rounded-lg border border-[#1f1f22]">
              &ldquo;Wait for me parcel box me rakh do plz&rdquo;
            </p>

            <div className="space-y-1.5 text-[#a1a1aa] font-sans">
              <p className="leading-relaxed">
                The token <code className="text-amber-300 font-mono">me</code> occurs twice. The first is English pronoun (<em>for me</em>); the second is Hindi postposition (<em>बॉक्स में</em>).
              </p>
              <div className="text-[11px] text-[#22c55e] flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disambiguated in Collision Ledger
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenConsole("hinglish_collision")}
              className="text-xs text-[#6366f1] hover:text-[#818cf8] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Test this case</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Arabizi Example Card */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
              <span className="text-[#a1a1aa] font-semibold uppercase text-[10px]">
                Case 02 · Arabizi Numeral Phonetics &amp; Escalation
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Arabizi 3rb
              </span>
            </div>

            <p className="text-sm text-[#f4f4f5] bg-[#09090b] p-3 rounded-lg border border-[#1f1f22]">
              &ldquo;Ya habibi el order ma wosel b4 5pm, 7awelt kaza mara, cancel it ASAP&rdquo;
            </p>

            <div className="space-y-1.5 text-[#a1a1aa] font-sans">
              <p className="leading-relaxed">
                Contains Arabizi numeral <code className="text-purple-300 font-mono">7awelt</code> (/ح/ - Ḥā&apos;), negation <code className="text-rose-300 font-mono">ma wosel</code>, and time constraint <code className="text-zinc-300 font-mono">5pm</code>.
              </p>
              <div className="text-[11px] text-[#22c55e] flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Negation &amp; temporal parity verified
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenConsole("arabizi_escalation")}
              className="text-xs text-[#6366f1] hover:text-[#818cf8] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Test this case</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: EVERY RESULT IS AUDITABLE */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f4f4f5]">
            Every result is auditable
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Deterministic invariant assertions guarantee pipeline integrity before business action dispatch.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
            <Crosshair className="w-4 h-4 text-[#6366f1]" />
            <h4 className="font-semibold text-[#f4f4f5]">Span Alignment</h4>
            <p className="text-[11px] text-[#71717a] font-sans leading-relaxed">
              Rolling cursor calculates exact start and end byte offsets on raw customer input.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
            <Tag className="w-4 h-4 text-[#22c55e]" />
            <h4 className="font-semibold text-[#f4f4f5]">Entity Preservation</h4>
            <p className="text-[11px] text-[#71717a] font-sans leading-relaxed">
              Order numbers, tracking codes, and currencies grounded directly in verified source spans.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
            <Binary className="w-4 h-4 text-purple-400" />
            <h4 className="font-semibold text-[#f4f4f5]">Numeric Parity</h4>
            <p className="text-[11px] text-[#71717a] font-sans leading-relaxed">
              Zero tolerance for dropped amounts, prices, or quantities between source and dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#27272a] bg-[#111113] space-y-2">
            <Ban className="w-4 h-4 text-rose-400" />
            <h4 className="font-semibold text-[#f4f4f5]">Negation Parity</h4>
            <p className="text-[11px] text-[#71717a] font-sans leading-relaxed">
              Guarantees negation markers (ni, ma, nahi, no) never invert polarity in translation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="max-w-4xl mx-auto rounded-xl border border-[#27272a] bg-[#111113] p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#f4f4f5]">
          Inspect the live linguistic intelligence console
        </h3>
        <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
          Test messy multilingual customer messages, inspect cross-lingual collisions, and verify deterministic assertions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenConsole()}
            className="px-5 py-2 rounded-lg bg-[#f4f4f5] hover:bg-white text-[#09090b] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Triage Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onOpenEvaluation}
            className="px-5 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#f4f4f5] text-xs font-semibold transition-colors cursor-pointer"
          >
            View Evaluation Matrix (36 Cases)
          </button>
        </div>
      </section>
    </div>
  );
}
