# 🏭 Closed Loop Maintenance PC Companion

> **Inspiring the next generation of Engineers**

A comprehensive Electron.js application for industrial maintenance training, featuring interactive worksheets, advanced analytics dashboard, dynamic theming, and a modern, unified user experience.

<img width="1383" height="845" alt="image" src="https://github.com/user-attachments/assets/47d14b85-c53a-4bb7-9268-192e1b7649f9" />

---

## 🆕 What's New in Version 1.0.0

### 🎨 **Modern Unified Navigation & Branding**
- **Consistent Navigation Bar**: Home, CP0539, CP6773, Settings
- **Branding**: "Inspiring the next generation of Engineers" in the header on every page
- **Responsive Header**: Title resizes to fit all screens, never wraps
- **No more Worksheets nav**: Navigation is now scenario- and module-focused

### 🌈 **Dynamic Theming & Settings**
- **Theme Customization**: Change background and accent color from the Settings page
- **Settings Saved to Config File**: Preferences are stored in `settings.json` (not just localStorage)
- **Instant Theme Application**: Changes apply across all pages and persist between sessions

### 🖥️ **Unified Look & Feel**
- **Boxed Windows**: All main content areas use a consistent, solid background for clarity
- **Subtle Honeycomb Pattern**: Only on the global background, not inside content boxes
- **No Floating Titles**: Page titles are now part of the main content area for a cohesive look

---

## 🚀 Features (Updated)

- **Unified Navigation**: Home, CP0539, CP6773, Settings
- **Dynamic Theming**: User-selectable background and accent color, saved to config file
- **Branding**: "Inspiring the next generation of Engineers" header
- **Responsive UI**: Header text resizes, boxed content areas, and modern design
- **Settings Page**: Change theme, all preferences saved to `settings.json`
- **Interactive Worksheets & Fault Scenarios**
- **Student Portal & Teacher Dashboard**
- **Persistent Progress & Analytics**

---

## 🧑‍💻 Technology Stack (Detailed)

### ⚡ Electron
- **Electron Version:** 25.x (see `package.json`)
- **Main Process:** Handles window creation, navigation, security, and settings management
- **Preload Script:** Uses `contextBridge` to safely expose APIs (settings, navigation, PDF opening) to the renderer
- **IPC (Inter-Process Communication):**
  - `ipcMain` and `ipcRenderer` for secure communication between renderer and main
  - Used for reading/writing settings (`settings.json`), navigation, and file operations
- **Security Features:**
  - `contextIsolation: true` (renderer and preload are isolated)
  - `sandbox: false` (for compatibility, but context isolation is enforced)
  - `webSecurity: false` (for local file access, but only trusted files are loaded)
  - `nodeIntegration: false` (no direct Node.js access in renderer)
  - Custom preload script for all privileged operations
- **Window Management:**
  - Single main window, maximized on launch
  - Custom navigation via exposed API (`window.electron.navigate`)
- **PDF Handling:**
  - Securely opens PDFs in the user's default viewer via main process
- **Settings Storage:**
  - All user preferences (theme, etc.) are saved to `settings.json` via IPC and Node.js `fs` module
- **Packaging:**
  - Built and distributed with `electron-builder` for Windows, Mac, and Linux

### 🟢 Node.js & npm
- **Node.js:** v16+ required
- **npm:** v8+ required
- **Key dependencies:**
  - `electron`, `electron-builder`, `jquery`, `animejs`, `pdfjs-dist`

### 🌐 Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Custom CSS Grid** for layout
- **Responsive Design:** Uses CSS `clamp()`, media queries, and flex/grid for all screen sizes
- **Branding:** Matrix logo, custom icons, and "Inspiring the next generation of Engineers" header
- **Dynamic Theming:** CSS variables for background and accent color, updated via settings
- **Libraries:**
  - **jQuery:** For DOM manipulation and event handling
  - **anime.js:** For splash screen and subtle animations
  - **Font Awesome:** For icons
  - **Chart.js:** (if used for analytics/dashboard)

### 🗂️ File System & Config
- **Settings:**
  - All user preferences are stored in `settings.json` in the app directory
  - Read/written via Electron IPC and Node.js `fs` module
- **Data:**
  - Training content and scenarios in JSON files (`dbMaintenanceScenarios.json`, `dbFaultScenarios.json`)

### 🔒 Security Practices
- **No remote code execution**
- **No nodeIntegration in renderer**
- **All privileged operations go through preload/contextBridge and IPC**
- **Only trusted local files are loaded**

### 🏗️ Build & Release
- **electron-builder** for packaging and code signing
- **Cross-platform:** Windows, Mac, Linux
- **Release scripts:** See `scripts/` and `package.json`

---

## ⚙️ Settings & Customization (New)

- **Settings Page**: Access from the navigation bar
- **Theme**: Change background and accent color
- **Persistence**: All settings are saved to `settings.json` in the app directory
- **How it works**: Settings are loaded on every page and applied instantly

---

## 📋 Navigation Structure

- **Home**: Overview and quick access to main features
- **CP0539**: Industrial Maintenance Worksheets
- **CP6773**: Troubleshooting & Fault-Finding Scenarios
- **Settings**: Theme and app preferences

---

## 📖 Usage Guide (Quick Start)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hadefuwa/closed-loop-maint-v1.git
   cd closed-loop-maint-v1
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Launch the Application**
   ```bash
   npm start
   ```
4. **Configure Your Theme**
   - Click **Settings** in the navigation bar
   - Choose your background and accent color
   - Save and enjoy your personalized experience!

---

## 🏢 About

This application is developed by Matrix for industrial maintenance operations. For support or inquiries, please contact our development team.

**Built with ❤️ for Industrial Maintenance Professionals**

---

## 🌐 Web & PWA Version (2024+)

This project is now a Progressive Web App (PWA) and can be deployed as a static website (e.g., GitHub Pages, Netlify, Vercel).

### 🚀 Features
- Installable on desktop and mobile (Add to Home Screen)
- Offline support (service worker caching)
- In-browser PDF viewing (PDF.js)
- Settings and theme stored in browser (localStorage)
- Responsive, touch-friendly UI

### 📦 Deployment (GitHub Pages)
1. **Push your code to the `main` branch** (or `gh-pages` if you prefer).
2. In your repository settings, set GitHub Pages to serve from the root or `/docs` folder.
3. Make sure all paths are relative (already configured).
4. Add the PDF.js viewer files to `pdfjs/web/` (see below).
5. Visit `https://<your-username>.github.io/<repo-name>/` to use the app.

### 📄 PDF.js Integration
- Download the latest PDF.js release from https://github.com/mozilla/pdf.js/releases
- Copy the `web/` folder to `pdfjs/web/` in your project
- The app will use `pdf-viewer.html` to display PDFs in-browser

### 📝 Manifest & Service Worker
- `manifest.json` and `service-worker.js` are included for PWA installability and offline support
- App icons should be placed in `assets/icons/` (192x192 and 512x512 PNG recommended)

### ⚠️ Electron Deprecation
- All Electron/Node.js code has been removed
- No main process, preload, or IPC code remains
- Settings are now stored in browser storage

---
