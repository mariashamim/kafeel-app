"use client";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";

export default function AdminShelters() {
  const [shelters, setShelters] = useState([
    { id: 1, name: "Edhi Foundation Home", address: "Karachi, Sindh", beds: 45, available: true },
    { id: 2, name: "Saylani Welfare Home", address: "Gulshan-e-Iqbal", beds: 30, available: true },
    { id: 3, name: "Al-Khidmat Elderly Care", address: "North Nazimabad", beds: 20, available: false },
    { id: 4, name: "Pakistan Bait ul Mal", address: "Clifton", beds: 60, available: true },
  ]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddr, setNewAddr] = useState("");
  const [newBeds, setNewBeds] = useState("");

  const toggleAvail = id => setShelters(shelters.map(s => s.id === id ? { ...s, available: !s.available } : s));
  const remove = id => setShelters(shelters.filter(s => s.id !== id));
  const add = () => {
    if (!newName || !newAddr) return;
    setShelters([...shelters, { id: Date.now(), name: newName, address: newAddr, beds: parseInt(newBeds) || 0, available: true }]);
    setNewName(""); setNewAddr(""); setNewBeds(""); setAdding(false);
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 10 };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🏡 Manage Shelters</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>{shelters.length} shelters listed</p>
      </div>
      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "70vh" }}>
        <button onClick={() => setAdding(!adding)} style={{ width: "100%", padding: 14, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
          {adding ? "✕ Cancel" : "+ Add new shelter"}
        </button>

        {adding && (
          <div style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", marginBottom: 16 }}>
            <input style={inp} placeholder="Shelter name" value={newName} onChange={e => setNewName(e.target.value)} />
            <input style={inp} placeholder="Address" value={newAddr} onChange={e => setNewAddr(e.target.value)} />
            <input style={inp} placeholder="Number of beds" type="number" value={newBeds} onChange={e => setNewBeds(e.target.value)} />
            <button onClick={add} style={{ width: "100%", padding: 12, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save shelter</button>
          </div>
        )}

        {shelters.map((s, i) => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>{s.name}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📍 {s.address}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>🛏️ {s.beds} beds</p>
              </div>
              <button onClick={() => remove(s.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 10, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>🗑️</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: s.available ? "#dcfce7" : "#fef2f2", color: s.available ? "#166534" : "#ef4444", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>{s.available ? "Available" : "Full"}</span>
              <button onClick={() => toggleAvail(s.id)} style={{ padding: "6px 14px", background: "#1C312215", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#1C3123", cursor: "pointer" }}>Toggle status</button>
            </div>
          </div>
        ))}
      </div>
      <AdminNav />
    </main>
  );
}