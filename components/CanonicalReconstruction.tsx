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
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 flex flex-col justify-between space-y-2.5 flex-1">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa]">
              Canonical Script
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-amber-300">
              {scriptBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy("canonical", canonicalScript)}
            className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
            title="Copy canonical script"
          >
            {copiedField === "canonical" ? (
              <Check className="w-3.5 h-3.5 text-[#22c55e]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="min-h-[44px] flex items-center">
          <p
            dir={isArabic ? "rtl" : "ltr"}
            className={`text-base sm:text-lg font-medium text-[#f4f4f5] leading-relaxed tracking-wide ${
              isArabic ? "font-arabic" : isDevanagari ? "font-devanagari" : "font-sans"
            }`}
          >
            {canonicalScript}
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f1f22] text-[10px] font-mono text-[#71717a]">
          Normalized to native alphabet
        </div>
      </div>

      {/* 2. Standard Business English */}
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 flex flex-col justify-between space-y-2.5 flex-1">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa]">
              Standard English
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-blue-300">
              Business Translation
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy("english", englishTranslation)}
            className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
            title="Copy English translation"
          >
            {copiedField === "english" ? (
              <Check className="w-3.5 h-3.5 text-[#22c55e]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="min-h-[44px] flex items-center">
          <p className="text-sm sm:text-base font-medium text-[#f4f4f5] leading-relaxed font-sans">
            &ldquo;{englishTranslation}&rdquo;
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f1f22] text-[10px] font-mono text-[#71717a]">
          Standard English interpretation
        </div>
      </div>
    </div>
  );
}
