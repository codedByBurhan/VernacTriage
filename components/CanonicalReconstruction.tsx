"use client";

import React, { useState } from "react";
import { Copy, Check, Languages } from "lucide-react";

interface CanonicalReconstructionProps {
  originalText?: string;
  canonicalScript: string;
  englishTranslation: string;
}

export function CanonicalReconstruction({
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
    ? "Devanagari (नागरी)"
    : "Reconstructed Script";

  return (
    <div className="space-y-2">
      {/* Symmetrical Dual Analytical Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Column 1: Canonical Native Script */}
        <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Canonical Script
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-amber-300/90">
                {scriptBadge}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy("canonical", canonicalScript)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Copy canonical script"
            >
              {copiedField === "canonical" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="min-h-[56px] flex items-center">
            <p
              dir={isArabic ? "rtl" : "ltr"}
              className={`text-lg sm:text-xl font-medium text-white leading-relaxed tracking-wide ${
                isArabic ? "font-arabic" : isDevanagari ? "font-devanagari" : "font-sans"
              }`}
            >
              {canonicalScript}
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
            Native lexical normalization
          </div>
        </div>

        {/* Column 2: Standard English Output */}
        <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Normalized English
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-blue-300/90">
                Business Standard
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy("english", englishTranslation)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Copy English translation"
            >
              {copiedField === "english" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="min-h-[56px] flex items-center">
            <p className="text-base sm:text-lg font-medium text-zinc-100 leading-relaxed font-sans">
              &ldquo;{englishTranslation}&rdquo;
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
            Downstream intent-grounded English
          </div>
        </div>
      </div>
    </div>
  );
}
