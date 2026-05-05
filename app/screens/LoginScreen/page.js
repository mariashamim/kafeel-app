"use client";
import { Suspense } from "react";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_EMAIL } from "../../lib/config";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role");

  const roleLabels = { elderly: "Elderly user 👴", caregiver: "Caregiver 🧑‍⚕️", volunteer: "Volunteer 🤝", donor: "Donor 💛", admin: "Admin 🛡️" };
  const dashboardRoutes = { elderly: "/screens/ElderlyDashboard", caregiver: "/screens/CaregiverDashboard", volunteer: "/screens/VolunteerDashboard", donor: "/screens/DonorDashboard", admin: "/screens/AdminDashboard" };
  const inp = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123", marginBottom: 12 };

  const handle = async () => {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    if (role === "admin" && email !== ADMIN_EMAIL) return setError("You are not authorized as admin.");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "profiles", cred.user.uid));
      const savedRole = snap.exists() ? snap.data().role : role;
      if (email === ADMIN_EMAIL) {
        router.push("/screens/AdminDashboard");
        return;
      }
      router.push(dashboardRoutes[savedRole] || dashboardRoutes[role] || "/screens/ElderlyDashboard");
    } catch (e) {
      setError("Incorrect email or password.");
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", padding: "60px 24px 40px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", marginBottom: 20, color: "#1C3123" }}>←</button>

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <img src="/logo.png" alt="Kafeel" width={110} style={{ objectFit: "contain" }} />
      </div>

      {/* Role badge */}
      {role && (
        <div style={{ background: role === "admin" ? "#1C3123" : "#1C312215", borderRadius: 12, padding: "8px 14px", display: "inline-block", marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: role === "admin" ? "#F5F2ED" : "#1C3123", fontWeight: 500, margin: 0 }}>{roleLabels[role]}</p>
        </div>
      )}

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1C3123", margin: "0 0 6px" }}>Welcome back</h1>
      <p style={{ fontSize: 14, color: "#1C312380", margin: "0 0 28px" }}>Log in to your Kafeel account</p>

      {role === "admin" && (
        <div style={{ background: "#1C312210", borderRadius: 14, padding: 14, marginBottom: 20, border: "1px solid #1C312220" }}>
          <p style={{ fontSize: 13, color: "#1C3123", margin: 0, lineHeight: 1.5 }}>🛡️ Admin access is restricted to authorized personnel only.</p>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Email address</label>
        <input style={inp} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Password</label>
        <input style={{ ...inp, marginBottom: 0 }} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <span onClick={() => router.push("/screens/ForgetPasswordScreen")} style={{ fontSize: 13, color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
          <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      <button onClick={handle} disabled={loading}
        style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Logging in..." : "Log in"}
      </button>

      {role !== "admin" && (
        <p style={{ textAlign: "center", fontSize: 13, color: "#1C312370" }}>
          Don't have an account?{" "}
          <span onClick={() => router.push(`/screens/SignupScreen?role=${role}`)} style={{ color: "#1C3123", fontWeight: 600, cursor: "pointer" }}>Sign up</span>
        </p>
      )}
    </main>
  );
}

// Main component with Suspense boundary
export default function LoginScreen() {
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
      <LoginContent />
    </Suspense>
  );
}