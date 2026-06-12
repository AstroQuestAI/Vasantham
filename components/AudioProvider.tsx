'use client';
import { createContext, useContext, useCallback } from 'react';
import { useAudioEngine } from '@/lib/hooks/useAudioEngine';

interface AudioContextType {
  seekTo: (t: number) => void;
  getAnalyser: () => AnalyserNode | null;
}

const AudioCtx = createContext<AudioContextType>({
  seekTo: () => {},
  getAnalyser: () => null,
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { seekTo, getAnalyser } = useAudioEngine();

  const stableSeek = useCallback(seekTo, [seekTo]);
  const stableAnalyser = useCallback(getAnalyser, [getAnalyser]);

  return (
    <AudioCtx.Provider value={{ seekTo: stableSeek, getAnalyser: stableAnalyser }}>
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudioContext = () => useContext(AudioCtx);
