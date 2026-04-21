"use client";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, background: "#1C3123", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px" }}>🌿</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Kafeel</h1>
        <p style={{ fontSize: 14, color: "#1C312260", margin: 0 }}>Version 1.0.0</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1C3123", margin: "0 0 10px" }}>About this app</h2>
        <p style={{ fontSize: 14, color: "#1C312270", lineHeight: 1.7, margin: 0 }}>
          Kafeel is an elderly care companion app designed to help families and caregivers manage medications, track health vitals, schedule appointments, and respond to emergencies quickly and easily.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210" }}>
        {[["🎯", "Mission", "Making elderly care simple and accessible for every family"], ["🔒", "Privacy", "Your health data is private and securely stored"], ["📧", "Contact", "support@kafeel.app"], ["⚖️", "License", "MIT License · Open source"]].map(([icon, title, val], i, arr) => (
          <div key={i} style={{ padding: "15px 18px", borderBottom: i < arr.length - 1 ? "1px solid #1C312208" : "none" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{title}</p>
                <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}