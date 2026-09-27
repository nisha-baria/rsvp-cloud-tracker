import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

// To create new event
export async function createEvent(eventData, organizerId) {
  const docRef = await addDoc(collection(db, "events"), {
    ...eventData,
    organizerId,
    goingCount: 0,
    maybeCount: 0,
    notGoingCount: 0,
    status: "PUBLISHED",
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Concurrency-safe RSVP update (Database Transaction)
import { runTransaction } from "firebase/firestore";

export async function submitRSVP(eventId, attendeeData, answer) {
  const eventRef = doc(db, "events", eventId);
  const rsvpRef = doc(db, "events", eventId, "rsvps", attendeeData.email);

  return await runTransaction(db, async (transaction) => {
    const eventDoc = await transaction.get(eventRef);
    if (!eventDoc.exists()) {
      throw new Error("Event does not exist!");
    }

    const eventInfo = eventDoc.data();
    const rsvpDoc = await transaction.get(rsvpRef);

    const prevAnswer = rsvpDoc.exists() ? rsvpDoc.data().status : null;
    let goingInc = 0;
    let maybeInc = 0;
    let notGoingInc = 0;

    // Previous status to decrement
    if (prevAnswer === "GOING") goingInc--;
    if (prevAnswer === "MAYBE") maybeInc--;
    if (prevAnswer === "NOT_GOING") notGoingInc--;

    // To add new status
    let finalStatus = answer;
    if (answer === "GOING") {
      if ((eventInfo.goingCount + goingInc + 1) > Number(eventInfo.capacity)) {
        finalStatus = "WAITLIST";
      } else {
        goingInc++;
      }
    } else if (answer === "MAYBE") {
      maybeInc++;
    } else if (answer === "NOT_GOING") {
      notGoingInc++;
    }

    // Atomic update
    transaction.update(eventRef, {
      goingCount: eventInfo.goingCount + goingInc,
      maybeCount: eventInfo.maybeCount + maybeInc,
      notGoingCount: eventInfo.notGoingCount + notGoingInc
    });

    transaction.set(rsvpRef, {
      ...attendeeData,
      status: finalStatus,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { status: finalStatus };
  });
}