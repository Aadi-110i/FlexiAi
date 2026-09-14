"use client";

import React, { useCallback, memo, useState } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, Wand2 } from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { CodeContainer as CodeContainerType } from "@/app/_lib/types/container";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div
        className="text-sm animate-pulse-subtle"
        style={{ color: "var(--text-muted)" }}
      >
        Loading editor...
      </div>
    </div>
  ),
});

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "cpp",
  "css",
  "html",
  "json",
  "yaml",
  "markdown",
  "sql",
  "bash",
];

interface CodeContainerProps {
  container: CodeContainerType;
}

export const CodeContainer = memo(function CodeContainer({ container }: CodeContainerProps) {
  const { state } = container;
  const { setCodeContent, setCodeLanguage, setCodeFilename, addContextSource } =
    useCanvasStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(state.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [state.code]);

  const handleAddToContext = useCallback(() => {
    const store = useCanvasStore.getState();
    const chatContainers = store.containers.filter((c) => c.type === "chat");
    const targetChat =
      chatContainers.find((c) => c.id === store.activeId) ?? chatContainers[0];
    if (!targetChat) {
      const id = store.addContainer("chat");
      setTimeout(() => {
        store.addContextSource(id, {
          id: `code-${container.id}`,
          sourceType: "code",
          label: state.filename,
          content: state.code,
          icon: "💻",
        });
      }, 50);
    } else {
      store.addContextSource(targetChat.id, {
        id: `code-${container.id}`,
        sourceType: "code",
        label: state.filename,
        content: state.code,
        icon: "💻",
      });
    }
  }, [container.id, state.code, state.filename]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{ borderColor: "var(--surface-border)" }}
      >
        {/* Filename */}
        <input
          className="text-[12px] font-mono bg-transparent border-none outline-none flex-1"
          style={{
            color: "var(--accent-text)",
            fontFamily: "var(--font-mono)",
          }}
          value={state.filename}
          onChange={(e) =>
            setCodeFilename(container.id, e.target.value)
          }
          onClick={(e) => e.stopPropagation()}
        />

        {/* Language selector */}
        <select
          className="text-[11px] rounded px-2 py-0.5 border-none outline-none cursor-pointer"
          style={{
            background: "var(--surface-raised)",
            color: "var(--text-secondary)",
            borderColor: "var(--surface-border)",
          }}
          value={state.language}
          onChange={(e) => setCodeLanguage(container.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Actions */}
        <button
          className="control-btn"
          title="Add code to AI context"
          onClick={handleAddToContext}
        >
          <Wand2 size={12} />
        </button>
        <button
          className="control-btn"
          title="Copy code"
          onClick={handleCopy}
        >
          {copied ? (
            <Check size={12} style={{ color: "var(--success)" }} />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={state.language}
          value={state.code}
          onChange={(value) => setCodeContent(container.id, value ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "var(--font-geist-mono), Menlo, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            renderLineHighlight: "gutter",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  );
});
