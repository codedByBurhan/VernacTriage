"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  isArabic?: boolean;
}

export function TextGenerateEffect({
  words,
  className = "",
  filter = true,
  duration = 0.35,
  isArabic = false,
}: TextGenerateEffectProps) {
  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => {
    // Split by spaces preserving words
    setTokens(words.split(" "));
  }, [words]);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`inline-block leading-relaxed tracking-wide ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div key={words} className="inline">
          {tokens.map((word, idx) => (
            <motion.span
              key={idx + word}
              initial={{
                opacity: 0,
                filter: filter ? "blur(6px)" : "none",
                y: 4,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              transition={{
                duration: duration,
                delay: idx * 0.035,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mr-1.5"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
