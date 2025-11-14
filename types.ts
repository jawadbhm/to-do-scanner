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

export interface PriorityTask {
  task: string;
  reasoning: string;
  filePath: string;
  lineNumber: number;
}

export interface CategoryGroup {
  category: string;
  description: string;
  comments: string[];
}

export interface AiAnalysis {
  overallSummary: string;
  priorityTasks: PriorityTask[];
  categoryGroups: CategoryGroup[];
}
