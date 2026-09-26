"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEngine } from "@/context/EngineContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useEngine();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";
          const isInfo = toast.type === "info";

          const borderClass = isSuccess
            ? "border-[#10b981]/50 bg-[#0f0f12]/95 text-[#fafafa]"
            : isError
            ? "border-[#f43f5e]/50 bg-[#0f0f12]/95 text-[#fafafa]"
            : isWarning
            ? "border-[#f59e0b]/50 bg-[#0f0f12]/95 text-[#fafafa]"
            : "border-[#22d3ee]/50 bg-[#0f0f12]/95 text-[#fafafa]";

          const icon = isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-[#f43f5e] shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#22d3ee] shrink-0" />
          );

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.16 }}
              className={`p-3.5 rounded-xl border shadow-2xl pointer-events-auto flex items-start justify-between gap-3 font-mono text-xs ${borderClass} backdrop-blur-md`}
            >
              <div className="flex items-start gap-2.5">
                {icon}
                <div className="space-y-1">
                  <p className="text-xs leading-snug font-sans">{toast.message}</p>
                  {toast.actionLabel && toast.onAction && (
                    <button
                      type="button"
                      onClick={() => {
                        toast.onAction?.();
                        dismissToast(toast.id);
                      }}
                      className="text-[11px] font-mono text-[#22d3ee] hover:underline font-semibold cursor-pointer block mt-1"
                    >
                      {toast.actionLabel} →
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
