"use client";

import React, { useState } from "react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";
import { Copy, Check, Sparkles, Languages } from "lucide-react";

interface DualScriptStageProps {
  canonicalScript: string;
  englishTranslation: string;
}

export function DualScriptStage({
  canonicalScript,
  englishTranslation,
}: DualScriptStageProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEnglish, setCopiedEnglish] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(canonicalScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 1400);
  };

  const handleCopyEnglish = () => {
    navigator.clipboard.writeText(englishTranslation);
    setCopiedEnglish(true);
    setTimeout(() => setCopiedEnglish(false), 1400);
  };

  const isArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(canonicalScript);
  const isDevanagari = /[\u0900-\u097F]/.test(canonicalScript);

  const scriptBadge = isArabic
    ? "Arabic Orthography"
    : isDevanagari
    ? "Devanagari Orthography"
    : "Canonical Script";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-0">
      {/* 1. Native Canonical Script Panel */}
      <SpotlightCard className="p-3 border border-[#1f1f23] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#00b8ff]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a1a1aa]">
              Native Canonical Script
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#070709] border border-[#1f1f23] text-[#00b8ff]">
              {scriptBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyScript}
            className="p-1 rounded hover:bg-[#16161b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Copy Canonical Script"
          >
            {copiedScript ? (
              <Check className="w-3 h-3 text-[#00e5a0]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Text Container with Fluid TextGenerateEffect */}
        <div className="flex-1 min-h-[50px] flex items-center py-2">
          <TextGenerateEffect
            words={canonicalScript}
            isArabic={isArabic}
            className={`text-base sm:text-lg font-medium text-[#fafafa] drop-shadow-[0_2px_12px_rgba(0,184,255,0.18)] ${
              isArabic ? "font-arabic" : isDevanagari ? "font-devanagari" : "font-sans"
            }`}
          />
        </div>

        <div className="pt-1.5 border-t border-[#17171d] text-[9px] font-mono text-[#71717a] flex items-center justify-between">
          <span>Normalized to native alphabet</span>
          <span>Zero phonemic loss</span>
        </div>
      </SpotlightCard>

      {/* 2. Standard Business English Panel */}
      <SpotlightCard className="p-3 border border-[#1f1f23] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00e5a0]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a1a1aa]">
              Clean Business English
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#070709] border border-[#1f1f23] text-[#00e5a0]">
              Operational Translation
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyEnglish}
            className="p-1 rounded hover:bg-[#16161b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Copy English Translation"
          >
            {copiedEnglish ? (
              <Check className="w-3 h-3 text-[#00e5a0]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex-1 min-h-[50px] flex items-center py-2">
          <p className="text-xs sm:text-sm font-sans font-medium text-[#fafafa] leading-relaxed select-text">
            &ldquo;{englishTranslation}&rdquo;
          </p>
        </div>

        <div className="pt-1.5 border-t border-[#17171d] text-[9px] font-mono text-[#71717a] flex items-center justify-between">
          <span>Enterprise semantics verified</span>
          <span className="text-[#00e5a0]">Ready for ERP/CRM</span>
        </div>
      </SpotlightCard>
    </div>
  );
}
