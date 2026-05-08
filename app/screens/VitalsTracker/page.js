"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function VitalsTracker() {
  const [vitals, setVitals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const q = query(collection(db, "vitals"), where("userId", "==", u.uid), orderBy("createdAt", "desc"), limit(10));
    return onSnapshot(q, snap => setVitals(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const latest = vitals[0];

  const vitalCards = [
    { icon: "🩸", label: "Blood pressure", value: latest?.bp, unit: "mmHg", normal: "120/80", key: "bp", color: "#fef2f2", text: "#be123c" },
    { icon: "💓", label: "Heart rate", value: latest?.hr ? `${latest.hr}` : null, unit: "bpm", normal: "60–100", key: "hr", color: "#fce7f3", text: "#9d174d" },
    { icon: "🍬", label: "Blood sugar", value: latest?.sugar ? `${latest.sugar}` : null, unit: "mg/dL", normal: "70–130", key: "sugar", color: "#fef3c7", text: "#92400e" },
    { icon: "⚖️", label: "Weight", value: latest?.weight ? `${latest.weight}` : null, unit: "kg", normal: "—", key: "weight", color: "#e0f2fe", text: "#0369a1" },
    { icon: "🌡️", label: "Temperature", value: latest?.temp ? `${latest.temp}` : null, unit: "°C", normal: "36.5–37.5", key: "temp", color: "#dcfce7", text: "#166534" },
  ];

  return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F0EDE8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(160deg, #1C3123 0%, #2d5a3d 100%)", padding: "52px 24px 24px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>❤️ Health Vitals</h1>
        <p style={{ fontSize: 14, color: "#F5F2ED70", margin: "0 0 16px" }}>
          {latest ? `Last updated: ${latest.createdAt?.toDate?.().toLocaleDateString("en-PK") || "Today"}` : "No readings yet — log your first one"}
        </p>
        <button onClick={() => router.push("/screens/AddVitals")}
          style={{ width: "100%", padding: "14px 0", background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          + Log new reading
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Current readings */}
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 12px" }}>Current readings</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {vitalCards.filter(v => v.value).map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>{v.icon}</div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 2px" }}>{v.value} <span style={{ fontSize: 12, fontWeight: 400, color: "#1C312260" }}>{v.unit}</span></p>
              <p style={{ fontSize: 13, color: "#1C312270", margin: "0 0 6px" }}>{v.label}</p>
              <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>Normal: {v.normal}</p>
            </div>
          ))}
          {!latest && (
            <div style={{ gridColumn: "1 / -1", background: "#fff", borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid #1C312210" }}>
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>❤️</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#1C3123", margin: "0 0 6px" }}>No readings yet</p>
              <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Tap the button above to log your first reading</p>
            </div>
          )}
        </div>

        {/* History */}
        {vitals.length > 0 && (
          <>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 12px" }}>Reading history</p>
            {vitals.map((v, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 10, border: "1px solid #1C312210" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: 0 }}>{v.createdAt?.toDate?.().toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" }) || "Today"}</p>
                  <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>✓ Logged</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {v.bp && <span style={{ background: "#fef2f2", color: "#be123c", fontSize: 12, padding: "5px 12px", borderRadius: 10, fontWeight: 600 }}>🩸 {v.bp}</span>}
                  {v.hr && <span style={{ background: "#fce7f3", color: "#9d174d", fontSize: 12, padding: "5px 12px", borderRadius: 10, fontWeight: 600 }}>💓 {v.hr} bpm</span>}
                  {v.sugar && <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 12, padding: "5px 12px", borderRadius: 10, fontWeight: 600 }}>🍬 {v.sugar} mg</span>}
                  {v.weight && <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 12, padding: "5px 12px", borderRadius: 10, fontWeight: 600 }}>⚖️ {v.weight} kg</span>}
                  {v.temp && <span style={{ background: "#dcfce7", color: "#166534", fontSize: 12, padding: "5px 12px", borderRadius: 10, fontWeight: 600 }}>🌡️ {v.temp}°C</span>}
                </div>
                {v.notes && <p style={{ fontSize: 12, color: "#1C312260", margin: "10px 0 0", padding: "8px 12px", background: "#F0EDE8", borderRadius: 10 }}>📝 {v.notes}</p>}
              </div>
            ))}
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}