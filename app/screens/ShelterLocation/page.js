"use client";
import { useEffect, useState, useRef } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

const PIN_ICON = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const CLOCK_ICON = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PHONE_ICON = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.07 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.22 16z" />
    </svg>
);

const BED_ICON = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5" />
        <path d="M2 22v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
        <path d="M6 15v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <line x1="2" y1="22" x2="22" y2="22" />
    </svg>
);

const NAV_ICON = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

const FILTER_ICON = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);

const SEARCH_ICON = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1C312260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ELDER_ICON = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
        <line x1="9" y1="17" x2="8" y2="21" />
        <line x1="15" y1="17" x2="16" y2="21" />
    </svg>
);

// Real old age homes in Karachi, Pakistan with actual coordinates
const shelters = [
    {
        id: 1,
        name: "Edhi Home for the Elderly",
        address: "Edhi Village, Sohrab Goth, Karachi",
        distance: "3.2 km",
        beds: "40 / 60",
        phone: "+92 21 3256 1122",
        hours: "24 hours",
        status: "Available",
        statusColor: "#166534",
        statusBg: "#dcfce7",
        type: "General",
        typeBg: "#f3f4f6",
        typeColor: "#374151",
        lat: 24.9418,
        lng: 67.0637,
        care: "Basic Care",
    },
    {
        id: 2,
        name: "Dar-ul-Sukoon",
        address: "32-C, Block 2, PECHS, Karachi",
        distance: "5.8 km",
        beds: "25 / 40",
        phone: "+92 21 3432 0073",
        hours: "24 hours",
        status: "Available",
        statusColor: "#166534",
        statusBg: "#dcfce7",
        type: "Special Needs",
        typeBg: "#dbeafe",
        typeColor: "#1e40af",
        lat: 24.8697,
        lng: 67.0647,
        care: "Specialized Care",
    },
    {
        id: 3,
        name: "Umeed Old Age Home",
        address: "Block 13-D, Gulshan-e-Iqbal, Karachi",
        distance: "7.1 km",
        beds: "0 / 20",
        phone: "+92 21 3498 7654",
        hours: "8AM - 10PM",
        status: "Full",
        statusColor: "#92400e",
        statusBg: "#fef3c7",
        type: "Women",
        typeBg: "#fce7f3",
        typeColor: "#9d174d",
        lat: 24.9269,
        lng: 67.1108,
        care: "Full-Time Care",
    },
    {
        id: 4,
        name: "Aman Old Age Home",
        address: "Korangi Industrial Area, Karachi",
        distance: "9.4 km",
        beds: "18 / 30",
        phone: "+92 21 3511 2233",
        hours: "24 hours",
        status: "Available",
        statusColor: "#166534",
        statusBg: "#dcfce7",
        type: "Men",
        typeBg: "#ede9fe",
        typeColor: "#5b21b6",
        lat: 24.8278,
        lng: 67.1264,
        care: "Basic Care",
    },
    {
        id: 5,
        name: "Khidmat Old Age Welfare",
        address: "Nazimabad No. 3, Karachi",
        distance: "4.6 km",
        beds: "12 / 15",
        phone: "+92 21 3662 8899",
        hours: "24 hours",
        status: "Available",
        statusColor: "#166534",
        statusBg: "#dcfce7",
        type: "General",
        typeBg: "#f3f4f6",
        typeColor: "#374151",
        lat: 24.9101,
        lng: 67.0399,
        care: "Medical Support",
    },
];

const FILTERS = ["All", "General", "Women", "Men", "Special Needs"];

