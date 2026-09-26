"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

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
    setTimeout(() => setCopiedField(null), 1200);
  };

  const isArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(canonicalScript);
  const isDevanagari = /[\u0900-\u097F]/.test(canonicalScript);

  const scriptBadge = isArabic
    ? "Arabic Orthography"
    : isDevanagari
    ? "Devanagari Orthography"
    : "Canonical Script";

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      {/* 1. Canonical Native Script */}
      <div className="rounded-xl border border-[#27272a] bg-[#111114] p-4 flex flex-col justify-between space-y-2.5 flex-1">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa]">
              CANONICAL SCRIPT
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#00b8ff]">
              {scriptBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy("canonical", canonicalScript)}
            className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Copy canonical script"
          >
            {copiedField === "canonical" ? (
              <Check className="w-3.5 h-3.5 text-[#00e5a0]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="min-h-[44px] flex items-center">
          <p
            dir={isArabic ? "rtl" : "ltr"}
            className={`text-base sm:text-lg font-medium text-[#fafafa] leading-relaxed tracking-wide ${
              isArabic ? "font-arabic" : isDevanagari ? "font-devanagari" : "font-sans"
            }`}
          >
            {canonicalScript}
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f1f23] text-[10px] font-mono text-[#71717a]">
          Reconstructed into native vernacular orthography
        </div>
      </div>

      {/* 2. Standard Business English */}
      <div className="rounded-xl border border-[#27272a] bg-[#111114] p-4 flex flex-col justify-between space-y-2.5 flex-1">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa]">
              STANDARD ENGLISH
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#00e5a0]">
              Operational Translation
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy("english", englishTranslation)}
            className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Copy English translation"
          >
            {copiedField === "english" ? (
              <Check className="w-3.5 h-3.5 text-[#00e5a0]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="min-h-[44px] flex items-center">
          <p className="text-sm sm:text-base font-medium text-[#fafafa] leading-relaxed font-sans">
            &ldquo;{englishTranslation}&rdquo;
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f1f23] text-[10px] font-mono text-[#71717a]">
          Disambiguated business English semantics
        </div>
      </div>
    </div>
  );
}
