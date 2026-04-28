# 🔧 APK Scanner & Link Checker Troubleshooting Guide

## 🎯 Current Status
- ✅ **Backend Server**: Running on http://localhost:8000
- ✅ **Frontend Server**: Running on http://localhost:3002  
- ✅ **API Endpoints**: Available and responding
- ✅ **Proxy Configuration**: Set up in Vite config

## 🔍 What I've Fixed

### 1. **API Configuration**
- Updated API base URL to use Vite proxy: `/api`
- Fixed WebSocket URL to connect to port 8000
- Added comprehensive error logging

### 2. **Backend Endpoints**
- ✅ `/api/scan` - File upload scanning
- ✅ `/api/scan-url` - URL scanning  
- ✅ `/api/health` - Health check
- ✅ `/api/status` - Backend status
- ✅ `/ws/{client_id}` - WebSocket for live updates

### 3. **Debug Features Added**
- **Debug Panel**: Shows connection status in top-right corner
- **Console Logging**: Detailed logs for all API calls
- **Error Handling**: Better error messages and debugging

## 🚀 How to Test

### **Step 1: Check Debug Panel**
1. Go to **http://localhost:3002**
2. Navigate to **Scans** page
3. Look at **top-right corner** for debug panel
4. Should show:
   - ✅ API: Connected
   - ✅ WebSocket: Connected
   - Scanner: androguard
   - Version: 3.0.0

### **Step 2: Test File Upload**
1. Click **"Choose an APK file"**
2. Select any `.apk` file
3. Click **"Scan APK"**
4. Watch for:
   - Progress updates in real-time
   - WebSocket messages in console
   - Scan results after completion

### **Step 3: Test URL Scanner**
1. Switch to **"Scan URL"** tab
2. Paste any APK download URL
3. Click **"Scan URL"**
4. Should download and analyze the APK

## 🐛 Common Issues & Solutions

### **Issue: "Backend unavailable"**
**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# If not running, start it:
cd backend
.venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### **Issue: WebSocket connection failed**
**Solution:**
- Check browser console for WebSocket errors
- Ensure port 8000 is not blocked by firewall
- Try refreshing the page

### **Issue: File upload fails**
**Solution:**
- Check file size (max 150MB)
- Ensure file is a valid APK
- Check browser console for detailed errors

### **Issue: Proxy not working**
**Solution:**
```bash
# Restart frontend server
cd frontend
npm run dev
```

## 📋 Debug Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running (any port)
- [ ] Debug panel shows green checkmarks
- [ ] Browser console shows connection logs
- [ ] No CORS errors in network tab
- [ ] WebSocket connects successfully

## 🔧 Manual Testing Commands

```bash
# Test API health
curl http://localhost:8000/api/health

# Test API status  
curl http://localhost:8000/api/status

# Test scan endpoint (should show validation error)
curl -X POST http://localhost:8000/api/scan?client_id=test123
```

## 📱 Expected Behavior

### **Successful File Scan:**
1. File uploads to backend
2. WebSocket shows progress updates:
   - "Unpacking APK archive..."
   - "Extracting manifest & metadata..."
   - "Running permission risk analysis..."
   - "Detecting fraud patterns..."
   - "Computing file integrity hash..."
   - "Building threat report..."
3. Results display with verdict and details

### **Successful URL Scan:**
1. URL sent to backend
2. Backend downloads APK
3. Same analysis process as file scan
4. Results show with source URL

## 🆘 Still Not Working?

1. **Check browser console** for detailed error messages
2. **Check backend logs** in terminal for server errors
3. **Verify file permissions** on uploads directory
4. **Try a different APK file** (some may be corrupted)
5. **Check network connectivity** between frontend and backend

The debug panel and console logs will show exactly what's happening at each step!