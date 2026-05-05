"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import DonorNav from "../../components/DonorNav";

export default function DonorDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
        const donations = await getDocs(query(collection(db, "donations"), where("userId", "==", u.uid)));
        let total = 0;
        donations.forEach(d => total += (d.data().amount || 0));
        setTotalDonated(total);
        setDonationCount(donations.size);
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const campaigns = [
    { title: "Winter care packages", raised: 45000, goal: 100000, urgent: true },
    { title: "Medical equipment fund", raised: 82000, goal: 150000, urgent: false },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 6px" }}>Donor Dashboard 💛</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
<img src="/logo.png" alt="Kafeel" width={32} height={32} style={{ objectFit: "contain" }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{profile?.name || "Welcome"}</h1>
            </div>
            <p style={{ fontSize: 11, color: "#F5F2ED50", margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))}
            style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>
            Log out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          {[[`Rs ${totalDonated.toLocaleString()}`, "Total donated"], [donationCount, "Donations made"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 14 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 11, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Featured campaigns</p>
        {campaigns.map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: 0 }}>{c.title}</p>
              {c.urgent && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>Urgent</span>}
            </div>
            <div style={{ background: "#F5F2ED", borderRadius: 999, height: 6, marginBottom: 8, overflow: "hidden" }}>
              <div style={{ width: `${Math.round((c.raised / c.goal) * 100)}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
            </div>
            <p style={{ fontSize: 12, color: "#1C312260", margin: "0 0 10px" }}>
              Rs {c.raised.toLocaleString()} of Rs {c.goal.toLocaleString()} · {Math.round((c.raised / c.goal) * 100)}%
            </p>
            <button onClick={() => router.push("/screens/DonatePage")}
              style={{ width: "100%", padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              💛 Donate now
            </button>
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "📊", label: "My Giving", route: "/screens/MyGiving", color: "#E1F5EE" },
            { icon: "🏡", label: "Campaigns", route: "/screens/Campaigns", color: "#FAEEDA" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.route)}
              style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #1C312210", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>
      <DonorNav />
    </main>
  );
}