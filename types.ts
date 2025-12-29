export interface InsuranceAnalysis {
  companyName: string;
  coverage: string;
  actionSteps: string;
  reimbursement: string;
  summary: string;
}

export interface FileData {
  file: File;
  previewUrl: string | null;
  base64: string;
  mimeType: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
