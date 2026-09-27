import React, { useState } from "react";
import { submitRSVP } from "../services/eventService";

export default function RSVPPage({ eventId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRSVP = async (status) => {
    if (!name || !email) {
      alert("Please enter your name and email!");
      return;
    }
    setLoading(true);
    try {
      const res = await submitRSVP(eventId, { name, email }, status);
      if (res.status === "WAITLIST") {
        setResponseMsg("Capacity is full! You have been add on the waitlist.");
      } else {
        setResponseMsg(`Your RSVP has been successfully recorded: ${res.status}`);
      }
    } catch (err) {
      setResponseMsg("An error occured: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 450, margin: "50px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Event RSVP</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <button disabled={loading} onClick={() => handleRSVP("GOING")} style={{ padding: "8px 16px", background: "#22c55e", color: "#fff", border: "none" }}>Going</button>
        <button disabled={loading} onClick={() => handleRSVP("MAYBE")} style={{ padding: "8px 16px", background: "#eab308", color: "#fff", border: "none" }}>Maybe</button>
        <button disabled={loading} onClick={() => handleRSVP("NOT_GOING")} style={{ padding: "8px 16px", background: "#ef4444", color: "#fff", border: "none" }}>Not Going</button>
      </div>
      {responseMsg && <p style={{ marginTop: 20, fontWeight: "bold" }}>{responseMsg}</p>}
    </div>
  );
}