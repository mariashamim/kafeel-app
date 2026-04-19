"use client";
import { useState } from "react";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = async () => {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // SKIP EMAIL VERIFICATION CHECK - Direct login
      router.push("/screens/Dashboard");
    } catch (e) {
      setError("Incorrect email or password.");
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Welcome back</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 28px" }}>Log in to your Kafeel account</p>
      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Email address</label>
        <input style={inp} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Password</label>
        <input style={{ ...inp, marginBottom: 0 }} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <span onClick={() => router.push("/screens/ForgetPasswordScreen")} style={{ fontSize: 13, color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Logging in..." : "Log in"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#1C312370" }}>Don't have an account? <span onClick={() => router.push("/screens/RoleSelectionScreen")} style={{ color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Sign up</span></p>
    </main>
  );
}