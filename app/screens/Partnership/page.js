"use client";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Partnership() {
  const [tab, setTab] = useState("shelter");
  const [shelterName, setShelterName] = useState("");
  const [shelterAddress, setShelterAddress] = useState("");
  const [shelterPhone, setShelterPhone] = useState("");
  const [shelterBeds, setShelterBeds] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [volunteerPremium, setVolunteerPremium] = useState(false);
  const [vPlan, setVPlan] = useState("monthly");
  const router = useRouter();

  const shelterPlans = [
    { id: "monthly", label: "Monthly", price: "Rs 2,000/mo", perks: ["✓ Verified badge", "✓ Featured in list", "✓ Priority visibility", "✓ Admin support"] },
    { id: "yearly", label: "Yearly", price: "Rs 18,000/yr", perks: ["✓ All monthly perks", "✓ 25% savings", "✓ Premium placement", "✓ Analytics dashboard"] },
  ];

  const volunteerPlans = [
    { id: "monthly", label: "Monthly", price: "Rs 500/mo", perks: ["✓ Premium badge", "✓ Priority task access", "✓ Early notifications", "✓ Impact certificate"] },
    { id: "yearly", label: "Yearly", price: "Rs 4,800/yr", perks: ["✓ All monthly perks", "✓ 20% savings", "✓ Exclusive events", "✓ Kafeel ambassador title"] },
  ];

  const submitShelter = async () => {
    if (!shelterName || !shelterAddress || !shelterPhone) return;
    setLoading(true);
    await addDoc(collection(db, "partnershipRequests"), {
      type: "shelter", shelterName, shelterAddress, shelterPhone, shelterBeds, plan,
      userId: auth.currentUser?.uid || "guest",
      status: "pending", createdAt: serverTimestamp()
    });
    setLoading(false); setSuccess(true);
  };

  const submitVolunteer = async () => {
    setLoading(true);
    await addDoc(collection(db, "partnershipRequests"), {
      type: "volunteer_premium", plan: vPlan,
      userId: auth.currentUser?.uid || "guest",
      status: "pending", createdAt: serverTimestamp()
    });
    setLoading(false); setVolunteerPremium(true);
  };

  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  if (success) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <p style={{ fontSize: 60, margin: "0 0 16px" }}>🏆</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 10px", textAlign: "center" }}>Partnership request sent!</h2>
      <p style={{ fontSize: 14, color: "#1C312270", textAlign: "center", lineHeight: 1.6, margin: "0 0 28px" }}>Our team will review your request and get back to you within 24–48 hours with payment instructions.</p>
      <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #1C312210", width: "100%", marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 8px" }}>What happens next?</p>
        {["Our admin reviews your request", "You receive a payment link via WhatsApp", "After payment, your badge goes live within 2 hours"].map((s, i) => (
          <p key={i} style={{ fontSize: 13, color: "#1C312270", margin: "0 0 6px", display: "flex", gap: 8 }}>
            <span style={{ background: "#1C3123", color: "#F5F2ED", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            {s}
          </p>
        ))}
      </div>
      <button onClick={() => router.back()} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Go back</button>
    </main>
  );

  if (volunteerPremium) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <p style={{ fontSize: 60, margin: "0 0 16px" }}>⭐</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 10px", textAlign: "center" }}>Premium request sent!</h2>
      <p style={{ fontSize: 14, color: "#1C312270", textAlign: "center", lineHeight: 1.6, margin: "0 0 28px" }}>You'll receive payment instructions via WhatsApp within 24 hours. Your premium badge will activate immediately after payment.</p>
      <button onClick={() => router.back()} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Go back</button>
    </main>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 16 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🤝 Partnership & Premium</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Get verified and grow with Kafeel</p>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[["shelter", "🏡 Shelter"], ["volunteer", "🌟 Volunteer"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "10px 0", borderRadius: 14, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === id ? "#F5F2ED" : "#F5F2ED20", color: tab === id ? "#1C3123" : "#F5F2ED" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {tab === "shelter" && (
          <>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>🏅 Shelter Partnership</p>
              <p style={{ fontSize: 13, color: "#1C312270", margin: 0, lineHeight: 1.5 }}>Get your shelter home verified and featured prominently in the Kafeel elderly locator. Build trust with families looking for care.</p>
            </div>

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Choose plan</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {shelterPlans.map(p => (
                <div key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? "#1C3123" : "#fff", borderRadius: 18, padding: 16, border: plan === p.id ? "2px solid #1C3123" : "1.5px solid #1C312215", cursor: "pointer" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: plan === p.id ? "#F5F2ED" : "#1C3123", margin: "0 0 4px" }}>{p.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: plan === p.id ? "#F5F2ED" : "#1C3123", margin: "0 0 10px" }}>{p.price}</p>
                  {p.perks.map((perk, i) => <p key={i} style={{ fontSize: 11, color: plan === p.id ? "#F5F2ED80" : "#1C312260", margin: "0 0 3px" }}>{perk}</p>)}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Shelter details</p>
            <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
              {[["Shelter name", "text", "e.g. Al-Khidmat Home", shelterName, setShelterName], ["Address", "text", "Full address", shelterAddress, setShelterAddress], ["Contact number", "tel", "+92 21 ...", shelterPhone, setShelterPhone], ["Number of beds", "number", "e.g. 30", shelterBeds, setShelterBeds]].map(([label, type, ph, val, set]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
                  <input style={inp} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                </div>
              ))}
            </div>

            <button onClick={submitShelter} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Apply for partnership →"}
            </button>
          </>
        )}

        {tab === "volunteer" && (
          <>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #1C312210", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 4px" }}>⭐ Volunteer Premium</p>
              <p style={{ fontSize: 13, color: "#1C312270", margin: 0, lineHeight: 1.5 }}>Stand out as a premium volunteer. Get a badge, priority access to the best tasks, and exclusive opportunities from partner organizations.</p>
            </div>

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Choose plan</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {volunteerPlans.map(p => (
                <div key={p.id} onClick={() => setVPlan(p.id)} style={{ background: vPlan === p.id ? "#1C3123" : "#fff", borderRadius: 18, padding: 16, border: vPlan === p.id ? "2px solid #1C3123" : "1.5px solid #1C312215", cursor: "pointer" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: vPlan === p.id ? "#F5F2ED" : "#1C3123", margin: "0 0 4px" }}>{p.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: vPlan === p.id ? "#F5F2ED" : "#1C3123", margin: "0 0 10px" }}>{p.price}</p>
                  {p.perks.map((perk, i) => <p key={i} style={{ fontSize: 11, color: vPlan === p.id ? "#F5F2ED80" : "#1C312260", margin: "0 0 3px" }}>{perk}</p>)}
                </div>
              ))}
            </div>

            <button onClick={submitVolunteer} disabled={loading} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Apply for premium →"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}