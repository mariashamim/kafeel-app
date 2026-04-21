"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function Profile() {
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

  const menuItems = [
    { icon: "✏️", label: "Edit profile", route: "/screens/EditProfile" },
    { icon: "🩺", label: "Appointments", route: "/screens/AppointmentsList" },
    { icon: "📋", label: "Medication history", route: "/screens/MedicationHistory" },
    { icon: "📊", label: "Health reports", route: "/screens/HealthReports" },
    { icon: "⚙️", label: "Settings", route: "/screens/Settings" },
    { icon: "ℹ️", label: "About Kafeel", route: "/screens/About" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 32px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5F2ED", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, margin: "0 auto 12px" }}>
          {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>{profile?.name || "Your name"}</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 6px" }}>{user?.email}</p>
        {profile?.role && <span style={{ background: "#F5F2ED20", color: "#F5F2ED", fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 500 }}>{profile.role}</span>}
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 12 }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={() => router.push(item.route)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", background: "none", border: "none", borderBottom: i < menuItems.length - 1 ? "1px solid #1C312208" : "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", flex: 1 }}>{item.label}</span>
              <span style={{ color: "#1C312240", fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>

        <button onClick={() => signOut(auth).then(() => router.push("/screens/LoginScreen"))}
          style={{ width: "100%", padding: 16, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Log out
        </button>
      </div>
      <BottomNav />
    </main>
  );
}