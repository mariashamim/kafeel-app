"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

const SHELTERS = [
  { name: "Edhi Foundation Home", address: "Karachi, Sindh", distance: "1.2 km", phone: "+92-21-111-33-44-55", beds: 45, available: true },
  { name: "Saylani Welfare Home", address: "Gulshan-e-Iqbal, Karachi", distance: "2.8 km", phone: "+92-21-34810301", beds: 30, available: true },
  { name: "Al-Khidmat Elderly Care", address: "North Nazimabad, Karachi", distance: "4.1 km", phone: "+92-21-36690047", beds: 20, available: false },
  { name: "Pakistan Bait ul Mal", address: "Clifton, Karachi", distance: "5.5 km", phone: "+92-21-35303381", beds: 60, available: true },
  { name: "Fatimid Foundation", address: "PECHS, Karachi", distance: "6.2 km", phone: "+92-21-34385001", beds: 15, available: true },
];

export default function ElderlyDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [locating, setLocating] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
      } else router.push("/screens/LoginScreen");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const locateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(() => {
      setLocationGranted(true);
      setLocating(false);
    }, () => {
      setLocating(false);
      alert("Location access denied. Showing default Karachi shelters.");
      setLocationGranted(true);
    });
  };

  if (loading) return <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#F5F2ED", fontFamily: "sans-serif" }}>Loading...</p></main>;

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Good morning 👋</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{profile?.name || "Welcome"}</h1>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "4px 0 0" }}>Elderly user · {user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[["home", "🏠 Home"], ["shelters", "🏡 Shelters"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "8px 16px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === id ? "#F5F2ED" : "#F5F2ED20", color: tab === id ? "#1C3123" : "#F5F2ED" }}>{label}</button>
          ))}
        </div>
      </div>

      {tab === "home" && (
        <div style={{ padding: "20px 20px 0" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["💊", "Medications", "2 pending"], ["❤️", "Vitals", "Normal"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #1C312210" }}>
                <p style={{ fontSize: 22, margin: "0 0 6px" }}>{icon}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: 0 }}>{val}</p>
                <p style={{ fontSize: 11, color: "#1C312260", margin: "2px 0 0" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Quick actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { icon: "💊", label: "Medications", route: "/screens/MedicationList" },
              { icon: "🩺", label: "Appointments", route: "/screens/AppointmentsList" },
              { icon: "❤️", label: "Vitals", route: "/screens/VitalsTracker" },
              { icon: "👤", label: "Profile", route: "/screens/Profile" },
            ].map(item => (
              <button key={item.label} onClick={() => router.push(item.route)}
                style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
                <p style={{ fontSize: 24, margin: "0 0 8px" }}>{item.icon}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{item.label}</p>
              </button>
            ))}
          </div>

          {/* SOS */}
          <button onClick={() => router.push("/screens/SOS")} style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", borderRadius: 18, padding: "18px 0", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
            🚨 Emergency SOS
          </button>
        </div>
      )}

      {tab === "shelters" && (
        <div style={{ padding: "20px 20px 0" }}>
          {/* Map placeholder */}
          <div style={{ background: "#1C3123", borderRadius: 18, overflow: "hidden", marginBottom: 16, position: "relative", height: 200 }}>
            {!locationGranted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <p style={{ fontSize: 32 }}>📍</p>
                <p style={{ fontSize: 14, color: "#F5F2ED", fontWeight: 600, margin: 0 }}>Find shelters near you</p>
                <button onClick={locateMe} disabled={locating}
                  style={{ padding: "10px 20px", background: "#F5F2ED", color: "#1C3123", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {locating ? "Locating..." : "Use my location"}
                </button>
              </div>
            ) : (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <iframe
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
  src="https://www.openstreetmap.org/export/embed.html?bbox=66.9%2C24.8%2C67.2%2C25.0&layer=mapnik&marker=24.8607%2C67.0011"
/>
                <div style={{ position: "absolute", top: 10, left: 10, background: "#1C3123", borderRadius: 8, padding: "4px 10px" }}>
                  <p style={{ fontSize: 11, color: "#F5F2ED", margin: 0, fontWeight: 600 }}>📍 Karachi shelters</p>
                </div>
              </div>
            )}
          </div>

          {/* Shelter list */}
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Nearby shelter homes</p>
          {SHELTERS.map((shelter, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 3px" }}>{shelter.name}</p>
                  <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 3px" }}>📍 {shelter.address}</p>
                  <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>🚶 {shelter.distance} away · 🛏️ {shelter.beds} beds</p>
                </div>
                <span style={{ background: shelter.available ? "#dcfce7" : "#fef2f2", color: shelter.available ? "#166534" : "#ef4444", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                  {shelter.available ? "Available" : "Full"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={`tel:${shelter.phone}`} style={{ flex: 1, padding: "10px 0", background: "#1C3123", color: "#F5F2ED", borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>📞 Call</a>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(shelter.name + " " + shelter.address)}`} target="_blank" rel="noreferrer"
                  style={{ flex: 1, padding: "10px 0", background: "#F5F2ED", color: "#1C3123", borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none", border: "1px solid #1C312215" }}>🗺️ Directions</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}