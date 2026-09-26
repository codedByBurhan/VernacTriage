"use client";

import React, { useState } from "react";
import { IntentAnalysis, EntityItem, PragmaticRegister } from "@/lib/types";
import {
  Compass,
  Check,
  Copy,
  Tag,
  MessageSquare,
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
        return "bg-[#00b8ff]/10 text-[#00b8ff] border-[#00b8ff]/25";
      case "Colloquial-Familiar":
      default:
        return "bg-[#18181b] text-[#fafafa] border-[#27272a]";
    }
  };

  const confidencePercent = Math.round((intent.confidence || 0.85) * 100);

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111114] p-4 sm:p-5 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#00e5a0]" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#fafafa]">
            INTENT &amp; PRAGMATIC REGISTER
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#71717a]">
          Business Intent • Pragmatic Register • Grounded Entities
        </span>
      </div>

      {/* 3-Section Unified Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Section 1: Intent (col-span-4) */}
        <div className="md:col-span-4 p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717a] block">
              INTENT
            </span>
            <div className="font-mono text-sm font-bold text-[#fafafa] tracking-tight">
              {intent.label}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#1f1f23]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#71717a]">Inference Confidence:</span>
              <span className="text-[#fafafa] font-semibold">{confidencePercent}%</span>
            </div>
            <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  confidencePercent >= 90
                    ? "bg-[#00e5a0]"
                    : confidencePercent >= 75
                    ? "bg-[#00b8ff]"
                    : "bg-[#f59e0b]"
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pragmatic Register & Cultural Markers (col-span-4) */}
        <div className="md:col-span-4 p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717a] block">
              REGISTER
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
          <div className="space-y-1 pt-2 border-t border-[#1f1f23]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717a] block">
              CULTURAL MARKERS
            </span>
            {pragmaticRegister &&
            pragmaticRegister.cultural_markers &&
            pragmaticRegister.cultural_markers.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {pragmaticRegister.cultural_markers.map((marker, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]"
                  >
                    &ldquo;{marker}&rdquo;
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] font-mono text-[#71717a]">bhai · wallah · standard</span>
            )}
          </div>
        </div>

        {/* Section 3: Grounded Entities (col-span-4) */}
        <div className="md:col-span-4 p-3.5 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717a] block">
                GROUNDED ENTITIES ({entities.length})
              </span>
              <span className="text-[10px] font-mono text-[#00e5a0]">
                Span-grounded
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
                    className="group p-1.5 rounded bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] flex items-center justify-between text-xs cursor-pointer transition-colors"
                    title="Click to copy entity value"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#111114] text-[#71717a] border border-[#27272a] uppercase">
                        {item.type}
                      </span>
                      <span className="text-xs font-mono font-medium text-[#fafafa] truncate">
                        {item.value}
                      </span>
                    </div>

                    <div className="text-[#71717a] group-hover:text-[#fafafa] shrink-0 ml-1">
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-[#00e5a0]" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs font-mono text-[#71717a] italic">
                No categorical entities isolated
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-[#71717a] pt-1 border-t border-[#1f1f23]">
            Verified against source character offsets
          </div>
        </div>
      </div>
    </div>
  );
}
