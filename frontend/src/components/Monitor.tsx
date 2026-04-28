import { motion } from 'motion/react';
import { ShieldAlert, Activity, Hash, CloudUpload, Filter, Zap, ArrowUpRight, Search } from 'lucide-react';

const stats = [
  { 
    title: 'System Status', 
    value: 'OPERATIONAL', 
    icon: ShieldAlert, 
    color: 'text-primary-container',
    footer: 'ALL SYSTEMS NOMINAL',
    footerIcon: true,
    shadow: 'shadow-[0_0_20px_#00a3ff]'
  },
  { 
    title: 'Total Scans', 
    value: '1.4M+', 
    icon: Activity, 
    color: 'text-secondary', 
    progress: 75,
    shadow: 'shadow-[0_0_20px_#dcb8ff]'
  },
  { 
    title: 'Threats Neutralized', 
    value: '24,802', 
    icon: Hash, 
    color: 'text-tertiary-container', 
    footer: '+142 SINCE LAST CYCLE',
    shadow: 'shadow-[0_0_20px_#ff704c]'
  }
];

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

export default function Monitor() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1440px] mx-auto space-y-12 pb-24"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-label-caps text-xs tracking-[0.3em] text-primary-container uppercase font-bold">
            <Zap size={16} fill="currentColor" />
            Active Scan Terminal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface leading-none">
            THREAT<br/>
            <span className="font-serif italic font-light lowercase ml-6 text-outline">Intelligence</span>
          </h1>
        </div>
        <div className="glass-panel py-3 px-6 rounded-full border border-white/10 refracting-border-gradient flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary-container/20 flex items-center justify-center">
            <Search size={18} className="text-outline" />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-label-caps text-outline uppercase tracking-widest leading-none">Current Cycle</div>
            <div className="text-xs font-bold font-label-caps text-on-surface tracking-widest mt-1">AX-774-001</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -8 }}
            className={`glass-panel p-8 rounded-2xl border border-white/10 refracting-border-gradient relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start mb-12">
              <div className={`p-4 rounded-xl bg-current/10 border border-current/20 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight className="text-outline/40 group-hover:text-on-surface transition-colors" size={20} />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-label-caps text-[10px] text-outline tracking-widest uppercase">{stat.title}</h3>
              <div className="text-4xl font-black tracking-tight text-on-surface">{stat.value}</div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
              {stat.progress ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest text-outline uppercase">
                    <span>Scan Coverage</span>
                    <span className="text-primary-container">{stat.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      className={`h-full bg-primary-container ${stat.shadow}`} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {stat.footerIcon && <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />}
                  <span className="text-[9px] font-label-caps text-outline uppercase tracking-[0.2em]">
                    {stat.footer}
                  </span>
                </div>
              )}
            </div>
            
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dropzone Feature */}
        <div className="lg:col-span-8 glass-panel rounded-3xl border border-white/10 refracting-border-gradient overflow-hidden relative group h-[480px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent transition-opacity group-hover:opacity-100 opacity-60" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="w-[300px] h-[300px] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse] absolute" />
            <div className="w-[200px] h-[200px] border border-white/15 rounded-full animate-[spin_20s_linear_infinite] absolute" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-16 rounded-[40px] border border-white/20 backdrop-blur-3xl shadow-2xl space-y-8 max-w-md w-full cursor-pointer hover:border-primary-container/50 transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-primary-container/10 border-2 border-primary-container/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,163,255,0.2)]">
                <CloudUpload className="text-primary-container" size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-on-surface">Neural Ingest</h2>
                <p className="text-outline font-label-caps text-[10px] tracking-widest uppercase">Target Payload: Binary / APK / ZIP</p>
              </div>
              <button className="w-full py-4 bg-primary-container text-on-primary-container rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:shadow-[0_0_25px_rgba(0,163,255,0.4)] active:scale-95 transition-all">
                Initialize Sequence
              </button>
            </motion.div>
          </div>
          
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <Activity className="text-primary-container animate-pulse" size={16} />
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest">Awaiting Command Data</span>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-4 glass-panel rounded-3xl border border-white/10 refracting-border-gradient flex flex-col">
          <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="font-label-caps text-xs text-on-surface font-bold tracking-widest uppercase flex items-center gap-2">
              <Hash size={14} className="text-primary-container" />
              Latest Ingestions
            </h2>
            <Filter size={18} className="text-outline cursor-pointer hover:text-on-surface transition-colors" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
            {entries.map((entry, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 relative">
                    <img 
                      src={entry.img} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-primary-container/20 mix-blend-overlay" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-tighter text-on-surface group-hover:text-primary-container transition-colors">{entry.name}</span>
                    <span className="text-[10px] text-outline font-label-caps uppercase tracking-widest">{entry.sector}</span>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-label-caps tracking-widest uppercase border ${entry.color} bg-white/10`}>
                  {entry.status}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 mt-auto">
            <button className="w-full py-4 rounded-xl border border-white/10 font-label-caps text-[10px] text-outline tracking-widest uppercase hover:bg-white/5 hover:text-on-surface transition-all">
              View All Observations
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
