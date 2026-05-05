"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ElderlyNav from "../../components/ElderlyNav";

export default function RatingReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [category, setCategory] = useState("caregiver");
  const [submitted, setSubmitted] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDocs(query(collection(db, "reviews"), where("userId", "==", u.uid))).then(snap => setMyReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const submit = async () => {
    if (rating === 0) return;
    setLoading(true);
    await addDoc(collection(db, "reviews"), {
      userId: auth.currentUser.uid,
      rating, review, category,
      createdAt: serverTimestamp()
    });
    setSubmitted(true); setLoading(false);
  };

  if (submitted) return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", paddingBottom: 80 }}>
      <p style={{ fontSize: 64, margin: "0 0 16px" }}>⭐</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C3123", margin: "0 0 8px", textAlign: "center" }}>Thank you for your feedback!</h2>
      <p style={{ fontSize: 14, color: "#1C312270", textAlign: "center", margin: "0 0 28px" }}>Your review helps improve the quality of care for everyone.</p>
      <button onClick={() => router.back()} style={{ width: "100%", padding: 16, background: "#1C3123", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Go back</button>
      <ElderlyNav />
    </main>
  );

  return (
    <main style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F5F2ED", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#1C3123", padding: "48px 24px 24px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#F5F2ED", fontSize: 20, cursor: "pointer", marginBottom: 12 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F5F2ED", margin: "0 0 4px" }}>⭐ Rate & Review</h1>
        <p style={{ fontSize: 13, color: "#F5F2ED70", margin: 0 }}>Help improve the quality of care</p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #1C312210", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>Who are you rating?</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["caregiver", "🧑‍⚕️ Caregiver"], ["volunteer", "🤝 Volunteer"], ["shelter", "🏡 Shelter"]].map(([id, label]) => (
              <button key={id} onClick={() => setCategory(id)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: category === id ? "#1C3123" : "#F5F2ED", color: category === id ? "#F5F2ED" : "#1C312270" }}>{label}</button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.8 }}>Your rating</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)} style={{ fontSize: 36, background: "none", border: "none", cursor: "pointer", transition: "transform 0.1s", transform: s <= rating ? "scale(1.2)" : "scale(1)", filter: s <= rating ? "none" : "grayscale(1) opacity(0.4)" }}>⭐</button>
            ))}
          </div>

          {rating > 0 && (
            <p style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "#1C3123", margin: "0 0 16px" }}>
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
            </p>
          )}

          <label style={{ fontSize: 12, fontWeight: 500, color: "#1C312280", display: "block", marginBottom: 6 }}>Write a review (optional)</label>
          <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience..." rows={3}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #1C312215", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", background: "#fff", color: "#1C3123" }} />
        </div>

        <button onClick={submit} disabled={loading || rating === 0} style={{ width: "100%", padding: 16, background: rating > 0 ? "#1C3123" : "#1C312240", color: "#F5F2ED", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: rating > 0 ? "pointer" : "not-allowed", marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting..." : "Submit review ✓"}
        </button>

        {myReviews.length > 0 && (
          <>
            <p style={{ fontSize: 11, color: "#1C312260", fontWeight: 500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.8 }}>My previous reviews</p>
            {myReviews.map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 8, border: "1px solid #1C312210" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1C3123", textTransform: "capitalize" }}>{r.category}</span>
                  <span style={{ fontSize: 13 }}>{"⭐".repeat(r.rating)}</span>
                </div>
                {r.review && <p style={{ fontSize: 13, color: "#1C312270", margin: 0 }}>{r.review}</p>}
              </div>
            ))}
          </>
        )}
      </div>
      <ElderlyNav />
    </main>
  );
}