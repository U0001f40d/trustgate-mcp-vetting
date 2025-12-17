
export interface Vulnerability {
  cveId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  remediation: string;
}

export interface ComplianceStandard {
  name: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'NOT_APPLICABLE';
  details: string;
}

export interface CostMetric {
  category: string;
  amount: number;
}

export interface SecurityReport {
  targetName: string;
  targetUrl: string;
  scanDate: string;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  scanStatus?: 'SUCCESS' | 'NOT_FOUND' | 'PARTIAL';
  suggestedAlternatives?: string[];
  authAssessment: {
    score: number;
    details: string;
    strengths: string[];
    weaknesses: string[];
  };
  vulnerabilities: Vulnerability[];
  compliance: ComplianceStandard[];
  costAnalysis: {
    implementation: number;
    annualMaintenance: number;
    training: number;
    infrastructure: number;
  };
  roiProjection: {
    year1: number;
    year2: number;
    year3: number;
    breakEvenMonth: number;
  };
  sources?: string[];
}

export interface ScanState {
  status: 'IDLE' | 'SCANNING' | 'COMPLETE' | 'ERROR';
  progress: number; // 0-100
  currentStep: string;
  error?: string;
}

// Deep Dive Types
export interface MCPTool {
  name: string;
  signature: string;
  description: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dataScope: string;
  permissions: string[];
  details: {
    technicalDescription: string;
    inputValidation: string;
    outputFormat: string;
    systemResources: string[];
    attackVectors: string[];
    securityControls: string[];
    codeExample: string;
  };
}

export interface CodeSecurityReview {
  inputValidation: string;
  authentication: string;
  errorHandling: string;
  loggingAudit: string;
  rateLimiting: string;
  dataSanitization: string;
}

export interface DependencyRisk {
  name: string;
  version: string;
  status: 'SECURE' | 'VULNERABLE' | 'OUTDATED';
  riskDescription: string;
  transitiveRisks: string[];
  recommendation: string;
}

export interface IntegrationGuide {
  accessControlPolicy: string;
  networkSegmentation: string;
  monitoringSetup: string;
  secureConfig: string;
}

export interface TechnicalDeepDiveData {
  technicalSummary: string;
  architectureOverview: string;
  tools: MCPTool[];
  codeSecurity: CodeSecurityReview;
  dependencies: DependencyRisk[];
  integration: IntegrationGuide;
  analysisCoverage?: 'FULL' | 'PARTIAL' | 'SIMULATED';
  limitations?: string[];
}
