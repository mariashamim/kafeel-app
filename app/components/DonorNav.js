"use client";
import { useRouter, usePathname } from "next/navigation";

export default function DonorNav() {
  const router = useRouter();
  const path = usePathname();
  const tabs = [
    { icon: "🏠", label: "Home", route: "/screens/DonorDashboard" },
    { icon: "💳", label: "Donate", route: "/screens/DonatePage" },
    { icon: "📊", label: "Giving", route: "/screens/MyGiving" },
    { icon: "🏡", label: "Campaigns", route: "/screens/Campaigns" },
    { icon: "👤", label: "Profile", route: "/screens/DonorProfile" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: "#fff", borderTop: "1px solid #1C312210", display: "flex", zIndex: 100, paddingBottom: 8 }}>
      {tabs.map(tab => {
        const active = path === tab.route;
        return (
          <button key={tab.route} onClick={() => router.push(tab.route)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px", background: "none", border: "none", cursor: "pointer", gap: 3 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? "#1C3123" : "#1C312260" }}>{tab.label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1C3123" }} />}
          </button>
        );
      })}
    </div>
  );
}