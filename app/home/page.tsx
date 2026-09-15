"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, FileText, Sparkles, Users, Search, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      // A warm, cinematic sunset gradient to replace the mountain image
      background: "radial-gradient(circle at 70% 80%, #fbd5a9 0%, #f3c299 15%, #e1aa8b 30%, #c4967c 50%, #f7f5f2 100%)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "var(--font-ui)",
      color: "#111"
    }}>
      
      {/* ── Navbar ── */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 48px",
        zIndex: 50,
        position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(to bottom right, #444, #111)" }} />
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em" }}>orbit</span>
        </div>
        
        <div style={{ display: "flex", gap: "32px", fontSize: "14px", fontWeight: 500, color: "#444" }}>
          <span style={{ color: "#111", borderBottom: "2px solid #111", paddingBottom: "4px" }}>Home</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover:text-black">Features</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover:text-black">Pricing</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover:text-black">Blog</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover:text-black">FAQ</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "14px", fontWeight: 500 }}>
          <Link href="/login" style={{ color: "#111", textDecoration: "none" }}>Sign in</Link>
          <Link href="/signup" style={{
            background: "#1A1A1A",
            color: "white",
            textDecoration: "none",
            borderRadius: "99px",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={{
        flex: 1,
        display: "flex",
        position: "relative",
        zIndex: 10,
        alignItems: "center"
      }}>
        
        {/* Left Side: Typography */}
        <div style={{ 
          width: "50%", 
          paddingLeft: "6vw",
          position: "relative",
          zIndex: 20
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: "#666", marginBottom: "32px", textTransform: "uppercase" }}
          >
            One Workspace. Infinite Possibilities.
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            style={{ 
              fontSize: "clamp(48px, 6vw, 76px)", 
              fontWeight: 500, 
              lineHeight: 1.05, 
              color: "#111", 
              marginBottom: "32px",
              letterSpacing: "-0.02em",
              maxWidth: "600px"
            }}
          >
            All Your AI Tools, Ideas and Work <span style={{ color: "rgba(17,17,17,0.35)" }}>in One Orbit.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ 
              fontSize: "18px", 
              lineHeight: 1.6, 
              color: "#555", 
              maxWidth: "480px"
            }}
          >
            Chat with multiple AI bots, take notes, manage projects, and keep your files — all in one seamless workspace. Less switching. More creating.
          </motion.p>
        </div>

        {/* Right Side: The 3D Orbital System */}
        <div style={{
          width: "50%",
          height: "100%",
          position: "absolute",
          right: 0,
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1000px"
        }}>
          
          {/* The Central Planet */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #fff, #f4cba5 20%, #d88960 60%, #512b23 100%)",
              boxShadow: "0 40px 100px rgba(81, 43, 35, 0.4), inset -20px -20px 60px rgba(0,0,0,0.5)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            <span style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.03em" }}>orbit</span>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", opacity: 0.7, marginTop: "8px" }}>IDEAS IN MOTION</span>
          </motion.div>

          {/* Orbit Ring 1 (Small) */}
          <motion.div
            initial={{ rotateX: 70, rotateY: -15, rotateZ: 0 }}
            animate={{ rotateX: 70, rotateY: -15, rotateZ: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              border: "1.5px solid rgba(0,0,0,0.06)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Node: Notes */}
            <div style={{ position: "absolute", top: "15%", right: "-5%", transform: "rotateX(-70deg) rotateY(15deg) translateZ(50px)" }}>
              <GlassNode icon={<FileText size={20} />} title="Notes" desc="Capture ideas instantly" />
            </div>
            {/* Node: All in One */}
            <div style={{ position: "absolute", bottom: "10%", left: "15%", transform: "rotateX(-70deg) rotateY(15deg) translateZ(50px)" }}>
              <GlassNode icon={<Sparkles size={20} />} title="All in One" desc="Everything in one workspace" />
            </div>
          </motion.div>

          {/* Orbit Ring 2 (Large) */}
          <motion.div
            initial={{ rotateX: 75, rotateY: 10, rotateZ: 0 }}
            animate={{ rotateX: 75, rotateY: 10, rotateZ: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: "850px",
              height: "850px",
              borderRadius: "50%",
              border: "1px dashed rgba(0,0,0,0.1)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Node: AI Bots */}
            <div style={{ position: "absolute", top: "5%", left: "30%", transform: "rotateX(-75deg) rotateY(-10deg) translateZ(80px)" }}>
              <GlassNode icon={<MessageSquare size={20} />} title="Multiple AI Bots" desc="Chat with top AI models" />
            </div>
            {/* Node: Projects */}
            <div style={{ position: "absolute", bottom: "35%", left: "-5%", transform: "rotateX(-75deg) rotateY(-10deg) translateZ(80px)" }}>
              <GlassNode icon={<FolderOpen size={20} />} title="Projects" desc="Keep everything organized" />
            </div>
            {/* Node: Files */}
            <div style={{ position: "absolute", bottom: "15%", right: "15%", transform: "rotateX(-75deg) rotateY(-10deg) translateZ(80px)" }}>
              <GlassNode icon={<Search size={20} />} title="Files" desc="Bring your world together" />
            </div>
            {/* Node: Built for You */}
            <div style={{ position: "absolute", bottom: "-2%", right: "45%", transform: "rotateX(-75deg) rotateY(-10deg) translateZ(80px)" }}>
              <GlassNode icon={<Users size={20} />} title="Built for You" desc="Work, study, create" />
            </div>
          </motion.div>
          
        </div>
      </main>
      
      {/* Footer Text */}
      <div style={{
        position: "absolute",
        bottom: "32px",
        left: "48px",
        right: "48px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "rgba(17,17,17,0.4)",
        textTransform: "uppercase",
        zIndex: 50
      }}>
        <span>Think &middot; Create &middot; Organize &middot; Grow</span>
        <span>A Simpler Tomorrow</span>
      </div>
    </div>
  );
}

// Reusable Glassmorphism Node Component
function GlassNode({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.9)",
      borderRadius: "20px",
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 16px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
      width: "max-content",
      minWidth: "160px",
      textAlign: "center"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#111",
        marginBottom: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "12px", color: "#666", maxWidth: "120px" }}>{desc}</div>
    </div>
  );
}