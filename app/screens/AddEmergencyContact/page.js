"use client";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddEmergencyContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = async () => {
    if (!name || !phone || !relationship) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      await addDoc(collection(db, "emergencyContacts"), {
        userId: auth.currentUser.uid,
        name, phone, relationship,
        createdAt: serverTimestamp()
      });
      router.push("/screens/EmergencyContacts");
    } catch (e) { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const relationships = ["Daughter", "Son", "Spouse", "Doctor", "Neighbour", "Friend", "Other"];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Add contact</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Add someone to call in an emergency</p>

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Full name</label>
        <input style={inp} placeholder="e.g. Sara Khan" value={name} onChange={e => setName(e.target.value)} />
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Phone number</label>
        <input style={inp} type="tel" placeholder="e.g. +92 300 1234567" value={phone} onChange={e => setPhone(e.target.value)} />
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 8 }}>Relationship</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {relationships.map(r => (
            <button key={r} onClick={() => setRelationship(r)} style={{ padding: "7px 14px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: relationship === r ? "#1C3123" : "#F5F2ED", color: relationship === r ? "#F5F2ED" : "#1C312270" }}>{r}</button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Saving..." : "Save contact"}
      </button>
    </main>
  );
}