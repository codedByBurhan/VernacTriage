"use client";

import React from "react";
import Image from "next/image";
import { AnalyzedToken } from "@/lib/types";
import { Sparkles, Layers, Info } from "lucide-react";

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
  // Restrained developer-grade lexical unit styling
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
    let badgeClass = "bg-[#00b8ff]/10 text-[#00b8ff] border-[#00b8ff]/20";

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
        ? "bg-[#00e5a0]/10 text-[#00e5a0] border-[#00e5a0]/25"
        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-[#00e5a0] text-white ring-1 ring-[#00e5a0]/30"
          : "bg-[#09090b] border-[#27272a] hover:border-[#00e5a0]/50 text-[#fafafa]";
      dotColor = "bg-[#00e5a0]";
    } else if (lang.includes("arabic") || lang === "ar") {
      badgeLabel = type.includes("arabizi") || type.includes("alphanumeric") ? "AR·3RB" : "AR";
      badgeClass = "bg-purple-500/10 text-purple-300 border-purple-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-purple-400/80 text-white ring-1 ring-purple-400/30"
          : "bg-[#09090b] border-[#27272a] hover:border-purple-500/40 text-[#fafafa]";
      dotColor = "bg-purple-400";
    } else if (lang.includes("english") || lang === "en") {
      badgeLabel = isPhonetic ? "EN·PHO" : "EN";
      badgeClass = "bg-[#00b8ff]/10 text-[#00b8ff] border-[#00b8ff]/20";
      baseClass =
        isSelected || isHovered
          ? "bg-[#18181b] border-[#00b8ff] text-white ring-1 ring-[#00b8ff]/30"
          : "bg-[#09090b] border-[#27272a] hover:border-[#00b8ff]/40 text-[#fafafa]";
      dotColor = "bg-[#00b8ff]";
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
            Linguistic Phenomena:
          </span>
          {phenomena.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111114] border border-[#27272a] text-[#a1a1aa]"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Token Reconstruction Stream Container */}
      <div className="rounded-xl border border-[#27272a] bg-[#111114] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f1f23]">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icons/icon-phonetic-ear-spelling.png"
              alt="Phonetic Ear-Spelling"
              width={22}
              height={20}
              className="h-4 w-auto object-contain shrink-0"
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#fafafa]">
              TOKEN RECONSTRUCTION STREAM
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
              {tokens.length} lexical units
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#71717a] hidden sm:inline">
            Hover to isolate source span • Click to inspect AST node
          </span>
        </div>

        {/* Tokens Container */}
        <div className="flex flex-wrap gap-1.5 items-center min-h-[48px] py-1">
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer ${baseClass}`}
                title={`Token #${idx}: ${token.raw} (${badgeLabel})`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="font-semibold text-xs tracking-tight font-mono">{token.raw}</span>
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
