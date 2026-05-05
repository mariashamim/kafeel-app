"use client";
import VolunteerNav from "../../components/VolunteerNav";

export default function VolunteerImpact() {
  const badges = [
    { icon: "⭐", label: "First task", earned: true },
    { icon: "🔥", label: "10 tasks", earned: true },
    { icon: "💪", label: "50 hours", earned: true },
    { icon: "🏆", label: "100 tasks", earned: false },
    { icon: "❤️", label: "50 helped", earned: false },
    { icon: "🌟", label: "Top volunteer", earned: false },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 48, margin: "0 0 8px" }}>🌟</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Your Impact</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Making a difference every day</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[["86", "Hours volunteered"], ["24", "Elderly helped"], ["12", "Tasks done"]].map(([val, label]) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #1C312210", textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#1C312260", margin: "4px 0 0", lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Badges earned</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {badges.map((b, i) => (
            <div key={i} style={{ background: b.earned ? "#fff" : "#f5f5f5", borderRadius: 16, padding: 14, border: `1px solid ${b.earned ? "#1C312215" : "#f0f0f0"}`, textAlign: "center", opacity: b.earned ? 1 : 0.5 }}>
              <p style={{ fontSize: 28, margin: "0 0 6px" }}>{b.icon}</p>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#1C3123", margin: 0 }}>{b.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 12px" }}>📈 This month</p>
          {[["Tasks completed", "8"], ["Hours logged", "24"], ["New connections", "3"]].map(([label, val], i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <p style={{ fontSize: 13, color: "#1C312270", margin: 0 }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
      <VolunteerNav />
    </main>
  );
}