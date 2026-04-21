"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function VitalsTracker() {
  const [vitals, setVitals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "vitals"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, snap => setVitals(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const latest = vitals[0];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Vitals ❤️</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Track your health readings</p>
        {latest && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
            {[["🩸", "Blood pressure", latest.bp || "--"], ["💓", "Heart rate", latest.hr ? `${latest.hr} bpm` : "--"], ["🍬", "Blood sugar", latest.sugar ? `${latest.sugar} mg/dL` : "--"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
                <p style={{ fontSize: 18, margin: "0 0 4px" }}>{icon}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
                <p style={{ fontSize: 9, color: "#F5F2ED60", margin: "3px 0 0" }}>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Recent readings</p>
        {vitals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>❤️</p>
            <p style={{ fontSize: 15, color: "#1C312260", fontWeight: 500 }}>No readings yet</p>
            <p style={{ fontSize: 13, color: "#1C312240" }}>Tap + to log your first reading</p>
          </div>
        ) : vitals.map((v, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{v.createdAt?.toDate?.().toLocaleDateString() || "Today"}</p>
              <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>Logged</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {v.bp && <p style={{ fontSize: 12, color: "#1C312270", margin: 0 }}>BP: <strong>{v.bp}</strong></p>}
              {v.hr && <p style={{ fontSize: 12, color: "#1C312270", margin: 0 }}>HR: <strong>{v.hr} bpm</strong></p>}
              {v.sugar && <p style={{ fontSize: 12, color: "#1C312270", margin: 0 }}>Sugar: <strong>{v.sugar}</strong></p>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/screens/AddVitals")}
        style={{ position: "fixed", bottom: 88, right: "calc(50% - 175px)", width: 52, height: 52, borderRadius: "50%", background: "#1C3123", color: "#F5F2ED", border: "none", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #1C312340" }}>
        +
      </button>
      <BottomNav />
    </main>
  );
}