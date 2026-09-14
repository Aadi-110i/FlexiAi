// ============================================================
// Orbit — Container Type System
// ============================================================

export type ContainerType = "chat" | "note" | "search" | "code" | "drawing";

export interface ContainerPosition {
  x: number;
  y: number;
}

export interface ContainerSize {
  width: number;
  height: number;
}

// ── Chat ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  isStreaming?: boolean;
}

export interface ContextSource {
  id: string;
  sourceType: "note" | "search-result" | "code" | "selection" | "file";
  label: string;
  content: string;
  icon: string;
}

export interface ChatContainerState {
  messages: ChatMessage[];
  isGenerating: boolean;
  contextSources: ContextSource[];
  model: string;
}

// ── Note ────────────────────────────────────────────────────

export interface NoteContainerState {
  content: string;
  lastSaved: number | null;
}

// ── Search ──────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  favicon?: string;
}

export interface SearchContainerState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
}

// ── Code ────────────────────────────────────────────────────

export interface CodeContainerState {
  code: string;
  language: string;
  filename: string;
}

// ── Drawing ─────────────────────────────────────────────────

export type DrawingTool = "pen" | "rect" | "circle" | "line" | "arrow" | "text" | "eraser";

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  tool: DrawingTool;
  points: DrawingPoint[];
  color: string;
  strokeWidth: number;
  text?: string;
}

export interface DrawingContainerState {
  strokes: DrawingStroke[];
  undoStack: DrawingStroke[][];
}

// ── Discriminated Union ──────────────────────────────────────

interface BaseContainer {
  id: string;
  workspaceId: string;
  title: string;
  position: ContainerPosition;
  size: ContainerSize;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ChatContainer extends BaseContainer {
  type: "chat";
  state: ChatContainerState;
}

export interface NoteContainer extends BaseContainer {
  type: "note";
  state: NoteContainerState;
}

export interface SearchContainer extends BaseContainer {
  type: "search";
  state: SearchContainerState;
}

export interface CodeContainer extends BaseContainer {
  type: "code";
  state: CodeContainerState;
}

export interface DrawingContainer extends BaseContainer {
  type: "drawing";
  state: DrawingContainerState;
}

export type OrbContainer =
  | ChatContainer
  | NoteContainer
  | SearchContainer
  | CodeContainer
  | DrawingContainer;

// ── Default State Factories ──────────────────────────────────

export function defaultChatState(): ChatContainerState {
  return {
    messages: [],
    isGenerating: false,
    contextSources: [],
    model: "mock-gpt-4",
  };
}

export function defaultNoteState(): NoteContainerState {
  return {
    content: "",
    lastSaved: null,
  };
}

export function defaultSearchState(): SearchContainerState {
  return {
    query: "",
    results: [],
    isSearching: false,
  };
}

export function defaultCodeState(): CodeContainerState {
  return {
    code: "// Start coding here\n",
    language: "typescript",
    filename: "untitled.ts",
  };
}

export function defaultDrawingState(): DrawingContainerState {
  return {
    strokes: [],
    undoStack: [],
  };
}
