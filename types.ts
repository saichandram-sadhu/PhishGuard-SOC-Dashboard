export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum Verdict {
  SAFE = 'Safe',
  SUSPICIOUS = 'Suspicious',
  PHISHING = 'Phishing'
}

export interface AnalysisLayer {
  name: string;
  status: 'clean' | 'warning' | 'danger';
  details: string;
}

export interface ScanResult {
  url: string;
  verdict: Verdict;
  confidenceScore: number; // 0-100
  riskLevel: RiskLevel;
  explanation: string;
  redFlags: string[];
  recommendation: string;
  layers: AnalysisLayer[];
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  verdict: Verdict;
  timestamp: string;
}
