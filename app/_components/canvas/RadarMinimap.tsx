"use client";

import React, { useMemo, useEffect, useState, useRef, useCallback } from "react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import { ContainerType } from "@/app/_lib/types/container";
import { useShallow } from "zustand/react/shallow";

const TYPE_COLORS: Record<ContainerType, string> = {
  chat: "#b06a30",    // Primary Amber
  note: "#d48d56",    // Lighter Amber
  search: "#8a4510",  // Darker Bronze
  code: "#e29c66",    // Soft Peach/Amber
  drawing: "#c07a40", // Medium Amber
};

export function RadarMinimap() {
  const containers = useCanvasStore(useShallow((s) => s.containers));
  const panX = useCanvasStore((s) => s.panX);
  const panY = useCanvasStore((s) => s.panY);
  const zoom = useCanvasStore((s) => s.zoom);
  const setPan = useCanvasStore((s) => s.setPan);

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const minimapRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  // Target pan values for smooth lerp animation
  const targetPanRef = useRef({ x: panX, y: panY });
  const currentPanRef = useRef({ x: panX, y: panY });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep currentPanRef in sync with external pan changes (e.g., from wheel scroll)
  useEffect(() => {
    currentPanRef.current = { x: panX, y: panY };
    targetPanRef.current = { x: panX, y: panY };
  }, [panX, panY]);

  // Calculate world bounds
  const bounds = useMemo(() => {
    if (containers.length === 0) {
      return { minX: -2000, minY: -2000, maxX: 2000, maxY: 2000, width: 4000, height: 4000 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    containers.forEach((c) => {
      if (c.position.x < minX) minX = c.position.x;
      if (c.position.y < minY) minY = c.position.y;
      if (c.position.x + c.size.width > maxX) maxX = c.position.x + c.size.width;
      if (c.position.y + c.size.height > maxY) maxY = c.position.y + c.size.height;
    });

    const padding = 1500;

    if (maxX - minX < 2000) {
      const cx = (minX + maxX) / 2;
      minX = cx - 1000;
      maxX = cx + 1000;
    }
    if (maxY - minY < 2000) {
      const cy = (minY + maxY) / 2;
      minY = cy - 1000;
      maxY = cy + 1000;
    }

    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
      width: (maxX + padding) - (minX - padding),
      height: (maxY + padding) - (minY - padding),
    };
  }, [containers]);

  // Viewport in world space
  const viewport = useMemo(() => {
    return {
      x: -panX / zoom,
      y: -panY / zoom,
      width: windowSize.width / zoom,
      height: windowSize.height / zoom,
    };
  }, [panX, panY, zoom, windowSize]);

  // Smooth lerp animation loop
  const startSmoothAnimation = useCallback(() => {
    if (animFrameRef.current !== null) return;

    const animate = () => {
      const dx = targetPanRef.current.x - currentPanRef.current.x;
      const dy = targetPanRef.current.y - currentPanRef.current.y;

      // Stop when close enough
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        currentPanRef.current = { ...targetPanRef.current };
        setPan(targetPanRef.current.x, targetPanRef.current.y);
        animFrameRef.current = null;
        return;
      }

      // Lerp factor — higher = snappier, lower = floatier
      const lerpFactor = 0.12;
      currentPanRef.current = {
        x: currentPanRef.current.x + dx * lerpFactor,
        y: currentPanRef.current.y + dy * lerpFactor,
      };

      setPan(currentPanRef.current.x, currentPanRef.current.y);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [setPan]);

  // Set target pan from a minimap position (client coords relative to the minimap rect)
  const panToMinimapPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = minimapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const percentX = (clientX - rect.left) / rect.width;
      const percentY = (clientY - rect.top) / rect.height;

      const worldX = bounds.minX + percentX * bounds.width;
      const worldY = bounds.minY + percentY * bounds.height;

      // Target pan = center this world point in the viewport
      targetPanRef.current = {
        x: -worldX * zoom + windowSize.width / 2,
        y: -worldY * zoom + windowSize.height / 2,
      };

      startSmoothAnimation();
    },
    [bounds, zoom, windowSize, startSmoothAnimation]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsDragging(true);
      panToMinimapPoint(e.clientX, e.clientY);
    },
    [panToMinimapPoint]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      panToMinimapPoint(e.clientX, e.clientY);
    },
    [isDragging, panToMinimapPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global drag tracking (so dragging outside the minimap still works)
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={minimapRef}
      className="fixed bottom-6 right-6 rounded-[32px] overflow-hidden shadow-lg border"
      style={{
        width: "180px",
        height: "135px",
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "crosshair",
        background: "transparent",
        borderColor: isHovered || isDragging
          ? "rgba(176,106,48,0.4)"
          : "rgba(176,106,48,0.15)",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        transition: "border-color 0.2s ease",
        boxShadow: "none",
      }}
      onMouseDown={handleMouseDown}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label */}
      <div
        className="absolute top-2 left-3 text-[8px] font-semibold tracking-[0.15em] uppercase"
        style={{ color: "rgba(0,0,0,0.4)", pointerEvents: "none" }}
      >
        RADAR
      </div>

      {/* Container dots */}
      {containers.map((c) => {
        const cx = c.position.x + c.size.width / 2;
        const cy = c.position.y + c.size.height / 2;

        const px = ((cx - bounds.minX) / bounds.width) * 100;
        const py = ((cy - bounds.minY) / bounds.height) * 100;

        return (
          <div
            key={c.id}
            className="absolute rounded-full w-[10px] h-[10px] shadow-sm border border-black/10"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              transform: "translate(-50%, -50%)",
              background: TYPE_COLORS[c.type],
              transition: "left 0.3s ease, top 0.3s ease",
              pointerEvents: "none",
            }}
            title={c.title}
          />
        );
      })}

    </div>
  );
}
