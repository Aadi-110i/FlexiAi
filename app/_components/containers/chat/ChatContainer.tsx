"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  memo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Paperclip, Square, Copy, Check, RotateCcw, X } from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { ChatContainer as ChatContainerType, ChatMessage } from "@/app/_lib/types/container";

interface ChatContainerProps {
  container: ChatContainerType;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const ChatContainer = memo(function ChatContainer({ container }: ChatContainerProps) {
  const { state } = container;
  const { messages, isGenerating, contextSources } = state;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    addMessage,
    updateMessage,
    setGenerating,
    removeContextSource,
  } = useCanvasStore();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const ta = e.target;
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    },
    []
  );

  // ── Send message ─────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || isGenerating) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    addMessage(container.id, userMsg);

    // Add assistant placeholder
    const assistantId = generateId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
    };
    addMessage(container.id, assistantMsg);
    setGenerating(container.id, true);

    // Start streaming
    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token !== undefined) {
                accumulated += data.token;
                updateMessage(container.id, assistantId, {
                  content: accumulated,
                  isStreaming: true,
                });
              } else if (data.content !== undefined) {
                updateMessage(container.id, assistantId, {
                  content: data.content,
                  isStreaming: false,
                });
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        updateMessage(container.id, assistantId, { isStreaming: false });
      } else {
        updateMessage(container.id, assistantId, {
          content: "An error occurred. Please try again.",
          isStreaming: false,
        });
      }
    } finally {
      setGenerating(container.id, false);
      abortRef.current = null;
    }
  }, [
    input,
    isGenerating,
    container.id,
    messages,
    addMessage,
    updateMessage,
    setGenerating,
  ]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Context sources */}
      {contextSources.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 px-3 py-2 border-b"
          style={{ borderColor: "var(--surface-border)" }}
        >
          <span className="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
            Context:
          </span>
          {contextSources.map((src) => (
            <span key={src.id} className="context-chip">
              <span>{src.icon}</span>
              <span>{src.label}</span>
              <button
                onClick={() => removeContextSource(container.id, src.id)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: "var(--accent-subtle)" }}
            >
              ✦
            </div>
            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              Start a conversation. <br />
              <span style={{ color: "var(--text-secondary)" }}>Ask anything.</span>
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-3 py-2.5 border-t"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
          }}
        >
          <button className="control-btn shrink-0 mb-0.5" title="Attach">
            <Paperclip size={14} />
          </button>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[13.5px] placeholder-opacity-50 min-h-[22px] max-h-[120px]"
            style={{
              color: "var(--text-primary)",
              lineHeight: "1.5",
              fontFamily: "inherit",
            }}
            placeholder="Ask AI..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          {isGenerating ? (
            <button
              className="shrink-0 mb-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "var(--danger)" }}
              onClick={stopGeneration}
              title="Stop"
            >
              <Square size={11} fill="white" color="white" />
            </button>
          ) : (
            <button
              className="shrink-0 mb-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: input.trim() ? "var(--accent)" : "var(--surface-border)",
                cursor: input.trim() ? "pointer" : "default",
              }}
              onClick={sendMessage}
              disabled={!input.trim()}
              title="Send"
            >
              <Send size={12} color="white" />
            </button>
          )}
        </div>
        <p
          className="text-[11px] mt-1.5 ml-1"
          style={{ color: "var(--text-muted)" }}
        >
          ⏎ Send · Shift+⏎ New line
        </p>
      </div>
    </div>
  );
});

// ── Message Bubble ────────────────────────────────────────────

const MessageBubble = memo(function MessageBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <div className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}>
      {!isUser && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] mb-0.5"
          style={{ background: "var(--accent)", color: "white", flexShrink: 0 }}
        >
          ✦
        </div>
      )}
      <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
        {isUser ? (
          <p className="text-[13.5px] leading-[1.55]">{message.content}</p>
        ) : (
          <div className={`orbit-markdown ${message.isStreaming ? "streaming-cursor" : ""}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || " "}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {!isUser && !message.isStreaming && message.content && (
        <div className="flex items-center gap-1 ml-1">
          <button
            className="control-btn"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <Check size={11} style={{ color: "var(--success)" }} /> : <Copy size={11} />}
          </button>
        </div>
      )}
    </div>
  );
});
