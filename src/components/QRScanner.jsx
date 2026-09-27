import React, { useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function QRScanner({ eventId }) {
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check-In function: Attendee's RSVP record is verified and marked 'Checked-In'
  const handleCheckIn = async (emailToVerify) => {
    const targetEmail = (emailToVerify || attendeeEmail).trim().toLowerCase();

    if (!targetEmail) {
      setErrorMsg("Please enter the attendee's email or scan the QR!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setScanResult(null);

    try {
      const rsvpDocRef = doc(db, "events", eventId, "rsvps", targetEmail);
      const rsvpSnap = await getDoc(rsvpDocRef);

      if (!rsvpSnap.exists()) {
        setErrorMsg("No RSVP record found! Not on the Attendee list.");
        setLoading(false);
        return;
      }

      const attendeeData = rsvpSnap.data();

      // Give notification if already check-in
      if (attendeeData.checkedIn) {
        setScanResult({
          alreadyChecked: true,
          name: attendeeData.name,
          email: targetEmail,
          status: attendeeData.status,
          time: attendeeData.checkedInAt?.toDate?.()?.toLocaleTimeString() || "Earlier"
        });
        setLoading(false);
        return;
      }

      // Live Firestore document update: Do check-in status True
      await updateDoc(rsvpDocRef, {
        checkedIn: true,
        checkedInAt: serverTimestamp()
      });

      setScanResult({
        alreadyChecked: false,
        name: attendeeData.name,
        email: targetEmail,
        status: attendeeData.status,
        time: new Date().toLocaleTimeString()
      });
      setAttendeeEmail("");
    } catch (err) {
      setErrorMsg("An error occured Check-in: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: "560px", margin: "20px auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ fontSize: "24px" }}>📱</span>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
          Venue Check-In & QR Scanner Kiosk
        </h3>
      </div>

      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
        The event venue will invite the invitees to enter their email address or scan their digital badge.
      </p>

      {/* Manual / Barcode input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="email"
          placeholder="Attendee Email (e.g. test1@example.com)"
          value={attendeeEmail}
          onChange={(e) => setAttendeeEmail(e.target.value)}
          className="form-control"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => handleCheckIn()}
          disabled={loading}
          className="btn btn-primary"
          style={{ whiteSpace: "nowrap" }}
        >
          {loading ? "Checking..." : "Verify & Check-In"}
        </button>
      </div>

      {/* Quick Test Demo Buttons */}
      <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>
          QUICK SIMULATOR (DUMMY BADGE CLICK):
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleCheckIn("test1@example.com")}
            className="btn"
            style={{ fontSize: "12px", padding: "6px 12px", background: "#e2e8f0" }}
          >
            Scan: test1@example.com
          </button>
          <button
            onClick={() => handleCheckIn("test2@example.com")}
            className="btn"
            style={{ fontSize: "12px", padding: "6px 12px", background: "#e2e8f0" }}
          >
            Scan: test2@example.com
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMsg && (
        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px"
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Success / Result Card */}
      {scanResult && (
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: scanResult.alreadyChecked ? "#fef3c7" : "#dcfce7",
            border: `1px solid ${scanResult.alreadyChecked ? "#f59e0b" : "#22c55e"}`
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: scanResult.alreadyChecked ? "#92400e" : "#166534" }}>
              {scanResult.alreadyChecked ? "⚠️ Already Checked-In!" : "✅ Entry Approved!"}
            </h4>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "4px",
                background: scanResult.status === "GOING" ? "#16a34a" : "#ca8a04",
                color: "#ffffff"
              }}
            >
              {scanResult.status}
            </span>
          </div>

          <div style={{ marginTop: "10px", fontSize: "14px", color: "#334155" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Name:</strong> {scanResult.name}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Email:</strong> {scanResult.email}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Timestamp:</strong> {scanResult.time}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}