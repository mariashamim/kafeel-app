import { useState } from "react";

export default function ForgetPasswordScreen({ onBack, onNext }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email) {
      onNext(email);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <div className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={onBack} className="text-[#1C3123] text-2xl">
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1C3123]">Forgot Password?</h1>
          <p className="text-[#1C3123]/60 text-sm">No worries, we'll help you reset it</p>
        </div>
      </div>
      <div className="px-6 flex-1">
        <div className="mb-6">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
          />
          <p className="text-xs text-[#1C3123]/40 mt-2">
            We'll send a verification code to this email
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!email}
          className={`w-full py-4 rounded-2xl font-semibold text-lg ${
            email 
              ? "bg-[#1C3123] text-[#F5F2ED]" 
              : "bg-[#E8E3D8] text-[#1C3123]/40 cursor-not-allowed"
          }`}
        >
          Send Verification Code →
        </button>
      </div>
    </div>
  );
}