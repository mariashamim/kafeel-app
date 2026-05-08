"use client";
import { useRouter, usePathname } from "next/navigation";

export default function ElderlyNav() {
  const router = useRouter();
  const path = usePathname();
  const tabs = [
    { icon: "🏠", label: "Home", route: "/screens/ElderlyDashboard" },
    { icon: "💊", label: "Meds", route: "/screens/MedicationList" },
    { icon: "🤖", label: "Help", route: "/screens/AIAssistant" },
    { icon: "🏡", label: "Shelters", route: "/screens/ShelterLocator" },
    { icon: "👤", label: "Me", route: "/screens/ElderlyProfile" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "2px solid #1C312215", display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      {tabs.map(tab => {
        const active = path === tab.route;
        return (
          <button key={tab.route} onClick={() => router.push(tab.route)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0 8px", background: active ? "#1C312208" : "none", border: "none", cursor: "pointer", gap: 4, transition: "background 0.2s" }}>
            <span style={{ fontSize: 24 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#1C3123" : "#1C312250", letterSpacing: 0.2 }}>{tab.label}</span>
            {active && <div style={{ width: 20, height: 3, borderRadius: 2, background: "#1C3123" }} />}
          </button>
        );
      })}
    </div>
  );
}