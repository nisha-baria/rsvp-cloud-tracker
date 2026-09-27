import React from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "24px" }}>📅</span>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
          Cloud Event Tracker
        </h2>
      </div>

      <nav style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="btn"
          style={{
            backgroundColor: activeTab === "dashboard" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "dashboard" ? "#ffffff" : "#475569"
          }}
        >
          Organizer Dashboard
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className="btn"
          style={{
            backgroundColor: activeTab === "create" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "create" ? "#ffffff" : "#475569"
          }}
        >
          + Create Event
        </button>
        <button
          onClick={() => setActiveTab("rsvp")}
          className="btn"
          style={{
            backgroundColor: activeTab === "rsvp" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "rsvp" ? "#ffffff" : "#475569"
          }}
        >
          Attendee RSVP
        </button>
      </nav>
    </header>
  );
}