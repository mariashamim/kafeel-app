"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectionScreen() {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null);
  const router = useRouter();

  const roles = [
    { id: "elderly", icon: "👴", title: "Elderly user", sub: "Manage my health, medications & find shelters" },
    { id: "caregiver", icon: "🧑‍⚕️", title: "Caregiver", sub: "Look after elderly patients and track their health" },
    { id: "volunteer", icon: "🤝", title: "Volunteer", sub: "Help elderly individuals in my community" },
    { id: "donor", icon: "💛", title: "Donor", sub: "Support elderly care through donations" },
  ];

  // Welcome screen
  if (!mode) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px 32px" }}>
        <img src="/logo.png" alt="Kafeel" width={200} style={{ objectFit: "contain", marginBottom: 8 }} />

        <p style={{ fontSize: 15, color: "#F5F2ED80", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
          Elderly care made simple for families across Pakistan
        </p>
      </div>
      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => setMode("signup")}
          style={{ width: "100%", padding: 16, background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Sign up
        </button>
        <button onClick={() => setMode("login")}
          style={{ width: "100%", padding: 16, background: "transparent", color: "#F5F2ED", border: "1.5px solid #F5F2ED40", borderRadius: 16, fontSize: 16, fontWeight: 500, cursor: "pointer" }}>
          Already have an account
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#F5F2ED40", margin: "4px 0 0" }}>
          Admin? <span onClick={() => router.push("/screens/LoginScreen?role=admin")} style={{ color: "#F5F2ED70", cursor: "pointer", textDecoration: "underline" }}>Log in here</span>
        </p>
      </div>
    </main>
  );

  // Role selection
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => setMode(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Who are you?</h1>
        <p style={{ fontSize: 14, color: "#1C312380", margin: 0 }}>
          Select your role to {mode === "signup" ? "create an account" : "log in"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {roles.map(role => (
          <div key={role.id} onClick={() => setSelected(role.id)}
            style={{ background: selected === role.id ? "#1C3123" : "#fff", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: selected === role.id ? "2px solid #1C3123" : "1.5px solid #1C312215", transition: "all 0.2s" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: selected === role.id ? "#F5F2ED20" : "#F5F2ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{role.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 3px", color: selected === role.id ? "#F5F2ED" : "#1C3123" }}>{role.title}</p>
              <p style={{ fontSize: 11, margin: 0, color: selected === role.id ? "#F5F2ED80" : "#1C312260", lineHeight: 1.4 }}>{role.sub}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected === role.id ? "#F5F2ED" : "#1C312330"}`, background: selected === role.id ? "#F5F2ED" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {selected === role.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#1C3123" }} />}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (!selected) return;
          if (mode === "signup") router.push(`/screens/SignupScreen?role=${selected}`);
          else router.push(`/screens/LoginScreen?role=${selected}`);
        }}
        style={{ width: "100%", padding: 16, background: selected ? "#1C3123" : "#1C312240", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed" }}>
        Continue
      </button>
    </main>
  );
}