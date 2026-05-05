"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import AdminNav from "../../components/AdminNav";

export default function AdminPartnerships() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getDocs(collection(db, "partnershipRequests")).then(snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const approve = async id => {
    await updateDoc(doc(db, "partnershipRequests", id), { status: "approved" });
    setRequests(requests.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const reject = async id => {
    await updateDoc(doc(db, "partnershipRequests", id), { status: "rejected" });
    setRequests(requests.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  };

  const remove = async id => {
    await deleteDoc(doc(db, "partnershipRequests", id));
    setRequests(requests.filter(r => r.id !== id));
  };

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter || r.type === filter);
  const pending = requests.filter(r => r.status === "pending").length;

  const statusColors = { pending: { bg: "#fef3c7", color: "#92400e" }, approved: { bg: "#dcfce7", color: "#166534" }, rejected: { bg: "#fef2f2", color: "#ef4444" } };
  const typeColors = { shelter: { bg: "#E1F5EE", color: "#085041", icon: "🏡" }, volunteer_premium: { bg: "#FAEEDA", color: "#633806", icon: "⭐" } };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🤝 Partnerships</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>{requests.length} total requests</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[[pending, "⏳", "Pending"], [requests.filter(r => r.status === "approved").length, "✅", "Approved"], [requests.filter(r => r.status === "rejected").length, "❌", "Rejected"]].map(([val, icon, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: 16, margin: "0 0 4px" }}>{icon}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 9, color: "#F5F2ED60", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "60vh" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto" }}>
          {["All", "pending", "approved", "rejected", "shelter", "volunteer_premium"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 12px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270", textTransform: "capitalize" }}>
              {f === "volunteer_premium" ? "⭐ Volunteer" : f === "shelter" ? "🏡 Shelter" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>Loading...</p>
          : filtered.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0" }}><p style={{ fontSize: 40 }}>🤝</p><p style={{ color: "#1C312260" }}>No requests found</p></div>
          : filtered.map((r, i) => {
            const tc = typeColors[r.type] || typeColors.shelter;
            const sc = statusColors[r.status] || statusColors.pending;
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{tc.icon}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>
                        {r.type === "shelter" ? r.shelterName : "Volunteer Premium"}
                      </p>
                      {r.shelterAddress && <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📍 {r.shelterAddress}</p>}
                      {r.shelterPhone && <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📞 {r.shelterPhone}</p>}
                      {r.shelterBeds && <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>🛏️ {r.shelterBeds} beds</p>}
                      <p style={{ fontSize: 11, color: "#1C312260", margin: "3px 0 0" }}>Plan: <strong>{r.plan}</strong></p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600, textTransform: "capitalize" }}>{r.status}</span>
                    <span style={{ background: tc.bg, color: tc.color, fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>{tc.icon} {r.type === "shelter" ? "Shelter" : "Volunteer"}</span>
                  </div>
                </div>

                {r.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => approve(r.id)} style={{ flex: 1, padding: "10px 0", background: "#dcfce7", color: "#166534", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Approve</button>
                    <button onClick={() => reject(r.id)} style={{ flex: 1, padding: "10px 0", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✗ Reject</button>
                    <button onClick={() => remove(r.id)} style={{ padding: "10px 12px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 12, fontSize: 14, cursor: "pointer" }}>🗑️</button>
                  </div>
                )}
                {r.status !== "pending" && (
                  <button onClick={() => remove(r.id)} style={{ width: "100%", padding: "9px 0", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Remove</button>
                )}
              </div>
            );
          })}
      </div>
      <AdminNav />
    </main>
  );
}