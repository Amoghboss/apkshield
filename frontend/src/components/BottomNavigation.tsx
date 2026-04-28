import React from 'react';
import { Command, ScanLine, Network, Lock } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { icon: Command, label: 'COMMAND', id: 'command' },
    { icon: ScanLine, label: 'SCANS', id: 'scans' },
    { icon: Network, label: 'NETWORK', id: 'network' },
    { icon: Lock, label: 'VAULT', id: 'vault' }
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-8 px-8 py-4 rounded-2xl"
        style={{ 
          background: 'rgba(13,21,38,0.8)', 
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)'
        }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
              style={{ 
                background: isActive ? 'rgba(0,245,212,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(0,245,212,0.25)' : '1px solid transparent'
              }}>
              <item.icon className="w-6 h-6" style={{ color: isActive ? '#00f5d4' : '#64748b' }} />
              <span className="text-xs font-bold tracking-wider" 
                style={{ color: isActive ? '#00f5d4' : '#64748b' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}