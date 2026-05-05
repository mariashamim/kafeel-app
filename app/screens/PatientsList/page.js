"use client";
import { useRouter } from "next/navigation";
import CaregiverNav from "../../components/CaregiverNav";

const PATIENTS = [
  { name: "Ahmed Khan", age: 72, condition: "Diabetes, Hypertension", status: "Stable", initials: "AK", lastSeen: "Today" },
  { name: "Fatima Raza", age: 68, condition: "Heart condition", status: "Needs attention", initials: "FR", lastSeen: "Yesterday" },
  { name: "Tariq Mehmood", age: 75, condition: "Arthritis", status: "Stable", initials: "TM", lastSeen: "Today" },
];

export default function PatientsList() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>👥 My Patients</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{PATIENTS.length} patients assigned</p>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {PATIENTS.map((p, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "#1C312215", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{p.name}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>Age {p.age} · {p.condition}</p>
                <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>Last seen: {p.lastSeen}</p>
              </div>
              <span style={{ background: p.status === "Stable" ? "#dcfce7" : "#fef3c7", color: p.status === "Stable" ? "#166534" : "#92400e", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>{p.status}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "9px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📋 View records</button>
              <button style={{ flex: 1, padding: "9px 0", background: "#F5F2ED", color: "#1C3123", border: "1px solid #1C312215", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📝 Add note</button>
            </div>
          </div>
        ))}
      </div>
      <CaregiverNav />
    </main>
  );
}