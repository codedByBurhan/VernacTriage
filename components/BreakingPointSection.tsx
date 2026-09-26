"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export function BreakingPointSection() {
  return (
    <section id="problem" className="py-20 sm:py-28 border-t border-[#27272a] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#22d3ee]">
            <Image
              src="/assets/icon-homograph-collision.png"
              alt="Homograph Collision"
              width={16}
              height={22}
              className="h-4 w-auto object-contain"
            />
            <span className="uppercase tracking-wider">THE BREAKING POINT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa] leading-tight">
            Why Generic Pipelines Struggle with Code-Switched Dialects
          </h2>

          <p className="text-base text-[#a1a1aa] leading-relaxed">
            When speakers blend linguistic systems, identical character sequences represent fundamentally
            conflicting syntactic classes across intersecting grammars. Without contextual homograph resolution,
            standard models misclassify vital instructions.
          </p>
        </div>

        {/* The Collision Core Case */}
        <div className="rounded-2xl border border-[#27272a] bg-[#0f0f12] p-5 sm:p-6 space-y-6">
          {/* Raw Input Banner */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-wider block">
              Case Study: Cross-Lingual Homograph Collision
            </span>

            <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] font-mono text-sm sm:text-base text-[#fafafa] flex flex-wrap items-center gap-2">
              <span>Wait</span>
              <span>for</span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#3f3f46] text-[#fafafa] font-bold">
                me
              </span>
              <span>parcel</span>
              <span>box</span>
              <span className="px-2 py-0.5 rounded bg-[#22d3ee]/20 border border-[#22d3ee] text-[#22d3ee] font-bold">
                me
              </span>
              <span>rakh</span>
              <span>do</span>
              <span>plz</span>
            </div>
            <p className="text-xs font-mono text-[#71717a]">
              Notice identical token <code className="text-[#fafafa] font-bold">me</code> appears twice with
              radically different grammatical roles.
            </p>
          </div>

          {/* Comparison Split Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Traditional NLP Pipeline */}
            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                  <span className="font-mono text-xs font-semibold text-[#fafafa] uppercase">
                    Generic Machine Translation
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#f43f5e] px-2 py-0.5 rounded bg-[#f43f5e]/10 border border-[#f43f5e]/30">
                  Semantic Degradation
                </span>
              </div>

              {/* Analysis */}
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Homograph Token Disambiguation</span>
                  <div className="text-[#f43f5e] space-y-0.5">
                    <div>1st &quot;me&quot; → English Pronoun (me)</div>
                    <div>2nd &quot;me&quot; → English Pronoun (me) <span className="text-[#71717a]">[Degraded]</span></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Reconstructed English Translation</span>
                  <p className="text-sm font-sans text-[#a1a1aa] line-through decoration-[#f43f5e]">
                    &quot;Wait for me parcel box I keep please.&quot;
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Downstream Workflow Consequence</span>
                  <p className="text-[11px] text-[#71717a]">
                    Grammatical failure: Logistics bot misinterprets customer as asking the courier to wait,
                    dropping the instruction to place the item inside the container.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: VernacTriage Disambiguation */}
            <div className="rounded-xl border border-[#10b981]/50 bg-[#09090b] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="font-mono text-xs font-semibold text-[#fafafa] uppercase">
                    VernacTriage Lexical Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10b981] px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                  Exact Disambiguation
                </span>
              </div>

              {/* Analysis */}
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Homograph Token Disambiguation</span>
                  <div className="text-[#fafafa] space-y-0.5">
                    <div>1st &quot;me&quot; [9, 11] → English Pronoun (me)</div>
                    <div className="text-[#10b981]">
                      2nd &quot;me&quot; [23, 25] → Hindi Locative Postposition (में / inside)
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Canonical English Translation</span>
                  <p className="text-sm font-sans text-[#fafafa] font-medium">
                    &quot;Wait for me, please put the parcel in the box.&quot;
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a]/60 space-y-1">
                  <span className="text-[10px] text-[#71717a] block">Downstream Workflow Consequence</span>
                  <p className="text-[11px] text-[#10b981]">
                    Intent classified as <code className="text-[#fafafa]">DELIVERY_INSTRUCTION</code>. Correctly dispatches
                    drop-off note to delivery agent app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
