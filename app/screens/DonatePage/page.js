"use client";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import DonorNav from "../../components/DonorNav";

export default function DonatePage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [custom, setCustom] = useState("");
  const [campaign, setCampaign] = useState("Winter care packages");
  const [method, setMethod] = useState(null);
  const [mobileNum, setMobileNum] = useState("");
  const [mpin, setMpin] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txnId] = useState("KFL" + Date.now().toString().slice(-8));
  const router = useRouter();

  const presets = [500, 1000, 2500, 5000];
  const finalAmount = amount || custom;

  const campaigns = [
    { id: "winter", name: "Winter care packages", icon: "🧥", raised: 45000, goal: 100000, urgent: true, desc: "Warm clothes & blankets for elderly" },
    { id: "medical", name: "Medical equipment fund", icon: "🏥", raised: 82000, goal: 150000, urgent: false, desc: "Wheelchairs, hearing aids & medicine" },
    { id: "shelter", name: "Shelter renovation", icon: "🏡", raised: 28000, goal: 50000, urgent: true, desc: "Repair & improve shelter facilities" },
    { id: "meals", name: "Daily meals program", icon: "🍱", raised: 15000, goal: 30000, urgent: false, desc: "3 meals a day for 50 elderly" },
  ];

  const methods = [
    { id: "jazzcash", name: "JazzCash", color: "#E8192C", bg: "#fff0f1", logo: "🔴", desc: "Mobile wallet · Instant transfer" },
    { id: "easypaisa", name: "EasyPaisa", color: "#4CAF50", bg: "#f0fff1", logo: "🟢", desc: "Mobile wallet · Instant transfer" },
    { id: "card", name: "Debit / Credit Card", color: "#1C3123", bg: "#f0f4f1", logo: "💳", desc: "Visa · Mastercard · UnionPay" },
    { id: "bank", name: "Bank Transfer", color: "#0C447C", bg: "#f0f4fb", logo: "🏦", desc: "Direct transfer · 1–2 hours" },
  ];

  const formatCard = val => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = val => val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[i] = val.slice(-1);
    setOtp(updated);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const processPayment = async () => {
    setError("");
    if ((method === "jazzcash" || method === "easypaisa") && (!mobileNum || mobileNum.length < 10)) return setError("Please enter a valid 11-digit mobile number.");
    if ((method === "jazzcash" || method === "easypaisa") && mpin.length < 4) return setError("Please enter your 4-digit MPIN.");
    if (method === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) return setError("Please enter a valid 16-digit card number.");
      if (!cardName) return setError("Please enter the cardholder name.");
      if (cardExpiry.length < 5) return setError("Please enter a valid expiry date.");
      if (cardCvv.length < 3) return setError("Please enter your CVV.");
    }
    if (method === "bank" && !mobileNum) return setError("Please enter your mobile number for reference.");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    if (method === "bank") setStep(5);
    else setStep(4);
  };

  const verifyOtp = async () => {
    setError("");
    if (otp.some(d => d === "")) return setError("Please enter the complete 6-digit OTP.");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    try {
      if (auth.currentUser) {
        await addDoc(collection(db, "donations"), {
          userId: auth.currentUser.uid,
          amount: Number(finalAmount),
          campaign, method, txnId,
          status: "completed",
          createdAt: serverTimestamp()
        });
      }
    } catch (e) { console.log(e); }
    setLoading(false);
    setStep(5);
  };

  const selectedCampaign = campaigns.find(c => c.name === campaign);
  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  // Step indicators
  const StepBar = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
      {["Amount", "Method", "Details", "OTP"].map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "#1C3123" : step === i + 1 ? "#1C3123" : "#1C312220", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step >= i + 1 ? "#F5F2ED" : "#1C312260" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <p style={{ fontSize: 9, color: step >= i + 1 ? "#1C3123" : "#1C312240", margin: 0, fontWeight: step === i + 1 ? 600 : 400, whiteSpace: "nowrap" }}>{label}</p>
          </div>
          {i < 3 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#1C3123" : "#1C312220", margin: "0 4px", marginBottom: 14 }} />}
        </div>
      ))}
    </div>
  );

  // SUCCESS SCREEN
  if (step === 5) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 32px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 6px" }}>
          {method === "bank" ? "Transfer confirmed!" : "Payment successful!"}
        </h2>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>
          {method === "bank" ? "We'll verify your transfer within 2 hours" : "Your donation has been received"}
        </p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Receipt card */}
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #1C312210", marginBottom: 16 }}>
          <div style={{ background: "#1C312208", padding: "14px 18px", borderBottom: "1px solid #1C312210" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: 0 }}>Donation Receipt</p>
              <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>Completed</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            {[
              ["Transaction ID", txnId],
              ["Amount", `Rs ${Number(finalAmount).toLocaleString()}`],
              ["Campaign", selectedCampaign?.name],
              ["Payment method", methods.find(m => m.id === method)?.name],
              ["Date", new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })],
              ["Status", method === "bank" ? "Pending verification" : "Confirmed"],
            ].map(([label, val], i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: 0, textAlign: "right", maxWidth: "55%" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact card */}
        <div style={{ background: "#E1F5EE", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #9FE1CB" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#085041", margin: "0 0 6px" }}>💚 Your impact</p>
          <p style={{ fontSize: 13, color: "#085041", margin: 0, lineHeight: 1.5 }}>
            Rs {Number(finalAmount).toLocaleString()} can provide {Math.floor(Number(finalAmount) / 250)} meals, {Math.floor(Number(finalAmount) / 1500)} blankets, or {Math.floor(Number(finalAmount) / 3000)} medical checkups for elderly in need.
          </p>
        </div>

        {method === "bank" && (
          <div style={{ background: "#fffbeb", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #fde68a" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: "0 0 6px" }}>⏳ Pending verification</p>
            <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.5 }}>Our team will verify your bank transfer within 1–2 hours and send you a confirmation SMS.</p>
          </div>
        )}

        <button onClick={() => router.push("/screens/DonorDashboard")}
          style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          Back to dashboard
        </button>
        <button onClick={() => { setStep(1); setAmount(""); setCustom(""); setOtp(["","","","","",""]); setMpin(""); setMobileNum(""); setCardNum(""); setCardName(""); setCardExpiry(""); setCardCvv(""); }}
          style={{ width: "100%", padding: 14, background: "transparent", color: "#1C3123", border: "1px solid #1C312220", borderRadius: 16, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Donate again 💛
        </button>
      </div>
      <DonorNav />
    </main>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        {step > 1 && <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 22, cursor: "pointer", marginBottom: 8 }}>←</button>}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>💛 Donate</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>
          {step === 1 ? "Choose a cause to support" : step === 2 ? "How would you like to pay?" : step === 3 ? "Enter your payment details" : "Confirm your donation"}
        </p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <StepBar />

        {/* ─── STEP 1: Amount & Campaign ─── */}
        {step === 1 && (
          <>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Choose a campaign</p>
            {campaigns.map((c, i) => (
              <div key={i} onClick={() => setCampaign(c.name)}
                style={{ background: campaign === c.name ? "#1C3123" : "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: campaign === c.name ? "2px solid #1C3123" : "1.5px solid #1C312215", cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: campaign === c.name ? "#F5F2ED20" : "#F5F2ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: campaign === c.name ? "#F5F2ED" : "#1C3123", margin: 0 }}>{c.name}</p>
                    {c.urgent && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 9, padding: "2px 6px", borderRadius: 999, fontWeight: 600 }}>Urgent</span>}
                  </div>
                  <p style={{ fontSize: 11, color: campaign === c.name ? "#F5F2ED70" : "#1C312260", margin: "0 0 6px" }}>{c.desc}</p>
                  <div style={{ background: campaign === c.name ? "#F5F2ED20" : "#F5F2ED", borderRadius: 999, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round((c.raised / c.goal) * 100)}%`, height: "100%", background: campaign === c.name ? "#F5F2ED" : "#1C3123", borderRadius: 999 }} />
                  </div>
                  <p style={{ fontSize: 10, color: campaign === c.name ? "#F5F2ED60" : "#1C312250", margin: "3px 0 0" }}>Rs {c.raised.toLocaleString()} raised of Rs {c.goal.toLocaleString()}</p>
                </div>
              </div>
            ))}

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "16px 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Select amount</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {presets.map(p => (
                <button key={p} onClick={() => { setAmount(p); setCustom(""); }}
                  style={{ padding: "14px 0", borderRadius: 14, border: amount === p ? "none" : "1.5px solid #1C312215", fontSize: 15, fontWeight: 700, cursor: "pointer", background: amount === p ? "#1C3123" : "#fff", color: amount === p ? "#F5F2ED" : "#1C3123" }}>
                  Rs {p.toLocaleString()}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#1C312260", fontWeight: 500 }}>Rs</span>
              <input placeholder="Enter custom amount" value={custom} type="number"
                onChange={e => { setCustom(e.target.value); setAmount(""); }}
                style={{ ...inp, paddingLeft: 36, marginBottom: 0 }} />
            </div>

            {finalAmount && (
              <div style={{ background: "#E1F5EE", borderRadius: 14, padding: 14, marginBottom: 16, border: "1px solid #9FE1CB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 12, color: "#085041", margin: "0 0 2px" }}>You are donating</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#085041", margin: 0 }}>Rs {Number(finalAmount).toLocaleString()}</p>
                </div>
                <p style={{ fontSize: 22, margin: 0 }}>{selectedCampaign?.icon}</p>
              </div>
            )}

            <button onClick={() => finalAmount && setStep(2)}
              style={{ width: "100%", padding: 16, background: finalAmount ? "#1C3123" : "#1C312240", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: finalAmount ? "pointer" : "not-allowed" }}>
              Continue →
            </button>
          </>
        )}

        {/* ─── STEP 2: Payment Method ─── */}
        {step === 2 && (
          <>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Payment method</p>
            {methods.map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)}
                style={{ background: method === m.id ? "#1C3123" : "#fff", borderRadius: 18, padding: 16, marginBottom: 10, border: method === m.id ? "2px solid #1C3123" : "1.5px solid #1C312215", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: method === m.id ? "#F5F2ED20" : m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.logo}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: method === m.id ? "#F5F2ED" : "#1C3123", margin: "0 0 3px" }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: method === m.id ? "#F5F2ED70" : "#1C312260", margin: 0 }}>{m.desc}</p>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${method === m.id ? "#F5F2ED" : "#1C312330"}`, background: method === m.id ? "#F5F2ED" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {method === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1C3123" }} />}
                </div>
              </div>
            ))}

            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #1C312210", marginBottom: 16, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Donation amount</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {Number(finalAmount).toLocaleString()}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Processing fee</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#166534", margin: 0 }}>Free</p>
              </div>
              <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: 0 }}>Total</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {Number(finalAmount).toLocaleString()}</p>
              </div>
            </div>

            <div style={{ background: "#F5F2ED", borderRadius: 12, padding: 12, marginBottom: 16, display: "flex", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <p style={{ fontSize: 12, color: "#1C312270", margin: 0, lineHeight: 1.5 }}>All transactions are encrypted and secured. This is a test environment — no real money will be charged.</p>
            </div>

            <button onClick={() => method && setStep(3)}
              style={{ width: "100%", padding: 16, background: method ? "#1C3123" : "#1C312240", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: method ? "pointer" : "not-allowed" }}>
              Continue →
            </button>
          </>
        )}

        {/* ─── STEP 3: Payment Details ─── */}
        {step === 3 && (
          <>
            {/* Method badge */}
            <div style={{ background: methods.find(m => m.id === method)?.bg, borderRadius: 14, padding: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${methods.find(m => m.id === method)?.color}30` }}>
              <span style={{ fontSize: 28 }}>{methods.find(m => m.id === method)?.logo}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C3123", margin: "0 0 2px" }}>{methods.find(m => m.id === method)?.name}</p>
                <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>Paying Rs {Number(finalAmount).toLocaleString()}</p>
              </div>
            </div>

            {/* JazzCash / EasyPaisa */}
            {(method === "jazzcash" || method === "easypaisa") && (
              <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>
                  {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} registered number
                </label>
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#1C312260" }}>+92</span>
                  <input style={{ ...inp, paddingLeft: 46, marginBottom: 0 }} type="tel" maxLength={11} placeholder="03XX-XXXXXXX" value={mobileNum} onChange={e => setMobileNum(e.target.value.replace(/\D/g, ""))} />
                </div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>MPIN</label>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }}>
                  {[0,1,2,3].map(i => (
                    <input key={i} id={`mpin-${i}`} type="password" maxLength={1} value={mpin[i] || ""}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        const arr = mpin.split("");
                        arr[i] = val;
                        setMpin(arr.join(""));
                        if (val && i < 3) document.getElementById(`mpin-${i+1}`)?.focus();
                      }}
                      style={{ width: 56, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, borderRadius: 14, border: mpin[i] ? "2px solid #1C3123" : "1.5px solid #1C312220", outline: "none", background: "#F5F2ED", color: "#1C3123" }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#1C312250", textAlign: "center", margin: 0 }}>Use <strong>1234</strong> for testing</p>
              </div>
            )}

            {/* Card */}
            {method === "card" && (
              <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
                {/* Card preview */}
                <div style={{ background: "linear-gradient(135deg, #1C3123, #2d5a3d)", borderRadius: 16, padding: 20, marginBottom: 20, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "#ffffff10" }} />
                  <div style={{ position: "absolute", bottom: -30, right: 20, width: 80, height: 80, borderRadius: "50%", background: "#ffffff08" }} />
                  <p style={{ fontSize: 11, color: "#F5F2ED60", margin: "0 0 16px" }}>KAFEEL CARE CARD</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#F5F2ED", letterSpacing: 3, margin: "0 0 16px", fontFamily: "monospace" }}>
                    {cardNum || "•••• •••• •••• ••••"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 9, color: "#F5F2ED50", margin: "0 0 2px" }}>CARDHOLDER</p>
                      <p style={{ fontSize: 12, color: "#F5F2ED", margin: 0, fontWeight: 500 }}>{cardName || "YOUR NAME"}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 9, color: "#F5F2ED50", margin: "0 0 2px" }}>EXPIRES</p>
                      <p style={{ fontSize: 12, color: "#F5F2ED", margin: 0, fontWeight: 500 }}>{cardExpiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Card number</label>
                <input style={inp} placeholder="1234 5678 9012 3456" value={cardNum} maxLength={19} onChange={e => setCardNum(formatCard(e.target.value))} />
                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Cardholder name</label>
                <input style={inp} placeholder="As printed on card" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Expiry</label>
                    <input style={{ ...inp, marginBottom: 0 }} placeholder="MM/YY" value={cardExpiry} maxLength={5} onChange={e => setCardExpiry(formatExpiry(e.target.value))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>CVV</label>
                    <input style={{ ...inp, marginBottom: 0 }} placeholder="•••" type="password" maxLength={3} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#1C312250", margin: "10px 0 0" }}>Use card <strong>4111 1111 1111 1111</strong>, any future expiry, CVV <strong>123</strong> for testing</p>
              </div>
            )}

            {/* Bank transfer */}
            {method === "bank" && (
              <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1C3123", margin: "0 0 14px" }}>Bank account details</p>
                <div style={{ background: "#F5F2ED", borderRadius: 14, padding: 14, marginBottom: 16 }}>
                  {[["Account title", "Kafeel Foundation"], ["Account number", "0123-4567-8901-2345"], ["IBAN", "PK36HABB0012345678901234"], ["Bank", "HBL"], ["Branch", "Karachi Main Branch"], ["Amount to transfer", `Rs ${Number(finalAmount).toLocaleString()}`]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 12, color: "#1C312260", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#1C3123", margin: 0, textAlign: "right", maxWidth: "55%" }}>{val}</p>
                    </div>
                  ))}
                </div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Your mobile number (for confirmation)</label>
                <input style={{ ...inp, marginBottom: 4 }} type="tel" placeholder="03XX-XXXXXXX" value={mobileNum} onChange={e => setMobileNum(e.target.value)} />
                <p style={{ fontSize: 11, color: "#1C312250", margin: 0 }}>We'll send a confirmation SMS after verifying your transfer</p>
              </div>
            )}

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}><p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p></div>}

            <button onClick={processPayment} disabled={loading}
              style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Processing..." : method === "bank" ? "I've made the transfer ✓" : "Send OTP →"}
            </button>
          </>
        )}

        {/* ─── STEP 4: OTP ─── */}
        {step === 4 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px" }}>📱</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C3123", margin: "0 0 8px" }}>Verify payment</h2>
              <p style={{ fontSize: 14, color: "#1C312270", margin: "0 0 4px", lineHeight: 1.5 }}>
                A 6-digit OTP was sent to <strong>{method === "card" ? "your registered number" : mobileNum}</strong>
              </p>
              <p style={{ fontSize: 12, color: "#1C312250", margin: 0 }}>Valid for 5 minutes · Use <strong>123456</strong> for testing</p>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} value={digit}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => { if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                  maxLength={1}
                  style={{ width: 46, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, borderRadius: 14, border: digit ? "2px solid #1C3123" : "1.5px solid #1C312220", outline: "none", background: digit ? "#1C312208" : "#fff", color: "#1C3123", transition: "all 0.1s" }} />
              ))}
            </div>

            {/* OTP timer */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#1C312270", margin: "0 0 24px" }}>
              Didn't receive? <span style={{ color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Resend OTP</span>
            </p>

            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #1C312210", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Donating to</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1C3123", margin: 0 }}>{selectedCampaign?.name}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, color: "#1C312260", margin: 0 }}>Amount</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1C3123", margin: 0 }}>Rs {Number(finalAmount).toLocaleString()}</p>
              </div>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}><p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p></div>}

            <button onClick={verifyOtp} disabled={loading}
              style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying..." : "Confirm donation ✓"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "#1C312250", margin: 0 }}>🔒 Secured by Kafeel Pay</p>
          </>
        )}
      </div>
      <DonorNav />
    </main>
  );
}