import React, { useState } from 'react';
import { Shield, Search, ArrowRight, LayoutDashboard, Terminal, AlertTriangle, RefreshCw, HelpCircle, Play, Sparkles } from 'lucide-react';
import { analyzeMCPServer, generateDeepDiveReport } from './services/geminiService';
import { SecurityReport, TechnicalDeepDiveData } from './types';
import { ScanningOverlay } from './components/ScanningOverlay';
import { Dashboard } from './components/Dashboard';
import { TechnicalDeepDive } from './components/TechnicalDeepDive';

type ErrorType = 'NOT_FOUND' | 'API_ERROR' | 'GENERIC' | null;

const App: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(null);
  
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Deep Dive State
  const [isGeneratingDeepDive, setIsGeneratingDeepDive] = useState(false);
  const [deepDiveData, setDeepDiveData] = useState<TechnicalDeepDiveData | null>(null);
  const [view, setView] = useState<'EXECUTIVE' | 'TECHNICAL'>('EXECUTIVE');

  const runScan = async (scanTarget: string, scanUrl: string) => {
    setIsScanning(true);
    setErrorType(null);
    setReport(null);
    setDeepDiveData(null);
    setView('EXECUTIVE');

    try {
      // Simulate minimum scan time for UX purposes (animations)
      const minScanTime = new Promise(resolve => setTimeout(resolve, 3000));
      const analysisPromise = analyzeMCPServer(scanTarget, scanUrl);
      
      const [analysisResult] = await Promise.all([analysisPromise, minScanTime]);
      
      if (analysisResult.scanStatus === 'NOT_FOUND') {
         setErrorType('NOT_FOUND');
         setSuggestions(analysisResult.suggestedAlternatives || []);
      } else {
         setReport(analysisResult);
      }
    } catch (err: any) {
      if (err.message === 'API_ERROR') {
         setErrorType('API_ERROR');
      } else {
         setErrorType('GENERIC');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!target) return;
    runScan(target, target);
  };

  const handleDemo = () => {
    const demoName = "@modelcontextprotocol/server-filesystem";
    setTarget(demoName);
    runScan(demoName, "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem");
  };

  const handleGenerateDeepDive = async () => {
    if (!report) return;
    
    // If we already have content, just switch views
    if (deepDiveData) {
      setView('TECHNICAL');
      return;
    }

    setIsGeneratingDeepDive(true);
    try {
      const minAnalysisTime = new Promise(resolve => setTimeout(resolve, 6000));
      const deepDivePromise = generateDeepDiveReport(report.targetName, report.targetUrl, report.summary);
      
      const [data] = await Promise.all([deepDivePromise, minAnalysisTime]);
      
      setDeepDiveData(data);
      setView('TECHNICAL');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDeepDive(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setTarget('');
    setErrorType(null);
    setDeepDiveData(null);
    setView('EXECUTIVE');
  };

  const retryScan = () => {
     if (target) {
       runScan(target, target);
     }
  };

  const trySuggestion = (suggestion: string) => {
    setTarget(suggestion);
    // Use timeout to allow state update if needed, but here we run directly
    // Running directly ensures we use the correct string even if state is pending
    runScan(suggestion, suggestion);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${view === 'EXECUTIVE' ? 'bg-slate-900' : 'bg-[#0f172a]'}`}>
      <ScanningOverlay 
        isVisible={isScanning || isGeneratingDeepDive} 
        type={isGeneratingDeepDive ? 'TECHNICAL' : 'EXECUTIVE'}
      />

      {!report && !isScanning && (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 bg-slate-900">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </div>

          <div className="relative z-10 w-full max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
               <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl shadow-blue-900/20">
                   <Shield className="w-16 h-16 text-blue-500" />
               </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
              TrustGate
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
              Enterprise-grade MCP server security vetting. 
              Comprehensive risk analysis, compliance auditing, and ROI projection in seconds.
            </p>

            <form onSubmit={handleScan} className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-slate-800 rounded-lg border border-slate-700 shadow-xl p-1">
                <Search className="w-6 h-6 text-slate-500 ml-4" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Enter MCP Server URL or Name (e.g., filesystem, postgres)"
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!target}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Scan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
               <button 
                  onClick={handleDemo}
                  disabled={isScanning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-slate-400 hover:text-white transition-all text-sm font-medium group backdrop-blur-sm shadow-lg shadow-black/20"
               >
                   <div className="p-1 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                   </div>
                   <span>Try Demo: <span className="font-mono text-blue-400 group-hover:text-blue-300">@modelcontextprotocol/server-filesystem</span></span>
               </button>
            </div>

            {/* Error States */}
            {errorType === 'NOT_FOUND' && (
               <div className="animate-fade-in bg-slate-800/50 border border-orange-500/30 rounded-lg p-6 text-left max-w-lg mx-auto backdrop-blur-sm">
                   <div className="flex items-start gap-4">
                       <div className="p-2 bg-orange-500/10 rounded-lg">
                           <HelpCircle className="w-6 h-6 text-orange-400" />
                       </div>
                       <div>
                           <h3 className="text-lg font-bold text-white mb-2">MCP Server Not Found</h3>
                           <p className="text-slate-400 text-sm mb-4">
                               We couldn't find a public MCP server matching "{target}". Please check the spelling or try one of these popular servers:
                           </p>
                           <div className="flex flex-wrap gap-2">
                               {suggestions.length > 0 ? suggestions.map((s) => (
                                   <button 
                                      key={s} 
                                      onClick={() => trySuggestion(s)}
                                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-400 rounded-full text-xs font-mono border border-slate-600 transition-colors"
                                   >
                                       {s}
                                   </button>
                               )) : (
                                   <>
                                     <button onClick={() => trySuggestion("filesystem")} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-400 rounded-full text-xs font-mono border border-slate-600 transition-colors">filesystem</button>
                                     <button onClick={() => trySuggestion("postgres")} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-400 rounded-full text-xs font-mono border border-slate-600 transition-colors">postgres</button>
                                     <button onClick={() => trySuggestion("github")} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-400 rounded-full text-xs font-mono border border-slate-600 transition-colors">github</button>
                                   </>
                               )}
                           </div>
                       </div>
                   </div>
               </div>
            )}

            {(errorType === 'API_ERROR' || errorType === 'GENERIC') && (
               <div className="animate-fade-in bg-slate-800/50 border border-red-500/30 rounded-lg p-6 text-left max-w-lg mx-auto backdrop-blur-sm">
                   <div className="flex items-start gap-4">
                       <div className="p-2 bg-red-500/10 rounded-lg">
                           <AlertTriangle className="w-6 h-6 text-red-400" />
                       </div>
                       <div>
                           <h3 className="text-lg font-bold text-white mb-2">Analysis Temporarily Unavailable</h3>
                           <p className="text-slate-400 text-sm mb-4">
                               Our security engine encountered an issue while processing your request. This is likely a temporary connection glitch.
                           </p>
                           <button 
                              onClick={retryScan}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors text-sm font-semibold"
                           >
                               <RefreshCw className="w-4 h-4" /> Retry Analysis
                           </button>
                       </div>
                   </div>
               </div>
            )}

            {/* Footer Stats */}
            {!errorType && (
                <div className="grid grid-cols-3 gap-8 text-slate-500 text-sm border-t border-slate-800 pt-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="font-semibold text-slate-300">ISO 27001</span>
                    <span>Compliance Checks</span>
                </div>
                <div className="flex flex-col items-center gap-2 border-l border-slate-800">
                    <span className="font-semibold text-slate-300">CVE Detection</span>
                    <span>Real-time DB</span>
                </div>
                <div className="flex flex-col items-center gap-2 border-l border-slate-800">
                    <span className="font-semibold text-slate-300">ROI Analysis</span>
                    <span>Cost Projection</span>
                </div>
                </div>
            )}
          </div>
        </div>
      )}

      {report && (
        <div className="flex flex-col min-h-screen">
          <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
              <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => setView('EXECUTIVE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'EXECUTIVE' 
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Executive View
                </button>
                <button
                  onClick={() => deepDiveData && setView('TECHNICAL')}
                  disabled={!deepDiveData}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'TECHNICAL' 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/20' 
                      : deepDiveData 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                        : 'text-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  Technical View
                  {!deepDiveData && <span className="ml-2 text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 border border-slate-800/50 font-bold">LOCKED</span>}
                </button>
              </div>
            </div>
          </nav>

          <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
             {view === 'EXECUTIVE' && (
                <Dashboard 
                  report={report} 
                  onReset={handleReset} 
                  onGenerateDeepDive={handleGenerateDeepDive}
                  isGeneratingDeepDive={isGeneratingDeepDive}
                />
             )}
             {view === 'TECHNICAL' && deepDiveData && (
                <TechnicalDeepDive
                  data={deepDiveData}
                  targetName={report.targetName}
                  onBack={() => setView('EXECUTIVE')}
                />
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;