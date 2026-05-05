"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import VolunteerNav from "../../components/VolunteerNav";

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

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 6px" }}>Volunteer Dashboard 🤝</p>
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
          {[["86", "Hours"], ["24", "Helped"], ["8", "Tasks done"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's tasks</p>
        {[
          { title: "Visit Ahmed Khan", time: "10:00 AM", location: "North Nazimabad" },
          { title: "Medication delivery", time: "2:00 PM", location: "Gulshan" },
        ].map((t, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>{t.title}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>🕐 {t.time} · 📍 {t.location}</p>
              </div>
              <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, height: "fit-content" }}>Upcoming</span>
            </div>
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          {[
            { icon: "🗂️", label: "My Tasks", route: "/screens/VolunteerTasks", color: "#E6F1FB" },
            { icon: "🔍", label: "Explore", route: "/screens/VolunteerExplore", color: "#E1F5EE" },
            { icon: "🌟", label: "My Impact", route: "/screens/VolunteerImpact", color: "#FAEEDA" },
            { icon: "👤", label: "Profile", route: "/screens/VolunteerProfile", color: "#EEEDFE" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.route)}
              style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>
      <VolunteerNav />
    </main>
  );
}