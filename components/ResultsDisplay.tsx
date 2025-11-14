
import React from 'react';
import type { ScanResult, SummaryResult, AiAnalysis } from '../types';
import { FileIcon, LightBulbIcon, PriorityHighIcon, TagIcon } from './Icons';

interface ResultsDisplayProps {
  scanResults: ScanResult[];
  summaryResults: SummaryResult[];
  showSummary: boolean;
  isLoading: boolean;
  isAnalyzing: boolean;
  aiAnalysis: AiAnalysis | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
);

const InitialState: React.FC = () => (
    <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg">
        <FileIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300">Ready to Scan</h3>
        <p className="text-gray-400 mt-2">Upload a project folder to begin your scan.</p>
    </div>
);

const NoResults: React.FC = () => (
    <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-300">No TODOs or FIXMEs Found</h3>
        <p className="text-gray-400 mt-2">Great job! Your codebase looks clean.</p>
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  scanResults,
  summaryResults,
  showSummary,
  isLoading,
  isAnalyzing,
  aiAnalysis
}) => {
  if (isLoading || isAnalyzing) {
    return <LoadingSpinner />;
  }
    
  if (aiAnalysis) {
    return <AiAnalysisView analysis={aiAnalysis} />;
  }

  if (scanResults.length === 0) {
    return <InitialState />;
  }
  
  if (summaryResults.length === 0 && !isLoading) {
    return <NoResults />;
  }

  return (
    <div className="mt-6 bg-gray-900/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Scan Results</h3>
        {showSummary ? <SummaryView results={summaryResults} /> : <DetailedView results={scanResults} />}
    </div>
  );
};


const AiAnalysisView: React.FC<{ analysis: AiAnalysis }> = ({ analysis }) => (
    <div className="mt-6 bg-gray-900/50 p-4 rounded-lg space-y-8 animate-fade-in">
        <h3 className="text-2xl font-bold text-center text-indigo-400">Gemini AI Analysis</h3>
        
        {/* Overall Summary */}
        <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-200 mb-2">
                <LightBulbIcon className="w-6 h-6 text-yellow-400" />
                Overall Summary
            </h4>
            <p className="text-gray-300">{analysis.overallSummary}</p>
        </div>

        {/* Priority Tasks */}
        <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-200 mb-3">
                <PriorityHighIcon className="w-6 h-6 text-red-400" />
                High Priority Tasks
            </h4>
            <ul className="space-y-4">
                {analysis.priorityTasks.map((task, index) => (
                    <li key={index} className="p-3 bg-gray-900/70 rounded-md">
                        <p className="font-semibold text-cyan-300">{task.task}</p>
                        <p className="text-sm text-gray-400 mt-1"><span className="font-semibold">Reasoning:</span> {task.reasoning}</p>
                        <p className="text-xs text-gray-500 mt-2">{task.filePath}:{task.lineNumber}</p>
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Category Groups */}
        <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-200 mb-3">
                <TagIcon className="w-6 h-6 text-green-400" />
                Category Groups
            </h4>
            <div className="space-y-4">
                {analysis.categoryGroups.map((group, index) => (
                    <div key={index} className="p-3 bg-gray-900/70 rounded-md">
                        <h5 className="font-bold text-lg text-green-300">{group.category}</h5>
                        <p className="text-sm text-gray-400 italic mb-2">{group.description}</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            {group.comments.map((comment, cIndex) => (
                                <li key={cIndex} className="text-sm text-gray-300">{comment}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const SummaryView: React.FC<{ results: SummaryResult[] }> = ({ results }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-cyan-400 uppercase bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3">File Path</th>
                    <th scope="col" className="px-6 py-3 text-center">TODOs</th>
                    <th scope="col" className="px-6 py-3 text-center">FIXMEs</th>
                    <th scope="col" className="px-6 py-3 text-center">Total</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => (
                    <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap">
                           {result.filePath}
                        </th>
                        <td className="px-6 py-4 text-center">{result.todoCount}</td>
                        <td className="px-6 py-4 text-center">{result.fixmeCount}</td>
                        <td className="px-6 py-4 text-center font-bold">{result.todoCount + result.fixmeCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const DetailedView: React.FC<{ results: ScanResult[] }> = ({ results }) => {
    const groupedResults: { [key: string]: ScanResult[] } = results.reduce((acc, result) => {
        (acc[result.filePath] = acc[result.filePath] || []).push(result);
        return acc;
    }, {} as { [key: string]: ScanResult[] });

    return (
        <div className="space-y-4">
            {Object.entries(groupedResults).map(([filePath, fileResults]) => (
                <div key={filePath} className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-300 mb-2 break-all">{filePath}</h4>
                    <ul className="space-y-2">
                        {fileResults.map((result, index) => (
                            <li key={index} className="grid grid-cols-[auto_1fr] gap-x-4 text-sm bg-gray-900/50 p-2 rounded-md">
                                <div className="text-right text-gray-500">{result.lineNumber}</div>
                                <div>
                                    <span className={`font-bold mr-2 ${result.type === 'TODO' ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {result.type}
                                    </span>
                                    <span className="text-gray-300 font-mono">{result.comment}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
