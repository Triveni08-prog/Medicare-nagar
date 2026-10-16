# MediCare Nagpur - Doctor Appointment Booking Web Application

A modern, responsive, bilingual (English & Hindi) healthcare web application developed for patients in **Nagpur, Maharashtra, India**. 

Built as a **Bachelor of Computer Applications (BCA) Final Year Project Demonstration**, MediCare Nagpur connects citizens with verified doctors, specialty clinics, interactive GPS route navigation, 24x7 emergency medical assistance, and digital appointment tokens.

---

## 🌟 Key Features

### 1. Doctor Directory & Smart OPD Scheduler
- **Search & Filters:** Search by doctor name, specialty, clinic name, or Nagpur locality (Dharampeth, Dhantoli, Ramdaspeth, Sitabuldi, Sadar, Wardha Road, Medical Square, etc.).
- **9 Core Medical Departments:** General Physician, Cardiologist, Dentist, Dermatologist, Pediatrician, Gynecologist, Orthopedic, Eye Specialist, and ENT.
- **OPD Slot Locking & Collision Prevention:** Prevents double booking of the same slot across active patients.
- **Verified Demo Registration Badges:** Transparently labeled as demo council registrations (`MMC-NAG-DEMO-XXXX`) adhering to medical ethics.
- **Patient Reviews & Ratings:** Read authentic clinic feedback and submit verified star reviews.

### 2. Clinic Locator & Interactive GPS Map
- **Interactive Coordinates Map:** Custom Nagpur city vector map projecting real GPS positions of clinics and emergency centers.
- **Real-Time Haversine Distance Engine:** Computes driving distance (km) and estimated road travel time (minutes) from user's live coordinates.
- **Graceful Fallback:** If browser location access is denied or HTTPS is absent, patients can choose any Nagpur locality from the dropdown.
- **Google Maps Integration:** Direct deep-links to turn-by-turn driving directions (`https://www.google.com/maps/dir/...`).

### 3. 24x7 Emergency Help Desk
- **One-Tap Dialing:** Emergency `tel:` links for:
  - `108` - National Free Ambulance Service
  - `112` - All-in-One Emergency Response
  - `102` - Janani Shishu Maternity Ambulance
- **Nagpur Apex Trauma Centers:**
  - Government Medical College & Hospital (GMCH Nagpur), Medical Square (`0712-2744400`)
  - All India Institute of Medical Sciences (AIIMS Nagpur), MIHAN (`0712-2814800`)
  - Kingsway Hospitals, Kasturchand Park (`0712-6789100`)
  - Orange City Hospital & Research Institute (OCHRI), Khamla (`0712-6691100`)
  - Alexis Hospital (Max Healthcare), Mankapur (`0712-7120000`)
- **Safety Protocol:** Prominently warns patients to never delay emergency treatment for registration or appointment forms.

### 4. Bilingual Support (English & हिन्दी)
- Instant dual-language toggle in the navigation bar.
- Comprehensive translations across categories, appointment forms, receipts, cancellation reasons, and emergency guidance.

### 5. Patient Portal & Digital Token Slips
- **Demo Access:** 1-Click quick demo accounts for examiners (`Rahul Sharma` and `Pooja Patil`).
- **Appointment Management:** View upcoming bookings, reschedule to a new date/slot, or cancel with instant slot release.
- **Printable Receipts:** Digital token slip generation with unique IDs (`MCN-2026-XXXX`).

### 6. Nagpur Health Guides & First Aid
- Heatstroke prevention during extreme Vidarbha summer heatwaves (45°C+).
- Monsoon dengue and malaria fever protocols.
- Hands-Only CPR emergency first-aid guide.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Animation & Effects:** Motion, Canvas-Confetti
- **State & Persistence:** Decoupled `StorageService` with browser persistence and Firestore document schema mirroring
- **Build Tool:** Vite 8
- **Platform:** Designed for Cloud Run and web deployment

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd medicare-nagpur

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🔑 Firebase & External Services Setup

### Firebase Firestore & Authentication (Production Setup)
The project data layer (`src/services/storage.ts`) is designed to connect to Firebase Firestore:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Firebase Authentication** (Email/Password or Phone Auth).
3. Create an `.env` file based on `.env.example`:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```
4. **Firestore Collections Schema:**
   - `/appointments/{appointmentId}`
   - `/doctors/{doctorId}`
   - `/clinics/{clinicId}`
   - `/users/{userId}`
   - `/reviews/{reviewId}`

### Google Maps API Setup (Optional)
The application currently uses real GPS coordinates, the mathematical Haversine formula, and direct Google Maps deep-links. To embed a dynamic Google Maps JavaScript SDK widget:
1. Obtain an API Key from [Google Cloud Console](https://console.cloud.google.com/) with **Maps JavaScript API** enabled.
2. Add to `.env`:
```env
VITE_GOOGLE_MAPS_API_KEY="your-maps-api-key"
```

---

## 📋 Evaluation & Demonstration Scenarios (For BCA Examiners)

1. **Conflict Resolution:** Try booking Dr. Anand Deshmukh for `10:00 AM`. Attempt to book the same slot again in another tab; the system immediately tags it as `Booked` and rejects collision.
2. **Rescheduling:** Open "Patient Portal" -> "Reschedule". Pick a new open slot; the original slot is released and the new slot is locked.
3. **Location Permission:** Tap "Find Nearby Clinics". Accept browser permission to see live distance in km. If denied, pick a locality (e.g. Dharampeth) to see distances calculated from the area centroid.
4. **Hindi Language Switch:** Click "हिन्दी" in the top bar to verify translation across all forms and receipts.
5. **Print Token:** After scheduling, click "Print / Save Receipt" to test the printable token slip.

---

## ⚠️ Known Limitations & Medical Disclaimer

- **Informational Portal:** MediCare Nagpur is an academic project. Medical details are verified demo representations of Nagpur medical council practices.
- **Emergency Protocol:** In genuine medical crises, dial `108` or `112` or rush immediately to GMCH Medical Square or AIIMS Nagpur.

---

## 📄 License
Academic Demonstration License - Developed for BCA Final Year Evaluation.
