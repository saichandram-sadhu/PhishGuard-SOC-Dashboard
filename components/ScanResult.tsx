import React from 'react';
import { ScanResult, Verdict } from '../types';
import RiskMeter from './RiskMeter';
import { AlertTriangle, ShieldCheck, ShieldAlert, Copy, Download, Activity, Globe, Lock, Search } from 'lucide-react';

interface ScanResultProps {
  result: ScanResult;
}

const ScanResultCard: React.FC<ScanResultProps> = ({ result }) => {
  const getVerdictColor = (v: Verdict) => {
    switch (v) {
      case Verdict.SAFE: return 'text-green-400 border-green-500/30 bg-green-500/5';
      case Verdict.SUSPICIOUS: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
      case Verdict.PHISHING: return 'text-red-500 border-red-500/30 bg-red-500/5';
    }
  };

  const getVerdictIcon = (v: Verdict) => {
    switch (v) {
      case Verdict.SAFE: return <ShieldCheck className="w-8 h-8 text-green-400" />;
      case Verdict.SUSPICIOUS: return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case Verdict.PHISHING: return <ShieldAlert className="w-8 h-8 text-red-500" />;
    }
  };

  const getLayerIcon = (name: string) => {
    if (name.includes('Structure')) return <Activity className="w-4 h-4" />;
    if (name.includes('Domain')) return <Globe className="w-4 h-4" />;
    if (name.includes('SSL')) return <Lock className="w-4 h-4" />;
    return <Search className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Verdict & Meter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Verdict Card */}
        <div className={`md:col-span-2 glass-panel rounded-xl p-6 border ${getVerdictColor(result.verdict)} relative overflow-hidden`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getVerdictIcon(result.verdict)}
                <h2 className="text-3xl font-bold tracking-tight text-white">{result.verdict}</h2>
              </div>
              <p className="text-slate-400 text-sm font-mono mt-1 break-all">{result.url}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white" title="Copy Report">
                <Copy className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white" title="Download PDF">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">SOC Analysis</h3>
            <p className="text-slate-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Recommendation</h3>
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${result.verdict === Verdict.SAFE ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-white">{result.recommendation}</span>
            </div>
          </div>
        </div>

        {/* Risk Meter */}
        <RiskMeter score={result.confidenceScore} level={result.riskLevel} />
      </div>

      {/* Red Flags Section */}
      {result.redFlags.length > 0 && (
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-red-500">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Detected Threats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.redFlags.map((flag, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detection Layers Timeline */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Detection Layers
        </h3>
        <div className="space-y-4">
          {result.layers.map((layer, idx) => (
            <div key={idx} className="relative pl-8 border-l border-slate-800 last:border-0 pb-4 last:pb-0">
              <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 
                ${layer.status === 'clean' ? 'bg-green-500' : layer.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} 
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-medium text-slate-200 flex items-center gap-2">
                   {getLayerIcon(layer.name)} {layer.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded border uppercase font-mono tracking-wider
                  ${layer.status === 'clean' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                    layer.status === 'warning' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 
                    'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                  {layer.status === 'clean' ? 'Passed' : layer.status === 'warning' ? 'Warning' : 'Failed'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{layer.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ScanResultCard;
