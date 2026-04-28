import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const clientId = Math.random().toString(36).substring(7);

const VERDICT_CONFIG = {
  DANGEROUS:  { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.35)",  icon: "☠️", glow: "glow-red" },
  SUSPICIOUS: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.35)", icon: "⚠️", glow: "glow-yellow" },
  "LOW RISK": { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.35)", icon: "🔵", glow: "glow-blue" },
  SAFE:       { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.35)", icon: "✅", glow: "glow-green" },
};
const LEVEL_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const FRAUD_COLOR = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#60a5fa" };
const STEPS_FILE = ["Unpacking APK","Extracting metadata","Permission analysis","Fraud & cert check","Integrity hash","Building report"];
const STEPS_URL  = ["Downloading APK",...STEPS_FILE];

function Spinner() {
  return (
    <div className="relative w-7 h-7 flex-shrink-0">
      <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{borderColor:"#00f5d4"}}/>
      <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent spin"
        style={{borderLeftColor:"#00f5d4"}}/>
    </div>
  );
}

function StatCard({ label, value, color="#00f5d4" }) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
      className="card-hover rounded-xl p-4 border"
      style={{background:"rgba(13,21,38,0.8)",borderColor:"rgba(255,255,255,0.07)"}}>
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-bold mono" style={{color}}>{value}</div>
    </motion.div>
  );
}

function RiskBar({ label, value, max=10 }) {
  const pct = Math.min((value/max)*100, 100);
  const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : pct >= 10 ? "#60a5fa" : "#10b981";
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-slate-400 w-24 flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
        <motion.div className="h-full rounded-full" initial={{width:0}}
          animate={{width:`${pct}%`}} transition={{duration:0.8,ease:"easeOut"}}
          style={{background:color}}/>
      </div>
      <div className="text-xs mono w-6 text-right flex-shrink-0" style={{color}}>{value}</div>
    </div>
  );
}

function PermissionRow({ finding, index }) {
  const [open, setOpen] = useState(false);
  const colors = {CRITICAL:"#ef4444",HIGH:"#f59e0b",MEDIUM:"#60a5fa",LOW:"#94a3b8",INFO:"#64748b"};
  const c = colors[finding.level] || "#94a3b8";
  return (
    <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
      transition={{delay:index*0.03}}
      className="rounded-lg border cursor-pointer card-hover"
      style={{borderColor:"rgba(255,255,255,0.06)",background:"rgba(13,21,38,0.6)"}}
      onClick={()=>setOpen(!open)}>
      <div className="flex items-center gap-3 p-3">
        <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{background:c}}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mono text-sm font-medium text-slate-200">{finding.permission}</span>
            <span className={`badge level-${finding.level}`}>{finding.level}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{finding.short}</p>
          <AnimatePresence>
            {open && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                exit={{height:0,opacity:0}} className="overflow-hidden">
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{finding.description}</p>
                <p className="mono text-xs text-slate-600 mt-1">{finding.full}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold mono" style={{color:c}}>+{finding.score}</span>
          <span className="text-slate-600 text-xs">{open?"▲":"▼"}</span>
        </div>
      </div>
    </motion.div>
  );
}

function FraudCard({ signal, index }) {
  const c = FRAUD_COLOR[signal.severity] || "#94a3b8";
  return (
    <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
      transition={{delay:index*0.06}}
      className={`rounded-xl p-4 fraud-${signal.severity}`}
      style={{background:"rgba(13,21,38,0.7)"}}>
      <div className="flex items-start gap-3">
        <div className="text-lg flex-shrink-0">
          {signal.severity==="CRITICAL"?"🚨":signal.severity==="HIGH"?"⚠️":"🔍"}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm mb-1" style={{color:c}}>{signal.title}</div>
          <p className="text-xs text-slate-400 leading-relaxed">{signal.detail}</p>
        </div>
        <span className={`badge level-${signal.severity} flex-shrink-0`}>{signal.severity}</span>
      </div>
    </motion.div>
  );
}

