"use client";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddAppointment() {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = async () => {
    if (!doctor || !date || !time) return setError("Please fill in doctor, date and time.");
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        doctor, date, time, location, notes,
        createdAt: serverTimestamp()
      });
      router.push("/screens/AppointmentsList");
    } catch (e) { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Add appointment</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Schedule a new visit</p>

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        {[["Doctor name", "text", "e.g. Dr. Khalid", doctor, setDoctor], ["Date", "date", "", date, setDate], ["Time", "time", "", time, setTime], ["Location (optional)", "text", "e.g. City Hospital", location, setLocation]].map(([label, type, ph, val, set]) => (
          <div key={label}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
            <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Bring previous reports" rows={3} style={{ ...inp, resize: "none", marginBottom: 0 }} />
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Saving..." : "Save appointment"}
      </button>
    </main>
  );
}