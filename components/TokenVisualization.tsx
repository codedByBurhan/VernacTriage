"use client";

import React, { useState } from "react";
import { AnalyzedToken } from "@/lib/types";
import {
  Layers,
  Copy,
  Check,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Ban,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

interface TokenVisualizationProps {
  tokens: AnalyzedToken[];
  detectedLanguages: string[];
  phenomena: string[];
  onHoverToken?: (token: AnalyzedToken | null) => void;
  hoveredToken?: AnalyzedToken | null;
}

export function TokenVisualization({
  tokens,
  detectedLanguages,
  phenomena,
  onHoverToken,
  hoveredToken,
}: TokenVisualizationProps) {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(
    tokens.length > 0 ? 0 : null
  );
  const [copied, setCopied] = useState(false);

  const selectedToken =
    selectedTokenIndex !== null && tokens[selectedTokenIndex]
      ? tokens[selectedTokenIndex]
      : null;

  const handleCopyNormalized = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
          ? "bg-amber-950/30 border-amber-400/80 text-white ring-1 ring-amber-400/30"
          : "bg-zinc-900/60 border-zinc-800 hover:border-amber-500/40 text-zinc-200";
      dotColor = "bg-amber-400";
    } else if (lang.includes("arabic") || lang === "ar") {
      badgeLabel = type.includes("arabizi") || type.includes("alphanumeric") ? "AR·3RB" : "AR";
      badgeClass = "bg-purple-500/10 text-purple-300 border-purple-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-purple-950/30 border-purple-400/80 text-white ring-1 ring-purple-400/30"
          : "bg-zinc-900/60 border-zinc-800 hover:border-purple-500/40 text-zinc-200";
      dotColor = "bg-purple-400";
    } else if (lang.includes("english") || lang === "en") {
      badgeLabel = isPhonetic ? "EN·PHO" : "EN";
      badgeClass = "bg-blue-500/10 text-blue-300 border-blue-500/20";
      baseClass =
        isSelected || isHovered
          ? "bg-blue-950/30 border-blue-400/80 text-white ring-1 ring-blue-400/30"
          : "bg-zinc-900/60 border-zinc-800 hover:border-blue-500/40 text-zinc-200";
      dotColor = "bg-blue-400";
    } else {
      badgeLabel = "NUM";
      badgeClass = "bg-zinc-800 text-zinc-400 border-zinc-700";
      baseClass =
        isSelected || isHovered
          ? "bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-400/30"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300";
      dotColor = "bg-zinc-400";
    }

    return { baseClass, dotColor, badgeLabel, badgeClass, isPhonetic, hasCollision };
  };

  return (
    <div className="space-y-3.5">
      {/* Linguistic Phenomena Badges (if detected) */}
      {phenomena && phenomena.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            Detected Phenomena:
          </span>
          {phenomena.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Token Reconstruction Stream */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0f17] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Token Reconstruction Stream
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 border border-white/[0.06] text-zinc-400">
              {tokens.length} tokens
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
            Hover to isolate span • Click to inspect forensic metadata
          </span>
        </div>

        {/* Tokens Container */}
        <div className="flex flex-wrap gap-2 items-center min-h-[56px] py-1">
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
                  setSelectedTokenIndex(idx);
                  onHoverToken?.(token);
                }}
                className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${baseClass}`}
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

      {/* Forensic Token Inspector */}
      {selectedToken && (
        <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 space-y-4">
          {/* Inspector Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Forensic Token Inspector
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                Index #{selectedTokenIndex}
              </span>
              {selectedToken.start_idx !== undefined && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                  Raw Span: [{selectedToken.start_idx}..{selectedToken.end_idx}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {selectedToken.is_negation && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                  <Ban className="w-3 h-3" /> Negation Marker
                </span>
              )}
              {selectedToken.confidence !== undefined && (
                <span className="text-[11px] font-mono text-zinc-400">
                  Confidence:{" "}
                  <strong className="text-zinc-200">
                    {Math.round(selectedToken.confidence * 100)}%
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* 4 Clean Attribute Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Raw Token
              </span>
              <span className="text-sm font-bold font-mono text-white">
                {selectedToken.raw}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Detected Language
              </span>
              <span className="text-xs font-semibold text-zinc-200 font-mono">
                {selectedToken.detected_language
                  ? `${selectedToken.detected_language.toUpperCase()} (${selectedToken.language || selectedToken.detected_language})`
                  : selectedToken.language}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Classification
              </span>
              <span className="text-xs font-mono text-zinc-300 truncate block">
                {selectedToken.classification || selectedToken.type}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Orthography / Script
              </span>
              <span className="text-xs font-mono text-zinc-300">
                {selectedToken.script || "Latin"}
              </span>
            </div>
          </div>

          {/* Normalized Form Row */}
          <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Canonical Native Script / Normalization
                </span>
                <span className="text-base font-semibold text-white tracking-tight truncate block">
                  {selectedToken.normalized_source || selectedToken.normalized}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopyNormalized(
                  selectedToken.normalized_source || selectedToken.normalized || ""
                )
              }
              className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-white/[0.06]"
              title="Copy normalized text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* COLLISION LEDGER: Shown ONLY when collision != null and is_collision == true */}
          {selectedToken.collision && selectedToken.collision.is_collision && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/15 p-3.5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  <span>CROSS-LINGUAL COLLISION LEDGER</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  HOMOGRAPHIC DISAMBIGUATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Selected Interpretation */}
                <div className="p-2.5 rounded-md bg-[#090a0f] border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Selected Interpretation ({selectedToken.collision.selected_language.toUpperCase()})
                  </div>
                  <p className="text-zinc-200 text-xs font-mono">
                    {selectedToken.collision.selected_meaning}
                  </p>
                </div>

                {/* Rejected Interpretation */}
                <div className="p-2.5 rounded-md bg-[#090a0f] border border-rose-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    Rejected Interpretation ({selectedToken.collision.rejected_language.toUpperCase()})
                  </div>
                  <p className="text-zinc-300 text-xs font-mono">
                    {selectedToken.collision.rejected_meaning}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="text-xs text-zinc-300 bg-[#090a0f] p-2.5 rounded-md border border-white/[0.05] space-y-1 font-mono">
                <span className="font-semibold text-amber-400 text-[10px] uppercase block">
                  Disambiguation Reasoning:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {selectedToken.collision.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Linguistic Explanation */}
          {selectedToken.explanation && (
            <div className="text-xs text-zinc-400 bg-[#090a0f] p-2.5 rounded-md border border-white/[0.05] leading-relaxed font-mono">
              <span className="text-zinc-300 font-semibold font-sans">Linguistic Note: </span>
              <span className="font-sans text-zinc-400">{selectedToken.explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
