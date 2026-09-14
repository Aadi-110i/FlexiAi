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
    useCanvasStore();

  const handleCreate = useCallback(
    (type: ContainerType) => {
      addContainer(type);
    },
    [addContainer]
  );

  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
      style={{ zIndex: 9999 }}
    >
      <div
        className="flex items-center gap-1 px-3 py-1.5 rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--surface-border)",
          boxShadow: "var(--shadow-lg)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-1.5 pr-2 mr-0.5 select-none"
          style={{ borderRight: "1px solid var(--surface-border)" }}
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            ✦
          </div>
          <span
            className="text-[12px] font-bold tracking-tight"
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
          <MousePointer2 size={13} />
          <span className="text-[12px]">Select</span>
        </button>
        <button
          id="tool-hand"
          className={`toolbar-btn ${tool === "hand" ? "active" : ""}`}
          onClick={() => setTool("hand")}
          title="Pan (H)"
        >
          <Hand size={13} />
          <span className="text-[12px]">Hand</span>
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
            <Icon size={13} />
            <span className="text-[12px]">+{label}</span>
          </button>
        ))}

        <div className="toolbar-divider mx-0.5" />

        {/* Fit canvas */}
        <button
          className="toolbar-btn"
          onClick={fitCanvas}
          title="Fit canvas (F)"
        >
          <Maximize size={13} />
        </button>

        {/* Command palette */}
        <button
          id="open-command"
          className="toolbar-btn"
          onClick={openCommandPalette}
          title="Command palette (⌘K)"
        >
          <Command size={13} />
        </button>
      </div>
    </div>
  );
});
