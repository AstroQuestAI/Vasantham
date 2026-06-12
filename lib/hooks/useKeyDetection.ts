'use client';
import { useEffect, useRef, useState } from 'react';
import { useAudioContext } from '@/components/AudioProvider';
import { usePlayerStore } from '@/lib/store';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Krumhansl-Schmuckler key profiles
const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

function correlate(chroma: number[], profile: number[]): number {
  const n = 12;
  const meanC = chroma.reduce((a, b) => a + b, 0) / n;
  const meanP = profile.reduce((a, b) => a + b, 0) / n;
  let num = 0, denC = 0, denP = 0;
  for (let i = 0; i < n; i++) {
    const dc = chroma[i] - meanC;
    const dp = profile[i] - meanP;
    num += dc * dp;
    denC += dc * dc;
    denP += dp * dp;
  }
  return denC === 0 || denP === 0 ? 0 : num / Math.sqrt(denC * denP);
}

function detectKey(chroma: number[]): { key: string; mode: 'major' | 'minor'; confidence: number } {
  let best = { key: 'C', mode: 'major' as 'major' | 'minor', score: -Infinity };
  for (let root = 0; root < 12; root++) {
    const rotated = [...chroma.slice(root), ...chroma.slice(0, root)];
    const majScore = correlate(rotated, MAJOR);
    const minScore = correlate(rotated, MINOR);
    if (majScore > best.score) best = { key: NOTES[root], mode: 'major', score: majScore };
    if (minScore > best.score) best = { key: NOTES[root], mode: 'minor', score: minScore };
  }
  // Normalize confidence to 0-100
  const confidence = Math.round(((best.score + 1) / 2) * 100);
  return { key: best.key, mode: best.mode, confidence };
}

export function useKeyDetection() {
  const { getAnalyser } = useAudioContext();
  const { isPlaying, currentTrack } = usePlayerStore();
  const [result, setResult] = useState<{ key: string; mode: 'major' | 'minor'; confidence: number } | null>(null);
  const [detecting, setDetecting] = useState(false);
  const chromaAccum = useRef<number[]>(new Array(12).fill(0));
  const sampleCount = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detect = () => {
    const analyser = getAnalyser();
    if (!analyser) return;

    const bufLen = analyser.frequencyBinCount;
    const freqData = new Float32Array(bufLen);
    analyser.getFloatFrequencyData(freqData);

    const sampleRate = analyser.context.sampleRate;
    const binHz = sampleRate / (bufLen * 2);

    // Accumulate energy into 12 pitch classes via chroma
    for (let bin = 1; bin < bufLen; bin++) {
      const hz = bin * binHz;
      if (hz < 60 || hz > 4200) continue;
      const energy = Math.pow(10, freqData[bin] / 10); // dB → linear
      // MIDI note number from frequency
      const midi = 12 * Math.log2(hz / 440) + 69;
      const pitchClass = ((Math.round(midi) % 12) + 12) % 12;
      chromaAccum.current[pitchClass] += energy;
    }
    sampleCount.current++;
  };

  const run = () => {
    chromaAccum.current = new Array(12).fill(0);
    sampleCount.current = 0;
    setDetecting(true);
    setResult(null);

    let ticks = 0;
    intervalRef.current = setInterval(() => {
      detect();
      ticks++;
      if (ticks >= 15) { // ~3s of samples at 200ms interval
        clearInterval(intervalRef.current!);
        const chroma = chromaAccum.current;
        const maxE = Math.max(...chroma);
        const norm = maxE > 0 ? chroma.map((v) => v / maxE) : chroma;
        setResult(detectKey(norm));
        setDetecting(false);
      }
    }, 200);
  };

  // Auto-run when track changes and is playing
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && currentTrack) {
      // Delay slightly to let audio start
      const t = setTimeout(run, 2000);
      return () => clearTimeout(t);
    }
  }, [currentTrack?.id, isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  return { result, detecting, redetect: run };
}
