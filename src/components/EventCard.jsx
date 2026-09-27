import React from "react";

export default function EventCard({ event }) {
  if (!event) return null;

  return (
    <div className="card" style={{ borderLeft: "5px solid #2563eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
            {event.title}
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "12px" }}>
            {event.description || "Cloud Computing Event"}
          </p>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: event.status === "PUBLISHED" ? "#dcfce7" : "#fee2e2",
            color: event.status === "PUBLISHED" ? "#15803d" : "#b91c1c"
          }}
        >
          {event.status || "PUBLISHED"}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "14px", color: "#334155" }}>
        <div>
          📍 <strong>Venue:</strong> {event.venue || "Online / TBD"}
        </div>
        <div>
          👥 <strong>Capacity:</strong> {event.capacity} seats
        </div>
        {event.eventDate && (
          <div>
            🗓️ <strong>Date:</strong> {event.eventDate}
          </div>
        )}
      </div>
    </div>
  );
}