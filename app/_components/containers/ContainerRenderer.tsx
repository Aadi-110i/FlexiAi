"use client";

import dynamic from "next/dynamic";
import type { OrbContainer } from "@/app/_lib/types/container";

// Lightweight containers — can load immediately
const NoteContainer = dynamic(
  () => import("./note/NoteContainer").then((m) => ({ default: m.NoteContainer })),
  { ssr: false }
);

const SearchContainer = dynamic(
  () => import("./search/SearchContainer").then((m) => ({ default: m.SearchContainer })),
  { ssr: false }
);

// Heavy containers — lazy-load
const ChatContainer = dynamic(
  () => import("./chat/ChatContainer").then((m) => ({ default: m.ChatContainer })),
  { ssr: false }
);

const CodeContainer = dynamic(
  () => import("./code/CodeContainer").then((m) => ({ default: m.CodeContainer })),
  { ssr: false }
);

const DrawingContainer = dynamic(
  () => import("./drawing/DrawingContainer").then((m) => ({ default: m.DrawingContainer })),
  { ssr: false }
);

interface ContainerRendererProps {
  container: OrbContainer;
}

export function ContainerRenderer({ container }: ContainerRendererProps) {
  switch (container.type) {
    case "chat":
      return <ChatContainer container={container} />;
    case "note":
      return <NoteContainer container={container} />;
    case "search":
      return <SearchContainer container={container} />;
    case "code":
      return <CodeContainer container={container} />;
    case "drawing":
      return <DrawingContainer container={container} />;
    default:
      return null;
  }
}
