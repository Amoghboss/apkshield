import { motion } from 'motion/react';
import { ShieldAlert, Activity, Zap, ShieldCheck } from 'lucide-react';

// MetricBar component
const MetricBar = ({ label, value, score, color }: { label: string; value: string; score: number; color: string }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000"
        style={{ 
          width: `${score}%`,
          backgroundColor: color
        }}
      />
    </div>
  </div>
);

const entries = [
  {
    name: 'Alpha_Messenger_v2.apk',
    sector: 'AURORA-7',
    status: 'SECURE',
    color: 'bg-primary-container',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT_aesSHVLN6o2c8RdE4DeSMJIanv_eaQCUMHJKR0xhf8PUorE6uGdG6dnjFKPWihZJ1b5FS1TR26j4Q7qCKlfFF-BXCTwqd_9RWtg71EU1tl2Jz_phSKVsySwSDMEJmMAjvKc-CuvAxOEmJJ9TMdDVnBLz7bmGVIwl3hPI6qXKYDpPgmZl5vQ5zmCXX2ENGOhsw6wltagjW4V02L1gOM5z5SX1get7dmPY3NQ12fwTFv7nTIqQYgmVvrhggfBU_fwyNjWslPEmfo'
  },
  {
    name: 'Vault_Crypto_Core.apk',
    sector: 'NEBULA-0',
    status: 'WARNING',
    color: 'bg-secondary',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfNKCGZhHYaSVdX6eFcXrxTpKdTSxptfi_C5XB_iYh6H73gTsMEt3AHGsL6WAjUO7YYuIbvci7D7fdi45SH0zExkfEvVIffDNvvRhW03g_bvLiWKMUbFKDDPudfogp80zYfayeEnR3n2H3T3__QjOJOLf1lcIYFKNgnWb2DmAyLo8pMGiLfSNu3-Yz_tRCpyMEzsE90vUQ5PHlGw_n0dqRcJa_v5tWP9O7WgjAlLjRr4Df5eJp1IXD6eXKTqA9ylIEDICcDWqv9p4'
  },
  {
    name: 'Shadow_Protocol_X.zip',
    sector: 'SUPERNOVA',
    status: 'DANGER',
    color: 'bg-error',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9SR9Zn9HAfTLvm8TOuYeGidhPzEkqftELeebC_WPrPcUVUZb6Nv7BzAWZdmz0cHwijvhRFHLp3Ai9HcbBYrYFx0FJeG0x-jxhPygaDaP9FiHNAoqj0x1U9TP1ot5DcGK9ItpgibdreIBq3jRgJkTePtjf1cfggQTls7OOTxcVkPkMPcsfWnwMFnXDUu5VmmGIS8LlvchQB0hXcVfB0TptUmTziT7GvCO-j94eaGaMPCJkVH6caSXonK9hVm5ESnYhcxaz8uzTK0'
  },
  {
    name: 'Nexus_Sync_Tool.apk',
    sector: 'TERRA-2',
    status: 'SECURE',
    color: 'bg-primary-container',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmTXX2J3efoFvRyCiy9SNPnNcSM89H7VP5KUqAKumcFWY2i96lpUwCeukWYHAuZJPOuaa9_3nmguSANKkLnMFuc3LXSDmhmgKh_QX-hTofPUfvKoBtqqLGL_RXJRtv3WCy7YqLoV61I2TaGgxL01CtBHuXrnIrHo8HkQFI-gO8gCy0qRbIREpbVSXgeyOT9eJvnyiohFPCbWstpQuXGC3cm7ngKwJgv8dLWdIg1XaI3_JH8-MgsXcZO4VCnw7GdtYUjlkROys6VsY'
  }
];

const metrics = [
  { label: 'Network Entropy', value: '24.2%', score: 24, color: '#fb7185' },
  { label: 'Threat Saturation', value: '68.1%', score: 68, color: '#a78bfa' },
  { label: 'Neural Integrity', value: '99.8%', score: 100, color: '#38bdf8' },
];

const summary = [
  'Stable neural mesh with low drift.',
  'Threat vectors isolated and contained.',
  'Scan latency remains under 15ms.',
];

export default function Monitor() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto pb-24 space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-primary-container/15 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-primary-container font-semibold border border-primary-container/20">
              Active Scan Terminal
            </div>
            <div className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-slate-400">
              1,204 High Risks Detected
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-surface-container/85 p-8 overflow-hidden relative shadow-panel">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12)_0%,rgba(14,165,233,0.06)_20%,transparent_35%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.12),transparent_18%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/60 to-slate-950/95" />
            <div className="relative flex flex-col h-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Secure Status</div>
                  <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight text-white">SAFESCAN AI</h1>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-900/90 px-4 py-3 text-xs uppercase tracking-[0.35em] text-primary-container font-semibold flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary-container animate-pulse" />
                  SECURE LAYER 7
                </div>
              </div>

              <div className="relative flex-1 flex items-center justify-center">
                <div className="relative w-[520px] max-w-full aspect-square">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="absolute inset-10 rounded-full border border-white/10" />
                  <div className="absolute inset-20 rounded-full border border-white/10" />
                  <div className="absolute inset-32 rounded-full border border-white/10" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,transparent_55%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-primary-container/40 bg-slate-950/60 flex flex-col items-center justify-center text-center">
                      <div className="text-xs uppercase tracking-[0.35em] text-slate-400">NEURAL HEALTH</div>
                      <div className="text-6xl font-black text-white">7</div>
                      <div className="text-xs uppercase tracking-[0.35em] text-slate-500">secure nodes</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-primary-container/20 opacity-50" />
                  <div className="absolute left-1/2 top-1/2 h-[260px] w-[1px] bg-gradient-to-b from-primary-container/70 via-transparent to-transparent origin-top animate-radar-sweep" />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{metric.label}</div>
                    <div className="mt-2 text-3xl font-black text-white">{metric.value}</div>
                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${metric.score}%`, background: metric.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-surface-container/85 p-8 shadow-panel">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Neural Health</div>
                <h2 className="mt-3 text-3xl font-black text-white">System Overview</h2>
              </div>
              <ShieldCheck size={32} className="text-primary-container" />
            </div>

            <div className="space-y-5">
              {metrics.map((metric) => (
                <MetricBar key={metric.label} {...metric} />
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500 mb-4">
                <span>Active Vector Count</span>
                <span className="text-white font-semibold">12,482</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-primary-container" style={{ width: '82%' }} />
              </div>
              <div className="mt-4 text-[12px] text-slate-400">Live feed active across the secure stack. Threat saturation is currently contained within tolerances.</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Alerts</div>
                <h3 className="text-xl font-black text-white">High Priority</h3>
              </div>
              <div className="rounded-full bg-primary-container/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-primary-container font-semibold">4 Active</div>
            </div>
            {summary.map((line, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary-container" />
                <p>{line}</p>
              </div>
            ))}
            <button className="w-full py-3 rounded-2xl bg-white/5 text-[10px] uppercase tracking-[0.35em] text-slate-200 font-semibold hover:bg-white/10 transition">
              Detailed Threat Log
            </button>
          </div>
        </aside>
      </section>
    </motion.div>
  );
}
