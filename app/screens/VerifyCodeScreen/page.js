"use client";
import { useState } from "react";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";

export default function VerifyCodeScreen() {
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const goToDashboard = async () => {
    setChecking(true);
    // Skip verification - go directly to dashboard
    router.push("/screens/Dashboard");
    setChecking(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>

      <div style={{ width: 72, height: 72, background: "#1C312315", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 20 }}>✅</div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Account created!</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 28px", lineHeight: 1.6 }}>
        Your account has been successfully created.
      </p>

      <button onClick={goToDashboard} disabled={checking} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
        {checking ? "Loading..." : "Continue to Dashboard →"}
      </button>
    </main>
  );
}