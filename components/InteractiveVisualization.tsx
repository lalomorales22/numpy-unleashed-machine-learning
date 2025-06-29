import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon, PlusIcon, ZoomInIcon, LoadingSpinner, CodeBracketIcon, ResizeIcon, ChartBarIcon, LightningBoltIcon } from './icons';
import { useSound } from '../services/soundService';

const SIMULATION_THEME = {
    background: '#111827', // gray-900
    gridLines: '#374151', // gray-700
    liveCell: '#2dd4bf', // teal-400
    deadCell: '#1f2937', // gray-800
    infoText: '#9ca3af', // gray-400
    valueText: '#67e8f9', // cyan-300
    pointIn: '#2dd4bf', // teal-400
    pointOut: '#f472b6', // pink-400,
    highlightCell: 'rgba(56, 189, 248, 0.5)', // sky-500 with opacity
    highlightBorder: '#0ea5e9', // sky-500,
    histogramBar: '#2dd4bf', // teal-400
};

const ControlButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode, active?: boolean }> = ({ children, active, ...props }) => {
    const { playClick } = useSound();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playClick();
        if (props.onClick) props.onClick(e);
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            className={`flex items-center justify-center px-4 py-2 border border-cyan-500/30 text-sm font-mono rounded-md text-cyan-300 ${active ? 'bg-cyan-500/30' : 'bg-gray-800'} hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
            {children}
        </button>
    );
};


const INDEXING_SELECTIONS: { [key: string]: { code: string; cells: [number, number][] } } = {
    "Basic Slice": { code: "data[1:4, 1:4]", cells: [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]},
    "Fancy Index": { code: "data[[0, 4], [1, 3]]", cells: [[0,1], [4,3]] },
    "Boolean Mask": { code: "data[data > 18]", cells: [[3,4], [4,0], [4,1], [4,2], [4,3], [4,4]]},
    "Column Slice": { code: "data[:, 2]", cells: [[0,2], [1,2], [2,2], [3,2], [4,2]] },
};

// --- Indexing & Slicing Visualization ---
const IndexingSlicingViz: React.FC = () => {
    const originalArray = React.useMemo(() => {
        const arr = new Array(5).fill(0).map(() => new Array(5).fill(0));
        for(let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                arr[i][j] = i * 5 + j;
            }
        }
        return arr;
    }, []);
    
    const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);
    const [selectionText, setSelectionText] = useState(INDEXING_SELECTIONS["Basic Slice"].code);

    useEffect(() => {
        // Set initial highlight
        setHighlightedCells(INDEXING_SELECTIONS["Basic Slice"].cells);
    }, []);

    const handleSelection = (type: keyof typeof INDEXING_SELECTIONS) => {
        setHighlightedCells(INDEXING_SELECTIONS[type].cells);
        setSelectionText(INDEXING_SELECTIONS[type].code);
    };

    const isHighlighted = (r: number, c: number) => {
        return highlightedCells.some(([hr, hc]) => hr === r && hc === c);
    };

    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 space-y-4 panel-clip">
            <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-1 p-2 bg-gray-800 rounded-md">
                    {originalArray.map((row, r) =>
                        row.map((val, c) => (
                            <div key={`${r}-${c}`} className={`w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md transition-all duration-300 ${isHighlighted(r, c) ? 'bg-sky-500/70 text-white scale-110' : 'bg-gray-700 text-gray-300'}`}>
                                {val}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="h-10 flex items-center justify-center bg-gray-900 rounded-md">
                <p className="font-mono text-amber-400">{selectionText}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {Object.keys(INDEXING_SELECTIONS).map((key) => {
                    const selectionKey = key as keyof typeof INDEXING_SELECTIONS;
                    return (
                        <ControlButton key={key} onClick={() => handleSelection(selectionKey)} active={selectionText === INDEXING_SELECTIONS[selectionKey].code}>
                            <CodeBracketIcon className="h-5 w-5 mr-2"/> {key}
                        </ControlButton>
                    );
                })}
            </div>
        </div>
    );
};


// --- Broadcasting Visualization ---
const BroadcastingViz: React.FC = () => {
    const [arrayA] = useState([[10, 20, 30], [40, 50, 60], [70, 80, 90]]);
    const [arrayB] = useState([1, 2, 3]);
    const [result, setResult] = useState<number[][] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [step, setStep] = useState(0); // 0: idle, 1: broadcasting B, 2: calculating result

    const runAnimation = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setResult(null);
        setStep(1); // Start broadcasting B

        setTimeout(() => {
            setStep(2); // Start calculating result
            const newResult = arrayA.map(row => row.map((val, c) => val + arrayB[c]));
            setResult(newResult);
        }, 1500);

        setTimeout(() => {
            setIsAnimating(false);
            setStep(0);
        }, 3000);
    };

    const renderGrid = (grid: number[][], highlight?: boolean) => (
         <div className={`grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded-md ${highlight ? 'shadow-lg shadow-cyan-500/30' : ''}`}>
            {grid.map((row, r) =>
                row.map((val, c) => (
                    <div key={`${r}-${c}`} className="w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md bg-gray-700 text-gray-300">
                        {val}
                    </div>
                ))
            )}
        </div>
    );
    
    return (
         <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 space-y-4 panel-clip">
            <div className="flex flex-wrap items-center justify-around gap-4">
                <div>
                    <p className="font-mono text-cyan-400 text-center mb-2">Array A (3x3)</p>
                    {renderGrid(arrayA)}
                </div>
                <div className="text-4xl font-mono text-teal-400 self-center">+</div>
                 <div>
                    <p className="font-mono text-cyan-400 text-center mb-2">Array B (1x3)</p>
                    <div className="grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded-md">
                        {arrayB.map((val, c) => (
                            <div key={c} className="w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md bg-gray-700 text-gray-300">
                                {val}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="flex items-center justify-center">
                 <ControlButton onClick={runAnimation} disabled={isAnimating}>
                     <ResizeIcon className="h-5 w-5 mr-2" /> {isAnimating ? 'Visualizing...' : 'Visualize Broadcast'}
                 </ControlButton>
            </div>
             <div className="flex flex-col items-center justify-center space-y-4 min-h-[180px]">
                {step === 1 && (
                    <div className="text-center animate-fade-in">
                        <p className="font-mono text-cyan-400 mb-2">Broadcasting B to match A's shape...</p>
                        <div className="grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded-md">
                            {[0,1,2].map(r => (
                                arrayB.map((val, c) => (
                                    <div key={`${r}-${c}`} className="w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md bg-teal-500/50 text-white animate-pop-in" style={{animationDelay: `${r * 150}ms`}}>
                                        {val}
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                )}
                {step === 2 && (
                     <div className="text-center animate-fade-in">
                         <p className="font-mono text-cyan-400 text-center mb-2">Result (A + B)</p>
                         <div className={`grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded-md`}>
                            {result && result.map((row, r) =>
                                row.map((val, c) => (
                                    <div key={`${r}-${c}`} className="w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md bg-sky-500/70 text-white animate-pop-in" style={{animationDelay: `${(r*3+c) * 50}ms`}}>
                                        {val}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

// --- Conway's Game of Life Visualization ---

const GameOfLife: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<number[][]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const animationFrameId = useRef<number | undefined>(undefined);

    const numCols = 50;
    const numRows = 30;

    const generateEmptyGrid = useCallback(() => {
        return Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));
    }, [numRows, numCols]);

    const randomizeGrid = useCallback(() => {
        const newGrid = Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => (Math.random() > 0.75 ? 1 : 0))
        );
        setGrid(newGrid);
    }, [numRows, numCols]);

    useEffect(() => {
        randomizeGrid();
    }, [randomizeGrid]);

    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, gridToDraw: number[][]) => {
        if (!gridToDraw.length || !gridToDraw[0].length) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const cellWidth = ctx.canvas.width / numCols;
        const cellHeight = ctx.canvas.height / numRows;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                ctx.fillStyle = gridToDraw[row][col] ? SIMULATION_THEME.liveCell : SIMULATION_THEME.deadCell;
                ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                ctx.strokeStyle = SIMULATION_THEME.gridLines;
                ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
        }
    }, [numRows, numCols]);
    
    const runSimulationStep = useCallback(() => {
        setGrid(g => {
            if (!g.length || !g[0].length) return g;

            const nextGrid = generateEmptyGrid();
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    let neighbors = 0;
                    const positions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                    positions.forEach(([x, y]) => {
                        const newI = (i + x + numRows) % numRows;
                        const newJ = (j + y + numCols) % numCols;
                        neighbors += g[newI][newJ];
                    });

                    const cell = g[i][j];
                    if (cell === 1) { // Live cell
                        if (neighbors < 2 || neighbors > 3) {
                            nextGrid[i][j] = 0; // Dies
                        } else {
                            nextGrid[i][j] = 1; // Survives
                        }
                    } else { // Dead cell
                        if (neighbors === 3) {
                            nextGrid[i][j] = 1; // Is born
                        }
                    }
                }
            }
            return nextGrid;
        });
    }, [generateEmptyGrid, numRows, numCols]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        drawGrid(ctx, grid);
    }, [grid, drawGrid]);

    useEffect(() => {
        if (isRunning) {
            const loop = () => {
                runSimulationStep();
                animationFrameId.current = window.setTimeout(loop, 100);
            };
            animationFrameId.current = window.setTimeout(loop, 100);
        }
        return () => {
            if (animationFrameId.current) {
                window.clearTimeout(animationFrameId.current);
            }
        };
    }, [isRunning, runSimulationStep]);


    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 panel-clip">
            <canvas ref={canvasRef} width="600" height="360" className="w-full h-auto bg-gray-800 rounded-md" />
            <div className="flex items-center justify-center space-x-4 mt-4">
                <ControlButton onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? <PauseIcon className="h-5 w-5 mr-2" /> : <PlayIcon className="h-5 w-5 mr-2" />}
                    {isRunning ? 'Pause' : 'Play'}
                </ControlButton>
                <ControlButton onClick={randomizeGrid} disabled={isRunning}>
                    <RefreshIcon className="h-5 w-5 mr-2" /> Randomize
                </ControlButton>
                 <ControlButton onClick={() => {
                     setIsRunning(false);
                     setGrid(generateEmptyGrid());
                 }}>
                    Reset
                </ControlButton>
            </div>
        </div>
    );
};

// --- Monte Carlo Pi Estimation Visualization ---

const MonteCarloPi: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<{x: number, y: number, inCircle: boolean}[]>([]);
    const [piEstimate, setPiEstimate] = useState(0);

    const insideCircleCount = points.filter(p => p.inCircle).length;
    const totalPoints = points.length;
    
    useEffect(() => {
        setPiEstimate(totalPoints > 0 ? 4 * insideCircleCount / totalPoints : 0);
    }, [insideCircleCount, totalPoints]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = SIMULATION_THEME.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw circle
        ctx.strokeStyle = SIMULATION_THEME.valueText;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw points
        points.forEach(p => {
            ctx.fillStyle = p.inCircle ? SIMULATION_THEME.pointIn : SIMULATION_THEME.pointOut;
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, [points]);

    useEffect(() => {
        draw();
    }, [draw]);

    const addPoints = (count: number) => {
        const newPoints = [...points];
        for (let i = 0; i < count; i++) {
            const x = Math.random();
            const y = Math.random();
            // distance from center (0.5, 0.5)
            const dx = x - 0.5;
            const dy = y - 0.5;
            const inCircle = dx * dx + dy * dy <= 0.25;
            newPoints.push({ x, y, inCircle });
        }
        setPoints(newPoints);
    };
    
    const reset = () => setPoints([]);

    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 panel-clip">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <canvas ref={canvasRef} width="400" height="400" className="w-full h-auto bg-gray-800 rounded-md" />
                </div>
                <div className="flex flex-col justify-center items-center space-y-4 p-4 bg-gray-800/50 rounded-lg panel-clip">
                    <div className="text-center">
                        <p className="text-lg font-mono text-gray-400">π Estimate</p>
                        <p className="text-4xl font-mono font-bold text-cyan-300 tracking-wider">{piEstimate.toFixed(5)}</p>
                    </div>
                     <div className="text-center">
                        <p className="font-mono text-gray-400">Points Inside</p>
                        <p className="text-xl font-mono text-teal-400">{insideCircleCount.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-mono text-gray-400">Total Points</p>
                        <p className="text-xl font-mono text-gray-300">{totalPoints.toLocaleString()}</p>
                    </div>
                    <div className="w-full pt-4 border-t border-cyan-500/20 space-y-2">
                         <ControlButton onClick={() => addPoints(1000)} className="w-full">
                            <PlusIcon className="h-5 w-5 mr-2" /> Add 1,000
                        </ControlButton>
                         <ControlButton onClick={() => addPoints(10000)} className="w-full">
                            <PlusIcon className="h-5 w-5 mr-2" /> Add 10,000
                        </ControlButton>
                        <ControlButton onClick={reset} className="w-full bg-gray-700 hover:bg-red-800/50">
                            Reset
                        </ControlButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Mandelbrot Set Visualization ---

const INITIAL_VIEW = { xmin: -2.0, xmax: 1.0, ymin: -1.5, ymax: 1.5 };

const MandelbrotSet: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [view, setView] = useState(INITIAL_VIEW);
    const [maxIter, setMaxIter] = useState(100);
    const [isRendering, setIsRendering] = useState(true);
    const { playClick } = useSound();

    const getColor = (iter: number, maxIterations: number): [number, number, number] => {
        if (iter === maxIterations) return [0, 0, 0]; // Black for points in the set
        const t = iter / maxIterations;
        const r = Math.min(255, 255 * (t * 3.5));
        const g = Math.min(255, Math.max(0, 255 * (t * 2.5 - 0.5)));
        const b = Math.min(255, Math.max(0, 255 * (t * 1.5 - 1.0)));
        return [r,g,b];
    };

    const drawMandelbrot = useCallback(() => {
        setIsRendering(true);
        // Use a timeout to allow the UI to update (show loading spinner) before the heavy calculation
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
    
            const { width, height } = canvas;
            const { xmin, xmax, ymin, ymax } = view;
    
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;
    
            for (let px = 0; px < width; px++) {
                for (let py = 0; py < height; py++) {
                    const cx = xmin + (px / width) * (xmax - xmin);
                    const cy = ymin + (py / height) * (ymax - ymin);
                    let zx = 0, zy = 0, iter = 0;
    
                    while (zx * zx + zy * zy <= 4 && iter < maxIter) {
                        const xtemp = zx * zx - zy * zy + cx;
                        zy = 2 * zx * zy + cy;
                        zx = xtemp;
                        iter++;
                    }
    
                    const color = getColor(iter, maxIter);
                    const pixelIndex = (py * width + px) * 4;
                    data[pixelIndex] = color[0];
                    data[pixelIndex + 1] = color[1];
                    data[pixelIndex + 2] = color[2];
                    data[pixelIndex + 3] = 255;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            setIsRendering(false);
        }, 10);
    }, [view, maxIter]);

    useEffect(() => {
        drawMandelbrot();
    }, [drawMandelbrot]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isRendering) return;
        playClick();
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;

        const { xmin, xmax, ymin, ymax } = view;
        const rangeX = xmax - xmin;
        const rangeY = ymax - ymin;

        const newCenterX = xmin + (px / canvas.width) * rangeX;
        const newCenterY = ymin + (py / canvas.height) * rangeY;

        const zoomFactor = 2.5;
        const newRangeX = rangeX / zoomFactor;
        const newRangeY = rangeY / zoomFactor;

        setView({
            xmin: newCenterX - newRangeX / 2,
            xmax: newCenterX + newRangeX / 2,
            ymin: newCenterY - newRangeY / 2,
            ymax: newCenterY + newRangeY / 2
        });
    };

    return (
         <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 panel-clip">
            <div className="relative">
                <canvas 
                    ref={canvasRef} 
                    width="600" 
                    height="600" 
                    className={`w-full h-auto bg-gray-800 rounded-md ${isRendering ? 'cursor-wait' : 'cursor-zoom-in'}`}
                    onClick={handleCanvasClick}
                />
                {isRendering && (
                    <div className="absolute inset-0 bg-gray-900/50 flex flex-col items-center justify-center rounded-md">
                        <LoadingSpinner className="h-12 w-12 text-cyan-400 animate-spin" />
                        <p className="text-cyan-400 font-mono mt-4">Rendering...</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <ControlButton onClick={() => setView(INITIAL_VIEW)} disabled={isRendering}>
                    <RefreshIcon className="h-5 w-5 mr-2" /> Reset View
                </ControlButton>
                <div className="flex items-center space-x-2">
                    <label htmlFor="maxIter" className="font-mono text-sm text-gray-400">Iterations:</label>
                    <input
                        type="number"
                        id="maxIter"
                        value={maxIter}
                        onChange={(e) => setMaxIter(Number(e.target.value))}
                        className="bg-gray-900 text-cyan-300 border border-cyan-500/30 rounded-md w-24 p-1 text-center font-mono"
                        step="50"
                        min="50"
                        disabled={isRendering}
                    />
                </div>
                 <p className="text-sm text-gray-500 font-mono hidden sm:block">
                    <ZoomInIcon className="h-5 w-5 inline-block mr-2" />
                    Click image to zoom
                 </p>
            </div>
        </div>
    );
}

// --- Statistics Dashboard Visualization ---
const StatisticsDashboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<number[]>([]);
    const [stats, setStats] = useState({ mean: 0, median: 0, std: 0, variance: 0 });

    const generateData = useCallback(() => {
        // Simple normal-ish distribution using Central Limit Theorem
        const newData = Array.from({ length: 500 }, () => {
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                sum += Math.random();
            }
            return (sum - 6) * 15 + 100; // Scale to a reasonable range (e.g. IQ scores)
        });
        setData(newData);
    }, []);

    useEffect(() => {
        generateData();
    }, [generateData]);

    useEffect(() => {
        if (data.length === 0) return;
        
        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / data.length;
        
        const sortedData = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sortedData.length / 2);
        const median = sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;

        const variance = data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length;
        const std = Math.sqrt(variance);

        setStats({ mean, median, std, variance });

        // Draw histogram
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const min = Math.min(...data);
        const max = Math.max(...data);
        const numBins = 20;
        const binWidth = (max - min) / numBins;
        const bins = new Array(numBins).fill(0);

        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
            bins[binIndex]++;
        });

        const maxBinCount = Math.max(...bins);
        const barWidth = width / numBins;
        
        ctx.fillStyle = SIMULATION_THEME.histogramBar;
        bins.forEach((count, i) => {
            const barHeight = (count / maxBinCount) * height;
            ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        });

    }, [data]);

    const StatCard: React.FC<{label: string, value: number}> = ({ label, value }) => (
        <div className="bg-gray-800/50 p-3 rounded-lg text-center panel-clip">
            <p className="text-sm font-mono text-gray-400">{label}</p>
            <p className="text-xl font-mono text-cyan-300">{value.toFixed(2)}</p>
        </div>
    );

    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 panel-clip">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <canvas ref={canvasRef} width="400" height="250" className="w-full h-auto bg-gray-800 rounded-md" />
                </div>
                <div className="flex flex-col justify-between space-y-4">
                     <div className="grid grid-cols-2 gap-2">
                        <StatCard label="Mean" value={stats.mean} />
                        <StatCard label="Median" value={stats.median} />
                        <StatCard label="Std. Dev." value={stats.std} />
                        <StatCard label="Variance" value={stats.variance} />
                    </div>
                    <ControlButton onClick={generateData} className="w-full">
                        <RefreshIcon className="h-5 w-5 mr-2" /> Generate New Data
                    </ControlButton>
                </div>
            </div>
        </div>
    );
};

// --- Code Profiler Visualization ---
const CodeProfiler: React.FC = () => {
    const defaultLoopCode = `# Calculate element-wise product for a large list
result = []
for i in range(len(list_a)):
    result.append(list_a[i] * list_b[i])`;

    const defaultVectorizedCode = `# Use NumPy's vectorized multiplication
result = np_array_a * np_array_b`;

    const [results, setResults] = useState<{loopTime: number, vectorizedTime: number} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { playComplete } = useSound();

    const runProfiler = () => {
        setIsLoading(true);
        setResults(null);
        setTimeout(() => {
            const vectorizedTime = Math.random() * 5 + 2; // 2ms to 7ms
            const loopTime = vectorizedTime * (Math.random() * 50 + 40); // 40x to 90x slower
            setResults({ loopTime, vectorizedTime });
            setIsLoading(false);
            playComplete();
        }, 1500);
    };

    const speedup = results ? (results.loopTime / results.vectorizedTime).toFixed(1) : 0;
    const loopBarWidth = results ? 100 : 0;
    const vectorizedBarWidth = results ? (results.vectorizedTime / results.loopTime) * 100 : 0;

    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 rounded-lg p-4 space-y-4 panel-clip">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-mono text-teal-400 mb-2">Standard Python Loop</h3>
                    <div className="bg-gray-900 rounded-lg p-3 h-32 font-mono text-sm text-gray-300 panel-clip">
                        <pre><code>{defaultLoopCode}</code></pre>
                    </div>
                </div>
                <div>
                    <h3 className="font-mono text-teal-400 mb-2">Vectorized NumPy</h3>
                    <div className="bg-gray-900 rounded-lg p-3 h-32 font-mono text-sm text-gray-300 panel-clip">
                        <pre><code>{defaultVectorizedCode}</code></pre>
                    </div>
                </div>
            </div>
            <ControlButton onClick={runProfiler} disabled={isLoading} className="w-full">
                <LightningBoltIcon className="h-5 w-5 mr-2" /> {isLoading ? 'Profiling...' : 'Run Profiler'}
            </ControlButton>

            <div className="pt-4 min-h-[120px]">
                {isLoading && <div className="flex justify-center"><LoadingSpinner className="h-8 w-8 text-cyan-400 animate-spin"/></div>}
                {results && (
                     <div className="space-y-3 animate-fade-in">
                        <div className="space-y-2">
                             <div>
                                <div className="flex justify-between font-mono text-sm mb-1">
                                    <span className="text-gray-400">Loop Time</span>
                                    <span className="text-red-400">{results.loopTime.toFixed(2)} ms</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div className="bg-red-500 h-4 rounded-full" style={{ width: `${loopBarWidth}%` }}></div>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between font-mono text-sm mb-1">
                                    <span className="text-gray-400">Vectorized Time</span>
                                    <span className="text-green-400">{results.vectorizedTime.toFixed(2)} ms</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${vectorizedBarWidth}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center bg-gray-800/50 rounded-lg p-3 panel-clip">
                            <p className="font-mono text-2xl text-cyan-300">NumPy is <span className="font-bold text-4xl text-green-400">{speedup}x</span> faster!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


type VisualizationType = 'game-of-life' | 'monte-carlo-pi' | 'mandelbrot-set' | 'indexing-slicing' | 'broadcasting' | 'statistics-dashboard' | 'code-profiler';

interface InteractiveVisualizationProps {
    type: VisualizationType;
}

export const InteractiveVisualization: React.FC<InteractiveVisualizationProps> = ({ type }) => {
    switch (type) {
        case 'game-of-life':
            return <GameOfLife />;
        case 'monte-carlo-pi':
            return <MonteCarloPi />;
        case 'mandelbrot-set':
            return <MandelbrotSet />;
        case 'indexing-slicing':
            return <IndexingSlicingViz />;
        case 'broadcasting':
            return <BroadcastingViz />;
        case 'statistics-dashboard':
            return <StatisticsDashboard />;
        case 'code-profiler':
            return <CodeProfiler />;
        default:
            return <div className="text-red-500">Error: Unknown visualization type.</div>;
    }
};