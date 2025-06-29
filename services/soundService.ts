import { useState, useCallback, useEffect } from 'react';

// Base64 encoded audio files to avoid needing separate assets
const clickSoundSrc = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//tQwRAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQwRAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQwRAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAP/7UMQIAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UMQMAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQxBAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQxBAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAAAAP/7UMQIAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UMQMAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const typeSoundSrc = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//tQwRAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQwRAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQwRAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAP/7UMQIAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UMQMAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQxBAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQxBAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAAAAAAAA//tQxBgAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/7UMQcAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const completeSoundSrc = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//tQwRAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQwRAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQwRAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAP/7UMQIAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7umxDMAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBAA/A8AAAAPkVEVDAAAA1AACNMYXZmNTcuODIuMTAwAgAAAAAA//tQxBAA/A8AAAAAFlRFTkMAAAAHAAADQU1FVAAAAAAAA//tQxBAA/A8AAAAPbGF2YzU3LjEwNy4xMDAAAAAAAAAAAAAAAAAAAAAA//tQxBgAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/7UMQcAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxCAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/7UMQkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

let isMutedGlobally = false;
let clickAudio: HTMLAudioElement | null = null;
let typeAudio: HTMLAudioElement | null = null;
let completeAudio: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

// This function attempts to unlock the browser's audio context.
// It should be called after the first user interaction (e.g., click, keydown).
const unlockAudioContext = () => {
    if (isAudioUnlocked || typeof window === 'undefined') return;

    const audios = [clickAudio, typeAudio, completeAudio];
    let unlocked = false;

    audios.forEach(audio => {
        if (audio) {
            // A common trick is to play and immediately pause a silent sound or the actual sound muted.
            const wasPaused = audio.paused;
            if (wasPaused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        unlocked = true;
                    }).catch(() => {
                        // This catch is expected if another sound is already trying to play.
                    });
                }
            }
        }
    });
    
    if (unlocked) {
        isAudioUnlocked = true;
        // Clean up the listeners once the context is unlocked.
        window.removeEventListener('click', unlockAudioContext);
        window.removeEventListener('keydown', unlockAudioContext);
    }
};

const initializeAudio = () => {
    if (typeof window !== 'undefined' && !clickAudio) {
        clickAudio = new Audio(clickSoundSrc);
        clickAudio.volume = 0.5;

        typeAudio = new Audio(typeSoundSrc);
        typeAudio.volume = 0.6;

        completeAudio = new Audio(completeSoundSrc);
        completeAudio.volume = 0.4;

        // Set up listeners to unlock audio on the first user interaction.
        window.addEventListener('click', unlockAudioContext, { once: true });
        window.addEventListener('keydown', unlockAudioContext, { once: true });
    }
};

const playSound = (audio: HTMLAudioElement | null) => {
    // Only attempt to play if context is unlocked and not muted
    if (!isAudioUnlocked || isMutedGlobally || !audio) {
        return;
    }
    audio.currentTime = 0;
    audio.play().catch(e => {
        // This error can still happen in rare edge cases, we can ignore it safely.
    });
};

const playClick = () => playSound(clickAudio);
const playTyping = () => playSound(typeAudio);
const playComplete = () => playSound(completeAudio);

const toggleMute = () => {
    isMutedGlobally = !isMutedGlobally;
    if (!isMutedGlobally) {
        // If the user is unmuting, it's a valid interaction to unlock the audio context.
        unlockAudioContext();
    }
    // Notify components to re-render.
    window.dispatchEvent(new CustomEvent('sound-mute-change'));
};

// React hook to use the service
export const useSound = () => {
    const [isMuted, setIsMuted] = useState(isMutedGlobally);

    useEffect(() => {
        initializeAudio();
        
        const handleMuteChange = () => setIsMuted(isMutedGlobally);
        
        window.addEventListener('sound-mute-change', handleMuteChange);
        
        return () => {
            window.removeEventListener('sound-mute-change', handleMuteChange);
        };
    }, []);

    const memoizedToggleMute = useCallback(() => {
        toggleMute();
    }, []);

    return {
        isMuted,
        toggleMute: memoizedToggleMute,
        playClick: useCallback(() => playClick(), []),
        playTyping: useCallback(() => playTyping(), []),
        playComplete: useCallback(() => playComplete(), []),
    };
};
