
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CourseContent } from './components/CourseContent';
import { AIGenerator } from './components/AIGenerator';
import { DataManipulationPage } from './components/DataManipulationPage';
import { CodeOptimizerPage } from './components/CodeOptimizerPage';
import { courseSections } from './constants';
import { Section } from './types';

const App: React.FC = () => {
    const [activeSectionId, setActiveSectionId] = useState<string>('intro');

    const handleSelectSection = useCallback((id: string) => {
        setActiveSectionId(id);
    }, []);
    
    const activeSection: Section | undefined = courseSections.find(s => s.id === activeSectionId);

    const renderContent = () => {
        switch (activeSectionId) {
            case 'ai-forge':
                return <AIGenerator />;
            case 'data-manipulation':
                return <DataManipulationPage />;
            case 'code-optimizer':
                return <CodeOptimizerPage />;
            default:
                if (activeSection) {
                    return <CourseContent section={activeSection} />;
                }
                return <div className="text-center text-red-500">Error: Section not found.</div>;
        }
    };

    return (
        <div className="min-h-screen text-gray-300 font-sans flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeSectionId={activeSectionId} onSelectSection={handleSelectSection} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto panel-clip bg-gray-900/70 backdrop-blur-sm border border-cyan-500/10 p-4 md:p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;