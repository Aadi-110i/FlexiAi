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

        {/* Ambient particles */}
        <div className="auth-particles">
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
          <div className="auth-particle" />
        </div>

        {/* Sparkles */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <span className="auth-sparkle" style={{ top: "18%", left: "42%" }}>✦</span>
          <span className="auth-sparkle" style={{ top: "42%", left: "12%", animationDelay: "-2s" }}>✦</span>
          <span className="auth-sparkle" style={{ top: "28%", left: "78%", animationDelay: "-3.5s", fontSize: "7px" }}>✦</span>
          <span className="auth-sparkle" style={{ top: "72%", left: "52%", animationDelay: "-5s", fontSize: "8px" }}>✦</span>
        </div>

        {/* Orbit Scene — SVG elliptical rings + sphere */}
        <div className="auth-orbit-scene">
          {/* SVG orbits */}
          <svg className="auth-orbit-svg" viewBox="0 0 680 680" fill="none">
            <defs>
              <radialGradient id="nodeGrad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f9c080" />
                <stop offset="100%" stopColor="#c97540" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e8b870" />
                <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outermost ring — slow, tilted ellipse */}
            <ellipse
              cx="340" cy="340"
              rx="290" ry="110"
              stroke="rgba(180, 155, 120, 0.20)"
              strokeWidth="1"
              style={{ transform: "rotate(-18deg)", transformOrigin: "340px 340px" }}
            />
            {/* Rotating node on outer ring */}
            <g className="auth-orbit-ellipse-1" style={{ transformOrigin: "340px 340px" }}>
              <ellipse cx="340" cy="340" rx="290" ry="110"
                stroke="rgba(180, 155, 120, 0)"
                strokeWidth="0" fill="none"
                style={{ transform: "rotate(-18deg)", transformOrigin: "340px 340px" }} />
              {/* Node at top of ellipse */}
              <circle cx="340" cy="230" r="4" fill="#f9c080" opacity="0.8">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="3.5;5;3.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="340" cy="230" r="10" fill="url(#nodeGrad1)" opacity="0.3" />
            </g>

            {/* Mid ring */}
            <ellipse
              cx="340" cy="340"
              rx="200" ry="76"
              stroke="rgba(180, 155, 120, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 8"
              style={{ transform: "rotate(12deg)", transformOrigin: "340px 340px" }}
            />
            <g className="auth-orbit-ellipse-2" style={{ transformOrigin: "340px 340px" }}>
              <circle cx="340" cy="264" r="3.5" fill="#e8b870" opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                <animate attributeName="r" values="3;4.5;3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="340" cy="264" r="9" fill="url(#nodeGrad2)" opacity="0.4" />
            </g>

            {/* Inner ring */}
            <ellipse
              cx="340" cy="340"
              rx="130" ry="50"
              stroke="rgba(180, 155, 120, 0.20)"
              strokeWidth="1"
              style={{ transform: "rotate(-6deg)", transformOrigin: "340px 340px" }}
            />
            <g className="auth-orbit-ellipse-3" style={{ transformOrigin: "340px 340px" }}>
              <circle cx="340" cy="290" r="3" fill="#c97540" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Fine connector lines from sphere to cards (subtle) */}
            <line x1="340" y1="340" x2="180" y2="200" stroke="rgba(200, 170, 130, 0.12)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="340" y1="340" x2="520" y2="195" stroke="rgba(200, 170, 130, 0.12)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="340" y1="340" x2="530" y2="480" stroke="rgba(200, 170, 130, 0.10)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="340" y1="340" x2="155" y2="470" stroke="rgba(200, 170, 130, 0.10)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="340" y1="340" x2="340" y2="560" stroke="rgba(200, 170, 130, 0.08)" strokeWidth="1" strokeDasharray="3 6" />
          </svg>

          {/* Central glowing sphere */}
          <div className="auth-sphere" />
        </div>

        {/* Floating feature cards */}
        <div className="auth-float-cards">
          <div className="auth-fc auth-fc-chat">
            <div className="auth-fc-label">
              <div className="auth-fc-icon">
                <MessageSquare size={12} />
              </div>
              AI Chat
            </div>
            <div className="auth-fc-sub">Right where you need it</div>
          </div>

          <div className="auth-fc auth-fc-research">
            <div className="auth-fc-label">
              <div className="auth-fc-icon">
                <Search size={12} />
              </div>
              Research
            </div>
            <div className="auth-fc-sub">Bring the world in</div>
          </div>

          <div className="auth-fc auth-fc-code">
            <div className="auth-fc-label">
              <div className="auth-fc-icon">
                <Code2 size={12} />
              </div>
              Code
            </div>
            <div className="auth-fc-sub">Build and iterate</div>
          </div>

          <div className="auth-fc auth-fc-notes">
            <div className="auth-fc-label">
              <div className="auth-fc-icon">
                <StickyNote size={12} />
              </div>
              Notes
            </div>
            <div className="auth-fc-sub">Capture your thoughts</div>
          </div>

          <div className="auth-fc auth-fc-draw">
            <div className="auth-fc-label">
              <div className="auth-fc-icon">
                <PenTool size={12} />
              </div>
              Draw
            </div>
            <div className="auth-fc-sub">Visualize freely</div>
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

        {/* Landscape silhouette SVG */}
        <div className="auth-landscape">
          <svg
            viewBox="0 0 1400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", position: "absolute", bottom: 0 }}
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(110, 85, 65, 0)" />
                <stop offset="60%" stopColor="rgba(90, 72, 55, 0.45)" />
                <stop offset="100%" stopColor="rgba(70, 55, 42, 0.75)" />
              </linearGradient>
              <linearGradient id="mtnGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(130, 100, 75, 0)" />
                <stop offset="40%" stopColor="rgba(100, 78, 58, 0.30)" />
                <stop offset="100%" stopColor="rgba(80, 62, 46, 0.65)" />
              </linearGradient>
            </defs>
            {/* Back mountains */}
            <path
              d="M0,300 L0,220 L80,160 L160,200 L260,110 L360,155 L460,90 L560,135 L660,75 L760,125 L860,65 L960,115 L1060,80 L1160,125 L1260,70 L1360,120 L1400,100 L1400,300 Z"
              fill="url(#mtnGrad2)"
            />
            {/* Front mountains */}
            <path
              d="M0,300 L0,260 L100,200 L200,240 L300,165 L400,210 L500,150 L600,195 L700,140 L800,185 L900,160 L1000,200 L1100,175 L1200,215 L1300,180 L1400,220 L1400,300 Z"
              fill="url(#mtnGrad)"
            />
          </svg>
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
