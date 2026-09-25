"use client";

import React, { useEffect } from "react";
import { AnalyzedToken } from "@/lib/types";
import {
  X,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Search,
  Crosshair,
  Ban,
  ArrowRight,
} from "lucide-react";

interface TokenInspectorDrawerProps {
  token: AnalyzedToken | null;
  tokenIndex?: number | null;
  onClose: () => void;
}

export function TokenInspectorDrawer({
  token,
  tokenIndex,
  onClose,
}: TokenInspectorDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!token) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const hasCollision = Boolean(token.collision && token.collision.is_collision);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel: Right-side on desktop, bottom-sheet on mobile */}
      <aside
        className="fixed z-50 bg-[#111113] border-[#27272a] shadow-2xl transition-transform ease-out duration-200 
          bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl border-t p-5 overflow-y-auto 
          sm:bottom-0 sm:top-0 sm:left-auto sm:right-0 sm:w-[440px] sm:max-h-full sm:rounded-none sm:border-l sm:border-t-0 sm:p-6"
        aria-label="Token Inspector"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f22]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#a1a1aa]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f4f4f5]">
                Token Inspector
              </span>
              {typeof tokenIndex === "number" && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
                  #{tokenIndex}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#18181b] text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
              title="Close inspector (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TOKEN HERO CELL */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#1f1f22] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
              <span>Token</span>
              <button
                type="button"
                onClick={() => handleCopy(token.raw)}
                className="hover:text-[#f4f4f5] flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              &ldquo;{token.raw}&rdquo;
            </div>
            {token.is_negation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/25">
                <Ban className="w-3 h-3" /> Negation Polarity Marker
              </span>
            )}
          </div>

          {/* ATTRIBUTE METADATA TILES */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Language */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                Language
              </span>
              <span className="text-sm font-semibold text-[#f4f4f5] block">
                {token.detected_language
                  ? `${token.detected_language.toUpperCase()} (${token.language || token.detected_language})`
                  : token.language || "Unknown"}
              </span>
            </div>

            {/* Classification */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                Classification
              </span>
              <span className="text-xs font-semibold text-[#a1a1aa] block truncate">
                {token.classification || token.type || "standard"}
              </span>
            </div>

            {/* Normalized Form */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                Normalized
              </span>
              <span className="text-sm font-semibold text-white block">
                {token.normalized_source || token.normalized || token.raw}
              </span>
            </div>

            {/* Span */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                Span Offsets
              </span>
              <span className="text-xs font-semibold text-[#6366f1] block flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                {typeof token.start_idx === "number" && typeof token.end_idx === "number"
                  ? `${token.start_idx} → ${token.end_idx}`
                  : "Preserved"}
              </span>
            </div>
          </div>

          {/* CROSS-LINGUAL COLLISION LEDGER (When applicable) */}
          {hasCollision && token.collision && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  <span>COLLISION DETECTED</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  HOMOGRAPH
                </span>
              </div>

              {/* Selected Interpretation */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#22c55e]/30 space-y-1">
                <div className="flex items-center gap-1.5 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Selected interpretation
                </div>
                <p className="text-[#f4f4f5] text-xs font-sans">
                  {token.collision.selected_meaning}
                </p>
                <div className="text-[10px] text-[#71717a]">
                  Dialect: {token.collision.selected_language.toUpperCase()}
                </div>
              </div>

              {/* Alternative / Rejected Interpretation */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#ef4444]/30 space-y-1">
                <div className="flex items-center gap-1.5 text-[#ef4444] text-[10px] font-bold uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  Alternative (Rejected)
                </div>
                <p className="text-[#a1a1aa] text-xs font-sans">
                  {token.collision.rejected_meaning}
                </p>
                <div className="text-[10px] text-[#71717a]">
                  Dialect: {token.collision.rejected_language.toUpperCase()}
                </div>
              </div>

              {/* Reason */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                  Disambiguation Reason
                </span>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  {token.collision.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Linguistic Explanation */}
          {token.explanation && (
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                Forensic Annotation
              </span>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                {token.explanation}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
