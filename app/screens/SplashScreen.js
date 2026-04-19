import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-[#1C3123] flex flex-col items-center justify-center">
      <div className="text-center animate-bounce">
        {/* Logo Image */}
        <div className="bg-[#F5F2ED] w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Image 
            src="/logo.png" 
            alt="Kafeel Logo" 
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        
        {/* App Name */}
        <h1 className="text-5xl font-bold text-[#F5F2ED] mb-2">
          Kafeel
        </h1>
        <p className="text-[#E8E3D8]">Your Health Guardian</p>
        
        {/* Loading dots */}
        <div className="flex gap-2 justify-center mt-8">
          <div className="w-2 h-2 bg-[#F5F2ED] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#F5F2ED] rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-[#F5F2ED] rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}