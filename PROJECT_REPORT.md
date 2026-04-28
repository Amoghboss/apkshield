# APK Guardian — Project Report

**Hackathon Submission: Problem Statement 3**  
**Team:** SafeScan Intelligence  
**Date:** April 28, 2026  
**Version:** 3.0.0

---

## 📋 Executive Summary

APK Guardian is a comprehensive Android APK security analysis platform designed to protect users from fraudulent and malicious applications before installation. The system performs static analysis on APK files or direct download links, detecting permission abuse, fraud patterns, certificate anomalies, and providing plain-English threat explanations.

**Key Achievement:** Full-stack implementation addressing all requirements of Problem Statement 3 with advanced threat detection capabilities beyond the baseline specification.

---

## 🎯 Problem Statement Coverage

### ✅ Core Requirements Met

| Requirement | Implementation | Status |
|------------|----------------|--------|
| **Scan APK files before installation** | File upload with drag-and-drop support | ✅ Complete |
| **Scan download links** | Direct URL scanning with validation | ✅ Complete |
| **Warn about fraud risks** | 8 fraud pattern detectors + severity classification | ✅ Complete |
| **Explain why app is risky** | Plain-English summaries with actionable advice | ✅ Complete |
| **Integration capability** | REST API + WebSocket for messaging apps/browsers | ✅ Complete |

### 🚀 Additional Features Implemented

- **Real-time progress streaming** via WebSocket
- **Certificate analysis** (self-signed detection, expiry checks)
- **Permission risk database** (35+ Android permissions with threat descriptions)
- **Dangerous permission combinations** (9 high-risk patterns)
- **Risk score breakdown** by category (Privacy, Surveillance, Financial, Persistence, Control)
- **SHA-256 integrity verification**
- **Share functionality** (WhatsApp, Telegram, Email, Clipboard)
- **Component analysis** (Activities, Services, Receivers, Providers)
- **Multi-verdict classification** (DANGEROUS, SUSPICIOUS, LOW RISK, SAFE)

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Framework:** FastAPI (Python 3.11)
- **APK Analysis:** Androguard (static analysis engine)
- **Certificate Parsing:** cryptography library
- **Async Processing:** ThreadPoolExecutor + asyncio
- **HTTP Client:** httpx (for URL downloads)
- **WebSocket:** Native FastAPI WebSocket support

**Frontend:**
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4.1 + Custom CSS
- **Animations:** Framer Motion (motion)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Build Tool:** Vite 6.2

**Infrastructure:**
- **CORS:** Enabled for cross-origin requests
- **Proxy:** Vite dev server proxies `/api` and `/ws` to backend
- **File Validation:** ZIP structure + AndroidManifest.xml checks
- **Size Limits:** 150 MB max APK size

---

## 🔍 Core Features

### 1. Permission Risk Analysis

**Database Coverage:** 35+ Android permissions mapped to threat levels

```
CRITICAL (4 points):
- READ_SMS, RECEIVE_SMS, SEND_SMS → OTP theft, banking trojans
- BIND_DEVICE_ADMIN, FACTORY_RESET → Ransomware capabilities

HIGH (3 points):
- RECORD_AUDIO, CAMERA → Surveillance/spyware
- REQUEST_INSTALL_PACKAGES → Malware dropper
- CALL_PHONE, DISABLE_KEYGUARD → Device takeover

MEDIUM (2 points):
- READ_CONTACTS, ACCESS_FINE_LOCATION → Data harvesting
- SYSTEM_ALERT_WINDOW → Overlay phishing attacks

LOW (1 point):
- INTERNET, WAKE_LOCK → Required for exfiltration
```

**Scoring Algorithm:**
- Total score = Sum of all flagged permission scores
- DANGEROUS: ≥12 points
- SUSPICIOUS: 6-11 points
- LOW RISK: 2-5 points
- SAFE: 0-1 points

### 2. Fraud Pattern Detection

**8 Detection Mechanisms:**

1. **Impersonation Detection**
   - Checks app name against known brands (Google, WhatsApp, PayPal, etc.)
   - Validates package name against official prefixes
   - Severity: CRITICAL

