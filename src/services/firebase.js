import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForSecurity12345",
  authDomain: "rsvp-cloud-tracker.firebaseapp.com",
  projectId: "rsvp-cloud-tracker",
  storageBucket: "rsvp-cloud-tracker.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
