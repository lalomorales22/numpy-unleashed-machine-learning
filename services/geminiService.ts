
import { GoogleGenAI } from "@google/genai";
import { DataFlowStep } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const handleApiError = (error: unknown): Error => {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return new Error('The provided API key is invalid. Please check your configuration.');
        }
        if (error.message.includes('quota')) {
            return new Error('API quota exceeded. Please check your usage limits.');
        }
    }
    return new Error('Failed to communicate with the AI due to an API error.');
};

const parseJsonResponse = (text: string): any => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
        jsonStr = match[1].trim();
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonStr);
        throw new Error("The AI returned an invalid data structure. Please try again.");
    }
};


// --- Existing Service ---

const systemInstructionCode = `You are an expert Python software engineer specializing in NumPy, SciPy, Pandas, and the broader scientific computing ecosystem. Your mission is to generate complete, functional, and well-documented Python scripts based on user requests.

RULES:
1.  **Code Only:** Your output must be ONLY the raw Python code. Do not include any explanatory text, markdown formatting (like \`\`\`python), or any other text before or after the code block.
2.  **Completeness:** The script should be self-contained and runnable. Include necessary imports (pandas, numpy, etc.).
3.  **Best Practices:** Adhere to PEP 8 and use modern, efficient NumPy/Python practices. Add comments where the logic is complex.
4.  **Clarity:** Assume the user will run this code. If visualization is requested, suggest using a library like Matplotlib but include comments explaining how to use it, as you cannot display plots directly.
`;

export const generateSoftware = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                systemInstruction: systemInstructionCode,
                temperature: 0.2,
            },
        });
        return response.text;
    } catch (error) {
        throw handleApiError(error);
    }
};

// --- Data Manipulation Services ---

const systemInstructionData = `You are a data generator. Your task is to create raw data in a specified format based on a user's prompt.

RULES:
1.  **Raw Data Only:** Your output MUST be only the raw data content (e.g., CSV, JSON). Do not include any explanations, variable assignments, or markdown formatting.
2.  **Headers:** For tabular data like CSV, always include a header row.
3.  **Adherence:** Strictly adhere to the format and content requested in the prompt. For example, if asked for missing values, include some empty fields.
`;

export const generateDataFile = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                systemInstruction: systemInstructionData,
                temperature: 0.5,
            },
        });
        return response.text.trim();
    } catch (error) {
        throw handleApiError(error);
    }
};

const systemInstructionFlow = `You are a data processing simulator. Your task is to receive raw data (in CSV format) and a Python script (using Pandas/NumPy). You must execute the script step-by-step in your "mind" and output a JSON array that describes the transformation of the data at each significant step.

RULES:
1.  **JSON Output ONLY:** Your entire response MUST be a single, valid JSON array. Do not include any other text, comments, or markdown formatting like \`\`\`json.
2.  **JSON Schema:** The JSON array must contain objects, each strictly adhering to this schema:
    - \`"description"\`: A brief, one-sentence explanation of what the transformation did (e.g., "Filled missing 'math_score' values with the column mean.").
    - \`"code"\`: The specific line(s) of Python code from the script that performed this transformation.
    - \`"data"\`: A JSON representation of the first 5 rows of the DataFrame *after* the transformation. This MUST be an array of objects.
3.  **Significant Steps:** Identify and report on significant data manipulation steps ONLY: loading data, handling missing values, creating/deleting columns, filtering rows, grouping, aggregation. Do not create a step for every single line of code (e.g., ignore imports, print statements, comments).
4.  **Initial State:** The very first object in the array must represent the initial state of the data after being loaded into a DataFrame. The code for this step should be the pandas read_csv line.
5.  **Data Representation:** In the output JSON \`data\` field, represent any missing or NaN values as JSON \`null\`.
6.  **Readability:** Ensure the output JSON is well-formatted and readable.
`;

