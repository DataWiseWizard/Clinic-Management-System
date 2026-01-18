# ClinicOS: Distributed Real-Time Clinic Management System

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-blueviolet)
![PWA](https://img.shields.io/badge/PWA-Offline--First-blue)

> **A Next-Generation Healthcare Platform engineered for high availability, security, and real-time interoperability.**

---

## 📖 Executive Summary
ClinicOS is not just a digital form for patient data; it is a **distributed system** designed to solve the "fragmentation problem" in modern healthcare.

Traditional systems rely on manual refreshes and disconnected silos (Reception vs. Doctor). ClinicOS utilizes an **Event-Driven Architecture** to synchronize state across multiple clients in real-time. It features a public-facing "Smart Kiosk" for contactless check-ins, a secure "Gatekeeper" approval workflow for staff, and an offline-first PWA foundation ensuring operations continue even during network outages.

## 🏗️ System Architecture & Design Patterns

This project moves beyond basic CRUD operations to demonstrate advanced engineering patterns:

### 1. The Gatekeeper Pattern (Security)
* **Problem:** Allowing public patients to write to the database poses a security risk (spam/attacks).
* **Solution:** Implemented a "Demilitarized Zone" (DMZ) collection called `incoming_requests`. Public Kiosks can *only* write here.
* **Workflow:** Data is sanitized and held in a "Pending" state until an authenticated Receptionist explicitly approves it. Only then is it promoted to the secure `patients` and `queue` collections.

### 2. Event-Driven State Management (Real-Time)
* **Problem:** Polling the database (e.g., `setInterval`) is inefficient and drains battery.
* **Solution:** Leveraged **WebSocket-based Listeners (Firestore Snapshots)**.
* **Impact:** When a Receptionist approves a patient, the Patient's phone screen updates from "Waiting" to "Token #105" in **<100ms** without a page reload.

### 3. Offline-First Resilience (PWA)
* **Problem:** Clinics often face intermittent internet connectivity.
* **Solution:** Engineered a **Progressive Web App (PWA)** with a custom Service Worker strategy.
* **Mechanism:** Critical assets (Vendor bundles, UI) are cached via Workbox. Data writes are queued locally (IndexedDB) and synchronized when the connection is restored.

---

## 🚀 Key Features

### 🛡️ Role-Based Access Control (RBAC)
* **Strict Isolation:** Dynamic routing prevents "Route Guessing."
* **Doctor View:** Focuses on Clinical Queue, Patient History, and Analytics.
* **Reception View:** Focuses on Intake, Billing, and Queue Management.

### 📲 Contactless "Smart Kiosk"
* **Self Check-In:** Patients scan a QR code to join the queue via their own device.
* **Live Feedback:** Shows real-time "People Ahead" and "Estimated Wait Time" calculated dynamically.
* **Audio/Visual Alerts:** Triggers haptic feedback and sound when the doctor calls the token.

### 📊 Predictive Analytics Engine
* **Visual Insights:** Integrated `Recharts` to visualize patient traffic trends and revenue streams.
* **Data-Driven:** Helps clinic administrators identify "Peak Hours" and optimize staffing.

### 💳 Integrated Finance Module
* **Closed-Loop Billing:** Tracks appointments from "Consultation" to "Payment Pending" to "Paid."
* **PDF Generation:** On-demand generation of professional invoices using `@react-pdf/renderer`.

---

## 🛠️ Tech Stack

* **Frontend Core:** React 18, Vite (for optimized HMR and bundling).
* **State & Logic:** Context API + Custom Hooks (Separation of Concerns).
* **Backend-as-a-Service:** Firebase (Auth, Firestore, Hosting).
* **Styling System:** Tailwind CSS (Utility-first for rapid UI iteration).
* **Visualization:** Recharts (Data analytics).
* **Performance:** Code Splitting & Lazy Loading (Optimized vendor chunking).

---

## ⚡ Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/DataWiseWizard/Clinic-Management-System.git]
    cd clinic-management-system
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    VITE_API_KEY=your_api_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    VITE_STORAGE_BUCKET=your_project.appspot.com
    VITE_MESSAGING_SENDER_ID=your_sender_id
    VITE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 🔮 Future Roadmap

* **Telemedicine Integration:** WebRTC implementation for remote consultations.
* **Inventory Management:** Tracking medicine stock levels in real-time.
* **Cloud Functions:** Automated SMS/Email notifications upon registration (Serverless triggers).

---

**Developed by Rudraksha Kumbhkar**
*Engineered for Scale, Built for People.*