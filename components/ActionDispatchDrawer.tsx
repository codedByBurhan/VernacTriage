"use client";

import React, { useState } from "react";
import { ActionDispatch } from "@/lib/types";
import { ChevronDown, ChevronUp, Copy, Check, Server, Terminal } from "lucide-react";

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
        return "bg-rose-500/10 text-rose-300 border-rose-500/25";
      case "P2":
        return "bg-amber-500/10 text-amber-300 border-amber-500/25";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0f17] overflow-hidden text-xs">
      {/* Drawer Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <Server className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono text-zinc-200 font-semibold tracking-wider uppercase text-[11px]">
            Machine Payload
          </span>
          <span className="text-[11px] text-zinc-500 font-sans hidden sm:inline">
            — Structured downstream action
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-zinc-900 border-white/[0.06] text-zinc-300">
            {dispatch.target_service}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-zinc-900 border-white/[0.06] text-zinc-400 hidden sm:inline">
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

        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono">
          <span>{isOpen ? "Collapse" : "Inspect Payload"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 border-t border-white/[0.06] bg-[#090a0f] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-mono text-zinc-500 text-[10px] uppercase tracking-wider">
              Serialized JSON Webhook Object
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/[0.06]"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-[#06070a] border border-white/[0.06] font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed selection:bg-zinc-800">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
