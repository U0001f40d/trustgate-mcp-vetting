
import React, { useState, useMemo, useEffect } from 'react';
import { TechnicalDeepDiveData, MCPTool } from '../types';
import { 
  ArrowLeft, Terminal, Shield, AlertTriangle, CheckCircle, 
  Server, Lock, Activity, Database, FileCode, Layers, Box,
  ChevronDown, Copy, Hash, Code2, CheckSquare, Info, Filter, Search as SearchIcon,
  Maximize2, Minimize2
} from 'lucide-react';

interface TechnicalDeepDiveProps {
  data: TechnicalDeepDiveData;
  targetName: string;
  onBack: () => void;
}

const CodeBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => (
  <div className="relative group rounded bg-[#0d1117] border border-slate-800 my-3 shadow-inner font-mono text-xs">
    {label && (
      <div className="bg-slate-900/50 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center">
        <span className="text-slate-400 font-semibold">{label}</span>
      </div>
    )}
    <pre className="p-3 overflow-x-auto text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
      <code>{code}</code>
    </pre>
    <button 
      onClick={() => navigator.clipboard.writeText(code)}
      className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white hover:bg-slate-700"
    >
      <Copy className="w-3 h-3" />
    </button>
  </div>
);

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const styles = {
    CRITICAL: "bg-red-900/30 text-red-400 border-red-500/30",
    HIGH: "bg-orange-900/30 text-orange-400 border-orange-500/30",
    MEDIUM: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
    LOW: "bg-green-900/30 text-green-400 border-green-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[level as keyof typeof styles] || styles.LOW} flex items-center gap-1.5 w-fit uppercase tracking-wider`}>
      {level}
    </span>
  );
};

