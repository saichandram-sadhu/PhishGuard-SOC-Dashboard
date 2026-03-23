import React, { useState } from 'react';
import { Key, Copy, RefreshCw, Terminal, Check, Code, Activity, Server, Shield, ExternalLink } from 'lucide-react';

const ApiAccess: React.FC = () => {
  const [apiKey, setApiKey] = useState('pg_live_8x92m...k92l');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'python'>('curl');

  const fullKey = 'pg_live_8x92mn49283748291029384756sk92l';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = () => {
    // Simulating key regeneration
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let newKey = 'pg_live_';
    for (let i = 0; i < 24; i++) newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    setApiKey(newKey.substring(0, 10) + '...' + newKey.substring(newKey.length - 4));
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.phishguard.io/v1/scan \\
  -H "Authorization: Bearer ${fullKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "http://suspicious-login.com"
  }'`,
    node: `const axios = require('axios');

const scanUrl = async (url) => {
  const response = await axios.post('https://api.phishguard.io/v1/scan', {
    url: url
  }, {
    headers: { 'Authorization': 'Bearer ${fullKey}' }
  });
  
  console.log(response.data);
};

scanUrl('http://suspicious-login.com');`,
    python: `import requests

url = "https://api.phishguard.io/v1/scan"
payload = {"url": "http://suspicious-login.com"}
headers = {
    "Authorization": "Bearer ${fullKey}",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-cyan-400" />
            Developer API
          </h2>
          <p className="text-slate-400 mt-1">Integrate threat intelligence directly into your security stack.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-mono font-bold">SYSTEM OPERATIONAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: API Key & Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* API Key Card */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              API Credentials
            </h3>
            
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center justify-between mb-4">
              <code className="text-slate-300 font-mono text-sm truncate">
                {showKey ? fullKey : apiKey}
              </code>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-slate-500 hover:text-cyan-400 ml-2"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Key'}
              </button>
              <button 
                onClick={regenerateKey}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition-colors"
                title="Regenerate Key"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Usage Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Requests (This Month)</span>
                  <span>8,432 / 10,000</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[84%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-mono font-bold text-white">42ms</div>
                  <div className="text-[10px] text-slate-500 uppercase">Avg Latency</div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-mono font-bold text-green-400">99.9%</div>
                  <div className="text-[10px] text-slate-500 uppercase">Uptime</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Documentation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full">
            
            {/* Code Header */}
            <div className="bg-slate-900/80 border-b border-slate-800 p-2 flex items-center gap-2">
               <div className="flex gap-1.5 px-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <div className="flex-1 flex justify-center">
                 <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                   {['curl', 'node', 'python'].map((lang) => (
                     <button
                       key={lang}
                       onClick={() => setActiveLang(lang as any)}
                       className={`px-4 py-1 rounded-md text-xs font-medium transition-all ${activeLang === lang ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       {lang === 'node' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="w-16"></div>
            </div>

            {/* Code Body */}
            <div className="bg-[#0b1221] p-6 flex-1 overflow-x-auto">
              <pre className="font-mono text-sm text-slate-300">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>
            
            <div className="bg-slate-900/50 p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
               <span>Base URL: https://api.phishguard.io/v1</span>
               <a href="#" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                 Full Documentation <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </div>
        </div>

      </div>
      
      {/* Endpoints Quick Ref */}
      <div className="glass-panel p-6 rounded-xl border border-slate-800">
        <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-400" />
          Available Endpoints
        </h3>
        <div className="grid gap-4">
           {[
             { method: 'POST', path: '/v1/scan', desc: 'Deep scan a URL for phishing indicators' },
             { method: 'GET', path: '/v1/reputation', desc: 'Check domain reputation score' },
             { method: 'POST', path: '/v1/dns/resolve', desc: 'Perform advanced DNS lookup' },
           ].map((ep, i) => (
             <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
               <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono border border-cyan-500/20 w-16 text-center">{ep.method}</span>
               <code className="text-slate-300 text-sm font-mono flex-1">{ep.path}</code>
               <span className="text-slate-500 text-sm hidden sm:block">{ep.desc}</span>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default ApiAccess;