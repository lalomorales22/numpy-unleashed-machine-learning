
# NumPy Unleashed: AI Code Forge

**Live Demo:** [https://lalomorales22.github.io/numpy-unleashed/](https://lalomorales22.github.io/numpy-unleashed/)



## Overview

**NumPy Unleashed** is a next-generation, interactive educational platform designed to teach the Python NumPy library in a way that is engaging, intuitive, and fun. Moving beyond static text and simple code examples, this application immerses the user in a "tactical gear" themed environment where learning is accomplished through hands-on interaction, dynamic visualizations, and a suite of powerful AI-powered tools.

Built with React, TypeScript, and the Google Gemini API, this app serves as both a comprehensive course and a practical sandbox for data science experimentation.

## Core Features

### 1. Interactive Course Modules
A full curriculum that takes you from the fundamentals of the `ndarray` to advanced applications in AI and scientific computing.
- **Foundational Concepts:** Understand NumPy's memory model, dtypes, and performance characteristics.
- **Core Skills:** Master advanced indexing, slicing, array manipulation, and broadcasting.
- **The Canonical Toolkit:** Explore practical applications like linear algebra, Monte Carlo simulations, Conway's Game of Life, and fractal generation.
- **Real-World Context:** Learn how NumPy powers the data science ecosystem, including Pandas, Scikit-learn, and even deep learning frameworks.

### 2. Dynamic Visualizations
Abstract concepts are made concrete through custom-built interactive widgets:
- **Indexing & Slicing Sandbox:** Click to apply different indexing methods to an array and see the results highlighted in real-time.
- **Broadcasting Animator:** Watch how NumPy "stretches" arrays to perform operations, demystifying this powerful concept.
- **Live Simulations:** Interact with Conway's Game of Life, generate points to estimate π, and explore the infinite complexity of the Mandelbrot set by zooming in.
- **Statistics Dashboard:** Generate sample data and see its statistical properties and distribution histogram update instantly.
- **Code Profiler:** Pit a standard Python loop against a vectorized NumPy operation and see a visual comparison of the dramatic speed difference.

### 3. AI-Powered Tools
Integrated tools built on the Gemini API that provide practical, hands-on assistance:
- **AI Code Forge:** Describe a script in plain English, and the AI will generate the complete, runnable Python code.
- **Data Manipulation Flow:** A four-step visual pipeline where you can generate or upload data, define a processing script, see a step-by-step visualization of how your data is transformed, and finally, generate charts from the output.
- **AI Code Optimizer:** Paste your own Python code, and the AI will refactor it into a more performant, vectorized version while also providing a detailed, line-by-line explanation of what your code does.

### 4. Immersive "Tactical" UI/UX
A unique and memorable user interface that makes learning feel like a mission.
- **HUD-Style Design:** The UI features angular panels, glowing accents, and system status indicators.
- **Animated Background:** A subtle, animated grid and scanline effect create an immersive high-tech feel.
- **Terminal Text Effect:** Course content and AI explanations are rendered as if being typed on a retro terminal.
- **Sound Design:** Tactile audio feedback for UI interactions enhances the immersive experience (with a global mute toggle, of course).

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI & Code Generation:** Google Gemini API (`@google/genai`)
- **Charting:** Chart.js
- **UI:** Custom components, framer-motion for animations (conceptual)

## Getting Started

To run this application locally, you'll need a modern web browser and Node.js installed.

### 1. Clone the Repository

```bash
git clone https://github.com/lalomorales22/numpy-unleashed.git
cd numpy-unleashed
```

### 2. Install Dependencies

This project uses npm. Run the following command in the root directory:
```bash
npm install
```

### 3. Set Up Your API Key

The application requires a Google Gemini API key to function.

1.  Create a file named `.env` in the root of the project.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Add your Gemini API key to the `.env` file:

    ```
    # .env
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

> **Note:** The development server (Vite) automatically loads environment variables from this file. Your API key is used directly from the browser, so do not deploy this publicly without securing the key.

### 4. Run the Development Server

Once the dependencies are installed and your API key is set, you can start the local development server:

```bash
npm run dev
```

This will start the application, and you can access it in your browser at the local address provided (usually `http://localhost:5173`).
