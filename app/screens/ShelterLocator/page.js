"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

const SHELTERS = [
  { name: "Edhi Foundation Home", address: "Karachi, Sindh", distance: "1.2 km", phone: "+92-21-111-33-44-55", beds: 45, available: true, type: "General", rating: 4.8 },
  { name: "Saylani Welfare Home", address: "Gulshan-e-Iqbal, Karachi", distance: "2.8 km", phone: "+92-21-34810301", beds: 30, available: true, type: "General", rating: 4.6 },
  { name: "Al-Khidmat Elderly Care", address: "North Nazimabad, Karachi", distance: "4.1 km", phone: "+92-21-36690047", beds: 20, available: false, type: "Medical", rating: 4.5 },
  { name: "Pakistan Bait ul Mal", address: "Clifton, Karachi", distance: "5.5 km", phone: "+92-21-35303381", beds: 60, available: true, type: "General", rating: 4.3 },
  { name: "Fatimid Foundation", address: "PECHS, Karachi", distance: "6.2 km", phone: "+92-21-34385001", beds: 15, available: true, type: "Medical", rating: 4.7 },
  { name: "Aman Foundation Care", address: "Malir, Karachi", distance: "7.8 km", phone: "+92-21-111-262-6", beds: 35, available: true, type: "General", rating: 4.2 },
];

export default function ShelterLocator() {
  const [filter, setFilter] = useState("All");
  const [locationGranted, setLocationGranted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const router = useRouter();

  const locateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => { setLocationGranted(true); setLocating(false); },
      () => { setLocationGranted(true); setLocating(false); }
    );
  };

  const filtered = filter === "All" ? SHELTERS
    : filter === "Available" ? SHELTERS.filter(s => s.available)
    : SHELTERS.filter(s => s.type === filter);

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "#1C3123", padding: "48px 24px 20px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 12 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🏡 Shelter Locator</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: "0 0 16px" }}>Find nearby elderly care homes in Karachi</p>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          {[["list", "📋 List"], ["map", "🗺️ Map"]].map(([id, label]) => (
            <button key={id} onClick={() => setViewMode(id)} style={{ flex: 1, padding: "9px 0", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: viewMode === id ? "#F5F2ED" : "#F5F2ED20", color: viewMode === id ? "#1C3123" : "#F5F2ED" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 0" }}>

        {/* Map view */}
        {viewMode === "map" && (
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 16, position: "relative" }}>
            {!locationGranted ? (
              <div style={{ background: "#1C3123", height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 20 }}>
                <p style={{ fontSize: 36 }}>📍</p>
                <p style={{ fontSize: 15, color: "#F5F2ED", fontWeight: 600, margin: 0 }}>Find shelters near you</p>
                <p style={{ fontSize: 12, color: "#F5F2ED70", margin: 0 }}>Enable location for accurate results</p>
                <button onClick={locateMe} disabled={locating} style={{ marginTop: 8, padding: "10px 24px", background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {locating ? "Locating..." : "📍 Use my location"}
                </button>
              </div>
            ) : (
              <div style={{ position: "relative", height: 300, borderRadius: 20, overflow: "hidden" }}>
                <iframe
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=66.9%2C24.8%2C67.2%2C25.0&layer=mapnik&marker=24.8607%2C67.0011"
                />
                <div style={{ position: "absolute", top: 10, left: 10, background: "#1C3123EE", borderRadius: 10, padding: "5px 12px" }}>
                  <p style={{ fontSize: 11, color: "#F5F2ED", margin: 0, fontWeight: 600 }}>📍 Karachi shelters</p>
                </div>
                <a href="https://www.openstreetmap.org/?mlat=24.8607&mlon=67.0011#map=13/24.8607/67.0011"
                  target="_blank" rel="noreferrer"
                  style={{ position: "absolute", bottom: 10, right: 10, background: "#F5F2ED", borderRadius: 10, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#1C3123", textDecoration: "none" }}>
                  Open full map ↗
                </a>
              </div>
            )}
          </div>
        )}

        {/* Partnership banner */}
        <button onClick={() => router.push("/screens/Partnership")}
          style={{ width: "100%", padding: "12px 16px", background: "#FAEEDA", color: "#633806", border: "1px solid #FAC77560", borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🏅 Own a shelter home? Get verified</span>
          <span style={{ fontSize: 16 }}>→</span>
        </button>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[[SHELTERS.length, "Total"], [SHELTERS.filter(s => s.available).length, "Available"], [SHELTERS.filter(s => s.type === "Medical").length, "Medical"]].map(([val, label]) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "10px 0", textAlign: "center", border: "1px solid #1C312210" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#1C3123", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: "#1C312260", margin: "2px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
          {["All", "Available", "General", "Medical"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? "#1C3123" : "#fff", color: filter === f ? "#F5F2ED" : "#1C312270" }}>{f}</button>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>{filtered.length} shelters found</p>

        {/* Shelter list */}
        {filtered.map((shelter, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ flex: 1, marginRight: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: 0 }}>{shelter.name}</p>
                </div>
                <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 2px" }}>📍 {shelter.address}</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#1C312260" }}>🚶 {shelter.distance}</span>
                  <span style={{ fontSize: 11, color: "#1C312260" }}>🛏️ {shelter.beds} beds</span>
                  <span style={{ fontSize: 11, color: "#1C312260" }}>⭐ {shelter.rating}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ background: shelter.available ? "#dcfce7" : "#fef2f2", color: shelter.available ? "#166534" : "#ef4444", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {shelter.available ? "✓ Available" : "✗ Full"}
                </span>
                <span style={{ background: "#E6F1FB", color: "#0C447C", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>
                  {shelter.type}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`tel:${shelter.phone}`}
                style={{ flex: 1, padding: "10px 0", background: "#1C3123", color: "#F5F2ED", borderRadius: 12, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
                📞 Call
              </a>
              <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(shelter.name + " " + shelter.address)}`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: "10px 0", background: "#F5F2ED", color: "#1C3123", borderRadius: 12, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none", border: "1px solid #1C312215" }}>
                🗺️ Directions
              </a>
              <button
                style={{ flex: 1, padding: "10px 0", background: shelter.available ? "#E1F5EE" : "#f3f4f6", color: shelter.available ? "#085041" : "#6b7280", borderRadius: 12, fontSize: 12, fontWeight: 600, border: "none", cursor: shelter.available ? "pointer" : "not-allowed" }}>
                {shelter.available ? "✓ Book" : "✗ Full"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <ElderlyNav />
    </main>
  );
}