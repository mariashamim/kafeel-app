"use client";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px 32px" }}>
        <div style={{ width: 120, height: 120, background: "#F5F2ED15", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, marginBottom: 32, border: "1px solid #F5F2ED20" }}>🌿</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#F5F2ED", margin: "0 0 12px", textAlign: "center", lineHeight: 1.2 }}>Care made simple</h1>
        <p style={{ fontSize: 15, color: "#F5F2ED90", textAlign: "center", lineHeight: 1.6, margin: 0 }}>Kafeel helps families keep their elderly loved ones safe, healthy, and connected.</p>
      </div>
      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => router.push("/screens/RoleSelectionScreen")} style={{ width: "100%", padding: 16, background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Get started
        </button>
        <button onClick={() => router.push("/screens/LoginScreen")} style={{ width: "100%", padding: 16, background: "transparent", color: "#F5F2ED", border: "1.5px solid #F5F2ED40", borderRadius: 16, fontSize: 16, fontWeight: 500, cursor: "pointer" }}>
          I already have an account
        </button>
      </div>
    </main>
  );
}