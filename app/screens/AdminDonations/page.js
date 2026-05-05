"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import AdminNav from "../../components/AdminNav";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getDocs(collection(db, "donations")).then(snap => {
      setDonations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const byMethod = method => donations.filter(d => d.method === method).length;
  const byCampaign = {};
  donations.forEach(d => { byCampaign[d.campaign] = (byCampaign[d.campaign] || 0) + (d.amount || 0); });

  const filtered = filter === "All" ? donations : donations.filter(d => d.method === filter);

  const methodColors = { jazzcash: { bg: "#fff0f1", color: "#E8192C", label: "🔴 JazzCash" }, easypaisa: { bg: "#f0fff1", color: "#4CAF50", label: "🟢 EasyPaisa" }, card: { bg: "#F5F2ED", color: "#1C3123", label: "💳 Card" }, bank: { bg: "#E6F1FB", color: "#0C447C", label: "🏦 Bank" } };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>💛 All Donations</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 20px" }}>{donations.length} total donations</p>
        <div style={{ background: "#F5F2ED15", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "#F5F2ED70", margin: "0 0 4px" }}>Total amount received</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Rs {total.toLocaleString()}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["jazzcash", "JazzCash"], ["easypaisa", "EasyPaisa"], ["card", "Card"], ["bank", "Bank"]].map(([id, label]) => (
            <div key={id} style={{ background: "#F5F2ED10", borderRadius: 12, padding: 12, border: "1px solid #F5F2ED15" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F2ED", margin: "0 0 2px" }}>{byMethod(id)}</p>
              <p style={{ fontSize: 10, color: "#F5F2ED60", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "60vh" }}>
        {/* Campaign breakdown */}
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>By campaign</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #1C312210", marginBottom: 16 }}>
          {Object.keys(byCampaign).length === 0 ? <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>No donations yet</p>
            : Object.entries(byCampaign).map(([name, amt], i, arr) => (
              <div key={name} style={{ marginBottom: i < arr.length - 1 ? 12 : 0, paddingBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ fontSize: 13, color: "#1C3123", margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {amt.toLocaleString()}</p>
                </div>
                <div style={{ background: "#F5F2ED", borderRadius: 999, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((amt / total) * 100, 100)}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
                </div>
              </div>
            ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
          {["All", "jazzcash", "easypaisa", "card", "bank"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270", textTransform: "capitalize" }}>{f === "All" ? "All" : methodColors[f]?.label}</button>
          ))}
        </div>

        {/* Donation list */}
        {loading ? <p style={{ textAlign: "center", color: "#1C312260" }}>Loading...</p>
          : filtered.length === 0 ? <div style={{ textAlign: "center", padding: "30px 0" }}><p style={{ fontSize: 13, color: "#1C312260" }}>No donations found</p></div>
          : filtered.map((d, i) => {
            const mc = methodColors[d.method] || { bg: "#F5F2ED", color: "#1C3123", label: d.method };
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 3px" }}>{d.campaign || "General fund"}</p>
                    <p style={{ fontSize: 11, color: "#1C312260", margin: "0 0 3px" }}>ID: {d.txnId || d.id?.slice(0, 10)}</p>
                    <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>User: {d.userId?.slice(0, 12)}...</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: "0 0 4px" }}>Rs {(d.amount || 0).toLocaleString()}</p>
                    <span style={{ background: mc.bg, color: mc.color, fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>{mc.label}</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>{d.createdAt?.toDate?.().toLocaleDateString() || "—"}</p>
                  <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>{d.status || "completed"}</span>
                </div>
              </div>
            );
          })}
      </div>
      <AdminNav />
    </main>
  );
}