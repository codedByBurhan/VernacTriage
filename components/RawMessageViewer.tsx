"use client";

import React, { useState } from "react";
import { Copy, Check, Crosshair } from "lucide-react";
import { AnalyzedToken } from "@/lib/types";

interface RawMessageViewerProps {
  originalText: string;
  activeToken?: AnalyzedToken | null;
}

export function RawMessageViewer({
  originalText,
  activeToken,
}: RawMessageViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(originalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const hasValidSpan =
    activeToken &&
    typeof activeToken.start_idx === "number" &&
    typeof activeToken.end_idx === "number" &&
    activeToken.start_idx >= 0 &&
    activeToken.end_idx <= originalText.length;

  const beforeSpan = hasValidSpan ? originalText.slice(0, activeToken.start_idx) : "";
  const spanText = hasValidSpan
    ? originalText.slice(activeToken.start_idx, activeToken.end_idx)
    : "";
  const afterSpan = hasValidSpan ? originalText.slice(activeToken.end_idx) : "";

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 flex flex-col justify-between space-y-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa]">
            Raw Customer Message
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
            Source Truth
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
          title="Copy original message"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#22c55e]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main Text Display with live span highlighting */}
      <div className="min-h-[88px] flex items-center p-3 rounded-lg bg-[#09090b] border border-[#1f1f22]">
        <p className="text-sm font-mono leading-relaxed text-[#f4f4f5] select-text">
          {hasValidSpan ? (
            <>
              <span className="text-[#a1a1aa]">{beforeSpan}</span>
              <mark className="bg-[#6366f1]/25 text-white border border-[#6366f1]/60 px-0.5 rounded font-bold shadow-sm">
                {spanText}
              </mark>
              <span className="text-[#a1a1aa]">{afterSpan}</span>
            </>
          ) : (
            originalText
          )}
        </p>
      </div>

      {/* Technical Metadata Bar */}
      <div className="pt-2 border-t border-[#1f1f22] flex items-center justify-between text-[10px] font-mono text-[#71717a]">
        <span>Total: {originalText.length} chars</span>
        {hasValidSpan ? (
          <span className="text-[#6366f1] font-semibold flex items-center gap-1">
            <Crosshair className="w-3 h-3" />
            Span: {activeToken.start_idx} → {activeToken.end_idx} ({spanText.length} chars)
          </span>
        ) : (
          <span>Hover a token to inspect span</span>
        )}
      </div>
    </div>
  );
}
