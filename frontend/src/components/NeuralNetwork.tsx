import { motion } from 'motion/react';
import { Cpu, Network, Activity, Zap, ShieldAlert, Binary } from 'lucide-react';

const verdicts = [
  { time: '14:22:01', title: 'SHA-256 MATCH', desc: 'Neural fingerprint verified against global threat database.', icon: Binary, color: 'text-primary-container', type: 'info' },
  { time: '14:21:44', title: 'HEURISTIC ALERT', desc: 'Obfuscated logic patterns detected in Sector 7G.', icon: ShieldAlert, color: 'text-error', type: 'alert' },
  { time: '14:19:30', title: 'INTEGRITY SECURE', desc: 'APK manifest matches original distributor signature.', icon: Zap, color: 'text-primary-container', type: 'info' },
];

export default function NeuralNetwork() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 py-8"
    >
      {/* Left Column: Diagnostics */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-label-caps text-outline text-[9px] uppercase tracking-widest">Heuristic Processing Load</h3>
              <Cpu className="text-primary-container" size={14} />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold">78.4</span>
              <span className="text-outline font-label-caps text-[10px] mb-1">GFLOP/S</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '78.4%' }}
                className="h-full bg-primary-container shadow-[0_0_10px_#00a3ff]" 
              />
            </div>
            <div className="mt-6 gap-1 h-12 flex items-end">
              {[40, 60, 90, 75, 55, 80, 45, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-container/40" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 relative flex flex-col items-center group hover:scale-[1.02] transition-transform duration-500">
          <h3 className="font-label-caps text-outline text-[9px] w-full text-left mb-10 uppercase tracking-widest">AI Confidence Score</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center border-4 border-white/5 rounded-full p-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-800" cx="72" cy="72" fill="transparent" r="68" stroke="currentColor" strokeWidth="6" />
              <motion.circle 
                initial={{ strokeDashoffset: 427 }}
                animate={{ strokeDashoffset: 42 }}
                className="text-primary-container transition-all duration-1000" 
                cx="72" cy="72" fill="transparent" r="68" stroke="currentColor" strokeDasharray="427" strokeWidth="6" 
                style={{ filter: 'drop-shadow(0 0 8px #00a3ff)' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black">99.2</span>
              <span className="font-label-caps text-outline text-[9px] uppercase tracking-widest">Certainty</span>
            </div>
          </div>

          <div className="mt-8 w-full space-y-2">
            <div className="flex justify-between text-[9px] font-label-caps text-outline uppercase tracking-widest">
              <span>Neural Bias</span>
              <span>0.002%</span>
            </div>
            <div className="flex justify-between text-[9px] font-label-caps text-outline uppercase tracking-widest">
              <span>Latency</span>
              <span>14MS</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-primary-container/50 flex items-center justify-center">
              <Network size={20} className="text-primary-container" />
            </div>
            <div>
              <p className="font-label-caps text-[9px] text-outline uppercase tracking-widest">Core Architecture</p>
              <p className="font-label-caps text-[10px] text-primary-container font-bold uppercase tracking-widest">Quantum-Resistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Central Column: Neural Network Graph */}
      <div className="col-span-12 lg:col-span-6 min-h-[600px] glass-panel rounded-3xl border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            className="w-full h-full object-cover opacity-40 mix-blend-screen" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYcGGP5WTHHKgaEQ0s8R-6ZMKNbR50_hcef4xhYty5CwbU7oor1MoVTSXDHuxS5uGQ6b31ogjHmkBn-TlEcVdKPsuD0KUylkszg7n-QkjJfLIffNrqSkNdoVqdLE1yCFmlyqZEuFcnWjCOPqPgigjm__aOkFK9HTpqUpIT158Nbd9xvV7FyqkmzSufrdyM3sSq7wGLS5OU441Yr4icc6Th8jU5upvbnk_vl54OQ5Lt0Hvl-1TFqyaR91E_V9M37b21UtVGeh17FD8"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20">
            {/* Animated Nodes */}
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 left-1/3 group cursor-pointer"
            >
              <div className="w-4 h-4 bg-primary-container rounded-full animate-ping absolute opacity-70" />
              <div className="w-4 h-4 bg-primary-container rounded-full relative shadow-[0_0_15px_#00a3ff]" />
            </motion.div>

            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute top-1/2 right-1/4 group cursor-pointer" 
            >
              <div className="w-5 h-5 bg-tertiary-container rounded-full animate-pulse absolute opacity-70" />
              <div className="w-5 h-5 bg-tertiary-container rounded-full relative shadow-[0_0_20px_#ff704c]" />
            </motion.div>
          </div>
        </div>

        <div className="absolute top-8 left-8 z-30">
          <h2 className="text-3xl font-bold tracking-tight">NEURAL_<span className="font-serif italic font-light lowercase">Monitor_01</span></h2>
          <p className="font-label-caps text-outline text-[10px] tracking-[0.2em] uppercase mt-1">Active Scanning Sector 7G-VOID</p>
        </div>

        <div className="absolute bottom-8 right-8 z-30 flex gap-4">
          <button className="px-8 py-3 bg-primary-container text-on-primary-container font-label-caps text-[11px] rounded-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,163,255,0.4)] tracking-widest uppercase font-bold">
            Force Re-Scan
          </button>
          <button className="px-8 py-3 bg-transparent border border-white/20 text-on-surface font-label-caps text-[11px] rounded-sm hover:bg-white/5 transition-all tracking-widest uppercase">
            Export Graph
          </button>
        </div>

        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50 z-10 animate-[scan_4s_linear_infinite]" />
      </div>

      {/* Right Column: Log */}
      <div className="col-span-12 lg:col-span-3 flex flex-col h-full gap-6">
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-full relative overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-label-caps text-outline text-[9px] uppercase tracking-widest">Neural Verdicts</h3>
            <span className="text-[9px] font-label-caps text-primary-container animate-pulse uppercase tracking-widest">Live Feed</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {verdicts.map((v, i) => (
              <div key={i} className={`p-4 rounded-r-xl border-l-2 transition-colors ${
                v.type === 'alert' ? 'bg-error-container/10 border-error' : 'bg-primary-container/10 border-primary-container'
              } hover:bg-white/10`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-label-caps text-outline tracking-wider">{v.time}</span>
                  <v.icon className={v.color} size={14} />
                </div>
                <p className={`text-xs font-bold mb-1 ${v.type === 'alert' ? 'text-error' : 'text-on-surface'}`}>{v.title}</p>
                <p className="text-[10px] text-outline leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 mt-auto">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-label-caps text-outline tracking-[0.2em] transition-all uppercase">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
