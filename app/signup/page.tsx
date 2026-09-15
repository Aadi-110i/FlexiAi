"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/app/_components/auth/AuthLayout";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

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
    <AuthLayout>
      <div className="oracle-auth" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "24px",
        gap: "24px"
      }}>
        <div className="oracle-auth-card" style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 40px",
          boxShadow: "var(--shadow-md)",
        }}>
          <div className="oracle-auth-header" style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>Create account</h1>
            <p style={{ fontSize: "15px", color: "var(--fg-muted)", letterSpacing: "0.01em" }}>Start your journey</p>
          </div>

          {error && <div className="oracle-error-banner" style={{
            background: "rgba(252, 240, 240, 0.9)",
            border: "1px solid rgba(240, 200, 200, 0.8)",
            color: "var(--error)",
            fontSize: "13px",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
            lineHeight: "1.4",
            width: "100%"
          }}>{error}</div>}

          <form onSubmit={handleSignup} className="oracle-auth-form" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Full name */}
            <div style={{ position: "relative" }}>
              <div className="oracle-input-icon" style={{ color: "var(--fg-subtle)" }}><User size={18} /></div>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div style={{ position: "relative" }}>
              <div className="oracle-input-icon" style={{ color: "var(--fg-subtle)" }}><Mail size={18} /></div>
              <input
                id="signup-email"
                type="email"
                className="input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative" }}>
              <div className="oracle-input-icon" style={{ color: "var(--fg-subtle)" }}><Lock size={18} /></div>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--fg-subtle)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color var(--transition-fast)",
                  borderRadius: "4px"
                }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ display: "flex", gap: "4px", marginTop: "8px", padding: "0 2px" }}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    style={{
                      height: "3px",
                      flex: 1,
                      borderRadius: "99px",
                      background: strength >= level ? strengthColor : "rgba(213, 206, 196, 0.6)",
                      transition: "background var(--transition-fast)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, var(--accent) 0%, #0FA898 50%, var(--accent) 100%)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "16px 24px",
                fontSize: "15px",
                fontWeight: 500,
                fontFamily: "inherit",
                letterSpacing: "0.01em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px",
                transition: "all var(--transition-fast)",
                boxShadow: "0 6px 20px rgba(14, 143, 131, 0.25), 0 2px 6px rgba(14, 143, 131, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
              }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" style={{ marginRight: "8px" }} />
              ) : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="oracle-divider" style={{ display: "flex", alignItems: "center", textAlign: "center", color: "var(--fg-muted)", fontSize: "11.5px", letterSpacing: "0.05em", margin: "32px 0" }}>
            <span style={{ flex: 1, borderBottom: "1px solid var(--border)" }} />
            <span style={{ padding: "0 14px", color: "var(--fg-muted)" }}>or continue with</span>
            <span style={{ flex: 1, borderBottom: "1px solid var(--border)" }} />
          </div>

          {/* Social Buttons */}
          <div className="oracle-social-row" style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button className="oracle-social-btn" style={{
              flex: 1,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              boxShadow: "0 1px 3px rgba(100, 80, 60, 0.04)"
            }} aria-label="Continue with Google">
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ color: "#4285F4" }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <button className="oracle-social-btn" style={{
              flex: 1,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              boxShadow: "0 1px 3px rgba(100, 80, 60, 0.04)"
            }} aria-label="Continue with GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#24292e" }}>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>

            <button className="oracle-social-btn" style={{
              flex: 1,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              boxShadow: "0 1px 3px rgba(100, 80, 60, 0.04)"
            }} aria-label="Continue with Apple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1d1d1f" }}>
                <path d="M16.365 14.364c-.035 3.125 2.671 4.161 2.71 4.178-.021.066-.421 1.442-1.396 2.871-.842 1.233-1.728 2.459-3.087 2.483-1.337.022-1.776-.79-3.3-.79-1.523 0-2.008.766-3.277.81-1.314.045-2.316-1.315-3.161-2.529-1.725-2.48-3.047-7.009-1.282-10.076.877-1.523 2.449-2.493 4.127-2.515 1.291-.021 2.507.87 3.3.87.79 0 2.272-1.096 3.821-.93 1.637.07 3.13.791 4.095 2.203-3.197 1.865-2.685 6.31-.55 7.425zm-2.585-11.458c.708-.865 1.186-2.062 1.056-3.242-1.018.04-2.274.675-2.997 1.543-.647.77-1.173 1.996-1.026 3.163 1.139.088 2.261-.595 2.967-1.464z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Footer Link */}
          <div className="oracle-auth-footer" style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--fg-muted)" }}>
            Already have an account? <Link href="/login" style={{ fontWeight: 600, color: "var(--fg)" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}