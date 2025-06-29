
import React from 'react';
import { Section } from '../types';

interface CourseContentProps {
    section: Section;
}

export const CourseContent: React.FC<CourseContentProps> = ({ section }) => {
    return (
        <article className="prose prose-invert prose-lg max-w-none 
                           prose-headings:font-mono prose-headings:text-cyan-400 prose-headings:border-b prose-headings:border-cyan-500/30 prose-headings:pb-2
                           prose-p:text-gray-300 prose-p:leading-relaxed
                           prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-teal-300
                           prose-code:text-amber-400 prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded-md prose-code:font-mono
                           prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:pl-4 prose-blockquote:text-gray-400 prose-blockquote:italic">
            <h1 className="text-4xl font-mono text-cyan-300 mb-6 glitch-hover">{section.title}</h1>
            <div>{section.content}</div>
        </article>
    );
};