"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(4, score);
  };
  const strength = calculateStrength(password);
  const strengthColor = strength < 2 ? "#E05252" : strength < 4 ? "#D97706" : "#0E8F83";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      router.push("/workspace");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "radial-gradient(circle at 70% 80%, #fbd5a9 0%, #f3c299 15%, #e1aa8b 30%, #c4967c 50%, #f7f5f2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-ui)",
      color: "#111",
      padding: "24px"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          borderRadius: "32px",
          padding: "48px 40px",
          boxShadow: "0 24px 64px rgba(81, 43, 35, 0.15), inset 0 1px 0 rgba(255,255,255,1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(to bottom right, #444, #111)" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.03em" }}>orbit</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "8px" }}>Create account</h1>
          <p style={{ color: "#666", fontSize: "15px" }}>Start your journey with us.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", marginBottom: "24px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Full Name */}
          <div style={{ position: "relative" }}>
            <User size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px 16px 16px 44px",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "16px",
                fontSize: "15px",
                color: "#111",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.4)" }}
              onBlur={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.boxShadow = "none" }}
            />
          </div>

          {/* Email */}
          <div style={{ position: "relative" }}>
            <Mail size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px 16px 16px 44px",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "16px",
                fontSize: "15px",
                color: "#111",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.4)" }}
              onBlur={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.boxShadow = "none" }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "16px 44px 16px 44px",
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  borderRadius: "16px",
                  fontSize: "15px",
                  color: "#111",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.4)" }}
                onBlur={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.boxShadow = "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ display: "flex", gap: "4px", marginTop: "12px", padding: "0 4px" }}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    style={{
                      height: "3px",
                      flex: 1,
                      borderRadius: "99px",
                      background: strength >= level ? strengthColor : "rgba(0, 0, 0, 0.1)",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "15px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              marginTop: "8px",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "32px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
          <span style={{ fontSize: "13px", color: "#666" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: "12px", cursor: "pointer", display: "flex", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </button>
          <button style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: "12px", cursor: "pointer", display: "flex", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#24292e"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </button>
          <button style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: "12px", cursor: "pointer", display: "flex", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1d1d1f"><path d="M16.365 14.364c-.035 3.125 2.671 4.161 2.71 4.178-.021.066-.421 1.442-1.396 2.871-.842 1.233-1.728 2.459-3.087 2.483-1.337.022-1.776-.79-3.3-.79-1.523 0-2.008.766-3.277.81-1.314.045-2.316-1.315-3.161-2.529-1.725-2.48-3.047-7.009-1.282-10.076.877-1.523 2.449-2.493 4.127-2.515 1.291-.021 2.507.87 3.3.87.79 0 2.272-1.096 3.821-.93 1.637.07 3.13.791 4.095 2.203-3.197 1.865-2.685 6.31-.55 7.425zm-2.585-11.458c.708-.865 1.186-2.062 1.056-3.242-1.018.04-2.274.675-2.997 1.543-.647.77-1.173 1.996-1.026 3.163 1.139.088 2.261-.595 2.967-1.464z"/></svg>
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px", fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#111", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}