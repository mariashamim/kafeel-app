"use client";
import { useRouter } from "next/navigation";
import DonorNav from "../../components/DonorNav";

const CAMPAIGNS = [
  { title: "Winter care packages", org: "Kafeel Network", raised: 45000, goal: 100000, donors: 34, urgent: true, icon: "🧥" },
  { title: "Medical equipment fund", org: "Al-Khidmat", raised: 82000, goal: 150000, donors: 67, urgent: false, icon: "🏥" },
  { title: "Shelter renovation", org: "Edhi Foundation", raised: 28000, goal: 50000, donors: 21, urgent: true, icon: "🏡" },
  { title: "Daily meals program", org: "Saylani Welfare", raised: 15000, goal: 30000, donors: 45, urgent: false, icon: "🍱" },
];

export default function Campaigns() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🏡 Campaigns</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Active fundraising campaigns</p>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {CAMPAIGNS.map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "#1C312215", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 2px" }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>by {c.org} · {c.donors} donors</p>
                </div>
              </div>
              {c.urgent && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>Urgent</span>}
            </div>
            <div style={{ background: "#F5F2ED", borderRadius: 999, height: 6, marginBottom: 6, overflow: "hidden" }}>
              <div style={{ width: `${Math.round((c.raised / c.goal) * 100)}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
            </div>
            <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 10px" }}>Rs {c.raised.toLocaleString()} of Rs {c.goal.toLocaleString()} ({Math.round((c.raised / c.goal) * 100)}%)</p>
            <button onClick={() => router.push("/screens/DonatePage")} style={{ width: "100%", padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>💛 Donate now</button>
          </div>
        ))}
      </div>
      <DonorNav />
    </main>
  );
}