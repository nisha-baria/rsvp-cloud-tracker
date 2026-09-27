# 📅 Real-Time Cloud-Based Event Planning & RSVP Tracker

A production-grade, cloud-native event planning and attendance tracking system built with **React (Vite)** and **Google Cloud Firestore**. The system handles high-concurrency event registrations with zero page refreshes, guarantees capacity limits using atomic database transactions, supports dynamic waitlisting, and generates on-demand QR passes for on-site check-in.

## 🚀 Key Features

- **⚡ Zero-Refresh Real-Time Sync:** Uses Firestore document and collection snapshot listeners (`onSnapshot`) to deliver real-time metric updates across all connected organizer and attendee clients without manual reloading.
- **🛡️ Concurrency-Safe RSVP & Capacity Control:** Employs atomic database transactions (`runTransaction`) to eliminate race conditions when multiple users RSVP simultaneously for limited seats.
- **⏳ Dynamic Automatic Waitlisting:** Automatically routes attendees to a FIFO waitlist status when event capacity threshold is reached.
- **📱 Dynamic QR Pass Generation:** Dynamically generates custom QR code tokens per event link for seamless on-site check-in verification.
- **📊 Real-Time Organizer Dashboard:** Live overview featuring instant attendee distribution (`Going`, `Maybe`, `Not Going`, `Waitlist`) alongside an interactive attendee ledger.
- **🛠️ Self-Service Event Creation:** Dynamic form supporting custom event identification, venue designations, attendee caps, and scheduled dates.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, JavaScript (ES6+), Modern CSS
- **Backend & Cloud Services:** Google Firebase (Cloud Firestore, Security Rules, Firebase Hosting)
- **Database Engine:** Google Cloud Firestore (NoSQL Document Store)
- **Utilities:** `qrcode` for vector/data-URL QR generation

## 📂 Project Structure

```text
rsvp-cloud-tracker/
├── frontend/
│   ├── public/              # Static assets and icons
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, EventCard, QRScanner)
│   │   ├── pages/           # Application views (Dashboard, RSVPPage, CreateEvent)
│   │   ├── services/        # Firebase initialization & transaction logic
│   │   ├── App.jsx          # Root view switching & layout wrapper
│   │   ├── main.jsx         # Vite entry point
│   │   └── index.css        # Global layout styling and responsive design
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── functions/               # Firebase Cloud Functions (Serverless backend)
├── firebase.json            # Firebase Hosting & service deployment manifest
├── firestore.rules          # Granular database security rules
└── .gitignore

## ⚙️ Quick Local Setup

1. **Clone Repo:**
   ```bash
   cd rsvp-cloud-tracker/frontend

   Install Dependencies:npm install
   Configure Firebase: Add Firebase credentials to frontend/src/services/firebase.js
   Run Project: npm run dev
   Open http://localhost:5173 in browser.

## 🧪 Concurrency & Waitlist Verification Flow

Open Organizer Dashboard on Window A (Capacity: 2).
Open Attendee RSVP Page in an Incognito window (Window B) and submit RSVPs for User 1 and User 2 with status Going.
Observe the Going counter update from 0 to 2 instantaneously on Window A without any refresh.
Submit an RSVP for User 3 with status Going.
The transaction validates that maximum capacity has been saturated, sets User 3 to WAITLIST, and locks goingCount at 2
