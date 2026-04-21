"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "emergencyContacts"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, snap => setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const deleteContact = async (id) => {
    await deleteDoc(doc(db, "emergencyContacts", id));
  };

  const colors = ["#EEEDFE", "#E1F5EE", "#FAEEDA", "#E6F1FB", "#FAECE7"];
  const textColors = ["#3C3489", "#085041", "#633806", "#0C447C", "#4A1B0C"];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Emergency contacts 📞</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{contacts.length} contacts saved</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <button onClick={() => router.push("/screens/SOS")}
          style={{ width: "100%", padding: 16, background: "#ef4444", color: "#fff", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>
          🚨 SOS — Call for help now
        </button>

        {contacts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>📞</p>
            <p style={{ fontSize: 15, color: "#1C312260", fontWeight: 500 }}>No contacts yet</p>
            <p style={{ fontSize: 13, color: "#1C312240" }}>Tap + to add emergency contacts</p>
          </div>
        ) : contacts.map((c, i) => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 15, background: colors[i % colors.length], color: textColors[i % textColors.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {c.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1C3123" }}>{c.name}</p>
                <p style={{ fontSize: 12, color: "#1C312270", margin: "2px 0 0" }}>{c.relationship} · {c.phone}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={`tel:${c.phone}`} style={{ background: "#dcfce7", border: "none", borderRadius: 10, padding: "7px 10px", fontSize: 14, cursor: "pointer", textDecoration: "none" }}>📞</a>
                <button onClick={() => deleteContact(c.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 10, padding: "7px 10px", fontSize: 14, cursor: "pointer" }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/screens/AddEmergencyContact")}
        style={{ position: "fixed", bottom: 88, right: "calc(50% - 175px)", width: 52, height: 52, borderRadius: "50%", background: "#1C3123", color: "#F5F2ED", border: "none", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #1C312340" }}>
        +
      </button>
      <BottomNav />
    </main>
  );
}