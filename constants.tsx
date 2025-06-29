import React from 'react';
import { Section } from './types';
import { CodeBlock } from './components/CodeBlock';
import { InteractiveVisualization } from './components/InteractiveVisualization';
import { TerminalText } from './components/TerminalText';

const ThemedTable: React.FC<{ headers: string[]; rows: React.ReactNode[][] }> = ({ headers, rows }) => (
    <div className="overflow-x-auto my-6 border border-cyan-500/30 rounded-lg">
        <table className="min-w-full divide-y divide-cyan-500/30">
            <thead className="bg-gray-800">
                <tr>
                    {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-700/50 transition-colors duration-200">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export const courseSections: Section[] = [
    {
        id: 'intro',
        title: 'The Bedrock of Performance',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Deconstructing the NumPy ndarray</h2>
                <p className="mb-6"><TerminalText text="The unparalleled success of Python in the scientific and data-centric domains is not an accident; it is built upon the high-performance foundation of the NumPy library. At the heart of NumPy lies the N-dimensional array, or ndarray, an object whose design is a masterclass in computational efficiency." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">The Contiguous Memory Model</h3>
                 <p className="mb-4"><TerminalText text="The most fundamental distinction between a NumPy ndarray and a standard Python list is how they organize data in memory. A Python list is a collection of pointers, while a NumPy array stores its elements in a single, contiguous block of memory. This architectural choice has profound implications for performance."/></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">The dtype Imperative</h3>
                <p className="mb-4"><TerminalText text="A core constraint of the ndarray is that it is homogeneous; all elements must share the same data type, or dtype. This fixed-size nature eliminates the overhead associated with Python lists and makes dtype selection a primary lever for performance and memory optimization."/></p>
                <ThemedTable 
                    headers={['Data Type (dtype)', 'Memory per Element', 'Numerical Range', 'Typical Use Case']}
                    rows={[
                        [<code>np.int8</code>, '1 byte', '-128 to 127', 'Small integers, image data (e.g., pixel values), status flags.'],
                        [<code>np.int32</code>, '4 bytes', '-2,147,483,648 to 2,147,483,647', 'Standard integer operations, counters, indices for moderate-sized arrays.'],
                        [<code>np.int64</code>, '8 bytes', <>~$ -9 \times 10^{18} $ to $ 9 \times 10^{18} $</>, 'Indices for very large arrays, large integer identifiers.'],
                        [<code>np.float16</code>, '2 bytes', <>Approx. $ \pm 6.55 \times 10^4 $ (low precision)</>, 'GPU computations, deep learning model weights where precision can be sacrificed for speed.'],
                        [<code>np.float32</code>, '4 bytes', <>Approx. $ \pm 3.4 \times 10^{38} $ (single precision)</>, 'Standard scientific computing, machine learning features, when memory is a concern.'],
                        [<code>np.float64</code>, '8 bytes', <>Approx. $ \pm 1.8 \times 10^{308} $ (double precision)</>, 'Default float type; high-precision scientific calculations, financial modeling.'],
                        [<code>np.complex64</code>, '8 bytes', 'Two float32 numbers', 'Signal processing (FFT), quantum mechanics simulations.'],
                        [<code>np.bool_</code>, '1 byte', 'True or False', 'Boolean masks for filtering and indexing.']
                    ]}
                />
            </>
        )
    },
    {
        id: 'indexing-slicing',
        title: 'Advanced Indexing & Slicing',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Selecting Subsets of Data</h2>
                <p className="mb-6"><TerminalText text="Efficiently selecting and manipulating subsets of data is a cornerstone of data analysis. NumPy provides a rich and powerful set of indexing methods that go far beyond Python's standard list indexing. Mastering these techniques is crucial for writing clean, efficient, and expressive code." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Views vs. Copies: A Critical Distinction</h3>
                <p className="mb-4"><TerminalText text="It's vital to understand the difference between a view and a copy. A view is a new array object that looks at the same underlying data as the original array. A copy is a completely new array with its own data." /></p>
                <p className="mt-6 mb-4"><TerminalText text="Use the interactive tool below to see these indexing methods in action. Click the buttons to apply different indexing schemes to a sample array and see the code and results instantly." /></p>
                <InteractiveVisualization type="indexing-slicing" />
            </>
        )
    },
     {
        id: 'manipulation-broadcasting',
        title: 'Array Manipulation & Broadcasting',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Structuring and Combining Data</h2>
                <p className="mb-6"><TerminalText text="Beyond calculations, a significant part of working with data involves changing its shape and combining different arrays. NumPy provides a comprehensive suite of functions for these tasks." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Broadcasting: The Engine of Implicit Parallelism</h3>
                <p className="mb-4"><TerminalText text="Broadcasting is one of NumPy's most powerful features. It describes how NumPy treats arrays with different shapes during arithmetic operations. Instead of creating large temporary arrays, NumPy virtually stretches the smaller array to match the larger one without making copies." /></p>
                <p className="mt-6 mb-4"><TerminalText text="Broadcasting can be non-intuitive at first. The visualization below shows the process step-by-step. See how the smaller array is stretched to enable the element-wise operation." /></p>
                <InteractiveVisualization type="broadcasting" />
            </>
        )
    },
    {
        id: 'toolkit',
        title: 'The Canonical Toolkit',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Mathematical and Scientific Simulation</h2>
                <p className="mb-6"><TerminalText text="Building upon its high-performance foundation, NumPy provides a rich toolkit that transforms abstract mathematical concepts into concrete, computable simulations." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Linear Algebra at Scale</h3>
                <p className="mb-4"><TerminalText text="Linear algebra is the bedrock of quantitative science. NumPy's linalg module provides efficient implementations of core operations like solving systems of linear equations, finding eigenvalues, and Singular Value Decomposition." /></p>
                <CodeBlock code={`import numpy as np

# Let's find the eigenvalues and eigenvectors of a simple matrix
A = np.array([[4, -2],
              [1,  1]])
eigenvalues, eigenvectors = np.linalg.eig(A)`} />
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Stochastic Worlds: Monte Carlo Simulations</h3>
                 <p className="mt-6 mb-4"><TerminalText text="See the concept in action. Use the controls below to run an interactive Monte Carlo simulation directly in your browser and watch the estimate for π converge." /></p>
                <InteractiveVisualization type="monte-carlo-pi" />
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Emergent Systems: Conway's Game of Life</h3>
                <p className="mt-6 mb-4"><TerminalText text="This simple set of rules can lead to incredibly complex and unpredictable patterns. Interact with the simulation below to explore the emergent behavior of Conway's Game of Life." /></p>
                <InteractiveVisualization type="game-of-life" />
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Visualizing the Infinite: Mandelbrot Sets</h3>
                 <p className="mt-6 mb-4"><TerminalText text="Explore the Mandelbrot set's intricate details below. Click on the image to zoom in and reveal the infinite complexity hidden within. Increase the iterations for a sharper, more detailed view." /></p>
                <InteractiveVisualization type="mandelbrot-set" />
            </>
        )
    },
    {
        id: 'statistics',
        title: 'The Statistical Powerhouse',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Understanding Data Distributions</h2>
                <p className="mb-6"><TerminalText text="NumPy is not just about shaping data; it's a powerful engine for understanding it. The library provides a suite of fundamental statistical functions that are highly optimized for speed." /></p>
                <CodeBlock code={`import numpy as np
data = np.random.normal(loc=100, scale=15, size=500)
mean_val = np.mean(data)
median_val = np.median(data)
std_val = np.std(data)`} />
                <p className="mt-6 mb-4"><TerminalText text="Theory is one thing, but seeing these concepts live is another. Use the dashboard below to generate data and watch how its statistical properties and distribution shape change in real-time." /></p>
                <InteractiveVisualization type="statistics-dashboard" />
            </>
        )
    },
    {
        id: 'performance',
        title: 'Performance & Profiling',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">Writing Efficient Code</h2>
                <p className="mb-6"><TerminalText text="In data science, speed is a feature. NumPy's core design philosophy is built around performance, and understanding how to leverage it is what separates a novice from an expert."/></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Vectorization: The Key to Speed</h3>
                <p className="mb-4"><TerminalText text="Vectorization is the practice of applying operations to entire arrays instead of iterating through elements one by one. This pushes the looping logic down from the slow Python interpreter to NumPy's highly optimized, compiled C code." /></p>
                <p className="mt-6 mb-4"><TerminalText text="The difference between looped and vectorized code can be staggering. Use the Code Profiler below to see this for yourself. Pit a standard Python loop against its NumPy equivalent and witness the performance gap." /></p>
                <InteractiveVisualization type="code-profiler" />
            </>
        )
    },
    {
        id: 'analytics',
        title: 'The Lingua Franca of Data',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">The Backbone of Modern Analytics</h2>
                <p className="mb-6"><TerminalText text="Beyond pure mathematical simulation, NumPy serves as the fundamental data interchange format—the lingua franca—for the entire Python data science ecosystem. Its ndarray is the invisible foundation upon which popular libraries are built." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Powering the Pandas DataFrame</h3>
                <p className="mb-4"><TerminalText text="At its core, a Pandas DataFrame is a container of Series objects, and each Series is conceptually a one-dimensional labeled NumPy array. The efficiency of Pandas comes from delegating work to NumPy's vectorized operations." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">From Pixels to Tensors</h3>
                <p className="mb-4"><TerminalText text="An image can be naturally represented as a NumPy array. Detecting edges can be achieved by convolving the image array with a kernel like the Sobel operator, a foundational concept in computer vision and deep learning." /></p>
            </>
        )
    },
    {
        id: 'ai-ml',
        title: 'Architecting Intelligence',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">NumPy's Role in AI & ML</h2>
                 <p className="mb-6"><TerminalText text="NumPy's influence extends deep into the architecture of modern artificial intelligence and machine learning systems. It is not merely a preprocessing tool but a core structural component." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">The Scikit-learn API Contract</h3>
                <p className="mb-4"><TerminalText text="Scikit-learn's celebrated ease of use is a direct result of a standardized API centered on the NumPy ndarray. The `.fit(X, y)` method expects X to be a 2D ndarray and y to be a 1D ndarray." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">The Deep Learning Bridge</h3>
                 <p className="mb-4"><TerminalText text="Deep learning frameworks like PyTorch and TensorFlow introduced the Tensor, which adds native GPU acceleration and automatic differentiation. However, their APIs were designed to be NumPy-like, and they feature zero-copy conversion functions, making NumPy the universal bridge for data preprocessing." /></p>
            </>
        )
    },
    {
        id: 'frontier',
        title: 'Frontier Applications',
        content: (
            <>
                <h2 className="text-3xl font-mono text-cyan-400 mb-4">The Uncharted Territory</h2>
                <p className="mb-6"><TerminalText text="While NumPy is a mature library, its core paradigm is far from exhausted. The next frontiers lie in using the ndarray to represent and compute on increasingly abstract concepts." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Computational Biology & Digital Twins</h3>
                <p className="mb-4"><TerminalText text="The future involves simulating entire systems, like the dynamic shapes of a protein or a full 'Digital Twin' of a physical asset, by representing their complete state within high-dimensional or structured NumPy arrays. This allows for unprecedented analysis and prediction." /></p>
                <h3 className="text-2xl font-mono text-teal-400 mt-8 mb-4">Neuro-Symbolic AI</h3>
                <p className="mb-4"><TerminalText text="A major frontier is combining neural networks with logical reasoning. A speculative idea is to build a high-performance logical inference engine using NumPy, where a knowledge graph is an adjacency matrix and logical rules are custom vectorized functions. This would transform logical reasoning into a massively parallel numerical computation." /></p>
            </>
        )
    },
];