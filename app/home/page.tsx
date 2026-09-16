"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, FileText, Sparkles, Users, Search, ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ImageStreamHero } from "@/app/_components/ui/image-stream-hero";

export default function HomePage() {
  return (
    <div style={{ width: "100%", overflowX: "hidden", fontFamily: "var(--font-ui)", color: "#111" }}>
      
      {/* ── HERO SECTION (3D ORBIT) ── */}
      <section style={{
        width: "100%",
        minHeight: "100vh",
        background: "radial-gradient(circle at 70% 80%, #fbd5a9 0%, #f3c299 15%, #e1aa8b 30%, #c4967c 50%, #f7f5f2 100%)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
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
            <Link href="#features" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-black">Features</Link>
            <Link href="#pricing" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-black">Pricing</Link>
            <Link href="#blog" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-black">Blog</Link>
            <Link href="#faq" style={{ textDecoration: "none", color: "inherit" }} className="hover:text-black">FAQ</Link>
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

            {/* Orbit Ring 1 (Inner) */}
            <motion.div
              initial={{ rotateX: 70, rotateY: -15, rotateZ: 0 }}
              animate={{ rotateX: 70, rotateY: -15, rotateZ: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                width: "550px",
                height: "550px",
                borderRadius: "50%",
                border: "1.5px solid rgba(0,0,0,0.8)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Node 1 */}
              <div style={{ position: "absolute", top: "50%", right: "-10%", transform: "translateY(-50%) rotateX(-70deg) rotateY(15deg) translateZ(40px)" }}>
                <GlassNode icon={<FileText size={16} />} title="Notes" desc="Capture ideas instantly" />
              </div>
              {/* Node 2 */}
              <div style={{ position: "absolute", top: "50%", left: "-10%", transform: "translateY(-50%) rotateX(-70deg) rotateY(15deg) translateZ(40px)" }}>
                <GlassNode icon={<Search size={16} />} title="Files" desc="Bring your world together" />
              </div>
            </motion.div>

            {/* Orbit Ring 2 (Middle) */}
            <motion.div
              initial={{ rotateX: 75, rotateY: 10, rotateZ: 0 }}
              animate={{ rotateX: 75, rotateY: 10, rotateZ: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                width: "750px",
                height: "750px",
                borderRadius: "50%",
                border: "1px dashed rgba(0,0,0,0.6)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Node 3 */}
              <div style={{ position: "absolute", top: "-5%", left: "50%", transform: "translateX(-50%) rotateX(-75deg) rotateY(-10deg) translateZ(60px)" }}>
                <GlassNode icon={<MessageSquare size={16} />} title="Multiple AI Bots" desc="Chat with top AI models" />
              </div>
              {/* Node 4 */}
              <div style={{ position: "absolute", bottom: "-5%", left: "50%", transform: "translateX(-50%) rotateX(-75deg) rotateY(-10deg) translateZ(60px)" }}>
                <GlassNode icon={<FolderOpen size={16} />} title="Projects" desc="Keep everything organized" />
              </div>
            </motion.div>

            {/* Orbit Ring 3 (Outer) */}
            <motion.div
              initial={{ rotateX: 65, rotateY: -5, rotateZ: 0 }}
              animate={{ rotateX: 65, rotateY: -5, rotateZ: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                width: "950px",
                height: "950px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.4)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Node 5 */}
              <div style={{ position: "absolute", top: "15%", left: "15%", transform: "rotateX(-65deg) rotateY(5deg) translateZ(80px)" }}>
                <GlassNode icon={<Sparkles size={16} />} title="All in One" desc="Everything in one workspace" />
              </div>
              {/* Node 6 */}
              <div style={{ position: "absolute", bottom: "15%", right: "15%", transform: "rotateX(-65deg) rotateY(5deg) translateZ(80px)" }}>
                <GlassNode icon={<Users size={16} />} title="Built for You" desc="Work, study, create" />
              </div>
            </motion.div>
            
          </div>
        </main>
        
        {/* Footer Text for Hero */}
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
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: "120px 5%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "16px" }}>The Pieces, All Together.</h2>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "80px", maxWidth: "600px", textAlign: "center" }}>
          Workflows have become too complex for a single app. Stop hunting for the right tab. 
          Orbit unifies the tools you need into a single governed space.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", width: "100%", maxWidth: "1100px" }}>
          <FeatureCard 
            icon={<MessageSquare />}
            title="Multi-Model AI Chat"
            desc="Speak with Claude, GPT-4, and Gemini simultaneously in the same conversation thread."
          />
          <FeatureCard 
            icon={<FileText />}
            title="Spatial Notes"
            desc="Map out your ideas on an infinite canvas. Link thoughts to code and chat logs directly."
          />
          <FeatureCard 
            icon={<FolderOpen />}
            title="Project Organization"
            desc="Keep all context scoped to the project. Never leak API keys or prompts into other workspaces."
          />
          <FeatureCard 
            icon={<Search />}
            title="Web Research"
            desc="Built-in web grounding that synthesizes current internet knowledge directly into your workspace."
          />
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" style={{ padding: "120px 5%", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", borderTop: "1px solid #eaeaea", borderBottom: "1px solid #eaeaea" }}>
        <h2 style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "16px" }}>Simple, Transparent Pricing</h2>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "80px", textAlign: "center" }}>Start free, upgrade when you need infinite limits.</p>

        <div style={{ display: "flex", gap: "32px", width: "100%", maxWidth: "1000px", flexWrap: "wrap", justifyContent: "center" }}>
          
          <PricingCard 
            title="Starter"
            price="$0"
            desc="Perfect for individuals just exploring."
            features={["3 Active Projects", "Basic AI Chat", "Community Support", "1GB Storage"]}
          />

          <PricingCard 
            title="Pro"
            price="$29"
            desc="For creators doing deep work."
            features={["Unlimited Projects", "Premium Models (GPT-4, Opus)", "Priority Support", "100GB Storage"]}
            highlighted
          />

          <PricingCard 
            title="Team"
            price="$99"
            desc="For startups and agile teams."
            features={["Shared Workspaces", "SSO Authentication", "Dedicated Success Manager", "Unlimited Storage"]}
          />

        </div>
      </section>

      {/* ── LATEST FROM ORBIT SECTION ── */}
      <section id="blog" style={{ background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: "100vh", position: "relative" }}>
        <ImageStreamHero
          images={[
            { src: "/images/blog1.jpg", alt: "Future of workspaces" },
            { src: "/images/blog2.jpg", alt: "Multi-model chat" },
            { src: "/images/blog3.jpg", alt: "Organize chaos" },
            { src: "/images/blog1.jpg", alt: "Future of workspaces" },
            { src: "/images/blog2.jpg", alt: "Multi-model chat" },
            { src: "/images/blog3.jpg", alt: "Organize chaos" },
          ]}
          cards={6}
          speed={24}
          style={{ width: "100%", height: "100vh", position: "absolute", inset: 0 }}
        >
          <div style={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", zIndex: 10 }}>
            <div>
              <h2 style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em", color: "#111", textShadow: "0 4px 24px rgba(255,255,255,0.8)" }}>Latest from Orbit</h2>
            </div>
          </div>
        </ImageStreamHero>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ padding: "120px 5%", background: "#111", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "80px" }}>Frequently Asked Questions</h2>
        
        <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <FaqItem 
            q="How secure is my data?"
            a="We use end-to-end encryption for all your notes and projects. Your API keys are encrypted at rest and never shared with our servers in plaintext."
          />
          <FaqItem 
            q="Can I use my own API keys?"
            a="Yes! If you have your own OpenAI or Anthropic API keys, you can input them directly to bypass our usage limits entirely."
          />
          <FaqItem 
            q="Is there a desktop app?"
            a="Orbit is currently a Progressive Web App (PWA). You can install it to your dock or taskbar directly from your browser, giving it a native feel."
          />
          <FaqItem 
            q="Can I collaborate with others?"
            a="Collaboration is available on the Team plan. You can share projects, co-edit canvases in real-time, and chat with AI in multiplayer mode."
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a0a0a", padding: "64px 5%", color: "#888", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", marginBottom: "16px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white" }} />
              <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.03em" }}>orbit</span>
            </div>
            <p style={{ maxWidth: "240px", fontSize: "13px", lineHeight: 1.6 }}>
              Building the foundation for the next generation of creative work.
            </p>
          </div>
          <div style={{ display: "flex", gap: "64px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <strong style={{ color: "white", marginBottom: "8px" }}>Product</strong>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Features</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Pricing</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Changelog</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <strong style={{ color: "white", marginBottom: "8px" }}>Company</strong>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>About</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Careers</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <strong style={{ color: "white", marginBottom: "8px" }}>Legal</strong>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: "1100px", borderTop: "1px solid #222", marginTop: "64px", paddingTop: "32px", fontSize: "13px", textAlign: "center" }}>
          &copy; {new Date().getFullYear()} Orbit Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

// ── COMPONENT DEFINITIONS ──

function GlassNode({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.9)",
      borderRadius: "6px",
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 16px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
      width: "max-content",
      minWidth: "120px",
      textAlign: "center"
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#111",
        marginBottom: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "2px" }}>{title}</div>
      <div style={{ fontSize: "11px", color: "#666", maxWidth: "110px", lineHeight: 1.3 }}>{desc}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div style={{
      padding: "32px",
      background: "#f9f9f9",
      borderRadius: "16px",
      border: "1px solid #eaeaea",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      transition: "transform 0.2s, background 0.2s"
    }}
    className="hover:bg-gray-50 hover:-translate-y-1"
    >
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "20px", fontWeight: 600 }}>{title}</h3>
      <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function PricingCard({ title, price, desc, features, highlighted = false }: { title: string, price: string, desc: string, features: string[], highlighted?: boolean }) {
  return (
    <div style={{
      flex: "1 1 300px",
      maxWidth: "320px",
      padding: "40px 32px",
      background: highlighted ? "#fff" : "transparent",
      borderRadius: "24px",
      border: highlighted ? "2px solid #e1aa8b" : "1px solid #ddd",
      boxShadow: highlighted ? "0 24px 48px rgba(0,0,0,0.08)" : "none",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {highlighted && (
        <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(to right, #f3c299, #e1aa8b)", color: "white", padding: "4px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Most Popular
        </div>
      )}
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>{desc}</p>
      <div style={{ fontSize: "48px", fontWeight: 500, letterSpacing: "-0.04em", marginBottom: "32px", color: "#111" }}>{price}<span style={{ fontSize: "16px", color: "#888", fontWeight: 400 }}>/mo</span></div>
      
      <Link href="/signup" style={{
        display: "block",
        textAlign: "center",
        padding: "14px",
        background: highlighted ? "#111" : "transparent",
        border: highlighted ? "none" : "1px solid #111",
        color: highlighted ? "white" : "#111",
        borderRadius: "99px",
        fontWeight: 600,
        marginBottom: "40px",
        textDecoration: "none"
      }}>
        Get Started
      </Link>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#444" }}>
            <Check size={16} color="#e1aa8b" /> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogCard({ date, title, desc, image }: { date: string, title: string, desc: string, image?: string }) {
  return (
    <div style={{ cursor: "pointer", group: "true" }} className="group">
      <div style={{ width: "100%", height: "200px", background: "#f5f5f5", borderRadius: "16px", marginBottom: "24px", overflow: "hidden", position: "relative" }}>
        {image ? (
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} className="group-hover:scale-105" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fbd5a9, #e1aa8b)", opacity: 0.8, transition: "opacity 0.3s" }} className="group-hover:opacity-100" />
        )}
      </div>
      <div style={{ fontSize: "13px", color: "#888", fontWeight: 500, marginBottom: "8px" }}>{date}</div>
      <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px", lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div 
      style={{ borderBottom: "1px solid #333", padding: "24px 0", cursor: "pointer" }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 500 }}>{q}</h3>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={20} color="#666" /></motion.div>
      </div>
      <motion.div 
        initial={{ height: 0, opacity: 0, marginTop: 0 }}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0, marginTop: open ? 16 : 0 }}
        style={{ overflow: "hidden", color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}
      >
        {a}
      </motion.div>
    </div>
  );
}