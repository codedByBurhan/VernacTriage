"use client";

import React from "react";

export function LinguisticLegend() {
  const items = [
    { label: "English", colorBg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-300", dot: "bg-blue-400" },
    { label: "Hindi (Devanagari)", colorBg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
    { label: "Arabic", colorBg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-300", dot: "bg-purple-400" },
    { label: "Phonetic / Romanized", colorBg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-300", dot: "bg-rose-400" },
    { label: "Arabizi / Numeral", colorBg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" },
    { label: "Slang / Abbr / Other", colorBg: "bg-zinc-500/15", border: "border-zinc-500/30", text: "text-zinc-300", dot: "bg-zinc-400" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-2 px-3 rounded-lg bg-zinc-950/40 border border-white/5">
      <span className="text-zinc-500 font-medium uppercase tracking-wider text-[11px] mr-1">
        Linguistic Taxonomy:
      </span>
      {items.map((item) => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${item.colorBg} ${item.border} ${item.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
