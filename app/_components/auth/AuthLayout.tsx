import React from "react";
import { MessageSquare, Search, Code2, StickyNote, PenTool } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-split-layout">
      {/* ── Left Hero ── */}
      <div className="auth-hero">

        {/* Top Navigation Bar */}
        <div className="auth-topbar">
          <div className="auth-topbar-brand">
            <div className="auth-topbar-logo">
              <div className="auth-topbar-logo-dot" />
            </div>
            <span className="auth-topbar-name">FlexiAi</span>
            <span className="auth-topbar-tagline">Think without losing context.</span>
          </div>
          <div className="auth-topbar-right">
            A more connected way to think.
            <div className="auth-topbar-line" />
          </div>
        </div>



        {/* Central hero text */}
        <div className="auth-hero-content">
          <div className="auth-hero-title">Orbit</div>
          <div className="auth-hero-subtitle">Think without losing context.</div>
          <div className="auth-hero-desc">
            AI chat, research, code, notes, and drawing — all connected in one infinite workspace.
          </div>
          <div className="auth-hero-tags">
            <span className="auth-hero-tag">Chat</span>
            <div className="auth-hero-tag-dot" />
            <span className="auth-hero-tag">Research</span>
            <div className="auth-hero-tag-dot" />
            <span className="auth-hero-tag">Code</span>
            <div className="auth-hero-tag-dot" />
            <span className="auth-hero-tag">Notes</span>
            <div className="auth-hero-tag-dot" />
            <span className="auth-hero-tag">All Together</span>
          </div>
        </div>



        {/* Bottom bar */}
        <div className="auth-bottombar">
          <div className="auth-bottombar-left">
            FlexiAi / Orbit
          </div>
          <div className="auth-bottombar-center">
            <span>Ideas have more space here</span>
            <div className="auth-bottombar-line" />
          </div>
          <div className="auth-bottombar-right">
            <span>Same thoughts. A wider world.</span>
            <div className="auth-bottombar-line" />
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-panel">
        {children}
      </div>
    </div>
  );
}
