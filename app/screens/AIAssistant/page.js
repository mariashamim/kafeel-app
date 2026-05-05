"use client";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

const EMERGENCY_KEYWORDS = ["dizzy", "chest pain", "fall", "fell", "help", "emergency", "breathing", "unconscious", "hurt", "pain", "stroke", "heart"];

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "السلام عليكم! I'm your Kafeel health assistant. How are you feeling today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [lang, setLang] = useState("en");
  const bottomRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (u) getDoc(doc(db, "profiles", u.uid)).then(s => s.exists() && setProfile(s.data()));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const checkEmergency = (text) => EMERGENCY_KEYWORDS.some(k => text.toLowerCase().includes(k));

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    const isEmergency = checkEmergency(userMsg);
    if (isEmergency) setEmergency(true);

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const systemPrompt = `You are Kafeel, a compassionate elderly care assistant for Pakistan. 
      ${profile ? `The user's name is ${profile.name}, age ${profile.age || "unknown"}, with conditions: ${profile.condition || "none stated"}.` : ""}
      Keep responses SHORT (2-3 sentences max). Be warm and simple. If they mention pain, dizziness, or emergency — immediately suggest calling help or emergency contacts.
      ${lang === "ur" ? "Respond in simple Urdu." : "Respond in simple English."}
      ${isEmergency ? "THIS IS AN EMERGENCY. First acknowledge their situation with care, then strongly suggest they call emergency contacts or 1122 immediately." : ""}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here to help. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "I'm having trouble connecting. Please call 1122 if this is an emergency." }]);
    }
    setLoading(false);
  };

  const quickReplies = ["I feel dizzy", "I need help", "Book appointment", "My medication", "I'm feeling good"];

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", display: "flex", flexDirection: "column", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "#1C3123", padding: "48px 20px 16px", borderRadius: "0 0 24px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer" }}>←</button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F2ED20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F2ED", margin: 0 }}>Kafeel Assistant</p>
              <p style={{ fontSize: 11, color: "#F5F2ED60", margin: 0 }}>Context-aware · Always here</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["en", "ur"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: lang === l ? "#F5F2ED" : "#F5F2ED20", color: lang === l ? "#1C3123" : "#F5F2ED" }}>{l === "en" ? "EN" : "اردو"}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency banner */}
      {emergency && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", margin: "12px 16px 0", borderRadius: 14, padding: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", margin: "0 0 8px" }}>🚨 Emergency detected</p>
          <p style={{ fontSize: 12, color: "#ef4444", margin: "0 0 10px" }}>It sounds like you may need immediate help.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="tel:1122" style={{ flex: 1, padding: "10px 0", background: "#ef4444", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>📞 Call 1122</a>
            <button onClick={() => router.push("/screens/SOS")} style={{ flex: 1, padding: "10px 0", background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🆘 SOS</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
            )}
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "#1C3123" : "#fff", color: msg.role === "user" ? "#F5F2ED" : "#1C3123", fontSize: 14, lineHeight: 1.5, border: msg.role === "assistant" ? "1px solid #1C312210" : "none" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1C3123", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "10px 16px", border: "1px solid #1C312210" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#1C312240", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: "10px 16px 0", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
        {quickReplies.map(q => (
          <button key={q} onClick={() => { setInput(q); }} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid #1C312220", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", background: "#fff", color: "#1C3123", flexShrink: 0 }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type your message..." style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: "1.5px solid #1C312215", fontSize: 14, outline: "none", background: "#fff", color: "#1C3123" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 48, height: 48, borderRadius: 14, background: input.trim() ? "#1C3123" : "#1C312230", color: "#F5F2ED", border: "none", fontSize: 20, cursor: "pointer" }}>↑</button>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
      <ElderlyNav />
    </main>
  );
}