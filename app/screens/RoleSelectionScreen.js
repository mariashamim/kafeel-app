import { useState } from "react";
import Image from "next/image";

export default function RoleSelectionScreen({ onContinue, onBack }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { id: "elderly", name: "Elderly User", icon: "👴", description: "Senior seeking care" },
    { id: "caregiver", name: "Caregiver", icon: "👩‍⚕️", description: "Professional caregiver" },
    { id: "volunteer", name: "Volunteer", icon: "🤝", description: "Want to help others" },
    { id: "donor", name: "Donor", icon: "💰", description: "Support healthcare" },
    { id: "admin", name: "Admin", icon: "👑", description: "Manage platform" },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onContinue(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header with Back Button */}
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-[#1C3123] text-2xl mb-4">
          ←
        </button>
        <div className="text-center">
          <div className="inline-block bg-[#1C3123]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Kafeel Logo" 
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#1C3123] mb-2">Welcome to Kafeel</h1>
          <p className="text-[#1C3123]/60">Please select your role to continue</p>
        </div>
      </div>

      {/* Role Options */}
      <div className="px-6 flex-1 pb-6">
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selectedRole === role.id
                  ? "border-[#1C3123] bg-[#1C3123]/5"
                  : "border-[#E8E3D8] bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                selectedRole === role.id
                  ? "bg-[#1C3123] text-[#F5F2ED]"
                  : "bg-[#1C3123]/10 text-[#1C3123]"
              }`}>
                {role.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-lg ${
                  selectedRole === role.id ? "text-[#1C3123]" : "text-[#1C3123]/80"
                }`}>
                  {role.name}
                </p>
                <p className="text-xs text-[#1C3123]/40">{role.description}</p>
              </div>
              {selectedRole === role.id && (
                <div className="w-6 h-6 bg-[#1C3123] rounded-full flex items-center justify-center">
                  <span className="text-[#F5F2ED] text-sm">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8 bg-[#F5F2ED]">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selectedRole
              ? "bg-[#1C3123] text-[#F5F2ED]"
              : "bg-[#E8E3D8] text-[#1C3123]/40 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
        <p className="text-center text-[#1C3123]/40 text-xs mt-4">
          Select your role to personalize your experience
        </p>
      </div>
    </div>
  );
}