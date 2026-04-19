"use client";
import { useState } from "react";

export default function SignupScreen({ onSignup, onLogin, role }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Elderly fields
    age: "",
    medicalConditions: "",
    emergencyContact: "",
    // Caregiver fields
    licenseNumber: "",
    experience: "",
    // Volunteer fields
    skills: "",
    availability: "",
    // Donor fields
    paymentInfo: "",
    // Admin fields
    adminCode: "",
  });

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

  // Get role-specific fields
  const getRoleFields = () => {
    switch(role) {
      case "elderly":
        return (
          <>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Your age"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Medical Conditions
              </label>
              <textarea
                value={formData.medicalConditions}
                onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                placeholder="e.g., Diabetes, High BP, Allergies"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
                rows="2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Emergency Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                placeholder="Name and phone number"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
          </>
        );
      
      case "caregiver":
        return (
          <>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                placeholder="Your professional license"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                placeholder="Years of experience"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
          </>
        );
      
      case "volunteer":
        return (
          <>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="e.g., Nursing, Driving, Cooking, Teaching"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#1C3123] text-sm font-medium mb-2">
                Availability
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                placeholder="e.g., Weekends, Evenings, Full-time"
                className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
              />
            </div>
          </>
        );
      
      case "donor":
        return (
          <div className="mb-4">
            <label className="block text-[#1C3123] text-sm font-medium mb-2">
              Payment Method
            </label>
            <input
              type="text"
              value={formData.paymentInfo}
              onChange={(e) => setFormData({...formData, paymentInfo: e.target.value})}
              placeholder="Card details or payment method"
              className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
            />
            <p className="text-xs text-[#1C3123]/40 mt-1">Your payment info is secure and encrypted</p>
          </div>
        );
      
      case "admin":
        return (
          <div className="mb-4">
            <label className="block text-[#1C3123] text-sm font-medium mb-2">
              Admin Access Code <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.adminCode}
              onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
              placeholder="Enter admin access code"
              className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleSignup = async () => {
    // Check required fields
    if (!formData.name || !formData.email || !formData.password) {
      alert("❌ Please fill all required fields");
      return;
    }

    // Role-specific validation
    if (role === "elderly" && !formData.emergencyContact) {
      alert("❌ Please provide an emergency contact");
      return;
    }
    if (role === "caregiver" && !formData.licenseNumber) {
      alert("❌ Please provide your license number");
      return;
    }
    if (role === "admin" && !formData.adminCode) {
      alert("❌ Please enter admin access code");
      return;
    }

    setIsLoading(true);

    // Prepare data to send
    const userData = {
      role: role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Add role-specific fields
    if (role === "elderly") {
      userData.age = formData.age;
      userData.medicalConditions = formData.medicalConditions;
      userData.emergencyContact = formData.emergencyContact;
    } else if (role === "caregiver") {
      userData.licenseNumber = formData.licenseNumber;
      userData.experience = formData.experience;
    } else if (role === "volunteer") {
      userData.skills = formData.skills;
      userData.availability = formData.availability;
    } else if (role === "donor") {
      userData.paymentInfo = formData.paymentInfo;
    } else if (role === "admin") {
      userData.adminCode = formData.adminCode;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Account created successfully! Please login.");
        onSignup(); // This goes to login screen
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold text-[#1C3123] mb-2">Create Account</h1>
        <p className="text-[#1C3123]/60">
          Sign up as <span className="font-semibold text-[#1C3123]">{getRoleName()}</span>
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1 pb-20">
        {/* Common Fields */}
        <div className="mb-4">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="ahmed@example.com"
            className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Create a strong password"
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
          <p className="text-xs text-[#1C3123]/40 mt-1">Must be at least 6 characters</p>
        </div>

        {/* Role-specific fields */}
        {getRoleFields()}

        {/* Sign Up Button */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg mb-4 transition-all ${
            isLoading
              ? "bg-[#1C3123]/50 text-[#F5F2ED] cursor-not-allowed"
              : "bg-[#1C3123] text-[#F5F2ED] hover:bg-[#2A4A35]"
          }`}
        >
          {isLoading ? "Creating Account..." : `Sign Up as ${getRoleName()}`}
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-[#1C3123]/60">
            Already have an account?{" "}
            <button onClick={onLogin} className="text-[#1C3123] font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}