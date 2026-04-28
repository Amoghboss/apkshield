import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Command,
  ScanLine,
  Network,
  Lock
} from 'lucide-react';
import BottomNavigation from './BottomNavigation';

// Live telemetry data simulation
const useLiveTelemetry = () => {
  const [data, setData] = useState({
    reactorCore: 4620,
    hullIntegrity: 100,
    oxygenLevels: 98.2,
    shieldLevel: 75,
    threatLevel: 0.002,
    activeConnections: 1204,
    trafficVolume: 14.8,
    networkLatency: 12,
    neuralHealth: 7,
    systemStatus: 'OPTIMAL',
    coordinates: 'X-772 Y-982'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        reactorCore: prev.reactorCore + (Math.random() - 0.5) * 50,
        hullIntegrity: Math.max(95, Math.min(100, prev.hullIntegrity + (Math.random() - 0.5) * 2)),
        oxygenLevels: Math.max(95, Math.min(100, prev.oxygenLevels + (Math.random() - 0.5) * 1)),
        shieldLevel: Math.max(70, Math.min(80, prev.shieldLevel + (Math.random() - 0.5) * 3)),
        threatLevel: Math.max(0, Math.min(0.01, prev.threatLevel + (Math.random() - 0.5) * 0.002)),
        activeConnections: prev.activeConnections + Math.floor((Math.random() - 0.5) * 20),
        trafficVolume: Math.max(10, Math.min(20, prev.trafficVolume + (Math.random() - 0.5) * 2)),
        networkLatency: Math.max(8, Math.min(20, prev.networkLatency + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

// System logs simulation
const useSystemLogs = () => {
  const [logs, setLogs] = useState([
    { time: '04:12:01', message: 'Initializing deep scan...', type: 'info' },
    { time: '04:12:01', message: 'Syncing orbital vectors', type: 'info' },
    { time: '04:12:01', message: 'Neural link established', type: 'success' },
    { time: '04:12:01', message: 'Warning: gravity fluctuation', type: 'warning' },
    { time: '04:12:01', message: 'Communication active', type: 'info' }
  ]);

  useEffect(() => {
    const messages = [
      'Quantum encryption verified',
      'Threat assessment complete',
      'Network optimization active',
      'Security protocols updated',
      'Data synchronization in progress',
      'System diagnostics running',
      'Firewall rules updated',
      'Backup systems online'
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const message = messages[Math.floor(Math.random() * messages.length)];
      const type = Math.random() > 0.8 ? 'warning' : Math.random() > 0.9 ? 'error' : 'info';
      
      setLogs(prev => [
        { time: timeStr, message, type },
        ...prev.slice(0, 4)
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return logs;
};

// Metric Card Component
const MetricCard = ({ label, value, unit, color, icon: Icon, trend }: {
  label: string;
  value: number | string;
  unit?: string;
  color: string;
  icon: any;
  trend?: 'up' | 'down' | 'stable';
}) => (
  <div className="rounded-2xl p-6 relative overflow-hidden"
    style={{ 
      background: 'rgba(13,21,38,0.6)', 
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)'
    }}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-500">
                {trend === 'up' ? 'STABLE' : trend === 'down' ? 'DECLINING' : 'OPTIMAL'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-white">{value}</span>
      {unit && <span className="text-sm text-slate-400 font-mono">{unit}</span>}
    </div>
    
    {/* Glow effect */}
    <div className="absolute bottom-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
  </div>
);

// Central AI Core Component
const CentralCore = ({ data }: { data: any }) => (
  <div className="relative flex items-center justify-center h-80">
    {/* Outer rings */}
    <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '20s' }} />
    <div className="absolute inset-4 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
    <div className="absolute inset-8 rounded-full border border-cyan-500/40 animate-spin" style={{ animationDuration: '10s' }} />
    
    {/* Central core */}
    <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center"
      style={{ 
        background: 'radial-gradient(circle, rgba(0,245,212,0.2) 0%, rgba(0,163,255,0.1) 100%)',
        border: '2px solid rgba(0,245,212,0.5)',
        boxShadow: '0 0 40px rgba(0,245,212,0.3)'
      }}>
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-cyan-400 tracking-wider">AEGIS AI</p>
      </div>
    </div>
    
    {/* Coordinate display */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="px-4 py-2 rounded-lg text-xs font-mono text-cyan-400"
        style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.3)' }}>
        COORD: {data.coordinates}
      </div>
    </div>
    
    {/* Threat level indicator */}
    <div className="absolute top-4 right-4">
      <div className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ 
          background: data.threatLevel > 0.005 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
          border: `1px solid ${data.threatLevel > 0.005 ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}`,
          color: data.threatLevel > 0.005 ? '#fca5a5' : '#6ee7b7'
        }}>
        THREAT: {(data.threatLevel * 100).toFixed(3)}%
      </div>
    </div>
  </div>
);

// System Logs Component
const SystemLogs = ({ logs }: { logs: any[] }) => (
  <div className="rounded-2xl p-6"
    style={{ 
      background: 'rgba(13,21,38,0.6)', 
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)'
    }}>
    <div className="flex items-center gap-2 mb-4">
      <Activity className="w-5 h-5 text-cyan-400" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">System Logs</h3>
      <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
    </div>
    
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-3 text-xs font-mono">
          <span className="text-slate-500 shrink-0">[{log.time}]</span>
          <span className={`${
            log.type === 'error' ? 'text-red-400' :
            log.type === 'warning' ? 'text-yellow-400' :
            log.type === 'success' ? 'text-green-400' :
            'text-slate-300'
          }`}>
            {log.message}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Orbital Mapping Component
const OrbitalMapping = () => (
  <div className="rounded-2xl p-6"
    style={{ 
      background: 'rgba(13,21,38,0.6)', 
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)'
    }}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Orbital Mapping</h3>
      </div>
      <div className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
        LIVE FEED
      </div>
    </div>
    
    <div className="relative h-48 rounded-xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,50,100,0.3) 100%)' }}>
      {/* Simulated satellite view */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0,245,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
      </div>
      
      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs">
        <div className="text-cyan-400 font-mono">
          <div>42.88N</div>
          <div className="text-slate-400">LAT</div>
        </div>
        <div className="text-cyan-400 font-mono">
          <div>12.01E</div>
          <div className="text-slate-400">LON</div>
        </div>
        <div className="text-cyan-400 font-mono">
          <div>1,240km</div>
          <div className="text-slate-400">ALT</div>
        </div>
      </div>
    </div>
  </div>
);

// Active Network Component
const ActiveNetwork = ({ data }: { data: any }) => (
  <div className="rounded-2xl p-6"
    style={{ 
      background: 'rgba(13,21,38,0.6)', 
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)'
    }}>
    <div className="flex items-center gap-2 mb-6">
      <Wifi className="w-5 h-5 text-cyan-400" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Active Network</h3>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-slate-300">RELAY ALPHA</span>
        </div>
        <span className="text-xs font-mono text-green-400">STABLE</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-sm text-slate-300">NEURAL LINK</span>
        </div>
        <span className="text-xs font-mono text-yellow-400">LINKED</span>
      </div>
      
      {/* Progress bar for neural link */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400">NEURAL LINK STRENGTH</span>
          <span className="text-cyan-400">{data.neuralHealth}ms</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-1000"
            style={{ width: `${(data.neuralHealth / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default function CommandCenter({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const telemetry = useLiveTelemetry();
  const logs = useSystemLogs();

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Command Center</h1>
              <p className="text-slate-400">Real-time system monitoring and threat analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ 
                  background: telemetry.systemStatus === 'OPTIMAL' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  border: `1px solid ${telemetry.systemStatus === 'OPTIMAL' ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}`,
                  color: telemetry.systemStatus === 'OPTIMAL' ? '#6ee7b7' : '#fca5a5'
                }}>
                STATUS: {telemetry.systemStatus}
              </div>
              <div className="px-4 py-2 rounded-xl text-sm font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                40MS / 1.20GPS
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Metrics */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Live Telemetry</h2>
              <div className="space-y-4">
                <MetricCard
                  label="Reactor Core"
                  value={telemetry.reactorCore.toFixed(0)}
                  unit="GW"
                  color="#00f5d4"
                  icon={Zap}
                  trend="stable"
                />
                <MetricCard
                  label="Hull Integrity"
                  value={telemetry.hullIntegrity.toFixed(0)}
                  unit="%"
                  color="#10b981"
                  icon={Shield}
                  trend="up"
                />
                <MetricCard
                  label="Oxygen Levels"
                  value={telemetry.oxygenLevels.toFixed(1)}
                  unit="%"
                  color="#3b82f6"
                  icon={Activity}
                  trend="stable"
                />
                <MetricCard
                  label="Shield Level"
                  value={telemetry.shieldLevel.toFixed(0)}
                  unit="%"
                  color="#f59e0b"
                  icon={Shield}
                  trend="stable"
                />
              </div>
            </div>
            
            <SystemLogs logs={logs} />
          </div>

          {/* Center Column - AI Core */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6"
              style={{ 
                background: 'rgba(13,21,38,0.6)', 
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)'
              }}>
              <CentralCore data={telemetry} />
            </div>
            
            <ActiveNetwork data={telemetry} />
          </div>

          {/* Right Column - Network & Mapping */}
          <div className="space-y-6">
            <OrbitalMapping />
            
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Network Status</h2>
              <div className="space-y-4">
                <MetricCard
                  label="Network Latency"
                  value={telemetry.networkLatency.toFixed(0)}
                  unit="ms"
                  color="#06b6d4"
                  icon={Wifi}
                  trend="stable"
                />
                <MetricCard
                  label="Traffic Volume"
                  value={telemetry.trafficVolume.toFixed(1)}
                  unit="TB/s"
                  color="#8b5cf6"
                  icon={Server}
                  trend="up"
                />
                <MetricCard
                  label="Active Connections"
                  value={telemetry.activeConnections.toLocaleString()}
                  color="#f97316"
                  icon={Globe}
                  trend="stable"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="command" onNavigate={onNavigate || (() => {})} />
      </div>
    </div>
  );
}