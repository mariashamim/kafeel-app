"use client";
import DonorNav from "../../components/DonorNav";

const HISTORY = [
  { campaign: "Medical equipment fund", amount: 5000, date: "Apr 15, 2026", receipt: "#RCP-001" },
  { campaign: "Winter care packages", amount: 2500, date: "Mar 28, 2026", receipt: "#RCP-002" },
  { campaign: "General fund", amount: 1000, date: "Mar 1, 2026", receipt: "#RCP-003" },
];

export default function MyGiving() {
  const total = HISTORY.reduce((sum, d) => sum + d.amount, 0);
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>📊 My Giving</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>Your donation history</p>
        <div style={{ background: "#F5F2ED15", borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 12, color: "#F5F2ED70", margin: "0 0 4px" }}>Total donated</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Rs {total.toLocaleString()}</p>
        </div>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Donation history</p>
        {HISTORY.map((d, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>{d.campaign}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📅 {d.date}</p>
                <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>Receipt: {d.receipt}</p>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {d.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <DonorNav />
    </main>
  );
}