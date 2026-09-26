"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEngine } from "@/context/EngineContext";
import {
  Key,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ShieldCheck,
} from "lucide-react";

export function ApiKeyModal() {
  const {
    isKeyModalOpen,
    closeKeyModal,
    apiKey,
    saveApiKey,
    clearApiKey,
    setEngineMode,
    showToast,
  } = useEngine();

  const [inputVal, setInputVal] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isKeyModalOpen) {
      setInputVal(apiKey);
      setValidationError(null);
    }
  }, [isKeyModalOpen, apiKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isKeyModalOpen) {
        closeKeyModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isKeyModalOpen, closeKeyModal]);

  if (!isKeyModalOpen) return null;

  const handleTestAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = inputVal.trim();
    if (!cleanKey) {
      setValidationError("Please enter an API key.");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": cleanKey,
        },
        body: JSON.stringify({ apiKey: cleanKey }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || "Invalid Gemini API key.");
      }

      // Key validated successfully
      saveApiKey(cleanKey);
      setEngineMode("live");
      showToast({
        type: "success",
        message: "Gemini API key validated and activated for live queries!",
      });
      closeKeyModal();
    } catch (err: any) {
      setValidationError(err.message || "Key validation failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setInputVal("");
    setValidationError(null);
  };

  const handleUseDemo = () => {
    setEngineMode("demo");
    closeKeyModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeKeyModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-2xl border border-[#27272a] bg-[#0f0f12] p-6 shadow-2xl space-y-5 font-mono text-xs z-10 text-[#fafafa]"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#10b981]">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#fafafa]">
                  Gemini API Configuration
                </h3>
                <span className="text-[11px] text-[#71717a]">
                  Bring-Your-Own-Key (BYOK)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeKeyModal}
              className="p-1 rounded-md text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[11px] text-[#a1a1aa] font-sans leading-relaxed">
            Provide your Google AI Studio API key to test custom code-switched inputs in real time.
            Your key is stored solely in your browser&apos;s <code className="text-[#fafafa]">localStorage</code> and never logged or exposed.
          </p>

          {/* Input Form */}
          <form onSubmit={handleTestAndSave} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#71717a] block">
                Google Gemini API Key
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2 rounded-lg bg-[#09090b] border border-[#27272a] focus:border-[#10b981] text-[#fafafa] placeholder:text-[#3f3f46] text-xs font-mono focus:outline-none transition-colors"
                  spellCheck={false}
                  autoComplete="off"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {validationError && (
              <div className="p-2 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] flex items-center gap-2 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Helper Link */}
            <div className="flex items-center justify-between text-[11px]">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#22d3ee] hover:underline flex items-center gap-1"
              >
                <span>Get a free Gemini API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[#f43f5e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Key</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isValidating || !inputVal.trim()}
                className="w-full py-2.5 rounded-lg bg-[#10b981] hover:bg-[#34d399] disabled:bg-[#18181b] text-[#09090b] disabled:text-[#71717a] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating Key with Gemini Flash...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Test &amp; Save Key</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleUseDemo}
                className="w-full py-2 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#09090b] text-[#a1a1aa] hover:text-[#fafafa] text-xs transition-colors cursor-pointer"
              >
                Use Platform Default / Demo Presets
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="pt-3 border-t border-[#27272a]/60 flex items-center gap-2 text-[10px] text-[#71717a]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
            <span>Plaintext browser localStorage • Zero server persistence</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
