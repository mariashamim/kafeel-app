"use client";
import { useRouter, usePathname } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();
  const path = usePathname();
  const tabs = [
    { icon: "🏠", label: "Home", route: "/screens/AdminDashboard" },
    { icon: "👥", label: "Users", route: "/screens/AdminUsers" },
    { icon: "💛", label: "Donations", route: "/screens/AdminDonations" },
    { icon: "📊", label: "Reports", route: "/screens/AdminReports" },
    { icon: "⚙️", label: "Settings", route: "/screens/AdminSettings" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: "#1C3123", borderTop: "1px solid #F5F2ED20", display: "flex", zIndex: 100, paddingBottom: 8 }}>
      {tabs.map(tab => {
        const active = path === tab.route;
        return (
          <button key={tab.route} onClick={() => router.push(tab.route)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px", background: "none", border: "none", cursor: "pointer", gap: 3 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? "#F5F2ED" : "#F5F2ED50" }}>{tab.label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F5F2ED" }} />}
          </button>
        );
      })}
    </div>
  );
}