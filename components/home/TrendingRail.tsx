'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { trendingTracks, sampleTracks } from '@/lib/data/sampleMedia';
import { formatTime, formatPlays, cn } from '@/lib/utils';
import type { Track } from '@/lib/types';

interface Props {
  title?: string;
  tracks?: Track[];
  showRank?: boolean;
}

export function TrendingRail({ title = 'Trending Now', tracks = trendingTracks, showRank = true }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { play, currentTrack, isPlaying, togglePlay } = usePlayerStore();

  const scroll = (dir: 'l' | 'r') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'r' ? 280 : -280, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-6 md:px-10 mb-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('l')} className="p-2 rounded-full glass border border-white/10 text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('r')} className="p-2 rounded-full glass border border-white/10 text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none px-6 md:px-10 pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {tracks.map((track, i) => {
          const active = currentTrack?.id === track.id;
          const playing = active && isPlaying;

          return (
            <motion.div
              key={track.id}
              whileHover={{ y: -4 }}
              style={{ scrollSnapAlign: 'start' }}
              className="flex-shrink-0 w-44"
            >
              <div className="relative group cursor-pointer" onClick={() => {
                if (active) togglePlay();
                else play(track, tracks);
              }}>
                {/* Art */}
                <div
                  className="w-full aspect-square rounded-xl bg-cover bg-center shadow-lg mb-3"
                  style={{ backgroundImage: `url(${track.coverUrl})` }}
                >
                  {/* Overlay on hover */}
                  <div className={cn(
                    'absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center transition-opacity',
                    playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}>
                    {playing ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-6 bg-white rounded-full eq-bar-1" />
                        <div className="w-1 h-6 bg-white rounded-full eq-bar-2" />
                        <div className="w-1 h-6 bg-white rounded-full eq-bar-3" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Rank */}
                  {showRank && (
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {i + 1}
                    </div>
                  )}
                </div>

                <p className={cn('text-sm font-semibold truncate mb-0.5', active ? 'text-primary-400' : 'text-white')}>
                  {track.title}
                </p>
                <p className="text-xs text-white/50 truncate">{track.artist}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-white/30 font-mono">{formatTime(track.duration)}</span>
                  {track.plays && (
                    <span className="text-xs text-white/30">{formatPlays(track.plays)} plays</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
