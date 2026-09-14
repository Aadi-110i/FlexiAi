"use client";

import React, { memo } from "react";

interface CanvasBackgroundProps {
  panX: number;
  panY: number;
  zoom: number;
}

export const CanvasBackground = memo(function CanvasBackground({
  panX,
  panY,
  zoom,
}: CanvasBackgroundProps) {
  const dotSpacing = 28 * zoom;
  const dotSize = Math.max(1, 1.5 * zoom);
  const offsetX = panX % dotSpacing;
  const offsetY = panY % dotSpacing;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <defs>
        <pattern
          id="orbit-dots"
          x={offsetX}
          y={offsetY}
          width={dotSpacing}
          height={dotSpacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={dotSpacing / 2}
            cy={dotSpacing / 2}
            r={dotSize}
            fill="var(--canvas-dot)"
            opacity={0.65}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#orbit-dots)" />
    </svg>
  );
});
