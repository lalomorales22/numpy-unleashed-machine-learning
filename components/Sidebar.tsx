
import React from 'react';
import { courseSections } from '../constants';
import { BookIcon, ChipIcon, TableIcon, WrenchScrewdriverIcon } from './icons';
import { useSound } from '../services/soundService';

interface SidebarProps {
    activeSectionId: string;
    onSelectSection: (id: string) => void;
}

const NavItem: React.FC<{ id: string; title: string; icon: React.ReactNode; isActive: boolean; onClick: (id: string) => void; }> = ({ id, title, icon, isActive, onClick }) => {
    const { playClick } = useSound();
    const baseClasses = "flex items-center px-4 py-3 my-1 text-sm font-mono rounded-md cursor-pointer transition-all duration-200 ease-in-out transform hover:translate-x-1";
    const activeClasses = "bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-400";
    const inactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200";

    const handleClick = () => {
        playClick();
        onClick(id);
    };

    return (
        <li onClick={handleClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <span className="mr-3">{icon}</span>
            {title}
        </li>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeSectionId, onSelectSection }) => {
    return (
        <aside className="w-64 bg-gray-900/80 backdrop-blur-sm border-r border-cyan-500/30 p-4 flex-shrink-0 overflow-y-auto hidden md:block">
            <nav>
                <ul>
                    <li className="px-4 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Interactive Tools</li>
                    <NavItem
                        id="ai-forge"
                        title="AI Code Forge"
                        icon={<ChipIcon className="h-5 w-5" />}
                        isActive={activeSectionId === 'ai-forge'}
                        onClick={onSelectSection}
                    />
                    <NavItem
                        id="data-manipulation"
                        title="Data Manipulation"
                        icon={<TableIcon className="h-5 w-5" />}
                        isActive={activeSectionId === 'data-manipulation'}
                        onClick={onSelectSection}
                    />
                    <NavItem
                        id="code-optimizer"
                        title="Code Optimizer"
                        icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
                        isActive={activeSectionId === 'code-optimizer'}
                        onClick={onSelectSection}
                    />
                     <li className="px-4 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Course Modules</li>
                    {courseSections.map((section) => (
                        <NavItem
                            key={section.id}
                            id={section.id}
                            title={section.title}
                            icon={<BookIcon className="h-5 w-5" />}
                            isActive={activeSectionId === section.id}
                            onClick={onSelectSection}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};