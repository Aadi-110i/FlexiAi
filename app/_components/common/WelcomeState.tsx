"use client";

import React, { memo } from "react";
import { MessageSquare, StickyNote, Search, Code2, PenTool } from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { ContainerType } from "@/app/_lib/types/container";

export const WelcomeState = memo(function WelcomeState() {
  const { addContainer } = useCanvasStore();

  const actions: {
    type: ContainerType;
    icon: React.ComponentType<{ size: number }>;
    label: string;
    description: string;
  }[] = [
    { type: "chat", icon: MessageSquare, label: "+ Chat", description: "AI conversation" },
    { type: "note", icon: StickyNote, label: "+ Note", description: "Quick notes" },
    { type: "search", icon: Search, label: "+ Search", description: "Web research" },
    { type: "code", icon: Code2, label: "+ Code", description: "Code editor" },
    { type: "drawing", icon: PenTool, label: "+ Draw", description: "Diagrams" },
  ];

  return (
    <div className="welcome-card">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: "var(--accent)", boxShadow: "0 4px 20px rgba(14, 143, 131, 0.4)" }}
        >
          ✦
        </div>
      </div>

      <h1
        className="text-2xl font-bold mb-2 tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        Welcome to Orbit
      </h1>
      <p
        className="text-[14px] mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        Your workspace has no limits.
        <br />
        Start by creating something.
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {actions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            id={`welcome-create-${type}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-[13px] transition-all hover:scale-105"
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
            }}
            onClick={() => addContainer(type)}
          >
            <Icon size={13} className="text-[var(--accent-text)]" />
            {label}
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <p
        className="text-[11px] mt-8"
        style={{ color: "var(--text-muted)" }}
      >
        <kbd className="kbd">⌘K</kbd> for commands ·{" "}
        <kbd className="kbd">V</kbd> select ·{" "}
        <kbd className="kbd">H</kbd> pan ·{" "}
        <kbd className="kbd">F</kbd> fit
      </p>
    </div>
  );
});
