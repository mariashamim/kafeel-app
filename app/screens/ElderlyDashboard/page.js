"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function ElderlyDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [meds, setMeds] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) { router.push("/screens/LoginScreen"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "profiles", u.uid));
      if (snap.exists()) setProfile(snap.data());

      // Real-time medications
      const medQ = query(collection(db, "medications"), where("userId", "==", u.uid));
      onSnapshot(medQ, s => setMeds(s.docs.map(d => ({ id: d.id, ...d.data() }))));

      // Latest vitals
      const vitQ = query(collection(db, "vitals"), where("userId", "==", u.uid), orderBy("createdAt", "desc"), limit(1));
      onSnapshot(vitQ, s => { if (!s.empty) setVitals({ id: s.docs[0].id, ...s.docs[0].data() }); });

      setLoading(false);
    });
    return () => unsub();
  }, []);

  const pendingMeds = meds.filter(m => m.status === "Due").length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name?.split(" ")[0] || "there";

  if (loading) return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <img src="/logo.png" width={100} style={{ opacity: 0.7 }} />
      <p style={{ color: "#F5F2ED80", fontFamily: "sans-serif", fontSize: 14 }}>Loading your care dashboard...</p>
    </main>
  );

  return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F0EDE8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1C3123 0%, #2d5a3d 100%)", padding: "52px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "#ffffff06" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "#ffffff04" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative" }}>
          <div>
            <p style={{ fontSize: 14, color: "#F5F2ED80", margin: "0 0 4px", letterSpacing: 0.3 }}>{greeting} 👋</p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#F5F2ED", margin: "0 0 2px", letterSpacing: -0.5 }}>{firstName}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <img src="/logo.png" width={16} style={{ opacity: 0.6 }} />
              <p style={{ fontSize: 12, color: "#F5F2ED50", margin: 0 }}>Kafeel · Elderly care</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/screens/MoodCheckIn")}
              style={{ width: 44, height: 44, borderRadius: 14, background: "#F5F2ED15", border: "1px solid #F5F2ED20", color: "#F5F2ED", fontSize: 20, cursor: "pointer" }}>😊</button>
            <button onClick={() => signOut(auth).then(() => router.push("/"))}
              style={{ width: 44, height: 44, borderRadius: 14, background: "#F5F2ED15", border: "1px solid #F5F2ED20", color: "#F5F2ED", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Out</button>
          </div>
        </div>

        {/* Health summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, position: "relative" }}>
          {[
            { icon: "💊", value: pendingMeds, label: "Meds due", alert: pendingMeds > 0, route: "/screens/MedicationList" },
            { icon: "❤️", value: vitals?.bp || "—", label: "Blood pressure", alert: false, route: "/screens/VitalsTracker" },
            { icon: "🩸", value: vitals?.sugar || "—", label: "Blood sugar", alert: false, route: "/screens/VitalsTracker" },
          ].map((s, i) => (
            <button key={i} onClick={() => router.push(s.route)}
              style={{ background: s.alert ? "#ef444420" : "#F5F2ED12", borderRadius: 16, padding: "14px 10px", border: `1px solid ${s.alert ? "#ef444440" : "#F5F2ED15"}`, cursor: "pointer", textAlign: "center" }}>
              <p style={{ fontSize: 22, margin: "0 0 6px" }}>{s.icon}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: s.alert ? "#fca5a5" : "#F5F2ED", margin: "0 0 3px" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED60", margin: 0, lineHeight: 1.3 }}>{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SOS Banner */}
      <div style={{ padding: "16px 20px 0" }}>
        <button onClick={() => router.push("/screens/SOS")}
          style={{ width: "100%", background: "#ef4444", borderRadius: 20, padding: "18px 24px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px #ef444430" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#ffffff20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🚨</div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Emergency SOS</p>
              <p style={{ fontSize: 12, color: "#ffffff90", margin: 0 }}>Tap to call for immediate help</p>
            </div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ffffff25", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>›</div>
        </button>
      </div>

      {/* Today's medications */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: 0 }}>Today's medications</p>
          <button onClick={() => router.push("/screens/MedicationList")} style={{ fontSize: 13, color: "#1C3123", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>See all →</button>
        </div>

        {meds.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #1C312210", textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>✅</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>All done for today!</p>
            <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>No medications pending</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meds.slice(0, 3).map((med, i) => {
              const statusStyle = { Done: { bg: "#dcfce7", color: "#166534", label: "✓ Taken" }, Due: { bg: "#fef3c7", color: "#92400e", label: "⏰ Due now" }, Later: { bg: "#f1f5f9", color: "#64748b", label: "🕐 Later" } };
              const s = statusStyle[med.status] || statusStyle.Later;
              return (
                <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", border: `1px solid ${med.status === "Due" ? "#fde68a" : "#1C312210"}`, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>💊</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{med.name}</p>
                    <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{med.dose} · {med.time}</p>
                  </div>
                  <span style={{ background: s.bg, color: s.color, fontSize: 12, padding: "5px 12px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions - large accessible buttons */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 12px" }}>Quick access</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "🤖", label: "AI Assistant", sub: "Ask health questions", route: "/screens/AIAssistant", gradient: "linear-gradient(135deg, #1C3123, #2d5a3d)" },
            { icon: "🎙️", label: "Voice Control", sub: "Speak to the app", route: "/screens/VoiceCommand", gradient: "linear-gradient(135deg, #3C3489, #534AB7)" },
            { icon: "❤️", label: "Log Vitals", sub: "BP, sugar, weight", route: "/screens/AddVitals", gradient: "linear-gradient(135deg, #be123c, #e11d48)" },
            { icon: "🩺", label: "Appointments", sub: "Upcoming visits", route: "/screens/AppointmentsList", gradient: "linear-gradient(135deg, #0C447C, #1d6fa4)" },
            { icon: "🏡", label: "Find Shelter", sub: "Nearby care homes", route: "/screens/ShelterLocator", gradient: "linear-gradient(135deg, #633806, #92400e)" },
            { icon: "🕌", label: "Prayer Times", sub: "Azan & duas", route: "/screens/PrayerTimes", gradient: "linear-gradient(135deg, #085041, #0f6e58)" },
            { icon: "😊", label: "Mood Check-in", sub: "How are you today?", route: "/screens/MoodCheckIn", gradient: "linear-gradient(135deg, #854F0B, #ca7a14)" },
            { icon: "🆘", label: "ICE Card", sub: "Emergency info", route: "/screens/ICECard", gradient: "linear-gradient(135deg, #7f1d1d, #b91c1c)" },
          ].map((item, i) => (
            <button key={i} onClick={() => router.push(item.route)}
              style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left", transition: "transform 0.1s" }}>
              <div style={{ width: 48, height: 48, borderRadius: 15, background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>{item.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 3px", lineHeight: 1.2 }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0, lineHeight: 1.3 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Latest vitals */}
      {vitals && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: 0 }}>Latest vitals</p>
            <button onClick={() => router.push("/screens/VitalsTracker")} style={{ fontSize: 13, color: "#1C3123", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>History →</button>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                ["🩸", "Blood pressure", vitals.bp || "—"],
                ["💓", "Heart rate", vitals.hr ? `${vitals.hr} bpm` : "—"],
                ["🍬", "Blood sugar", vitals.sugar ? `${vitals.sugar} mg` : "—"],
                ["⚖️", "Weight", vitals.weight ? `${vitals.weight} kg` : "—"],
                ["🌡️", "Temperature", vitals.temp ? `${vitals.temp}°C` : "—"],
              ].filter(([, , v]) => v !== "—").map(([icon, label, val]) => (
                <div key={label} style={{ textAlign: "center", background: "#F0EDE8", borderRadius: 14, padding: "12px 8px" }}>
                  <p style={{ fontSize: 20, margin: "0 0 6px" }}>{icon}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>{val}</p>
                  <p style={{ fontSize: 10, color: "#1C312260", margin: 0, lineHeight: 1.3 }}>{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/screens/AddVitals")} style={{ width: "100%", padding: "12px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 14 }}>
              + Log new reading
            </button>
          </div>
        </div>
      )}

      <ElderlyNav />
    </main>
  );
}