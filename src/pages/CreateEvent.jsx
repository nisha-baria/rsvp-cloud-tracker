import React, { useState } from "react";
import { db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CreateEvent({ onEventCreated }) {
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    description: "",
    venue: "",
    capacity: 50,
    eventDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventId || !formData.title || !formData.capacity) {
      alert("Write Event ID, Title and Capacity are compulsory!");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const cleanEventId = formData.eventId.trim().toLowerCase().replace(/\s+/g, "-");
      
      await setDoc(doc(db, "events", cleanEventId), {
        title: formData.title,
        description: formData.description,
        venue: formData.venue || "Online",
        capacity: Number(formData.capacity),
        eventDate: formData.eventDate || new Date().toISOString().split("T")[0],
        status: "PUBLISHED",
        createdAt: serverTimestamp()
      });

      setMsg(`Success! Event "${formData.title}" (${cleanEventId}) create thai gayo chhe.`);
      if (onEventCreated) {
        onEventCreated(cleanEventId);
      }
      setFormData({
        eventId: "",
        title: "",
        description: "",
        venue: "",
        capacity: 50,
        eventDate: ""
      });
    } catch (err) {
      setMsg("An error occured: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>Create New Event</h2>

      {msg && (
        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            backgroundColor: msg.startsWith("Success") ? "#dcfce7" : "#fee2e2",
            color: msg.startsWith("Success") ? "#166534" : "#991b1b",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Unique ID (e.g. event-101, tech-fest-2026)</label>
          <input
            type="text"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            placeholder="e.g. cloud-workshop-01"
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Cloud Computing & DevOps Workshop"
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event details, agenda..."
            rows="3"
            className="form-control"
          />
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label>Maximum Capacity (Seats)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Venue / Location</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. Seminar Hall 2 / Google Meet"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {loading ? "Publishing to Cloud..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
}