"use client";
import { Suspense } from "react";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SignupContent() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [license, setLicense] = useState("");
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState("");
  const [organization, setOrganization] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "elderly";

  const roleLabels = { elderly: "Elderly user 👴", caregiver: "Caregiver 🧑‍⚕️", volunteer: "Volunteer 🤝", donor: "Donor 💛" };
  const dashboardRoutes = { elderly: "/screens/ElderlyDashboard", caregiver: "/screens/CaregiverDashboard", volunteer: "/screens/VolunteerDashboard", donor: "/screens/DonorDashboard" };
  const allSkills = ["Medical", "Transport", "Cooking", "Companionship", "Errands", "Tech help"];
  const specs = ["General care", "Dementia", "Physiotherapy", "Nursing", "Palliative care"];
  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const toggleSkill = s => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const validateStep1 = () => {
    if (!name || !email || !password || !confirm) return setError("Please fill in all fields.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    setStep(2);
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "profiles", cred.user.uid), {
        name, email, phone, role,
        ...(role === "elderly" && { age, condition }),
        ...(role === "caregiver" && { specialization, experience, license }),
        ...(role === "volunteer" && { skills, availability }),
        ...(role === "donor" && { organization }),
        createdAt: serverTimestamp()
      });
      // Go directly to dashboard — no verification screen
      router.push(dashboardRoutes[role] || "/screens/ElderlyDashboard");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("This email is already registered.");
      else if (e.code === "auth/invalid-email") setError("Please enter a valid email address.");
      else setError(e.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => step === 1 ? router.back() : setStep(1)}
        style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 16, color: "#1C3123" }}>←</button>

      {/* Step progress bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[1, 2].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? "#1C3123" : "#1C312220" }} />
        ))}
      </div>

      {/* Role badge */}
      <div style={{ background: "#1C312215", borderRadius: 12, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: "#1C3123", fontWeight: 500, margin: 0 }}>{roleLabels[role]}</p>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
<img src="/logo.png" alt="Kafeel" width={90} style={{ objectFit: "contain" }} />          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Create account</h1>
          <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Step 1 of 2 — Basic info</p>

          <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
            {[["Full name", "text", "e.g. Ahmed Khan", name, setName], ["Email address", "email", "you@email.com", email, setEmail], ["Password", "password", "Min. 6 characters", password, setPassword], ["Confirm password", "password", "Repeat password", confirm, setConfirm]].map(([label, type, ph, val, set], i, arr) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>{label}</label>
                <input style={{ ...inp, marginBottom: i < arr.length - 1 ? 12 : 0 }} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
              </div>
            ))}
          </div>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}><p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p></div>}

          <button onClick={validateStep1}
            style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
            Continue →
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#1C312370" }}>
            Already have an account?{" "}
            <span onClick={() => router.push(`/screens/LoginScreen?role=${role}`)} style={{ color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Log in</span>
          </p>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Your details</h1>
          <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 24px" }}>Step 2 of 2 — Role-specific info</p>

          <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Phone number</label>
            <input style={inp} type="tel" placeholder="+92 300 1234567" value={phone} onChange={e => setPhone(e.target.value)} />

            {role === "elderly" && <>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Age</label>
              <input style={inp} type="number" placeholder="e.g. 72" value={age} onChange={e => setAge(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Medical condition (optional)</label>
              <textarea value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. Diabetes, hypertension" rows={2} style={{ ...inp, resize: "none", marginBottom: 0 }} />
            </>}

            {role === "caregiver" && <>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Specialization</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {specs.map(s => (
                  <button key={s} onClick={() => setSpecialization(s)} style={{ padding: "7px 12px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", background: specialization === s ? "#1C3123" : "#F5F2ED", color: specialization === s ? "#F5F2ED" : "#1C312270" }}>{s}</button>
                ))}
              </div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Years of experience</label>
              <input style={inp} placeholder="e.g. 5 years" value={experience} onChange={e => setExperience(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>License number (optional)</label>
              <input style={{ ...inp, marginBottom: 0 }} placeholder="e.g. PMDC-12345" value={license} onChange={e => setLicense(e.target.value)} />
            </>}

            {role === "volunteer" && <>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Availability</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["Full-time", "Part-time", "Weekends"].map(a => (
                  <button key={a} onClick={() => setAvailability(a)} style={{ flex: 1, padding: "8px 0", borderRadius: 12, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: availability === a ? "#1C3123" : "#F5F2ED", color: availability === a ? "#F5F2ED" : "#1C312270" }}>{a}</button>
                ))}
              </div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 8 }}>Skills</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allSkills.map(s => (
                  <button key={s} onClick={() => toggleSkill(s)} style={{ padding: "7px 12px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", background: skills.includes(s) ? "#1C3123" : "#F5F2ED", color: skills.includes(s) ? "#F5F2ED" : "#1C312270" }}>{s}</button>
                ))}
              </div>
            </>}

            {role === "donor" && <>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Organization (optional)</label>
              <input style={{ ...inp, marginBottom: 0 }} placeholder="e.g. Company or NGO name" value={organization} onChange={e => setOrganization(e.target.value)} />
            </>}
          </div>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}><p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p></div>}

          <button onClick={handleSignup} disabled={loading}
            style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating account..." : "Create account & continue →"}
          </button>
        </>
      )}
    </main>
  );
}

// Main component with Suspense boundary
export default function SignupScreen() {
  return (
    <Suspense fallback={
      <div style={{ 
        maxWidth: 390, 
        margin: "0 auto", 
        minHeight: "100vh", 
        background: "#F5F2ED", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "sans-serif" 
      }}>
        <div style={{ textAlign: "center", color: "#1C3123" }}>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}