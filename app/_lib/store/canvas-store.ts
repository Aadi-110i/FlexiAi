"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  OrbContainer,
  ContainerType,
  ContainerPosition,
  ContainerSize,
  ChatMessage,
  ContextSource,
} from "@/app/_lib/types/container";
import {
  defaultChatState,
  defaultNoteState,
  defaultSearchState,
  defaultCodeState,
  defaultDrawingState,
} from "@/app/_lib/types/container";

export type CanvasTool = "select" | "hand";

interface CanvasState {
  // Canvas view
  panX: number;
  panY: number;
  zoom: number;
  tool: CanvasTool;

  // Containers
  containers: OrbContainer[];
  selectedIds: string[];
  activeId: string | null;

  // UI
  isCommandPaletteOpen: boolean;
  contextMenuState: {
    open: boolean;
    x: number;
    y: number;
    containerId: string | null;
  };

  // Canvas actions
  setPan: (x: number, y: number) => void;
  setZoom: (zoom: number, origin?: { x: number; y: number }) => void;
  setTool: (tool: CanvasTool) => void;
  fitCanvas: () => void;

  // Container actions
  addContainer: (type: ContainerType, position?: ContainerPosition) => string;
  updateContainer: (id: string, updates: Partial<OrbContainer>) => void;
  removeContainer: (id: string) => void;
  duplicateContainer: (id: string) => void;
  focusContainer: (id: string) => void;
  selectContainer: (id: string, addToSelection?: boolean) => void;
  clearSelection: () => void;
  setContainerPosition: (id: string, position: ContainerPosition) => void;
  setContainerSize: (id: string, size: ContainerSize) => void;
  minimizeContainer: (id: string) => void;
  maximizeContainer: (id: string) => void;
  restoreContainer: (id: string) => void;

