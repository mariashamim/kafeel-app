"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

export default function MedicationDetail() {
  const [med, setMed] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "medications", id)).then(d => {
      if (d.exists()) setMed({ id: d.id, ...d.data() });
      setLoading(false);
    });
  }, [id]);

  const markAs = async (status) => {
    await updateDoc(doc(db, "medications", id), { status });
    setMed(prev => ({ ...prev, status }));
  };

  const deleteMed = async () => {
    await deleteDoc(doc(db, "medications", id));
    router.push("/screens/MedicationList");
  };

  const statusStyle = { Done: { bg: "#dcfce7", color: "#166534" }, Due: { bg: "#fef3c7", color: "#92400e" }, Later: { bg: "#f3f4f6", color: "#6b7280" } };

  if (loading) return <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></main>;

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>

      <div style={{ background: "#1C3123", borderRadius: 24, padding: 24, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 6px" }}>{med?.name}</h1>
        <span style={{ background: statusStyle[med?.status]?.bg, color: statusStyle[med?.status]?.color, fontSize: 12, padding: "4px 14px", borderRadius: 999, fontWeight: 600 }}>{med?.status}</span>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 16, border: "1px solid #1C312210" }}>
        {[["Dose", med?.dose], ["Time", med?.time], ["Frequency", med?.frequency], ["Notes", med?.notes || "None"]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: 0, textAlign: "right", maxWidth: "60%" }}>{val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {["Done", "Due", "Later"].map(s => (
          <button key={s} onClick={() => markAs(s)} style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: med?.status === s ? "#1C3123" : "#fff", color: med?.status === s ? "#F5F2ED" : "#1C3123" }}>{s}</button>
        ))}
      </div>

      <button onClick={deleteMed} style={{ width: "100%", padding: 14, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        Delete medication
      </button>
    </main>
  );
}