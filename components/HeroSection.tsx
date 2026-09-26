"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Terminal, ShieldCheck, Sparkles, FileText } from "lucide-react";

interface HeroSectionProps {
  onOpenDocs: () => void;
}

export function HeroSection({ onOpenDocs }: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Hero Visual: Transformation Pipeline */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-[#27272a] bg-[#0f0f12] p-2 sm:p-4 shadow-xl overflow-hidden">
            {/* Minimalist Top Window Chrome */}
            <div className="h-7 px-3 flex items-center justify-between border-b border-[#27272a]/60 text-[11px] font-mono text-[#71717a] mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
                  <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
                  <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
                </div>
                <span className="text-[#a1a1aa] ml-2">pipeline_schematic.v1</span>
              </div>
              <span className="text-[10px] text-[#10b981] font-mono">AST Traceability: 100%</span>
            </div>

            {/* Transformation schematic asset */}
            <div className="relative rounded-xl overflow-hidden bg-[#09090b] border border-[#27272a]/40 p-4 sm:p-6 flex items-center justify-center">
              <Image
                src="/assets/vernactriage-transformation.png"
                alt="VernacTriage Transformation Pipeline: Raw Code-Switched Input to Structured Business Payload"
                width={860}
                height={280}
                className="w-full h-auto object-contain max-h-[300px]"
                priority
              />
            </div>

            {/* Subtle caption footer */}
            <div className="mt-3 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-[#71717a]">
              <span>Stage 1: Raw Romanized Ingestion</span>
              <span className="text-[#a1a1aa]">→ Stage 3: Homograph Disambiguation →</span>
              <span className="text-[#10b981]">Stage 5: Enterprise JSON Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
