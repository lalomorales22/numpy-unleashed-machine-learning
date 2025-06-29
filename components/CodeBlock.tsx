
import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';
import { useSound } from '../services/soundService';

interface CodeBlockProps {
    code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { playClick } = useSound();

    const handleCopy = useCallback(() => {
        playClick();
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [code, playClick]);

    return (
        <div className="bg-gray-900/70 border border-cyan-500/20 my-6 relative group panel-clip">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-gray-700/50 rounded-md text-gray-400 hover:bg-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy code"
            >
                {isCopied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
            </button>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {code}
                </code>
            </pre>
        </div>
    );
};