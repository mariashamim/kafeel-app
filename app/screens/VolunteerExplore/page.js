"use client";
import VolunteerNav from "../../components/VolunteerNav";

const OPPORTUNITIES = [
  { title: "Daily meal delivery", org: "Edhi Foundation", location: "Karachi Central", hours: "2 hrs/day", spots: 3, type: "Delivery" },
  { title: "Elderly companion visits", org: "Saylani Welfare", location: "Gulshan", hours: "3 hrs/week", spots: 5, type: "Visit" },
  { title: "Medical escort service", org: "Al-Khidmat", location: "North Nazimabad", hours: "As needed", spots: 2, type: "Medical" },
  { title: "Reading & entertainment", org: "Kafeel Network", location: "Multiple areas", hours: "2 hrs/week", spots: 8, type: "Social" },
];

const typeColors = { Delivery: "#E1F5EE", Visit: "#E6F1FB", Medical: "#FCEBEB", Social: "#FAEEDA" };

export default function VolunteerExplore() {
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🔍 Explore Opportunities</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Find ways to help near you</p>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {OPPORTUNITIES.map((op, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 4px" }}>{op.title}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>🏢 {op.org}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📍 {op.location} · ⏱️ {op.hours}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>👤 {op.spots} spots left</p>
              </div>
              <span style={{ background: typeColors[op.type], color: "#1C3123", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>{op.type}</span>
            </div>
            <button style={{ width: "100%", padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              🤝 Apply to volunteer
            </button>
          </div>
        ))}
      </div>
      <VolunteerNav />
    </main>
  );
}