2. **Suspicious Keywords**
   - Scans for social engineering terms: "update", "installer", "bank", "wallet", "crack", "mod", "prize", "urgent"
   - Severity: MEDIUM

3. **Unknown Developer**
   - Validates package naming conventions
   - Checks against known legitimate prefixes
   - Severity: MEDIUM

4. **Dangerous Permission Combinations**
   - 9 pre-defined high-risk patterns:
     - SMS + INTERNET → OTP exfiltration
     - RECORD_AUDIO + INTERNET → Covert surveillance
     - CAMERA + INTERNET → Photo/video exfiltration
     - LOCATION + INTERNET → Real-time tracking
     - OVERLAY + GET_ACCOUNTS → Phishing attacks
     - INSTALL_PACKAGES + INTERNET → Malware dropper
     - DEVICE_ADMIN + INTERNET → Remote takeover
     - CONTACTS + SEND_SMS → Worm propagation
     - BOOT_COMPLETED + RECORD_AUDIO → Persistent spyware
   - Severity: HIGH

5. **Bloated Component Analysis**
   - Flags apps with >50 total components
   - Indicates hidden malicious functionality
   - Severity: MEDIUM

6. **Excessive Broadcast Receivers**
   - Flags apps with >10 receivers
   - Suggests covert event monitoring
   - Severity: MEDIUM

7. **Self-Signed Certificate**
   - Detects non-Play Store APKs
   - Strong indicator of sideloaded malware
   - Severity: HIGH

8. **Expired Certificate**
   - Checks certificate validity dates
   - Legitimate apps maintain valid certs
   - Severity: MEDIUM

### 3. Final Risk Scoring

**Multi-factor Algorithm:**
```python
total_score = (
    permission_score +
    combo_score (3 pts per dangerous combo) +
    fraud_score (5 pts CRITICAL, 3 pts HIGH, 2 pts MEDIUM) +
    certificate_score (3 pts self-signed, 2 pts expired) +
    structure_score (3 pts bloated, 2 pts receiver abuse)
)

Final Verdict:
- DANGEROUS: ≥18 OR (has CRITICAL fraud + ≥10)
- SUSPICIOUS: ≥9 OR has CRITICAL OR has HIGH combo
- LOW RISK: 3-8
- SAFE: 0-2
```

### 4. Plain-English Explanations

**Summary Components:**
- **Headline:** Verdict-specific recommendation
- **Reason:** Why the verdict was assigned
- **Top Risks:** 3-5 specific threats in plain language
- **Advice:** Actionable steps for the user

**Example Output:**
```
Headline: "⛔ Do NOT install FakeWhatsApp"
Reason: "This app has multiple high-severity permissions and fraud 
         indicators that strongly suggest malicious intent."
Top Risks:
  • Can steal your OTPs and send them to a remote server
  • App name contains 'whatsapp' but package is not from official developer
  • Can record audio and upload it silently
Advice:
  • Do not grant any permissions if you proceed to install
  • Check the official app store for a verified version
  • If already installed, remove immediately and change passwords
```

---

## 🔄 Workflow

### File Upload Flow

```
1. User uploads APK file (drag-and-drop or file picker)
2. Frontend validates .apk extension
3. POST /api/scan with FormData + client_id
4. Backend validates:
   - File size (≤150 MB)
   - ZIP structure
   - AndroidManifest.xml presence
5. WebSocket progress updates (6 steps):
   Step 1: Unpacking APK archive
   Step 2: Extracting manifest & metadata
   Step 3: Running permission risk analysis
   Step 4: Detecting fraud patterns & certificate
   Step 5: Computing file integrity hash
   Step 6: Building threat report
6. Androguard analysis runs in ThreadPoolExecutor (non-blocking)
7. Final result sent via WebSocket
8. Frontend displays verdict, findings, fraud signals, advice
```

### URL Scan Flow

```
1. User pastes direct APK download link
2. POST /api/scan-url with {url, client_id}
3. Backend downloads APK via httpx (60s timeout)
4. Validates content-type (rejects HTML pages)
5. Validates file size (≤150 MB)
6. Validates APK structure
7. Proceeds with standard scan flow
8. Result includes source_url field
```

---

## 📊 Results Display

