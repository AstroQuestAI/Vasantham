'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronRight, Sparkles } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { featuredTracks } from '@/lib/data/sampleMedia';
import { getRagaByTrack } from '@/lib/data/ragas';
import { AudioVisualizer } from '@/components/player/AudioVisualizer';
import { RagaInfoCard } from '@/components/player/RagaInfoCard';
import { formatTime } from '@/lib/utils';

export function HeroSection() {
  const [featureIdx, setFeatureIdx] = useState(0);
  const [showRagaInfo, setShowRagaInfo] = useState(false);
  const { play, togglePlay, isPlaying, currentTrack } = usePlayerStore();
  const featured = featuredTracks[featureIdx];
  const featuredRaga = featured.raga ? getRagaByTrack(featured.raga) : null;

  useEffect(() => {
    const t = setInterval(() => {
      setFeatureIdx((i) => (i + 1) % featuredTracks.length);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  const isThisPlaying = currentTrack?.id === featured.id && isPlaying;

  return (
    <section className="relative min-h-[420px] md:min-h-[480px] overflow-hidden">
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
            style={{ backgroundImage: `url(${featured.coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient visualizer */}
      <div className="absolute bottom-0 left-0 right-0 opacity-40">
        <AudioVisualizer mode="ambient" height={200} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 pt-10 pb-6 flex items-end min-h-[420px] md:min-h-[480px]">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
          {/* Album art */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex-shrink-0"
            >
              <div
                className="w-40 h-40 md:w-52 md:h-52 rounded-2xl shadow-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${featured.coverUrl})` }}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl -z-10" />

              {/* Featured badge */}
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-xs font-bold text-black">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">
                  {featured.genre}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-xs text-white/50">{featured.language}</span>
                {featured.raga && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <button
                      onClick={() => setShowRagaInfo((v) => !v)}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 underline-offset-2 hover:underline"
                    >
                      Raga {featuredRaga?.name ?? featured.raga}
                    </button>
                  </>
                )}
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                {featured.title}
              </h2>
              <p className="text-white/60 text-lg mb-1">{featured.artist}</p>
              {featured.album && (
                <p className="text-white/40 text-sm mb-4">{featured.album} · {featured.year}</p>
              )}

              {/* Raga info card — expandable */}
              <AnimatePresence>
                {showRagaInfo && featuredRaga && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden max-w-sm"
                  >
                    <RagaInfoCard raga={featuredRaga} compact={false} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visualizer for current track */}
              {isThisPlaying && !showRagaInfo && (
                <div className="mb-4 w-48">
                  <AudioVisualizer mode="bars" height={32} />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentTrack?.id === featured.id) {
                      togglePlay();
                    } else {
                      play(featured, featuredTracks);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full vasantham-gradient text-white font-semibold text-sm shadow-lg glow-purple"
                >
                  {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isThisPlaying ? 'Pause' : 'Play Now'}
                </motion.button>

                <span className="text-xs text-white/40 font-mono">{formatTime(featured.duration)}</span>

                {featured.mood && (
                  <span className="text-xs px-3 py-1.5 rounded-full glass border border-white/10 text-white/60">
                    {featured.mood}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Featured track indicators */}
          <div className="md:self-end flex md:flex-col gap-2 pb-1">
            {featuredTracks.slice(0, 4).map((t, i) => (
              <button
                key={t.id}
                onClick={() => setFeatureIdx(i)}
                className="flex md:flex-row items-center gap-2 text-left group"
              >
                <div
                  className={`rounded-lg bg-cover bg-center transition-all flex-shrink-0 ${
                    i === featureIdx ? 'w-10 h-10 ring-2 ring-primary' : 'w-8 h-8 opacity-50 hover:opacity-80'
                  }`}
                  style={{ backgroundImage: `url(${t.coverUrl})` }}
                />
                {i === featureIdx && (
                  <ChevronRight className="hidden md:block w-3 h-3 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
