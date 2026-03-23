import React, { useState, useRef, useEffect } from 'react';
import { Globe, Lock, FileCode, Server, Database, Wifi, ExternalLink, Play, X, Terminal as TerminalIcon, Loader2, Info } from 'lucide-react';
import { runSecurityToolAnalysis } from '../services/geminiService';

const AnalysisTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [target, setTarget] = useState('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const tools = [
    { name: "WHOIS Lookup", description: "Retrieve domain registration details, registrar info, and ownership history.", icon: <Globe className="w-6 h-6 text-cyan-400" /> },
    { name: "DNS Propagation", description: "Check real-time DNS records (A, MX, NS, CNAME) via Google DNS.", icon: <Server className="w-6 h-6 text-purple-400" /> },
    { name: "SSL Decoder", description: "Analyze SSL/TLS certificates for validity, issuer reputation, and encryption strength.", icon: <Lock className="w-6 h-6 text-green-400" /> },
    { name: "Header Analyzer", description: "Inspect HTTP headers for security configurations like CSP, HSTS, and X-Frame-Options.", icon: <FileCode className="w-6 h-6 text-yellow-400" /> },
    { name: "Reverse IP", description: "Find domains hosted on the same IP to detect shared hosting risks.", icon: <Database className="w-6 h-6 text-red-400" /> },
    { name: "Port Scanner", description: "Identify common exposed ports (80, 443, 21, 22) using threat intelligence.", icon: <Wifi className="w-6 h-6 text-blue-400" /> },
  ];

  const handleToolClick = (tool: any) => {
    setSelectedTool(tool);
    setTarget('');
    setOutput('');
  };

  const executeTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setIsLoading(true);
    setOutput(`[+] Initializing ${selectedTool.name}...\n[+] Target: ${target}\n[+] connecting to remote sensors...\n`);
    
    try {
      const result = await runSecurityToolAnalysis(selectedTool.name, target);
      setOutput(prev => prev + `\n${result}`);
    } catch (error) {
      setOutput(prev => prev + `\n[!] Error: Analysis Failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Overlay Modal for Tool Execution */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#0b1221] border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">{selectedTool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTool.name}</h3>
                  <p className="text-xs text-slate-400">Live Security Analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTool(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
              
              {/* Tool Description Banner */}
              <div className="bg-cyan-900/10 border border-cyan-900/30 rounded-lg p-3 flex gap-3 items-start">
                 <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                 <p className="text-sm text-cyan-200/80 leading-relaxed">{selectedTool.description}</p>
              </div>

              {/* Input Form */}
              <form onSubmit={executeTool} className="flex gap-4">
                <div className="relative flex-1">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <TerminalIcon className="w-4 h-4 text-slate-500" />
                   </div>
                   <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter domain or IP (e.g., google.com)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm"
                    autoFocus
                   />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading || !target}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isLoading ? 'Running' : 'Run'}
                </button>
              </form>

              {/* Terminal Output */}
              <div 
                ref={terminalRef}
                className="flex-1 bg-black rounded-lg border border-slate-800 p-4 overflow-y-auto font-mono text-sm min-h-[300px]"
              >
                {!output && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                    <TerminalIcon className="w-8 h-8 opacity-50" />
                    <p>Ready for input...</p>
                  </div>
                )}
                {output && (
                  <pre className="whitespace-pre-wrap text-green-400 leading-relaxed">
                    {output}
                    {isLoading && <span className="animate-pulse">_</span>}
                  </pre>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Security Analysis Tools</h2>
        <p className="text-slate-400">Additional utilities for deep-dive investigation and infrastructure analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div 
            key={idx} 
            onClick={() => handleToolClick(tool)}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <ExternalLink className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-900/50 flex items-center justify-center mb-4 border border-slate-800 group-hover:bg-slate-800 transition-colors">
              {tool.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">{tool.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{tool.description}</p>
            <div className="flex items-center text-xs font-mono text-cyan-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
              Launch Tool &rarr;
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
        <p className="text-slate-500 text-sm">More advanced forensic tools are available in the Enterprise edition. <br/> <span className="text-cyan-500/60 hover:text-cyan-500 cursor-pointer transition-colors">Contact Sales for access.</span></p>
      </div>
    </div>
  );
};

export default AnalysisTools;