function CertPanel({ cert }) {
  if (!cert || Object.keys(cert).length === 0) {
    return (
      <div className="rounded-xl border p-4 text-center"
        style={{background:"rgba(13,21,38,0.8)",borderColor:"rgba(255,255,255,0.07)"}}>
        <p className="text-xs text-slate-500">Certificate information not available for this APK.</p>
      </div>
    );
  }
  const rows = [
    ["Subject",    cert.subject],
    ["Issuer",     cert.issuer],
    ["Valid From", cert.valid_from],
    ["Valid To",   cert.valid_to],
    ["Self-Signed",cert.self_signed ? "⚠️ YES — not from Play Store" : "✅ No"],
  ];
  return (
    <div className="rounded-xl border overflow-hidden"
      style={{background:"rgba(13,21,38,0.8)",borderColor:"rgba(255,255,255,0.07)"}}>
      {rows.map(([k,v])=>(
        <div key={k} className="flex gap-3 px-4 py-2.5 border-b last:border-0"
          style={{borderColor:"rgba(255,255,255,0.05)"}}>
          <span className="text-xs text-slate-500 w-24 flex-shrink-0">{k}</span>
          <span className="mono text-xs text-slate-300 break-all"
            style={{color: k==="Self-Signed" && cert.self_signed ? "#f59e0b" : undefined}}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ summary }) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      className="rounded-2xl border p-5"
      style={{background:"rgba(13,21,38,0.9)",borderColor:"rgba(0,245,212,0.15)"}}>
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Plain-English Explanation</div>
      <div className="text-lg font-bold text-white mb-2">{summary.headline}</div>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{summary.reason}</p>
      {summary.top_risks.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Why it is risky</div>
          <ul className="space-y-2">
            {summary.top_risks.map((r,i)=>(
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">What you should do</div>
        <ul className="space-y-2">
          {summary.advice.map((a,i)=>(
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-teal-400 flex-shrink-0 mt-0.5">→</span>
              <span className="leading-relaxed">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function RiskBreakdown({ breakdown }) {
  return (
    <div className="rounded-2xl border p-5"
      style={{background:"rgba(13,21,38,0.8)",borderColor:"rgba(255,255,255,0.07)"}}>
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Risk Breakdown by Category</div>
      <div className="space-y-3">
        {Object.entries(breakdown).map(([cat,val])=>(
          <RiskBar key={cat} label={cat} value={val}/>
        ))}
      </div>
    </div>
  );
}

function SharePanel({ result }) {
  const [copied, setCopied] = useState(false);
  const buildText = () => [
    "🛡️ APK Guardian Scan Report",
    `App: ${result.app}`,
    `Package: ${result.package}`,
    `Verdict: ${result.verdict} (Score: ${result.score})`,
    "",
    `⚠️ Fraud Signals: ${result.fraud_signals.length}`,
    ...result.fraud_signals.map(s=>`  • ${s.title}`),
    "",
    "🔑 Top Permission Risks:",
    ...result.findings.filter(f=>["CRITICAL","HIGH"].includes(f.level)).slice(0,4).map(f=>`  • ${f.short}`),
    "",
    `SHA-256: ${result.sha256}`,
    "",
    "Scanned with APK Guardian",
  ].join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(buildText());
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };
  const wa  = () => window.open(`https://wa.me/?text=${encodeURIComponent(buildText())}`, "_blank");
  const tg  = () => window.open(`https://t.me/share/url?url=https://apkguardian.app&text=${encodeURIComponent(buildText())}`, "_blank");
  const mail= () => window.open(`mailto:?subject=${encodeURIComponent(`APK Scan: ${result.app} — ${result.verdict}`)}&body=${encodeURIComponent(buildText())}`);

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      className="rounded-2xl border p-5"
      style={{background:"rgba(13,21,38,0.8)",borderColor:"rgba(255,255,255,0.07)"}}>
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Share Report</div>
      <p className="text-xs text-slate-400 mb-4">Warn others about this app via messaging apps or email.</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={wa}   className="share-btn" style={{borderColor:"rgba(37,211,102,0.3)",color:"#25d366"}}>💬 WhatsApp</button>
        <button onClick={tg}   className="share-btn" style={{borderColor:"rgba(0,136,204,0.3)",color:"#0088cc"}}>✈️ Telegram</button>
        <button onClick={mail} className="share-btn">📧 Email</button>
        <button onClick={copy} className="share-btn"
          style={{borderColor:copied?"rgba(0,245,212,0.4)":undefined,color:copied?"#00f5d4":undefined}}>
          {copied?"✓ Copied!":"📋 Copy Report"}
        </button>
      </div>
      {result.source_url && (
        <div className="mt-4 p-3 rounded-lg border text-xs"
          style={{borderColor:"rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.2)"}}>
          <span className="text-slate-500">Source URL: </span>
          <span className="mono text-slate-400 break-all">{result.source_url}</span>
        </div>
      )}
    </motion.div>
  );
}
