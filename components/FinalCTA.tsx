"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 border-t border-[#27272a] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27272a] bg-[#0f0f12] text-xs font-mono text-[#a1a1aa]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>DEVELOPER INFRASTRUCTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fafafa] leading-tight">
            Compile the language your systems weren&apos;t built to understand.
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            Eliminate communication breakdown in high-growth vernacular markets. Ingest unstructured code-switched
            streams with deterministic invariant verification.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <a
              href="#compiler"
              className="px-5 py-2.5 rounded-lg bg-[#fafafa] hover:bg-white text-[#09090b] font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Compiler</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#architecture"
              className="px-5 py-2.5 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f12] text-[#fafafa] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Architecture</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
