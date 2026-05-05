"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import CaregiverNav from "../../components/CaregiverNav";

export default function CaregiverProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("Full-time");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) { const d = snap.data(); setProfile(d); setName(d.name || ""); setPhone(d.phone || ""); setExperience(d.experience || ""); setAvailability(d.availability || "Full-time"); }
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "profiles", user.uid), { name, phone, experience, availability, role: "caregiver" }, { merge: true });
    setProfile(p => ({ ...p, name, phone, experience, availability }));
    setEditing(false); setSaving(false);
  };

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 32px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5F2ED", color: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28, margin: "0 auto 12px" }}>
          {name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>{profile?.name || "Your name"}</h1>
        <p style={{ fontSize: 12, color: "#F5F2ED70", margin: "0 0 6px" }}>{user?.email}</p>
        <span style={{ background: "#F5F2ED20", color: "#F5F2ED", fontSize: 12, padding: "4px 12px", borderRadius: 999 }}>🧑‍⚕️ Caregiver</span>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {!editing ? (
          <>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Caregiver info</p>
              {[["Name", profile?.name || "—"], ["Phone", profile?.phone || "—"], ["Experience", profile?.experience || "—"], ["Availability", profile?.availability || "—"]].map(([label, val], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setEditing(true)} style={{ width: "100%", padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>✏️ Edit profile</button>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ width: "100%", padding: 14, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Log out</button>
          </>
        ) : (
          <>
            <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
              {[["Full name", "text", "e.g. Dr. Sara", name, setName], ["Phone", "tel", "+92 300 ...", phone, setPhone], ["Years of experience", "text", "e.g. 5 years", experience, setExperience]].map(([label, type, ph, val, set]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                </div>
              ))}
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 8 }}>Availability</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Full-time", "Part-time", "Weekends"].map(a => (
                  <button key={a} onClick={() => setAvailability(a)} style={{ flex: 1, padding: "8px 0", borderRadius: 12, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: availability === a ? "#1C3123" : "#F5F2ED", color: availability === a ? "#F5F2ED" : "#1C312270" }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 14, background: "#fff", color: "#1C3123", border: "1px solid #1C312220", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 2, padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </>
        )}
      </div>
      <CaregiverNav />
    </main>
  );
}