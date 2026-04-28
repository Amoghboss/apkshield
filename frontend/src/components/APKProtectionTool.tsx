import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileArchive,
  FileSearch,
  Globe,
  Info,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Upload,
  XCircle,
} from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import DebugPanel from './DebugPanel';

const API_BASE = '/api';
const WS_BASE = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8000`;
const clientId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
console.log('[APKProtectionTool] API_BASE', API_BASE, 'WS_BASE', WS_BASE);

type Finding = {
  permission: string;
  full: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  short: string;
  description: string;
  score: number;
};

type FraudSignal = {
  type: string;
  title: string;
  detail: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
};

type ScanResult = {
  app: string;
  package: string;
  version: string;
  verdict: 'DANGEROUS' | 'SUSPICIOUS' | 'LOW RISK' | 'SAFE';
  score: number;
  sha256: string;
  source_url?: string;
  total_perms: number;
  flagged_perms: number;
  findings: Finding[];
  fraud_signals: FraudSignal[];
  score_breakdown: Record<string, number>;
  summary: {
    headline: string;
    reason: string;
    top_risks: string[];
    advice: string[];
  };
  components: Record<string, number>;
};

const verdictConfig = {
  DANGEROUS: { icon: XCircle, label: 'Dangerous', className: 'border-red-400/40 bg-red-500/10 text-red-200' },
  SUSPICIOUS: { icon: AlertTriangle, label: 'Suspicious', className: 'border-amber-300/40 bg-amber-400/10 text-amber-100' },
  'LOW RISK': { icon: Info, label: 'Low risk', className: 'border-sky-300/40 bg-sky-400/10 text-sky-100' },
  SAFE: { icon: CheckCircle2, label: 'Safe', className: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' },
};

const severityClass = {
  CRITICAL: 'border-red-400/30 bg-red-500/10 text-red-200',
  HIGH: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
  MEDIUM: 'border-sky-300/30 bg-sky-400/10 text-sky-100',
  LOW: 'border-slate-500/30 bg-slate-400/10 text-slate-200',
  INFO: 'border-slate-600/30 bg-slate-500/10 text-slate-300',
};

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">{children}</h2>;
}

function PrimaryButton({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function ResultReport({ result }: { result: ScanResult }) {
  const config = verdictConfig[result.verdict] || verdictConfig.SAFE;
  const VerdictIcon = config.icon;
  const scoreRows = [
    ['Permissions abuse', result.score_breakdown?.permission_score || 0],
    ['Dangerous combos', result.score_breakdown?.combo_score || 0],
    ['Fraud signals', result.score_breakdown?.fraud_score || 0],
    ['Certificate risk', result.score_breakdown?.certificate_score || 0],
    ['App structure', result.score_breakdown?.structure_score || 0],
  ];

  return (
    <div className="space-y-6">
      <section className={`rounded-3xl border p-6 ${config.className}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <VerdictIcon size={28} />
              <span className="text-sm font-black uppercase tracking-[0.25em]">{config.label}</span>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">{result.app || 'Unknown APK'}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">{result.summary?.reason}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-center">
            <div className="text-5xl font-black">{result.score}</div>
            <div className="text-xs uppercase tracking-widest text-slate-300">Risk score</div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          ['Permissions', result.total_perms, FileSearch],
          ['Flagged', result.flagged_perms, AlertTriangle],
          ['Fraud signals', result.fraud_signals?.length || 0, ShieldAlert],
          ['Components', Object.values(result.components || {}).reduce((sum, value) => sum + value, 0), FileArchive],
        ] as [string, number, React.ElementType][]).map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label as string}</span>
              <Icon className="text-cyan-300" size={18} />
            </div>
            <div className="mt-3 text-3xl font-black text-white">{value as number}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionTitle>Why this verdict?</SectionTitle>
          <div className="space-y-4">
            {scoreRows.map(([label, score]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-mono text-cyan-200">+{score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min((Number(score) / 20) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle>App identity</SectionTitle>
          <div className="space-y-3 text-sm text-slate-300">
            <div><span className="text-slate-500">Package:</span> <span className="font-mono break-all">{result.package || 'Unknown'}</span></div>
            <div><span className="text-slate-500">Version:</span> {result.version || 'N/A'}</div>
            <div><span className="text-slate-500">SHA-256:</span> <span className="font-mono break-all">{result.sha256}</span></div>
            {result.source_url && <div><span className="text-slate-500">Source URL:</span> <span className="break-all">{result.source_url}</span></div>}
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionTitle>Risk explanations</SectionTitle>
        <div className="grid gap-3 lg:grid-cols-2">
          {result.findings?.length ? result.findings.map((finding) => (
            <div key={finding.full} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-white">{finding.permission}</span>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${severityClass[finding.level]}`}>
                  {finding.level}
                </span>
                <span className="ml-auto font-mono text-cyan-200">+{finding.score}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{finding.description}</p>
            </div>
          )) : <p className="text-slate-400">No risky Android permissions were detected.</p>}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <SectionTitle>Fraud indicators</SectionTitle>
          <div className="space-y-3">
            {result.fraud_signals?.length ? result.fraud_signals.map((signal, index) => (
              <div key={`${signal.type}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{signal.title}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${severityClass[signal.severity]}`}>
                    {signal.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{signal.detail}</p>
              </div>
            )) : <p className="text-slate-400">No fake-app, suspicious-name, certificate, or component-abuse signals found.</p>}
          </div>
        </Panel>

        <Panel>
          <SectionTitle>Recommended action</SectionTitle>
          <ul className="space-y-3">
            {(result.summary?.advice || []).map((advice) => (
              <li key={advice} className="flex gap-3 text-sm leading-6 text-slate-300">
                <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={16} />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

export default function APKProtectionTool({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);
  const [progress, setProgress] = useState<{ step: number; total: number; msg: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const fileLabel = useMemo(() => {
    if (!file) return 'Choose an APK file';
    return `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
  }, [file]);

  useEffect(() => {
    console.log('[APKProtectionTool] Connecting to API:', API_BASE);
    console.log('[APKProtectionTool] Connecting to WebSocket:', WS_BASE);
    
    fetch(`${API_BASE}/health`)
      .then((response) => {
        console.log('[APKProtectionTool] Health check response:', response.status);
        setBackendOnline(response.ok);
      })
      .catch((error) => {
        console.error('[APKProtectionTool] Health check failed:', error);
        setBackendOnline(false);
      });

    const ws = new WebSocket(`${WS_BASE}/ws/${clientId}`);
    ws.onopen = () => {
      console.log('[APKProtectionTool] WebSocket connected');
      setBackendOnline(true);
      setLogs((items) => [...items, 'Live scanner connected.']);
    };
    ws.onclose = () => {
      console.log('[APKProtectionTool] WebSocket disconnected');
      setBackendOnline(false);
      setLogs((items) => [...items, 'WebSocket connection closed. Live scan updates are unavailable.']);
    };
    ws.onerror = (event) => {
      console.error('[APKProtectionTool] WebSocket error:', event);
      setBackendOnline(false);
      setError('Live scanner connection failed. Restart the backend and refresh the page.');
    };
    ws.onmessage = (event) => {
      console.log('[APKProtectionTool] WebSocket message received:', event.data);
      const data = JSON.parse(event.data);
      if (data.stage === 'progress') {
        setProgress({ step: data.step, total: data.total, msg: data.msg });
        setLogs((items) => [...items, data.msg]);
      }
      if (data.stage === 'error') {
        console.error('[APKProtectionTool] Scan error from backend:', data.msg);
        setError(data.msg);
        setProgress(null);
        setIsScanning(false);
      }
      if (data.stage === 'done') {
        console.log('[APKProtectionTool] Scan completed:', data);
        setResult(data);
        setProgress(null);
        setIsScanning(false);
      }
    };
    return () => ws.close();
  }, []);

  const resetScan = () => {
    setError('');
    setResult(null);
    setLogs([]);
    setProgress(null);
  };

  const scanFile = async () => {
    console.log('[APKProtectionTool] Starting file scan...');
    if (!file) {
      setError('Select an APK file first.');
      return;
    }
    if (!backendOnline) {
      setError('Backend unavailable. Make sure the backend server is running on port 8000.');
      return;
    }
    resetScan();
    setIsScanning(true);
    setProgress({ step: 1, total: 6, msg: 'Uploading APK to backend...' });

    const form = new FormData();
    form.append('file', file);

    try {
      console.log('[APKProtectionTool] Sending file to:', `${API_BASE}/scan?client_id=${clientId}`);
      const response = await fetch(`${API_BASE}/scan?client_id=${clientId}`, { method: 'POST', body: form });
      const payload = await response.json();
      console.log('[APKProtectionTool] Scan response:', response.status, payload);
      if (!response.ok || payload.error) throw new Error(payload.error || 'Scan failed.');
    } catch (err) {
      console.error('[APKProtectionTool] Scan error:', err);
      setError(err instanceof Error ? err.message : 'Scan failed.');
      setProgress(null);
      setIsScanning(false);
    }
  };

  const scanUrl = async () => {
    console.log('[APKProtectionTool] Starting URL scan...');
    if (!url.trim()) {
      setError('Paste a direct APK download link first.');
      return;
    }
    if (!backendOnline) {
      setError('Backend unavailable. Make sure the backend server is running on port 8000.');
      return;
    }
    resetScan();
    setIsScanning(true);
    setProgress({ step: 1, total: 6, msg: 'Sending APK link to backend...' });

    try {
      console.log('[APKProtectionTool] Sending URL to:', `${API_BASE}/scan-url`);
      const response = await fetch(`${API_BASE}/scan-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, client_id: clientId }),
      });
      const payload = await response.json();
      console.log('[APKProtectionTool] URL scan response:', response.status, payload);
      if (!response.ok || payload.error) throw new Error(payload.error || 'URL scan failed.');
    } catch (err) {
      console.error('[APKProtectionTool] URL scan error:', err);
      setError(err instanceof Error ? err.message : 'URL scan failed.');
      setProgress(null);
      setIsScanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.10),transparent_30%),#020617] px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <DebugPanel />
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
              <ShieldCheck size={14} />
              Problem Statement 3
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Protect users from fraudulent APKs before installation
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Scan APK files or direct download links, detect permission abuse and fraud signals, then explain the risk in plain language.
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${backendOnline ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200' : 'border-red-300/30 bg-red-500/10 text-red-200'}`}>
            Backend {backendOnline ? 'connected' : 'offline'}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <Panel>
              <div className="mb-5 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1">
                <button className={`rounded-xl px-4 py-3 text-sm font-bold ${mode === 'file' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400'}`} onClick={() => setMode('file')}>
                  APK File
                </button>
                <button className={`rounded-xl px-4 py-3 text-sm font-bold ${mode === 'url' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400'}`} onClick={() => setMode('url')}>
                  Download Link
                </button>
              </div>

              {mode === 'file' ? (
                <div className="space-y-4">
                  <button onClick={() => fileInput.current?.click()} className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-5 text-left hover:border-cyan-200/70">
                    <Upload className="shrink-0 text-cyan-200" />
                    <div>
                      <div className="font-semibold text-white">{fileLabel}</div>
                      <div className="text-sm text-slate-400">The backend validates the APK archive before analysis.</div>
                    </div>
                  </button>
                  <input ref={fileInput} type="file" accept=".apk,application/vnd.android.package-archive" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
                  <PrimaryButton onClick={scanFile} disabled={isScanning}>
                    {isScanning ? <Loader2 className="animate-spin" size={18} /> : <FileSearch size={18} />}
                    Scan APK
                  </PrimaryButton>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-300">Direct APK URL</span>
                    <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/app.apk" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none focus:border-cyan-300/60" />
                  </label>
                  <PrimaryButton onClick={scanUrl} disabled={isScanning}>
                    {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
                    Scan Link
                  </PrimaryButton>
                </div>
              )}

              {error && <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
            </Panel>

            <Panel>
              <SectionTitle>Live scan progress</SectionTitle>
              {progress && (
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm text-slate-300">
                    <span>{progress.msg}</span>
                    <span>{progress.step}/{progress.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min((progress.step / progress.total) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {logs.length ? logs.map((log, index) => (
                  <div key={`${log}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    {log}
                  </div>
                )) : <p className="text-sm text-slate-500">No scan started yet.</p>}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            {!result && (
              <Panel>
                <SectionTitle>Challenge coverage</SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['APK files', 'Scans sideloaded APKs before users install them.'],
                    ['Download links', 'Checks direct APK URLs before downloading/installing.'],
                    ['Risk warning', 'Classifies apps as Safe, Low Risk, Suspicious, or Dangerous.'],
                    ['Plain explanation', 'Explains permission abuse, unknown developer patterns, and fraud indicators.'],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="font-bold text-white">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
            {result && <ResultReport result={result} />}
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="mt-8">
          <BottomNavigation activeTab="scans" onNavigate={onNavigate || (() => {})} />
        </div>
      </div>
    </main>
  );
}
