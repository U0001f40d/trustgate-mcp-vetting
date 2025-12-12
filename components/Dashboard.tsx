import React from 'react';
import { SecurityReport } from '../types';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, 
  DollarSign, TrendingUp, Activity, Lock,
  FileText, ExternalLink, Globe, ShieldCheck, Loader
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface DashboardProps {
  report: SecurityReport;
  onReset: () => void;
  onGenerateDeepDive: () => void;
  isGeneratingDeepDive: boolean;
}

const COLORS = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
  SLATE: '#475569',
  BLUE: '#3b82f6'
};

const MetricCard: React.FC<{ title: string; value: string | number; sub?: string; icon: React.FC<any>; color: string }> = ({ title, value, sub, icon: Icon, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {sub && <p className="text-slate-500 text-sm">{sub}</p>}
  </div>
);

const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score;
  const color = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';
  const strokeColor = score > 80 ? '#22c55e' : score > 60 ? '#eab308' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
       <svg className="transform -rotate-90 w-36 h-36">
        <circle cx="72" cy="72" r="65" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
        <circle cx="72" cy="72" r="65" stroke={strokeColor} strokeWidth="10" fill="transparent" strokeDasharray={408} strokeDashoffset={408 - (408 * percentage) / 100} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-slate-500 text-xs uppercase font-semibold mt-1">Trust Score</span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ report, onReset, onGenerateDeepDive, isGeneratingDeepDive }) => {
  const costData = [
    { name: 'Implementation', value: report.costAnalysis.implementation },
    { name: 'Maintenance', value: report.costAnalysis.annualMaintenance },
    { name: 'Training', value: report.costAnalysis.training },
    { name: 'Infra', value: report.costAnalysis.infrastructure },
  ];

  const roiData = [
    { year: 'Year 1', roi: report.roiProjection.year1 },
    { year: 'Year 2', roi: report.roiProjection.year2 },
    { year: 'Year 3', roi: report.roiProjection.year3 },
  ];

  const severityDistribution = [
    { name: 'Critical', value: report.vulnerabilities.filter(v => v.severity === 'CRITICAL').length },
    { name: 'High', value: report.vulnerabilities.filter(v => v.severity === 'HIGH').length },
    { name: 'Medium', value: report.vulnerabilities.filter(v => v.severity === 'MEDIUM').length },
    { name: 'Low', value: report.vulnerabilities.filter(v => v.severity === 'LOW').length },
  ].filter(d => d.value > 0);

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-700 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            TrustGate Report
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            Target: <span className="text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded">{report.targetName}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-sm">{report.scanDate}</span>
          </p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition" onClick={() => window.print()}>
                Export PDF
            </button>
            <button onClick={onReset} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20">
            New Scan
            </button>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-between">
            <div>
                <h3 className="text-slate-400 text-sm font-medium uppercase mb-1">Overall Risk Level</h3>
                <div className={`text-2xl font-bold tracking-tight ${report.riskLevel === 'CRITICAL' ? 'text-red-500' : report.riskLevel === 'HIGH' ? 'text-orange-500' : 'text-green-500'}`}>
                    {report.riskLevel}
                </div>
            </div>
            <RiskGauge score={report.riskScore} />
        </div>

        <MetricCard 
          title="Active Vulnerabilities" 
          value={report.vulnerabilities.length} 
          sub={`${report.vulnerabilities.filter(v => v.severity === 'CRITICAL').length} Critical`}
          icon={AlertTriangle} 
          color="text-orange-500" 
        />
        <MetricCard 
          title="Compliance Score" 
          value={`${report.compliance.filter(c => c.status === 'COMPLIANT').length}/${report.compliance.length}`} 
          sub="Standards Met"
          icon={FileText} 
          color="text-blue-500" 
        />
        <MetricCard 
          title="Est. Annual Cost" 
          value={`$${(report.costAnalysis.annualMaintenance / 1000).toFixed(1)}k`} 
          sub={`ROI Break-even: Month ${report.roiProjection.breakEvenMonth}`}
          icon={DollarSign} 
          color="text-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Executive Summary */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed mb-6">
                {report.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-auto">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Auth Assessment</h4>
                    <p className="text-white text-sm mb-2">{report.authAssessment.details}</p>
                    <div className="flex flex-wrap gap-2">
                         {report.authAssessment.weaknesses.map((w, i) => (
                             <span key={i} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                                 {w}
                             </span>
                         ))}
                    </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Security Strengths</h4>
                    <ul className="text-sm text-green-400 space-y-1">
                        {report.authAssessment.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                onClick={onGenerateDeepDive}
                disabled={isGeneratingDeepDive}
                className="mt-8 w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center justify-center gap-3">
                    {isGeneratingDeepDive ? (
                        <Loader className="w-6 h-6 animate-spin text-white" />
                    ) : (
                        <ShieldCheck className="w-6 h-6 text-white" />
                    )}
                    <span className="text-lg font-bold text-white tracking-wide">
                        {isGeneratingDeepDive ? 'Analyzing MCP tools and generating technical report...' : '🔍 View Technical Deep-Dive Report for Developers & Security Engineers'}
                    </span>
                </div>
            </button>
        </div>

        {/* Vuln Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4">Vulnerability Distribution</h3>
             <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={severityDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {severityDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase() as keyof typeof COLORS] || COLORS.SLATE} />
                            ))}
                        </Pie>
                        <RechartsTooltip 
                             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

      {/* Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" /> Cost Breakdown (USD)
                 </h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => `$${val/1000}k`} />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                            <RechartsTooltip 
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                cursor={{fill: '#334155', opacity: 0.4}}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" /> ROI Projection (%)
                 </h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={roiData}>
                            <defs>
                                <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(val) => `${val}%`} />
                            <RechartsTooltip 
                                formatter={(value: number) => [`${value}%`, 'ROI']}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Area type="monotone" dataKey="roi" stroke="#22c55e" fillOpacity={1} fill="url(#colorRoi)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Findings - Vulnerabilities */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
             <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white">Security Vulnerabilities</h3>
                 <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-mono">
                    {report.vulnerabilities.length} Detected
                 </span>
             </div>
             <div className="divide-y divide-slate-700">
                {report.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-750 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                     vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                     vuln.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                     vuln.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                     'bg-green-500/20 text-green-400 border border-green-500/30'
                                 }`}>
                                     {vuln.severity}
                                 </span>
                                 <span className="text-blue-400 font-mono text-sm">{vuln.cveId}</span>
                             </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{vuln.description}</p>
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                            <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Remediation</p>
                            <p className="text-slate-300 text-sm">{vuln.remediation}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Compliance & Sources Column */}
          <div className="space-y-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-fit">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-bold text-white">Compliance Audit</h3>
              </div>
              <div className="p-6 space-y-6">
                  {report.compliance.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                          <div className="mt-1">
                              {item.status === 'COMPLIANT' ? (
                                  <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : item.status === 'NON_COMPLIANT' ? (
                                  <XCircle className="w-6 h-6 text-red-500" />
                              ) : (
                                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                              )}
                          </div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-semibold">{item.name}</h4>
                                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                                      {item.status.replace('_', ' ')}
                                  </span>
                              </div>
                              <p className="text-slate-400 text-sm">{item.details}</p>
                          </div>
                      </div>
                  ))}
              </div>
            </div>

            {/* Analysis Sources */}
            {report.sources && report.sources.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-fit">
                  <div className="p-6 border-b border-slate-700 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Analysis Sources</h3>
                  </div>
                  <div className="p-4">
                      <ul className="space-y-2">
                        {report.sources.map((source, idx) => (
                          <li key={idx}>
                            <a 
                              href={source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-750 rounded"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{source}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                  </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};
