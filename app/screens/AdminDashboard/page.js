"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, medications: 0, appointments: 0, contacts: 0 });
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const [profiles, meds, apts, contacts] = await Promise.all([
          getDocs(collection(db, "profiles")),
          getDocs(collection(db, "medications")),
          getDocs(collection(db, "appointments")),
          getDocs(collection(db, "emergencyContacts")),
        ]);
        setStats({ users: profiles.size, medications: meds.size, appointments: apts.size, contacts: contacts.size });
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const actions = [
    { icon: "👥", label: "Manage users", sub: `${stats.users} total users`, color: "#EEEDFE", text: "#3C3489" },
    { icon: "💊", label: "Medications", sub: `${stats.medications} records`, color: "#E1F5EE", text: "#085041" },
    { icon: "🩺", label: "Appointments", sub: `${stats.appointments} scheduled`, color: "#E6F1FB", text: "#0C447C" },
    { icon: "🏡", label: "Manage shelters", sub: "5 shelters listed", color: "#FAEEDA", text: "#633806" },
    { icon: "💛", label: "Donations", sub: "View all campaigns", color: "#FAEEDA", text: "#854F0B" },
    { icon: "🤝", label: "Volunteers", sub: "Active volunteers", color: "#EAF3DE", text: "#3B6D11" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Admin panel 🛡️</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Kafeel Admin</h1>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "4px 0 0" }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[[stats.users, "Users"], [stats.medications, "Meds"], [stats.appointments, "Appts"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Admin controls</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {actions.map((a, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{a.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{a.label}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{a.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginTop: 16, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 12px" }}>⚠️ Recent alerts</p>
          {[["New user registered", "2 min ago"], ["Low shelter availability", "1 hr ago"], ["Donation received", "3 hrs ago"]].map(([msg, time], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < 2 ? 10 : 0, marginBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
              <p style={{ fontSize: 13, color: "#1C3123", margin: 0 }}>{msg}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0, flexShrink: 0 }}>{time}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}