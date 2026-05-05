"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminNav from "../../components/AdminNav";

export default function AdminMedications() {
  const [meds, setMeds] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [apts, setApts] = useState([]);
  const [tab, setTab] = useState("meds");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "medications")),
      getDocs(collection(db, "vitals")),
      getDocs(collection(db, "appointments")),
    ]).then(([m, v, a]) => {
      setMeds(m.docs.map(d => ({ id: d.id, ...d.data() })));
      setVitals(v.docs.map(d => ({ id: d.id, ...d.data() })));
      setApts(a.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const statusColors = { Done: { bg: "#dcfce7", color: "#166534" }, Due: { bg: "#fef3c7", color: "#92400e" }, Later: { bg: "#f3f4f6", color: "#6b7280" } };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🏥 Health Records</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>All user health data</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[[meds.length, "💊", "Medications"], [vitals.length, "❤️", "Vitals"], [apts.length, "🩺", "Appointments"]].map(([val, icon, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 16, margin: "0 0 4px" }}>{icon}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 9, color: "#F5F2ED60", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "60vh" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["meds", "💊 Medications"], ["vitals", "❤️ Vitals"], ["apts", "🩺 Appointments"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "9px 0", borderRadius: 12, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: tab === id ? "#1C3123" : "#fff", color: tab === id ? "#F5F2ED" : "#1C312270" }}>{label}</button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>Loading...</p> : (
          <>
            {tab === "meds" && (meds.length === 0 ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>No medications</p>
              : meds.map((m, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{m.name}</p>
                      <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 3px" }}>💊 {m.dose} · 🕐 {m.time}</p>
                      <p style={{ fontSize: 11, color: "#1C312250", margin: "0 0 3px" }}>Frequency: {m.frequency}</p>
                      <p style={{ fontSize: 10, color: "#1C312240", margin: 0 }}>User: {m.userId?.slice(0, 12)}...</p>
                    </div>
                    <span style={{ background: statusColors[m.status]?.bg || "#f3f4f6", color: statusColors[m.status]?.color || "#6b7280", fontSize: 11, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>{m.status}</span>
                  </div>
                  {m.notes && <p style={{ fontSize: 12, color: "#1C312260", margin: "8px 0 0", background: "#F5F2ED", padding: "6px 10px", borderRadius: 8 }}>📝 {m.notes}</p>}
                </div>
              )))}

            {tab === "vitals" && (vitals.length === 0 ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>No vitals logged</p>
              : vitals.map((v, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{v.createdAt?.toDate?.().toLocaleDateString() || "Today"}</p>
                    <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>Logged</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    {v.bp && <span style={{ background: "#F5F2ED", padding: "4px 8px", borderRadius: 8, fontSize: 12, color: "#1C3123" }}>🩸 BP: <strong>{v.bp}</strong></span>}
                    {v.hr && <span style={{ background: "#F5F2ED", padding: "4px 8px", borderRadius: 8, fontSize: 12, color: "#1C3123" }}>💓 HR: <strong>{v.hr} bpm</strong></span>}
                    {v.sugar && <span style={{ background: "#F5F2ED", padding: "4px 8px", borderRadius: 8, fontSize: 12, color: "#1C3123" }}>🍬 Sugar: <strong>{v.sugar}</strong></span>}
                    {v.weight && <span style={{ background: "#F5F2ED", padding: "4px 8px", borderRadius: 8, fontSize: 12, color: "#1C3123" }}>⚖️ Weight: <strong>{v.weight}kg</strong></span>}
                    {v.temp && <span style={{ background: "#F5F2ED", padding: "4px 8px", borderRadius: 8, fontSize: 12, color: "#1C3123" }}>🌡️ Temp: <strong>{v.temp}°C</strong></span>}
                  </div>
                  <p style={{ fontSize: 10, color: "#1C312240", margin: 0 }}>User: {v.userId?.slice(0, 12)}...</p>
                </div>
              )))}

            {tab === "apts" && (apts.length === 0 ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>No appointments</p>
              : apts.map((a, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>🩺 {a.doctor}</p>
                      <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 3px" }}>📅 {a.date} · 🕐 {a.time}</p>
                      {a.location && <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 3px" }}>📍 {a.location}</p>}
                      <p style={{ fontSize: 10, color: "#1C312240", margin: 0 }}>User: {a.userId?.slice(0, 12)}...</p>
                    </div>
                    <span style={{ background: "#1C312215", color: "#1C3123", fontSize: 11, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>Upcoming</span>
                  </div>
                  {a.notes && <p style={{ fontSize: 12, color: "#1C312260", margin: "8px 0 0", background: "#F5F2ED", padding: "6px 10px", borderRadius: 8 }}>📝 {a.notes}</p>}
                </div>
              )))}
          </>
        )}
      </div>
      <AdminNav />
    </main>
  );
}