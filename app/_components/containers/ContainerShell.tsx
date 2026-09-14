"use client";

import React, {
  useRef,
  useCallback,
  memo,
  useState,
} from "react";
import {
  Minus,
  Maximize2,
  X,
  Copy,
  MoreHorizontal,
  Minimize2,
} from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { OrbContainer } from "@/app/_lib/types/container";
import { ContainerRenderer } from "./ContainerRenderer";
import { getContainerIcon } from "@/app/_lib/utils/container-icons";

interface ContainerShellProps {
  container: OrbContainer;
}

type ResizeDir = "se" | "e" | "s" | "n" | "w" | "ne" | "nw" | "sw";

export const ContainerShell = memo(function ContainerShell({
  container,
}: ContainerShellProps) {
  const {
    activeId,
    focusContainer,
    setContainerPosition,
    setContainerSize,
    minimizeContainer,
    maximizeContainer,
    restoreContainer,
    removeContainer,
    duplicateContainer,
    openContextMenu,
  } = useCanvasStore();

  const { zoom } = useCanvasStore();

  const shellRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0, dir: "" as ResizeDir });
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(container.title);
  const { updateContainer } = useCanvasStore();

  const isFocused = activeId === container.id;

  // ── Drag ─────────────────────────────────────────────────

  const handleHeaderPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (
        (e.target as HTMLElement).closest(".control-btn") ||
        (e.target as HTMLElement).closest(".container-title-input")
      )
        return;
      e.stopPropagation();
      focusContainer(container.id);
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        px: container.position.x,
        py: container.position.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [container.id, container.position.x, container.position.y, focusContainer]
  );

  const handleHeaderPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = (e.clientX - dragStartRef.current.x) / zoom;
      const dy = (e.clientY - dragStartRef.current.y) / zoom;
      setContainerPosition(container.id, {
        x: dragStartRef.current.px + dx,
        y: dragStartRef.current.py + dy,
      });
    },
    [container.id, zoom, setContainerPosition]
  );

  const handleHeaderPointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // ── Resize ───────────────────────────────────────────────

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent, dir: ResizeDir) => {
      e.stopPropagation();
      e.preventDefault();
      focusContainer(container.id);
      isResizingRef.current = true;
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        w: container.size.width,
        h: container.size.height,
        dir,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [container.id, container.size.width, container.size.height, focusContainer]
  );

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizingRef.current) return;
      const dx = (e.clientX - resizeStartRef.current.x) / zoom;
      const dy = (e.clientY - resizeStartRef.current.y) / zoom;
      const { dir, w, h } = resizeStartRef.current;

      const newW = dir.includes("e") || dir === "se"
        ? Math.max(280, w + dx)
        : w;
      const newH = dir.includes("s") || dir === "se"
        ? Math.max(200, h + dy)
        : h;

      setContainerSize(container.id, { width: newW, height: newH });
    },
    [container.id, zoom, setContainerSize]
  );

  const handleResizePointerUp = useCallback(() => {
    isResizingRef.current = false;
  }, []);

  // ── Focus on click ────────────────────────────────────────

  const handleShellPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!isFocused) {
        focusContainer(container.id);
      }
    },
    [container.id, isFocused, focusContainer]
  );

  // ── Context menu ─────────────────────────────────────────

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openContextMenu(e.clientX, e.clientY, container.id);
    },
    [container.id, openContextMenu]
  );

  // ── Title editing ─────────────────────────────────────────

  const handleTitleDoubleClick = useCallback(() => {
    setIsTitleEditing(true);
    setEditTitle(container.title);
  }, [container.title]);

  const handleTitleSubmit = useCallback(() => {
    setIsTitleEditing(false);
    if (editTitle.trim()) {
      updateContainer(container.id, { title: editTitle.trim() } as Partial<OrbContainer>);
    }
  }, [container.id, editTitle, updateContainer]);

  const Icon = getContainerIcon(container.type);

  // ── Maximized ─────────────────────────────────────────────

  if (container.maximized) {
    return (
      <div
        className="container-shell maximized focused animate-fade-in"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: container.zIndex,
          borderRadius: 0,
          transform: `scale(${1 / zoom})`,
          transformOrigin: "top left",
        }}
        onPointerDown={handleShellPointerDown}
        onContextMenu={handleContextMenu}
      >
        <ContainerHeader
          container={container}
          isFocused
          isTitleEditing={isTitleEditing}
          editTitle={editTitle}
          onEditTitleChange={setEditTitle}
          onTitleDoubleClick={handleTitleDoubleClick}
          onTitleSubmit={handleTitleSubmit}
          onMinimize={() => minimizeContainer(container.id)}
          onMaximize={() => restoreContainer(container.id)}
          onClose={() => removeContainer(container.id)}
          onDuplicate={() => duplicateContainer(container.id)}
          isMaximized
        />
        <div className="container-body">
          <ContainerRenderer container={container} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={`container-shell animate-fade-in ${isFocused ? "focused" : ""}`}
      style={{
        left: container.position.x,
        top: container.position.y,
        width: container.size.width,
        height: container.size.height,
        zIndex: container.zIndex,
      }}
      onPointerDown={handleShellPointerDown}
      onContextMenu={handleContextMenu}
    >
      <ContainerHeader
        container={container}
        isFocused={isFocused}
        isTitleEditing={isTitleEditing}
        editTitle={editTitle}
        onEditTitleChange={setEditTitle}
        onTitleDoubleClick={handleTitleDoubleClick}
        onTitleSubmit={handleTitleSubmit}
        onHeaderPointerDown={handleHeaderPointerDown}
        onHeaderPointerMove={handleHeaderPointerMove}
        onHeaderPointerUp={handleHeaderPointerUp}
        onMinimize={() => minimizeContainer(container.id)}
        onMaximize={() => maximizeContainer(container.id)}
        onClose={() => removeContainer(container.id)}
        onDuplicate={() => duplicateContainer(container.id)}
        isMaximized={false}
      />

      <div className="container-body">
        <ContainerRenderer container={container} />
      </div>

      {/* Resize handles */}
      <div
        className="resize-handle resize-handle-se"
        onPointerDown={(e) => handleResizePointerDown(e, "se")}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M13 7L7 13M13 13L13 13" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
      <div
        className="resize-handle resize-handle-e"
        onPointerDown={(e) => handleResizePointerDown(e, "e")}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      />
      <div
        className="resize-handle resize-handle-s"
        onPointerDown={(e) => handleResizePointerDown(e, "s")}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      />
    </div>
  );
});

