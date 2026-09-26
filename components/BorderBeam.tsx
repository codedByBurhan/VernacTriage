"use client";

import React from "react";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  className?: string;
}

export function BorderBeam({
  size = 200,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = "#00e5a0",
  colorTo = "#00b8ff",
  delay = 0,
  className = "",
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] 
        ![mask-clip:padding-box,border-box] ![mask-composite:intersect] 
        [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] 
        after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam 
        after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] 
        after:[offset-anchor:calc(var(--size)*1px/2)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] ${className}`}
    />
  );
}
