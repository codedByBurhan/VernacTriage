"use client";

import React from "react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { IntentAnalysis, PragmaticRegister } from "@/lib/types";
import { Compass, AlertTriangle, Sparkles, Tag, ShieldAlert } from "lucide-react";

interface TriageRibbonProps {
  intent?: IntentAnalysis | null;
  pragmaticRegister?: PragmaticRegister | null;
  detectedPair?: string;
}

export function TriageRibbon({
  intent,
  pragmaticRegister,
  detectedPair = "Hinglish (Hindi-English)",
}: TriageRibbonProps) {
  const intentLabel = intent?.label || "DELIVERY_INSTRUCTION";
  const confidence = Math.round((intent?.confidence || 0.98) * 100);
  const tone = pragmaticRegister?.tone || "Colloquial-Familiar";
  const markers = pragmaticRegister?.cultural_markers || ["bhai", "plz"];

  return (
    <SpotlightCard className="p-2.5 border border-[#1f1f23] shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Left: Intent Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-indigo-400 uppercase font-bold">Intent:</span>
            <span className="font-bold text-white text-[11px] tracking-tight">{intentLabel}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
              {confidence}%
            </span>
          </div>

          {/* Center: Pragmatic Register Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-amber-400 uppercase font-bold">Register:</span>
            <span className="font-bold text-white text-[11px] tracking-tight">{tone}</span>
          </div>
        </div>

        {/* Right: Cultural Markers Pills */}
        <div className="flex items-center gap-1 text-[10px] overflow-x-auto">
          <span className="text-[#71717a] uppercase tracking-wider text-[9px] mr-1 hidden sm:inline">
            Markers:
          </span>
          {markers.map((marker, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-[#16161b] border border-[#27272a] text-[#a1a1aa] font-medium"
            >
              &ldquo;{marker}&rdquo;
            </span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
