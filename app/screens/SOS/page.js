"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function SOS() {
  const [contacts, setContacts] = useState([]);
  const [pressed, setPressed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDocs(query(collection(db, "emergencyContacts"), where("userId", "==", user.uid))).then(snap => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Emergency SOS 🚨</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Call for help immediately</p>
      </div>

      <div style={{ padding: "24px 20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Big SOS button */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          {pressed && <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "#ef444430", animation: "pulse 1s infinite" }} />}
          <a href={contacts[0] ? `tel:${contacts[0].phone}` : "tel:115"}
            onClick={() => setPressed(true)}
            style={{ width: 160, height: 160, borderRadius: "50%", background: "#ef4444", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 8px 32px #ef444460" }}>
            <span style={{ fontSize: 48 }}>🆘</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 6 }}>SOS</span>
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#1C312260", textAlign: "center", marginBottom: 24 }}>
          {contacts[0] ? `Calls ${contacts[0].name} (${contacts[0].relationship})` : "Calls emergency services (115)"}
        </p>

        {/* Quick call contacts */}
        {contacts.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Quick call</p>
            {contacts.map((c, i) => (
              <a key={i} href={`tel:${c.phone}`} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210", textDecoration: "none" }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: "#1C312215", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#1C3123" }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>{c.relationship} · {c.phone}</p>
                </div>
                <span style={{ fontSize: 20 }}>📞</span>
              </a>
            ))}
          </div>
        )}

        {contacts.length === 0 && (
          <button onClick={() => router.push("/screens/AddEmergencyContact")} style={{ width: "100%", padding: 14, background: "#fff", color: "#1C3123", border: "1.5px solid #1C312220", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            + Add emergency contacts
          </button>
        )}
      </div>
      <BottomNav />
    </main>
  );
}