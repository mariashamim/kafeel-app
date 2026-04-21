"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [language, setLanguage] = useState("English");
  const router = useRouter();

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(!val)} style={{ width: 44, height: 26, borderRadius: 13, background: val ? "#1C3123" : "#1C312230", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: val ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 24, color: "#1C3123" }}>←</button>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 24px" }}>Settings ⚙️</h1>

      <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Notifications</p>
      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 20 }}>
        {[["Push notifications", "Get alerts on your device", notifications, setNotifications], ["Medication reminders", "Remind me when meds are due", reminders, setReminders]].map(([title, sub, val, set], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderBottom: i === 0 ? "1px solid #1C312208" : "none" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", margin: 0 }}>{title}</p>
              <p style={{ fontSize: 12, color: "#1C312260", margin: "2px 0 0" }}>{sub}</p>
            </div>
            <Toggle val={val} set={set} />
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Language</p>
      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 20 }}>
        {["English", "اردو", "عربي"].map((lang, i, arr) => (
          <div key={lang} onClick={() => setLanguage(lang)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: i < arr.length - 1 ? "1px solid #1C312208" : "none", cursor: "pointer" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", margin: 0 }}>{lang}</p>
            {language === lang && <span style={{ color: "#1C3123", fontSize: 18 }}>✓</span>}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Account</p>
      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210" }}>
        <button onClick={() => router.push("/screens/About")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: "none", border: "none", borderBottom: "1px solid #1C312208", cursor: "pointer" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", margin: 0 }}>About Kafeel</p>
          <span style={{ color: "#1C312240" }}>›</span>
        </button>
        <button onClick={() => router.push("/screens/ForgetPasswordScreen")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: "none", border: "none", cursor: "pointer" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#1C3123", margin: 0 }}>Change password</p>
          <span style={{ color: "#1C312240" }}>›</span>
        </button>
      </div>
    </main>
  );
}