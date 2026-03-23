import React, { useState, useEffect } from 'react';
import { Search, Shield, Menu, X, Terminal, Code2, Puzzle } from 'lucide-react';
import { analyzeUrlWithGemini } from './services/geminiService';
import { ScanResult, HistoryItem } from './types';
import ScanResultCard from './components/ScanResult';
import HistoryLog from './components/HistoryLog';
import LiveFeed from './components/LiveFeed';
import AnalysisTools from './components/AnalysisTools';
import ApiAccess from './components/ApiAccess';
import ExtensionPopup from './components/ExtensionPopup';

type View = 'dashboard' | 'live-feed' | 'tools' | 'api-access';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<View>('dashboard');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExtension, setShowExtension] = useState(false);

  // Simulate scanning phases for UX
  useEffect(() => {
    let interval: number;
    if (isScanning) {
      setScanProgress(0);
      interval = window.setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) return prev; // Hold at 90 until done
          return prev + Math.random() * 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScan = async (e?: React.FormEvent, manualUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = manualUrl || url;
    if (!targetUrl) return;

    setIsScanning(true);
    setCurrentResult(null);

    // Call Gemini API
    const result = await analyzeUrlWithGemini(targetUrl);

    setScanProgress(100);
    setTimeout(() => {
      setIsScanning(false);
      setCurrentResult(result);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        url: result.url,
        verdict: result.verdict,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10
    }, 600); // Small delay to show 100% completion
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text) {
      e.preventDefault();
      setUrl(text);
      handleScan(undefined, text);
    }
  };

  const loadFromHistory = (historyUrl: string) => {
    setUrl(historyUrl);
    setActiveTab('dashboard'); // Switch back to dashboard if clicked
  };

  const handleNavClick = (view: View) => {
    setActiveTab(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setActiveTab('dashboard'); setCurrentResult(null); setUrl(''); }}>
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 bg-cyan-400 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">PhishGuard</h1>
              <span className="text-[10px] text-cyan-500 uppercase tracking-widest font-semibold block -mt-1">Intel Dashboard</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`${activeTab === 'dashboard' ? 'text-cyan-400' : 'hover:text-cyan-400'} transition-colors`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('live-feed')} 
              className={`${activeTab === 'live-feed' ? 'text-cyan-400' : 'hover:text-cyan-400'} transition-colors`}
            >
              Live Feed
            </button>
            <button 
              onClick={() => setActiveTab('tools')} 
              className={`${activeTab === 'tools' ? 'text-cyan-400' : 'hover:text-cyan-400'} transition-colors`}
            >
              Analysis Tools
            </button>
            <button 
              onClick={() => setActiveTab('api-access')} 
              className={`hover:text-cyan-400 transition-colors ${activeTab === 'api-access' ? 'text-cyan-400' : ''}`}
            >
              API Access
            </button>
            
            <div className="h-4 w-px bg-slate-800 mx-2"></div>

            <button
              onClick={() => setShowExtension(!showExtension)}
              className={`p-2 rounded-lg transition-colors relative group ${showExtension ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Browser Extension Simulator"
            >
              <Puzzle className="w-5 h-5" />
              {!showExtension && <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border border-[#020617]"></span>}
            </button>
          </nav>

          <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Extension Simulator Popup */}
      {showExtension && (
        <ExtensionPopup onClose={() => setShowExtension(false)} />
      )}

      {/* Main Layout */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* View: Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* Center Content */}
            <div className="flex-1 min-w-0">
              
              {/* Hero / Input Section */}
              <div className={`transition-all duration-700 ${currentResult ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center'}`}>
                
                {!currentResult && (
                  <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-mono text-cyan-400 mb-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      System Online. Threat Database Updated.
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                      Advanced Phishing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Detection</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                      Analyze suspicious URLs using multi-layer intelligence and AI-driven behavioral heuristics.
                    </p>
                  </div>
                )}

                <div className="w-full max-w-2xl mx-auto relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                   <form onSubmit={(e) => handleScan(e)} className="relative bg-[#0b1221] rounded-xl flex items-center p-2 shadow-2xl border border-slate-800 overflow-hidden">
                      {isScanning && <div className="scan-line top-0 left-0 z-20 pointer-events-none"></div>}
                      <div className="pl-4 pr-3 text-slate-500 relative z-30">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onPaste={handlePaste}
                        placeholder="Paste suspicious URL here (e.g., http://login-secure-update.com)..."
                        className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 focus:outline-none h-12 font-mono text-sm md:text-base relative z-30"
                        required
                      />
                      <button 
                        type="submit"
                        disabled={isScanning || !url}
                        className="bg-slate-100 hover:bg-white text-slate-900 px-6 h-10 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative z-30"
                      >
                        {isScanning ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scanning
                          </>
                        ) : (
                          'Scan URL'
                        )}
                      </button>
                   </form>

                   {/* Scanning Progress Bar */}
                   {isScanning && (
                     <div className="absolute -bottom-6 left-0 right-0">
                        <div className="flex justify-between text-xs text-cyan-400 font-mono mb-1">
                          <span>ANALYZING LAYERS...</span>
                          <span>{Math.round(scanProgress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-200 ease-out"
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                     </div>
                   )}
                </div>
                
                {!currentResult && !isScanning && (
                   <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
                      {['Structure Analysis', 'Domain Intelligence', 'SSL Verification', 'AI Classification'].map((item, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
                           <div className="text-cyan-500/50 mb-2 flex justify-center"><Terminal className="w-5 h-5" /></div>
                           <div className="text-xs font-medium text-slate-400">{item}</div>
                        </div>
                      ))}
                   </div>
                )}
              </div>

              {/* Results Area */}
              {currentResult && !isScanning && (
                <ScanResultCard result={currentResult} />
              )}
            </div>

            {/* Sidebar (History & Tips) - Only on Dashboard */}
            <div className="hidden lg:block">
              <HistoryLog history={history} onSelect={loadFromHistory} />
            </div>
          </>
        )}

        {/* View: Live Feed */}
        {activeTab === 'live-feed' && <LiveFeed />}

        {/* View: Tools */}
        {activeTab === 'tools' && <AnalysisTools />}

        {/* View: API Access */}
        {activeTab === 'api-access' && <ApiAccess />}

        {/* Mobile History Drawer (Only visible if needed) */}
        {mobileMenuOpen && (
           <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#020617] border-b border-slate-800 p-4 z-40">
              <nav className="flex flex-col gap-4 mb-6">
                <button onClick={() => handleNavClick('dashboard')} className="text-left text-slate-400 hover:text-white">Dashboard</button>
                <button onClick={() => handleNavClick('live-feed')} className="text-left text-slate-400 hover:text-white">Live Feed</button>
                <button onClick={() => handleNavClick('tools')} className="text-left text-slate-400 hover:text-white">Analysis Tools</button>
                <button onClick={() => handleNavClick('api-access')} className="text-left text-cyan-400 hover:text-cyan-300">API Access</button>
              </nav>
              {activeTab === 'dashboard' && <HistoryLog history={history} onSelect={(u) => { loadFromHistory(u); setMobileMenuOpen(false); }} />}
           </div>
        )}

      </main>
      
      <footer className="border-t border-slate-800/50 mt-auto py-8 bg-[#01040f] relative overflow-hidden">
        {/* Ambient glow for the footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 relative z-10">
          
          <div className="text-center space-y-2">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.25em] bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 bg-clip-text text-transparent animate-pulse">
              Trust No One. Verify Everything.
            </p>
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} PhishGuard Intelligence. Authorized Personnel Only.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/40 px-4 py-2 rounded-full border border-slate-800 hover:border-cyan-500/30 transition-colors backdrop-blur-sm group">
             <Code2 className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
             <span>Developed by</span>
             <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:brightness-125 transition-all cursor-default">
               Saichandram
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;