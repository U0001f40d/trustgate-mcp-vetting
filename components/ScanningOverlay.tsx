import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, Server, FileCheck, Lock, Binary, Code2, Terminal, Shield } from 'lucide-react';

interface ScanningOverlayProps {
  isVisible: boolean;
  type?: 'EXECUTIVE' | 'TECHNICAL';
}

const EXECUTIVE_STEPS = [
  { message: "Resolving MCP endpoints...", icon: Server },
  { message: "Scanning dependencies...", icon: Search },
  { message: "Checking vulnerabilities...", icon: ShieldAlert },
  { message: "Evaluating RBAC and Auth protocols...", icon: Lock },
  { message: "Auditing regulatory compliance...", icon: FileCheck },
  { message: "Calculating costs...", icon: Binary },
];

const TECHNICAL_STEPS = [
  { message: "Parsing source code...", icon: Code2 },
  { message: "Identifying tool signatures...", icon: Terminal },
  { message: "Analyzing tool permissions...", icon: Lock },
  { message: "Simulating blast radius...", icon: ShieldAlert },
  { message: "Generating security recommendations...", icon: Shield },
  { message: "Finalizing deep dive report...", icon: FileCheck },
];

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ isVisible, type = 'EXECUTIVE' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = type === 'EXECUTIVE' ? EXECUTIVE_STEPS : TECHNICAL_STEPS;
  const title = type === 'EXECUTIVE' ? "Analyzing MCP server security..." : "Performing deep tool analysis...";

  useEffect(() => {
    if (isVisible) {
      setCurrentStepIndex(0);
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isVisible, steps.length, type]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white transition-all duration-300 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <CurrentIcon className="w-16 h-16 text-blue-400 animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 tracking-tight">{title}</h2>
      
      <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
      </div>
      
      <p className="text-slate-400 font-mono text-sm h-6">
        {">"} {steps[currentStepIndex].message}
      </p>

      <div className="mt-12 grid grid-cols-6 gap-2 opacity-30">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-colors duration-300 w-8 ${idx <= currentStepIndex ? 'bg-blue-500' : 'bg-slate-600'}`}
          />
        ))}
      </div>
    </div>
  );
};