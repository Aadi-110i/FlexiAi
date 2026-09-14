"use client";

import React, { memo } from "react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import { getContainerIcon } from "@/app/_lib/utils/container-icons";
import type { OrbContainer } from "@/app/_lib/types/container";

interface MinimizedTrayProps {
  containers: OrbContainer[];
}

export const MinimizedTray = memo(function MinimizedTray({
  containers,
}: MinimizedTrayProps) {
  const { restoreContainer } = useCanvasStore();

  return (
    <div className="minimized-tray">
      {containers.map((container) => {
        const Icon = getContainerIcon(container.type);
        return (
          <button
            key={container.id}
            className="minimized-pill"
            onClick={() => restoreContainer(container.id)}
            title={`Restore: ${container.title}`}
          >
            <Icon size={11} style={{ color: "var(--accent-text)" }} />
            <span>{container.title}</span>
          </button>
        );
      })}
    </div>
  );
});
