
import React, { useState, useCallback } from 'react';
import { generateSoftware } from '../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { LoadingSpinner, ChipIcon } from './icons';
import { useSound } from '../services/soundService';

export const AIGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { playClick, playComplete } = useSound();

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }
        playClick();
        setIsLoading(true);
        setError(null);
        setGeneratedCode('');
        
        try {
            const code = await generateSoftware(prompt);
            setGeneratedCode(code);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, playClick, playComplete]);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <ChipIcon className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h1 className="text-4xl font-mono font-bold text-cyan-300">AI Code Forge</h1>
                <p className="mt-2 text-lg text-gray-400">Describe the software you want to build. The AI will generate the Python code.</p>
            </div>

            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 space-y-4 shadow-xl panel-clip">
                <label htmlFor="prompt" className="block text-sm font-mono font-medium text-cyan-400">
                    MISSION DIRECTIVE
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Create a NumPy script to calculate the moving average of a time series array.'"
                    className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-mono font-medium rounded-md text-gray-900 bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <ChipIcon className="h-5 w-5 mr-2" />}
                    {isLoading ? 'GENERATING...' : 'GENERATE CODE'}
                </button>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md panel-clip" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {generatedCode && (
                 <div>
                    <h2 className="text-2xl font-mono text-cyan-400 mb-4">Generated Code</h2>
                    <CodeBlock code={generatedCode} />
                </div>
            )}
        </div>
    );
};