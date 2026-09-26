"use client";

import React, { useState } from "react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ActionDispatch } from "@/lib/types";
import { Terminal, Copy, Check, Server, ChevronDown, ChevronUp } from "lucide-react";

interface DownstreamDispatchProps {
  dispatch?: ActionDispatch | null;
}

export function DownstreamDispatch({ dispatch }: DownstreamDispatchProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultDispatch = {
    target_service: "LOGISTICS_SERVICE",
    endpoint_action: "EXPEDITE_DELIVERY",
    parameters: {
      reference_id: "4021",
      priority_level: "P1",
      requires_agent_review: false,
    },
  };

  const payload = dispatch || defaultDispatch;
  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <SpotlightCard className="p-2.5 border border-[#1f1f23] shrink-0 font-mono text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Server className="w-3.5 h-3.5 text-[#00e5a0] shrink-0" />
          <span className="font-bold text-[10px] text-[#fafafa] uppercase tracking-wider">
            Downstream Action Dispatch:
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[#00b8ff] font-bold">
            {payload.target_service}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[#fafafa] hidden sm:inline">
            {payload.endpoint_action}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold">
            {payload.parameters?.priority_level || "P1"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-[#16161b] hover:bg-[#222228] border border-[#27272a] text-[#fafafa] text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#00e5a0]" />
                <span className="text-[#00e5a0]">Payload Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#71717a]" />
                <span>Copy Payload</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-[#16161b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title={isExpanded ? "Collapse JSON" : "Expand JSON"}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable JSON Body */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-[#17171d]">
          <pre className="p-2.5 rounded-lg bg-[#060608] border border-[#17171d] text-[10px] text-[#00e5a0] overflow-x-auto leading-relaxed select-text">
            {jsonString}
          </pre>
        </div>
      )}
    </SpotlightCard>
  );
}
