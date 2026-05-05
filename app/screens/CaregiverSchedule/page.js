"use client";
import CaregiverNav from "../../components/CaregiverNav";

const SCHEDULE = [
  { day: "Today", visits: [{ time: "9:00 AM", patient: "Ahmed Khan", type: "Medication check", location: "North Nazimabad" }, { time: "11:30 AM", patient: "Fatima Raza", type: "Vitals monitoring", location: "Gulshan" }, { time: "3:00 PM", patient: "Tariq Mehmood", type: "Physiotherapy assist", location: "PECHS" }] },
  { day: "Tomorrow", visits: [{ time: "10:00 AM", patient: "Ahmed Khan", type: "Doctor visit escort", location: "City Hospital" }, { time: "2:00 PM", patient: "Fatima Raza", type: "Weekly checkup", location: "Gulshan" }] },
];

export default function CaregiverSchedule() {
  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>📅 My Schedule</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Upcoming patient visits</p>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {SCHEDULE.map((day, di) => (
          <div key={di} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: "0 0 10px" }}>{day.day}</p>
            {day.visits.map((v, vi) => (
              <div key={vi} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210", display: "flex", gap: 12 }}>
                <div style={{ width: 2, background: "#1C3123", borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>{v.patient}</p>
                    <span style={{ fontSize: 12, color: "#1C312260", fontWeight: 500 }}>{v.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>🏥 {v.type}</p>
                  <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>📍 {v.location}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <CaregiverNav />
    </main>
  );
}