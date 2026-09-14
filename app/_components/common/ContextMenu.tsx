"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import {
  Copy,
  Minus,
  Maximize2,
  Trash2,
  ChevronUp,
  ChevronDown,
  BringToFront,
  SendToBack,
} from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";

interface ContextMenuProps {
  x: number;
  y: number;
  containerId: string | null;
  onClose: () => void;
}

export const ContextMenu = memo(function ContextMenu({
  x,
  y,
  containerId,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    duplicateContainer,
    minimizeContainer,
    maximizeContainer,
    restoreContainer,
    removeContainer,
    containers,
    updateContainer,
  } = useCanvasStore();

  const container = containerId
    ? containers.find((c) => c.id === containerId)
    : null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [onClose]);

  // Constrain to viewport
  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(x, window.innerWidth - 200),
    top: Math.min(y, window.innerHeight - 280),
    zIndex: 9500,
  };

  const handleAction = useCallback(
    (action: () => void) => {
      action();
      onClose();
    },
    [onClose]
  );

  return (
    <div ref={menuRef} className="context-menu" style={style}>
      {container ? (
        <>
          <button
            className="context-item"
            onClick={() => handleAction(() => duplicateContainer(container.id))}
          >
            <Copy size={13} />
            Duplicate
          </button>
          <div className="context-divider" />
          <button
            className="context-item"
            onClick={() =>
              handleAction(() =>
                container.minimized
                  ? restoreContainer(container.id)
                  : minimizeContainer(container.id)
              )
            }
          >
            <Minus size={13} />
            {container.minimized ? "Restore" : "Minimize"}
          </button>
          <button
            className="context-item"
            onClick={() =>
              handleAction(() =>
                container.maximized
                  ? restoreContainer(container.id)
                  : maximizeContainer(container.id)
              )
            }
          >
            <Maximize2 size={13} />
            {container.maximized ? "Restore" : "Maximize"}
          </button>
          <div className="context-divider" />
          <button
            className="context-item"
            onClick={() =>
              handleAction(() =>
                updateContainer(container.id, {
                  zIndex: container.zIndex + 10,
                } as Partial<typeof container>)
              )
            }
          >
            <BringToFront size={13} />
            Bring Forward
          </button>
          <button
            className="context-item"
            onClick={() =>
              handleAction(() =>
                updateContainer(container.id, {
                  zIndex: Math.max(1, container.zIndex - 10),
                } as Partial<typeof container>)
              )
            }
          >
            <SendToBack size={13} />
            Send Backward
          </button>
          <div className="context-divider" />
          <button
            className="context-item danger"
            onClick={() => handleAction(() => removeContainer(container.id))}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </>
      ) : (
        <>
          <button
            className="context-item"
            onClick={() => {
              useCanvasStore.getState().addContainer("chat");
              onClose();
            }}
          >
            New Chat
          </button>
          <button
            className="context-item"
            onClick={() => {
              useCanvasStore.getState().addContainer("note");
              onClose();
            }}
          >
            New Note
          </button>
          <button
            className="context-item"
            onClick={() => {
              useCanvasStore.getState().fitCanvas();
              onClose();
            }}
          >
            Fit Canvas
          </button>
        </>
      )}
    </div>
  );
});
