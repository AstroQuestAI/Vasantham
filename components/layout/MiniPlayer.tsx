'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ChevronUp, Shuffle, Repeat, Repeat1, Mic2, Music4, Heart
} from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { useAudioContext } from '@/components/AudioProvider';
import { formatTime, cn } from '@/lib/utils';
import { FullPlayer } from '@/components/player/FullPlayer';

export function MiniPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, effects,
    togglePlay, next, prev, setVolume, toggleMute, toggleShuffle, cycleRepeat,
    toggleFavorite, isFavorite,
  } = usePlayerStore();
  const { seekTo } = useAudioContext();
  const [showFull, setShowFull] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fav = isFavorite(currentTrack.id);

  return (
    <>
      {/* Full Player Modal */}
      <AnimatePresence>
        {showFull && <FullPlayer onClose={() => setShowFull(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/10 safe-bottom"
      >
        {/* Progress bar */}
        <div className="relative h-0.5 bg-white/10 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(ratio * duration);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 md:px-6">
          {/* Track info */}
          <button
            onClick={() => setShowFull(true)}
            className="flex items-center gap-3 flex-1 min-w-0 group"
          >
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl bg-cover bg-center shadow-lg',
                  isPlaying ? 'vinyl-spin' : 'vinyl-spin paused'
                )}
                style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
            </div>
            <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0 ml-1 group-hover:text-white/70 transition-colors" />
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={cn('p-2 rounded-lg transition-colors hidden sm:flex', isShuffled ? 'text-primary' : 'text-white/40 hover:text-white')}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button onClick={prev} className="p-2 rounded-lg text-white/70 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full vasantham-gradient flex items-center justify-center shadow-lg glow-purple"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </motion.button>

            {/* Next */}
            <button onClick={next} className="p-2 rounded-lg text-white/70 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={cn('p-2 rounded-lg transition-colors hidden sm:flex', repeatMode !== 'none' ? 'text-primary' : 'text-white/40 hover:text-white')}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0 hidden md:flex">
            {/* Time */}
            <span className="text-xs text-white/40 font-mono min-w-[80px] text-center">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Favourite */}
            <button onClick={() => toggleFavorite(currentTrack.id)} className="p-2 text-white/40 hover:text-pink-400 transition-colors">
              <Heart className={cn('w-4 h-4', fav && 'fill-pink-500 text-pink-500')} />
            </button>

            {/* Karaoke quick link */}
            <a href="/karaoke" className="p-2 text-white/40 hover:text-primary transition-colors">
              <Mic2 className="w-4 h-4" />
            </a>

            {/* Studio quick link */}
            <a href="/studio" className="p-2 text-white/40 hover:text-primary transition-colors">
              <Music4 className="w-4 h-4" />
            </a>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Effects badge */}
          {(effects.pitch !== 0 || effects.is8D || effects.isLoFi || effects.selectedRaga) && (
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
              <span className="text-xs text-primary-400 font-medium">FX ON</span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
