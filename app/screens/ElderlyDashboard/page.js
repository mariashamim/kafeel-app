"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function ElderlyDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [medCount, setMedCount] = useState(0);
  const [aptCount, setAptCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
        const meds = await getDocs(query(collection(db, "medications"), where("userId", "==", u.uid)));
        const apts = await getDocs(query(collection(db, "appointments"), where("userId", "==", u.uid)));
        setMedCount(meds.size);
        setAptCount(apts.size);
      } else router.push("/screens/LoginScreen");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center" }}>
<img src="/logo.png" alt="Kafeel" width={32} height={32} style={{ objectFit: "contain" }} />
    </main>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 6px" }}>{greeting} 👋</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
<img src="/logo.png" alt="Kafeel" width={32} height={32} style={{ objectFit: "contain" }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Kafeel</h1>
            </div>
            <p style={{ fontSize: 11, color: "#F5F2ED50", margin: 0 }}>{profile?.name || user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))}
            style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
            Log out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[[medCount, "💊", "Medications"], [aptCount, "🩺", "Appointments"], ["Normal", "❤️", "Vitals"]].map(([val, icon, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 16, padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 16, margin: "0 0 4px" }}>{icon}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED60", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Quick actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "🤖", label: "AI Assistant", sub: "Chat & get help", route: "/screens/AIAssistant", color: "#E1F5EE" },
{ icon: "🎙️", label: "Voice Control", sub: "Speak to app", route: "/screens/VoiceCommand", color: "#EEEDFE" },
{ icon: "😊", label: "Mood Check-in", sub: "How do you feel?", route: "/screens/MoodCheckIn", color: "#FAEEDA" },
{ icon: "🆘", label: "ICE Card", sub: "Emergency card", route: "/screens/ICECard", color: "#FCEBEB" },
{ icon: "🌡️", label: "Heat Alert", sub: "Karachi weather", route: "/screens/HeatwaveAlert", color: "#fff7ed" },
{ icon: "🕌", label: "Prayer Times", sub: "Azan & duas", route: "/screens/PrayerTimes", color: "#E6F1FB" },
{ icon: "💊", label: "Medications", sub: `${medCount} total`, route: "/screens/MedicationList", color: "#E6F1FB" },
{ icon: "🏡", label: "Find Shelters", sub: "Nearby homes", route: "/screens/ShelterLocator", color: "#FAEEDA" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.route)}
              style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{item.sub}</p>
            </button>
          ))}
        </div>

        <button onClick={() => router.push("/screens/SOS")}
          style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", borderRadius: 18, padding: "18px 0", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
          🚨 Emergency SOS — Call for help
        </button>
      </div>
      <ElderlyNav />
    </main>
  );
}