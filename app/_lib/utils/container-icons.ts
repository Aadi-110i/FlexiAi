import { MessageSquare, StickyNote, Search, Code2, PenTool, type LucideIcon } from "lucide-react";
import type { ContainerType } from "@/app/_lib/types/container";

const iconMap: Record<ContainerType, LucideIcon> = {
  chat: MessageSquare,
  note: StickyNote,
  search: Search,
  code: Code2,
  drawing: PenTool,
};

export function getContainerIcon(type: ContainerType): LucideIcon {
  return iconMap[type];
}

export const CONTAINER_TYPE_LABELS: Record<ContainerType, string> = {
  chat: "Chat",
  note: "Note",
  search: "Search",
  code: "Code",
  drawing: "Drawing",
};
