
import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ToggleSwitch } from './components/ToggleSwitch';
import { analyzeTodosWithGemini } from './services/geminiService';
import type { ScanResult, SummaryResult, AiAnalysis } from './types';
import { GithubIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [summaryResults, setSummaryResults] = useState<SummaryResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    setFiles(selectedFiles);
    setScanResults([]);
    setSummaryResults([]);
    setAiAnalysis(null);
    setError(null);
  };

  const resetState = () => {
    setFiles(null);
    setScanResults([]);
    setSummaryResults([]);
    setAiAnalysis(null);
    setError(null);
    setIsLoading(false);
    setIsAnalyzing(false);
    setShowSummary(false);
  };

  const handleScan = useCallback(async () => {
    if (!files || files.length === 0) {
      setError("Please select a folder to scan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiAnalysis(null);
    setScanResults([]);
    setSummaryResults([]);

    const results: ScanResult[] = [];
    const fileReadPromises: Promise<void>[] = [];
    const todoRegex = /.*(TODO|FIXME)[\s:\]\(]+(.*)/i;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Basic filter for text-based files, can be expanded
      if (file.type && !file.type.startsWith('text/') && file.type !== 'application/javascript' && file.type !== 'application/json' && file.type !== 'application/xml' && file.size > 1000000) {
          continue;
      }
        
      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            const lines = content.split('\n');
            lines.forEach((line, index) => {
              const match = line.match(todoRegex);
              if (match) {
                results.push({
                  filePath: file.webkitRelativePath || file.name,
                  lineNumber: index + 1,
                  type: match[1].toUpperCase() as 'TODO' | 'FIXME',
                  comment: match[2].trim(),
                });
              }
            });
          }
          resolve();
        };
        reader.onerror = () => {
          // Ignore errors for binary files etc.
          resolve();
        };
        reader.readAsText(file);
      });
      fileReadPromises.push(promise);
    }

    await Promise.all(fileReadPromises);

    results.sort((a, b) => a.filePath.localeCompare(b.filePath) || a.lineNumber - b.lineNumber);
    setScanResults(results);

    // Generate summary
    const summaryMap = new Map<string, { todoCount: number, fixmeCount: number }>();
    for (const result of results) {
      const entry = summaryMap.get(result.filePath) || { todoCount: 0, fixmeCount: 0 };
      if (result.type === 'TODO') {
        entry.todoCount++;
      } else {
        entry.fixmeCount++;
      }
      summaryMap.set(result.filePath, entry);
    }

    const summary: SummaryResult[] = Array.from(summaryMap, ([filePath, counts]) => ({
      filePath,
      ...counts,
    })).sort((a, b) => a.filePath.localeCompare(b.filePath));

    setSummaryResults(summary);
    setIsLoading(false);
  }, [files]);
  
  const handleAnalyze = async () => {
    if (scanResults.length === 0) {
      setError("No scan results to analyze. Please scan a folder first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Format comments for the API, including file path and line number for context
      const commentsForApi = scanResults.map(
        r => `Comment: "${r.comment}" (from ${r.filePath}:${r.lineNumber})`
      );
      const analysis = await analyzeTodosWithGemini(commentsForApi);
      setAiAnalysis(analysis);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during AI analysis.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">Code Todo Scanner</h1>
          <a href="https://github.com/google/generative-ai-docs/tree/main/demos/todo-scanner" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
            <GithubIcon className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-300 mb-6">
            Scan your code for 'TODO' and 'FIXME' comments, then use Gemini AI to analyze and prioritize your technical debt.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
            <FileUploader onFileChange={handleFileChange} fileCount={files?.length || 0} />

            {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleScan}
                disabled={!files || isLoading || isAnalyzing}
                className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
              >
                {isLoading ? 'Scanning...' : 'Scan Files'}
              </button>

              {scanResults.length > 0 && !aiAnalysis && (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <ToggleSwitch label="Show Summary" checked={showSummary} onChange={setShowSummary} />
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || isAnalyzing}
                    className="w-full sm:w-auto flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                  >
                    <SparklesIcon className="w-5 h-5" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
                  </button>
                </div>
              )}
            </div>
             {(scanResults.length > 0 || isLoading || isAnalyzing || files) && (
                 <div className="mt-4 text-right">
                    <button onClick={resetState} className="text-sm text-gray-400 hover:text-cyan-400 underline">Start Over</button>
                 </div>
            )}
          </div>
          
          <ResultsDisplay
            scanResults={scanResults}
            summaryResults={summaryResults}
            showSummary={showSummary}
            isLoading={isLoading}
            isAnalyzing={isAnalyzing}
            aiAnalysis={aiAnalysis}
          />

        </div>
      </main>
       <footer className="text-center py-4 text-xs text-gray-500">
          Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default App;
