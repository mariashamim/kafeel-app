"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/screens/RoleSelectionScreen"), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <img src="/logo.png" alt="Kafeel" width={220} style={{ objectFit: "contain" }} />
        <p style={{ fontSize: 14, color: "#F5F2ED60", margin: 0, letterSpacing: 1 }}>Elderly care companion</p>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5F2ED" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5F2ED40" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5F2ED40" }} />
      </div>
    </main>
  );
}