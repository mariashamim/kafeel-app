"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function PrayerTimes() {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    fetch(`https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Karachi&country=Pakistan&method=1`)
      .then(r => r.json())
      .then(d => {
        setTimes(d.data.timings);
        setLoading(false);
      })
      .catch(() => {
        setTimes({ Fajr: "05:12", Sunrise: "06:31", Dhuhr: "12:12", Asr: "15:35", Maghrib: "18:43", Isha: "20:01" });
        setLoading(false);
      });
  }, []);

  const prayers = times ? [
    { name: "Fajr", arabic: "الفجر", time: times.Fajr, icon: "🌙" },
    { name: "Sunrise", arabic: "الشروق", time: times.Sunrise, icon: "🌅" },
    { name: "Dhuhr", arabic: "الظهر", time: times.Dhuhr, icon: "☀️" },
    { name: "Asr", arabic: "العصر", time: times.Asr, icon: "🌤️" },
    { name: "Maghrib", arabic: "المغرب", time: times.Maghrib, icon: "🌇" },
    { name: "Isha", arabic: "العشاء", time: times.Isha, icon: "🌙" },
  ] : [];

  const duas = [
    { arabic: "بِسْمِ اللهِ", transliteration: "Bismillah", meaning: "In the name of Allah", use: "Before eating/drinking" },
    { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah", use: "After eating" },
    { arabic: "سُبْحَانَ اللهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah", use: "Morning/Evening" },
    { arabic: "أَسْتَغْفِرُ اللهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness", use: "Anytime" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer", position: "absolute", left: 20, top: 52 }}>←</button>
        <p style={{ fontSize: 28, margin: "0 0 8px" }}>🕌</p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>Prayer Times</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Karachi · {new Date().toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {loading ? <p style={{ textAlign: "center", color: "#1C312260", padding: 40 }}>Loading prayer times...</p> : (
          <>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's prayer times</p>
            <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 20 }}>
              {prayers.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: i < prayers.length - 1 ? "1px solid #f0f0f0" : "none", background: p.name === "Fajr" ? "#1C312208" : "transparent" }}>
                  <span style={{ fontSize: 20, marginRight: 12 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "#1C312260", margin: 0, fontFamily: "serif" }}>{p.arabic}</p>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1C3123", margin: 0 }}>{p.time}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Daily duas</p>
            {duas.map((d, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, border: "1px solid #1C312210" }}>
                <p style={{ fontSize: 22, fontWeight: 600, color: "#1C3123", margin: "0 0 4px", textAlign: "right", fontFamily: "serif", direction: "rtl" }}>{d.arabic}</p>
                <p style={{ fontSize: 13, color: "#1C312270", margin: "0 0 2px", fontStyle: "italic" }}>{d.transliteration}</p>
                <p style={{ fontSize: 12, color: "#1C3123", margin: "0 0 4px", fontWeight: 500 }}>{d.meaning}</p>
                <span style={{ background: "#1C312215", color: "#1C3123", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>{d.use}</span>
              </div>
            ))}
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}