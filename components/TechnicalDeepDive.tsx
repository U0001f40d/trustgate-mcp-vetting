import React, { useState } from 'react';
import { TechnicalDeepDiveData, MCPTool } from '../types';
import { 
  ArrowLeft, Terminal, Shield, AlertTriangle, CheckCircle, 
  Server, Lock, Activity, Database, FileCode, Layers, Box,
  ChevronDown, ChevronUp, Copy, ArrowUpDown, Search, Hash,
  Code2, CheckSquare, Info
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

const ToolCard: React.FC<{ tool: MCPTool }> = ({ tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border border-slate-800 rounded-lg bg-[#161b22] overflow-hidden transition-all duration-200 hover:border-slate-700 shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
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
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                  <Terminal className="w-4 h-4 text-blue-500" /> What it does
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {tool.details.technicalDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                   <AlertTriangle className="w-4 h-4 text-orange-500" /> Attack Vectors
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

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-b border-slate-800/50 pb-1 w-fit">
                  <Shield className="w-4 h-4 text-green-500" /> Mitigation Strategies
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
                  Security Implications
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 font-sans ml-1">
                   <li><span className="text-slate-500 font-semibold">Data Scope:</span> {tool.dataScope}</li>
                   <li><span className="text-slate-500 font-semibold">Validation:</span> {tool.details.inputValidation}</li>
                   <li><span className="text-slate-500 font-semibold">Resources:</span> {tool.details.systemResources.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div className="lg:col-span-2">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Secure Implementation
               </h4>
               <CodeBlock code={tool.details.codeExample} label="TypeScript" />
            </div>
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Recommended Permissions
               </h4>
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
                    <span className="text-slate-600 italic">No specific permissions required</span>
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
  const isPartial = data.analysisCoverage === 'PARTIAL' || data.analysisCoverage === 'SIMULATED';

  return (
    <div className="animate-fade-in pb-20 font-mono text-sm text-slate-300">
      {/* Back Button */}
      <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 group text-slate-400 hover:text-white transition-colors"
      >
          <div className="p-1.5 rounded-full border border-slate-700 bg-slate-800 group-hover:border-blue-500 group-hover:bg-blue-500/20 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-400">Back to Executive Summary</span>
      </button>

      {/* Header Info */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                 <Terminal className="w-6 h-6 text-blue-500" />
                 TECHNICAL_DEEP_DIVE
              </h1>
              <div className="flex gap-4 text-xs text-slate-500">
                 <span className="flex items-center gap-1"><Server className="w-3 h-3" /> TARGET: <span className="text-slate-300">{targetName}</span></span>
                 <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> REPORT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
           </div>
           <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">GENERATED_BY</div>
              <div className="text-white font-bold">TRUSTGATE_ENGINE_V3</div>
           </div>
        </div>
      </div>

      {isPartial && (
        <div className="mb-8 p-4 bg-yellow-900/10 border border-yellow-600/30 rounded-lg flex items-start gap-3 animate-fade-in">
           <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="text-yellow-400 font-bold text-xs uppercase mb-1">
                Analysis Coverage: {data.analysisCoverage}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Direct source code access was limited. This report is based on documentation, public signatures, and simulated best-practices for this server type.
              </p>
              {data.limitations && data.limitations.length > 0 && (
                 <ul className="mt-2 text-xs text-slate-500 list-disc list-inside">
                    {data.limitations.map((lim, i) => <li key={i}>{lim}</li>)}
                 </ul>
              )}
           </div>
        </div>
      )}

      <div className="space-y-10">
        
        {/* Section 1: Tools Inventory */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <Box className="w-5 h-5 text-blue-500" />
               MCP_TOOLS_INVENTORY
            </h2>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
               COUNT: {data.tools.length}
            </span>
          </div>
          <div>
            {data.tools.map((tool, idx) => (
              <ToolCard key={idx} tool={tool} />
            ))}
          </div>
        </section>

        {/* Section 2: Code Security Review */}
        <section>
           <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
             <Shield className="w-5 h-5 text-green-500" />
             CODE_SECURITY_AUDIT
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[
               { title: "INPUT_VALIDATION", content: data.codeSecurity.inputValidation, icon: AlertTriangle, color: "text-orange-400" },
               { title: "AUTHENTICATION", content: data.codeSecurity.authentication, icon: Lock, color: "text-blue-400" },
               { title: "ERROR_HANDLING", content: data.codeSecurity.errorHandling, icon: Activity, color: "text-red-400" },
               { title: "LOGGING_AUDIT", content: data.codeSecurity.loggingAudit, icon: FileCode, color: "text-purple-400" },
               { title: "RATE_LIMITING", content: data.codeSecurity.rateLimiting, icon: Activity, color: "text-yellow-400" },
               { title: "DATA_SANITIZATION", content: data.codeSecurity.dataSanitization, icon: Shield, color: "text-green-400" },
             ].map((item, i) => (
               <div key={i} className="bg-[#161b22] border border-slate-800 rounded p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <h3 className="text-slate-200 font-bold text-xs">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.content}</p>
               </div>
             ))}
           </div>
        </section>

        {/* Section 3: Dependencies */}
        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
             <Layers className="w-5 h-5 text-orange-500" />
             DEPENDENCY_GRAPH
          </h2>
          <div className="bg-[#161b22] border border-slate-800 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">PACKAGE</th>
                    <th className="px-4 py-3 font-semibold">VERSION</th>
                    <th className="px-4 py-3 font-semibold">STATUS</th>
                    <th className="px-4 py-3 font-semibold">ANALYSIS</th>
                    <th className="px-4 py-3 font-semibold">REMEDIATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.dependencies.map((dep, idx) => (
                    <tr key={idx} className="hover:bg-[#1c2128]">
                      <td className="px-4 py-2 text-white font-bold">{dep.name}</td>
                      <td className="px-4 py-2 text-slate-500">{dep.version}</td>
                      <td className="px-4 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          dep.status === 'SECURE' ? 'text-green-400 bg-green-900/20' : 
                          dep.status === 'VULNERABLE' ? 'text-red-400 bg-red-900/20' : 'text-yellow-400 bg-yellow-900/20'
                        }`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 max-w-xs font-sans">
                        {dep.riskDescription}
                        {dep.transitiveRisks.length > 0 && (
                          <div className="mt-1 text-[10px] text-orange-400">
                            + {dep.transitiveRisks.length} transitive deps
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-blue-400">{dep.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Integration Guide */}
        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
             <Server className="w-5 h-5 text-indigo-500" />
             INTEGRATION_PROTOCOLS
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-slate-300 font-bold mb-2 text-xs uppercase">Access Control Policy</h3>
              <CodeBlock code={data.integration.accessControlPolicy} label="policy.yaml" />
            </div>
            
            <div>
              <h3 className="text-slate-300 font-bold mb-2 text-xs uppercase">Secure Configuration</h3>
              <CodeBlock code={data.integration.secureConfig} label="config.json" />
            </div>

            <div className="lg:col-span-2">
               <div className="bg-[#161b22] border border-slate-800 rounded p-5">
                  <h3 className="text-slate-300 font-bold mb-4 text-xs uppercase">Infrastructure Hardening</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-400 mb-2 uppercase">Network Segmentation</h4>
                      <div className="text-xs text-slate-400 leading-relaxed font-sans">
                        {data.integration.networkSegmentation}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-green-400 mb-2 uppercase">Monitoring Setup</h4>
                      <div className="text-xs text-slate-400 leading-relaxed font-sans">
                        {data.integration.monitoringSetup}
                      </div>
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
