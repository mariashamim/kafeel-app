"use client";
import { useState } from "react";
import VolunteerNav from "../../components/VolunteerNav";

export default function VolunteerTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Visit Ahmed Khan", time: "Today · 10:00 AM", location: "North Nazimabad", type: "Visit", done: false },
    { id: 2, title: "Medication delivery", time: "Today · 2:00 PM", location: "Gulshan", type: "Delivery", done: false },
    { id: 3, title: "Weekly checkup assist", time: "Tomorrow · 9:00 AM", location: "PECHS", type: "Medical", done: false },
    { id: 4, title: "Grocery run for Fatima", time: "Tomorrow · 11:00 AM", location: "Gulshan", type: "Errand", done: true },
  ]);

  const toggle = id => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const typeColors = { Visit: "#E6F1FB", Delivery: "#E1F5EE", Medical: "#FCEBEB", Errand: "#FAEEDA" };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🗂️ My Tasks</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{tasks.filter(t => !t.done).length} tasks remaining</p>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {tasks.map(task => (
          <div key={task.id} style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${task.done ? "#dcfce7" : "#1C312210"}`, opacity: task.done ? 0.7 : 1 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div onClick={() => toggle(task.id)} style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${task.done ? "#166534" : "#1C312230"}`, background: task.done ? "#dcfce7" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2, fontSize: 13 }}>
                {task.done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px", textDecoration: task.done ? "line-through" : "none" }}>{task.title}</p>
                  <span style={{ background: typeColors[task.type], color: "#1C3123", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600, marginLeft: 6, flexShrink: 0 }}>{task.type}</span>
                </div>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>🕐 {task.time}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>📍 {task.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <VolunteerNav />
    </main>
  );
}