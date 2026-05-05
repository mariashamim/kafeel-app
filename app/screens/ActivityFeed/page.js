"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import CaregiverNav from "../../components/CaregiverNav";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [category, setCategory] = useState("Task");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const q = query(collection(db, "activityFeed"), where("caregiverId", "==", u.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const categories = [
    { id: "Task", icon: "✅", color: "#dcfce7", text: "#166534" },
    { id: "Meal", icon: "🍽️", color: "#fef3c7", text: "#92400e" },
    { id: "Medication", icon: "💊", color: "#E6F1FB", text: "#0C447C" },
    { id: "Vitals", icon: "❤️", color: "#fef2f2", text: "#ef4444" },
    { id: "Hygiene", icon: "🚿", color: "#EEEDFE", text: "#3C3489" },
    { id: "Note", icon: "📝", color: "#F5F2ED", text: "#1C3123" },
  ];

  const quickLogs = [
    "Breakfast given", "Lunch served", "Dinner served",
    "Morning medication given", "Evening medication given",
    "Blood pressure checked", "Blood sugar checked",
    "Patient bathed", "Bedsheets changed",
    "Patient in good mood", "Patient sleeping well",
  ];

  const log = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    const u = auth.currentUser;
    const cat = categories.find(c => c.id === category);
    const timeStr = new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
    await addDoc(collection(db, "activityFeed"), {
      caregiverId: u.uid,
      text: text.trim(),
      category, icon: cat.icon,
      timeStr,
      createdAt: serverTimestamp()
    });
    setNewActivity("");
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 20px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>📋 Activity Feed</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 14px" }}>Real-time care log visible to family</p>
        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: "6px 12px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: category === c.id ? "#F5F2ED" : "#F5F2ED20", color: category === c.id ? "#1C3123" : "#F5F2ED" }}>
              {c.icon} {c.id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        {/* Quick log */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 14, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Quick log</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {quickLogs.map(q => (
              <button key={q} onClick={() => log(q)} style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #1C312215", fontSize: 11, cursor: "pointer", background: "#F5F2ED", color: "#1C3123", fontWeight: 500 }}>{q}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newActivity} onChange={e => setNewActivity(e.target.value)} onKeyDown={e => e.key === "Enter" && log(newActivity)} placeholder="Or type custom activity..." style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", background: "#fff", color: "#1C3123" }} />
            <button onClick={() => log(newActivity)} disabled={loading || !newActivity.trim()} style={{ padding: "11px 16px", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>Log</button>
          </div>
        </div>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's activity log</p>
        {activities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>📋</p>
            <p style={{ fontSize: 14, color: "#1C312260" }}>No activities logged yet today</p>
          </div>
        ) : activities.map((a, i) => {
          const cat = categories.find(c => c.id === a.category) || categories[5];
          return (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 8, border: "1px solid #1C312210", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: "0 0 2px" }}>{a.text}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: cat.color, color: cat.text, fontSize: 10, padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>{a.category}</span>
                  <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>{a.timeStr}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <CaregiverNav />
    </main>
  );
}