export const visualizeDataFlow = async (data: string, script: string): Promise<DataFlowStep[]> => {
    const userPrompt = `
Here is the data (data.csv):
---
${data}
---

Here is the Python script to process it:
---
${script}
---

Simulate the script and provide the JSON output describing the data flow.
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstructionFlow,
                temperature: 0.1,
                responseMimeType: "application/json",
            },
        });
        
        const parsedData = parseJsonResponse(response.text);
        if (Array.isArray(parsedData) && parsedData.every(item => 'description' in item && 'code' in item && 'data' in item)) {
            return parsedData;
        } else {
             throw new Error("AI response was not in the expected format.");
        }

    } catch (error) {
        throw handleApiError(error);
    }
};

const systemInstructionChart = `You are a data visualization expert for Chart.js. You will receive a user prompt describing a chart, and the final data from a Pandas DataFrame in JSON format. Your task is to generate a valid JSON object that can be used as the configuration for a Chart.js chart.

RULES:
1. **JSON Output ONLY:** Your entire response MUST be a single, valid JSON configuration object. Do not include any other text, comments, or markdown.
2. **Schema:** The JSON must define \`type\`, \`data\` (with \`labels\`, \`datasets\`), and \`options\`.
3. **Datasets:** The \`datasets\` array must contain objects with a \`label\` and a \`data\` property (an array of numbers).
4. **Theme:** Use a dark, cyberpunk color theme. Use rgba values for colors like 'rgba(45, 212, 191, 0.7)' (teal), 'rgba(103, 232, 249, 0.7)' (cyan), 'rgba(244, 114, 182, 0.7)' (pink), and 'rgba(192, 132, 252, 0.7)' (purple). The options should include scales with grid color 'rgba(203, 213, 225, 0.1)' and ticks color '#9ca3af'.
5. **Logic:** If the user asks for aggregations (like 'average score by department'), perform the aggregation in your logic before creating the labels and data.
`;

export const generateChartConfig = async (data: Record<string, any>[], prompt: string): Promise<any> => {
    const userPrompt = `
Data:
---
${JSON.stringify(data.slice(0, 20))}
---

Chart Request:
---
${prompt}
---

Generate the Chart.js JSON configuration now.
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstructionChart,
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        });
        return parseJsonResponse(response.text);
    } catch(error) {
        throw handleApiError(error);
    }
}

// --- New Services for Code Optimizer ---

const systemInstructionOptimizer = `You are a NumPy performance expert. You will receive a Python script. Your task is to analyze it and rewrite it using more performant, efficient, and idiomatic NumPy/Pandas operations. Focus on vectorization, avoiding loops, and using memory-efficient methods.

RULES:
1. **Optimized Code Only:** Provide ONLY the rewritten, optimized Python code.
2. **No Explanation:** Do not include any explanatory text, titles, or markdown formatting.
3. **Handle Optimal Code:** If the code is already optimal, return the original code and add a comment at the top like \`# This code is already well-optimized.\`
`;

export const optimizeCode = async (code: string): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: code,
            config: {
                systemInstruction: systemInstructionOptimizer,
                temperature: 0.1,
            },
        });
        return response.text;
    } catch (error) {
        throw handleApiError(error);
    }
}

const systemInstructionExplainer = `You are an expert Python code explainer. You will receive a Python script. Your task is to provide a clear, concise, step-by-step explanation of what the code does.

RULES:
1. **Explanation Only:** Do not include the original code in your response.
2. **Markdown:** Use markdown for formatting (e.g., bullet points, bolding for emphasis).
3. **Clarity over Verbosity:** Explain the 'why' behind the logic, not just the 'what'.
4. **Structure:** Structure your explanation for maximum clarity. Start with a high-level summary, then break down the code into logical blocks or steps.
5. **Identify Issues:** If you spot potential issues like edge cases, performance bottlenecks, or bugs, mention them in a separate "Potential Issues" or "Improvements" section at the end.
`;

export const explainCode = async (code: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: code,
            config: {
                systemInstruction: systemInstructionExplainer,
                temperature: 0.5,
            },
        });
        // Post-process to make it friendlier for the terminal text component
        let text = response.text;
        text = text.replace(/### (.*?)\n/g, '$1\n\n'); //  make headers plain text with newlines
        text = text.replace(/\* /g, '- '); // replace bullet points
        return text;
    } catch (error) {
        throw handleApiError(error);
    }
}