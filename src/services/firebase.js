import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6IicXDuavvJ1uYE6rRlBkfyKxp5mqeKk",
  authDomain: "rsvp-cloud-tracker.firebaseapp.com",
  projectId: "rsvp-cloud-tracker",
  storageBucket: "rsvp-cloud-tracker.firebasestorage.app",
  messagingSenderId: "102387664825",
  appId: "1:102387664825:web:2268f0a982a16a5ffb1868",
  measurementId: "G-WZVJ2S4RS1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);