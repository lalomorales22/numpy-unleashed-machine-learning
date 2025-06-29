
import React, { useState, useCallback } from 'react';
import { optimizeCode, explainCode } from '../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { LoadingSpinner, WrenchScrewdriverIcon, ChipIcon } from './icons';
import { useSound } from '../services/soundService';
import { TerminalText } from './TerminalText';

export const CodeOptimizerPage: React.FC = () => {
    const [inputCode, setInputCode] = useState<string>(`import numpy as np

# Inefficient loop to find elements greater than a threshold
def find_large_elements(data_list, threshold):
    large_elements = []
    for item in data_list:
        if item > threshold:
            large_elements.append(item)
    return large_elements

my_data = list(range(100000))
large_nums = find_large_elements(my_data, 99990)`);

    const [optimizedCode, setOptimizedCode] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'optimize' | 'explain'>('optimize');
    const { playClick, playComplete } = useSound();

    const handleAnalyze = useCallback(async () => {
        if (!inputCode.trim()) {
            setError('Input code cannot be empty.');
            return;
        }
        playClick();
        setIsLoading(true);
        setError(null);
        setOptimizedCode('');
        setExplanation('');
        
        try {
            const [optCode, expl] = await Promise.all([
                optimizeCode(inputCode),
                explainCode(inputCode)
            ]);
            setOptimizedCode(optCode);
            setExplanation(expl);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [inputCode, playClick, playComplete]);

    const handleTabClick = (tab: 'optimize' | 'explain') => {
        playClick();
        setActiveTab(tab);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <WrenchScrewdriverIcon className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h1 className="text-4xl font-mono font-bold text-cyan-300">AI Code Optimizer</h1>
                <p className="mt-2 text-lg text-gray-400">Optimize and understand your NumPy code with AI assistance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-gray-800/50 border border-cyan-500/30 p-6 space-y-4 shadow-xl panel-clip">
                    <label htmlFor="input-code" className="block text-sm font-mono font-medium text-cyan-400">
                        INPUT CODE
                    </label>
                    <textarea
                        id="input-code"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Paste your Python/NumPy code here..."
                        className="w-full h-80 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                        disabled={isLoading}
                        spellCheck="false"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !inputCode.trim()}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-mono font-medium rounded-md text-gray-900 bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <ChipIcon className="h-5 w-5 mr-2" />}
                        {isLoading ? 'ANALYZING...' : 'ANALYZE CODE'}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="bg-gray-800/50 border border-cyan-500/30 p-6 shadow-xl min-h-[400px] panel-clip">
                    <div className="flex border-b border-cyan-500/30 mb-4">
                        <button 
                            onClick={() => handleTabClick('optimize')}
                            className={`px-4 py-2 font-mono -mb-px border-b-2 ${activeTab === 'optimize' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Optimize
                        </button>
                        <button 
                            onClick={() => handleTabClick('explain')}
                            className={`px-4 py-2 font-mono -mb-px border-b-2 ${activeTab === 'explain' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Explain
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center h-64">
                            <LoadingSpinner className="h-12 w-12 text-cyan-400" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md panel-clip" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div>
                            {activeTab === 'optimize' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-mono text-teal-400 mb-2">Optimized Version</h3>
                                    {optimizedCode ? <CodeBlock code={optimizedCode} /> : <p className="text-gray-500 italic">Analysis results will appear here.</p>}
                                </div>
                            )}
                            {activeTab === 'explain' && (
                                 <div className="animate-fade-in">
                                    <h3 className="text-xl font-mono text-teal-400 mb-2">Code Explanation</h3>
                                    {explanation ? (
                                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 leading-relaxed">
                                           <TerminalText text={explanation} />
                                        </div>
                                    ) : <p className="text-gray-500 italic">Explanation will appear here.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};