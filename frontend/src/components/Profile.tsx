import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Save, Image as ImageIcon, Camera } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('Sentinel-7');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop');
  const [bio, setBio] = useState('Neural integrity specialist focusing on deep-space anomaly detection.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 px-6"
    >
      <div className="flex items-center gap-6 mb-12">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container/20 group-hover:border-primary-container transition-colors">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary-container text-on-primary-container rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-1">{name}</h1>
          <p className="font-label-caps text-[10px] text-outline tracking-widest uppercase">Member since 2144</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8 border border-white/10 refracting-border-gradient">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-primary-fixed-dim uppercase tracking-widest">Personal Identification</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-outline uppercase tracking-widest ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary-container outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-outline uppercase tracking-widest ml-1">Avatar Link</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input 
                  type="text" 
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary-container outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-outline uppercase tracking-widest ml-1">Directive / Bio</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary-container outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-3 rounded-xl font-bold tracking-tight hover:shadow-[0_0_20px_rgba(0,163,255,0.4)] transition-all active:scale-95"
            >
              <Save size={18} />
              {saved ? 'ID SAVED' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
