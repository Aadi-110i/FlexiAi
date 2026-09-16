"use client";
import React from "react";
import { MessageSquare, Search, Code2, StickyNote, PenTool } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-split-layout" style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg-warm)" }}>
      {/* ── Left Hero (Dark Editorial Style - 60% Width) ── */}
      <div 
        className="auth-hero" 
        style={{ 
          width: "60%", 
          backgroundColor: "#111111", 
          color: "#FAFAFA",
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          padding: "56px 64px",
          borderRight: "1px solid var(--border)",
          position: "relative"
        }}
      >
        <div className="auth-topbar-brand" style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 2 }}>
          <div style={{ width: "24px", height: "24px", background: "white", borderRadius: "4px" }} />
          <span style={{ fontWeight: 600, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Orbit</span>
        </div>

        {/* Premium subtle background glow */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(14,143,131,0.08) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

        <div className="auth-hero-content" style={{ zIndex: 2, display: "flex", flexDirection: "column", gap: "24px", marginTop: "-5vh" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(64px, 8vw, 100px)", letterSpacing: "-0.02em", fontWeight: 700, lineHeight: 1 }}>
            Orbit
          </div>
          <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.7)", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Your ideas, in a bigger space.
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px", color: "var(--accent)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
            <span>Chat</span>
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span>Research</span>
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span>Code</span>
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span>Notes</span>
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span>All Together</span>
          </div>
        </div>

        <div className="auth-hero-bottom" style={{ zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
          <span>© 2026 Orbit</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>Ideas have more space here</span>
            <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form - 40% Width) ── */}
      <div 
        className="auth-panel"
        style={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px",
          backgroundColor: "var(--bg-warm)"
        }}
      >
        {children}
      </div>
    </div>
  );
}
