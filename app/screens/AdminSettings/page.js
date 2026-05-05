"use client";
import { useState } from "react";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import AdminNav from "../../components/AdminNav";

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const router = useRouter();

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(!val)} style={{ width: 44, height: 26, borderRadius: 13, background: val ? "#1C3123" : "#1C312230", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: val ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "48px 24px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>⚙️ Admin Settings</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Platform configuration</p>
      </div>
      <div style={{ background: "#F5F2ED", borderRadius: "28px 28px 0 0", padding: "20px 20px 0", minHeight: "70vh" }}>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Platform</p>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 20 }}>
          {[["Maintenance mode", "Disable app for all users", maintenance, setMaintenance], ["Push notifications", "Send alerts to all users", notifications, setNotifications], ["New registrations", "Allow new users to sign up", newRegistrations, setNewRegistrations]].map(([title, sub, val, set], i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderBottom: i < arr.length - 1 ? "1px solid #1C312208" : "none" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", margin: 0 }}>{title}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "2px 0 0" }}>{sub}</p>
              </div>
              <Toggle val={val} set={set} />
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Announcements</p>
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", marginBottom: 20 }}>
          <textarea placeholder="Write an announcement to send to all users..." rows={4} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "none", color: "#1C3123", background: "#F5F2ED" }} />
          <button style={{ width: "100%", padding: 12, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>📢 Send to all users</button>
        </div>

        <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ width: "100%", padding: 14, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Log out</button>
      </div>
      <AdminNav />
    </main>
  );
}