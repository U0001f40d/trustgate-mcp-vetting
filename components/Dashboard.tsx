import React from 'react';
import { SecurityReport } from '../types';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, 
  DollarSign, TrendingUp, Activity, Lock,
  FileText, ExternalLink, Globe, ShieldCheck, Loader, Info, Printer
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

const RiskLegendItem: React.FC<{ label: string; color: string; desc: string; isActive: boolean }> = ({ label, color, desc, isActive }) => (
  <div className="group relative flex-1 flex flex-col items-center">
    <div 
        className={`h-1.5 w-full rounded-full transition-all duration-300 ${isActive ? color : 'bg-slate-700'} group-hover:bg-opacity-80 cursor-help`}
    />
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 p-2 bg-slate-900 border border-slate-700 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
       <div className={`text-[10px] font-bold mb-1 ${color.replace('bg-', 'text-')}`}>{label}</div>
       <div className="text-[9px] text-slate-400 leading-tight">{desc}</div>
    </div>
  </div>
);

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

  const deriveRiskLevel = (score: number) => {
      if (score >= 80) return 'LOW';
      if (score >= 60) return 'MEDIUM';
      if (score >= 40) return 'HIGH';
      return 'CRITICAL';
  };

  const riskLevel = deriveRiskLevel(report.riskScore);

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-500';
      if (score >= 60) return 'text-yellow-500';
      if (score >= 40) return 'text-orange-500';
      return 'text-red-500';
  };

  const handlePrint = () => {
    // 1. Focus the current window to help bypass iframe restrictions
    window.focus();
    
    // 2. Wrap in a try-catch for better error handling in sandboxed environments
    try {
      // Small timeout to ensure layout shifts are settled and charts are ready
      setTimeout(() => {
        const printResult = window.print();
        // window.print() is often void, but we check if we can detect failure
      }, 300);
    } catch (err) {
      console.error("Native printing failed:", err);
      alert("Printing is restricted in this sandboxed view. To export as PDF, please open TrustGate in 'Fullscreen' or a new tab, then try again.");
    }
  };

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
        <div className="flex gap-3 no-print">
            <button 
              className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 group" 
              onClick={handlePrint}
              title="Export report to PDF"
            >
                <Printer className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" /> Export PDF
            </button>
            <button onClick={onReset} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20">
            New Scan
            </button>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">Overall Trust Score</h3>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-bold tracking-tight ${getScoreColor(report.riskScore)}`}>
                            {report.riskScore}
                        </span>
                        <span className="text-slate-600 font-medium">/100</span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                    riskLevel === 'CRITICAL' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                    riskLevel === 'HIGH' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' :
                    riskLevel === 'MEDIUM' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' :
                    'bg-green-900/20 text-green-400 border-green-500/30'
                }`}>
                    {riskLevel} RISK
                </div>
            </div>
            <div className="flex gap-1.5 mt-6 pt-4 border-t border-slate-700/50">
                <RiskLegendItem label="CRITICAL" color="bg-red-500" desc="Unsafe." isActive={riskLevel === 'CRITICAL'} />
                <RiskLegendItem label="HIGH" color="bg-orange-500" desc="Significant risks." isActive={riskLevel === 'HIGH'} />
                <RiskLegendItem label="MEDIUM" color="bg-yellow-500" desc="Acceptable with controls." isActive={riskLevel === 'MEDIUM'} />
                <RiskLegendItem label="LOW" color="bg-green-500" desc="Safe for production." isActive={riskLevel === 'LOW'} />
            </div>
        </div>

        <MetricCard title="Active Vulnerabilities" value={report.vulnerabilities.length} sub={`${report.vulnerabilities.filter(v => v.severity === 'CRITICAL').length} Critical`} icon={AlertTriangle} color="text-orange-500" />
        <MetricCard title="Compliance Score" value={`${report.compliance.filter(c => c.status === 'COMPLIANT').length}/${report.compliance.length}`} sub="Standards Met" icon={FileText} color="text-blue-500" />
        <MetricCard title="Est. Annual Cost" value={`$${(report.costAnalysis.annualMaintenance / 1000).toFixed(1)}k`} sub={`ROI Break-even: M${report.roiProjection.breakEvenMonth}`} icon={DollarSign} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Security Strengths</h4>
                    <ul className="text-sm text-green-400 space-y-1">
                        {report.authAssessment.strengths.slice(0, 3).map((s, i) => (
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
                className="mt-8 w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 no-print"
            >
                <div className="flex items-center justify-center gap-3">
                    {isGeneratingDeepDive ? <Loader className="w-6 h-6 animate-spin text-white" /> : <ShieldCheck className="w-6 h-6 text-white" />}
                    <span className="text-lg font-bold text-white tracking-wide">
                        {isGeneratingDeepDive ? 'Analyzing tools...' : '🔍 View Technical Deep-Dive'}
                    </span>
                </div>
            </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4">Vulnerability Distribution</h3>
             <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={severityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {severityDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase() as keyof typeof COLORS] || COLORS.SLATE} />
                            ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                            <p className="text-slate-300 text-sm">{vuln.remediation}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">Compliance Audit</h3>
              </div>
              <div className="p-6 space-y-6">
                {report.compliance.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1">
                      {item.status === 'COMPLIANT' ? <CheckCircle className="w-6 h-6 text-green-500" /> : item.status === 'NON_COMPLIANT' ? <XCircle className="w-6 h-6 text-red-500" /> : <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">{item.name}</h4>
                      </div>
                      <p className="text-slate-400 text-sm">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};