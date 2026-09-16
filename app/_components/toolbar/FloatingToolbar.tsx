"use client";

import React, { useCallback, memo } from "react";
import {
  MessageSquare,
  StickyNote,
  Search,
  Code2,
  PenTool,
  MousePointer2,
  Hand,
  Maximize,
  Command,
} from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import { useShallow } from "zustand/react/shallow";
import type { ContainerType } from "@/app/_lib/types/container";

const CREATE_ACTIONS: {
  type: ContainerType;
  icon: React.ComponentType<{ size: number }>;
  label: string;
}[] = [
  { type: "chat", icon: MessageSquare, label: "Chat" },
  { type: "note", icon: StickyNote, label: "Note" },
  { type: "search", icon: Search, label: "Search" },
  { type: "code", icon: Code2, label: "Code" },
  { type: "drawing", icon: PenTool, label: "Draw" },
];

export const FloatingToolbar = memo(function FloatingToolbar() {
  const { tool, setTool, addContainer, openCommandPalette, fitCanvas } =
    useCanvasStore(useShallow((s) => ({
      tool: s.tool,
      setTool: s.setTool,
      addContainer: s.addContainer,
      openCommandPalette: s.openCommandPalette,
      fitCanvas: s.fitCanvas,
    })));

  const handleCreate = useCallback(
    (type: ContainerType) => {
      addContainer(type);
    },
    [addContainer]
  );

  return (
    <div
      className="fixed top-3 z-50"
      style={{ left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-full"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(16px)",
          fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
          "--text-primary": "#1A1A1A",
          "--text-secondary": "#595959",
          "--surface-hover": "rgba(255, 255, 255, 0.95)",
          "--surface-border": "rgba(0, 0, 0, 0.1)",
        } as React.CSSProperties}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-1.5 pr-2 mr-0.5 select-none"
          style={{ borderRight: "1px solid var(--surface-border)" }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[13px] font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            ✦
          </div>
          <span
            className="text-[14px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Orbit
          </span>
        </div>

        {/* Tool toggles */}
        <button
          id="tool-select"
          className={`toolbar-btn ${tool === "select" ? "active" : ""}`}
          onClick={() => setTool("select")}
          title="Select (V)"
        >
          <MousePointer2 size={16} />
          <span className="text-[14px]">Select</span>
        </button>
        <button
          id="tool-hand"
          className={`toolbar-btn ${tool === "hand" ? "active" : ""}`}
          onClick={() => setTool("hand")}
          title="Pan (H)"
        >
          <Hand size={16} />
          <span className="text-[14px]">Hand</span>
        </button>

        <div className="toolbar-divider mx-0.5" />

        {/* Create actions */}
        {CREATE_ACTIONS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            id={`create-${type}`}
            className="toolbar-btn toolbar-btn-add"
            onClick={() => handleCreate(type)}
            title={`New ${label}`}
          >
            <Icon size={16} />
            <span className="text-[14px]">+{label}</span>
          </button>
        ))}

        <div className="toolbar-divider mx-0.5" />

        {/* Fit canvas */}
        <button
          className="toolbar-btn"
          onClick={fitCanvas}
          title="Fit canvas (F)"
        >
          <Maximize size={16} />
        </button>

        {/* Command palette */}
        <button
          id="open-command"
          className="toolbar-btn"
          onClick={openCommandPalette}
          title="Command palette (⌘K)"
        >
          <Command size={16} />
        </button>
      </div>
    </div>
  );
});
