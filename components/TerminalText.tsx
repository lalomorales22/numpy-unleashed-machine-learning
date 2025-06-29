import React, { useState, useEffect, useMemo } from 'react';
import { useSound } from '../services/soundService';

interface TerminalTextProps {
  text: string;
  speed?: number;
}

export const TerminalText: React.FC<TerminalTextProps> = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const { playTyping } = useSound();

  const textLines = useMemo(() => text.split('\n'), [text]);

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentText = '';
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        const char = text.charAt(charIndex);
        currentText += char;
        setDisplayedText(currentText);
        if (char !== ' ' && char !== '\n') {
            playTyping();
        }
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, playTyping]);

  return (
    <>
      {displayedText.split('\n').map((line, index, arr) => (
        <React.Fragment key={index}>
          <span>{line}</span>
          {index === arr.length - 1 && index === textLines.length - 1 ? (
             <span className="blinking-cursor">|</span>
          ) : (
            <br />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
