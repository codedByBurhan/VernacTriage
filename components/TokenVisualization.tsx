"use client";

import React from "react";
import { AnalyzedToken } from "@/lib/types";
import {
  Layers,
  Sparkles,
  AlertOctagon,
  Ban,
} from "lucide-react";

interface TokenVisualizationProps {
  tokens: AnalyzedToken[];
  detectedLanguages: string[];
  phenomena: string[];
  onHoverToken?: (token: AnalyzedToken | null) => void;
  onSelectToken?: (token: AnalyzedToken, index: number) => void;
  selectedTokenIndex?: number | null;
  hoveredToken?: AnalyzedToken | null;
}

export function TokenVisualization({
  tokens,
  phenomena,
  onHoverToken,
  onSelectToken,
  selectedTokenIndex,
  hoveredToken,
}: TokenVisualizationProps) {
  // Restrained semantic styles for tokens: calm, technical, high-contrast
  const getTokenStyle = (token: AnalyzedToken, isSelected: boolean, isHovered: boolean) => {
    const lang = (token.language || token.detected_language || "").toLowerCase();
    const type = (token.type || token.classification || "").toLowerCase();
    const hasCollision = Boolean(token.collision && token.collision.is_collision);

    const isPhonetic =
      type.includes("phonetic") ||
      type.includes("romanized") ||
      type.includes("slang") ||
      type.includes("arabizi") ||
      type.includes("abbreviation") ||
      type.includes("alphanumeric");

    let baseClass = "";
    let dotColor = "";
    let badgeLabel = "EN";
    let badgeClass = "bg-blue-500/10 text-blue-300 border-blue-500/20";

    if (hasCollision) {
      badgeLabel = "COLLISION";
      badgeClass = "bg-amber-500/15 text-amber-300 border-amber-500/30";
      baseClass =
        isSelected || isHovered
          ? "bg-amber-950/40 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40"
          : "bg-amber-950/20 border-amber-500/30 hover:border-amber-400/60 text-amber-100";
      dotColor = "bg-amber-400";
      return { baseClass, dotColor, badgeLabel, badgeClass, isPhonetic, hasCollision };
    }

    if (lang.includes("hindi") || lang === "hi") {
      badgeLabel = isPhonetic ? "HI·ROM" : "HI";
      badgeClass = isPhonetic
        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
        : "bg-orange-500/10 text-orange-300 border-orange-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-amber-400/80 text-white ring-1 ring-amber-400/30"
          : "bg-[#09090b] border-[#27272a] hover:border-amber-500/40 text-[#f4f4f5]";
      dotColor = "bg-amber-400";
    } else if (lang.includes("arabic") || lang === "ar") {
      badgeLabel = type.includes("arabizi") || type.includes("alphanumeric") ? "AR·3RB" : "AR";
      badgeClass = "bg-purple-500/10 text-purple-300 border-purple-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-purple-400/80 text-white ring-1 ring-purple-400/30"
          : "bg-[#09090b] border-[#27272a] hover:border-purple-500/40 text-[#f4f4f5]";
      dotColor = "bg-purple-400";
    } else if (lang.includes("english") || lang === "en") {
      badgeLabel = isPhonetic ? "EN·PHO" : "EN";
      badgeClass = "bg-blue-500/10 text-blue-300 border-blue-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-blue-400/80 text-white ring-1 ring-blue-400/30"
          : "bg-[#09090b] border-[#27272a] hover:border-blue-500/40 text-[#f4f4f5]";
      dotColor = "bg-blue-400";
    } else {
      badgeLabel = "NUM";
      badgeClass = "bg-[#18181b] text-[#a1a1aa] border-[#27272a]";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-[#3f3f46] text-white ring-1 ring-[#71717a]/30"
          : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa]";
      dotColor = "bg-[#71717a]";
    }

    return { baseClass, dotColor, badgeLabel, badgeClass, isPhonetic, hasCollision };
  };

  return (
    <div className="space-y-3">
      {/* Linguistic Phenomena Badges (if detected) */}
      {phenomena && phenomena.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#a1a1aa]" />
            Detected Phenomena:
          </span>
          {phenomena.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111113] border border-[#27272a] text-[#a1a1aa]"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Token Reconstruction Stream Container */}
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1f1f22]">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f4f4f5]">
              Token Stream
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
              {tokens.length} units
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#71717a] hidden sm:inline">
            Hover to isolate span • Click to open inspector drawer
          </span>
        </div>

        {/* Tokens Container */}
        <div className="flex flex-wrap gap-1.5 items-center min-h-[52px] py-1">
          {tokens.map((token, idx) => {
            const isSelected = selectedTokenIndex === idx;
            const isHovered = hoveredToken === token;
            const { baseClass, dotColor, badgeLabel, badgeClass } = getTokenStyle(
              token,
              isSelected,
              isHovered
            );

            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => onHoverToken?.(token)}
                onMouseLeave={() => onHoverToken?.(null)}
                onClick={() => {
                  onSelectToken?.(token, idx);
                  onHoverToken?.(token);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${baseClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="font-semibold text-xs tracking-tight">{token.raw}</span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded border uppercase tracking-wider ${badgeClass}`}
                >
                  {badgeLabel}
                </span>
                {token.is_negation && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    NEG
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
