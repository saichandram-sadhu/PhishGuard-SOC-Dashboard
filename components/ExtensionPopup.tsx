import React, { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { analyzeUrlWithGemini } from '../services/geminiService';
import { ScanResult, Verdict } from '../types';

interface ExtensionPopupProps {
  onClose: () => void;
}

const ExtensionPopup: React.FC<ExtensionPopupProps> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Add small artificial delay to simulate network request if Gemini is too fast, for UX
    const start = Date.now();
    const res = await analyzeUrlWithGemini(url);
    const end = Date.now();
    
    if (end - start < 800) {
      await new Promise(r => setTimeout(r, 800 - (end - start)));
    }
    
    setResult(res);
    setLoading(false);
  };

  const getThemeColor = (v: Verdict) => {
    switch (v) {
      case Verdict.SAFE: return 'text-green-400';
      case Verdict.SUSPICIOUS: return 'text-yellow-400';
      case Verdict.PHISHING: return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getBgColor = (v: Verdict) => {
    switch (v) {
      case Verdict.SAFE: return 'bg-green-500/10 border-green-500/20';
      case Verdict.SUSPICIOUS: return 'bg-yellow-500/10 border-yellow-500/20';
      case Verdict.PHISHING: return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="fixed top-20 right-4 w-80 bg-[#0f172a] border border-slate-700 shadow-2xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col font-sans">
      
      {/* Extension Header */}
      <div className="bg-[#020617] p-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
           <div className="relative">
             <Shield className="w-5 h-5 text-cyan-400" />
             <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-20"></div>
           </div>
           <span className="font-bold text-white text-sm tracking-wide">PhishGuard <span className="text-cyan-500 font-normal">Lite</span></span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 relative min-h-[240px]">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

        {!result ? (
          <form onSubmit={handleScan} className="relative z-10 flex flex-col h-full justify-between">
             <div className="space-y-4">
               <div className="text-center mb-6">
                 <h3 className="text-white font-medium mb-1">Quick Scan</h3>
                 <p className="text-xs text-slate-400">Enter a URL to verify its safety instantly.</p>
               </div>
               
               <div className="relative">
                 <input 
                   type="text" 
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-3 pr-8 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none placeholder-slate-600"
                   placeholder="https://example.com"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   autoFocus
                 />
                 {url && (
                   <button 
                     type="button" 
                     onClick={() => setUrl('')} 
                     className="absolute right-2 top-2.5 text-slate-500 hover:text-white"
                   >
                     <X className="w-4 h-4"/>
                   </button>
                 )}
               </div>
             </div>

             <button 
               type="submit" 
               disabled={loading || !url}
               className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Analyze URL'}
             </button>
          </form>
        ) : (
          <div className="relative z-10 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
             <div className="text-center flex-1">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 ${getBgColor(result.verdict)}`}>
                   {result.verdict === Verdict.SAFE ? <CheckCircle className={`w-8 h-8 ${getThemeColor(result.verdict)}`}/> : 
                    result.verdict === Verdict.PHISHING ? <AlertTriangle className={`w-8 h-8 ${getThemeColor(result.verdict)}`}/> :
                    <AlertTriangle className={`w-8 h-8 ${getThemeColor(result.verdict)}`}/>}
                </div>
                
                <h3 className={`text-xl font-bold mb-1 ${getThemeColor(result.verdict)}`}>
                  {result.verdict.toUpperCase()}
                </h3>
                
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Confidence</span>
                  <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${result.verdict === Verdict.SAFE ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${result.confidenceScore}%` }}></div>
                  </div>
                  <span className="text-xs text-white font-mono">{result.confidenceScore}%</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3 mt-3">
                  {result.explanation.length > 90 ? result.explanation.substring(0, 90) + '...' : result.explanation}
                </p>
             </div>
             
             <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setResult(null)} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3"/> New Scan
                </button>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${result.verdict === Verdict.PHISHING ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
                  onClick={(e) => result.verdict === Verdict.PHISHING && e.preventDefault()}
                >
                  Visit Site <ExternalLink className="w-3 h-3"/>
                </a>
             </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-[#020617] p-2 border-t border-slate-800 text-[10px] text-center text-slate-500 flex justify-between px-4">
        <span>v1.0.4</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online</span>
      </div>
    </div>
  );
};

export default ExtensionPopup;
