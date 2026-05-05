"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminNav from "../../components/AdminNav";

export default function AdminReports() {
  const [data, setData] = useState({ users: [], donations: [], medications: [], vitals: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "profiles")),
      getDocs(collection(db, "donations")),
      getDocs(collection(db, "medications")),
      getDocs(collection(db, "vitals")),
      getDocs(collection(db, "appointments")),
    ]).then(([u, d, m, v, a]) => {
      setData({
        users: u.docs.map(x => x.data()),
        donations: d.docs.map(x => x.data()),
        medications: m.docs.map(x => x.data()),
        vitals: v.docs.map(x => x.data()),
        appointments: a.docs.map(x => x.data()),
      });
      setLoading(false);
    });
  }, []);

  const totalDonations = data.donations.reduce((s, d) => s + (d.amount || 0), 0);
  const roleCount = role => data.users.filter(u => u.role === role).length;
  const medDone = data.medications.filter(m => m.status === "Done").length;
  const medDue = data.medications.filter(m => m.status === "Due").length;

  const metrics = [
    { label: "Total users", value: data.users.length, change: "+3 this week", up: true },
    { label: "Total donations", value: `Rs ${totalDonations.toLocaleString()}`, change: "+12%", up: true },
    { label: "Medications logged", value: data.medications.length, change: `${medDone} taken, ${medDue} due`, up: true },
    { label: "Vitals recorded", value: data.vitals.length, change: "Across all users", up: true },
    { label: "Appointments", value: data.appointments.length, change: "All upcoming", up: true },
    { label: "Donor campaigns", value: [...new Set(data.donations.map(d => d.campaign))].length, change: "Active campaigns", up: true },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>📊 Reports</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Full platform analytics</p>
      </div>

      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "70vh" }}>
        {loading ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>Loading...</p> : (
          <>
            {/* Key metrics */}
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Key metrics</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #1C312210" }}>
                  <p style={{ fontSize: 11, color: "#1C312260", margin: "0 0 6px" }}>{m.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#1C3123", margin: "0 0 4px" }}>{m.value}</p>
                  <p style={{ fontSize: 10, color: m.up ? "#166534" : "#ef4444", margin: 0, fontWeight: 500 }}>{m.up ? "↑" : "↓"} {m.change}</p>
                </div>
              ))}
            </div>

            {/* Users by role */}
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Users by role</p>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              {[["👴 Elderly", "elderly"], ["🧑‍⚕️ Caregiver", "caregiver"], ["🤝 Volunteer", "volunteer"], ["💛 Donor", "donor"], ["🛡️ Admin", "admin"]].map(([label, role]) => {
                const count = roleCount(role);
                const pct = data.users.length ? Math.round((count / data.users.length) * 100) : 0;
                return (
                  <div key={role} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <p style={{ fontSize: 13, color: "#1C3123", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{count} <span style={{ fontWeight: 400, color: "#1C312260" }}>({pct}%)</span></p>
                    </div>
                    <div style={{ background: "#F5F2ED", borderRadius: 999, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donations by campaign */}
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Donations by campaign</p>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              {data.donations.length === 0 ? <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>No donations yet</p>
                : (() => {
                  const byCampaign = {};
                  data.donations.forEach(d => { byCampaign[d.campaign || "General"] = (byCampaign[d.campaign || "General"] || 0) + (d.amount || 0); });
                  return Object.entries(byCampaign).map(([name, amt], i, arr) => (
                    <div key={name} style={{ marginBottom: i < arr.length - 1 ? 12 : 0, paddingBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <p style={{ fontSize: 12, color: "#1C3123", margin: 0 }}>{name}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {amt.toLocaleString()}</p>
                      </div>
                      <div style={{ background: "#F5F2ED", borderRadius: 999, height: 5, overflow: "hidden" }}>
                        <div style={{ width: `${totalDonations ? Math.round((amt / totalDonations) * 100) : 0}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
                      </div>
                    </div>
                  ));
                })()}
            </div>

            {/* Medication stats */}
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Medication compliance</p>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              {[["Done ✓", medDone, "#dcfce7", "#166534"], ["Due ⏳", medDue, "#fef3c7", "#92400e"], ["Later 🕐", data.medications.filter(m => m.status === "Later").length, "#f3f4f6", "#6b7280"]].map(([label, count, bg, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: 13, color: "#1C3123", margin: 0 }}>{label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: "#F5F2ED", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${data.medications.length ? (count / data.medications.length) * 100 : 0}%`, height: "100%", background: color, borderRadius: 999 }} />
                    </div>
                    <span style={{ background: bg, color, fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600, minWidth: 28, textAlign: "center" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <AdminNav />
    </main>
  );
}