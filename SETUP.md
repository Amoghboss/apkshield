# 🚀 APK Guardian — Setup Guide

Complete installation and configuration guide for APK Guardian.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11 or higher** — [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** — [Download](https://nodejs.org/)
- **pip** (comes with Python)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Amoghboss/apkshield.git
cd apkshield
```

### Step 2: Backend Setup

```bash
# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn androguard httpx cryptography

# Verify installation
python -c "import fastapi, androguard; print('✅ Backend dependencies installed')"
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
# Make sure you're in the project root
cd apkshield

# Activate virtual environment (if not already active)
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Start FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Backend is now running at **http://localhost:8000**

### Terminal 2: Start Frontend

```bash
# Open a new terminal
cd apkshield/frontend

# Start Vite dev server
npm run dev
```

**Expected output:**
```
VITE v6.4.2  ready in 866 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
➜  press h + enter to show help
```

Frontend is now running at **http://localhost:3000** (or next available port)

---

## 🧪 Verify Installation

### Test Backend

Open a browser and navigate to:
- **Health Check:** http://localhost:8000/api/health
- **API Docs:** http://localhost:8000/docs

You should see:
```json
{"status":"ok","version":"3.0.0"}
```

### Test Frontend

Open a browser and navigate to:
- **Main App:** http://localhost:3000

You should see the APK Guardian scanner interface.

### Test Full Flow

1. Download a sample APK (e.g., from APKMirror)
2. Upload it to the scanner
3. Watch the real-time progress
4. Review the threat report

---

## ⚙️ Configuration

### Backend Configuration

**File:** `backend/main.py`

```python
# Adjust these constants if needed:
UPLOAD_DIR = "uploads"           # Temporary APK storage
MAX_APK_BYTES = 150 * 1024 * 1024  # 150 MB max file size
```

### Frontend Configuration

**File:** `frontend/vite.config.ts`

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',  // Backend URL
      changeOrigin: true,
    },
    '/ws': {
      target: 'ws://127.0.0.1:8000',    // WebSocket URL
      ws: true,
    },
  },
}
```

### Optional: Supabase Authentication

If you want to enable the dashboard features with authentication:

1. Create a Supabase project at https://supabase.com
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **anon public key**
4. Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. In Supabase Dashboard:
   - Go to **Authentication → Providers**
   - Enable **Email** and **Google** providers
   - Add `http://localhost:3000` to **Redirect URLs**

6. Restart the frontend server

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
# Make sure virtual environment is activated
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Reinstall dependencies
pip install fastapi uvicorn androguard httpx cryptography
```

---

**Problem:** `Port 8000 is already in use`

**Solution:**
```bash
# Windows: Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux: Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --reload --port 8001
```

---

**Problem:** `Failed to parse APK: ...`

**Solution:**
- Ensure the uploaded file is a valid APK
- Check file size (must be ≤150 MB)
- Verify the APK is not corrupted

---

### Frontend Issues

**Problem:** `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

**Problem:** `Cannot connect to backend`

**Solution:**
1. Verify backend is running on port 8000
2. Check `vite.config.ts` proxy settings
3. Open browser console (F12) and check for CORS errors
4. Restart both backend and frontend

---

**Problem:** WebSocket connection fails

**Solution:**
1. Check backend logs for WebSocket errors
2. Verify `/ws/{client_id}` endpoint is accessible
3. Check browser console for connection errors
4. Try a different browser

---

### Common Errors

**Error:** `AUTH_ERROR: This sign-in method is not enabled`

**Cause:** Supabase is not configured or providers are disabled

**Solution:**
- This error only affects the `/auth` route
- The main APK scanner at `/` works without Supabase
- To fix: Follow the "Optional: Supabase Authentication" section above

---

**Error:** `APK is too large. Maximum size is 150 MB`

**Cause:** Uploaded APK exceeds size limit

**Solution:**
- Use a smaller APK
- Or increase `MAX_APK_BYTES` in `backend/main.py`

---

**Error:** `URL does not point to an APK file`

**Cause:** The URL returns HTML instead of an APK

**Solution:**
- Ensure the URL is a **direct download link**
- Right-click the download button and copy link address
- Avoid URLs that redirect to download pages

---

## 🔧 Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- **Backend:** `--reload` flag automatically restarts on code changes
- **Frontend:** Vite HMR updates instantly on save

### Debugging

**Backend:**
```python
# Add print statements
print(f"DEBUG: {variable}")

# Or use logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
```typescript
// Use console.log
console.log('DEBUG:', variable);

// Or React DevTools
// Install: https://react.dev/learn/react-developer-tools
```

### Testing API Endpoints

Use the built-in FastAPI docs:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Or use curl:
```bash
# Health check
curl http://localhost:8000/api/health

# Upload APK
curl -X POST http://localhost:8000/api/scan \
  -F "file=@path/to/app.apk" \
  -F "client_id=test123"
```

---

## 📦 Production Deployment

### Backend (FastAPI)

```bash
# Install production server
pip install gunicorn

# Run with multiple workers
gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

**Or use Docker:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/main.py .
RUN pip install fastapi uvicorn androguard httpx cryptography
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (React)

```bash
# Build for production
cd frontend
npm run build

# Output: frontend/dist/
```

**Deploy to:**
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy --prod`
- **GitHub Pages:** Copy `dist/` to `gh-pages` branch
- **Nginx:** Serve `dist/` as static files

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default CORS settings in `backend/main.py`
- [ ] Add rate limiting (e.g., slowapi)
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Set up proper logging and monitoring
- [ ] Configure firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Add API authentication tokens
- [ ] Set up backup and disaster recovery

---

## 📚 Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Androguard Documentation:** https://androguard.readthedocs.io/
- **React Documentation:** https://react.dev/
- **Vite Documentation:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 💬 Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/Amoghboss/apkshield/issues)
2. Search for similar problems
3. Open a new issue with:
   - Error message
   - Steps to reproduce
   - System information (OS, Python version, Node version)
   - Screenshots (if applicable)

---

**Happy Scanning! 🛡️**
