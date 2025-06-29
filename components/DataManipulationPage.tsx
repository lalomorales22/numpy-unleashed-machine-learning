
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DataFlowStep } from '../types';
import { generateDataFile, generateSoftware, visualizeDataFlow, generateChartConfig } from '../services/geminiService';
import { LoadingSpinner, ChipIcon, FileIcon, TableIcon, ArrowRightIcon, CodeBracketIcon, UploadIcon, ChartBarIcon } from './icons';
import { CodeBlock } from './CodeBlock';
import { useSound } from '../services/soundService';


const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Generate Data', 'Define Script', 'Visualize Flow', 'Visualize Output'];
    return (
        <nav className="flex items-center justify-center space-x-2 md:space-x-8 mb-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={step} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-mono font-bold transition-all duration-300
                            ${isActive ? 'bg-cyan-400 text-gray-900 ring-4 ring-cyan-500/50' : ''}
                            ${isCompleted ? 'bg-teal-500 text-white' : ''}
                            ${!isActive && !isCompleted ? 'bg-gray-700 text-gray-400 border-2 border-gray-600' : ''}
                        `}>
                            {stepNumber}
                        </div>
                        <span className={`ml-3 font-mono hidden md:inline-block ${isActive ? 'text-cyan-300' : 'text-gray-500'}`}>{step}</span>
                    </div>
                );
            })}
        </nav>
    );
};

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode, isLoading?: boolean }> = ({ children, isLoading, ...props }) => {
    const { playClick } = useSound();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playClick();
        if (props.onClick) props.onClick(e);
    };
    return (
        <button
            {...props}
            onClick={handleClick}
            disabled={isLoading || props.disabled}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-mono font-medium rounded-md text-gray-900 bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? <LoadingSpinner className="h-5 w-5 mr-2 animate-spin" /> : null}
            {children}
        </button>
    )
};

const DataTable: React.FC<{ data: Record<string, any>[] }> = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 italic text-center">No data to display.</p>;
    const headers = Object.keys(data[0]);
    return (
        <div className="overflow-x-auto my-4 border border-cyan-500/30 rounded-lg max-h-80 panel-clip">
            <table className="min-w-full divide-y divide-cyan-500/30">
                <thead className="bg-gray-800 sticky top-0">
                    <tr>
                        {headers.map(header => (
                            <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-700/50 transition-colors duration-200">
                            {headers.map(header => (
                                <td key={`${rowIndex}-${header}`} className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                                    {row[header] === null ? <span className="italic text-gray-500">null</span> : String(row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

declare const Chart: any; // Allow Chart.js from CDN

export const DataManipulationPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { playComplete } = useSound();

    // Step 1
    const [filePrompt, setFilePrompt] = useState("a 10 row CSV file for student grades with columns: student_id, math_score, science_score, history_score. Include some missing values and typos in the scores.");
    const [generatedData, setGeneratedData] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 2
    const [scriptPrompt, setScriptPrompt] = useState("a pandas script to load 'data.csv', fill missing math scores with the column's mean, convert scores to numeric, and create a 'total_score' column.");
    const [processingScript, setProcessingScript] = useState("");
    
    // Step 3
    const [flowSteps, setFlowSteps] = useState<DataFlowStep[]>([]);

    // Step 4
    const [chartPrompt, setChartPrompt] = useState("a bar chart showing the average total_score for each history_score");
    const [chartConfig, setChartConfig] = useState<any>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setGeneratedData(text);
                playComplete();
            };
            reader.readAsText(file);
        }
    };

    const handleGenerateData = useCallback(async () => {
        if (!filePrompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await generateDataFile(filePrompt);
            setGeneratedData(data);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [filePrompt, playComplete]);

    const handleGenerateScript = useCallback(async () => {
        if (!scriptPrompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const script = await generateSoftware(scriptPrompt);
            setProcessingScript(script);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [scriptPrompt, playComplete]);

    const handleVisualize = useCallback(async () => {
        if (!generatedData.trim() || !processingScript.trim()) return;
        setIsLoading(true);
        setError(null);
        setFlowSteps([]);
        try {
            const steps = await visualizeDataFlow(generatedData, processingScript);
            setFlowSteps(steps);
            setCurrentStep(3);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [generatedData, processingScript, playComplete]);
    
    const handleGenerateChart = useCallback(async () => {
        const finalData = flowSteps[flowSteps.length - 1]?.data;
        if (!finalData || !chartPrompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const config = await generateChartConfig(finalData, chartPrompt);
            setChartConfig(config);
            playComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [flowSteps, chartPrompt, playComplete]);

    useEffect(() => {
        if (chartRef.current && chartConfig) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, chartConfig);
            }
        }
         return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartConfig]);
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <TableIcon className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h1 className="text-4xl font-mono font-bold text-cyan-300">Data Manipulation Flow</h1>
                <p className="mt-2 text-lg text-gray-400">Generate, process, and visualize your data pipeline step-by-step.</p>
            </div>
            
            <Stepper currentStep={currentStep} />
            
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md my-4 panel-clip" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {currentStep === 1 && (
                <div className="bg-gray-800/50 border border-cyan-500/30 p-6 space-y-4 shadow-xl animate-fade-in panel-clip">
                    <h2 className="text-2xl font-mono text-cyan-400 flex items-center"><FileIcon className="h-6 w-6 mr-3"/>Step 1: Generate or Upload Data</h2>
                    <label htmlFor="file-prompt" className="block text-sm font-mono font-medium text-cyan-400">Describe the data to generate:</label>
                     <textarea
                        id="file-prompt"
                        value={filePrompt}
                        onChange={(e) => setFilePrompt(e.target.value)}
                        placeholder="e.g., 'a CSV file with user data...'"
                        className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                        disabled={isLoading}
                    />
                    <div className="grid sm:grid-cols-2 gap-4 items-center">
                        <ActionButton onClick={handleGenerateData} isLoading={isLoading}>Generate with AI</ActionButton>
                        <div className="relative">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                            <ActionButton onClick={() => fileInputRef.current?.click()} className="bg-gray-600 hover:bg-gray-700">
                                <UploadIcon className="h-5 w-5 mr-2" /> Upload CSV File
                            </ActionButton>
                        </div>
                    </div>
                    {generatedData && (
                        <div>
                            <h3 className="font-mono text-cyan-400 mt-4">Data Preview:</h3>
                            <pre className="p-4 overflow-x-auto bg-gray-900/70 border border-cyan-500/20 rounded-lg mt-2 max-h-60 panel-clip">
                                <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{generatedData}</code>
                            </pre>
                             <div className="mt-4">
                                <ActionButton onClick={() => setCurrentStep(2)} disabled={!generatedData}>
                                    Next: Define Script <ArrowRightIcon className="h-5 w-5 ml-2"/>
                                </ActionButton>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {currentStep === 2 && (
                 <div className="bg-gray-800/50 border border-cyan-500/30 p-6 space-y-4 shadow-xl animate-fade-in panel-clip">
                    <h2 className="text-2xl font-mono text-cyan-400 flex items-center"><CodeBracketIcon className="h-6 w-6 mr-3"/>Step 2: Define Processing Script</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label htmlFor="script-prompt" className="block text-sm font-mono font-medium text-cyan-400">Describe the script to generate:</label>
                           <textarea
                                id="script-prompt"
                                value={scriptPrompt}
                                onChange={(e) => setScriptPrompt(e.target.value)}
                                placeholder="e.g., 'a script to clean the data...'"
                                className="w-full h-24 p-3 mt-1 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                                disabled={isLoading}
                            />
                            <ActionButton onClick={handleGenerateScript} isLoading={isLoading && !processingScript} className="mt-2">
                               <ChipIcon className="h-5 w-5 mr-2"/> Generate Script with AI
                            </ActionButton>
                        </div>
                         <div>
                            <label htmlFor="script-area" className="block text-sm font-mono font-medium text-cyan-400">Or write/edit your Python script:</label>
                             <textarea
                                id="script-area"
                                value={processingScript}
                                onChange={(e) => setProcessingScript(e.target.value)}
                                placeholder="import pandas as pd..."
                                className="w-full h-48 p-3 mt-1 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <ActionButton onClick={() => setCurrentStep(1)} className="bg-gray-600 hover:bg-gray-700">Back</ActionButton>
                        <ActionButton onClick={handleVisualize} isLoading={isLoading} disabled={!processingScript}>
                            Visualize Data Flow <ArrowRightIcon className="h-5 w-5 ml-2"/>
                        </ActionButton>
                    </div>
                 </div>
            )}
            
            {currentStep === 3 && (
                <div className="bg-gray-800/50 border border-cyan-500/30 p-6 space-y-8 shadow-xl animate-fade-in panel-clip">
                    <h2 className="text-2xl font-mono text-cyan-400 flex items-center"><TableIcon className="h-6 w-6 mr-3"/>Step 3: Visualized Data Flow</h2>
                    {flowSteps.map((step, index) => (
                        <div key={index} className="space-y-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-cyan-500/20 text-cyan-300 font-mono rounded-full h-8 w-8 flex items-center justify-center ring-2 ring-cyan-500/50">{index + 1}</div>
                                <h3 className="ml-4 text-xl font-mono text-teal-300">{step.description}</h3>
                            </div>
                            <CodeBlock code={step.code} />
                            <DataTable data={step.data} />
                            {index < flowSteps.length - 1 && (
                                <div className="flex justify-center">
                                    <ArrowRightIcon className="h-8 w-8 text-gray-600 transform rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                     <div className="flex space-x-4">
                        <ActionButton onClick={() => setCurrentStep(2)} className="bg-gray-600 hover:bg-gray-700">Back</ActionButton>
                        <ActionButton onClick={() => setCurrentStep(4)} disabled={flowSteps.length === 0}>
                           Next: Visualize Output <ArrowRightIcon className="h-5 w-5 ml-2"/>
                        </ActionButton>
                    </div>
                </div>
            )}
            
            {currentStep === 4 && (
                 <div className="bg-gray-800/50 border border-cyan-500/30 p-6 space-y-4 shadow-xl animate-fade-in panel-clip">
                    <h2 className="text-2xl font-mono text-cyan-400 flex items-center"><ChartBarIcon className="h-6 w-6 mr-3"/>Step 4: Visualize Output</h2>
                    <label htmlFor="chart-prompt" className="block text-sm font-mono font-medium text-cyan-400">Describe the chart to generate from the final dataset:</label>
                     <textarea
                        id="chart-prompt"
                        value={chartPrompt}
                        onChange={(e) => setChartPrompt(e.target.value)}
                        placeholder="e.g., a bar chart showing average score by department"
                        className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-200 font-mono"
                        disabled={isLoading}
                    />
                     <ActionButton onClick={handleGenerateChart} isLoading={isLoading}>
                       Generate Chart
                    </ActionButton>
                    
                    {chartConfig && (
                        <div className="mt-6">
                            <h3 className="font-mono text-cyan-400 mb-2">Generated Chart</h3>
                            <div className="p-4 bg-gray-900/70 border border-cyan-500/20 rounded-lg panel-clip">
                                <canvas ref={chartRef}></canvas>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4 mt-4">
                         <ActionButton onClick={() => setCurrentStep(3)} className="bg-gray-600 hover:bg-gray-700">Back to Flow</ActionButton>
                    </div>
                 </div>
            )}

        </div>
    );
};