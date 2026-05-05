"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function ElderlyProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [condition, setCondition] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          setProfile(d); setName(d.name || ""); setAge(d.age || ""); setPhone(d.phone || ""); setCondition(d.condition || "");
        }
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "profiles", user.uid), { name, age, phone, condition, role: "elderly" }, { merge: true });
    setProfile(prev => ({ ...prev, name, age, phone, condition }));
    setEditing(false);
    setSaving(false);
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
        <span style={{ background: "#F5F2ED20", color: "#F5F2ED", fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 500 }}>👴 Elderly user</span>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {!editing ? (
          <>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Personal info</p>
              {[["Full name", profile?.name || "—"], ["Age", profile?.age ? `${profile.age} years` : "—"], ["Phone", profile?.phone || "—"], ["Medical condition", profile?.condition || "—"]].map(([label, val], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 12 }}>
              {[
                { icon: "📞", label: "Emergency contacts", route: "/screens/EmergencyContacts" },
                { icon: "💊", label: "My medications", route: "/screens/MedicationList" },
                { icon: "📊", label: "Health reports", route: "/screens/HealthReports" },
                { icon: "⚙️", label: "Settings", route: "/screens/Settings" },
              ].map((item, i, arr) => (
                <button key={i} onClick={() => router.push(item.route)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? "1px solid #1C312208" : "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", flex: 1 }}>{item.label}</span>
                  <span style={{ color: "#1C312240" }}>›</span>
                </button>
              ))}
            </div>

            <button onClick={() => setEditing(true)} style={{ width: "100%", padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              ✏️ Edit profile
            </button>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ width: "100%", padding: 14, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
              {[["Full name", "text", "e.g. Ahmed Khan", name, setName], ["Age", "number", "e.g. 72", age, setAge], ["Phone", "tel", "+92 300 ...", phone, setPhone]].map(([label, type, ph, val, set]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                </div>
              ))}
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Medical condition</label>
              <textarea value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. Diabetes, hypertension" rows={2} style={{ ...inp, resize: "none", marginBottom: 0 }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 14, background: "#fff", color: "#1C3123", border: "1px solid #1C312220", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 2, padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}