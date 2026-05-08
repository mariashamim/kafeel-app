"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function SOS() {
  const [contacts, setContacts] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDocs(query(collection(db, "emergencyContacts"), where("userId", "==", u.uid))).then(snap => setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const handleSOS = () => {
    setPressed(true);
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        if (contacts[0]) window.location.href = `tel:${contacts[0].phone}`;
        else window.location.href = "tel:1122";
      } else setCountdown(count);
    }, 1000);
  };

  return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: pressed ? "#fef2f2" : "#F0EDE8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", paddingBottom: 100, transition: "background 0.3s" }}>
      <div style={{ background: "linear-gradient(160deg, #1C3123, #2d5a3d)", padding: "52px 24px 24px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🚨 Emergency SOS</h1>
        <p style={{ fontSize: 14, color: "#F5F2ED70", margin: 0 }}>Press the button below to call for help</p>
      </div>

      <div style={{ padding: "32px 24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Big SOS button */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          {pressed && (
            <>
              <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: "#ef444415", animation: "pulse 1s infinite" }} />
              <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "#ef444425" }} />
            </>
          )}
          <button onClick={handleSOS}
            style={{ width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(145deg, #ef4444, #dc2626)", color: "#fff", border: "6px solid #fecaca", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px #ef444450, inset 0 2px 4px #ffffff20", transition: "transform 0.1s" }}>
            {countdown ? (
              <>
                <p style={{ fontSize: 64, fontWeight: 700, margin: 0, lineHeight: 1 }}>{countdown}</p>
                <p style={{ fontSize: 14, color: "#ffffff90", margin: "4px 0 0" }}>Calling...</p>
              </>
            ) : (
              <>
                <span style={{ fontSize: 52 }}>🆘</span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 0" }}>SOS</p>
              </>
            )}
          </button>
        </div>

        <p style={{ fontSize: 15, color: "#1C312270", textAlign: "center", margin: "0 0 8px", fontWeight: 500 }}>
          {contacts[0] ? `Will call ${contacts[0].name}` : "Will call 1122 (Emergency)"}
        </p>
        {countdown && <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, margin: 0 }}>Calling in {countdown} seconds...</p>}

        {/* Emergency number */}
        <a href="tel:1122" style={{ marginTop: 16, padding: "14px 32px", background: "#ef4444", color: "#fff", borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: "none", display: "block" }}>
          📞 Call 1122 directly
        </a>
      </div>

      {/* Quick call contacts */}
      <div style={{ padding: "24px 20px 0" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 12px" }}>Quick call contacts</p>
        {contacts.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, textAlign: "center", border: "1px solid #1C312210" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>📞</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1C3123", margin: "0 0 6px" }}>No contacts saved</p>
            <button onClick={() => router.push("/screens/AddEmergencyContact")}
              style={{ padding: "12px 24px", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              + Add emergency contact
            </button>
          </div>
        ) : contacts.map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", marginBottom: 12, border: "1px solid #1C312210", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 17, background: "#1C312215", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
              {c.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>{c.name}</p>
              <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{c.relationship} · {c.phone}</p>
            </div>
            <a href={`tel:${c.phone}`}
              style={{ width: 52, height: 52, borderRadius: 16, background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, textDecoration: "none" }}>📞</a>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:0.7} }`}</style>
      <ElderlyNav />
    </main>
  );
}