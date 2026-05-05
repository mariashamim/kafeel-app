"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AdminNav from "../../components/AdminNav";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getDocs(collection(db, "profiles")).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const roleColors = { elderly: { bg: "#E1F5EE", text: "#085041", icon: "👴" }, caregiver: { bg: "#E6F1FB", text: "#0C447C", icon: "🧑‍⚕️" }, volunteer: { bg: "#EEEDFE", text: "#3C3489", icon: "🤝" }, donor: { bg: "#FAEEDA", text: "#633806", icon: "💛" }, admin: { bg: "#FCEBEB", text: "#791F1F", icon: "🛡️" } };

  const filtered = users.filter(u => {
    const matchRole = filter === "All" || u.role === filter;
    const matchSearch = !search || (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleCount = role => users.filter(u => u.role === role).length;

  const removeUser = async id => {
    await deleteDoc(doc(db, "profiles", id));
    setUsers(users.filter(u => u.id !== id));
    setSelected(null);
  };

  if (selected) {
    const rc = roleColors[selected.role] || roleColors.elderly;
    return (
      <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
        <div style={{ padding: "48px 24px 28px" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5F2ED20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>{rc.icon}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>{selected.name || "Unknown"}</h2>
            <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 8px" }}>{selected.email}</p>
            <span style={{ background: rc.bg, color: rc.text, fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600, textTransform: "capitalize" }}>{selected.role}</span>
          </div>
        </div>
        <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "24px 20px 0", minHeight: "60vh" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>Profile details</p>
            {[["User ID", selected.id?.slice(0, 16) + "..."], ["Name", selected.name || "—"], ["Email", selected.email || "—"], ["Phone", selected.phone || "—"], ["Role", selected.role || "—"], ["Age", selected.age || "—"], ["Medical condition", selected.condition || "—"], ["Specialization", selected.specialization || "—"], ["Experience", selected.experience || "—"], ["License", selected.license || "—"], ["Skills", selected.skills?.join(", ") || "—"], ["Availability", selected.availability || "—"], ["Organization", selected.organization || "—"]].filter(([_, v]) => v && v !== "—").map(([label, val], i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#1C3123", margin: 0, textAlign: "right", maxWidth: "55%" }}>{val}</p>
              </div>
            ))}
          </div>
          <button onClick={() => removeUser(selected.id)} style={{ width: "100%", padding: 14, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            🗑️ Remove this user
          </button>
        </div>
        <AdminNav />
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>👥 All Users</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>{users.length} registered users</p>
        <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "none", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#F5F2ED20", color: "#F5F2ED" }} />
      </div>

      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "70vh" }}>
        {/* Role summary */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
          {["All", "elderly", "caregiver", "volunteer", "donor", "admin"].map(f => {
            const rc = roleColors[f] || { bg: "#1C3123", text: "#F5F2ED" };
            return (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 12px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270", textTransform: "capitalize" }}>
                {f === "All" ? `All (${users.length})` : `${roleColors[f]?.icon} ${f} (${roleCount(f)})`}
              </button>
            );
          })}
        </div>

        {loading ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>Loading...</p>
          : filtered.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0" }}><p style={{ fontSize: 40 }}>👥</p><p style={{ color: "#1C312260" }}>No users found</p></div>
          : filtered.map((u, i) => {
            const rc = roleColors[u.role] || roleColors.elderly;
            return (
              <div key={i} onClick={() => setSelected(u)} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{rc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 2px" }}>{u.name || "Unknown"}</p>
                    <p style={{ fontSize: 11, color: "#1C312260", margin: "0 0 4px" }}>{u.email}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {u.phone && <span style={{ fontSize: 10, color: "#1C312250" }}>📞 {u.phone}</span>}
                      {u.age && <span style={{ fontSize: 10, color: "#1C312250" }}>🎂 {u.age} yrs</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ background: rc.bg, color: rc.text, fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600, textTransform: "capitalize" }}>{u.role}</span>
                    <span style={{ fontSize: 11, color: "#1C312240" }}>›</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <AdminNav />
    </main>
  );
}