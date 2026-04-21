"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function CaregiverDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) setUser(u);
      else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const patients = [
    { name: "Ahmed Khan", age: 72, status: "Stable", meds: 2, initials: "AK", color: "#dcfce7", text: "#166534" },
    { name: "Fatima Raza", age: 68, status: "Needs attention", meds: 1, initials: "FR", color: "#fef3c7", text: "#92400e" },
    { name: "Tariq Mehmood", age: 75, status: "Stable", meds: 3, initials: "TM", color: "#dcfce7", text: "#166534" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Caregiver view 🧑‍⚕️</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>My Patients</h1>
        <p style={{ fontSize: 12, color: "#F5F2ED60", margin: "4px 0 0" }}>{user?.email}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[["3", "Patients"], ["6", "Meds due"], ["1", "Alert"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Assigned patients</p>
        {patients.map((p, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 15, background: "#1C312215", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1C3123" }}>{p.name}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>Age {p.age} · {p.meds} meds today</p>
              </div>
              <span style={{ background: p.color, color: p.text, fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </main>
  );
}