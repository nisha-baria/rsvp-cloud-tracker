const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 1. Atomic RSVP Submission with Waitlist Support (Cloud Function)
exports.submitRSVPCloud = functions.https.onCall(async (data, context) => {
  const { eventId, email, name, answer } = data;

  if (!eventId || !email || !answer) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const eventRef = db.collection("events").doc(eventId);
  const rsvpRef = eventRef.collection("rsvps").doc(email);

  return await db.runTransaction(async (transaction) => {
    const eventDoc = await transaction.get(eventRef);
    if (!eventDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Event exist nathi karto");
    }

    const eventData = eventDoc.data();
    const capacity = Number(eventData.capacity) || 100;
    const rsvpDoc = await transaction.get(rsvpRef);

    const prevStatus = rsvpDoc.exists ? rsvpDoc.data().status : null;
    let goingInc = 0;
    let maybeInc = 0;
    let notGoingInc = 0;

    if (prevStatus === "GOING") goingInc--;
    if (prevStatus === "MAYBE") maybeInc--;
    if (prevStatus === "NOT_GOING") notGoingInc--;

    let finalStatus = answer;
    const currentGoing = (eventData.goingCount || 0) + goingInc;

    // Capacity Check
    if (answer === "GOING") {
      if (currentGoing + 1 > capacity) {
        finalStatus = "WAITLIST";
      } else {
        goingInc++;
      }
    } else if (answer === "MAYBE") {
      maybeInc++;
    } else if (answer === "NOT_GOING") {
      notGoingInc++;
    }

    // Atomic update in Firestore
    transaction.update(eventRef, {
      goingCount: (eventData.goingCount || 0) + goingInc,
      maybeCount: (eventData.maybeCount || 0) + maybeInc,
      notGoingCount: (eventData.notGoingCount || 0) + notGoingInc
    });

    transaction.set(
      rsvpRef,
      {
        name: name || "Anonymous",
        email: email,
        status: finalStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return { success: true, status: finalStatus };
  });
});

// 2. On-Site QR / RFID Check-In Endpoint
exports.checkin = functions.https.onRequest(async (req, res) => {
  const { eventId, email } = req.query;

  if (!eventId || !email) {
    return res.status(400).json({ error: "eventId and email are required" });
  }

  try {
    const rsvpRef = db.collection("events").doc(eventId).collection("rsvps").doc(email);
    const docSnap = await rsvpRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Attendee record not found" });
    }

    await rsvpRef.update({
      checkedIn: true,
      checkInTime: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true, message: "Checked-in successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});