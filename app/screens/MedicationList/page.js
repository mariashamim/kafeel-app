"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function MedicationList() {
  const [meds, setMeds] = useState([]);
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "medications"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, snap => {
      setMeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filters = ["All", "Due", "Done", "Later"];
  const filtered = filter === "All" ? meds : meds.filter(m => m.status === filter);
  const statusStyle = { Done: { bg: "#dcfce7", color: "#166534" }, Due: { bg: "#fef3c7", color: "#92400e" }, Later: { bg: "#f3f4f6", color: "#6b7280" } };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 20px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Medications 💊</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{meds.length} medications total</p>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270" }}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>💊</p>
            <p style={{ fontSize: 15, color: "#1C312260", fontWeight: 500 }}>No medications yet</p>
            <p style={{ fontSize: 13, color: "#1C312240" }}>Tap + to add your first one</p>
          </div>
        ) : filtered.map((med, i) => (
          <div key={i} onClick={() => router.push(`/screens/MedicationDetail?id=${med.id}`)}
            style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 10, border: "1px solid #1C312210", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, background: statusStyle[med.status]?.bg || "#f3f4f6", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💊</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#1C3123" }}>{med.name}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "3px 0 0" }}>{med.dose} · {med.time}</p>
              </div>
            </div>
            <span style={{ background: statusStyle[med.status]?.bg || "#f3f4f6", color: statusStyle[med.status]?.color || "#6b7280", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>{med.status}</span>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/screens/AddMedication")}
        style={{ position: "fixed", bottom: 88, right: "calc(50% - 175px)", width: 52, height: 52, borderRadius: "50%", background: "#1C3123", color: "#F5F2ED", border: "none", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #1C312340" }}>
        +
      </button>
      <BottomNav />
    </main>
  );
}