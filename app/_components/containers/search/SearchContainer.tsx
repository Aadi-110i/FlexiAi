"use client";

import React, { useCallback, useState, memo } from "react";
import { Search, ExternalLink, Plus, Loader2 } from "lucide-react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";
import type { SearchContainer as SearchContainerType, SearchResult } from "@/app/_lib/types/container";

interface SearchContainerProps {
  container: SearchContainerType;
}

// ── Mock search results ───────────────────────────────────────

const MOCK_RESULTS: Record<string, SearchResult[]> = {
  default: [
    {
      id: "1",
      title: "MDN Web Docs — Comprehensive web reference",
      url: "developer.mozilla.org",
      description:
        "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    },
    {
      id: "2",
      title: "Stack Overflow — Developer community Q&A",
      url: "stackoverflow.com",
      description:
        "Stack Overflow is the largest, most trusted online community for developers to learn, share their knowledge, and build their careers.",
    },
    {
      id: "3",
      title: "GitHub — Where the world builds software",
      url: "github.com",
      description:
        "GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community.",
    },
  ],
  jwt: [
    {
      id: "jwt-1",
      title: "JWT.io — JSON Web Tokens Introduction",
      url: "jwt.io",
      description:
        "JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.",
    },
    {
      id: "jwt-2",
      title: "OWASP — JWT Security Cheat Sheet",
      url: "owasp.org/jwt",
      description:
        "JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information.",
    },
    {
      id: "jwt-3",
      title: "Auth0 Blog — Understanding JSON Web Tokens",
      url: "auth0.com/blog/jwt",
      description:
        "Learn everything you need to know about JWT authentication. Understand the structure, how they work, and best practices for securing your apps.",
    },
  ],
  react: [
    {
      id: "r-1",
      title: "React — The library for web and native UIs",
      url: "react.dev",
      description:
        "React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.",
    },
    {
      id: "r-2",
      title: "React Hooks — useState, useEffect & more",
      url: "react.dev/hooks",
      description:
        "Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own.",
    },
    {
      id: "r-3",
      title: "React Query — Async State Management",
      url: "tanstack.com/query",
      description:
        "Powerful asynchronous state management for TS/JS, React, Solid, Vue, Svelte and Angular. Fetch, cache and update data without touching global state.",
    },
  ],
};

function getMockResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  if (q.includes("jwt") || q.includes("auth")) return MOCK_RESULTS.jwt;
  if (q.includes("react")) return MOCK_RESULTS.react;
  return MOCK_RESULTS.default.map((r) => ({
    ...r,
    description: `Results for "${query}": ${r.description}`,
  }));
}

export const SearchContainer = memo(function SearchContainer({ container }: SearchContainerProps) {
  const { state } = container;
  const { setSearchQuery, setSearchResults, setSearching, addContextSource, addContainer } =
    useCanvasStore();

  const [localQuery, setLocalQuery] = useState(state.query);

  const handleSearch = useCallback(async () => {
    const q = localQuery.trim();
    if (!q) return;
    setSearchQuery(container.id, q);
    setSearching(container.id, true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const results = getMockResults(q);
    setSearchResults(container.id, results);
  }, [localQuery, container.id, setSearchQuery, setSearching, setSearchResults]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  const handleAddContext = useCallback(
    (result: SearchResult) => {
      // Find the most recently active chat container and add context
      const store = useCanvasStore.getState();
      const chatContainers = store.containers.filter((c) => c.type === "chat");
      if (chatContainers.length === 0) {
        // Create a new chat and add context
        const id = store.addContainer("chat");
        setTimeout(() => {
          store.addContextSource(id, {
            id: result.id,
            sourceType: "search-result",
            label: result.title.slice(0, 30),
            content: result.description,
            icon: "🔎",
          });
        }, 50);
      } else {
        // Add to active chat
        const activeChat =
          chatContainers.find((c) => c.id === store.activeId) ?? chatContainers[0];
        store.addContextSource(activeChat.id, {
          id: result.id,
          sourceType: "search-result",
          label: result.title.slice(0, 30),
          content: result.description,
          icon: "🔎",
        });
      }
    },
    []
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Search input */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              className="orbit-input pl-8"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search the web..."
            />
          </div>
          <button
            className="toolbar-btn toolbar-btn-add px-3 rounded-lg flex-shrink-0"
            onClick={handleSearch}
            disabled={state.isSearching}
          >
            {state.isSearching ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              "Go"
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-0">
        {state.isSearching && (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 size={16} className="animate-spin" style={{ color: "var(--accent-text)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Searching...
            </span>
          </div>
        )}

        {!state.isSearching && state.results.length === 0 && !state.query && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Search size={24} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Search anything
            </p>
          </div>
        )}

        {!state.isSearching && state.results.length === 0 && state.query && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No results for &quot;{state.query}&quot;
            </p>
          </div>
        )}

        {state.results.map((result) => (
          <div key={result.id} className="search-result-card">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="text-[13px] font-semibold leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {result.title}
              </h3>
              <a
                href={`https://${result.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="control-btn shrink-0"
                onClick={(e) => e.stopPropagation()}
                title="Open"
              >
                <ExternalLink size={11} />
              </a>
            </div>
            <p
              className="text-[11px] mb-2"
              style={{ color: "var(--accent-text)" }}
            >
              {result.url}
            </p>
            <p
              className="text-[12px] leading-relaxed mb-2.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {result.description}
            </p>
            <button
              className="toolbar-btn text-[11px] py-1 px-2"
              onClick={() => handleAddContext(result)}
              title="Add to AI context"
            >
              <Plus size={11} />
              Add to Context
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
