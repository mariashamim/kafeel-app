import Image from "next/image";

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Illustration Area */}
      <div className="flex-1 bg-gradient-to-b from-[#1C3123]/5 to-[#F5F2ED] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-[#1C3123]/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Kafeel Logo" 
              width={80}
              height={80}
              className="object-contain w-full h-full p-3"
            />
          </div>
          <h2 className="text-3xl font-bold text-[#1C3123] mb-3">
            Welcome to Kafeel
          </h2>
          <p className="text-[#1C3123]/60 px-6">
            Your personal healthcare companion. Track medications, appointments, and vitals all in one place.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-4 bg-white/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1C3123]/10 rounded-full flex items-center justify-center">
            <span className="text-[#1C3123]">💊</span>
          </div>
          <div>
            <p className="font-medium text-[#1C3123]">Medication Reminders</p>
            <p className="text-xs text-[#1C3123]/50">Never miss a dose</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1C3123]/10 rounded-full flex items-center justify-center">
            <span className="text-[#1C3123]">📅</span>
          </div>
          <div>
            <p className="font-medium text-[#1C3123]">Appointment Tracking</p>
            <p className="text-xs text-[#1C3123]/50">Manage all your visits</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#1C3123]/10 rounded-full flex items-center justify-center">
            <span className="text-[#1C3123]">❤️</span>
          </div>
          <div>
            <p className="font-medium text-[#1C3123]">Health Monitoring</p>
            <p className="text-xs text-[#1C3123]/50">Track your vitals</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8 bg-[#F5F2ED]">
        <button
          onClick={onContinue}
          className="w-full bg-[#1C3123] text-[#F5F2ED] py-4 rounded-2xl font-semibold text-lg"
        >
          Get Started →
        </button>
        <p className="text-center text-[#1C3123]/40 text-sm mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}