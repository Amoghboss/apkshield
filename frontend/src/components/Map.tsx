import { motion } from 'motion/react';
import { Radar, Shield, Target, ZoomIn, ZoomOut, Layers } from 'lucide-react';

const sources = [
  { name: 'Sector 7G', status: 'ACTIVE', latency: '4ms', color: 'text-primary-container' },
  { name: 'Void Omega', status: 'CAUTION', latency: '12ms', color: 'text-secondary' },
  { name: 'Aurora-12', status: 'DANGER', latency: '144ms', color: 'text-error' },
];

export default function MapView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-160px)] flex gap-8 p-4"
    >
      {/* Left Panel */}
      <div className="w-80 flex flex-col gap-6 z-10">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 refracting-border-gradient relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent animate-[scan_4s_linear_infinite]" />
          
          <h3 className="font-label-caps text-[10px] text-outline mb-6 flex items-center gap-2 tracking-widest uppercase">
            <Radar size={14} className="text-primary-container" />
            Active Attack Sources
          </h3>

          <div className="space-y-4">
            {sources.map((s, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-crosshair">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase">{s.name}</span>
                  <span className="text-[9px] text-outline uppercase">Latency: {s.latency}</span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${s.color} bg-current/10 border border-current/20`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex-1 border border-white/10 refracting-border-gradient relative">
          <h3 className="font-label-caps text-[10px] text-outline mb-6 tracking-widest uppercase">Defense Protocol Status</h3>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                <span>Firewall Integrity</span>
                <span className="text-primary-container">98.4%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  className="h-full bg-primary-container shadow-[0_0_10px_#00a3ff]" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                <span>AI Counter-Measures</span>
                <span className="text-primary-container">Active</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-full bg-primary-container shadow-[0_0_10px_#00a3ff] w-full" 
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center border-2 border-primary-container/20 rounded-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-t-2 border-primary-container rounded-full"
                />
                <Shield size={32} className="text-primary-container animate-pulse" />
                <motion.div 
                  className="absolute w-2 h-2 bg-primary-container rounded-full"
                  animate={{ 
                    rotate: 360,
                    x: [0, 12, 0, -12, 0],
                    y: [12, 0, -12, 0, 12]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section: 3D Global Map */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
          <motion.img 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-[80%] aspect-square object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6eh7qL15ZuzyQ3FReSAYNAFPJE5BRvgVJ7bQOPSXZ93ySYCPuiF9h16MAqCrRLQubOf65NgS62FlbOIFI9aPW_ZvUzbdtREsVALpJXxM9JAG121A4vbgx0vk24I3CplGXkHuG91w4GvrvdAhMJnBa277TsGr-L1VZ1J8728p_ykAvBQoye_2_9_dpAQcCLNd-1XpAwjy5rguCi8OOkuRhr5eezrHIPc2RhhuV_2mG7hxGkjpaefq8Gy1JEx1lRJoyPjjVVODgjbo"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 glass-panel py-3 px-8 rounded-full border border-white/10 refracting-border-gradient z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary-container shadow-[0_0_8px_#00a3ff]" />
            <span className="font-label-caps text-[9px] tracking-widest text-outline uppercase">Secure Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-tertiary shadow-[0_0_8px_#ffb4a2]" />
            <span className="font-label-caps text-[9px] tracking-widest text-outline uppercase">Nebula Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-error shadow-[0_0_8px_#ffb4ab] animate-pulse" />
            <span className="font-label-caps text-[9px] tracking-widest text-outline uppercase">Supernova Danger</span>
          </div>
        </div>
      </div>

      {/* Right HUD Rail */}
      <div className="w-16 flex flex-col justify-between items-center py-4 z-10 border-l border-white/5">
        <div className="font-label-caps text-[10px] -rotate-90 whitespace-nowrap tracking-[0.4em] text-outline/50 origin-center translate-y-12">
          ENCRYPTION: QUANTUM-AES
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,163,255,0.2)] transition-all">
            <ZoomIn size={18} className="text-primary-container" />
          </button>
          <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,163,255,0.2)] transition-all">
            <ZoomOut size={18} className="text-primary-container" />
          </button>
          <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,163,255,0.2)] transition-all">
            <Layers size={18} className="text-primary-container" />
          </button>
        </div>

        <div className="font-label-caps text-[10px] -rotate-90 whitespace-nowrap tracking-[0.4em] text-outline/50 origin-center -translate-y-12">
          NODE: VOID-OMEGA-7
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-12 w-16 h-16 bg-primary-container shadow-[0_0_20px_rgba(0,163,255,0.4)] rounded-full flex items-center justify-center z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Target size={28} className="text-on-primary-container relative z-10" />
      </motion.button>
    </motion.div>
  );
}
