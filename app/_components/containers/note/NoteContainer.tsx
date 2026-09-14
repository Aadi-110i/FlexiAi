"use client";

import React, { useCallback, useRef, useEffect, memo } from "react";
import { Save } from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { NoteContainer as NoteContainerType } from "@/app/_lib/types/container";

interface NoteContainerProps {
  container: NoteContainerType;
}

export const NoteContainer = memo(function NoteContainer({ container }: NoteContainerProps) {
  const { state } = container;
  const { setNoteContent, updateContainer } = useCanvasStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value;
      setNoteContent(container.id, content);

      // Debounced autosave
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 800);
    },
    [container.id, setNoteContent]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Save indicator */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <span
          className="text-[11px]"
          style={{
            color:
              saveStatus === "saved"
                ? "var(--success)"
                : saveStatus === "saving"
                ? "var(--accent-text)"
                : "var(--text-muted)",
          }}
        >
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "✓ Saved"}
          {saveStatus === "idle" && (state.content ? "Auto-saved" : "Type to take notes")}
        </span>
        <button className="control-btn" title="Save">
          <Save size={11} />
        </button>
      </div>

      {/* Editor */}
      <textarea
        className="note-editor"
        value={state.content}
        onChange={handleChange}
        placeholder={`# Untitled Note\n\nStart writing...\n\nMarkdown is supported:\n- **bold**\n- *italic*\n- \`code\``}
        spellCheck={true}
      />
    </div>
  );
});
