"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export const dynamic = 'force-dynamic';

export default function VoiceCommand() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [supported, setSupported] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  let recognition = null;

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        setSupported(false);
      }
    }
  }, []);

  const processCommand = (text) => {
    const t = text.toLowerCase();
    if (t.includes("call help") || t.includes("emergency") || t.includes("sos")) return { action: "sos", msg: "Calling for help!", route: "/screens/SOS", icon: "🚨", color: "#ef4444" };
    if (t.includes("book appointment") || t.includes("appointment")) return { action: "appointment", msg: "Opening appointments!", route: "/screens/AddAppointment", icon: "🩺", color: "#1C3123" };
    if (t.includes("medication") || t.includes("medicine") || t.includes("remind")) return { action: "meds", msg: "Opening medications!", route: "/screens/MedicationList", icon: "💊", color: "#0C447C" };
    if (t.includes("shelter") || t.includes("home")) return { action: "shelter", msg: "Finding shelters!", route: "/screens/ShelterLocator", icon: "🏡", color: "#633806" };
    if (t.includes("vitals") || t.includes("blood pressure") || t.includes("sugar")) return { action: "vitals", msg: "Opening vitals tracker!", route: "/screens/VitalsTracker", icon: "❤️", color: "#791F1F" };
    if (t.includes("chat") || t.includes("assistant") || t.includes("help me")) return { action: "chat", msg: "Opening assistant!", route: "/screens/AIAssistant", icon: "🤖", color: "#085041" };
    return { action: "unknown", msg: `I heard: "${text}". Try saying "call help", "book appointment" or "medications"`, icon: "🎙️", color: "#888" };
  };

  const startListening = () => {
    if (!supported || !isClient) return;
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const cmd = processCommand(text);
      setResult(cmd);
      setListening(false);
      if (cmd.route && cmd.action !== "unknown") setTimeout(() => router.push(cmd.route), 1500);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const commands = [
    { cmd: "Call help", desc: "Trigger SOS emergency", icon: "🚨" },
    { cmd: "Book appointment", desc: "Add new appointment", icon: "🩺" },
    { cmd: "My medications", desc: "View medication list", icon: "💊" },
    { cmd: "Find shelter", desc: "Open shelter locator", icon: "🏡" },
    { cmd: "Check vitals", desc: "Open vitals tracker", icon: "❤️" },
    { cmd: "Open assistant", desc: "Chat with AI", icon: "🤖" },
  ];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 28px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer", position: "absolute", left: 20, top: 52 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>🎙️ Voice Commands</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Speak to control the app</p>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        {!supported ? (
          <div style={{ background: "#fef2f2", borderRadius: 16, padding: 20, textAlign: "center", border: "1px solid #fecaca" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>😔</p>
            <p style={{ fontSize: 14, color: "#ef4444", fontWeight: 600 }}>Voice not supported on this browser</p>
            <p style={{ fontSize: 13, color: "#ef4444", margin: "6px 0 0" }}>Try Chrome on Android for voice commands</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button onClick={startListening} disabled={listening}
                style={{ width: 120, height: 120, borderRadius: "50%", background: listening ? "#ef4444" : "#1C3123", color: "#F5F2ED", border: listening ? "4px solid #fecaca" : "4px solid #1C312330", fontSize: 48, cursor: "pointer", transition: "all 0.3s", boxShadow: listening ? "0 0 0 12px #ef444420" : "none" }}>
                🎙️
              </button>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "16px 0 4px" }}>
                {listening ? "Listening..." : result ? "Command recognized!" : "Tap to speak"}
              </p>
              {transcript && <p style={{ fontSize: 13, color: "#1C312370", margin: 0 }}>"{transcript}"</p>}
            </div>

            {result && (
              <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 16, border: `2px solid ${result.color}30`, textAlign: "center" }}>
                <p style={{ fontSize: 40, margin: "0 0 8px" }}>{result.icon}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: result.color, margin: 0 }}>{result.msg}</p>
                {result.action !== "unknown" && <p style={{ fontSize: 12, color: "#1C312260", margin: "4px 0 0" }}>Navigating...</p>}
              </div>
            )}

            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Available commands</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {commands.map((c, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 12, border: "1px solid #1C312210" }}>
                  <p style={{ fontSize: 20, margin: "0 0 6px" }}>{c.icon}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#1C3123", margin: "0 0 2px" }}>"{c.cmd}"</p>
                  <p style={{ fontSize: 11, color: "#1C312260", margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}