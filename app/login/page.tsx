"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/app/_components/auth/AuthLayout";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const searchParams = new URLSearchParams(window.location.search);
      const from = searchParams.get("from") || "/workspace";
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card-light">
        <div className="auth-header-light">
          <h1>Welcome back</h1>
          <p>Continue your journey with FlexiAi</p>
        </div>

        {error && <div className="auth-error-light">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          {/* Email */}
          <div className="auth-input-wrapper">
            <Mail size={15} className="auth-input-icon" />
            <input
              id="login-email"
              type="email"
              className="auth-input-light"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-input-wrapper">
            <Lock size={15} className="auth-input-icon" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="auth-input-light"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="auth-meta-row">
            <label className="auth-remember" htmlFor="keep-signed-in">
              <input
                id="keep-signed-in"
                type="checkbox"
                className="auth-checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              Keep me signed in
            </label>
            <Link href="#" className="auth-forgot">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="auth-btn-dark"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>Sign in <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        {/* Social buttons */}
        <div className="auth-social-row">
          <button id="login-google" className="social-btn" aria-label="Continue with Google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>

          <button id="login-github" className="social-btn" aria-label="Continue with GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#24292e" }}>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </button>

          <button id="login-apple" className="social-btn" aria-label="Continue with Apple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1d1d1f" }}>
              <path d="M16.365 14.364c-.035 3.125 2.671 4.161 2.71 4.178-.021.066-.421 1.442-1.396 2.871-.842 1.233-1.728 2.459-3.087 2.483-1.337.022-1.776-.79-3.3-.79-1.523 0-2.008.766-3.277.81-1.314.045-2.316-1.315-3.161-2.529-1.725-2.48-3.047-7.009-1.282-10.076.877-1.523 2.449-2.493 4.127-2.515 1.291-.021 2.507.87 3.3.87.79 0 2.272-1.096 3.821-.93 1.637.07 3.13.791 4.095 2.203-3.197 1.865-2.685 6.31-.55 7.425zm-2.585-11.458c.708-.865 1.186-2.062 1.056-3.242-1.018.04-2.274.675-2.997 1.543-.647.77-1.173 1.996-1.026 3.163 1.139.088 2.261-.595 2.967-1.464z"/>
            </svg>
          </button>
        </div>

        <div className="auth-footer-text">
          New here?{" "}
          <Link href="/signup" style={{ fontWeight: 600, color: "#1a1816" }}>
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
