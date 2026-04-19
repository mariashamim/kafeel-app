"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectionScreen() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const roles = [
    { id: "elderly", icon: "👴", title: "I am the patient", sub: "Manage my own health and medications" },
    { id: "caregiver", icon: "🧑‍⚕️", title: "I am a caregiver", sub: "I look after an elderly family member" },
    { id: "family", icon: "👨‍👩‍👧", title: "I am a family member", sub: "Stay updated on my loved one's health" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 8px" }}>Who are you?</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 32px" }}>Select your role to personalise your experience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
        {roles.map(role => (
          <div key={role.id} onClick={() => setSelected(role.id)} style={{ background: selected === role.id ? "#1C3123" : "#fff", borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: selected === role.id ? "2px solid #1C3123" : "1.5px solid #1C312215", transition: "all 0.2s" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: selected === role.id ? "#F5F2ED20" : "#F5F2ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{role.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px", color: selected === role.id ? "#F5F2ED" : "#1C3123" }}>{role.title}</p>
              <p style={{ fontSize: 12, margin: 0, color: selected === role.id ? "#F5F2ED80" : "#1C312270", lineHeight: 1.4 }}>{role.sub}</p>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selected === role.id ? "#F5F2ED" : "#1C312330"}`, background: selected === role.id ? "#F5F2ED" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {selected === role.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1C3123" }} />}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => selected && router.push("/screens/SignupScreen")} style={{ width: "100%", padding: 16, background: selected ? "#1C3123" : "#1C312240", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed" }}>
        Continue
      </button>
    </main>
  );
}