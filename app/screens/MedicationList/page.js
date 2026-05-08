"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function MedicationList() {
  const [meds, setMeds] = useState([]);
  const [filter, setFilter] = useState("All");
  const [updating, setUpdating] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const q = query(collection(db, "medications"), where("userId", "==", u.uid));
    return onSnapshot(q, snap => setMeds(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const markAs = async (id, status) => {
    setUpdating(id);
    await updateDoc(doc(db, "medications", id), { status });
    setUpdating(null);
  };

  const filters = ["All", "Due", "Done", "Later"];
  const filtered = filter === "All" ? meds : meds.filter(m => m.status === filter);
  const due = meds.filter(m => m.status === "Due").length;
  const done = meds.filter(m => m.status === "Done").length;

  const statusConfig = {
    Done: { bg: "#dcfce7", color: "#166534", label: "Taken ✓", icon: "✅" },
    Due: { bg: "#fef3c7", color: "#92400e", label: "Due now", icon: "⏰" },
    Later: { bg: "#f1f5f9", color: "#64748b", label: "Later", icon: "🕐" },
  };

  return (
    <main style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F0EDE8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(160deg, #1C3123 0%, #2d5a3d 100%)", padding: "52px 24px 24px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F5F2ED", margin: "0 0 16px" }}>💊 Medications</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[[meds.length, "Total"], [due, "Due now"], [done, "Taken"]].map(([val, label], i) => (
            <div key={i} style={{ background: "#F5F2ED12", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: "1px solid #F5F2ED15" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: i === 1 && due > 0 ? "#fca5a5" : "#F5F2ED", margin: "0 0 3px" }}>{val}</p>
              <p style={{ fontSize: 11, color: "#F5F2ED60", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "9px 20px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270", boxShadow: filter === f ? "0 2px 8px #1C312330" : "none" }}>
              {f} {f !== "All" && `(${meds.filter(m => m.status === f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid #1C312210" }}>
            <p style={{ fontSize: 48, margin: "0 0 12px" }}>✅</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1C3123", margin: "0 0 6px" }}>
              {filter === "Due" ? "No medications due!" : "Nothing here"}
            </p>
            <p style={{ fontSize: 14, color: "#1C312260", margin: 0 }}>
              {filter === "Due" ? "You're all caught up 🎉" : `No ${filter.toLowerCase()} medications`}
            </p>
          </div>
        ) : filtered.map((med, i) => {
          const s = statusConfig[med.status] || statusConfig.Later;
          return (
            <div key={i} style={{ background: "#fff", borderRadius: 20, marginBottom: 12, border: `1.5px solid ${med.status === "Due" ? "#fde68a" : "#1C312210"}`, overflow: "hidden", boxShadow: med.status === "Due" ? "0 4px 16px #fde68a40" : "none" }}>
              <div style={{ padding: "18px 18px 14px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#1C3123", margin: "0 0 4px" }}>{med.name}</p>
                  <p style={{ fontSize: 14, color: "#1C312270", margin: "0 0 3px" }}>{med.dose} · {med.frequency}</p>
                  <p style={{ fontSize: 13, color: "#1C312250", margin: 0 }}>⏰ {med.time}{med.notes ? ` · ${med.notes}` : ""}</p>
                </div>
                <span style={{ background: s.bg, color: s.color, fontSize: 12, padding: "5px 12px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap", marginTop: 2 }}>{s.label}</span>
              </div>

              {med.status !== "Done" && (
                <div style={{ padding: "0 18px 16px", display: "flex", gap: 8 }}>
                  <button onClick={() => markAs(med.id, "Done")} disabled={updating === med.id}
                    style={{ flex: 2, padding: "12px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: updating === med.id ? 0.7 : 1 }}>
                    {updating === med.id ? "Saving..." : "✓ Mark as taken"}
                  </button>
                  <button onClick={() => markAs(med.id, "Later")}
                    style={{ flex: 1, padding: "12px 0", background: "#F0EDE8", color: "#1C3123", border: "none", borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Skip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => router.push("/screens/AddMedication")}
        style={{ position: "fixed", bottom: 90, right: "calc(50% - 200px)", width: 56, height: 56, borderRadius: "50%", background: "#1C3123", color: "#F5F2ED", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 4px 20px #1C312350", display: "flex", alignItems: "center", justifyContent: "center" }}>
        +
      </button>
      <ElderlyNav />
    </main>
  );
}