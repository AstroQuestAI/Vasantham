'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music4, Info } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { ragas } from '@/lib/data/ragas';
import { cn } from '@/lib/utils';

const timeColors: Record<string, string> = {
  Morning: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  Evening: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
  Night: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
  'Late night': 'border-blue-500/40 bg-blue-500/10 text-blue-400',
};

export function RagaChanger() {
  const { effects, updateEffect } = usePlayerStore();
  const [selected, setSelected] = useState<typeof ragas[0] | null>(
    ragas.find((r) => r.id === effects.selectedRaga) ?? null
  );

  const applyRaga = (raga: typeof ragas[0] | null) => {
    setSelected(raga);
    updateEffect('selectedRaga', raga?.id ?? null);
    if (raga) {
      // Approximate pitch shift: use average semitone offset of raga's scale
      const avgShift = raga.semitones.reduce((a, b) => a + b, 0) / raga.semitones.length;
      updateEffect('pitch', Math.round(avgShift * 0.5)); // subtle shift toward raga center
    } else {
      updateEffect('pitch', 0);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center">
          <Music4 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Raga Transposer</h3>
          <p className="text-xs text-white/40">Shift the music to an Indian classical raga</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/80 leading-relaxed">
          The raga transposer approximates the tonal centre of the selected raga by subtly shifting the pitch.
          For deep raga experiences, try pairing with Indian classical tracks.
        </p>
      </div>

      {/* Selected raga details */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/30 mb-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-display font-bold text-amber-300 text-base">{selected.name}</h4>
              {selected.carnaticName && selected.carnaticName !== selected.name && (
                <p className="text-xs text-amber-400/60">(Carnatic: {selected.carnaticName})</p>
              )}
              <p className="text-xs text-white/60 mt-1">{selected.description}</p>
            </div>
            <button onClick={() => applyRaga(null)} className="text-xs text-white/40 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
              Remove
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Aroha:</span>
              <code className="text-xs text-amber-300 font-mono">{selected.arohana}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Avaroha:</span>
              <code className="text-xs text-amber-300 font-mono">{selected.avarohana}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 w-16">Mood:</span>
              <span className="text-xs text-white/60">{selected.mood}</span>
            </div>
            {selected.timeOfDay && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-16">Time:</span>
                <span className="text-xs text-white/60">{selected.timeOfDay}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Raga grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ragas.map((raga) => {
          const isSelected = selected?.id === raga.id;
          const time = raga.timeOfDay?.split(' ')[0] || 'Evening';
          const colorClass = timeColors[time] || timeColors.Evening;

          return (
            <motion.button
              key={raga.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => applyRaga(isSelected ? null : raga)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all',
                isSelected ? colorClass : 'glass border-white/10 hover:border-white/20'
              )}
            >
              <p className={cn('text-sm font-bold', isSelected ? '' : 'text-white')}>{raga.name}</p>
              {raga.carnaticName && raga.carnaticName !== raga.name && (
                <p className="text-[10px] text-white/40 mt-0.5">{raga.carnaticName}</p>
              )}
              <p className="text-[10px] text-white/50 mt-1 truncate">{raga.mood.split(',')[0]}</p>
              {raga.timeOfDay && (
                <p className="text-[10px] text-white/30 mt-0.5">{raga.timeOfDay}</p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
