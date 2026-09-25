"use client";

import React, { useState } from "react";
import { ActionDispatch } from "@/lib/types";
import { Terminal, ChevronDown, ChevronUp, Copy, Check, Server, ArrowRight } from "lucide-react";

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
    setTimeout(() => setCopied(false), 1500);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "P1":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "P2":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden text-xs">
      {/* Drawer Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-zinc-400" />
          <span className="font-mono text-zinc-300 font-semibold tracking-wide uppercase text-[11px]">
            Automated ERP/CRM Payload
          </span>
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            (Machine Dispatch)
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded border bg-zinc-900 border-zinc-700 text-zinc-300">
            {dispatch.target_service}
          </span>
          <ArrowRight className="w-3 h-3 text-zinc-600 hidden sm:inline" />
          <span className="text-[9px] font-mono px-2 py-0.5 rounded border bg-zinc-900 border-zinc-700 text-indigo-300 hidden sm:inline">
            {dispatch.endpoint_action}
          </span>
          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getPriorityBadge(dispatch.parameters.priority_level)}`}>
            {dispatch.parameters.priority_level}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-[11px] font-mono">{isOpen ? "Collapse" : "Inspect Payload"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 border-t border-white/5 bg-[#08090f] space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Read-only structured downstream webhook representation</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-black/70 border border-white/5 font-mono text-[11px] text-indigo-200 overflow-x-auto leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
