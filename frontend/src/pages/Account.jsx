import React, { useState } from "react";
import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.04))",
    padding: "32px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
  },
  card: {
    width: "100%",
    maxWidth: 820,
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(6, 24, 48, 0.08)",
    overflow: "hidden",
  },
  left: {
    padding: 28,
  },
  right: {
    background:
      "linear-gradient(180deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02))",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
    color: "#0f172a",
  },
  sub: { marginTop: 6, color: "#475569", fontSize: 14 },
  label: { display: "block", marginBottom: 8, fontSize: 13, color: "#0f172a" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  submit: (disabled) => ({
    padding: "10px 14px",
    borderRadius: 10,
    background: disabled ? "#e6e9ff" : "#6366f1",
    color: disabled ? "#94a3b8" : "#fff",
    border: "none",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
  }),
  smallMuted: { fontSize: 12, color: "#64748b" },
  error: { color: "#ef4444", fontSize: 13, marginTop: 6 },
  success: { color: "#059669", fontSize: 13, marginTop: 6 },
};

function Account() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    try {
      setLoading(true);
      // Replace with your login endpoint
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      setMessage({ type: "success", text: "Login successful!" });
      // Navigate after success if needed
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <main style={styles.left}>
          <h1 style={styles.heading}>Sign in to your account</h1>
          <p style={styles.sub}>Access your dashboard and manage your content.</p>

          <form onSubmit={handleLogin} style={{ marginTop: 20 }} noValidate>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
            />

            <div style={{ height: 14 }} />

            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: 13,
                  padding: 6,
                }}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            <div style={{ marginTop: 6, textAlign: "right" }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: 13, color: "#6366f1", textDecoration: "none" }}
              >
                Forgot password?
              </Link>
            </div>

            <div style={{ height: 18 }} />

            <button
              type="submit"
              style={styles.submit(loading)}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {message && (
              <div
                style={message.type === "error" ? styles.error : styles.success}
              >
                {message.text}
              </div>
            )}

            <p style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}>
              Don’t have an account?{" "}
              <Link
                to="/CreateAccount"
                style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
              >
                Create one
              </Link>
            </p>
          </form>
        </main>

        <aside style={styles.right}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16 }}>Welcome back!</h3>
            <p style={{ marginTop: 8, ...styles.smallMuted }}>
              Log in to manage your profile, track orders, and access exclusive
              content.
            </p>
          </div>

          <div>
            <h4 style={{ margin: 0, fontSize: 14 }}>Security tips</h4>
            <ul
              style={{
                marginTop: 12,
                paddingLeft: 18,
                color: "#475569",
                fontSize: 13,
              }}
            >
              <li>Use a strong and unique password.</li>
              <li>Never share your login credentials.</li>
              <li>Enable two-factor authentication if available.</li>
            </ul>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Need help?</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <a
                href="/help"
                style={{
                  color: "#6366f1",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Documentation
              </a>
              <a
                href="/contact"
                style={{ color: "#64748b", textDecoration: "none" }}
              >
                Contact support
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Account;
