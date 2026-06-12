'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music4, ChevronDown, ChevronUp, Clock, Cloud, Sparkles } from 'lucide-react';
import type { Raga } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  raga: Raga;
  compact?: boolean;
  className?: string;
}

const NOTE_COLORS: Record<string, string> = {
  S: 'text-amber-400',
  R: 'text-rose-400',
  G: 'text-emerald-400',
  M: 'text-sky-400',
  P: 'text-violet-400',
  D: 'text-pink-400',
  N: 'text-orange-400',
};

function NoteSpan({ note }: { note: string }) {
  const base = note.replace(/[^A-Z]/g, '');
  const color = NOTE_COLORS[base] ?? 'text-white';
  return <span className={cn('font-mono font-bold', color)}>{note}</span>;
}

function ScaleDisplay({ scale }: { scale: string }) {
  const notes = scale.split(' ');
  return (
    <span className="flex flex-wrap gap-x-1 gap-y-0.5">
      {notes.map((n, i) => (
        <NoteSpan key={i} note={n} />
      ))}
    </span>
  );
}

export function RagaInfoCard({ raga, compact = false, className }: Props) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border overflow-hidden',
        'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/25',
        className
      )}
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => compact && setExpanded((e) => !e)}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Music4 className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-amber-300 leading-tight">{raga.name}</span>
            {raga.carnaticName && raga.carnaticName !== raga.name && (
              <span className="text-xs text-amber-400/60 font-medium">Carnatic: {raga.carnaticName}</span>
            )}
            {raga.hindustaniName && raga.hindustaniName !== raga.name && (
              <span className="text-xs text-amber-400/60 font-medium">Hindustani: {raga.hindustaniName}</span>
            )}
          </div>
          <p className="text-xs text-amber-300/60 mt-0.5 line-clamp-1">{raga.mood}</p>
        </div>

        {compact && (
          <span className="text-white/40 flex-shrink-0">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed">{raga.description}</p>

              {/* Scale */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-white/35 w-16 flex-shrink-0 pt-0.5">Aroha</span>
                  <ScaleDisplay scale={raga.arohana} />
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-white/35 w-16 flex-shrink-0 pt-0.5">Avaroha</span>
                  <ScaleDisplay scale={raga.avarohana} />
                </div>
              </div>

              {/* Note color legend */}
              <div className="flex gap-3 flex-wrap">
                {Object.entries(NOTE_COLORS).map(([n, c]) => (
                  <span key={n} className={cn('text-[10px] font-mono font-bold', c)}>
                    {n}={['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'][Object.keys(NOTE_COLORS).indexOf(n)]}
                  </span>
                ))}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-3 pt-1">
                {raga.timeOfDay && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-300/70">
                    <Clock className="w-3 h-3" />
                    {raga.timeOfDay}
                  </span>
                )}
                {raga.season && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-300/70">
                    <Cloud className="w-3 h-3" />
                    {raga.season}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-amber-300/70">
                  <Sparkles className="w-3 h-3" />
                  {raga.semitones.length} notes
                </span>
              </div>

              {/* Semitone piano visualisation */}
              <div className="flex gap-1 items-end">
                {Array.from({ length: 13 }).map((_, i) => {
                  const isInRaga = raga.semitones.includes(i);
                  const isBlack = [1, 3, 6, 8, 10].includes(i);
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 rounded transition-all',
                        isBlack ? 'h-5' : 'h-8',
                        isInRaga
                          ? isBlack
                            ? 'bg-amber-400 shadow-lg shadow-amber-400/40'
                            : 'bg-amber-300 shadow-lg shadow-amber-300/40'
                          : isBlack
                          ? 'bg-white/15'
                          : 'bg-white/8'
                      )}
                    />
                  );
                })}
              </div>
              <p className="text-[10px] text-white/25 -mt-2">Piano key positions (highlighted = in this raga)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
