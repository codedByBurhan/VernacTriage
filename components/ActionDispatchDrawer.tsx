"use client";

import React, { useState } from "react";
import { ActionDispatch } from "@/lib/types";
import { ChevronDown, ChevronUp, Copy, Check, Terminal } from "lucide-react";

interface ActionDispatchDrawerProps {
  dispatch?: ActionDispatch;
}

export function ActionDispatchDrawer({ dispatch }: ActionDispatchDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!dispatch) return null;

  const jsonString = JSON.stringify(dispatch, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "P1":
        return "bg-rose-500/10 text-rose-300 border-rose-500/25";
      case "P2":
        return "bg-amber-500/10 text-amber-300 border-amber-500/25";
      default:
        return "bg-[#18181b] text-[#a1a1aa] border-[#27272a]";
    }
  };

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111114] overflow-hidden text-xs">
      {/* Drawer Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#18181b]/50 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <Terminal className="w-3.5 h-3.5 text-[#00e5a0]" />
          <span className="font-mono text-[#fafafa] font-semibold tracking-wider uppercase text-[11px]">
            ACTION DISPATCH
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#09090b] border-[#27272a] text-[#00b8ff]">
            {dispatch.target_service}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#09090b] border-[#27272a] text-[#fafafa]">
            {dispatch.endpoint_action}
          </span>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${getPriorityBadge(
              dispatch.parameters.priority_level
            )}`}
          >
            {dispatch.parameters.priority_level}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#71717a] text-[11px] font-mono">
          <span>{isOpen ? "Collapse" : "Inspect Payload"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 border-t border-[#1f1f23] bg-[#09090b] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#a1a1aa]">
            <span className="font-mono text-[#71717a] text-[10px] uppercase tracking-wider">
              Serialized Machine Dispatch Payload
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#27272a]"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#00e5a0]" />
                  <span className="text-[#00e5a0]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#71717a]" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-[#06070a] border border-[#1f1f23] font-mono text-[11px] text-[#fafafa] overflow-x-auto leading-relaxed selection:bg-[#27272a]">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
