"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DonorDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
      } else router.push("/screens/LoginScreen");
    });
    return () => unsub();
  }, []);

  const campaigns = [
    { title: "Winter care packages", raised: 45000, goal: 100000, donors: 34, urgent: true },
    { title: "Medical equipment fund", raised: 82000, goal: 150000, donors: 67, urgent: false },
    { title: "Shelter renovation", raised: 28000, goal: 50000, donors: 21, urgent: true },
  ];

  const myDonations = [
    { campaign: "Medical equipment fund", amount: 5000, date: "Apr 15, 2026" },
    { campaign: "Winter care packages", amount: 2500, date: "Mar 28, 2026" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 13, color: "#F5F2ED80", margin: "0 0 4px" }}>Donor 💛</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{profile?.name || "Welcome"}</h1>
            <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "4px 0 0" }}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "#F5F2ED15", border: "none", color: "#F5F2ED", padding: "8px 14px", borderRadius: 12, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          {[["Rs 7,500", "Total donated"], ["2", "Campaigns supported"]].map(([val, label]) => (
            <div key={label} style={{ background: "#F5F2ED15", borderRadius: 14, padding: 14 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{val}</p>
              <p style={{ fontSize: 11, color: "#F5F2ED70", margin: "3px 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Active campaigns</p>
        {campaigns.map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: 0, flex: 1 }}>{c.title}</p>
              {c.urgent && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600, marginLeft: 8 }}>Urgent</span>}
            </div>
            <div style={{ background: "#F5F2ED", borderRadius: 999, height: 6, marginBottom: 8, overflow: "hidden" }}>
              <div style={{ width: `${Math.round((c.raised / c.goal) * 100)}%`, height: "100%", background: "#1C3123", borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>Rs {c.raised.toLocaleString()} raised</p>
              <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>{Math.round((c.raised / c.goal) * 100)}% of Rs {c.goal.toLocaleString()}</p>
            </div>
            <button style={{ width: "100%", padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              💛 Donate now
            </button>
          </div>
        ))}

        <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "16px 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>My donations</p>
        {myDonations.map((d, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "1px solid #1C312210", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: "0 0 3px" }}>{d.campaign}</p>
              <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>{d.date}</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {d.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}