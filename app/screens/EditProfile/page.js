"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setName(d.name || ""); setAge(d.age || ""); setPhone(d.phone || ""); setRole(d.role || "");
      }
    });
  }, []);

  const handle = async () => {
    if (!name) return setError("Please enter your name.");
    setLoading(true);
    try {
      await setDoc(doc(db, "profiles", auth.currentUser.uid), { name, age, phone, role }, { merge: true });
      setSuccess(true);
      setTimeout(() => router.push("/screens/Profile"), 1500);
    } catch (e) { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Edit profile</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Update your personal information</p>

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        {[["Full name", "text", "e.g. Ahmed Khan", name, setName], ["Age", "number", "e.g. 72", age, setAge], ["Phone number", "tel", "e.g. +92 300 1234567", phone, setPhone]].map(([label, type, ph, val, set]) => (
          <div key={label}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
            <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 8 }}>Role</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Patient", "Caregiver", "Family member"].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ padding: "7px 14px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: role === r ? "#1C3123" : "#F5F2ED", color: role === r ? "#F5F2ED" : "#1C312270" }}>{r}</button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      {success && <p style={{ color: "#166534", fontSize: 12, marginBottom: 12 }}>Profile saved successfully!</p>}
      <button onClick={handle} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Saving..." : "Save profile"}
      </button>
    </main>
  );
}