  // Chat actions
  addMessage: (containerId: string, message: ChatMessage) => void;
  updateMessage: (containerId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  setGenerating: (containerId: string, isGenerating: boolean) => void;
  addContextSource: (containerId: string, source: ContextSource) => void;
  removeContextSource: (containerId: string, sourceId: string) => void;

  // Note actions
  setNoteContent: (containerId: string, content: string) => void;

  // Search actions
  setSearchQuery: (containerId: string, query: string) => void;
  setSearchResults: (containerId: string, results: import("@/app/_lib/types/container").SearchResult[]) => void;
  setSearching: (containerId: string, isSearching: boolean) => void;

  // Code actions
  setCodeContent: (containerId: string, code: string) => void;
  setCodeLanguage: (containerId: string, language: string) => void;
  setCodeFilename: (containerId: string, filename: string) => void;

  // Command palette
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Context menu
  openContextMenu: (x: number, y: number, containerId: string | null) => void;
  closeContextMenu: () => void;
}

let nextZIndex = 10;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createContainer(
  type: ContainerType,
  position: ContainerPosition,
  workspaceId: string
): OrbContainer {
  const base = {
    id: generateId(),
    workspaceId,
    title: defaultTitle(type),
    position,
    size: defaultSize(type),
    zIndex: ++nextZIndex,
    minimized: false,
    maximized: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  switch (type) {
    case "chat":
      return { ...base, type: "chat", state: defaultChatState() };
    case "note":
      return { ...base, type: "note", state: defaultNoteState() };
    case "search":
      return { ...base, type: "search", state: defaultSearchState() };
    case "code":
      return { ...base, type: "code", state: defaultCodeState() };
    case "drawing":
      return { ...base, type: "drawing", state: defaultDrawingState() };
  }
}

function defaultTitle(type: ContainerType): string {
  const map: Record<ContainerType, string> = {
    chat: "New Chat",
    note: "Untitled Note",
    search: "Research",
    code: "Code",
    drawing: "Diagram",
  };
  return map[type];
}

function defaultSize(type: ContainerType): ContainerSize {
  const map: Record<ContainerType, ContainerSize> = {
    chat: { width: 600, height: 800 },
    note: { width: 480, height: 600 },
    search: { width: 540, height: 720 },
    code: { width: 720, height: 640 },
    drawing: { width: 800, height: 640 },
  };
  return map[type];
}

const WORKSPACE_ID = "default";

function getInitialContainers(): OrbContainer[] {
  const ws = WORKSPACE_ID;
  
  const c1 = createContainer("search", { x: -750, y: -150 }, ws);
  c1.size = { width: 500, height: 420 };
  
  const c2 = createContainer("chat", { x: -200, y: -350 }, ws);
  c2.size = { width: 620, height: 750 };
  // Pre-populate some code into the chat container to match screenshot vibe
  if (c2.type === "chat") {
    c2.state.messages = [
      {
        id: "1",
        role: "assistant",
        content: "Here is the code snippet you requested:\n```typescript\nimport React from 'react';\n\nexport function Component() {\n  return <div>Hello World</div>;\n}\n```",
        timestamp: Date.now(),
      }
    ];
  }
  
  const c3 = createContainer("search", { x: 470, y: -450 }, ws);
  c3.size = { width: 460, height: 420 };
  
  const c4 = createContainer("note", { x: 470, y: 50 }, ws);
  c4.size = { width: 440, height: 500 };
  if (c4.type === "note") {
    c4.state.content = "Project Ideas:\n\n- Dark mode support\n- Mobile responsive\n- Offline sync";
  }
  
  const c5 = createContainer("search", { x: 970, y: -200 }, ws);
  c5.size = { width: 480, height: 560 };
  
  return [c1, c2, c3, c4, c5];
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      // Initial state
      panX: 0,
      panY: 0,
      zoom: 1,
      tool: "select",
      containers: getInitialContainers(),
      selectedIds: [],
      activeId: null,
      isCommandPaletteOpen: false,
      contextMenuState: {
        open: false,
        x: 0,
        y: 0,
        containerId: null,
      },

      // Canvas
      setPan: (panX, panY) => set({ panX, panY }),
      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.2), 3) }),
      setTool: (tool) => set({ tool }),
      fitCanvas: () => set({ panX: 0, panY: 0, zoom: 1 }),

      // Containers
      addContainer: (type, position) => {
        const state = get();
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        const center = position ?? {
          x: -state.panX / state.zoom + (screenWidth / 2) / state.zoom - 200 + Math.random() * 40 - 20,
          y: -state.panY / state.zoom + (screenHeight / 2) / state.zoom - 150 + Math.random() * 40 - 20,
        };
        const container = createContainer(type, center, WORKSPACE_ID);
        set((s) => ({ containers: [...s.containers, container], activeId: container.id }));
        return container.id;
      },

      updateContainer: (id, updates) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? ({ ...c, ...updates, updatedAt: Date.now() } as OrbContainer) : c
          ),
        }));
      },

      removeContainer: (id) => {
        set((s) => ({
          containers: s.containers.filter((c) => c.id !== id),
          selectedIds: s.selectedIds.filter((sid) => sid !== id),
          activeId: s.activeId === id ? null : s.activeId,
        }));
      },

      duplicateContainer: (id) => {
        const state = get();
        const original = state.containers.find((c) => c.id === id);
        if (!original) return;
        const duplicate: OrbContainer = {
          ...original,
          id: generateId(),
          position: {
            x: original.position.x + 30,
            y: original.position.y + 30,
          },
          zIndex: ++nextZIndex,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ containers: [...s.containers, duplicate], activeId: duplicate.id }));
      },

      focusContainer: (id) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, zIndex: ++nextZIndex } : c
          ),
          activeId: id,
        }));
      },

      selectContainer: (id, addToSelection = false) => {
        set((s) => ({
          selectedIds: addToSelection
            ? s.selectedIds.includes(id)
              ? s.selectedIds.filter((sid) => sid !== id)
              : [...s.selectedIds, id]
            : [id],
          activeId: id,
        }));
      },

      clearSelection: () => set({ selectedIds: [], activeId: null }),

      setContainerPosition: (id, position) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, position, updatedAt: Date.now() } : c
          ),
        }));
      },

      setContainerSize: (id, size) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, size, updatedAt: Date.now() } : c
          ),
        }));
      },

      minimizeContainer: (id) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, minimized: true, maximized: false } : c
          ),
        }));
      },

      maximizeContainer: (id) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, maximized: true, minimized: false, zIndex: ++nextZIndex } : c
          ),
          activeId: id,
        }));
      },

      restoreContainer: (id) => {
        set((s) => ({
          containers: s.containers.map((c) =>
            c.id === id ? { ...c, minimized: false, maximized: false } : c
          ),
        }));
      },

      // Chat
      addMessage: (containerId, message) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "chat") return c;
            return {
              ...c,
              state: { ...c.state, messages: [...c.state.messages, message] },
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      updateMessage: (containerId, messageId, updates) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "chat") return c;
            return {
              ...c,
              state: {
                ...c.state,
                messages: c.state.messages.map((m) =>
                  m.id === messageId ? { ...m, ...updates } : m
                ),
              },
            };
          }),
        }));
      },

      setGenerating: (containerId, isGenerating) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "chat") return c;
            return { ...c, state: { ...c.state, isGenerating } };
          }),
        }));
      },

      addContextSource: (containerId, source) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "chat") return c;
            return {
              ...c,
              state: {
                ...c.state,
                contextSources: [...c.state.contextSources, source],
              },
            };
          }),
        }));
      },

      removeContextSource: (containerId, sourceId) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "chat") return c;
            return {
              ...c,
              state: {
                ...c.state,
                contextSources: c.state.contextSources.filter((cs) => cs.id !== sourceId),
              },
            };
          }),
        }));
      },

      // Note
      setNoteContent: (containerId, content) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "note") return c;
            return {
              ...c,
              state: { ...c.state, content, lastSaved: null },
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      // Search
      setSearchQuery: (containerId, query) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "search") return c;
            return { ...c, state: { ...c.state, query } };
          }),
        }));
      },

      setSearchResults: (containerId, results) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "search") return c;
            return { ...c, state: { ...c.state, results, isSearching: false } };
          }),
        }));
      },

      setSearching: (containerId, isSearching) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "search") return c;
            return { ...c, state: { ...c.state, isSearching } };
          }),
        }));
      },

      // Code
      setCodeContent: (containerId, code) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "code") return c;
            return { ...c, state: { ...c.state, code }, updatedAt: Date.now() };
          }),
        }));
      },

      setCodeLanguage: (containerId, language) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "code") return c;
            return { ...c, state: { ...c.state, language } };
          }),
        }));
      },

      setCodeFilename: (containerId, filename) => {
        set((s) => ({
          containers: s.containers.map((c) => {
            if (c.id !== containerId || c.type !== "code") return c;
            return { ...c, state: { ...c.state, filename } };
          }),
        }));
      },

      // Command palette
      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),

      // Context menu
      openContextMenu: (x, y, containerId) =>
        set({ contextMenuState: { open: true, x, y, containerId } }),
      closeContextMenu: () =>
        set((s) => ({ contextMenuState: { ...s.contextMenuState, open: false } })),
    }),
    {
      name: "orbit-canvas-state",
      partialize: (state) => ({
        panX: state.panX,
        panY: state.panY,
        zoom: state.zoom,
        containers: state.containers,
      }),
    }
  )
);
