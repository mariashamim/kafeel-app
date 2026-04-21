"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function HealthReports() {
  const [vitals, setVitals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "vitals"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(10));
    const unsub = onSnapshot(q, snap => setVitals(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const avg = (field) => {
    const vals = vitals.map(v => parseFloat(v[field])).filter(v => !isNaN(v));
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "--";
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 12 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Health reports 📊</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Last {vitals.length} readings</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Averages</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[["💓", "Heart rate", `${avg("hr")} bpm`], ["🍬", "Blood sugar", `${avg("sugar")} mg`], ["⚖️", "Weight", `${avg("weight")} kg`]].map(([icon, label, val]) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #1C312210", textAlign: "center" }}>
              <p style={{ fontSize: 22, margin: "0 0 6px" }}>{icon}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1C3123", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#1C312260", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Reading history</p>
        {vitals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>📊</p>
            <p style={{ fontSize: 15, color: "#1C312260" }}>No data yet</p>
          </div>
        ) : vitals.map((v, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#1C3123", margin: "0 0 6px" }}>{v.createdAt?.toDate?.().toLocaleDateString() || "Today"}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {v.bp && <span style={{ fontSize: 11, color: "#1C312270" }}>BP: <strong>{v.bp}</strong></span>}
              {v.hr && <span style={{ fontSize: 11, color: "#1C312270" }}>HR: <strong>{v.hr}</strong></span>}
              {v.sugar && <span style={{ fontSize: 11, color: "#1C312270" }}>Sugar: <strong>{v.sugar}</strong></span>}
              {v.weight && <span style={{ fontSize: 11, color: "#1C312270" }}>Weight: <strong>{v.weight}kg</strong></span>}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </main>
  );
}