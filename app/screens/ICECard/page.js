"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function ICECard() {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ name: "", age: "", bloodGroup: "", conditions: "", allergies: "", medications: "", hospital: "", contact1Name: "", contact1Phone: "", contact2Name: "", contact2Phone: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDoc(doc(db, "iceCards", u.uid)).then(s => { if (s.exists()) setData(s.data()); });
  }, []);

  const save = async () => {
    setLoading(true);
    await setDoc(doc(db, "iceCards", auth.currentUser.uid), data);
    setEditing(false); setSaved(true); setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 10 };
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer", marginBottom: 12 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🆘 ICE Medical Card</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>In Case of Emergency · Always accessible</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {!editing ? (
          <>
            {/* ICE Card Preview */}
            <div style={{ background: "#1C3123", borderRadius: 20, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "#F5F2ED08" }} />
              <div style={{ position: "absolute", bottom: -20, left: -10, width: 80, height: 80, borderRadius: "50%", background: "#F5F2ED05" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#F5F2ED60", margin: "0 0 4px", letterSpacing: 1, textTransform: "uppercase" }}>🆘 In Case of Emergency</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 2px" }}>{data.name || "Your Name"}</p>
                  <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{data.age ? `Age ${data.age}` : "Age —"}</p>
                </div>
                <div style={{ background: "#ef4444", borderRadius: 10, padding: "6px 12px", textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "#fff", margin: "0 0 2px", fontWeight: 600 }}>Blood</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>{data.bloodGroup || "—"}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[["🏥 Conditions", data.conditions || "—"], ["⚠️ Allergies", data.allergies || "—"], ["💊 Medications", data.medications || "—"], ["🏨 Hospital pref.", data.hospital || "—"]].map(([label, val]) => (
                  <div key={label} style={{ background: "#F5F2ED10", borderRadius: 10, padding: 10 }}>
                    <p style={{ fontSize: 10, color: "#F5F2ED60", margin: "0 0 3px" }}>{label}</p>
                    <p style={{ fontSize: 12, color: "#F5F2ED", margin: 0, fontWeight: 500 }}>{val}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #F5F2ED20", paddingTop: 12 }}>
                <p style={{ fontSize: 10, color: "#F5F2ED60", margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>Emergency contacts</p>
                {[{ name: data.contact1Name, phone: data.contact1Phone }, { name: data.contact2Name, phone: data.contact2Phone }].filter(c => c.name).map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <p style={{ fontSize: 13, color: "#F5F2ED", margin: 0, fontWeight: 500 }}>{c.name}</p>
                    <a href={`tel:${c.phone}`} style={{ fontSize: 13, color: "#F5F2ED70", textDecoration: "none" }}>{c.phone}</a>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fffbeb", borderRadius: 14, padding: 14, marginBottom: 16, border: "1px solid #fde68a" }}>
              <p style={{ fontSize: 13, color: "#92400e", margin: 0 }}>💡 This card is accessible offline. Show it to any doctor in an emergency without unlocking your phone.</p>
            </div>

            {saved && <p style={{ textAlign: "center", color: "#166534", fontWeight: 600, marginBottom: 12 }}>✓ Saved successfully!</p>}

            <button onClick={() => setEditing(true)} style={{ width: "100%", padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              ✏️ Edit ICE Card
            </button>
          </>
        ) : (
          <>
            <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210", marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Personal info</p>
              {[["Full name", "text", "Ahmed Khan", "name"], ["Age", "number", "72", "age"]].map(([label, type, ph, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 4 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={data[key]} onChange={e => setData({ ...data, [key]: e.target.value })} />
                </div>
              ))}
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Blood group</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {bloodGroups.map(bg => (
                  <button key={bg} onClick={() => setData({ ...data, bloodGroup: bg })} style={{ padding: "6px 12px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: data.bloodGroup === bg ? "#ef4444" : "#F5F2ED", color: data.bloodGroup === bg ? "#fff" : "#1C3123" }}>{bg}</button>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210", marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Medical info</p>
              {[["Medical conditions", "e.g. Diabetes, Hypertension", "conditions"], ["Allergies", "e.g. Penicillin, Peanuts", "allergies"], ["Current medications", "e.g. Metformin, Aspirin", "medications"], ["Preferred hospital", "e.g. Aga Khan Hospital", "hospital"]].map(([label, ph, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 4 }}>{label}</label>
                  <input style={inp} placeholder={ph} value={data[key]} onChange={e => setData({ ...data, [key]: e.target.value })} />
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Emergency contacts</p>
              {[["Contact 1 name", "contact1Name"], ["Contact 1 phone", "contact1Phone"], ["Contact 2 name", "contact2Name"], ["Contact 2 phone", "contact2Phone"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 4 }}>{label}</label>
                  <input style={inp} placeholder={label.includes("phone") ? "+92 300 ..." : "Full name"} value={data[key]} onChange={e => setData({ ...data, [key]: e.target.value })} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 14, background: "#fff", color: "#1C3123", border: "1px solid #1C312220", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} disabled={loading} style={{ flex: 2, padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{loading ? "Saving..." : "Save card"}</button>
            </div>
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}