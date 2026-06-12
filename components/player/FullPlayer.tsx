'use client';
import { motion } from 'framer-motion';
import {
  X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Share2, ListMusic, Shuffle, Repeat, Repeat1,
  Mic2, Music4, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePlayerStore } from '@/lib/store';
import { useAudioContext } from '@/components/AudioProvider';
import { AudioVisualizer } from './AudioVisualizer';
import { formatTime, cn } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

export function FullPlayer({ onClose }: Props) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, queue, queueIndex,
    togglePlay, next, prev, setVolume, toggleMute, toggleShuffle, cycleRepeat,
    toggleFavorite, isFavorite, play,
  } = usePlayerStore();
  const { seekTo } = useAudioContext();

  if (!currentTrack) return null;
  const fav = isFavorite(currentTrack.id);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080812 0%, #0f0526 40%, #1a0a3d 100%)' }}
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-bg/60" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2 rounded-full glass text-white/60 hover:text-white transition-colors"
      >
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* Left panel — album art + controls */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        {/* Album art */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear', pause: !isPlaying }}
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl mb-8 flex-shrink-0"
        >
          <div
            className="w-full h-full rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/10" />
          {/* Vinyl grooves */}
          <div className="absolute inset-[30%] rounded-full bg-bg/90 border border-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/20" />
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl -z-10" />
        </motion.div>

        {/* Track info */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold text-white mb-1 leading-tight">{currentTrack.title}</h2>
          <p className="text-white/60 text-sm">{currentTrack.artist}</p>
          {currentTrack.raga && (
            <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary-400">
              Raga: {currentTrack.raga}
            </span>
          )}
        </div>

        {/* Visualizer */}
        <div className="w-full max-w-sm mb-6">
          <AudioVisualizer mode="wave" height={48} className="opacity-70" />
        </div>

        {/* Progress */}
        <div className="w-full max-w-sm mb-4">
          <div
            className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seekTo(((e.clientX - rect.left) / rect.width) * duration);
            }}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-white/40 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={toggleShuffle} className={cn('p-2', isShuffled ? 'text-primary' : 'text-white/40 hover:text-white transition-colors')}>
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={prev} className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-7 h-7" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full vasantham-gradient flex items-center justify-center shadow-xl glow-purple"
          >
            {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
          </motion.button>
          <button onClick={next} className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-7 h-7" />
          </button>
          <button onClick={cycleRepeat} className={cn('p-2', repeatMode !== 'none' ? 'text-primary' : 'text-white/40 hover:text-white transition-colors')}>
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center gap-6">
          <button onClick={() => toggleFavorite(currentTrack.id)} className="text-white/40 hover:text-pink-400 transition-colors">
            <Heart className={cn('w-5 h-5', fav && 'fill-pink-500 text-pink-500')} />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))} className="w-24" />
          </div>
          <Link href="/karaoke" onClick={onClose} className="text-white/40 hover:text-primary transition-colors">
            <Mic2 className="w-5 h-5" />
          </Link>
          <Link href="/studio" onClick={onClose} className="text-white/40 hover:text-primary transition-colors">
            <Music4 className="w-5 h-5" />
          </Link>
          <button className="text-white/40 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right panel — queue */}
      <div className="hidden md:flex flex-col w-80 glass border-l border-white/5 overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-primary" />
            Up Next
          </h3>
          <p className="text-xs text-white/40 mt-1">{queue.length} tracks</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {queue.map((track, i) => {
            const active = i === queueIndex;
            return (
              <button
                key={`${track.id}-${i}`}
                onClick={() => play(track, queue)}
                className={cn(
                  'flex items-center gap-3 w-full p-2.5 rounded-xl mb-1 text-left transition-colors',
                  active ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5'
                )}
              >
                <div className="relative w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${track.coverUrl})` }}>
                  {active && (
                    <div className="absolute inset-0 rounded-lg bg-primary/40 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 bg-white eq-bar-1" />
                        <div className="w-0.5 h-3 bg-white eq-bar-2" />
                        <div className="w-0.5 h-3 bg-white eq-bar-3" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-xs font-medium truncate', active ? 'text-primary-400' : 'text-white/80')}>{track.title}</p>
                  <p className="text-xs text-white/40 truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-white/30 font-mono">{formatTime(track.duration)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
