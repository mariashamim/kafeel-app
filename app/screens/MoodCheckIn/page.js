"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

const MOODS = [
  { score: 1, emoji: "😢", label: "Very sad", color: "#fef2f2", text: "#ef4444" },
  { score: 2, emoji: "😔", label: "Sad", color: "#fff7ed", text: "#f97316" },
  { score: 3, emoji: "😐", label: "Okay", color: "#fffbeb", text: "#eab308" },
  { score: 4, emoji: "😊", label: "Good", color: "#f0fdf4", text: "#22c55e" },
  { score: 5, emoji: "😄", label: "Great!", color: "#E1F5EE", text: "#085041" },
];

export default function MoodCheckIn() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDocs(query(collection(db, "moods"), where("userId", "==", u.uid), orderBy("createdAt", "desc"), limit(7))).then(snap => setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const save = async () => {
    if (!selected) return;
    setLoading(true);
    const u = auth.currentUser;
    await addDoc(collection(db, "moods"), { userId: u.uid, score: selected.score, emoji: selected.emoji, label: selected.label, note, createdAt: serverTimestamp() });
    setSaved(true);
    setLoading(false);
    // Alert caregiver if sad
    if (selected.score <= 2) {
      await addDoc(collection(db, "alerts"), { userId: u.uid, type: "mood", message: `Patient reported feeling "${selected.label}" today`, createdAt: serverTimestamp() });
    }
  };

  const avgMood = history.length ? (history.reduce((s, m) => s + m.score, 0) / history.length).toFixed(1) : null;

  if (saved) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", paddingBottom: 80 }}>
      <p style={{ fontSize: 72, margin: "0 0 16px" }}>{selected.emoji}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 8px" }}>Logged for today!</h2>
      <p style={{ fontSize: 14, color: "#1C312270", margin: "0 0 28px", textAlign: "center" }}>You're feeling <strong>{selected.label}</strong>. {selected.score <= 2 ? "Your caregiver has been notified." : "Keep it up!"}</p>
      <button onClick={() => router.push("/screens/ElderlyDashboard")} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Back to dashboard</button>
      <ElderlyNav />
    </main>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer", position: "absolute", left: 20, top: 52 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>😊 Daily Mood Check-in</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>How are you feeling today?</p>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        {avgMood && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #1C312210", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Your 7-day average</p>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {history.slice(0, 7).map((m, i) => <span key={i} style={{ fontSize: 18 }}>{m.emoji}</span>)}
            </div>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Select your mood</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 20 }}>
          {MOODS.map(mood => (
            <button key={mood.score} onClick={() => setSelected(mood)}
              style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: selected?.score === mood.score ? `2px solid ${mood.text}` : "1.5px solid #1C312215", background: selected?.score === mood.score ? mood.color : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s" }}>
              <span style={{ fontSize: 28 }}>{mood.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 500, color: selected?.score === mood.score ? mood.text : "#1C312260" }}>{mood.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <>
            <div style={{ background: selected.color, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${selected.text}20` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: selected.text, margin: "0 0 4px" }}>You selected: {selected.emoji} {selected.label}</p>
              {selected.score <= 2 && <p style={{ fontSize: 12, color: selected.text, margin: 0 }}>Your caregiver will be notified about this.</p>}
            </div>

            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Add a note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How are you feeling? Any pain or discomfort?" rows={3}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 16 }} />

            <button onClick={save} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : "Save today's mood ✓"}
            </button>
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}