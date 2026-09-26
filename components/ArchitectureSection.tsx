"use client";

import React from "react";
import Image from "next/image";
import {
  Terminal,
  Ear,
  GitFork,
  ShieldCheck,
  Send,
  ArrowDown,
  Layers,
  Sparkles,
} from "lucide-react";

export function ArchitectureSection() {
  const stages = [
    {
      step: "01",
      icon: Terminal,
      title: "Raw Ingestion & Span Indexing",
      description:
        "Preserves exact character offsets [start_idx, end_idx] across mixed Unicode, punctuation, and non-standard spacing.",
      tag: "Character-Level Traceability",
    },
    {
      step: "02",
      icon: Ear,
      title: "Phonetic Ear Reconstruction",
      description:
        "Normalizes auditory phonetic spellings and alphanumeric contractions ('kl' → कल, '7awelt' → حاولت, 'b4' → before).",
      tag: "Phonetic Normalization",
    },
    {
      step: "03",
      icon: GitFork,
      title: "Contextual Homograph Disambiguation",
      description:
        "Isolates colliding tokens like 'me' (English pronoun vs Hindi locative postposition) through surrounding syntactic dependencies.",
      tag: "Homograph Ledger",
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "Deterministic Verification Gate",
      description:
        "Evaluates numeric invariance, negation parity, AST continuity, and entity grounding to mathematically eliminate drift.",
      tag: "Invariant Verification",
    },
    {
      step: "05",
      icon: Send,
      title: "Structured Enterprise Dispatch",
      description:
        "Constructs validated, typed JSON payloads formatted for direct ingestion into CRM, logistics, and support APIs.",
      tag: "Machine Action Payload",
    },
  ];

  return (
    <section id="architecture" className="py-20 sm:py-28 border-t border-[#27272a] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="uppercase tracking-wider">COMPILER PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa] leading-tight">
            A 5-Stage Deterministic Reconstruction Pipeline
          </h2>

          <p className="text-base text-[#a1a1aa] leading-relaxed">
            VernacTriage treats code-switched vernacular as a formal compilation target rather than
            unstructured text. Every transformation step is observable, traceable, and bounded by mathematical invariants.
          </p>
        </div>

        {/* 5-Stage Horizontal / Stacked Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="relative rounded-2xl border border-[#27272a] bg-[#0f0f12] p-5 flex flex-col justify-between space-y-4 hover:border-[#3f3f46] transition-all group"
              >
                {/* Connecting hairline indicator between cards on desktop */}
                {idx < stages.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <span className="text-xs font-mono text-[#3f3f46]">→</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Step and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#71717a]">
                      STAGE {stage.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#10b981]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-[#fafafa] leading-snug">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="pt-3 border-t border-[#27272a]/60">
                  <span className="text-[10px] font-mono text-[#71717a] block truncate">
                    {stage.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
