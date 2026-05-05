"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AdminNav from "../../components/AdminNav";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, medications: 0, appointments: 0, donations: 0, vitals: 0, contacts: 0, partnerships: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const [profiles, meds, apts, donations, vitals, contacts, partnerships] = await Promise.all([
          getDocs(collection(db, "profiles")),
          getDocs(collection(db, "medications")),
          getDocs(collection(db, "appointments")),
          getDocs(collection(db, "donations")),
          getDocs(collection(db, "vitals")),
          getDocs(collection(db, "emergencyContacts")),
          getDocs(collection(db, "partnershipRequests")),
        ]);
        setStats({ users: profiles.size, medications: meds.size, appointments: apts.size, donations: donations.size, vitals: vitals.size, contacts: contacts.size, partnerships: partnerships.size });
        const allUsers = profiles.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecentUsers(allUsers.slice(0, 3));
        const allDonations = donations.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecentDonations(allDonations.slice(0, 3));
      } else router.push("/screens/LoginScreen");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const roleColors = { elderly: { bg: "#E1F5EE", text: "#085041", icon: "👴" }, caregiver: { bg: "#E6F1FB", text: "#0C447C", icon: "🧑‍⚕️" }, volunteer: { bg: "#EEEDFE", text: "#3C3489", icon: "🤝" }, donor: { bg: "#FAEEDA", text: "#633806", icon: "💛" }, admin: { bg: "#FCEBEB", text: "#791F1F", icon: "🛡️" } };

  if (loading) return <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#F5F2ED", fontFamily: "sans-serif" }}>Loading...</p></main>;

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "48px 24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Admin Panel 🛡️</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <img src="/logo.png" alt="Kafeel" width={32} style={{ objectFit: "contain" }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Kafeel Admin</h1>
            </div>
            <p style={{ fontSize: 11, color: "#F5F2ED50", margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>

        {/* Main stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          {[[stats.users, "👥", "Total users"], [stats.donations, "💛", "Donations"], [stats.medications, "💊", "Medications"], [stats.appointments, "🩺", "Appointments"]].map(([val, icon, label]) => (
            <div key={label} style={{ background: "#F5F2ED10", borderRadius: 16, padding: 16, border: "1px solid #F5F2ED15" }}>
              <p style={{ fontSize: 20, margin: "0 0 6px" }}>{icon}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#F5F2ED", margin: "0 0 2px" }}>{val}</p>
              <p style={{ fontSize: 11, color: "#F5F2ED60", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "24px 20px 0", minHeight: "60vh" }}>

        {/* Quick nav */}
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Manage</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "👥", label: "Users", count: stats.users, route: "/screens/AdminUsers", color: "#EEEDFE" },
            { icon: "🏡", label: "Shelters", count: "6", route: "/screens/AdminShelters", color: "#E1F5EE" },
            { icon: "💛", label: "Donations", count: stats.donations, route: "/screens/AdminDonations", color: "#FAEEDA" },
            { icon: "💊", label: "Medications", count: stats.medications, route: "/screens/AdminMedications", color: "#E6F1FB" },
            { icon: "🤝", label: "Partners", count: stats.partnerships, route: "/screens/AdminPartnerships", color: "#FCEBEB" },
            { icon: "📊", label: "Reports", count: "→", route: "/screens/AdminReports", color: "#F5F2ED" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.route)} style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 8 }}>{item.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1C3123", margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "#1C312260", margin: 0, fontWeight: 500 }}>{item.count}</p>
            </button>
          ))}
        </div>

        {/* Recent users */}
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Recent signups</p>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 16 }}>
          {recentUsers.length === 0 ? (
            <p style={{ fontSize: 13, color: "#1C312260", padding: 16, margin: 0 }}>No users yet</p>
          ) : recentUsers.map((u, i) => {
            const rc = roleColors[u.role] || roleColors.elderly;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < recentUsers.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{rc.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: "0 0 2px" }}>{u.name || "Unknown"}</p>
                  <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{u.email}</p>
                </div>
                <span style={{ background: rc.bg, color: rc.text, fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600, textTransform: "capitalize" }}>{u.role}</span>
              </div>
            );
          })}
          <button onClick={() => router.push("/screens/AdminUsers")} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", borderTop: "1px solid #f0f0f0", fontSize: 13, fontWeight: 600, color: "#1C3123", cursor: "pointer", textAlign: "center" }}>
            View all users →
          </button>
        </div>

        {/* Recent donations */}
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Recent donations</p>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 16 }}>
          {recentDonations.length === 0 ? (
            <p style={{ fontSize: 13, color: "#1C312260", padding: 16, margin: 0 }}>No donations yet</p>
          ) : recentDonations.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < recentDonations.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>💛</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: "0 0 2px" }}>{d.campaign || "General fund"}</p>
                <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{d.method} · {d.txnId}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {(d.amount || 0).toLocaleString()}</p>
            </div>
          ))}
          <button onClick={() => router.push("/screens/AdminDonations")} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", borderTop: "1px solid #f0f0f0", fontSize: 13, fontWeight: 600, color: "#1C3123", cursor: "pointer", textAlign: "center" }}>
            View all donations →
          </button>
        </div>

        {/* Extra stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[[stats.vitals, "❤️", "Vitals logged"], [stats.contacts, "📞", "Emergency contacts"], [stats.partnerships, "🏅", "Partner requests"]].map(([val, icon, label]) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #1C312210", textAlign: "center" }}>
              <p style={{ fontSize: 20, margin: "0 0 6px" }}>{icon}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>{val}</p>
              <p style={{ fontSize: 10, color: "#1C312260", margin: 0, lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <AdminNav />
    </main>
  );
}