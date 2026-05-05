"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function HeatwaveAlert() {
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://wttr.in/Karachi?format=j1")
      .then(r => r.json())
      .then(d => { setTemp(parseInt(d.current_condition[0].temp_C)); setLoading(false); })
      .catch(() => { setTemp(38); setLoading(false); });
  }, []);

  const isHeatwave = temp >= 40;
  const isWarm = temp >= 35 && temp < 40;

  const tips = [
    { icon: "💧", tip: "Drink water every 30 minutes even if not thirsty", urgent: true },
    { icon: "🏠", tip: "Stay indoors between 12pm and 4pm", urgent: true },
    { icon: "🥒", tip: "Eat water-rich foods like cucumbers and yogurt", urgent: false },
    { icon: "👕", tip: "Wear loose, light-coloured cotton clothing", urgent: false },
    { icon: "🌬️", tip: "Use a fan or stay near air conditioning", urgent: true },
    { icon: "🌊", tip: "Cool your wrists and neck with cold water", urgent: false },
    { icon: "🚫", tip: "Avoid strenuous activity outdoors", urgent: true },
    { icon: "📱", tip: "Keep emergency contacts nearby", urgent: false },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: isHeatwave ? "#ef4444" : isWarm ? "#f97316" : "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", marginBottom: 12 }}>←</button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 64, margin: "0 0 8px" }}>{isHeatwave ? "🔥" : isWarm ? "☀️" : "🌤️"}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
            {loading ? "Checking..." : `${temp}°C in Karachi`}
          </h1>
          <div style={{ display: "inline-block", background: "#ffffff30", borderRadius: 999, padding: "4px 16px", marginTop: 6 }}>
            <p style={{ fontSize: 13, color: "#fff", margin: 0, fontWeight: 600 }}>
              {isHeatwave ? "⚠️ Heatwave alert active" : isWarm ? "⚠️ Hot weather warning" : "✓ Temperature normal"}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {isHeatwave && (
          <div style={{ background: "#fef2f2", borderRadius: 16, padding: 16, marginBottom: 16, border: "2px solid #fecaca" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", margin: "0 0 6px" }}>🚨 Heatwave Emergency</p>
            <p style={{ fontSize: 13, color: "#ef4444", margin: "0 0 12px", lineHeight: 1.5 }}>Temperature is above 40°C. Elderly are at serious risk of heat stroke. Notify caregiver immediately.</p>
            <button style={{ width: "100%", padding: "10px 0", background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              📞 Alert my caregiver now
            </button>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>
          {isHeatwave ? "⚠️ Urgent safety tips" : "Stay safe in the heat"}
        </p>

        {tips.map((t, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 8, border: `1px solid ${t.urgent && isHeatwave ? "#fecaca" : "#1C312210"}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
            <p style={{ fontSize: 13, color: "#1C3123", margin: 0, lineHeight: 1.5 }}>{t.tip}</p>
            {t.urgent && isHeatwave && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 10, padding: "2px 6px", borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>Urgent</span>}
          </div>
        ))}

        <div style={{ background: "#1C312210", borderRadius: 14, padding: 14, marginTop: 8 }}>
          <p style={{ fontSize: 13, color: "#1C3123", margin: 0, lineHeight: 1.5 }}>🏥 Nearest heatstroke treatment: <strong>Aga Khan Hospital Emergency</strong> · +92-21-111-911-911</p>
        </div>
      </div>
      <ElderlyNav />
    </main>
  );
}