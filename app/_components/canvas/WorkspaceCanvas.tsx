"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import { CanvasBackground } from "./CanvasBackground";
import { ContainerShell } from "@/app/_components/containers/ContainerShell";
import { FloatingToolbar } from "@/app/_components/toolbar/FloatingToolbar";
import { CommandPalette } from "@/app/_components/command-palette/CommandPalette";
import { ContextMenu } from "@/app/_components/common/ContextMenu";
import { WelcomeState } from "@/app/_components/common/WelcomeState";
import { MinimizedTray } from "@/app/_components/common/MinimizedTray";
import { useDemoWorkspace } from "@/app/_lib/hooks/useDemoWorkspace";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_SENSITIVITY = 0.001;

export function WorkspaceCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  useDemoWorkspace();

  const {
    panX,
    panY,
    zoom,
    tool,
    containers,
    isCommandPaletteOpen,
    contextMenuState,
    setPan,
    setZoom,
    clearSelection,
    openCommandPalette,
    closeCommandPalette,
    closeContextMenu,
    fitCanvas,
  } = useCanvasStore();

  // ── Wheel zoom / pan ─────────────────────────────────────

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = -e.deltaY * ZOOM_SENSITIVITY * zoom;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta * zoom));
        const ratio = newZoom / zoom;

        const newPanX = mouseX - ratio * (mouseX - panX);
        const newPanY = mouseY - ratio * (mouseY - panY);

        setZoom(newZoom);
        setPan(newPanX, newPanY);
      } else {
        // Pan
        setPan(panX - e.deltaX, panY - e.deltaY);
      }
    },
    [zoom, panX, panY, setZoom, setPan]
  );

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Pointer pan (hand tool / middle mouse) ───────────────

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const isMiddleMouse = e.button === 1;
      const isHandTool = tool === "hand";

      if (isMiddleMouse || isHandTool) {
        isPanningRef.current = true;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    },
    [tool]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setPan(panX + dx, panY + dy);
    },
    [panX, panY, setPan]
  );

  const handlePointerUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  // ── Click on canvas (clear selection) ────────────────────

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  // ── Keyboard shortcuts ────────────────────────────────────

  const { setTool, addContainer } = useCanvasStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      const isTyping =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active as HTMLElement)?.isContentEditable;

      if (isTyping && !e.metaKey && !e.ctrlKey) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isCommandPaletteOpen ? closeCommandPalette() : openCommandPalette();
        return;
      }

      if (isCommandPaletteOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === "c") {
        e.preventDefault();
        addContainer("chat");
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === "n") {
        e.preventDefault();
        addContainer("note");
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === "s") {
        e.preventDefault();
        addContainer("search");
        return;
      }

      if (isTyping) return;

      switch (e.key) {
        case "v":
        case "V":
          setTool("select");
          break;
        case "h":
        case "H":
          setTool("hand");
          break;
        case "f":
        case "F":
          fitCanvas();
          break;
        case "Escape":
          closeContextMenu();
          closeCommandPalette();
          clearSelection();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    closeContextMenu,
    clearSelection,
    setTool,
    addContainer,
    fitCanvas,
  ]);

  // ── Sorted containers (by zIndex) ─────────────────────────

  const sortedContainers = useMemo(
    () => [...containers].sort((a, b) => a.zIndex - b.zIndex),
    [containers]
  );

  const minimizedContainers = useMemo(
    () => containers.filter((c) => c.minimized),
    [containers]
  );

  const visibleContainers = useMemo(
    () => sortedContainers.filter((c) => !c.minimized),
    [sortedContainers]
  );

  const hasContainers = containers.length > 0;

  const cursorClass =
    tool === "hand"
      ? isPanningRef.current
        ? "cursor-grabbing"
        : "canvas-hand"
      : "canvas-select";

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "var(--canvas-bg)" }}>
      {/* Canvas surface */}
      <div
        ref={canvasRef}
        className={`absolute inset-0 ${cursorClass}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleCanvasClick}
        onContextMenu={(e) => {
          if (e.target === canvasRef.current) {
            e.preventDefault();
          }
        }}
      >
        {/* Dot background */}
        <CanvasBackground panX={panX} panY={panY} zoom={zoom} />

        {/* Container world (transformed) */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {visibleContainers.map((container) => (
            <ContainerShell key={container.id} container={container} />
          ))}
        </div>
      </div>

      {/* Welcome state */}
      {!hasContainers && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto">
            <WelcomeState />
          </div>
        </div>
      )}

      {/* Floating toolbar */}
      <FloatingToolbar />

      {/* Minimized tray */}
      {minimizedContainers.length > 0 && (
        <MinimizedTray containers={minimizedContainers} />
      )}

      {/* Command palette */}
      {isCommandPaletteOpen && <CommandPalette />}

      {/* Context menu */}
      {contextMenuState.open && (
        <ContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          containerId={contextMenuState.containerId}
          onClose={closeContextMenu}
        />
      )}

      {/* Zoom indicator */}
      <div
        className="absolute bottom-4 right-4 text-xs px-2 py-1 rounded"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--surface-border)",
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
          zIndex: 100,
        }}
      >
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
