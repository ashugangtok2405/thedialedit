"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="admin-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form onSubmit={handleSubmit} className="admin-card" style={{ width: "100%", maxWidth: 360 }}>
        <div className="logo-text" style={{ marginBottom: 4 }}>
          <span className="the">THE</span> <span className="dial">DIAL</span> <span className="the">EDIT</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Admin Login</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{
            width: "100%",
            background: "var(--black-soft)",
            border: "1px solid var(--border)",
            color: "var(--cream)",
            borderRadius: 6,
            padding: "12px 14px",
            marginBottom: 14,
            fontSize: 14,
          }}
        />
        {error && <p className="error-text" style={{ marginBottom: 14 }}>{error}</p>}
        <button className="btn btn-gold btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