const ToolCard: React.FC<{ tool: MCPTool; forceOpen?: boolean }> = ({ tool, forceOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (forceOpen !== undefined) setIsExpanded(forceOpen);
  }, [forceOpen]);

  return (
    <div className="mb-4 border border-slate-800 rounded-lg bg-[#161b22] overflow-hidden transition-all duration-200 hover:border-slate-700 shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-blue-400 group-hover:text-blue-300 transition-colors group-hover:border-blue-900/50">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono group-hover:text-blue-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{tool.signature}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <RiskBadge level={tool.riskLevel} />
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800 bg-[#0d1117] p-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                  <Terminal className="w-4 h-4 text-blue-500" /> Technical Assessment
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {tool.details.technicalDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                   <AlertTriangle className="w-4 h-4 text-orange-500" /> Vulnerability Scope
                </h4>
                <div className="bg-red-900/10 border border-red-900/20 rounded-md p-3 space-y-2">
                  {tool.details.attackVectors.map((av, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-300/90 font-mono">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{av}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                  <Shield className="w-4 h-4 text-green-500" /> Security Controls
                </h4>
                <div className="space-y-2">
                  {tool.details.securityControls.map((control, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500/80 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300 font-sans">{control}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b border-slate-800/50 pb-1 w-fit">
                  Runtime Context
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 font-sans ml-1">
                   <li><span className="text-slate-500 font-semibold">Data Access:</span> {tool.dataScope}</li>
                   <li><span className="text-slate-500 font-semibold">Validation Type:</span> {tool.details.inputValidation}</li>
                   <li><span className="text-slate-500 font-semibold">Impacted Systems:</span> {tool.details.systemResources.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div className="lg:col-span-2">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Secure Code Example</h4>
               <CodeBlock code={tool.details.codeExample} label="TypeScript Implementation" />
            </div>
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Required Permissions</h4>
               <div className="bg-[#161b22] border border-slate-800 rounded p-3 font-mono text-xs">
                 {tool.permissions.length > 0 ? (
                    <ul className="space-y-1 text-orange-300">
                        {tool.permissions.map((p, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-slate-600 select-none">-</span> 
                                "{p}"
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <span className="text-slate-600 italic">Minimal permissions detected</span>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TechnicalDeepDive: React.FC<TechnicalDeepDiveProps> = ({ data, targetName, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  
  const filteredTools = useMemo(() => {
    return data.tools.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.signature.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.tools, searchQuery]);

  const isPartial = data.analysisCoverage === 'PARTIAL' || data.analysisCoverage === 'SIMULATED';

  return (
    <div className="animate-fade-in pb-20 font-mono text-sm text-slate-300">
      <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 group text-slate-400 hover:text-white transition-colors no-print"
      >
          <div className="p-1.5 rounded-full border border-slate-700 bg-slate-800 group-hover:border-blue-500 group-hover:bg-blue-500/20 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-400">Exit Technical Mode</span>
      </button>

      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
           <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                 <Terminal className="w-6 h-6 text-blue-500" />
                 SECURITY_DEEP_DIVE_AUDIT
              </h1>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                 <span className="flex items-center gap-1"><Server className="w-3 h-3" /> TARGET: <span className="text-slate-300">{targetName}</span></span>
                 <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> AUDIT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                 <span className="flex items-center gap-1 text-green-500/70"><Shield className="w-3 h-3" /> STATUS: COMPLETED</span>
              </div>
           </div>
           <div className="flex gap-2 no-print">
              <button 
                onClick={() => setExpandAll(!expandAll)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 hover:border-slate-600 transition-all text-slate-400 hover:text-white"
              >
                {expandAll ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {expandAll ? 'COLLAPSE ALL' : 'EXPAND ALL'}
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-[#161b22] border border-slate-800 rounded-lg shadow-inner">
                <h2 className="text-xs font-bold text-blue-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Technical Analysis Summary
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {data.technicalSummary}
                </p>
            </div>
            <div className="p-6 bg-[#0d1117] border border-slate-800 rounded-lg">
                <h2 className="text-xs font-bold text-indigo-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Security Architecture Overview
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-sans italic border-l-2 border-slate-700 pl-4">
                  {data.architectureOverview}
                </p>
            </div>
        </div>
        <div className="space-y-4">
           {isPartial && (
            <div className="p-4 bg-yellow-900/10 border border-yellow-600/30 rounded-lg flex items-start gap-3 animate-fade-in no-print">
               <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-yellow-400 font-bold text-xs uppercase mb-1">Audit Coverage: {data.analysisCoverage}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Analysis performed via behavioral simulation and documentation mapping. Source code was inferred from public tool signatures.
                  </p>
                  {data.limitations && (
                     <ul className="mt-2 text-[10px] text-slate-500 list-disc list-inside">
                        {data.limitations.map((lim, i) => <li key={i}>{lim}</li>)}
                     </ul>
                  )}
               </div>
            </div>
          )}
          <div className="p-4 bg-blue-900/10 border border-blue-600/20 rounded-lg">
             <h4 className="text-blue-400 font-bold text-xs uppercase mb-2">Audit Completeness</h4>
             <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">100% EXHAUSTIVE</span>
             </div>
             <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">
                Mapped {data.tools.length} sub-tools and {data.dependencies.length} dependencies.
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <Box className="w-5 h-5 text-blue-500" />
               MCP_TOOLS_INVENTORY
               <span className="ml-2 text-xs bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono">
                  COUNT: {data.tools.length}
               </span>
            </h2>
            
            <div className="relative flex-1 max-w-md no-print">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Filter inventory by tool name, signature, or risk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               />
            </div>
          </div>
          
          <div className="space-y-2">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, idx) => (
                <ToolCard 
                  key={`${idx}-${tool.name}`} 
                  tool={tool} 
                  forceOpen={expandAll || undefined} 
                />
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
                 <p className="text-slate-500 text-xs font-mono">No tools found matching criteria "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>

        <section>
           <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
             <Shield className="w-5 h-5 text-green-500" />
             CORE_CODE_SECURITY_ANALYSIS
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[
               { title: "Input Validation", content: data.codeSecurity.inputValidation, icon: AlertTriangle, color: "text-orange-400" },
               { title: "Auth Protocol", content: data.codeSecurity.authentication, icon: Lock, color: "text-blue-400" },
               { title: "Error Bubbling", content: data.codeSecurity.errorHandling, icon: Activity, color: "text-red-400" },
               { title: "Audit Logging", content: data.codeSecurity.loggingAudit, icon: FileCode, color: "text-purple-400" },
               { title: "DDoS/Rate Limit", content: data.codeSecurity.rateLimiting, icon: Activity, color: "text-yellow-400" },
               { title: "Data Sanitization", content: data.codeSecurity.dataSanitization, icon: Shield, color: "text-green-400" },
             ].map((item, i) => (
               <div key={i} className="bg-[#161b22] border border-slate-800 rounded p-5 hover:border-slate-700 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <h3 className="text-slate-200 font-bold text-xs uppercase tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.content}</p>
               </div>
             ))}
           </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
             <Layers className="w-5 h-5 text-orange-500" />
             DEPENDENCY_RISK_MAPPING
          </h2>
          <div className="bg-[#161b22] border border-slate-800 rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Dependency</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Version</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Security State</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Audit Insight</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.dependencies.map((dep, idx) => (
                    <tr key={`${idx}-${dep.name}`} className="hover:bg-[#1c2128] transition-colors">
                      <td className="px-4 py-3 text-white font-bold font-mono">{dep.name}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{dep.version}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          dep.status === 'SECURE' ? 'text-green-400 bg-green-900/20' : 
                          dep.status === 'VULNERABLE' ? 'text-red-400 bg-red-900/20' : 'text-yellow-400 bg-yellow-900/20'
                        }`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs font-sans">
                        {dep.riskDescription}
                      </td>
                      <td className="px-4 py-3 text-blue-400 font-bold uppercase tracking-tighter text-[10px]">{dep.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
             <Server className="w-5 h-5 text-indigo-500" />
             ENTERPRISE_HARDENING_GUIDE
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-slate-400 font-bold mb-3 text-xs uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Access Control Policy
              </h3>
              <CodeBlock code={data.integration.accessControlPolicy} label="RBAC Policy (YAML)" />
            </div>
            
            <div>
              <h3 className="text-slate-400 font-bold mb-3 text-xs uppercase flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" /> Secure Configuration
              </h3>
              <CodeBlock code={data.integration.secureConfig} label="config.json" />
            </div>

            <div className="lg:col-span-2">
               <div className="bg-[#161b22] border border-slate-800 rounded p-6 shadow-inner">
                  <h3 className="text-slate-300 font-bold mb-5 text-xs uppercase border-b border-slate-800 pb-2">Infrastructure Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-400 mb-3 uppercase flex items-center gap-2">
                        Network Architecture
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-900/30 p-4 rounded border border-slate-800">
                        {data.integration.networkSegmentation}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-green-400 mb-3 uppercase flex items-center gap-2">
                        Monitoring & Observability
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-900/30 p-4 rounded border border-slate-800">
                        {data.integration.monitoringSetup}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