// ── Container Header Sub-component ────────────────────────────

interface ContainerHeaderProps {
  container: OrbContainer;
  isFocused: boolean;
  isTitleEditing: boolean;
  editTitle: string;
  onEditTitleChange: (v: string) => void;
  onTitleDoubleClick: () => void;
  onTitleSubmit: () => void;
  onHeaderPointerDown?: (e: React.PointerEvent) => void;
  onHeaderPointerMove?: (e: React.PointerEvent) => void;
  onHeaderPointerUp?: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onDuplicate: () => void;
  isMaximized: boolean;
}

function ContainerHeader({
  container,
  isTitleEditing,
  editTitle,
  onEditTitleChange,
  onTitleDoubleClick,
  onTitleSubmit,
  onHeaderPointerDown,
  onHeaderPointerMove,
  onHeaderPointerUp,
  onMinimize,
  onMaximize,
  onClose,
  onDuplicate,
  isMaximized,
}: ContainerHeaderProps) {
  const Icon = getContainerIcon(container.type);

  return (
    <div
      className="container-header"
      onPointerDown={onHeaderPointerDown}
      onPointerMove={onHeaderPointerMove}
      onPointerUp={onHeaderPointerUp}
    >
      {/* Drag grip */}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="shrink-0 opacity-30">
        {[0, 6].map((x) =>
          [0, 4, 8].map((y) => (
            <circle key={`${x}-${y}`} cx={x + 1} cy={y + 3} r="1.2" fill="var(--text-secondary)" />
          ))
        )}
      </svg>

      <Icon
        size={13}
        style={{ color: "var(--accent-text)", flexShrink: 0 }}
      />

      {isTitleEditing ? (
        <input
          className="container-title-input flex-1 bg-transparent border-none outline-none text-[12.5px] font-semibold"
          style={{ color: "var(--text-primary)", minWidth: 0 }}
          value={editTitle}
          autoFocus
          onChange={(e) => onEditTitleChange(e.target.value)}
          onBlur={onTitleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onTitleSubmit();
            if (e.key === "Escape") onTitleSubmit();
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="container-title select-none"
          onDoubleClick={onTitleDoubleClick}
        >
          {container.title}
        </span>
      )}

      <div className="container-controls">
        <button
          className="control-btn"
          title="Duplicate"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        >
          <Copy size={11} />
        </button>
        <button
          className="control-btn"
          title={isMaximized ? "Restore" : "Minimize"}
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        >
          <Minus size={11} />
        </button>
        <button
          className="control-btn"
          title={isMaximized ? "Restore" : "Maximize"}
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        >
          {isMaximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
        </button>
        <button
          className="control-btn danger"
          title="Close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
}
