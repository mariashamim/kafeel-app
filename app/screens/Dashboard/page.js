"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) setUser(u);
      else router.push("/screens/LoginScreen");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#F5F2ED", fontFamily: "sans-serif" }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Good morning 👋</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Kafeel</h1>
            <p style={{ fontSize: 12, color: "#F5F2ED60", margin: "4px 0 0" }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/screens/LoginScreen"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
            Log out
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
          <div style={{ background: "#F5F2ED15", borderRadius: 16, padding: 16 }}>
            <p style={{ fontSize: 12, color: "#F5F2ED80", margin: "0 0 6px" }}>💊 Medications</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>2</p>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "3px 0 0" }}>pending today</p>
          </div>
          <div style={{ background: "#F5F2ED15", borderRadius: 16, padding: 16 }}>
            <p style={{ fontSize: 12, color: "#F5F2ED80", margin: "0 0 6px" }}>❤️ Vitals</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Normal</p>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "3px 0 0" }}>last checked today</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Appointment */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 14, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Next appointment</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, background: "#1C312215", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🩺</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1C3123" }}>Dr. Khalid</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "3px 0 0" }}>Tomorrow · 10:00 AM</p>
              </div>
            </div>
            <span style={{ background: "#1C312215", color: "#1C3123", fontSize: 11, padding: "5px 10px", borderRadius: 999, fontWeight: 600 }}>Upcoming</span>
          </div>
        </div>

        {/* Medications */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 14, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's medications</p>
          {[
            { name: "Aspirin 75mg", time: "8:00 AM · With food", status: "Done", color: "#166534", bg: "#dcfce7" },
            { name: "Metformin 500mg", time: "1:00 PM · After lunch", status: "Due", color: "#92400e", bg: "#fef3c7" },
            { name: "Vitamin D", time: "8:00 PM · With dinner", status: "Later", color: "#6b7280", bg: "#f3f4f6" },
          ].map((med, i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, background: med.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#1C3123" }}>{med.name}</p>
                  <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>{med.time}</p>
                </div>
              </div>
              <span style={{ background: med.bg, color: med.color, fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>{med.status}</span>
            </div>
          ))}
        </div>

        {/* Emergency contacts */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 14, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Emergency contacts</p>
          {[
            { initials: "SA", name: "Sara (Daughter)", phone: "+92 300 1234567" },
            { initials: "DR", name: "Dr. Rashid", phone: "+92 21 9876543" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i === 0 ? 12 : 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "#1C312215", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{c.initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#1C3123" }}>{c.name}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>{c.phone}</p>
              </div>
              <button style={{ background: "#1C312215", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#1C3123", cursor: "pointer", fontWeight: 500 }}>📞 Call</button>
            </div>
          ))}
        </div>

        {/* Emergency button */}
        <button style={{ width: "100%", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 18, padding: "18px 0", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
          🚨 Emergency Call
        </button>
      </div>
    </main>
  );
}