"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  memo,
} from "react";
import {
  Pencil,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type {
  DrawingContainer as DrawingContainerType,
  DrawingTool,
  DrawingStroke,
  DrawingPoint,
} from "@/app/_lib/types/container";

interface DrawingContainerProps {
  container: DrawingContainerType;
}

const COLORS = [
  "#4ECDC4",
  "#EEF2F5",
  "#E8A838",
  "#E05252",
  "#4CAF78",
  "#7B9FC7",
  "#C9A9DD",
  "#F5A65B",
];

const TOOLS: { id: DrawingTool; icon: React.ComponentType<{ size: number }>; title: string }[] = [
  { id: "pen", icon: Pencil, title: "Pen" },
  { id: "rect", icon: Square, title: "Rectangle" },
  { id: "circle", icon: Circle, title: "Circle" },
  { id: "line", icon: Minus, title: "Line" },
  { id: "arrow", icon: ArrowRight, title: "Arrow" },
  { id: "text", icon: Type, title: "Text" },
  { id: "eraser", icon: Eraser, title: "Eraser" },
];

export const DrawingContainer = memo(function DrawingContainer({
  container,
}: DrawingContainerProps) {
  const { state } = container;
  const { updateContainer } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<DrawingTool>("pen");
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<DrawingPoint[]>([]);
  const startPointRef = useRef<DrawingPoint>({ x: 0, y: 0 });

  // Render strokes to canvas
  const renderStrokes = useCallback(
    (ctx: CanvasRenderingContext2D, strokes: DrawingStroke[], tempStroke?: { points: DrawingPoint[]; color: string; width: number; tool: DrawingTool }) => {
      const canvas = ctx.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const stroke of strokes) {
        drawStroke(ctx, stroke);
      }

      if (tempStroke && tempStroke.points.length > 0) {
        ctx.strokeStyle = tempStroke.color;
        ctx.lineWidth = tempStroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tempStroke.tool === "pen" || tempStroke.tool === "eraser") {
          ctx.globalCompositeOperation =
            tempStroke.tool === "eraser" ? "destination-out" : "source-over";
          ctx.beginPath();
          ctx.moveTo(tempStroke.points[0].x, tempStroke.points[0].y);
          for (const p of tempStroke.points.slice(1)) {
            ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
        }
      }
    },
    []
  );

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke) {
    if (stroke.points.length === 0) return;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation =
      stroke.tool === "eraser" ? "destination-out" : "source-over";

    const [first, ...rest] = stroke.points;

    switch (stroke.tool) {
      case "pen":
      case "eraser":
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (const p of rest) ctx.lineTo(p.x, p.y);
        ctx.stroke();
        break;
      case "line":
        if (rest.length > 0) {
          const last = rest[rest.length - 1];
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
        }
        break;
      case "rect":
        if (rest.length > 0) {
          const last = rest[rest.length - 1];
          ctx.strokeRect(
            first.x,
            first.y,
            last.x - first.x,
            last.y - first.y
          );
        }
        break;
      case "circle":
        if (rest.length > 0) {
          const last = rest[rest.length - 1];
          const rx = Math.abs(last.x - first.x) / 2;
          const ry = Math.abs(last.y - first.y) / 2;
          const cx = first.x + (last.x - first.x) / 2;
          const cy = first.y + (last.y - first.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      case "arrow":
        if (rest.length > 0) {
          const last = rest[rest.length - 1];
          const angle = Math.atan2(last.y - first.y, last.x - first.x);
          const arrowLen = 12;
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(last.x, last.y);
          ctx.lineTo(
            last.x - arrowLen * Math.cos(angle - Math.PI / 6),
            last.y - arrowLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(
            last.x - arrowLen * Math.cos(angle + Math.PI / 6),
            last.y - arrowLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // Resize canvas with container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const observer = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      renderStrokes(ctx, state.strokes);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [state.strokes, renderStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderStrokes(ctx, state.strokes);
  }, [state.strokes, renderStrokes]);

  // ── Pointer events ─────────────────────────────────────────

  const getCanvasPoint = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): DrawingPoint => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      e.stopPropagation();
      isDrawingRef.current = true;
      const pt = getCanvasPoint(e);
      startPointRef.current = pt;
      currentStrokeRef.current = [pt];
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    },
    [getCanvasPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const pt = getCanvasPoint(e);
      currentStrokeRef.current.push(pt);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      renderStrokes(ctx, state.strokes, {
        points: currentStrokeRef.current,
        color: activeTool === "eraser" ? "#000" : activeColor,
        width: strokeWidth,
        tool: activeTool,
      });
    },
    [getCanvasPoint, state.strokes, activeColor, activeTool, strokeWidth, renderStrokes]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const newStroke: DrawingStroke = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tool: activeTool,
      points: currentStrokeRef.current,
      color: activeColor,
      strokeWidth,
    };

    const newStrokes = [...state.strokes, newStroke];
    updateContainer(container.id, {
      state: { ...state, strokes: newStrokes },
    } as Partial<DrawingContainerType>);
    currentStrokeRef.current = [];
  }, [activeTool, activeColor, strokeWidth, state, container.id, updateContainer]);

  const handleUndo = useCallback(() => {
    if (state.strokes.length === 0) return;
    const newStrokes = state.strokes.slice(0, -1);
    updateContainer(container.id, {
      state: { ...state, strokes: newStrokes },
    } as Partial<DrawingContainerType>);
  }, [state, container.id, updateContainer]);

  const handleClear = useCallback(() => {
    updateContainer(container.id, {
      state: { ...state, strokes: [] },
    } as Partial<DrawingContainerType>);
  }, [state, container.id, updateContainer]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Drawing toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0 overflow-x-auto"
        style={{ borderColor: "var(--surface-border)" }}
      >
        {/* Tools */}
        {TOOLS.map(({ id, icon: Icon, title }) => (
          <button
            key={id}
            className={`drawing-tool-btn ${activeTool === id ? "active" : ""}`}
            title={title}
            onClick={() => setActiveTool(id)}
          >
            <Icon size={13} />
          </button>
        ))}

        <div className="toolbar-divider mx-1" />

        {/* Colors */}
        {COLORS.map((color) => (
          <button
            key={color}
            className="w-5 h-5 rounded-full shrink-0 transition-transform hover:scale-110"
            style={{
              background: color,
              outline: activeColor === color ? `2px solid var(--accent)` : "none",
              outlineOffset: "1px",
            }}
            onClick={() => setActiveColor(color)}
          />
        ))}

        <div className="toolbar-divider mx-1" />

        {/* Stroke width */}
        <select
          className="text-[11px] rounded px-1.5 py-0.5 border-none outline-none"
          style={{ background: "var(--surface-raised)", color: "var(--text-secondary)" }}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
        >
          {[1, 2, 3, 5, 8].map((w) => (
            <option key={w} value={w}>
              {w}px
            </option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          className="drawing-tool-btn"
          title="Undo"
          onClick={handleUndo}
        >
          <Undo2 size={13} />
        </button>
        <button
          className="drawing-tool-btn"
          title="Clear canvas"
          onClick={handleClear}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            cursor:
              activeTool === "pen" || activeTool === "eraser"
                ? "crosshair"
                : "crosshair",
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {state.strokes.length === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Draw anything
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
