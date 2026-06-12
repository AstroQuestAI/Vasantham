'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music4, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { ragas } from '@/lib/data/ragas';
import { cn } from '@/lib/utils';
import { useKeyDetection } from '@/lib/hooks/useKeyDetection';

// Western chromatic notes
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_ALIASES: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
};

function noteIndex(note: string): number {
  const n = NOTE_ALIASES[note] ?? note;
  return NOTES.indexOf(n);
}

// Raga root note presets (Sa = tonic of the raga as commonly performed)
const RAGA_ROOTS: Record<string, string> = {
  yaman: 'F', bhairavi: 'C', bhoopali: 'G', bageshri: 'A',
  desh: 'C', malkauns: 'C', bhimpalasi: 'F', kafi: 'D',
  kirwani: 'A', bilawal: 'C', khamaj: 'G', todi: 'D',
  marwa: 'C#', puriya: 'D', shankarabharanam: 'C', hamsadhwani: 'C',
  charukesi: 'C', natabhairavi: 'C', kalyani: 'F', abheri: 'C',
};

export function RagaChanger() {
  const { effects, updateEffect } = usePlayerStore();
  const [sourceKey, setSourceKey] = useState<string>('C');
  const [targetKey, setTargetKey] = useState<string | null>(null);
  const [targetRaga, setTargetRaga] = useState<typeof ragas[0] | null>(null);
  const [mode, setMode] = useState<'key' | 'raga'>('key');
  const { result: detectedKey, detecting, redetect } = useKeyDetection();

  // Auto-update source key when detection completes
  useEffect(() => {
    if (detectedKey) {
      setSourceKey(detectedKey.key);
      if (targetKey) applyTranspose(detectedKey.key, targetKey);
    }
  }, [detectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentShift = effects.pitch;

  const applyTranspose = (fromKey: string, toKey: string) => {
    const from = noteIndex(fromKey);
    const to = noteIndex(toKey);
    if (from === -1 || to === -1) return;
    let shift = to - from;
    // Keep within -6 to +6 for minimal transposition
    if (shift > 6) shift -= 12;
    if (shift < -6) shift += 12;
    updateEffect('pitch', shift);
  };

  const handleTargetKey = (key: string) => {
    setTargetKey(key);
    setTargetRaga(null);
    updateEffect('selectedRaga', null);
    applyTranspose(sourceKey, key);
  };

  const handleTargetRaga = (raga: typeof ragas[0]) => {
    const ragaRoot = RAGA_ROOTS[raga.id] ?? 'C';
    setTargetRaga(raga);
    setTargetKey(ragaRoot);
    updateEffect('selectedRaga', raga.id);
    applyTranspose(sourceKey, ragaRoot);
  };

  const handleSourceKey = (key: string) => {
    setSourceKey(key);
    if (targetKey) applyTranspose(key, targetKey);
  };

  const reset = () => {
    setTargetKey(null);
    setTargetRaga(null);
    updateEffect('pitch', 0);
    updateEffect('selectedRaga', null);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center">
          <Music4 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Raga Transposer</h3>
          <p className="text-xs text-white/40">Shift the song to any key or raga</p>
        </div>
      </div>

      {/* Key detection status */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
        {detecting ? (
          <>
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
            <p className="text-xs text-white/60">Detecting key from audio…</p>
          </>
        ) : detectedKey ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <p className="text-xs text-white/60">
              Detected: <span className="text-amber-400 font-bold font-mono">{detectedKey.key} {detectedKey.mode}</span>
              <span className="text-white/30 ml-1">({detectedKey.confidence}% confidence)</span>
            </p>
            <button onClick={redetect} className="ml-auto text-white/30 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-white/20 flex-shrink-0" />
            <p className="text-xs text-white/40">Play a track to auto-detect its key</p>
          </>
        )}
      </div>

      {/* Source key */}
      <div className="mb-5">
        <p className="text-sm font-medium text-white/70 mb-2">Song is currently in</p>
        <div className="flex flex-wrap gap-2">
          {NOTES.map((n) => (
            <button
              key={n}
              onClick={() => handleSourceKey(n)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-mono font-bold border transition-all',
                sourceKey === n
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                  : 'glass border-white/10 text-white/50 hover:text-white hover:border-white/30'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow + shift display */}
      <div className="flex items-center gap-3 my-4 px-2">
        <div className="flex-1 h-px bg-white/10" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40 font-mono">{sourceKey}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span className={cn('font-mono font-bold', targetKey ? 'text-amber-400' : 'text-white/20')}>
            {targetKey ?? '?'}
          </span>
          {currentShift !== 0 && (
            <span className="text-xs text-white/40 font-mono">
              ({currentShift > 0 ? '+' : ''}{currentShift}st)
            </span>
          )}
        </div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('key')}
          className={cn('flex-1 py-2 rounded-xl text-sm font-medium border transition-all',
            mode === 'key' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'glass border-white/10 text-white/40 hover:text-white'
          )}
        >
          Western Key
        </button>
        <button
          onClick={() => setMode('raga')}
          className={cn('flex-1 py-2 rounded-xl text-sm font-medium border transition-all',
            mode === 'raga' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'glass border-white/10 text-white/40 hover:text-white'
          )}
        >
          Indian Raga
        </button>
      </div>

      {/* Target: Western keys */}
      {mode === 'key' && (
        <div>
          <p className="text-sm font-medium text-white/70 mb-2">Transpose to</p>
          <div className="flex flex-wrap gap-2">
            {NOTES.map((n) => (
              <button
                key={n}
                onClick={() => handleTargetKey(n)}
                disabled={n === sourceKey}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-mono font-bold border transition-all',
                  targetKey === n && !targetRaga
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                    : n === sourceKey
                    ? 'glass border-white/5 text-white/20 cursor-not-allowed'
                    : 'glass border-white/10 text-white/50 hover:text-white hover:border-white/30'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target: Ragas */}
      {mode === 'raga' && (
        <div>
          <p className="text-sm font-medium text-white/70 mb-2">Transpose to raga</p>
          <div className="grid grid-cols-2 gap-2">
            {ragas.map((raga) => {
              const root = RAGA_ROOTS[raga.id] ?? 'C';
              const isSelected = targetRaga?.id === raga.id;
              return (
                <motion.button
                  key={raga.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTargetRaga(raga)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'glass border-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn('text-sm font-bold', isSelected ? '' : 'text-white')}>{raga.name}</p>
                    <span className="text-xs font-mono text-white/30">{root}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5">{raga.mood.split(',')[0]}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{raga.arohana}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      {currentShift !== 0 && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={reset}
          className="mt-4 w-full py-2 rounded-xl glass border border-white/10 text-sm text-white/40 hover:text-white hover:border-white/30 transition-all"
        >
          Reset to original key
        </motion.button>
      )}
    </div>
  );
}
