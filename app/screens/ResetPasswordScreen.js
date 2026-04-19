import { useState } from "react";

export default function ResetPasswordScreen({ onReset, onBack }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordStrong = newPassword.length >= 6;
  const isValid = isPasswordStrong && passwordsMatch && newPassword;

  const handleReset = () => {
    if (isValid) {
      onReset(newPassword);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBack} className="text-[#1C3123] text-2xl mb-4">
          ←
        </button>
        <h1 className="text-2xl font-bold text-[#1C3123]">Create New Password</h1>
        <p className="text-[#1C3123]/60 text-sm mt-1">
          Your new password must be different from previous ones
        </p>
      </div>
      <div className="px-6 flex-1">
        <div className="mb-5">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          {newPassword && !isPasswordStrong && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
          {newPassword && isPasswordStrong && (
            <p className="text-green-600 text-xs mt-1">
              ✓ Strong password
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-[#1C3123] text-sm font-medium mb-2">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white"
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-red-500 text-xs mt-1">
              Passwords don't match
            </p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="text-green-600 text-xs mt-1">
              ✓ Passwords match
            </p>
          )}
        </div>
        <button
          onClick={handleReset}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-semibold text-lg ${
            isValid
              ? "bg-[#1C3123] text-[#F5F2ED]"
              : "bg-[#E8E3D8] text-[#1C3123]/40 cursor-not-allowed"
          }`}
        >
          Reset Password →
        </button>
      </div>
    </div>
  );
}