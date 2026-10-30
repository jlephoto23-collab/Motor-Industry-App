# Motor Industry App

A modern **Dealer Management System (DMS)** for the motor / automotive industry.

✅ **Progressive Web App (PWA)** – Installable from the browser  
✅ **Capacitor-ready** – Build a real Android APK  
✅ Fully client-side (HTML + CSS + JavaScript + localStorage)

---

## Features

- Login & Authentication (demo users)
- Dashboard with live stats
- Vehicle Inventory (CRUD)
- Customers / Leads CRM
- Service Bookings / Job Cards
- Parts Inventory with low-stock warnings
- Responsive design
- Offline support via Service Worker
- “Install App” button (PWA)
- “Download APK” button with build instructions

---

## Demo Login Credentials

| Username | Password  | Role    |
|----------|-----------|---------|
| admin    | admin123  | Admin   |
| sales    | sales123  | Sales   |
| tech     | tech123   | Service |

---

## How to Run Locally

Because the app uses ES6 modules, serve it with a local web server:

```bash
# Option 1 – Node
npx serve .

# Option 2 – Python
python -m http.server 8000

# Option 3 – VS Code Live Server extension
```

Then open the URL shown (usually `http://localhost:3000` or `http://localhost:8000`).

---

## Progressive Web App (PWA)

The app is a full PWA:

- `manifest.json` – app name, icons, theme colour, standalone mode
- `sw.js` – Service Worker for offline caching
- Install prompt appears on supported browsers (Chrome, Edge, Android)
- “Install App” button appears in the top bar when the browser offers installation

**To install on phone:**
1. Open the app in Chrome / Edge on Android
2. Tap the menu → “Install app” or “Add to Home screen”
3. Or click the **Install App** button when it appears

---

## Build Android APK with Capacitor

The project is fully prepared for Capacitor.

### Prerequisites
- Node.js 18+
- Android Studio (with Android SDK)
- Java JDK 17+

### Step-by-step

```bash
# 1. Install dependencies
npm install

# 2. Add the Android platform (only needed once)
npx cap add android

# 3. Sync web assets into the native project
npx cap sync

# 4. Open the project in Android Studio
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to finish
2. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Or run on an emulator / connected device

The debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Useful npm scripts (already in package.json)

```bash
npm run cap:sync          # Sync web code to native
npm run cap:open:android  # Open Android Studio
```

### Alternative: PWABuilder (no Android Studio needed)
1. Host the site (GitHub Pages, Netlify, Vercel…)
2. Go to https://www.pwabuilder.com
3. Enter your URL → Generate → Android package

---

## Project Structure

```
Motor-Industry-App/
├── index.html                 # Main SPA + Login + PWA meta
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── package.json               # Capacitor + scripts
├── capacitor.config.json      # Capacitor configuration
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── dashboard.js
│   ├── vehicles.js
│   ├── customers.js
│   ├── services.js
│   └── parts.js
├── icons/                     # Place icon-192.png & icon-512.png here
└── README.md
```

---

## Adding App Icons

Place these files in the `icons/` folder:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

Generate them at:
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io

---

## Tech Stack

- HTML5 + CSS3 + Vanilla JS (ES modules)
- Bootstrap 5
- localStorage (data + session)
- Progressive Web App (manifest + service worker)
- Capacitor 6 (ready for Android APK)

---

Created for the Motor Industry App project.