"use client";

import React from "react";

export function LinguisticLegend() {
  const items = [
    { label: "English", dot: "bg-blue-400" },
    { label: "Hindi (Devanagari / Romanized)", dot: "bg-amber-400" },
    { label: "Arabic (Orthographic / Arabizi)", dot: "bg-purple-400" },
    { label: "Phonetic / Slang", dot: "bg-orange-400" },
    { label: "Collision Homograph", dot: "bg-amber-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono py-2 px-3 rounded-lg bg-[#0d0f17] border border-white/[0.06] text-zinc-400">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-0.5">
        Taxonomy:
      </span>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 text-zinc-300">
          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
