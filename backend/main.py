import os, uuid, asyncio, hashlib, zipfile, httpx
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from androguard.misc import AnalyzeAPK

app = FastAPI(title="APK Guardian API", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

UPLOAD_DIR = "uploads"
MAX_APK_BYTES = 150 * 1024 * 1024
os.makedirs(UPLOAD_DIR, exist_ok=True)
clients: dict = {}
executor = ThreadPoolExecutor(max_workers=4)

# ─── PERMISSION RISK DATABASE ─────────────────────────────────────────────────
PERMISSION_RISKS = {
    "android.permission.READ_SMS":                (4, "CRITICAL", "Reads your SMS messages",              "Attackers use this to steal OTPs sent by your bank or payment apps, giving them full access to your accounts."),
    "android.permission.RECEIVE_SMS":             (4, "CRITICAL", "Intercepts incoming SMS",              "Can silently capture every SMS before you see it — a classic technique for bypassing two-factor authentication."),
    "android.permission.SEND_SMS":                (4, "CRITICAL", "Sends SMS without your knowledge",     "Can send premium-rate SMS messages costing you money, or spread malware to your contacts."),
    "android.permission.READ_CALL_LOG":           (3, "HIGH",     "Reads your call history",              "Exposes who you call and when — used for stalkerware and targeted social engineering attacks."),
    "android.permission.PROCESS_OUTGOING_CALLS":  (3, "HIGH",     "Intercepts outgoing calls",            "Can record or redirect your phone calls to a third party without your knowledge."),
    "android.permission.RECORD_AUDIO":            (3, "HIGH",     "Activates your microphone",            "Can record conversations, meetings, or passwords spoken aloud — even when the app is in the background."),
    "android.permission.CAMERA":                  (3, "HIGH",     "Accesses your camera",                 "Can silently take photos or record video. Some spyware uses this to capture faces, documents, or surroundings."),
    "android.permission.READ_CONTACTS":           (2, "MEDIUM",   "Reads your contact list",              "Harvests names, phone numbers, and emails from your contacts — often sold to data brokers or used for spam."),
    "android.permission.WRITE_CONTACTS":          (2, "MEDIUM",   "Modifies your contacts",               "Can add, edit, or delete contacts — used to inject fake contacts for phishing attacks."),
    "android.permission.ACCESS_FINE_LOCATION":    (2, "MEDIUM",   "Tracks your precise GPS location",     "Knows exactly where you are at all times. Used in stalkerware and targeted robbery schemes."),
    "android.permission.ACCESS_COARSE_LOCATION":  (1, "LOW",      "Tracks approximate location",          "Knows your general area via Wi-Fi/cell towers. Lower risk but still a privacy concern."),
    "android.permission.READ_EXTERNAL_STORAGE":   (2, "MEDIUM",   "Reads your files and photos",          "Can access all your photos, documents, and downloads — a common data exfiltration vector."),
    "android.permission.WRITE_EXTERNAL_STORAGE":  (2, "MEDIUM",   "Writes files to your storage",         "Can plant malicious files, modify documents, or encrypt your data (ransomware)."),
    "android.permission.INTERNET":                (1, "LOW",      "Accesses the internet",                "Required to send any stolen data to remote servers. Almost all malware needs this."),
    "android.permission.RECEIVE_BOOT_COMPLETED":  (2, "MEDIUM",   "Auto-starts on device boot",           "Ensures the app runs every time you turn on your phone — a persistence technique used by spyware."),
    "android.permission.REQUEST_INSTALL_PACKAGES":(3, "HIGH",     "Can install other apps silently",      "A dropper capability — can download and install additional malware without showing any prompts."),
    "android.permission.SYSTEM_ALERT_WINDOW":     (2, "MEDIUM",   "Draws overlays over other apps",       "Used in overlay phishing attacks — shows a fake login screen on top of your real banking app."),
    "android.permission.GET_ACCOUNTS":            (2, "MEDIUM",   "Lists all accounts on device",         "Enumerates your Google, Facebook, and other accounts — used for credential stuffing attacks."),
    "android.permission.USE_CREDENTIALS":         (3, "HIGH",     "Uses stored account credentials",      "Can authenticate as you to Google or other services without your password."),
    "android.permission.MANAGE_ACCOUNTS":         (3, "HIGH",     "Manages your accounts",                "Can add, remove, or modify accounts — used to lock you out or add attacker-controlled accounts."),
    "android.permission.READ_PHONE_STATE":        (2, "MEDIUM",   "Reads device identifiers",             "Collects your IMEI, phone number, and SIM info — used for device fingerprinting and tracking."),
    "android.permission.CALL_PHONE":              (3, "HIGH",     "Makes calls without your permission",  "Can call premium-rate numbers silently, racking up charges on your bill."),
    "android.permission.NFC":                     (2, "MEDIUM",   "Accesses NFC chip",                    "Can relay NFC payment signals — used in contactless payment relay attacks."),
    "android.permission.DISABLE_KEYGUARD":        (3, "HIGH",     "Disables your screen lock",            "Can unlock your device programmatically, bypassing your PIN or fingerprint."),
    "android.permission.BIND_DEVICE_ADMIN":       (4, "CRITICAL", "Claims device administrator rights",   "Gives the app full control over your device — can lock it, wipe it, or enforce policies. Classic ransomware technique."),
    "android.permission.FACTORY_RESET":           (4, "CRITICAL", "Can factory reset your device",        "Can wipe your entire device remotely, destroying all your data."),
    "android.permission.FOREGROUND_SERVICE":      (1, "LOW",      "Runs a persistent background service", "Keeps the app alive in the background — can be used to continuously monitor your activity."),
    "android.permission.WAKE_LOCK":               (1, "LOW",      "Prevents device from sleeping",        "Keeps the CPU awake — drains battery and can be used to run covert background tasks."),
    "android.permission.CHANGE_NETWORK_STATE":    (1, "LOW",      "Changes network settings",             "Can disconnect you from Wi-Fi or switch networks — used to force traffic through attacker-controlled networks."),
    "android.permission.BLUETOOTH_ADMIN":         (1, "LOW",      "Controls Bluetooth",                   "Can scan for nearby devices — used for proximity tracking and Bluetooth-based attacks."),
    "android.permission.READ_CALENDAR":           (1, "LOW",      "Reads your calendar",                  "Can read all your appointments and events — used for targeted social engineering."),
    "android.permission.WRITE_CALENDAR":          (1, "LOW",      "Modifies your calendar",               "Can add or delete calendar events — used to plant fake meetings or reminders."),
    "android.permission.BODY_SENSORS":            (2, "MEDIUM",   "Reads health sensor data",             "Accesses heart rate, step count, and other biometric data from wearables."),
    "android.permission.READ_MEDIA_IMAGES":       (2, "MEDIUM",   "Reads your photos",                    "Can access all photos on your device — used for data exfiltration and blackmail."),
    "android.permission.READ_MEDIA_VIDEO":        (2, "MEDIUM",   "Reads your videos",                    "Can access all videos on your device without your knowledge."),
    "android.permission.USE_BIOMETRIC":           (2, "MEDIUM",   "Uses biometric authentication",        "Can trigger fingerprint/face unlock prompts — used in credential theft attacks."),
    "android.permission.HIDE_OVERLAY_WINDOWS":    (2, "MEDIUM",   "Hides overlay windows",                "Can suppress security warnings shown by Android — used to hide malicious overlays."),
}

KNOWN_LEGIT_PREFIXES = [
    "com.google.", "com.android.", "com.samsung.", "com.microsoft.",
    "com.facebook.", "com.whatsapp.", "com.instagram.", "com.spotify.",
    "com.netflix.", "com.amazon.", "com.paypal.", "com.uber.", "com.apple.",
]

SUSPICIOUS_KEYWORDS = [
    "update", "installer", "system", "security", "antivirus", "cleaner",
    "booster", "battery", "vpn", "free", "crack", "mod", "hack", "cheat",
    "bank", "pay", "wallet", "crypto", "bitcoin", "reward", "prize", "lucky",
    "verify", "confirm", "urgent", "alert", "warning",
]

DANGEROUS_COMBOS = [
    (["android.permission.READ_SMS",  "android.permission.INTERNET"],
     "SMS Exfiltration", "Can steal your OTPs and send them to a remote server — direct account takeover risk."),
    (["android.permission.RECORD_AUDIO", "android.permission.INTERNET"],
     "Covert Audio Surveillance", "Can record audio and upload it silently — classic spyware behaviour."),
    (["android.permission.CAMERA", "android.permission.INTERNET"],
     "Covert Camera Surveillance", "Can take photos/video and upload them without any indication."),
    (["android.permission.ACCESS_FINE_LOCATION", "android.permission.INTERNET"],
     "Real-time Location Tracking", "Continuously tracks and uploads your GPS location to remote servers."),
    (["android.permission.SYSTEM_ALERT_WINDOW", "android.permission.GET_ACCOUNTS"],
     "Overlay Phishing Attack", "Can display a fake login screen over your real apps to steal credentials."),
    (["android.permission.REQUEST_INSTALL_PACKAGES", "android.permission.INTERNET"],
     "Malware Dropper", "Can silently download and install additional malicious apps on your device."),
    (["android.permission.BIND_DEVICE_ADMIN", "android.permission.INTERNET"],
     "Remote Device Takeover", "Attacker can remotely control, lock, or wipe your device."),
    (["android.permission.READ_CONTACTS", "android.permission.SEND_SMS"],
     "Contact Spam / Worm Propagation", "Can harvest your contacts and send malicious SMS to all of them."),
    (["android.permission.RECEIVE_BOOT_COMPLETED", "android.permission.RECORD_AUDIO"],
     "Persistent Surveillance", "Automatically starts recording audio every time you reboot your phone."),
    (["android.permission.READ_SMS", "android.permission.SEND_SMS", "android.permission.RECEIVE_SMS"],
     "Full SMS Hijack", "Complete control over your SMS — can intercept, read, and send messages. Highest-risk banking trojan pattern."),
]

# ─── SYNC ANALYSIS (runs in thread pool) ─────────────────────────────────────
def run_androguard(path: str):
    """Blocking call — must run in executor."""
    a, d, dx = AnalyzeAPK(path)
    perms = list(a.get_permissions())
    try:
        activities = len(a.get_activities())
        services   = len(a.get_services())
        receivers  = len(a.get_receivers())
        providers  = len(a.get_providers())
    except Exception:
        activities = services = receivers = providers = 0

    # Certificate info
    cert_info = {}
    try:
        certs = a.get_certificates_der_v2() or []
        if certs:
            from cryptography import x509
            from cryptography.hazmat.backends import default_backend
            cert = x509.load_der_x509_certificate(list(certs.values())[0][0], default_backend())
            cert_info = {
                "subject":   cert.subject.rfc4514_string(),
                "issuer":    cert.issuer.rfc4514_string(),
                "valid_from": cert.not_valid_before_utc.strftime("%Y-%m-%d"),
                "valid_to":   cert.not_valid_after_utc.strftime("%Y-%m-%d"),
                "self_signed": cert.subject == cert.issuer,
            }
    except Exception:
        cert_info = {}

    return {
        "a": a, "perms": perms,
        "activities": activities, "services": services,
        "receivers": receivers, "providers": providers,
        "cert_info": cert_info,
    }

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def is_valid_apk(path: str) -> bool:
    if not zipfile.is_zipfile(path):
        return False
    try:
        with zipfile.ZipFile(path) as apk:
            names = set(apk.namelist())
            return "AndroidManifest.xml" in names
    except Exception:
        return False

def analyze_permissions(perms: list):
    findings, total_score = [], 0
    for perm in perms:
        if perm in PERMISSION_RISKS:
            score, level, short_desc, long_desc = PERMISSION_RISKS[perm]
            total_score += score
            findings.append({
                "permission":  perm.replace("android.permission.", ""),
                "full":        perm,
                "level":       level,
                "short":       short_desc,
                "description": long_desc,
                "score":       score,
            })
    findings.sort(key=lambda x: x["score"], reverse=True)
    if total_score >= 12:  verdict = "DANGEROUS"
    elif total_score >= 6: verdict = "SUSPICIOUS"
    elif total_score >= 2: verdict = "LOW RISK"
    else:                  verdict = "SAFE"
    return verdict, total_score, findings

def final_risk_score(permission_score, fraud_signals):
    combo_score = sum(3 for s in fraud_signals if s["type"] == "DANGEROUS_COMBO")
    fraud_score = sum(
        {"CRITICAL": 5, "HIGH": 3, "MEDIUM": 2}.get(s["severity"], 1)
        for s in fraud_signals
        if s["type"] not in ("DANGEROUS_COMBO", "SELF_SIGNED", "EXPIRED_CERT", "BLOATED", "RECEIVER_ABUSE")
    )
    certificate_score = sum(
        {"HIGH": 3, "MEDIUM": 2}.get(s["severity"], 1)
        for s in fraud_signals
        if s["type"] in ("SELF_SIGNED", "EXPIRED_CERT")
    )
    structure_score = sum(
        {"HIGH": 3, "MEDIUM": 2}.get(s["severity"], 1)
        for s in fraud_signals
        if s["type"] in ("BLOATED", "RECEIVER_ABUSE")
    )
    total = permission_score + combo_score + fraud_score + certificate_score + structure_score
    has_critical = any(s["severity"] == "CRITICAL" for s in fraud_signals)
    has_high_combo = any(s["type"] == "DANGEROUS_COMBO" and s["severity"] == "HIGH" for s in fraud_signals)

    if total >= 18 or (has_critical and total >= 10):
        verdict = "DANGEROUS"
    elif total >= 9 or has_critical or has_high_combo:
        verdict = "SUSPICIOUS"
    elif total >= 3:
        verdict = "LOW RISK"
    else:
        verdict = "SAFE"

    return verdict, total, {
        "permission_score": permission_score,
        "combo_score": combo_score,
        "fraud_score": fraud_score,
        "certificate_score": certificate_score,
        "structure_score": structure_score,
        "total": total,
    }

def detect_fraud_signals(app_name, package, perms, activities, services, receivers, cert_info):
    signals = []
    name_lower = app_name.lower().replace(" ", "")
    pkg_lower  = package.lower()

    # 1. Impersonation
    for target in ["google","samsung","whatsapp","facebook","paypal","amazon","netflix","uber","instagram","gpay","phonepe","paytm"]:
        if target in name_lower and not any(pkg_lower.startswith(p) for p in KNOWN_LEGIT_PREFIXES):
            signals.append({"type":"IMPERSONATION","title":f"Impersonates '{target.capitalize()}'",
                "detail":f"App name contains '{target}' but package '{package}' is not from the official developer. Classic fake-app scam.",
                "severity":"CRITICAL"})
            break

    # 2. Suspicious keyword
    for kw in SUSPICIOUS_KEYWORDS:
        if kw in name_lower:
            signals.append({"type":"SUSPICIOUS_NAME","title":f"Suspicious keyword in name: '{kw}'",
                "detail":f"Apps with '{kw}' in their name are frequently used in social engineering attacks.",
                "severity":"MEDIUM"})
            break

    # 3. Unknown developer
    if not any(package.startswith(p) for p in KNOWN_LEGIT_PREFIXES):
        parts = package.split(".")
        if len(parts) < 3 or any(len(p) <= 2 for p in parts):
            signals.append({"type":"UNKNOWN_DEVELOPER","title":"Unknown or suspicious developer identity",
                "detail":f"Package '{package}' doesn't follow standard naming conventions and can't be attributed to a known developer.",
                "severity":"MEDIUM"})

    # 4. Dangerous combos
    perm_set = set(perms)
    for combo, name, detail in DANGEROUS_COMBOS:
        if all(p in perm_set for p in combo):
            signals.append({"type":"DANGEROUS_COMBO","title":name,"detail":detail,"severity":"HIGH"})

    # 5. Bloated components
    total_comp = activities + services + receivers
    if total_comp > 50:
        signals.append({"type":"BLOATED","title":"Unusually large attack surface",
            "detail":f"{total_comp} components detected. Malware often uses excessive components to hide malicious functionality.",
            "severity":"MEDIUM"})

    # 6. Excessive receivers
    if receivers > 10:
        signals.append({"type":"RECEIVER_ABUSE","title":"Excessive broadcast receivers",
            "detail":f"{receivers} broadcast receivers — suggests covert monitoring of device events.",
            "severity":"MEDIUM"})

    # 7. Self-signed certificate
    if cert_info.get("self_signed"):
        signals.append({"type":"SELF_SIGNED","title":"Self-signed certificate (not from Play Store)",
            "detail":"This APK was not signed by a trusted authority. Legitimate apps distributed via Google Play use proper signing. Self-signed APKs are a strong indicator of sideloaded malware.",
            "severity":"HIGH"})

    # 8. Expired certificate
    if cert_info.get("valid_to"):
        from datetime import datetime, timezone
        try:
            exp = datetime.strptime(cert_info["valid_to"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            if exp < datetime.now(timezone.utc):
                signals.append({"type":"EXPIRED_CERT","title":"Expired signing certificate",
                    "detail":f"Certificate expired on {cert_info['valid_to']}. Legitimate apps keep their certificates valid.",
                    "severity":"MEDIUM"})
        except Exception:
            pass

    return signals

def build_summary(verdict, fraud_signals, findings, app_name):
    critical = [f for f in findings if f["level"] == "CRITICAL"]
    high     = [f for f in findings if f["level"] == "HIGH"]
    if verdict == "DANGEROUS":
        headline = f"⛔ Do NOT install {app_name}"
        reason   = "This app has multiple high-severity permissions and fraud indicators that strongly suggest malicious intent."
    elif verdict == "SUSPICIOUS":
        headline = f"⚠️ Be very careful with {app_name}"
        reason   = "This app requests permissions far beyond what it likely needs — a common sign of data harvesting or spyware."
    elif verdict == "LOW RISK":
        headline = f"🔵 {app_name} has minor concerns"
        reason   = "A few permissions worth noting, but nothing that indicates clear malicious intent."
    else:
        headline = f"✅ {app_name} appears safe"
        reason   = "No significant permission abuse or fraud signals detected."

    top_risks = [f["description"] for f in (critical + high)[:3]] + [s["detail"] for s in fraud_signals[:2]]
    if verdict in ("DANGEROUS", "SUSPICIOUS"):
        advice = [
            "Do not grant any permissions if you proceed to install.",
            "Check the official app store for a verified version of this app.",
            "If already installed, remove it immediately and change passwords for banking/email apps.",
        ]
    elif verdict == "LOW RISK":
        advice = [
            "Review each permission request carefully before granting.",
            "Consider whether the app genuinely needs these permissions for its stated purpose.",
        ]
    else:
        advice = [
            "Always keep apps updated to receive security patches.",
            "Periodically review app permissions in your device settings.",
        ]
    return {"headline": headline, "reason": reason, "top_risks": top_risks, "advice": advice}

def build_risk_breakdown(findings):
    """Returns per-category risk scores for the radar/bar chart."""
    categories = {
        "Privacy":     ["READ_SMS","RECEIVE_SMS","READ_CONTACTS","READ_CALL_LOG","READ_PHONE_STATE","READ_EXTERNAL_STORAGE","READ_MEDIA_IMAGES","READ_MEDIA_VIDEO","READ_CALENDAR","BODY_SENSORS"],
        "Surveillance":["RECORD_AUDIO","CAMERA","ACCESS_FINE_LOCATION","ACCESS_COARSE_LOCATION"],
        "Financial":   ["SEND_SMS","CALL_PHONE","NFC","USE_CREDENTIALS","GET_ACCOUNTS","MANAGE_ACCOUNTS"],
        "Persistence": ["RECEIVE_BOOT_COMPLETED","FOREGROUND_SERVICE","WAKE_LOCK","BIND_DEVICE_ADMIN"],
        "Control":     ["REQUEST_INSTALL_PACKAGES","SYSTEM_ALERT_WINDOW","DISABLE_KEYGUARD","FACTORY_RESET","CHANGE_NETWORK_STATE","HIDE_OVERLAY_WINDOWS"],
    }
    result = {}
    for cat, perms in categories.items():
        score = sum(f["score"] for f in findings if f["permission"] in perms)
        result[cat] = min(score, 10)
    return result

def build_score_breakdown(findings, fraud_signals, cert_info, components):
    """Breakdown expected by the frontend ResultReport component."""
    perm_score  = sum(f["score"] for f in findings)
    combo_score = sum(2 for s in fraud_signals if s["type"] == "DANGEROUS_COMBO")
    fraud_score = sum(2 for s in fraud_signals if s["type"] in ("IMPERSONATION","SUSPICIOUS_NAME","UNKNOWN_DEVELOPER"))
    cert_score  = (3 if cert_info.get("self_signed") else 0) + (2 if cert_info.get("valid_to") and _cert_expired(cert_info["valid_to"]) else 0)
    total_comp  = sum(components.values())
    struct_score = 2 if total_comp > 50 else (1 if total_comp > 20 else 0)
    return {
        "permission_score":  min(perm_score, 20),
        "combo_score":       min(combo_score, 10),
        "fraud_score":       min(fraud_score, 10),
        "certificate_score": min(cert_score, 5),
        "structure_score":   min(struct_score, 5),
    }

def _cert_expired(valid_to_str):
    from datetime import datetime, timezone
    try:
        exp = datetime.strptime(valid_to_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        from datetime import datetime as dt
        return exp < dt.now(timezone.utc)
    except Exception:
        return False

# ─── WEBSOCKET ────────────────────────────────────────────────────────────────
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(ws: WebSocket, client_id: str):
    await ws.accept()
    clients[client_id] = ws
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        clients.pop(client_id, None)

# ─── SCAN TASK ────────────────────────────────────────────────────────────────
async def scan_task(path: str, client_id: str, source_url: str = ""):
    ws = clients.get(client_id)

    async def send(data):
        if ws:
            try:
                await ws.send_json(data)
            except Exception:
                pass

    await send({"stage": "progress", "step": 1, "total": 6, "msg": "Unpacking APK archive..."})

    # Run blocking androguard in thread pool so WebSocket stays alive
    loop = asyncio.get_event_loop()
    try:
        parsed = await loop.run_in_executor(executor, run_androguard, path)
    except Exception as e:
        await send({"stage": "error", "msg": f"Failed to parse APK: {str(e)}"})
        try: os.remove(path)
        except: pass
        return

    a           = parsed["a"]
    perms       = parsed["perms"]
    activities  = parsed["activities"]
    services    = parsed["services"]
    receivers   = parsed["receivers"]
    providers   = parsed["providers"]
    cert_info   = parsed["cert_info"]

    await send({"stage": "progress", "step": 2, "total": 6, "msg": "Extracting manifest & metadata..."})
    app_name = a.get_app_name() or "Unknown App"
    package  = a.get_package() or ""

    await send({"stage": "progress", "step": 3, "total": 6, "msg": "Running permission risk analysis..."})
    permission_verdict, permission_score, findings = analyze_permissions(perms)

    await send({"stage": "progress", "step": 4, "total": 6, "msg": "Detecting fraud patterns & certificate..."})
    fraud_signals = detect_fraud_signals(app_name, package, perms, activities, services, receivers, cert_info)
    verdict, score, score_breakdown = final_risk_score(permission_score, fraud_signals)

    await send({"stage": "progress", "step": 5, "total": 6, "msg": "Computing file integrity hash..."})
    file_hash = await loop.run_in_executor(executor, sha256_file, path)

    await send({"stage": "progress", "step": 6, "total": 6, "msg": "Building threat report..."})
    summary        = build_summary(verdict, fraud_signals, findings, app_name)
    risk_breakdown = build_risk_breakdown(findings)

    result = {
        "stage":         "done",
        "app":           app_name,
        "package":       package,
        "version":       a.get_androidversion_name() or "N/A",
        "min_sdk":       str(a.get_min_sdk_version() or "N/A"),
        "target_sdk":    str(a.get_target_sdk_version() or "N/A"),
        "sha256":        file_hash,
        "source_url":    source_url,
        "verdict":       verdict,
        "score":         score,
        "permission_verdict": permission_verdict,
        "score_breakdown": score_breakdown,
        "total_perms":   len(perms),
        "flagged_perms": len(findings),
        "findings":      findings,
        "fraud_signals": fraud_signals,
        "summary":       summary,
        "risk_breakdown": risk_breakdown,
        "cert_info":     cert_info,
        "components":    {"activities": activities, "services": services, "receivers": receivers, "providers": providers},
    }

    await send(result)
    try: os.remove(path)
    except: pass

# ─── API ──────────────────────────────────────────────────────────────────────
@app.post("/api/scan")
@app.post("/scan")
async def scan(file: UploadFile = File(...), client_id: str = ""):
    if not client_id:
        return {"error": "client_id required"}
    if not file.filename or not file.filename.lower().endswith(".apk"):
        return {"error": "Only .apk files are supported"}
    content = await file.read()
    if not content:
        return {"error": "Uploaded file is empty"}
    if len(content) > MAX_APK_BYTES:
        return {"error": "APK is too large. Maximum size is 150 MB"}
    path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.apk")
    with open(path, "wb") as f:
        f.write(content)
    if not is_valid_apk(path):
        try: os.remove(path)
        except: pass
        return {"error": "This file is not a valid APK archive"}
    asyncio.create_task(scan_task(path, client_id))
    return {"status": "started"}

class URLScanRequest(BaseModel):
    url: str
    client_id: str

@app.post("/api/scan-url")
@app.post("/scan-url")
async def scan_url(req: URLScanRequest):
    if not req.client_id:
        return {"error": "client_id required"}
    url = req.url.strip()
    if not url.startswith(("http://", "https://")):
        return {"error": "Invalid URL"}

    ws = clients.get(req.client_id)
    async def send(data):
        if ws:
            try: await ws.send_json(data)
            except: pass

    async def download_and_scan():
        await send({"stage": "progress", "step": 0, "total": 6, "msg": "Downloading APK from URL..."})
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=60) as client:
                resp = await client.get(url)
                if resp.status_code != 200:
                    await send({"stage": "error", "msg": f"Download failed: HTTP {resp.status_code}"}); return

                final_url = str(resp.url)
                content_type = resp.headers.get("content-type", "").lower()
                content_disposition = resp.headers.get("content-disposition", "").lower()
                is_apk_content = resp.content[:2] == b"PK"
                is_apk_header = (
                    final_url.lower().endswith(".apk") or
                    ".apk" in content_disposition or
                    "application/vnd.android.package-archive" in content_type or
                    "apk" in content_type
                )

                if "html" in content_type and len(resp.content) < 100_000 and not is_apk_content:
                    await send({"stage": "error", "msg": "URL does not point to an APK file."}); return
                if len(resp.content) > MAX_APK_BYTES:
                    await send({"stage": "error", "msg": "Downloaded APK is too large. Maximum size is 150 MB."}); return
                if not is_apk_content and not is_apk_header:
                    await send({"stage": "error", "msg": "Downloaded file does not appear to be an APK. Please provide a direct APK link ending in .apk."}); return

                path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.apk")
                with open(path, "wb") as f:
                    f.write(resp.content)
                if not is_valid_apk(path):
                    try: os.remove(path)
                    except: pass
                    await send({"stage": "error", "msg": "Downloaded file is not a valid APK archive."}); return
            await scan_task(path, req.client_id, source_url=url)
        except Exception as e:
            await send({"stage": "error", "msg": f"Download error: {str(e)}"})

    asyncio.create_task(download_and_scan())
    return {"status": "started"}

@app.get("/api/telemetry")
async def get_telemetry():
    """Get live system telemetry data for the command center"""
    import random
    import time
    
    return {
        "timestamp": int(time.time()),
        "reactor_core": round(4620 + (random.random() - 0.5) * 100, 1),
        "hull_integrity": round(max(95, min(100, 100 + (random.random() - 0.5) * 2)), 1),
        "oxygen_levels": round(max(95, min(100, 98.2 + (random.random() - 0.5) * 1)), 1),
        "shield_level": round(max(70, min(80, 75 + (random.random() - 0.5) * 3)), 1),
        "threat_level": max(0, min(0.01, 0.002 + (random.random() - 0.5) * 0.002)),
        "active_connections": 1204 + int((random.random() - 0.5) * 20),
        "traffic_volume": round(max(10, min(20, 14.8 + (random.random() - 0.5) * 2)), 1),
        "network_latency": round(max(8, min(20, 12 + (random.random() - 0.5) * 2)), 1),
        "neural_health": round(max(5, min(10, 7 + (random.random() - 0.5) * 1)), 1),
        "system_status": "OPTIMAL",
        "coordinates": "X-772 Y-982"
    }

@app.get("/api/network/nodes")
async def get_network_nodes():
    """Get network node status for network monitoring"""
    import random
    
    nodes = [
        {
            "id": "alpha-7",
            "name": "Network Node Alpha-7", 
            "status": "active",
            "threat": "critical",
            "traffic": round(14.8 + (random.random() - 0.5) * 2, 1),
            "relays": 1204 + int((random.random() - 0.5) * 50),
            "latency": round(12 + (random.random() - 0.5) * 3, 1)
        },
        {
            "id": "beta-3",
            "name": "Network Node Beta-3",
            "status": "active", 
            "threat": "low",
            "traffic": round(8.2 + (random.random() - 0.5) * 2, 1),
            "relays": 892 + int((random.random() - 0.5) * 50),
            "latency": round(8 + (random.random() - 0.5) * 3, 1)
        },
        {
            "id": "gamma-1",
            "name": "Network Node Gamma-1",
            "status": "standby",
            "threat": "medium", 
            "traffic": round(3.1 + (random.random() - 0.5) * 2, 1),
            "relays": 445 + int((random.random() - 0.5) * 50),
            "latency": round(15 + (random.random() - 0.5) * 3, 1)
        }
    ]
    
    return {"nodes": nodes}

@app.get("/api/network/connections")
async def get_active_connections():
    """Get active network connections"""
    import random
    
    origins = ["Terra-Prime-7", "Nexus-Station-Alpha", "Orbital-Relay-9", "Deep-Space-12", "Mining-Station-X"]
    packets = ["Encrypted", "Data Stream", "Command", "Telemetry", "Emergency"]
    statuses = ["secure", "active", "priority", "warning"]
    actions = ["TERMINATE", "MONITOR", "SECURE"]
    
    connections = []
    for i in range(3):
        connections.append({
            "origin": random.choice(origins),
            "packet": random.choice(packets),
            "status": random.choice(statuses),
            "bandwidth": random.randint(50, 250),
            "action": random.choice(actions)
        })
    
    return {"connections": connections}

@app.get("/api/system/logs")
async def get_system_logs():
    """Get recent system logs"""
    import random
    from datetime import datetime
    
    messages = [
        "Quantum encryption verified",
        "Threat assessment complete", 
        "Network optimization active",
        "Security protocols updated",
        "Data synchronization in progress",
        "System diagnostics running",
        "Firewall rules updated",
        "Backup systems online",
        "Initializing deep scan...",
        "Syncing orbital vectors",
        "Neural link established",
        "Communication active"
    ]
    
    logs = []
    for i in range(5):
        logs.append({
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "message": random.choice(messages),
            "type": random.choice(["info", "info", "info", "warning", "success"])
        })
    
    return {"logs": logs}

@app.get("/")
async def root():
    return {
        "message": "AEGIS HUD API", 
        "version": "3.0.0",
        "frontend_url": "http://localhost:3000",
        "docs": "/docs"
    }

@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "ok", "version": "3.0.0"}

@app.get("/api/status")
async def api_status():
    return {
        "status": "operational",
        "scanner": "androguard",
        "max_apk_mb": MAX_APK_BYTES // (1024 * 1024),
        "version": "3.0.0",
    }
