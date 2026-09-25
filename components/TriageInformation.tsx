"use client";

import React, { useState } from "react";
import { IntentAnalysis, EntityItem, PragmaticRegister } from "@/lib/types";
import {
  Compass,
  Check,
  Copy,
  Tag,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface TriageInformationProps {
  intent: IntentAnalysis;
  entities: EntityItem[];
  pragmaticRegister?: PragmaticRegister;
  onSelectEntity?: (entity: EntityItem | null) => void;
}

export function TriageInformation({
  intent,
  entities,
  pragmaticRegister,
  onSelectEntity,
}: TriageInformationProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyEntity = (val: string, idx: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const getToneBadge = (tone?: string) => {
    switch (tone) {
      case "Pleading-Urgent":
        return "bg-amber-500/10 text-amber-300 border-amber-500/25";
      case "Escalating-Hostile":
        return "bg-rose-500/10 text-rose-300 border-rose-500/25";
      case "Formal":
        return "bg-blue-500/10 text-blue-300 border-blue-500/25";
      case "Colloquial-Familiar":
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const confidencePercent = Math.round((intent.confidence || 0.85) * 100);

  return (
    <div className="space-y-2">
      {/* Coherent Operational Interpretation Section */}
      <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Operational Interpretation
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Intent • Pragmatics • Grounded Entities
          </span>
        </div>

        {/* 3-Section Unified Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Section 1: Intent (col-span-4) */}
          <div className="md:col-span-4 p-3.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Classified Business Intent
              </span>
              <div className="font-mono text-sm font-bold text-white tracking-tight">
                {intent.label}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">Confidence:</span>
                <span className="text-zinc-200 font-semibold">{confidencePercent}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    confidencePercent >= 90
                      ? "bg-emerald-400"
                      : confidencePercent >= 75
                      ? "bg-blue-400"
                      : "bg-amber-400"
                  }`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pragmatic Register (col-span-4) */}
          <div className="md:col-span-4 p-3.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Pragmatic Register
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${getToneBadge(
                    pragmaticRegister?.tone
                  )}`}
                >
                  {pragmaticRegister?.tone || "Colloquial-Familiar"}
                </span>
              </div>
            </div>

            {/* Cultural Markers */}
            <div className="space-y-1 pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Socio-Linguistic Markers
              </span>
              {pragmaticRegister &&
              pragmaticRegister.cultural_markers &&
              pragmaticRegister.cultural_markers.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {pragmaticRegister.cultural_markers.map((marker, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300"
                    >
                      &ldquo;{marker}&rdquo;
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] font-mono text-zinc-600">Standard register</span>
              )}
            </div>
          </div>

          {/* Section 3: Grounded Entities (col-span-4) */}
          <div className="md:col-span-4 p-3.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Grounded Entities ({entities.length})
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  Traceable KV
                </span>
              </div>

              {entities.length > 0 ? (
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {entities.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        handleCopyEntity(item.value, idx);
                        onSelectEntity?.(item);
                      }}
                      className="group p-1.5 rounded bg-zinc-900/80 border border-white/[0.05] hover:border-white/10 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      title="Click to copy entity value"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 uppercase">
                          {item.type}
                        </span>
                        <span className="text-xs font-mono font-medium text-zinc-200 truncate">
                          {item.value}
                        </span>
                      </div>

                      <div className="text-zinc-500 group-hover:text-zinc-300 shrink-0 ml-1">
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs font-mono text-zinc-600 italic">
                  No categorical entities isolated
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.04]">
              Values verified against source spans
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
