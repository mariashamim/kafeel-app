"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "appointments"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Appointments 🩺</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{appointments.length} scheduled</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🩺</p>
            <p style={{ fontSize: 15, color: "#1C312260", fontWeight: 500 }}>No appointments yet</p>
            <p style={{ fontSize: 13, color: "#1C312240" }}>Tap + to add one</p>
          </div>
        ) : appointments.map((apt, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, background: "#1C312215", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🩺</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1C3123" }}>{apt.doctor}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "3px 0 0" }}>{apt.date} · {apt.time}</p>
                {apt.notes && <p style={{ fontSize: 12, color: "#1C312250", margin: "3px 0 0" }}>{apt.notes}</p>}
              </div>
              <span style={{ background: "#1C312215", color: "#1C3123", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>Upcoming</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/screens/AddAppointment")}
        style={{ position: "fixed", bottom: 88, right: "calc(50% - 175px)", width: 52, height: 52, borderRadius: "50%", background: "#1C3123", color: "#F5F2ED", border: "none", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #1C312340" }}>
        +
      </button>
      <BottomNav />
    </main>
  );
}