"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();
  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = () => {
    setError("");
    if (!password || !confirm) return setError("Please fill in both fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setDone(true);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      {!done ? (
        <>
          <div style={{ width: 64, height: 64, background: "#1C312315", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 20 }}>🔒</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Reset password</h1>
          <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 28px" }}>Create a strong new password.</p>
          <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>New password</label>
            <input style={inp} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Confirm password</label>
            <input style={{ ...inp, marginBottom: 0 }} type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <button onClick={handle} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Reset password</button>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "#1C312315", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 24 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 10px" }}>Password reset!</h2>
          <p style={{ fontSize: 14, color: "#1C312370", lineHeight: 1.6, marginBottom: 32 }}>Your password has been updated successfully.</p>
          <button onClick={() => router.push("/screens/LoginScreen")} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Back to login</button>
        </div>
      )}
    </main>
  );
}