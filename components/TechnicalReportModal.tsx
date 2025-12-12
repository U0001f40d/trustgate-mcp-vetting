import React from 'react';
import { X, FileCode, Copy } from 'lucide-react';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <FileCode className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Technical Deep-Dive Report</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-900 text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {content}
            </div>
             <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end">
                <button 
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                    <Copy className="w-4 h-4" /> Copy Report
                </button>
            </div>
        </div>
    </div>
  );
}
