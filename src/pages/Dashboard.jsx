import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import QRCode from "qrcode";

export default function Dashboard({ eventId }) {
  const [eventData, setEventData] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    if (!eventId) return;

    // 1. Event Meta Info Listener (Title, Venue, Capacity)
    const unsubEvent = onSnapshot(doc(db, "events", eventId), (docSnap) => {
      if (docSnap.exists()) {
        setEventData(docSnap.data());
      }
    });

    // 2. Real-time RSVP List & Automatic Dynamic Counts Listener
    const unsubRsvps = onSnapshot(collection(db, "events", eventId, "rsvps"), (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setRsvps(list);
    });

    // 3. QR Code Generation
    const inviteLink = `${window.location.origin}/rsvp/${eventId}`;
    QRCode.toDataURL(inviteLink).then(setQrUrl);

    return () => {
      unsubEvent();
      unsubRsvps();
    };
  }, [eventId]);

  if (!eventData) return <div style={{ padding: 20 }}>Event load thai rahyo chhe...</div>;

  // Dynamic counts from live subcollection records dynamic counts
  const dynamicGoing = rsvps.filter((r) => r.status === "GOING").length;
  const dynamicMaybe = rsvps.filter((r) => r.status === "MAYBE").length;
  const dynamicNotGoing = rsvps.filter((r) => r.status === "NOT_GOING").length;
  const dynamicWaitlist = rsvps.filter((r) => r.status === "WAITLIST").length;

  return (
    <div style={{ maxWidth: 850, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Organizer Dashboard: {eventData.title}</h2>
      <p>
        Capacity: <strong>{eventData.capacity}</strong> | Venue: <strong>{eventData.venue}</strong>
      </p>

      {/* Real-time Cards */}
      <div style={{ display: "flex", gap: "16px", margin: "20px 0" }}>
        <div style={{ flex: 1, padding: 16, background: "#dcfce7", borderRadius: 8 }}>
          <h3 style={{ margin: 0, color: "#166534" }}>Going</h3>
          <h1 style={{ margin: "10px 0 0 0" }}>{dynamicGoing}</h1>
        </div>
        <div style={{ flex: 1, padding: 16, background: "#fef9c3", borderRadius: 8 }}>
          <h3 style={{ margin: 0, color: "#854d0e" }}>Maybe</h3>
          <h1 style={{ margin: "10px 0 0 0" }}>{dynamicMaybe}</h1>
        </div>
        <div style={{ flex: 1, padding: 16, background: "#fee2e2", borderRadius: 8 }}>
          <h3 style={{ margin: 0, color: "#991b1b" }}>Not Going</h3>
          <h1 style={{ margin: "10px 0 0 0" }}>{dynamicNotGoing}</h1>
        </div>
        <div style={{ flex: 1, padding: 16, background: "#e0e7ff", borderRadius: 8 }}>
          <h3 style={{ margin: 0, color: "#3730a3" }}>Waitlist</h3>
          <h1 style={{ margin: "10px 0 0 0" }}>{dynamicWaitlist}</h1>
        </div>
      </div>

      {/* QR Code Section */}
      <div style={{ margin: "24px 0", textAlign: "center" }}>
        <h4>Share Invite QR Code</h4>
        {qrUrl && <img src={qrUrl} alt="Invite QR" style={{ width: 150 }} />}
      </div>

      {/* Attendee Live Table */}
      <h3>Live Attendees List ({rsvps.length})</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", borderColor: "#e2e8f0" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Status</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td style={{ fontWeight: "bold", color: r.status === "WAITLIST" ? "#4338ca" : "#0f172a" }}>
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}