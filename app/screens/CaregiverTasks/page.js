"use client";
import { useState } from "react";
import CaregiverNav from "../../components/CaregiverNav";

export default function CaregiverTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Give morning medication", patient: "Ahmed Khan", time: "8:00 AM", done: true },
    { id: 2, title: "Check blood pressure", patient: "Fatima Raza", time: "10:00 AM", done: false },
    { id: 3, title: "Assist with physiotherapy", patient: "Tariq Mehmood", time: "11:30 AM", done: false },
    { id: 4, title: "Lunch preparation", patient: "Ahmed Khan", time: "1:00 PM", done: false },
    { id: 5, title: "Evening medication", patient: "Fatima Raza", time: "6:00 PM", done: false },
  ]);

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const done = tasks.filter(t => t.done).length;

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>📋 Today's Tasks</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>{done} of {tasks.length} completed</p>
        <div style={{ background: "#F5F2ED20", borderRadius: 999, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${(done / tasks.length) * 100}%`, height: "100%", background: "#F5F2ED", borderRadius: 999, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {tasks.map((task, i) => (
          <div key={task.id} onClick={() => toggle(task.id)}
            style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${task.done ? "#dcfce7" : "#1C312210"}`, cursor: "pointer", opacity: task.done ? 0.7 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${task.done ? "#166534" : "#1C312230"}`, background: task.done ? "#dcfce7" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                {task.done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 3px", textDecoration: task.done ? "line-through" : "none" }}>{task.title}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>👤 {task.patient} · 🕐 {task.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CaregiverNav />
    </main>
  );
}