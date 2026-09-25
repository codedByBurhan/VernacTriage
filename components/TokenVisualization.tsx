"use client";

import React, { useState } from "react";
import { AnalyzedToken } from "@/lib/types";
import {
  Sparkles,
  Info,
  Check,
  Copy,
  Layers,
  ArrowRightLeft,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Hash,
  Ban,
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
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(0);
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

  // Helper for token color styling
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
    let badgeClass = "bg-blue-500/20 text-blue-300 border-blue-500/30";

    if (hasCollision) {
      badgeLabel = "COLLISION";
      badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse";
      baseClass = isSelected || isHovered
        ? "bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/60 text-white shadow-lg shadow-amber-500/30"
        : "bg-amber-950/30 border-amber-500/40 hover:border-amber-400 text-amber-200";
      dotColor = "bg-amber-400";
      return { baseClass, dotColor, badgeLabel, badgeClass, isPhonetic, hasCollision };
    }

    if (lang.includes("hindi") || lang === "hi") {
      badgeLabel = isPhonetic ? "HI·PHO" : "HI";
      badgeClass = isPhonetic
        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
        : "bg-amber-500/20 text-amber-300 border-amber-500/30";
      baseClass = isSelected || isHovered
        ? "bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 text-white shadow-lg shadow-amber-500/20"
        : "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 text-amber-200";
      dotColor = isPhonetic ? "bg-rose-400" : "bg-amber-400";
    } else if (lang.includes("arabic") || lang === "ar") {
      badgeLabel = type.includes("arabizi") || type.includes("alphanumeric") ? "AR·3RB" : "AR";
      badgeClass = type.includes("arabizi") || type.includes("alphanumeric")
        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        : "bg-purple-500/20 text-purple-300 border-purple-500/30";
      baseClass = isSelected || isHovered
        ? "bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/50 text-white shadow-lg shadow-purple-500/20"
        : "bg-purple-950/20 border-purple-500/30 hover:border-purple-500/60 text-purple-200";
      dotColor = type.includes("arabizi") ? "bg-emerald-400" : "bg-purple-400";
    } else if (lang.includes("english") || lang === "en") {
      badgeLabel = isPhonetic ? "EN·PHO" : "EN";
      badgeClass = isPhonetic
        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
        : "bg-blue-500/20 text-blue-300 border-blue-500/30";
      baseClass = isSelected || isHovered
        ? "bg-blue-950/60 border-blue-400 ring-2 ring-blue-400/50 text-white shadow-lg shadow-blue-500/20"
        : "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/60 text-blue-200";
      dotColor = isPhonetic ? "bg-rose-400" : "bg-blue-400";
    } else {
      badgeLabel = "NUM / OTH";
      badgeClass = "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
      baseClass = isSelected || isHovered
        ? "bg-zinc-800 border-zinc-400 ring-2 ring-zinc-400/50 text-white shadow-lg shadow-zinc-500/20"
        : "bg-zinc-900/40 border-zinc-700/50 hover:border-zinc-500 text-zinc-300";
      dotColor = "bg-zinc-400";
    }

    return { baseClass, dotColor, badgeLabel, badgeClass, isPhonetic, hasCollision };
  };

  return (
    <div className="space-y-4">
      {/* Linguistic Phenomena Header Tags */}
      {phenomena && phenomena.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Detected Phenomena:
          </span>
          {phenomena.map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Token Pills Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Token Stream ({tokens.length} units)
          </span>
          <span className="text-[11px] text-zinc-500 italic">
            Hover to highlight raw text • Click to inspect
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex flex-wrap gap-2 items-center min-h-[90px]">
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
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${baseClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="font-bold text-sm tracking-tight">{token.raw}</span>
                <span
                  className={`text-[9px] font-sans px-1.5 py-0.2 rounded border font-semibold ${badgeClass}`}
                >
                  {badgeLabel}
                </span>
                {token.is_negation && (
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    NEG
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Detail Inspector */}
      {selectedToken && (
        <div className="rounded-xl bg-gradient-to-br from-zinc-900/90 to-[#0e121e]/90 border border-white/15 p-4 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Token Inspector
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono">
                Index #{selectedTokenIndex}
              </span>
              {selectedToken.start_idx !== undefined && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10 font-mono">
                  Span: [{selectedToken.start_idx}..{selectedToken.end_idx}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedToken.is_negation && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                  <Ban className="w-3 h-3" /> Negation Marker
                </span>
              )}
              {selectedToken.confidence !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Math.round(selectedToken.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Inspector Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Raw Token
              </span>
              <span className="text-sm font-bold font-mono text-white">
                {selectedToken.raw}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Detected Language
              </span>
              <span className="text-sm font-semibold text-zinc-200">
                {selectedToken.detected_language
                  ? `${selectedToken.detected_language.toUpperCase()} (${selectedToken.language || selectedToken.detected_language})`
                  : selectedToken.language}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Classification Type
              </span>
              <span className="text-xs font-medium text-amber-300 truncate block">
                {selectedToken.classification || selectedToken.type}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Script / Orthography
              </span>
              <span className="text-sm font-semibold text-zinc-200">
                {selectedToken.script || "Latin"}
              </span>
            </div>
          </div>

          {/* Normalized Form Bar */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  Canonical Native Script / Normalization
                </span>
                <span className="text-lg font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-amber-200">
                  {selectedToken.normalized_source || selectedToken.normalized}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopyNormalized(selectedToken.normalized_source || selectedToken.normalized || "")}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy normalized text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* COLLISION LEDGER: Shown ONLY when collision != null and is_collision == true */}
          {selectedToken.collision && selectedToken.collision.is_collision && (
            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-black/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>CROSS-LINGUAL COLLISION LEDGER</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  HOMOGRAPHIC DISAMBIGUATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Selected Interpretation */}
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected Interpretation ({selectedToken.collision.selected_language.toUpperCase()})
                  </div>
                  <p className="text-emerald-200 text-xs font-medium">
                    {selectedToken.collision.selected_meaning}
                  </p>
                </div>

                {/* Rejected Interpretation */}
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <XCircle className="w-3.5 h-3.5" />
                    Rejected Interpretation ({selectedToken.collision.rejected_language.toUpperCase()})
                  </div>
                  <p className="text-rose-200 text-xs font-medium">
                    {selectedToken.collision.rejected_meaning}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="text-[11px] text-zinc-300 bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                <span className="font-semibold text-amber-400 font-mono text-[10px] uppercase block">
                  Disambiguation Reasoning:
                </span>
                <p className="leading-relaxed">{selectedToken.collision.reasoning}</p>
              </div>
            </div>
          )}

          {/* Linguistic Explanation */}
          {selectedToken.explanation && (
            <div className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-white/5 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-zinc-300">Linguistic Analysis: </strong>
                {selectedToken.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
