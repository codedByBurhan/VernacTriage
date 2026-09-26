"use client";

import React from "react";
import Image from "next/image";
import {
  Terminal,
  BarChart3,
  Layers,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export type SidebarTab = "analyze" | "benchmark" | "overview";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onOpenDocs: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  onOpenDocs,
  isCollapsed = false,
}: SidebarProps) {
  const navItems = [
    {
      id: "analyze" as SidebarTab,
      label: "Analyze",
      icon: Terminal,
      shortcut: "⌘1",
      badge: "Console",
      badgeColor: "bg-[#00e5a0]/10 text-[#00e5a0] border-[#00e5a0]/30",
    },
    {
      id: "benchmark" as SidebarTab,
      label: "Benchmark",
      icon: BarChart3,
      shortcut: "⌘2",
      badge: "36 Cases",
      badgeColor: "bg-[#18181b] text-[#a1a1aa] border-[#27272a]",
    },
    {
      id: "overview" as SidebarTab,
      label: "Overview",
      icon: Layers,
      shortcut: "⌘3",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <aside
      className={`h-screen flex flex-col justify-between bg-[#0d0d10] border-r border-[#1f1f23] transition-all duration-200 select-none z-30 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Section: Brand Identity & Primary Nav */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1f1f23]">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => onTabChange("analyze")}
              className="mx-auto block cursor-pointer transition-transform hover:scale-105"
              title="VernacTriage"
            >
              <div className="relative h-7 w-auto aspect-[345/246] flex items-center justify-center">
                <Image
                  src="/brand/vernactriage-visual-logo.png"
                  alt="VernacTriage Visual Mark"
                  width={34}
                  height={24}
                  className="h-full w-auto object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]"
                  priority
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTabChange("analyze")}
              className="flex items-center gap-2.5 text-left cursor-pointer group py-1"
            >
              <div className="relative h-7 w-auto aspect-[345/246] flex items-center justify-center shrink-0">
                <Image
                  src="/brand/vernactriage-visual-logo.png"
                  alt="VernacTriage Visual Mark"
                  width={38}
                  height={27}
                  className="h-full w-auto object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]"
                  priority
                />
              </div>
              <span className="font-bold text-base tracking-tight text-white group-hover:text-white transition-colors">
                VernacTriage
              </span>
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-1">
          <div className={`px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#71717a] ${isCollapsed ? "hidden" : "block"}`}>
            Workspaces
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer group ${
                  isActive
                    ? "bg-[#18181b] text-[#fafafa] font-semibold border border-[#27272a]"
                    : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#151518] border border-transparent"
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#00e5a0]" : "text-[#71717a] group-hover:text-[#a1a1aa]"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* System Pipeline / Architecture Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenDocs}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#151518] transition-colors cursor-pointer border border-transparent group"
              title="Pipeline / System Specifications"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCode className="w-4 h-4 text-[#71717a] group-hover:text-[#a1a1aa] shrink-0" />
                {!isCollapsed && <span className="truncate">Pipeline / System</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa]">
                  Docs
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Section: System State & Health */}
      <div className="p-3 border-t border-[#1f1f23] space-y-2 bg-[#09090b]">
        {!isCollapsed ? (
          <div className="space-y-2 text-[11px] font-mono">
            {/* System State Tile */}
            <div className="p-2.5 rounded-lg bg-[#111114] border border-[#1f1f23] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-[#71717a]">
                  API Status
                </span>
                <span className="flex items-center gap-1.5 text-[#00e5a0] text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1f1f23]">
                <span className="text-[#71717a]">Model:</span>
                <span className="text-[#fafafa] font-mono font-medium">gemini-2.5-flash</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#71717a]">Verification:</span>
                <span className="text-[#00e5a0] font-mono font-medium">Deterministic</span>
              </div>
            </div>

            {/* Version & Invariant Status */}
            <div className="px-1 flex items-center justify-between text-[9px] text-[#71717a]">
              <span>v2.4 Enterprise</span>
              <span>100% Invariants</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#00e5a0] animate-pulse"
              title="System Operational: Gemini 2.5 Flash Connected"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