// Leaflet map component loaded dynamically (SSR-safe)
function LiveMap({ shelters, selectedId, onSelectPin }) {
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Dynamically load Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        import("leaflet").then((L) => {
            if (leafletMapRef.current) return;

            const map = L.map(mapRef.current, {
                center: [24.8697, 67.0564],
                zoom: 12,
                zoomControl: true,
                scrollWheelZoom: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            leafletMapRef.current = map;

            shelters.forEach((s) => {
                const isAvailable = s.status === "Available";

                const iconHtml = `
          <div style="
            width: 32px;
            height: 32px;
            background: ${isAvailable ? "#1C3123" : "#92400e"};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #F5F2ED;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
          </div>
        `;

                const icon = L.divIcon({
                    html: iconHtml,
                    className: "",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -36],
                });

                const marker = L.marker([s.lat, s.lng], { icon })
                    .addTo(map)
                    .bindPopup(
                        `<div style="font-family:sans-serif;min-width:160px">
              <strong style="color:#1C3123;font-size:13px">${s.name}</strong><br/>
              <span style="color:#666;font-size:11px">${s.address}</span><br/>
              <span style="
                display:inline-block;
                margin-top:6px;
                background:${isAvailable ? "#dcfce7" : "#fef3c7"};
                color:${isAvailable ? "#166534" : "#92400e"};
                padding:2px 8px;
                border-radius:999px;
                font-size:11px;
                font-weight:600;
              ">${s.status}</span>
            </div>`,
                        { closeButton: false }
                    );

                marker.on("click", () => onSelectPin(s.id));
                markersRef.current.push({ id: s.id, marker });
            });
        });

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    // Fly to selected shelter
    useEffect(() => {
        if (!leafletMapRef.current || !selectedId) return;
        import("leaflet").then((L) => {
            const target = shelters.find((s) => s.id === selectedId);
            if (!target) return;
            leafletMapRef.current.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
            const found = markersRef.current.find((m) => m.id === selectedId);
            if (found) found.marker.openPopup();
        });
    }, [selectedId]);

    return (
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: 200,
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid #1C312210",
                marginBottom: 16,
                zIndex: 0,
            }}
        />
    );
}

