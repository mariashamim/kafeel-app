"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function MedicationHistory() {
  const [meds, setMeds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "medications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setMeds(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const done = meds.filter(m => m.status === "Done").length;
  const missed = meds.filter(m => m.status === "Due").length;

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 12 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 16px" }}>Medication history</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#F5F2ED15", borderRadius: 14, padding: 14 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{done}</p>
            <p style={{ fontSize: 11, color: "#F5F2ED70", margin: "3px 0 0" }}>Taken</p>
          </div>
          <div style={{ background: "#F5F2ED15", borderRadius: 14, padding: 14 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{missed}</p>
            <p style={{ fontSize: 11, color: "#F5F2ED70", margin: "3px 0 0" }}>Missed</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {meds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>📋</p>
            <p style={{ fontSize: 15, color: "#1C312260" }}>No history yet</p>
          </div>
        ) : meds.map((med, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#1C3123" }}>{med.name}</p>
              <p style={{ fontSize: 12, color: "#1C312260", margin: "3px 0 0" }}>{med.dose} · {med.time}</p>
            </div>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600, background: med.status === "Done" ? "#dcfce7" : "#fef3c7", color: med.status === "Done" ? "#166534" : "#92400e" }}>{med.status}</span>
          </div>
        ))}
      </div>
      <BottomNav />
    </main>
  );
}