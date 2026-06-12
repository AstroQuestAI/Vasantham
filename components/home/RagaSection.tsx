'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Play, Music } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { ragas } from '@/lib/data/ragas';
import { sampleTracks } from '@/lib/data/sampleMedia';
import { formatTime } from '@/lib/utils';

const ragaColors: Record<string, string> = {
  morning: 'from-amber-500/20 to-orange-600/20 border-amber-500/30',
  afternoon: 'from-sky-500/20 to-blue-600/20 border-sky-500/30',
  evening: 'from-violet-500/20 to-purple-600/20 border-violet-500/30',
  night: 'from-indigo-600/20 to-blue-800/20 border-indigo-500/30',
};

const timeIcon: Record<string, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
};

export function RagaSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { play } = usePlayerStore();

  // Only show ragas that have tracks
  const ragasWithTracks = ragas.filter((raga) => {
    const tracks = sampleTracks.filter(
      (t) => t.raga === raga.id || t.raga?.toLowerCase() === raga.name.toLowerCase()
    );
    return tracks.length > 0;
  }).slice(0, 6);

  return (
    <section className="px-6 md:px-10 mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Music className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-white">Explore by Raga</h2>
          <p className="text-xs text-white/40">Journey through Indian classical scales</p>
        </div>
      </div>

      <div className="space-y-2">
        {ragasWithTracks.map((raga) => {
          const tracks = sampleTracks.filter(
            (t) => t.raga === raga.id || t.raga?.toLowerCase() === raga.name.toLowerCase()
          );
          const time = raga.timeOfDay?.toLowerCase().split(' ')[0] || 'evening';
          const colorClass = ragaColors[time] || ragaColors.evening;
          const icon = timeIcon[time] || '🎵';
          const isOpen = expanded === raga.id;

          return (
            <motion.div
              key={raga.id}
              className={`rounded-2xl border bg-gradient-to-r ${colorClass} overflow-hidden`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : raga.id)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <span className="text-2xl">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-white">{raga.name}</span>
                    {raga.carnaticName && raga.carnaticName !== raga.name && (
                      <span className="text-xs text-white/50">({raga.carnaticName})</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{raga.mood.split(',')[0].trim()}</span>
                    {raga.timeOfDay && (
                      <span className="text-xs text-white/40">{raga.timeOfDay}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{raga.description}</p>
                  <p className="text-xs text-white/30 mt-1 font-mono">{raga.arohana}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-white/40">{tracks.length} tracks</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/10 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tracks.map((track) => (
                        <button
                          key={track.id}
                          onClick={() => play(track, tracks)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                        >
                          <div
                            className="w-9 h-9 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${track.coverUrl})` }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">{track.title}</p>
                            <p className="text-xs text-white/50 truncate">{track.artist}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-white/30 font-mono">{formatTime(track.duration)}</span>
                            <Play className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
