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
    roleRow: { display: "flex", gap: 12, marginTop: 18 },
    roleCard: (active) => ({
        flex: 1,
        padding: 14,
        borderRadius: 10,
        border: active ? "2px solid #6366f1" : "1px solid #e6edf3",
        background: active ? "rgba(99,102,241,0.04)" : "#fff",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
    }),
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
    footNote: { fontSize: 13, color: "#64748b" },
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
    const [role, setRole] = useState("client"); // 'client' or 'admin'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [adminKey, setAdminKey] = useState("");
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
        if (role === "admin" && adminKey.trim().length < 6)
            errs.adminKey = "Admin key is required for admin accounts.";
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
            // Replace endpoint with your backend route
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role, adminKey: role === "admin" ? adminKey : undefined }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.message || `Server error: ${res.status}`);
            }

            const data = await res.json().catch(() => ({}));
            setMessage({ type: "success", text: data?.message || "Account created successfully." });
            // Optionally reset form (keep role maybe)
            setName("");
            setEmail("");
            setPassword("");
            setConfirm("");
            setAdminKey("");
            setErrorFields({});
        } catch (err) {
            setMessage({ type: "error", text: err.message || "An error occurred." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card} role="main" aria-labelledby="create-account-heading">
                <main style={styles.left}>
                    <h1 id="create-account-heading" style={styles.heading}>
                        Create an account
                    </h1>
                    <p style={styles.sub}>Choose account type and provide details to get started.</p>

                    <div style={styles.roleRow} role="tablist" aria-label="Account type">
                        <div
                            role="tab"
                            aria-selected={role === "client"}
                            tabIndex={0}
                            onClick={() => setRole("client")}
                            onKeyDown={(e) => e.key === "Enter" && setRole("client")}
                            style={styles.roleCard(role === "client")}
                        >
                            <strong>Client</strong>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Standard user access</span>
                        </div>

                        <div
                            role="tab"
                            aria-selected={role === "admin"}
                            tabIndex={0}
                            onClick={() => setRole("admin")}
                            onKeyDown={(e) => e.key === "Enter" && setRole("admin")}
                            style={styles.roleCard(role === "admin")}
                        >
                            <strong>Admin</strong>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Manage products & users</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ marginTop: 20 }} noValidate>
                        <label style={styles.label} htmlFor="name">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                            aria-invalid={!!errorFields.name}
                            aria-describedby={errorFields.name ? "name-error" : undefined}
                        />
                        {errorFields.name && (
                            <div id="name-error" style={styles.error}>
                                {errorFields.name}
                            </div>
                        )}

                        <div style={{ height: 12 }} />

                        <label style={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                            aria-invalid={!!errorFields.email}
                            aria-describedby={errorFields.email ? "email-error" : undefined}
                        />
                        {errorFields.email && (
                            <div id="email-error" style={styles.error}>
                                {errorFields.email}
                            </div>
                        )}

                        <div style={{ height: 12 }} />

                        <label style={styles.label} htmlFor="password">
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="password"
                                name="password"
                                type={showPw ? "text" : "password"}
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                aria-invalid={!!errorFields.password}
                                aria-describedby={errorFields.password ? "pw-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                aria-label={showPw ? "Hide password" : "Show password"}
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
                        {errorFields.password && (
                            <div id="pw-error" style={styles.error}>
                                {errorFields.password}
                            </div>
                        )}

                        <div style={{ height: 10 }} />

                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <div style={styles.meter} aria-hidden>
                                    <div style={styles.meterFill(pwStrength)} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                    <span style={styles.smallMuted}>Password strength</span>
                                    <span style={{ fontSize: 13, color: "#475569" }}>
                                        {pwStrength > 80 ? "Strong" : pwStrength > 50 ? "Good" : pwStrength > 30 ? "Weak" : "Very weak"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ minWidth: 120, textAlign: "right" }}>
                                <span style={styles.smallMuted}>Min 8 chars</span>
                            </div>
                        </div>

                        <div style={{ height: 12 }} />

                        <label style={styles.label} htmlFor="confirm">
                            Confirm password
                        </label>
                        <input
                            id="confirm"
                            name="confirm"
                            type={showPw ? "text" : "password"}
                            style={styles.input}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat your password"
                            aria-invalid={!!errorFields.confirm}
                            aria-describedby={errorFields.confirm ? "confirm-error" : undefined}
                        />
                        {errorFields.confirm && (
                            <div id="confirm-error" style={styles.error}>
                                {errorFields.confirm}
                            </div>
                        )}

                        {role === "admin" && (
                            <>
                                <div style={{ height: 12 }} />
                                <label style={styles.label} htmlFor="adminkey">
                                    Admin key
                                </label>
                                <input
                                    id="adminkey"
                                    name="adminkey"
                                    style={styles.input}
                                    value={adminKey}
                                    onChange={(e) => setAdminKey(e.target.value)}
                                    placeholder="Enter admin invite key"
                                    aria-invalid={!!errorFields.adminKey}
                                    aria-describedby={errorFields.adminKey ? "adminkey-error" : undefined}
                                />
                                {errorFields.adminKey && (
                                    <div id="adminkey-error" style={styles.error}>
                                        {errorFields.adminKey}
                                    </div>
                                )}
                            </>
                        )}

                        <div style={{ height: 18 }} />

                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                                type="submit"
                                style={styles.submit(submitting)}
                                disabled={submitting}
                                aria-disabled={submitting}
                            >
                                {submitting ? "Creating..." : "Create account"}
                            </button>

                            <div style={{ marginLeft: "auto", fontSize: 13, color: "#64748b" }}>
                                <span style={{ marginRight: 6 }}>Role:</span>
                                <strong>{role === "admin" ? "Admin" : "Client"}</strong>
                            </div>
                        </div>

                        {message && (
                            <div style={message.type === "error" ? styles.error : styles.success}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </main>

                <aside style={styles.right} aria-hidden>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16 }}>Why create an account?</h3>
                        <p style={{ marginTop: 8, ...styles.footNote }}>
                            Save your products, manage inventory, view orders, and collaborate with your team (admins).
                        </p>
                    </div>

                    <div>
                        <h4 style={{ margin: 0, fontSize: 14 }}>Tips for a secure password</h4>
                        <ul style={{ marginTop: 12, paddingLeft: 18, color: "#475569", fontSize: 13 }}>
                            <li>Use 12+ characters when possible.</li>
                            <li>Include a mix of uppercase, numbers, and symbols.</li>
                            <li>Avoid reusing passwords across sites.</li>
                        </ul>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                        <div style={{ fontSize: 13, color: "#64748b" }}>Need help?</div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            <a href="/help" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
                                Documentation
                            </a>
                            <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>
                                Contact support
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default CreateAccount;