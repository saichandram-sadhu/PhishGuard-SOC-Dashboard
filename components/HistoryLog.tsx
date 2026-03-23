import React from 'react';
import { HistoryItem, Verdict } from '../types';
import { Clock, ExternalLink } from 'lucide-react';

interface HistoryLogProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-4 animate-in fade-in slide-in-from-right duration-700">
      <div className="glass-panel rounded-xl p-5 border-l-4 border-l-cyan-500/50">
        <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Recent Scans
        </h3>
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelect(item.url)}
              className="group p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all hover:bg-slate-800/60"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded
                  ${item.verdict === Verdict.SAFE ? 'bg-green-500/20 text-green-400' : 
                    item.verdict === Verdict.PHISHING ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {item.verdict}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
              </div>
              <div className="text-xs text-slate-300 font-mono truncate" title={item.url}>
                {item.url}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 text-right">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-panel rounded-xl p-5 border-l-4 border-l-purple-500/50">
        <h3 className="text-slate-200 font-semibold mb-2">SOC Tip of the Day</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Attackers often use "homograph attacks" by replacing Latin characters with Cyrillic look-alikes (e.g., 'a' vs 'а'). Always verify the SSL certificate issuer for sensitive domains.
        </p>
      </div>
    </div>
  );
};

export default HistoryLog;
