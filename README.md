# 🛡️ PhishGuard - SOC Threat Intelligence Dashboard

> **"Trust No One. Verify Everything."**

![Status](https://img.shields.io/badge/System-Operational-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Gemini%20AI-cyan?style=for-the-badge)

**PhishGuard** is a next-generation cybersecurity dashboard designed for SOC analysts and security professionals. It combines multi-layer heuristic analysis with **Google's Gemini AI** to detect phishing attempts, analyze malicious URLs, and visualize global threats in real-time.

---

## ✨ Key Features

### 🔍 Advanced Phishing Detection
- **Multi-Layer Analysis**: Checks URL structure, domain reputation, and SSL validity.
- **AI-Powered Verdicts**: Uses Gemini 3 Flash model to interpret social engineering context.
- **Confidence Scoring**: Returns a precise risk score (0-100%) with explainable insights.
- **Red Flag Highlighting**: Identifies specific threats like homograph attacks and typosquatting.

### 🖥️ Professional SOC UI/UX
- **Dark Mode Aesthetic**: Enterprise-grade "Midnight Blue" theme designed to reduce eye strain.
- **Glassmorphism**: Modern frosted glass panels with subtle neon accents.
- **Cinematic Scanning**: Immersive scan-line animations and visual feedback during analysis.
- **Smart Paste Detection**: Automatically initiates a deep scan the moment a URL is pasted.
- **Responsive Design**: Fully optimized for desktops, tablets, and large monitoring screens.

### 🛠️ Integrated Security Tools
- **Context-Aware Execution**: Specialized modals with detailed tool descriptions and live terminal output.
- **DNS Propagation**: Real-time lookup using Google's DNS over HTTPS (DoH).
- **WHOIS & SSL Inspector**: AI-simulated deep dives into domain ownership and certificate chains.
- **Port Scanner & Header Analyzer**: Reconnaissance tools powered by AI grounding.
- **Terminal Interface**: Interactive command-line style output for tool execution.

### 🌐 Live Threat Intelligence
- **Global Feed**: Real-time scrolling feed of simulated cyber attacks (SQLi, XSS, C2 Callbacks).
- **Sector Analysis**: Visualization of targets across Finance, Healthcare, and Government sectors.

### 👨‍💻 Developer API Hub
- **API Playground**: Built-in documentation with dynamic code snippets (cURL, Node, Python).
- **Key Management**: Interface to regenerate and copy API keys.
- **Usage Metrics**: Live visualization of API latency and uptime.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A valid Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/saichandram/phishguard.git
cd phishguard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
The application requires a Google Gemini API key to function. 
*Note: In this demo environment, the key is accessed via `process.env.API_KEY`.*

### 4. Run Development Server
```bash
npm start
```
The application will launch at `http://localhost:1234` (or your configured port).

---

## 📖 Usage Guide

1. **Dashboard Scan**: 
   - Paste a suspicious URL (e.g., `http://secure-login-update.com`) into the main search bar.
   - The system detects the paste and automatically triggers the scan with a visual "scan line" effect.
   - Review the **Risk Level**, **Confidence Score**, and **SOC Analyst Explanation**.

2. **Deep Dive**:
   - Navigate to the **"Analysis Tools"** tab.
   - Select a tool (e.g., *SSL Decoder*) to view its specific capabilities in the description banner before execution.

3. **Monitor**:
   - Keep the **"Live Feed"** open on a secondary monitor to simulate a Security Operations Center environment.

---

## 📦 Deployment

This project is built with React and Vite/Parcel, making it easy to deploy on modern frontend platforms.

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` inside the project folder.
3. Ensure your `API_KEY` is added to Vercel's Environment Variables.

### Netlify
1. Run `npm run build`.
2. Deploy the `dist` folder.

---

## 👨‍💻 Credits

**Developed by Saichandram**

> "Building the future of secure interfaces."

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.