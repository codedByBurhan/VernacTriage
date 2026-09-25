"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Copy,
  Check,
  Languages,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface CanonicalReconstructionProps {
  originalText: string;
  canonicalScript: string;
  englishTranslation: string;
}

export function CanonicalReconstruction({
  originalText,
  canonicalScript,
  englishTranslation,
}: CanonicalReconstructionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const isArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(canonicalScript);
  const isDevanagari = /[\u0900-\u097F]/.test(canonicalScript);

  const scriptBadge = isArabic
    ? "Arabic Orthography (العربية)"
    : isDevanagari
    ? "Devanagari Orthography (नागरी)"
    : "Reconstructed Script";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          Section B — Canonical Reconstruction &amp; Translation
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">
          3-Stage Normalization Pipeline
        </span>
      </div>

      <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-4 shadow-xl">
        {/* STAGE 1: Original Messy Input */}
        <div className="rounded-xl bg-zinc-950/60 border border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              Stage 1: Raw Input Stream
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Unstructured / Code-switched
            </span>
          </div>
          <p className="text-sm font-mono text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
            &ldquo;{originalText}&rdquo;
          </p>
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center -my-1">
          <div className="p-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STAGE 2: Native Canonical Script Reconstruction */}
        <div className="rounded-xl bg-gradient-to-br from-amber-950/30 to-purple-950/20 border border-amber-500/30 p-4 space-y-2 relative group">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Stage 2: Canonical Native Script Reconstruction
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                {scriptBadge}
              </span>
              <button
                type="button"
                onClick={() => handleCopy("canonical", canonicalScript)}
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Copy canonical script"
              >
                {copiedField === "canonical" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <p
            dir={isArabic ? "rtl" : "ltr"}
            className={`text-base sm:text-lg font-medium text-white bg-black/50 p-3.5 rounded-lg border border-amber-500/20 leading-relaxed ${
              isArabic ? "font-sans tracking-wide" : "font-sans"
            }`}
          >
            {canonicalScript}
          </p>
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center -my-1">
          <div className="p-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STAGE 3: Standard English Translation */}
        <div className="rounded-xl bg-gradient-to-br from-blue-950/30 to-indigo-950/20 border border-blue-500/30 p-4 space-y-2 relative group">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Stage 3: Standard English Translation
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                Business Grade English
              </span>
              <button
                type="button"
                onClick={() => handleCopy("english", englishTranslation)}
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Copy English translation"
              >
                {copiedField === "english" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium text-zinc-100 bg-black/50 p-3.5 rounded-lg border border-blue-500/20 leading-relaxed font-sans">
            &ldquo;{englishTranslation}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
