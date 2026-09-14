"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/app/_lib/store/canvas-store";

/**
 * Seeds a demo workspace with pre-arranged containers the first time the user visits.
 * Only runs if the canvas is completely empty.
 */
export function useDemoWorkspace() {
  const { containers, addContainer, updateContainer, setNoteContent, setCodeContent, setSearchQuery, setSearchResults } = useCanvasStore();

  useEffect(() => {
    // Only seed if truly empty (first ever visit)
    if (containers.length > 0) return;

    // Brief delay so store is hydrated first
    const timer = setTimeout(() => {
      const state = useCanvasStore.getState();
      if (state.containers.length > 0) return;

      // 1. Chat container
      const chatId = state.addContainer("chat", { x: 60, y: 100 });
      state.updateContainer(chatId, { title: "Build E-Commerce App" } as Parameters<typeof state.updateContainer>[1]);

      // 2. Search container
      const searchId = state.addContainer("search", { x: 560, y: 80 });
      state.updateContainer(searchId, { title: "PostgreSQL Schema Research" } as Parameters<typeof state.updateContainer>[1]);
      state.setSearchQuery(searchId, "PostgreSQL ecommerce schema best practices");
      state.setSearchResults(searchId, [
        {
          id: "s1",
          title: "PostgreSQL E-Commerce Schema Design",
          url: "postgresql.org/docs",
          description: "Best practices for designing a scalable e-commerce database schema including products, orders, and inventory management.",
        },
        {
          id: "s2",
          title: "Database Design for Online Stores",
          url: "dbdesign.io/ecommerce",
          description: "Comprehensive guide to e-commerce database design with normalization, indexing strategies, and performance optimization.",
        },
      ]);

      // 3. Note container
      const noteId = state.addContainer("note", { x: 60, y: 560 });
      state.updateContainer(noteId, { title: "Auth Requirements" } as Parameters<typeof state.updateContainer>[1]);
      state.setNoteContent(noteId, `# Authentication Requirements

## User Roles
- **Admin** — full access, user management
- **Customer** — shopping, orders, profile
- **Guest** — browse only

## Features
- [ ] Email/password registration
- [ ] OAuth (Google, GitHub)
- [ ] JWT access tokens (15min)
- [ ] Refresh tokens (7 days)
- [ ] Password reset via email
- [ ] Session management

## Security
- Bcrypt password hashing
- Rate limiting on auth endpoints
- CORS policy enforcement
- HTTP-only cookie for refresh token`);

      // 4. Code container
      const codeId = state.addContainer("code", { x: 560, y: 460 });
      state.updateContainer(codeId, { title: "auth.ts", size: { width: 520, height: 420 } } as Parameters<typeof state.updateContainer>[1]);
      state.setCodeContent(codeId, `import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return compare(password, hashed);
}

export function createAccessToken(userId: string): string {
  return sign({ sub: userId, type: "access" }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function createRefreshToken(userId: string): string {
  return sign({ sub: userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): { sub: string } {
  return verify(token, process.env.JWT_SECRET!) as { sub: string };
}`);
      state.setCodeLanguage(codeId, "typescript");
      state.setCodeFilename(codeId, "auth.ts");

      // 5. Drawing container
      const drawId = state.addContainer("drawing", { x: 1110, y: 80 });
      state.updateContainer(drawId, { title: "System Architecture" } as Parameters<typeof state.updateContainer>[1]);

    }, 200);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
