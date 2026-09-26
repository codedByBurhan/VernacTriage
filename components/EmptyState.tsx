"use client";

import React from "react";
import Image from "next/image";
import { DEMO_PRESETS } from "@/data/presets";
import { ArrowRight, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onSelectPreset: (id: string) => void;
}

export function EmptyState({ onSelectPreset }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-[#1f1f23] bg-[#0d0d10] p-8 sm:p-10 text-center relative overflow-hidden">
      {/* Background subtle radial glow - restrained brand tint */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#00e5a0]/5 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-xl mx-auto space-y-6">
        {/* Transformation Visual Artwork */}
        <div className="flex justify-center">
          <div className="relative p-2 rounded-xl bg-[#111114]/80 border border-[#27272a]/60 shadow-xl inline-block">
            <Image
              src="/brand/vernactriage-transformation.png"
              alt="Multilingual Transformation — Code, Script & Dialect to Canonical Orthography"
              width={240}
              height={140}
              className="w-auto h-28 sm:h-32 object-contain select-none"
              priority
            />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#fafafa] font-sans">
            Decode the mess. Structure the signal.
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-lg mx-auto font-sans">
            Analyze code-switched, phonetic, and Latin-script vernacular into canonical scripts,
            business English, and structured data with mathematical invariants.
          </p>
        </div>

        {/* Curated Preset Quick-Load Tiles */}
        <div className="pt-2 space-y-2.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
            Select an operational linguistic test case:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {DEMO_PRESETS.slice(0, 4).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className="group p-3 rounded-lg bg-[#111114] hover:bg-[#18181b] border border-[#1f1f23] hover:border-[#27272a] text-xs transition-all cursor-pointer flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-[#00e5a0] uppercase tracking-wider">
                    {preset.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#71717a] group-hover:text-[#fafafa] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] font-mono text-[#a1a1aa] group-hover:text-[#fafafa] line-clamp-1">
                  &ldquo;{preset.text}&rdquo;
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
