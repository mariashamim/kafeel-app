"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import CaregiverNav from "../../components/CaregiverNav";

export default function CaregiverDashboard() {
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

  const alerts = [
    { name: "Ahmed Khan", msg: "Missed morning medication", type: "warning" },
    { name: "Fatima Raza", msg: "Blood pressure reading high", type: "danger" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 6px" }}>Caregiver Dashboard 🧑‍⚕️</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
<img src="/logo.png" alt="Kafeel" width={32} height={32} style={{ objectFit: "contain" }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{profile?.name || "Welcome"}</h1>
            </div>
            <p style={{ fontSize: 11, color: "#F5F2ED50", margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))}
            style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>
            Log out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[["3", "Patients"], ["5", "Tasks today"], ["2", "⚠️ Alerts"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>⚠️ Active alerts</p>
        {alerts.map((a, i) => (
          <div key={i} style={{ background: a.type === "danger" ? "#fef2f2" : "#fffbeb", borderRadius: 16, padding: 14, marginBottom: 10, border: `1px solid ${a.type === "danger" ? "#fecaca" : "#fde68a"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{a.type === "danger" ? "🔴" : "🟡"}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: 0 }}>{a.name}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>{a.msg}</p>
              </div>
            </div>
          </div>
        ))}

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "16px 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Quick actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "👥", label: "My Patients", sub: "3 assigned", route: "/screens/PatientsList", color: "#E6F1FB" },
            { icon: "📋", label: "Today's Tasks", sub: "5 pending", route: "/screens/CaregiverTasks", color: "#E1F5EE" },
            { icon: "📅", label: "Schedule", sub: "View visits", route: "/screens/CaregiverSchedule", color: "#FAEEDA" },
            { icon: "👤", label: "My Profile", sub: "Edit info", route: "/screens/CaregiverProfile", color: "#EEEDFE" },
            { icon: "📋", label: "Activity Feed", sub: "Log care tasks", route: "/screens/ActivityFeed", color: "#E1F5EE" },
{ icon: "⭐", label: "My Ratings", sub: "View feedback", route: "/screens/RatingReview", color: "#FAEEDA" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.route)}
              style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>
      <CaregiverNav />
    </main>
  );
}