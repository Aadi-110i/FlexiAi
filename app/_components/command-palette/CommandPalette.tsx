"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
} from "react";
import {
  MessageSquare,
  StickyNote,
  Search,
  Code2,
  PenTool,
  Maximize,
  LayoutGrid,
  RotateCcw,
  Command,
} from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { ContainerType } from "@/app/_lib/types/container";

interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ size: number }>;
  shortcut?: string[];
  action: () => void;
}

function useCommandItems(): CommandItem[] {
  const { addContainer, fitCanvas, closeCommandPalette } = useCanvasStore();

  const create = useCallback(
    (type: ContainerType) => {
      addContainer(type);
      closeCommandPalette();
    },
    [addContainer, closeCommandPalette]
  );

  return [
    {
      id: "new-chat",
      label: "New Chat",
      group: "Create",
      icon: MessageSquare,
      shortcut: ["⌘", "⌥", "C"],
      action: () => create("chat"),
    },
    {
      id: "new-note",
      label: "New Note",
      group: "Create",
      icon: StickyNote,
      shortcut: ["⌘", "⌥", "N"],
      action: () => create("note"),
    },
    {
      id: "new-search",
      label: "New Search",
      group: "Create",
      icon: Search,
      shortcut: ["⌘", "⌥", "S"],
      action: () => create("search"),
    },
    {
      id: "new-code",
      label: "New Code Editor",
      group: "Create",
      icon: Code2,
      action: () => create("code"),
    },
    {
      id: "new-drawing",
      label: "New Drawing",
      group: "Create",
      icon: PenTool,
      action: () => create("drawing"),
    },
    {
      id: "fit-canvas",
      label: "Fit Canvas",
      group: "Workspace",
      icon: Maximize,
      shortcut: ["F"],
      action: () => {
        fitCanvas();
        closeCommandPalette();
      },
    },
    {
      id: "reset-zoom",
      label: "Reset Zoom",
      group: "Workspace",
      icon: RotateCcw,
      action: () => {
        useCanvasStore.getState().setZoom(1);
        closeCommandPalette();
      },
    },
  ];
}

export const CommandPalette = memo(function CommandPalette() {
  const { closeCommandPalette } = useCanvasStore();
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = useCommandItems();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter items
  const filtered = allItems.filter((item) =>
    query.trim() === ""
      ? true
      : item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
  );

  // Group items
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatFiltered = filtered;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlighted((h) => (h + 1) % Math.max(flatFiltered.length, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlighted((h) =>
            h === 0 ? Math.max(flatFiltered.length - 1, 0) : h - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          flatFiltered[highlighted]?.action();
          break;
        case "Escape":
          e.preventDefault();
          closeCommandPalette();
          break;
      }
    },
    [flatFiltered, highlighted, closeCommandPalette]
  );

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  let itemIndex = -1;

  return (
    <div
      className="command-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCommandPalette();
      }}
    >
      <div className="command-palette">
        {/* Input */}
        <div className="command-input-wrap">
          <Command size={16} style={{ color: "var(--accent-text)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="What do you want to do?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span
            className="text-[11px]"
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="command-results">
          {filtered.length === 0 && (
            <div className="text-center py-6 text-sm" style={{ color: "var(--text-muted)" }}>
              No results for &quot;{query}&quot;
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="command-group-label">{group}</div>
              {items.map((item) => {
                itemIndex++;
                const idx = itemIndex;
                const Icon = item.icon;
                const isHighlighted = highlighted === flatFiltered.indexOf(item);
                return (
                  <button
                    key={item.id}
                    className={`command-item w-full ${isHighlighted ? "highlighted" : ""}`}
                    onClick={() => item.action()}
                    onMouseEnter={() =>
                      setHighlighted(flatFiltered.indexOf(item))
                    }
                  >
                    <span className="command-item-icon">
                      <Icon size={14} />
                    </span>
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="command-kbd">
                        {item.shortcut.map((key) => (
                          <kbd key={key} className="kbd">
                            {key}
                          </kbd>
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-4 py-2 border-t"
          style={{ borderColor: "var(--surface-border)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            <kbd className="kbd">↑↓</kbd> Navigate · <kbd className="kbd">↵</kbd> Select
          </span>
        </div>
      </div>
    </div>
  );
});
