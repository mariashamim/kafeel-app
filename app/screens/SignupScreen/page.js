"use client";
import { useState } from "react";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inp = {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    border: "1.5px solid #1C312215", fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12
  };

  const handle = async () => {
    setError("");
    if (!name || !email || !password || !confirm) return setError("Please fill in all fields.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      router.push("/screens/VerifyCodeScreen");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("This email is already registered.");
      else if (e.code === "auth/invalid-email") setError("Please enter a valid email address.");
      else setError(e.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Create account</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 28px" }}>Join Kafeel and start caring</p>

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        {[
          ["Full name", "text", "e.g. Ahmed Khan", name, setName],
          ["Email address", "email", "you@email.com", email, setEmail],
          ["Password", "password", "Min. 6 characters", password, setPassword],
          ["Confirm password", "password", "Repeat password", confirm, setConfirm]
        ].map(([label, type, ph, val, set], i, arr) => (
          <div key={label}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
            <input style={{ ...inp, marginBottom: i < arr.length - 1 ? 12 : 0 }} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12, paddingLeft: 4 }}>{error}</p>}

      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Creating account..." : "Sign up"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#1C312370" }}>
        Already have an account?{" "}
        <span onClick={() => router.push("/screens/LoginScreen")} style={{ color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Log in</span>
      </p>
    </main>
  );
}