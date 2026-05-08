"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const q = query(collection(db, "appointments"), where("userId", "==", u.uid), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F0EDE8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(160deg, #1C3123, #2d5a3d)", padding: "52px 24px 24px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🩺 Appointments</h1>
        <p style={{ fontSize: 14, color: "#F5F2ED70", margin: "0 0 16px" }}>{appointments.length} scheduled</p>
        <button onClick={() => router.push("/screens/AddAppointment")}
          style={{ width: "100%", padding: "14px 0", background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          + Book new appointment
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {appointments.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid #1C312210" }}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🩺</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1C3123", margin: "0 0 8px" }}>No appointments yet</p>
            <p style={{ fontSize: 14, color: "#1C312260", margin: 0 }}>Tap the button above to book your first appointment</p>
          </div>
        ) : appointments.map((apt, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "18px 20px", marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🩺</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#1C3123", margin: "0 0 5px" }}>{apt.doctor}</p>
                <p style={{ fontSize: 14, color: "#1C312270", margin: "0 0 3px" }}>📅 {apt.date} · ⏰ {apt.time}</p>
                {apt.location && <p style={{ fontSize: 13, color: "#1C312260", margin: "0 0 3px" }}>📍 {apt.location}</p>}
                {apt.notes && <p style={{ fontSize: 12, color: "#1C312250", margin: "6px 0 0", padding: "6px 10px", background: "#F0EDE8", borderRadius: 8 }}>📝 {apt.notes}</p>}
              </div>
              <span style={{ background: "#E6F1FB", color: "#0C447C", fontSize: 11, padding: "5px 10px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" }}>Upcoming</span>
            </div>
          </div>
        ))}
      </div>
      <ElderlyNav />
    </main>
  );
}