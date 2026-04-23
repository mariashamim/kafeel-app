"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const tasks = [
    { title: "Visit Ahmed Khan", time: "Today · 10:00 AM", location: "North Nazimabad", status: "Upcoming" },
    { title: "Medication delivery", time: "Today · 2:00 PM", location: "Gulshan-e-Iqbal", status: "Upcoming" },
    { title: "Weekly checkup assist", time: "Tomorrow · 9:00 AM", location: "PECHS", status: "Scheduled" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Volunteer 🤝</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{profile?.name || "Welcome"}</h1>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "4px 0 0" }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[["12", "Total tasks"], ["8", "Completed"], ["4", "Upcoming"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Your tasks</p>
        {tasks.map((task, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>{task.title}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>🕐 {task.time}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>📍 {task.location}</p>
              </div>
              <span style={{ background: "#1C312215", color: "#1C3123", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>{task.status}</span>
            </div>
            <button style={{ width: "100%", marginTop: 12, padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Mark as complete ✓
            </button>
          </div>
        ))}

        <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 8px" }}>🌟 Your impact</p>
          <p style={{ fontSize: 13, color: "#1C312270", margin: "0 0 4px" }}>Elderly helped: <strong>24</strong></p>
          <p style={{ fontSize: 13, color: "#1C312270", margin: "0 0 4px" }}>Hours volunteered: <strong>86</strong></p>
          <p style={{ fontSize: 13, color: "#1C312270", margin: 0 }}>Tasks completed: <strong>8</strong></p>
        </div>
      </div>
    </main>
  );
}