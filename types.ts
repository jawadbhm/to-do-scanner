export interface ScanResult {
  filePath: string;
  lineNumber: number;
  comment: string;
  type: 'TODO' | 'FIXME';
}

export interface SummaryResult {
  filePath: string;
  todoCount: number;
  fixmeCount: number;
}