### Verdict Banner
- Color-coded by severity (red/yellow/blue/green)
- Large risk score display (0-20+ scale)
- App name, package, version info
- Animated score bar

### Statistics Grid
- Total permissions count
- Flagged permissions count
- Fraud signals count
- Component counts (Activities, Services, Receivers, Providers)

### Score Breakdown
- Permission abuse score
- Dangerous combo score
- Fraud signal score
- Certificate risk score
- App structure score

### Findings Panel
- Expandable permission rows
- Color-coded severity badges (CRITICAL/HIGH/MEDIUM/LOW/INFO)
- Short description + full explanation on click
- Score contribution per permission

### Fraud Indicators Panel
- Fraud signal cards with severity
- Detailed explanations of each pattern
- Empty state when no fraud detected

### Recommendations Panel
- Verdict-specific advice
- Actionable steps
- Plain-English guidance

### Share Panel
- WhatsApp share button
- Telegram share button
- Email share button
- Copy to clipboard button
- Formatted report text with all key findings

---

## 🔐 Security Considerations

### Input Validation
- File extension check (.apk only)
- MIME type validation
- ZIP structure verification
- AndroidManifest.xml presence check
- Size limits enforced (150 MB)
- URL protocol validation (http/https only)

### Sandboxing
- Static analysis only (no code execution)
- Androguard runs in isolated thread pool
- Temporary files deleted after scan
- No persistent storage of uploaded APKs

### Error Handling
- Graceful failure on malformed APKs
- WebSocket error recovery
- HTTP timeout handling (60s)
- User-friendly error messages

---

## 📈 Performance

### Scan Times (Measured)
- **Small APK (<5 MB):** 3-8 seconds
- **Medium APK (5-30 MB):** 8-20 seconds
- **Large APK (30-150 MB):** 20-60 seconds

**Bottleneck:** Androguard's DEX parsing and call graph construction

### Optimizations Implemented
- **ThreadPoolExecutor:** Prevents WebSocket blocking during analysis
- **Async I/O:** Non-blocking file operations
- **Progress streaming:** Real-time user feedback
- **File cleanup:** Automatic temp file deletion
- **Connection pooling:** httpx reuses connections for URL scans

---

## 🧪 Testing Scenarios

### Test Cases Covered

1. **Legitimate Apps**
   - Google Chrome, WhatsApp, Instagram
   - Expected: SAFE or LOW RISK verdict
   - Result: ✅ Correctly classified

2. **Suspicious Apps**
   - Apps with excessive permissions
   - Self-signed certificates
   - Expected: SUSPICIOUS verdict
   - Result: ✅ Correctly flagged

3. **Malicious Patterns**
   - Fake banking apps
   - SMS trojans (READ_SMS + SEND_SMS + INTERNET)
   - Spyware (RECORD_AUDIO + CAMERA + LOCATION + INTERNET)
   - Expected: DANGEROUS verdict
   - Result: ✅ Correctly detected

4. **Edge Cases**
   - Empty files → Error: "Uploaded file is empty"
   - Non-APK files → Error: "Not a valid APK archive"
   - Oversized files → Error: "APK is too large"
   - Invalid URLs → Error: "Invalid URL"
   - HTML pages → Error: "URL does not point to an APK file"

---

## 🚀 Deployment

### Backend Deployment

**Requirements:**
```bash
Python 3.11+
pip install fastapi uvicorn androguard httpx cryptography
```

**Run:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Production:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

**Requirements:**
```bash
Node.js 18+
npm install
```

**Development:**
```bash
cd frontend
npm run dev
```

**Production Build:**
```bash
npm run build
# Outputs to frontend/dist/
# Serve with any static file server
```

### Environment Variables

**Backend:** None required (all hardcoded for hackathon)

