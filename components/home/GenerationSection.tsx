'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Clock } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { sampleTracks } from '@/lib/data/sampleMedia';
import { formatTime, getColorFromString } from '@/lib/utils';

type Gen = 'genz' | 'classic';

const genZTracks = sampleTracks.filter((t) =>
  t.year >= 2015 || t.trending
).slice(0, 6);

const classicTracks = sampleTracks.filter((t) =>
  t.year <= 2005
).slice(0, 6);

export function GenerationSection() {
  const [activeGen, setActiveGen] = useState<Gen>('genz');
  const { play } = usePlayerStore();
  const tracks = activeGen === 'genz' ? genZTracks : classicTracks;

  return (
    <section className="px-6 md:px-10 mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">Your Generation</h2>
        <div className="flex glass rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setActiveGen('genz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeGen === 'genz'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            GenZ & Alpha
          </button>
          <button
            onClick={() => setActiveGen('classic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeGen === 'classic'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Timeless
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {tracks.map((track, i) => {
          const isGenZ = activeGen === 'genz';
          const bgColor = getColorFromString(track.title);

          return (
            <motion.div
              key={`${activeGen}-${track.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              onClick={() => play(track, tracks)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 shadow-lg">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${track.coverUrl})`,
                    filter: isGenZ ? 'none' : 'sepia(0.4) contrast(0.9)',
                  }}
                />

                {/* GenZ: neon overlay */}
                {isGenZ && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Classic: warm overlay */}
                {!isGenZ && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-orange-900/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGenZ ? 'bg-primary/80' : 'bg-amber-600/80'}`}>
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>

                {isGenZ && track.trending && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-pink-500 text-[10px] font-bold text-white">
                    HOT
                  </div>
                )}
              </div>

              <p className={`text-xs font-semibold truncate ${isGenZ ? 'text-white' : 'text-amber-200'}`}>
                {track.title}
              </p>
              <p className={`text-xs truncate mt-0.5 ${isGenZ ? 'text-white/50' : 'text-amber-200/50'}`}>
                {track.artist}
              </p>
              <p className={`text-xs mt-0.5 ${isGenZ ? 'text-white/30' : 'text-amber-200/30'}`}>
                {isGenZ ? `${track.year}` : `Classic ${track.year}`}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* GenZ extras */}
      {activeGen === 'genz' && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <a href="/studio" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary-400 hover:bg-primary/30 transition-colors">
            <Zap className="w-3 h-3" />
            Try Remix Lab
          </a>
          <a href="/studio" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-xs text-pink-400 hover:bg-pink-500/30 transition-colors">
            🎤 Voice Changer
          </a>
          <a href="/karaoke" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors">
            🎵 Karaoke Mode
          </a>
        </div>
      )}
    </section>
  );
}
