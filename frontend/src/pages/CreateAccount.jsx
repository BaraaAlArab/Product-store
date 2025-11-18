import React, { useState, useMemo } from "react";

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.04))",
        padding: "32px",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
    },
    card: {
        width: "100%",
        maxWidth: 920,
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        gap: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(6, 24, 48, 0.08)",
        overflow: "hidden",
    },
    left: { padding: 28 },
    right: {
        background:
            "linear-gradient(180deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02))",
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    heading: { margin: 0, fontSize: 22, fontWeight: 600, color: "#0f172a" },
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
    error: { color: "#ef4444", fontSize: 13, marginTop: 6 },
    success: { color: "#059669", fontSize: 13, marginTop: 6 },
    submit: (disabled) => ({
        padding: "10px 14px",
        borderRadius: 10,
        background: disabled ? "#e6e9ff" : "#6366f1",
        color: disabled ? "#94a3b8" : "#fff",
        border: "none",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
    }),
    footNote: { fontSize: 13, color: "#64748b" },
    smallMuted: { fontSize: 12, color: "#64748b" },
    meter: { height: 8, borderRadius: 6, background: "#eef2ff", overflow: "hidden" },
    meterFill: (p) => ({
        width: `${Math.min(100, Math.max(0, p))}%`,
        height: "100%",
        background:
            p > 80 ? "#059669" : p > 50 ? "#f59e0b" : p > 30 ? "#f97316" : "#ef4444",
        transition: "width 180ms ease",
    }),
};

function evaluatePasswordStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 30;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    if (pw.length >= 12) score += 10;
    return Math.min(100, score);
}

function CreateAccount() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [errorFields, setErrorFields] = useState({});

    const pwStrength = useMemo(() => evaluatePasswordStrength(password), [password]);

    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = "Full name is required.";
        if (!email.trim()) errs.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
        if (password.length < 8) errs.password = "Password must be at least 8 characters.";
        if (password !== confirm) errs.confirm = "Passwords do not match.";
        return errs;
    }

    async function handleSubmit(e) {
        e && e.preventDefault();
        setMessage(null);
        const errs = validate();
        setErrorFields(errs);
        if (Object.keys(errs).length) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.message || `Server error: ${res.status}`);
            }

            const data = await res.json().catch(() => ({}));
            setMessage({ type: "success", text: data?.message || "Account created successfully." });

            setName("");
            setEmail("");
            setPassword("");
            setConfirm("");
            setErrorFields({});
        } catch (err) {
            setMessage({ type: "error", text: err.message || "An error occurred." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <main style={styles.left}>
                    <h1 style={{ ...styles.heading, color: "black" }}>
                        Create an account
                    </h1>
                    <p style={styles.sub}>Provide your details to get started.</p>

                    <form onSubmit={handleSubmit} style={{ marginTop: 20 }} noValidate>
                        <label style={styles.label}>Full name</label>
                        <input
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                        />
                        {errorFields.name && <div style={styles.error}>{errorFields.name}</div>}

                        <div style={{ height: 12 }} />

                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                        />
                        {errorFields.email && <div style={styles.error}>{errorFields.email}</div>}

                        <div style={{ height: 12 }} />

                        <label style={styles.label}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
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
                                }}
                            >
                                {showPw ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errorFields.password && <div style={styles.error}>{errorFields.password}</div>}

                        <div style={{ height: 10 }} />

                        <div>
                            <div style={styles.meter}>
                                <div style={styles.meterFill(pwStrength)} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                <span style={styles.smallMuted}>Password strength</span>
                                <span style={{ fontSize: 13 }}>
                                    {pwStrength > 80
                                        ? "Strong"
                                        : pwStrength > 50
                                        ? "Good"
                                        : pwStrength > 30
                                        ? "Weak"
                                        : "Very weak"}
                                </span>
                            </div>
                        </div>

                        <div style={{ height: 12 }} />

                        <label style={styles.label}>Confirm password</label>
                        <input
                            type={showPw ? "text" : "password"}
                            style={styles.input}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat your password"
                        />
                        {errorFields.confirm && <div style={styles.error}>{errorFields.confirm}</div>}

                        <div style={{ height: 18 }} />

                        <button
                            type="submit"
                            style={styles.submit(submitting)}
                            disabled={submitting}
                        >
                            {submitting ? "Creating..." : "Create account"}
                        </button>

                        {message && (
                            <div style={message.type === "error" ? styles.error : styles.success}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </main>

                <aside style={styles.right}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Why create an account?</h3>
                    <p style={{ marginTop: 8, ...styles.footNote }}>
                        Save your products, manage items, place orders, and much more.
                    </p>
                </aside>
            </div>
        </div>
    );
}

export default CreateAccount;
