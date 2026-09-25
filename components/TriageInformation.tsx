"use client";

import React from "react";
import { IntentAnalysis, EntityItem, PragmaticRegister } from "@/lib/types";
import {
  Briefcase,
  Clock,
  RotateCcw,
  Truck,
  Sparkles,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";

interface TriageInformationProps {
  intent: IntentAnalysis;
  entities: EntityItem[];
  pragmaticRegister?: PragmaticRegister;
}

export function TriageInformation({
  intent,
  entities,
  pragmaticRegister,
}: TriageInformationProps) {
  // Map intent label to friendly icon and color
  const getIntentMeta = (label: string) => {
    const l = (label || "").toUpperCase();
    if (l.includes("DELIVERY") || l.includes("SHIPPING")) {
      return {
        icon: Truck,
        color: "text-amber-400",
        bg: "bg-amber-950/30",
        border: "border-amber-500/30",
        department: "Logistics & Delivery Ops",
      };
    }
    if (l.includes("TRAFFIC") || l.includes("DELAY")) {
      return {
        icon: Clock,
        color: "text-purple-400",
        bg: "bg-purple-950/30",
        border: "border-purple-500/30",
        department: "Field Dispatch & Scheduling",
      };
    }
    if (l.includes("REFUND") || l.includes("PAYMENT") || l.includes("FINANCIAL")) {
      return {
        icon: RotateCcw,
        color: "text-emerald-400",
        bg: "bg-emerald-950/30",
        border: "border-emerald-500/30",
        department: "Billing & Accounts Escalation",
      };
    }
    return {
      icon: Briefcase,
      color: "text-blue-400",
      bg: "bg-blue-950/30",
      border: "border-blue-500/30",
      department: "Customer Support Triage",
    };
  };

  const getToneStyle = (tone?: string) => {
    switch (tone) {
      case "Pleading-Urgent":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Escalating-Hostile":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Formal":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
      case "Colloquial-Familiar":
      default:
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    }
  };

  const meta = getIntentMeta(intent.label);
  const IntentIcon = meta.icon;
  const confidencePercent = Math.round((intent.confidence || 0.85) * 100);

  // Helper for entity badges
  const getEntityBadgeStyle = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes("STATUS") || t.includes("ISSUE")) {
      return "bg-rose-500/10 border-rose-500/30 text-rose-300";
    }
    if (t.includes("TIME") || t.includes("DATE")) {
      return "bg-purple-500/10 border-purple-500/30 text-purple-300";
    }
    if (t.includes("ITEM") || t.includes("ORDER")) {
      return "bg-blue-500/10 border-blue-500/30 text-blue-300";
    }
    if (t.includes("ACTION") || t.includes("REQ")) {
      return "bg-amber-500/10 border-amber-500/30 text-amber-300";
    }
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-200">
          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          Section C — Business Triage &amp; Extracted Entities
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">
          Automated Routing Data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Left: Intent & Pragmatic Register Card (col-span-5) */}
        <div className={`md:col-span-5 rounded-xl ${meta.bg} border ${meta.border} p-4 space-y-3 flex flex-col justify-between`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Classified Business Intent
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-zinc-300">
                {meta.department}
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className={`p-2 rounded-lg bg-black/40 border border-white/10 ${meta.color} shrink-0 mt-0.5`}>
                <IntentIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold font-mono tracking-tight text-white block">
                  {intent.label}
                </span>

                {/* Pragmatic Register Tone Badge */}
                {pragmaticRegister && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] uppercase font-mono text-zinc-400">Register:</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${getToneStyle(pragmaticRegister.tone)}`}>
                      {pragmaticRegister.tone}
                    </span>
                  </div>
                )}

                <span className="text-[11px] text-zinc-400 font-mono block">
                  Confidence Score:{" "}
                  <strong className={meta.color}>{confidencePercent}%</strong>
                </span>
              </div>
            </div>

            {/* Cultural Markers Display */}
            {pragmaticRegister && pragmaticRegister.cultural_markers && pragmaticRegister.cultural_markers.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-indigo-400" />
                  Cultural &amp; Socio-Linguistic Markers:
                </span>
                <div className="flex flex-wrap gap-1">
                  {pragmaticRegister.cultural_markers.map((marker, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300"
                    >
                      &ldquo;{marker}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confidence Bar */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidencePercent >= 90
                    ? "bg-emerald-400"
                    : confidencePercent >= 75
                    ? "bg-blue-400"
                    : "bg-amber-400"
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Extracted Entities (col-span-7) */}
        <div className="md:col-span-7 rounded-xl bg-black/40 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Ground-Truth Extracted Entities ({entities.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Payload Key-Value
              </span>
            </div>

            {entities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                {entities.map((item, idx) => {
                  const badgeClass = getEntityBadgeStyle(item.type);
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex flex-col justify-between space-y-1"
                    >
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold w-fit ${badgeClass}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-zinc-100 truncate">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-zinc-500 italic">
                No distinct categorical entities isolated in this stream.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
