# 🛡️ APK Guardian - Complete Guide

**Mobile Threat Intelligence Platform for Android APK Security Analysis**

---

## 📋 Table of Contents

1. [Quick Start (5 Minutes)](#quick-start)
2. [Project Overview](#project-overview)
3. [Installation & Setup](#installation--setup)
4. [Supabase Configuration](#supabase-configuration)
5. [Features & Usage](#features--usage)
6. [Architecture](#architecture)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Hackathon Submission](#hackathon-submission)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- Git
- Supabase account (optional, for authentication)

### 1. Clone Repository

```bash
git clone https://github.com/Amoghboss/apkshield.git
cd apkshield
```

### 2. Setup Backend

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install fastapi uvicorn androguard httpx cryptography
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

### 4. Configure Supabase (Optional)

Open `frontend/.env.local` and add your credentials:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get credentials from:**
- Go to https://supabase.com/dashboard
- Select your project → Settings → API
- Copy Project URL and anon public key

### 5. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open App

- **APK Scanner:** http://localhost:3000
- **Login Page:** http://localhost:3000/auth
- **Dashboard:** http://localhost:3000/dashboard

---

## 📖 Project Overview

### What is APK Guardian?

APK Guardian is a comprehensive Android APK security analysis platform designed for **Hackathon Problem Statement 3: Mobile App Fraud Detection**. It helps users identify potentially malicious or fraudulent Android applications before installation.

### Key Features

✅ **APK File Upload** - Drag-and-drop interface for APK files  
✅ **URL Scanning** - Scan APKs from direct download links  
✅ **Real-time Progress** - WebSocket-based live scanning updates  
✅ **Permission Analysis** - 35+ dangerous permission detection  
✅ **Fraud Detection** - 8 fraud pattern algorithms  
✅ **Certificate Validation** - Self-signed & expired cert detection  
✅ **Component Analysis** - Activities, Services, Receivers, Providers  
✅ **Plain-English Reports** - User-friendly threat explanations  
✅ **Share Functionality** - WhatsApp, Telegram, Email, Clipboard  
✅ **Multi-Verdict System** - DANGEROUS/SUSPICIOUS/LOW RISK/SAFE  
✅ **Authentication** - Email + Google OAuth (optional)  

### Technology Stack

**Backend:**
- FastAPI (Python web framework)
- Androguard (APK static analysis)
- WebSockets (real-time communication)
- ThreadPoolExecutor (async processing)

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4
- Motion (animations)
- Recharts (data visualization)
- Supabase (authentication)

---

## 🔧 Installation & Setup

### Detailed Backend Setup

1. **Create Virtual Environment:**
   ```bash
   python -m venv .venv
   ```

2. **Activate Virtual Environment:**
   ```bash
   # Windows
   .venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install fastapi uvicorn androguard httpx cryptography
   ```

4. **Verify Installation:**
   ```bash
   python -c "import androguard; print('Androguard installed successfully')"
   ```

5. **Start Backend Server:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

   Expected output:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete.
   ```

### Detailed Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment:**
   ```bash
   # Copy template
   cp .env.template .env.local
   
   # Edit .env.local with your Supabase credentials
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

   Expected output:
   ```
   VITE v6.4.2  ready in 866 ms
   ➜  Local:   http://localhost:3000/
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔐 Supabase Configuration

### Why Supabase?

Supabase provides authentication, database, and real-time features. It's optional but enables:
- User accounts (email/password)
- Google OAuth sign-in
- Scan history storage
- User profiles

### Step 1: Get Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create new)
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### Step 2: Add to Environment File

Open `frontend/.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here

# Optional: AI Features
GEMINI_API_KEY=your_gemini_api_key_here

# App URL
APP_URL=http://localhost:3000
```

### Step 3: Enable Authentication Providers

1. In Supabase Dashboard: **Authentication** → **Providers**
2. Enable **Email** (for email/password sign-in)
3. Enable **Google** (for Google OAuth):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase
4. Click **Save**

### Step 4: Add Redirect URLs

1. In Supabase Dashboard: **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   https://yourdomain.com  # Production URL
   ```
3. Click **Save**

### Step 5: Create Database Tables (Optional)

Run this SQL in **SQL Editor**:

```sql
-- Scan history table
CREATE TABLE scan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  verdict TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  scan_date TIMESTAMPTZ DEFAULT NOW(),
  findings JSONB,
  fraud_signals JSONB,
  source_url TEXT
);

-- Enable Row Level Security
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own scans
CREATE POLICY "Users can view own scans"
  ON scan_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
  ON scan_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_scan_date ON scan_history(scan_date DESC);
```

### Step 6: Restart Frontend

```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

---

## 🎯 Features & Usage

### 1. APK File Upload

**How to Use:**
1. Go to http://localhost:3000
2. Drag and drop an APK file into the upload zone
3. Or click to browse and select file
4. Watch real-time progress (6 steps)
5. Review detailed threat report

**Supported Formats:**
- `.apk` files only
- Max size: 100MB (configurable)

### 2. URL Scanning

**How to Use:**
1. Click **"Download Link"** tab
2. Paste direct APK download URL
3. Click **"Scan Link"**
4. APK downloads and scans automatically

**Supported URLs:**
- Direct APK download links
- APKMirror, APKPure, etc.
- Must end with `.apk` or return APK content

### 3. Understanding Results

#### Verdict Levels

| Verdict | Risk Score | Meaning |
|---------|-----------|---------|
| 🔴 **DANGEROUS** | 70-100 | High risk, do not install |
| 🟠 **SUSPICIOUS** | 40-69 | Moderate risk, proceed with caution |
| 🟡 **LOW RISK** | 20-39 | Minor concerns, generally safe |
| 🟢 **SAFE** | 0-19 | Low risk, safe to install |

#### Risk Factors

**Permission Risks:**
- 35+ dangerous permissions tracked
- Each permission has threat level (CRITICAL/HIGH/MEDIUM/LOW)
- Examples: SMS access, call logs, location, camera, contacts

**Fraud Patterns:**
1. **Banking Impersonation** - Mimics legitimate banking apps
2. **Government Impersonation** - Pretends to be official government app
3. **Dangerous Permission Combos** - Suspicious permission combinations
4. **Self-Signed Certificate** - Not signed by trusted authority
5. **Certificate Expiry** - Expired or expiring soon
6. **Excessive Permissions** - Requests too many permissions
7. **Hidden Components** - Suspicious background services
8. **Network Abuse** - Excessive network access

### 4. Sharing Results

**Share Options:**
- **WhatsApp** - Share threat summary via WhatsApp
- **Telegram** - Share via Telegram
- **Email** - Send report via email
- **Copy Link** - Copy shareable link to clipboard

**What Gets Shared:**
- App name and package
- Verdict and risk score
- Key findings
- Recommendation

### 5. Authentication (Optional)

**Sign Up:**
1. Go to http://localhost:3000/auth
2. Click **Sign Up** tab
3. Enter name, email, password
4. Check email for confirmation
5. Click confirmation link

**Sign In:**
1. Go to http://localhost:3000/auth
2. Enter email and password
3. Click **Sign In**

**Google Sign-In:**
1. Click **Continue with Google**
2. Select Google account
3. Authorize app

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Frontend  │ ◄─────► │   Backend   │
│  (React)    │  HTTP   │   (Vite)    │  WS/API │  (FastAPI)  │
└─────────────┘         └─────────────┘         └─────────────┘
                              │                        │
                              ▼                        ▼
                        ┌─────────────┐         ┌─────────────┐
                        │  Supabase   │         │ Androguard  │
                        │   (Auth)    │         │  (Analysis) │
                        └─────────────┘         └─────────────┘
```

### Backend Architecture

**File Structure:**
```
backend/
├── main.py              # FastAPI application
├── uploads/             # Temporary APK storage
└── __pycache__/         # Python cache
```

**Key Components:**

1. **FastAPI Server** (`main.py`)
   - REST API endpoints
   - WebSocket server
   - CORS middleware
   - File upload handling

2. **APK Analysis Engine**
   - Androguard integration
   - Permission extraction
   - Certificate validation
   - Component analysis
   - Fraud detection algorithms

3. **Risk Scoring System**
   - Multi-factor scoring
   - Weighted risk calculation
   - Verdict classification

### Frontend Architecture

**File Structure:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── APKProtectionTool.tsx  # Main scanner
│   │   ├── Auth.tsx               # Login/signup
│   │   ├── Layout.tsx             # Dashboard layout
│   │   ├── Monitor.tsx            # Dashboard page
│   │   ├── Map.tsx                # Map view
│   │   ├── NeuralNetwork.tsx     # Neural viz
│   │   └── Profile.tsx            # User profile
│   ├── App.tsx                    # Routes
│   ├── main.tsx                   # Entry point
│   ├── supabase.ts                # Supabase client
│   └── index.css                  # Styles
├── .env.local                     # Environment vars
├── vite.config.ts                 # Vite config
└── package.json                   # Dependencies
```

**Key Components:**

1. **APKProtectionTool** - Main scanner interface
   - File upload with drag-and-drop
   - URL input
   - WebSocket connection
   - Results display
   - Share functionality

2. **Auth** - Authentication UI
   - Email/password forms
   - Google OAuth button
   - Error handling
   - Setup hints

3. **Layout** - Dashboard wrapper
   - Navigation
   - User menu
   - Protected routes

### API Endpoints

#### REST API

**POST /api/scan**
- Upload APK file for scanning
- Returns: Scan ID and WebSocket URL

**POST /api/scan-url**
- Scan APK from URL
- Returns: Scan ID and WebSocket URL

**GET /health**
- Health check endpoint
- Returns: `{"status": "ok"}`

#### WebSocket

**WS /ws/{scan_id}**
- Real-time scan progress
- 6 progress steps:
  1. Uploading file
  2. Analyzing APK structure
  3. Extracting permissions
  4. Checking certificates
  5. Detecting fraud patterns
  6. Generating report

**Message Format:**
```json
{
  "step": 1,
  "message": "Uploading file...",
  "progress": 16,
  "data": null
}
```

**Final Result:**
```json
{
  "step": 6,
  "message": "Scan complete",
  "progress": 100,
  "data": {
    "app_name": "Example App",
    "package_name": "com.example.app",
    "verdict": "SUSPICIOUS",
    "risk_score": 45,
    "permissions": [...],
    "fraud_signals": [...],
    "certificate": {...},
    "components": {...},
    "summary": "..."
  }
}
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. **Create `requirements.txt`:**
   ```txt
   fastapi==0.104.1
   uvicorn[standard]==0.24.0
   androguard==3.4.0
   httpx==0.25.1
   cryptography==41.0.7
   python-multipart==0.0.6
   ```

2. **Create `Procfile`:**
   ```
   web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Deploy to Railway:**
   ```bash
   railway login
   railway init
   railway up
   ```

4. **Or Deploy to Render:**
   - Connect GitHub repo
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel/Netlify)

1. **Build Production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Or Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables:**
   ```bash
   # Vercel
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   
   # Netlify
   # Add in Netlify Dashboard → Site Settings → Environment Variables
   ```

### Update Frontend API URL

In `frontend/vite.config.ts`, update proxy target:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-backend-url.railway.app',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://your-backend-url.railway.app',
        ws: true,
      },
    },
  },
});
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Port 8000 already in use**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Error: Module 'androguard' not found**
```bash
pip install androguard
```

**Error: Permission denied on uploads folder**
```bash
mkdir backend/uploads
chmod 755 backend/uploads
```

### Frontend Issues

**Error: Cannot find module 'motion/react'**
```bash
npm install motion
```

**Error: Supabase not configured**
- Add credentials to `frontend/.env.local`
- Restart frontend server

**Error: WebSocket connection failed**
- Check backend is running on port 8000
- Verify proxy settings in `vite.config.ts`

**Error: Build fails**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Issues

**Error: "This sign-in method is not enabled"**
- Enable Email provider in Supabase Dashboard
- Go to Authentication → Providers → Enable Email

**Error: "Invalid redirect URL"**
- Add your app URL to Supabase
- Go to Authentication → URL Configuration
- Add redirect URLs

**Error: "Invalid API key"**
- Double-check credentials in `.env.local`
- Ensure no extra spaces or quotes
- Restart frontend server

### Common Issues

**APK scan fails:**
- Check APK file is valid
- Ensure file size < 100MB
- Verify backend is running

**WebSocket disconnects:**
- Check network connection
- Verify backend WebSocket endpoint
- Check browser console for errors

**Slow scanning:**
- Large APKs take longer
- Check system resources
- Consider increasing timeout

---

## 🏆 Hackathon Submission

### Problem Statement 3: Mobile App Fraud Detection

**Objective:** Develop a tool to help users identify potentially fraudulent or malicious mobile applications before installation.

### How APK Guardian Solves This

✅ **Scans APK files or download links** - Supports both file upload and URL scanning  
✅ **Warns about fraud risks** - 8 fraud detection algorithms  
✅ **Explains why risky** - Plain-English threat summaries  
✅ **Integrates with messaging apps** - Share via WhatsApp, Telegram, Email  

### Key Innovations

1. **Real-time WebSocket Progress** - Live scanning updates
2. **35+ Permission Risk Database** - Comprehensive threat detection
3. **Multi-Factor Risk Scoring** - Weighted algorithm
4. **Plain-English Summaries** - User-friendly explanations
5. **Certificate Validation** - Self-signed & expiry detection
6. **Component Analysis** - Hidden service detection
7. **Share Functionality** - Easy warning distribution
8. **Beautiful UI** - Cybersecurity-themed design

### Technical Highlights

- **Static Analysis Engine:** Androguard for deep APK inspection
- **Async Processing:** ThreadPoolExecutor prevents blocking
- **WebSocket Streaming:** Real-time progress updates
- **Modern Stack:** React 19, TypeScript, Tailwind CSS 4
- **Authentication:** Supabase with Google OAuth
- **Responsive Design:** Mobile-first approach

### Demo Scenarios

**Scenario 1: Malicious Banking App**
- Upload fake banking APK
- System detects banking impersonation
- Shows dangerous permissions (SMS, calls, contacts)
- Verdict: DANGEROUS
- Recommendation: Do not install

**Scenario 2: Suspicious Game**
- Scan game APK from URL
- Detects excessive permissions
- Self-signed certificate
- Verdict: SUSPICIOUS
- Recommendation: Proceed with caution

**Scenario 3: Legitimate App**
- Upload official app APK
- Minimal permissions
- Valid certificate
- Verdict: SAFE
- Recommendation: Safe to install

### Performance Metrics

- **Scan Time:** 2-5 seconds (average APK)
- **Accuracy:** 35+ permission patterns
- **Detection Rate:** 8 fraud algorithms
- **User Experience:** Real-time progress
- **Scalability:** Async processing

### Future Enhancements

1. **Machine Learning** - AI-powered fraud detection
2. **Behavioral Analysis** - Runtime monitoring
3. **Community Reports** - User-submitted threats
4. **API Integration** - Third-party security services
5. **Mobile App** - Native Android/iOS apps
6. **Scan History** - Track previous scans
7. **Batch Scanning** - Multiple APKs at once
8. **Advanced Reporting** - PDF export

---

## 📞 Support & Resources

### Documentation

- **GitHub Repository:** https://github.com/Amoghboss/apkshield
- **Supabase Docs:** https://supabase.com/docs
- **Androguard Docs:** https://androguard.readthedocs.io
- **FastAPI Docs:** https://fastapi.tiangolo.com

### Community

- **Supabase Discord:** https://discord.supabase.com
- **GitHub Issues:** https://github.com/Amoghboss/apkshield/issues

### Contact

- **Developer:** Amogh
- **GitHub:** https://github.com/Amoghboss
- **Repository:** https://github.com/Amoghboss/apkshield

---

## 📄 License

This project is created for hackathon purposes. See repository for license details.

---

## 🎉 Acknowledgments

- **Androguard** - APK analysis engine
- **Supabase** - Authentication & database
- **FastAPI** - Backend framework
- **React** - Frontend framework
- **Tailwind CSS** - Styling
- **Motion** - Animations

---

**Built with ❤️ for Hackathon Problem Statement 3**

**APK Guardian - Protecting Users from Mobile Threats** 🛡️
