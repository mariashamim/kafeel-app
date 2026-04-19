import { useState, useEffect } from "react";

export default function VerifyCodeScreen({ email, onBack, onVerify }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    if (enteredCode.length === 6) {
      onVerify(enteredCode);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBack} className="text-[#1C3123] text-2xl mb-4">
          ←
        </button>
        <h1 className="text-2xl font-bold text-[#1C3123]">Verify Code</h1>
        <p className="text-[#1C3123]/60 text-sm mt-1">
          We sent a 6-digit code to {email}
        </p>
      </div>
      <div className="px-6 flex-1">
        <div className="flex justify-between gap-2 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="w-12 h-14 text-center text-2xl font-bold border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C3123] bg-white text-[#1C3123]"
            />
          ))}
        </div>
        <div className="text-center mb-8">
          {!canResend ? (
            <p className="text-[#1C3123]/60 text-sm">
              Resend code in <span className="text-[#1C3123] font-semibold">{timer}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-[#1C3123] font-semibold">
              Resend Code
            </button>
          )}
        </div>
        <button
          onClick={handleVerify}
          disabled={code.join("").length !== 6}
          className={`w-full py-4 rounded-2xl font-semibold text-lg ${
            code.join("").length === 6
              ? "bg-[#1C3123] text-[#F5F2ED]"
              : "bg-[#E8E3D8] text-[#1C3123]/40 cursor-not-allowed"
          }`}
        >
          Verify & Continue →
        </button>
      </div>
    </div>
  );
}