export default function ShelterLocation() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);
    const [selectedMapId, setSelectedMapId] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) setUser(u);
            else router.push("/screens/LoginScreen");
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Delay map mount slightly for layout stability
    useEffect(() => {
        const t = setTimeout(() => setMapReady(true), 300);
        return () => clearTimeout(t);
    }, []);

    if (loading)
        return (
            <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#F5F2ED", fontFamily: "sans-serif" }}>Loading...</p>
            </main>
        );

    const filtered = shelters.filter((s) => {
        const matchFilter = activeFilter === "All" || s.type === activeFilter;
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const totalBeds = shelters.reduce((acc, s) => {
        const total = parseInt(s.beds.split("/")[1]);
        return acc + total;
    }, 0);

    const availableCount = shelters.filter((s) => s.status === "Available").length;

    return (
        <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 90 }}>

            {/* Header */}
            <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px", letterSpacing: 0.3 }}>Elderly Care</p>
                        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>Old Age Homes</h1>
                        <p style={{ fontSize: 12, color: "#F5F2ED60", margin: "4px 0 0" }}>Karachi, Pakistan</p>
                    </div>
                    <div style={{ background: "#F5F2ED15", borderRadius: 14, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F2ED" }}>
                        {PIN_ICON}
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 22 }}>
                    {[
                        [String(shelters.length), "Homes"],
                        [String(totalBeds), "Total Beds"],
                        [String(availableCount), "Available"],
                    ].map(([val, label]) => (
                        <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: "12px 10px" }}>
                            <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
                            <p style={{ fontSize: 10, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 20px 0" }}>

                {/* Search */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #1C312212", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", marginBottom: 14 }}>
                    {SEARCH_ICON}
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#1C3123", background: "transparent", padding: "13px 0", fontFamily: "sans-serif" }}
                    />
                    <div style={{ color: "#1C312240" }}>{FILTER_ICON}</div>
                </div>

                {/* Filter Chips */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", marginBottom: 16 }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            style={{
                                background: activeFilter === f ? "#1C3123" : "#fff",
                                color: activeFilter === f ? "#F5F2ED" : "#1C312280",
                                border: activeFilter === f ? "none" : "1px solid #1C312218",
                                borderRadius: 999,
                                padding: "7px 16px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                fontFamily: "sans-serif",
                                transition: "all 0.2s",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Live Map */}
                {mapReady && (
                    <LiveMap
                        shelters={shelters}
                        selectedId={selectedMapId}
                        onSelectPin={(id) => {
                            setSelectedMapId(id);
                            setExpanded(id);
                        }}
                    />
                )}

                {/* Map hint */}
                <p style={{ fontSize: 11, color: "#1C312250", textAlign: "center", margin: "-8px 0 16px", letterSpacing: 0.2 }}>
                    Tap a card to locate on map. Tap a pin for details.
                </p>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div style={{ background: "#fff", borderRadius: 18, padding: 24, textAlign: "center", border: "1px solid #1C312210" }}>
                        <p style={{ color: "#1C312260", fontSize: 14, margin: 0 }}>No homes found for your search.</p>
                    </div>
                )}

                {/* Shelter Cards */}
                {filtered.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => {
                            setExpanded(expanded === s.id ? null : s.id);
                            setSelectedMapId(s.id);
                        }}
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 10,
                            border: expanded === s.id ? "1.5px solid #1C312240" : "1px solid #1C312210",
                            cursor: "pointer",
                            transition: "box-shadow 0.2s, border 0.2s",
                            boxShadow: expanded === s.id ? "0 4px 20px #1C312318" : "none",
                        }}
                    >
                        {/* Top Row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1, paddingRight: 10 }}>
                                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                                    <span style={{ background: s.typeBg, color: s.typeColor, fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, letterSpacing: 0.3 }}>
                                        {s.type}
                                    </span>
                                    <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>
                                        {s.care}
                                    </span>
                                </div>
                                <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 3px", color: "#1C3123" }}>{s.name}</p>
                                <p style={{ fontSize: 12, color: "#1C312265", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ color: "#1C312250" }}>{PIN_ICON}</span>
                                    {s.address}
                                </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <span style={{ background: s.statusBg, color: s.statusColor, fontSize: 11, padding: "5px 10px", borderRadius: 999, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>
                                    {s.status}
                                </span>
                                <p style={{ fontSize: 12, color: "#1C312270", margin: 0, fontWeight: 600 }}>{s.distance}</p>
                            </div>
                        </div>

                        {/* Meta Row */}
                        <div style={{ display: "flex", gap: 14, marginTop: 12, paddingTop: 12, borderTop: "1px solid #1C312208" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#1C312260", fontSize: 12 }}>
                                <span style={{ color: "#1C312260" }}>{BED_ICON}</span>
                                {s.beds} beds
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#1C312260", fontSize: 12 }}>
                                <span style={{ color: "#1C312260" }}>{CLOCK_ICON}</span>
                                {s.hours}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#1C312260", fontSize: 12 }}>
                                <span style={{ color: "#1C312260" }}>{ELDER_ICON}</span>
                                Elderly
                            </div>
                        </div>

                        {/* Expanded */}
                        {expanded === s.id && (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1C312210" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#1C312270", fontSize: 12, marginBottom: 12 }}>
                                    <span style={{ color: "#1C312260" }}>{PHONE_ICON}</span>
                                    {s.phone}
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <a
                                        href={`tel:${s.phone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            flex: 1,
                                            background: "#1C3123",
                                            color: "#F5F2ED",
                                            border: "none",
                                            borderRadius: 12,
                                            padding: "11px 0",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontFamily: "sans-serif",
                                            textAlign: "center",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <span style={{ color: "#F5F2ED" }}>{PHONE_ICON}</span>
                                        Call Now
                                    </a>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            flex: 1,
                                            background: "#F5F2ED",
                                            color: "#1C3123",
                                            border: "1px solid #1C312218",
                                            borderRadius: 12,
                                            padding: "11px 0",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontFamily: "sans-serif",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <span style={{ color: "#1C3123" }}>{NAV_ICON}</span>
                                        Directions
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <BottomNav />
        </main>
    );
}

