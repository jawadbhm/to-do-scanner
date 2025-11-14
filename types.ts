
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

export interface AiAnalysis {
  overallSummary: string;
  priorityTasks: {
    task: string;
    reasoning: string;
    filePath: string;
    lineNumber: number;
  }[];
  categoryGroups: {
    category: string;
    description: string;
    comments: string[];
  }[];
}
