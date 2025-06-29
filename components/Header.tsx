
import React from 'react';
import { TargetIcon, SoundOnIcon, SoundOffIcon } from './icons';
import { useSound } from '../services/soundService';

export const Header: React.FC = () => {
    const { isMuted, toggleMute } = useSound();

    return (
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5 z-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <TargetIcon className="h-8 w-8 text-cyan-400 animate-pulse" />
                        <h1 className="ml-3 text-2xl font-mono font-bold text-gray-100 tracking-wider glitch-hover">
                            NumPy <span className="text-cyan-400">Unleashed</span>
                        </h1>
                    </div>
                    <div className="flex items-center">
                         <button onClick={toggleMute} className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                            {isMuted ? <SoundOffIcon className="h-6 w-6" /> : <SoundOnIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* HUD-style decorations */}
            <div className="absolute top-2 left-2 font-mono text-xs text-cyan-500/50 hidden md:block">SYS: ONLINE</div>
            <div className="absolute top-2 right-2 font-mono text-xs text-cyan-500/50 hidden md:block">AI_CORE: ACTIVE</div>
            <div className="absolute bottom-1 left-4 w-1/4 h-px bg-cyan-500/30"></div>
            <div className="absolute bottom-1 right-4 w-1/4 h-px bg-cyan-500/30"></div>
        </header>
    );
};