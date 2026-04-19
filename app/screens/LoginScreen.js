"use client";
import { useState } from "react";

export default function LoginScreen({ onLogin, onSignup, onForgotPassword, role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get role display name
  const getRoleName = () => {
    switch(role) {
      case "elderly": return "Elderly User";
      case "caregiver": return "Caregiver";
      case "volunteer": return "Volunteer";
      case "donor": return "Donor";
      case "admin": return "Admin";
      default: return "User";
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("❌ Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          role 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info to localStorage
        localStorage.setItem("kafeel_user", JSON.stringify(data.user));
        alert("✅ Login successful! Welcome back.");
        onLogin();
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold text-[#1C3123] mb-2">Welcome Back</h1>
        <p className="text-[#1C3123]/60">
          Sign in as <span className="font-semibold text-[#1C3123]">{getRoleName()}</span>
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1">
        <div className="mb-5">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ahmed@example.com"
            className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
          />
        </div>

        <div className="mb-3">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#1C3123]/40"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div className="text-right mb-6">
          <button 
            onClick={onForgotPassword} 
            className="text-[#1C3123]/70 text-sm hover:text-[#1C3123]"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg mb-4 transition-all ${
            isLoading
              ? "bg-[#1C3123]/50 text-[#F5F2ED] cursor-not-allowed"
              : "bg-[#1C3123] text-[#F5F2ED] hover:bg-[#2A4A35]"
          }`}
        >
          {isLoading ? "Signing in..." : `Sign In as ${getRoleName()}`}
        </button>

        <div className="text-center">
          <p className="text-[#1C3123]/60">
            Don't have an account?{" "}
            <button onClick={onSignup} className="text-[#1C3123] font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}