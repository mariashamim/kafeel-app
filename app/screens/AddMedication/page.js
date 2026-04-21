"use client";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddMedication() {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = async () => {
    if (!name || !dose || !time) return setError("Please fill in name, dose and time.");
    setLoading(true);
    try {
      await addDoc(collection(db, "medications"), {
        userId: auth.currentUser.uid,
        name, dose, time, frequency, notes,
        status: "Due",
        createdAt: serverTimestamp()
      });
      router.push("/screens/MedicationList");
    } catch (e) { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Add medication</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Fill in the details below</p>

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        {[["Medication name", "text", "e.g. Aspirin", name, setName], ["Dose", "text", "e.g. 75mg", dose, setDose], ["Time", "time", "", time, setTime]].map(([label, type, ph, val, set]) => (
          <div key={label}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
            <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}

        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Frequency</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {["Daily", "Twice daily", "Weekly", "As needed"].map(f => (
            <button key={f} onClick={() => setFrequency(f)} style={{ padding: "7px 14px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: frequency === f ? "#1C3123" : "#F5F2ED", color: frequency === f ? "#F5F2ED" : "#1C312270" }}>{f}</button>
          ))}
        </div>

        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Take with food" rows={3}
          style={{ ...inp, resize: "none", marginBottom: 0 }} />
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Saving..." : "Save medication"}
      </button>
    </main>
  );
}