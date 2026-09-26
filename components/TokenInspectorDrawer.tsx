"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AnalyzedToken } from "@/lib/types";
import {
  X,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Search,
  Crosshair,
  Ban,
  ArrowRight,
  Code2,
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
        className="fixed z-50 bg-[#111114] border-[#27272a] shadow-2xl transition-transform ease-out duration-200 
          bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl border-t p-5 overflow-y-auto 
          sm:bottom-0 sm:top-0 sm:left-auto sm:right-0 sm:w-[440px] sm:max-h-full sm:rounded-none sm:border-l sm:border-t-0 sm:p-6"
        aria-label="Token Inspector AST Node"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f23]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00e5a0]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#fafafa]">
                AST Node Inspector
              </span>
              {typeof tokenIndex === "number" && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
                  Token #{tokenIndex}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#18181b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
              title="Close inspector (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TOKEN HERO CELL */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#1f1f23] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
              <span>RAW LEXICAL UNIT</span>
              <button
                type="button"
                onClick={() => handleCopy(token.raw)}
                className="hover:text-[#fafafa] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#00e5a0]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              &ldquo;{token.raw}&rdquo;
            </div>
            {token.is_negation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/25">
                <Ban className="w-3 h-3" /> Negation Invariant Marker
              </span>
            )}
          </div>

          {/* COMPILER AST ATTRIBUTE TILES */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            {/* RAW */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-1">
              <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                RAW
              </span>
              <span className="text-xs font-bold text-[#fafafa] block truncate font-mono">
                {token.raw}
              </span>
            </div>

            {/* NORMALIZED */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-1">
              <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                NORMALIZED
              </span>
              <span className="text-xs font-bold text-[#00e5a0] block truncate font-mono">
                {token.normalized_source || token.normalized || token.raw}
              </span>
            </div>

            {/* LANGUAGE */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-1">
              <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                LANGUAGE
              </span>
              <span className="text-xs font-bold text-[#fafafa] block truncate">
                {token.detected_language
                  ? `${token.detected_language.toUpperCase()} (${token.language || token.detected_language})`
                  : token.language || "Unknown"}
              </span>
            </div>

            {/* CLASSIFICATION */}
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-1">
              <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                CLASSIFICATION
              </span>
              <span className="text-xs font-bold text-[#00b8ff] block truncate">
                {token.classification || token.type || "standard"}
              </span>
            </div>

            {/* CHARACTER SPAN */}
            <div className="col-span-2 p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                  CHARACTER SPAN
                </span>
                <span className="text-xs font-bold text-[#fafafa] font-mono flex items-center gap-1.5 mt-0.5">
                  <Crosshair className="w-3.5 h-3.5 text-[#00e5a0]" />
                  {typeof token.start_idx === "number" && typeof token.end_idx === "number"
                    ? `[${token.start_idx}..${token.end_idx}] (${token.end_idx - token.start_idx} characters)`
                    : "Preserved span"}
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
                Zero-drift
              </span>
            </div>
          </div>

          {/* CROSS-LINGUAL COLLISION LEDGER (When collision exists) */}
          {hasCollision && token.collision && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2.5 text-amber-300 font-bold text-xs">
                  <Image
                    src="/icons/icon-homograph-collision.png"
                    alt="Homograph Collision"
                    width={18}
                    height={30}
                    className="h-5 w-auto object-contain shrink-0"
                  />
                  <span>COLLISION LEDGER</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  HOMOGRAPH COLLISION
                </span>
              </div>

              {/* Selected Interpretation */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#00e5a0]/30 space-y-1">
                <div className="flex items-center gap-1.5 text-[#00e5a0] text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  SELECTED INTERPRETATION
                </div>
                <p className="text-[#fafafa] text-xs font-sans font-medium">
                  {token.collision.selected_meaning}
                </p>
                <div className="text-[10px] text-[#71717a]">
                  Dialect: {token.collision.selected_language.toUpperCase()}
                </div>
              </div>

              {/* Rejected Interpretation */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#f43f5e]/30 space-y-1">
                <div className="flex items-center gap-1.5 text-[#f43f5e] text-[10px] font-bold uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  REJECTED INTERPRETATION
                </div>
                <p className="text-[#a1a1aa] text-xs font-sans">
                  {token.collision.rejected_meaning}
                </p>
                <div className="text-[10px] text-[#71717a]">
                  Dialect: {token.collision.rejected_language.toUpperCase()}
                </div>
              </div>

              {/* Disambiguation Reasoning */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                  REASONING
                </span>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  {token.collision.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Linguistic Explanation */}
          {token.explanation && (
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] text-xs space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717a] block">
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
