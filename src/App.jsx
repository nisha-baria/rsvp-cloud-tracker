import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RSVPPage from "./pages/RSVPPage";
import CreateEvent from "./pages/CreateEvent";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEventId, setSelectedEventId] = useState("event-101");

  const handleEventCreated = (newEventId) => {
    setSelectedEventId(newEventId);
    setActiveTab("dashboard");
  };

  return (
    <div className="container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === "dashboard" && <Dashboard eventId={selectedEventId} />}
        {activeTab === "create" && <CreateEvent onEventCreated={handleEventCreated} />}
        {activeTab === "rsvp" && <RSVPPage eventId={selectedEventId} />}
      </main>
    </div>
  );
}