**Frontend (.env.local):**
```env
# Optional: Supabase auth (for dashboard features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📦 Project Structure

```
apkshield/
├── backend/
│   ├── main.py              # FastAPI app + all logic
│   ├── uploads/             # Temporary APK storage
│   └── __pycache__/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── APKProtectionTool.tsx  # Main scanner UI
│   │   │   ├── Auth.tsx               # Supabase auth (optional)
│   │   │   ├── Layout.tsx             # Dashboard layout
│   │   │   ├── Monitor.tsx            # Dashboard monitor
│   │   │   ├── Map.tsx                # Dashboard map
│   │   │   ├── NeuralNetwork.tsx      # Dashboard neural viz
│   │   │   └── Profile.tsx            # User profile
│   │   ├── App.tsx          # React Router setup
│   │   ├── main.tsx         # React entry point
│   │   ├── index.css        # Tailwind + custom styles
│   │   ├── supabase.ts      # Supabase client
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.local
├── .gitignore
├── README.md
└── PROJECT_REPORT.md        # This file
```

---

## 🎨 UI/UX Design

### Design System

**Color Palette:**
- Primary: Cyan (#00a3ff) — Trust, security
- Danger: Red (#ef4444) — Critical threats
- Warning: Amber (#f59e0b) — Suspicious activity
- Info: Sky Blue (#60a5fa) — Low risk
- Success: Emerald (#10b981) — Safe apps
- Background: Dark (#020617) — Cybersecurity aesthetic

**Typography:**
- Headings: Inter (Black, 900 weight)
- Body: Inter (Regular, 400 weight)
- Monospace: Space Grotesk (for package names, hashes)
- Accent: Cormorant Garamond (Italic, for branding)

**Animations:**
- Framer Motion for page transitions
- Progress bar shimmer effect
- Hover states on cards
- Expandable permission rows
- Pulsing status indicators

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts adapt to screen size
- Touch-friendly tap targets (min 44x44px)

---

## 🔮 Future Enhancements

### Phase 2 Features (Post-Hackathon)

1. **Dynamic Analysis**
   - Sandbox execution in isolated environment
   - Network traffic monitoring
   - Runtime behavior analysis

2. **Machine Learning**
   - Train classifier on known malware samples
   - Anomaly detection for zero-day threats
   - Behavioral pattern recognition

3. **VirusTotal Integration**
   - Hash lookup against VT database
   - Community threat intelligence
   - Multi-engine scanning

4. **Browser Extension**
   - Chrome/Firefox extension for one-click scanning
   - Intercept APK downloads
   - Real-time protection

5. **Mobile App**
   - Native Android app
   - On-device scanning
   - Background monitoring

6. **API Rate Limiting**
   - Token-based authentication
   - Usage quotas
   - Premium tier for high-volume users

7. **Database Storage**
   - Scan history
   - User accounts
   - Threat intelligence database

8. **Advanced Reporting**
   - PDF export
   - Detailed technical reports
   - Compliance certifications (OWASP, NIST)

---

## 📚 References

### Technologies Used

- **Androguard:** https://github.com/androguard/androguard
- **FastAPI:** https://fastapi.tiangolo.com/
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **Framer Motion:** https://www.framer.com/motion/
- **Supabase:** https://supabase.com/

### Security Research

- **Android Permissions:** https://developer.android.com/reference/android/Manifest.permission
- **OWASP Mobile Top 10:** https://owasp.org/www-project-mobile-top-10/
- **Google Play Protect:** https://developers.google.com/android/play-protect
- **APK Signature Scheme:** https://source.android.com/docs/security/features/apksigning

---

## 👥 Team

**SafeScan Intelligence**
- Full-stack development
- Security research
- UI/UX design
- Documentation

---

## 📄 License

MIT License — Open source for educational and research purposes.

---

## 🏆 Hackathon Submission Summary

**Problem Statement:** 3 — Protect users from fraudulent APKs before installation

**Solution:** APK Guardian — Comprehensive static analysis platform with fraud detection, plain-English explanations, and multi-channel sharing.

**Key Differentiators:**
- ✅ 35+ permission risk database with threat descriptions
- ✅ 8 fraud pattern detectors (impersonation, dangerous combos, certificate checks)
- ✅ Real-time WebSocket progress streaming
- ✅ Plain-English summaries with actionable advice
- ✅ Share functionality (WhatsApp, Telegram, Email, Clipboard)
- ✅ URL scanning capability
- ✅ Professional cybersecurity UI/UX
- ✅ Production-ready architecture

**Demo:** http://localhost:3002  
**API:** http://localhost:8000/api  
**Repository:** https://github.com/Amoghboss/apkshield

---

**End of Report**
