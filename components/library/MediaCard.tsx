'use client';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { formatTime, formatPlays, cn } from '@/lib/utils';
import type { Track } from '@/lib/types';

interface Props {
  track: Track;
  tracks?: Track[];
  view?: 'grid' | 'list';
  rank?: number;
}

export function MediaCard({ track, tracks, view = 'grid', rank }: Props) {
  const { play, togglePlay, currentTrack, isPlaying, toggleFavorite, isFavorite, addToQueue } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isActive && isPlaying;
  const fav = isFavorite(track.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) togglePlay();
    else play(track, tracks ?? [track]);
  };

  if (view === 'list') {
    return (
      <motion.div
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        className={cn(
          'flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-colors',
          isActive && 'bg-primary/10'
        )}
        onClick={handlePlay}
      >
        {rank && (
          <span className={cn('w-6 text-sm font-mono text-center', isActive ? 'text-primary' : 'text-white/30')}>
            {isCurrentlyPlaying ? (
              <div className="flex gap-0.5 justify-center">
                <div className="w-0.5 h-4 bg-primary eq-bar-1 rounded-full" />
                <div className="w-0.5 h-4 bg-primary eq-bar-2 rounded-full" />
                <div className="w-0.5 h-4 bg-primary eq-bar-3 rounded-full" />
              </div>
            ) : rank}
          </span>
        )}

        <div className="relative flex-shrink-0 w-11 h-11 rounded-lg bg-cover bg-center shadow"
          style={{ backgroundImage: `url(${track.coverUrl})` }}>
          <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            {isCurrentlyPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', isActive ? 'text-primary-400' : 'text-white')}>{track.title}</p>
          <p className="text-xs text-white/50 truncate">{track.artist}</p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-white/40">
          {track.raga && <span className="text-amber-400/70">{track.raga}</span>}
          <span>{track.genre.split(' ').slice(-1)[0]}</span>
          <span>{track.language}</span>
          {track.plays && <span>{formatPlays(track.plays)}</span>}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Heart className={cn('w-3.5 h-3.5', fav ? 'fill-pink-500 text-pink-500' : 'text-white/40 hover:text-pink-400')} />
          </button>
        </div>

        <span className="text-xs text-white/30 font-mono flex-shrink-0 ml-2">{formatTime(track.duration)}</span>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={handlePlay}
    >
      <div className="relative rounded-xl overflow-hidden mb-3 shadow-lg aspect-square">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        />

        {/* Hover overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/40 flex items-end p-3 transition-opacity',
          isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <div className="flex items-center gap-2 w-full">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-primary shadow-lg flex items-center justify-center glow-purple"
            >
              {isCurrentlyPlaying
                ? <Pause className="w-4 h-4 text-white" />
                : <Play className="w-4 h-4 text-white ml-0.5" />
              }
            </motion.button>

            <button onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
              className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
              className="ml-auto w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center transition-colors hover:bg-white/20">
              <Heart className={cn('w-3.5 h-3.5', fav ? 'fill-pink-500 text-pink-500' : 'text-white')} />
            </button>
          </div>
        </div>

        {/* Active indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute top-2 right-2 flex gap-0.5">
            <div className="w-0.5 h-4 bg-primary rounded-full eq-bar-1" />
            <div className="w-0.5 h-4 bg-primary rounded-full eq-bar-2" />
            <div className="w-0.5 h-4 bg-primary rounded-full eq-bar-3" />
          </div>
        )}

        {/* Raga badge */}
        {track.raga && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-amber-500/80 text-[10px] font-medium text-black">
            {track.raga}
          </div>
        )}
      </div>

      <p className={cn('text-sm font-semibold truncate mb-0.5 leading-snug', isActive ? 'text-primary-400' : 'text-white group-hover:text-primary-400 transition-colors')}>
        {track.title}
      </p>
      <p className="text-xs text-white/50 truncate mb-1">{track.artist}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">{track.genre.split(' ').slice(-1)[0]}</span>
        <span className="text-[10px] text-white/30">{track.language}</span>
        <span className="text-[10px] text-white/30 font-mono ml-auto">{formatTime(track.duration)}</span>
      </div>
    </motion.div>
  );
}
