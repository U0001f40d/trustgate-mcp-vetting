import React from 'react';
import { TestResult } from '../utils/testRunner';
import { CheckCircle, XCircle, Clock, ShieldCheck, X } from 'lucide-react';

interface DiagnosticPanelProps {
  results: TestResult[];
  onClose: () => void;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ results, onClose }) => {
  const passed = results.filter(r => r.status === 'passed').length;
  const total = results.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">System Diagnostics</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-slate-900 overflow-y-auto max-h-[60vh]">
          <div className="mb-6 flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="text-sm font-medium text-slate-400">
                Test Suite Status: <span className={passed === total ? 'text-green-400' : 'text-red-400'}>
                    {passed === total ? 'ALL SYSTEMS OPERATIONAL' : 'DEGRADED'}
                </span>
             </div>
             <div className="text-xs font-mono text-slate-500">
                {passed}/{total} Passed
             </div>
          </div>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-slate-850 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                {result.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-semibold text-white truncate">{result.name}</h4>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" /> {result.duration.toFixed(2)}ms
                    </span>
                  </div>
                  {result.error && (
                    <p className="text-xs text-red-400 mt-1 font-mono bg-red-950/20 p-2 rounded border border-red-900/30">
                      {result.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}