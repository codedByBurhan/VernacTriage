"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type EngineMode = "demo" | "live";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface EngineContextType {
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
  apiKey: string;
  saveApiKey: (key: string) => void;
  clearApiKey: () => void;
  isKeyModalOpen: boolean;
  openKeyModal: () => void;
  closeKeyModal: () => void;
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
  maskedKey: string;
  hasKey: boolean;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

const STORAGE_KEY = "vernac_gemini_key";
const MODE_STORAGE_KEY = "vernac_engine_mode";

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [engineMode, setEngineModeState] = useState<EngineMode>("demo");
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Load persisted key and mode on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY);
      if (storedKey && storedKey.trim()) {
        setApiKeyState(storedKey.trim());
      }

      const storedMode = localStorage.getItem(MODE_STORAGE_KEY) as EngineMode | null;
      if (storedMode === "demo" || storedMode === "live") {
        setEngineModeState(storedMode);
      }
    } catch {
      // Silently fall back to default state
    }
  }, []);

  const setEngineMode = (mode: EngineMode) => {
    setEngineModeState(mode);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MODE_STORAGE_KEY, mode);
      } catch {}
    }

    showToast({
      type: "info",
      message:
        mode === "demo"
          ? "Switched to Demo Mode (Instant precomputed presets)"
          : "Switched to Live Gemini Engine (Real-time LLM pipeline)",
      duration: 3000,
    });
  };

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKeyState(trimmed);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } catch {}
    }
  };

  const clearApiKey = () => {
    setApiKeyState("");
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    showToast({
      type: "info",
      message: "Personal Gemini API key removed from browser storage.",
      duration: 3000,
    });
  };

  const openKeyModal = () => setIsKeyModalOpen(true);
  const closeKeyModal = () => setIsKeyModalOpen(false);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Masked string e.g. "••••Ab12"
  const maskedKey = apiKey
    ? `••••${apiKey.slice(-4)}`
    : "";

  const hasKey = Boolean(apiKey && apiKey.length > 5);

  return (
    <EngineContext.Provider
      value={{
        engineMode,
        setEngineMode,
        apiKey,
        saveApiKey,
        clearApiKey,
        isKeyModalOpen,
        openKeyModal,
        closeKeyModal,
        toasts,
        showToast,
        dismissToast,
        maskedKey,
        hasKey,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error("useEngine must be used within an EngineProvider");
  }
  return context;
}
