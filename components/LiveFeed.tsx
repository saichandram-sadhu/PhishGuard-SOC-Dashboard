import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Server, Globe } from 'lucide-react';

const THREAT_TYPES = ['Credential Harvesting', 'Malware Distribution', 'C2 Callback', 'SQL Injection', 'XSS Attack', 'Brute Force'];
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East'];
const TARGETS = ['Finance Sector', 'Healthcare', 'Government', 'Retail', 'Tech Infrastructure'];

interface Threat {
  id: string;
  timestamp: Date;
  type: string;
  region: string;
  target: string;
  severity: 'High' | 'Critical' | 'Medium';
}

const LiveFeed: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    // Initial population
    const initialThreats = Array.from({ length: 12 }).map(() => generateThreat());
    setThreats(initialThreats);

    const interval = setInterval(() => {
      setThreats(prev => [generateThreat(), ...prev].slice(0, 20));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const generateThreat = (): Threat => {
    const types = THREAT_TYPES;
    const severity = Math.random() > 0.7 ? 'Critical' : Math.random() > 0.4 ? 'High' : 'Medium';
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type: types[Math.floor(Math.random() * types.length)],
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      target: TARGETS[Math.floor(Math.random() * TARGETS.length)],
      severity
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <Globe className="w-6 h-6 text-cyan-400 animate-pulse" />
             Global Threat Feed
           </h2>
           <p className="text-slate-400 text-sm mt-1">Real-time telemetry from global sensors</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="text-red-400 text-xs font-mono font-bold">LIVE STREAM</span>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-mono">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Threat Type</th>
                <th className="p-4">Region</th>
                <th className="p-4">Target Sector</th>
                <th className="p-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {threats.map((threat, index) => (
                <tr key={threat.id} className={`hover:bg-slate-800/30 transition-colors group ${index === 0 ? 'animate-pulse bg-red-500/5' : ''}`}>
                  <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                    {threat.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="p-4 text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    {threat.type}
                  </td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {threat.region}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Server className="w-3 h-3" /> {threat.target}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                      ${threat.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                        threat.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' : 
                        'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'}`}>
                      {threat.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;