'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Minus, Plus, RotateCcw, Music4, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { sampleLyrics, type LyricLine } from '@/lib/data/lyrics';
import { AudioVisualizer } from '@/components/player/AudioVisualizer';
import { sampleTracks } from '@/lib/data/sampleMedia';
import { cn } from '@/lib/utils';

export function KaraokeView() {
  const { currentTrack, currentTime, isPlaying, effects, updateEffect, play } = usePlayerStore();
  const [lyricOffset, setLyricOffset] = useState(0);
  const [activeLine, setActiveLine] = useState(-1);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const lyricsRef = useRef<HTMLDivElement>(null);

  const lyrics: LyricLine[] = currentTrack ? (sampleLyrics[currentTrack.id] ?? []) : [];
  const hasLyrics = lyrics.length > 0;
  const adjustedTime = currentTime + lyricOffset;

  // Sync active line and word
  useEffect(() => {
    let lineIdx = -1;
    let wordIdx = -1;

    for (let i = 0; i < lyrics.length; i++) {
      const line = lyrics[i];
      if (adjustedTime >= line.start && adjustedTime <= line.end) {
        lineIdx = i;
        for (let w = 0; w < line.words.length; w++) {
          const word = line.words[w];
          if (adjustedTime >= word.start && adjustedTime <= word.end) {
            wordIdx = w;
            break;
          }
          if (adjustedTime > word.end) wordIdx = w;
        }
        break;
      }
    }

    setActiveLine(lineIdx);
    setActiveWordIdx(wordIdx);

    // Auto-scroll
    if (lineIdx >= 0 && lyricsRef.current) {
      const lineEl = lyricsRef.current.querySelectorAll('[data-line]')[lineIdx];
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [adjustedTime, lyrics]);

  const tracksWithLyrics = sampleTracks.filter((t) => sampleLyrics[t.id]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ambient background */}
      {currentTrack && (
        <div
          className="fixed inset-0 opacity-10 blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})`, backgroundSize: 'cover' }}
        />
      )}
      <div className="fixed inset-0 bg-gradient-to-b from-bg via-bg/95 to-bg pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Main karaoke area */}
        <div className="flex-1 flex flex-col items-center px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 w-full max-w-2xl">
            <div className="w-10 h-10 rounded-2xl vasantham-gradient flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Karaoke Studio</h1>
              <p className="text-xs text-white/40">Sing along with synced lyrics</p>
            </div>
          </div>

          {!currentTrack ? (
            /* No track playing */
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
              <div className="w-24 h-24 rounded-3xl vasantham-gradient flex items-center justify-center mb-6 float">
                <Mic2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">Ready to Sing?</h2>
              <p className="text-sm text-white/50 mb-6">Play a track from the list below to start karaoke mode</p>

              <div className="w-full space-y-2">
                {tracksWithLyrics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => play(t)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl glass border border-white/10 hover:border-primary/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${t.coverUrl})` }} />
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.title}</p>
                      <p className="text-xs text-white/50">{t.artist}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Current track header */}
              <div className="flex items-center gap-4 mb-6 w-full max-w-2xl">
                <div className="w-14 h-14 rounded-2xl bg-cover bg-center shadow-xl flex-shrink-0"
                  style={{ backgroundImage: `url(${currentTrack.coverUrl})` }} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-bold text-white text-lg truncate">{currentTrack.title}</h2>
                  <p className="text-sm text-white/60">{currentTrack.artist}</p>
                </div>
                {isPlaying && (
                  <div className="flex gap-1">
                    <div className="w-1 h-8 bg-primary rounded-full eq-bar-1" />
                    <div className="w-1 h-8 bg-secondary rounded-full eq-bar-2" />
                    <div className="w-1 h-8 bg-primary rounded-full eq-bar-3" />
                  </div>
                )}
              </div>

              {/* Visualizer */}
              <div className="w-full max-w-2xl mb-6">
                <AudioVisualizer mode="bars" height={48} />
              </div>

              {/* Lyrics display */}
              {hasLyrics ? (
                <div ref={lyricsRef} className="flex-1 w-full max-w-2xl overflow-y-auto space-y-6 py-4 scrollbar-none" style={{ maxHeight: '50vh' }}>
                  {lyrics.map((line, li) => {
                    const isActive = li === activeLine;
                    const isPast = adjustedTime > line.end;
                    const isFuture = adjustedTime < line.start;

                    return (
                      <div key={line.id} data-line={li} className="text-center px-4">
                        <div className={cn(
                          'inline-flex flex-wrap justify-center gap-x-2 gap-y-1 transition-all duration-300',
                          isActive ? 'scale-105' : isPast ? 'opacity-40 scale-95' : isFuture ? 'opacity-50 scale-95' : ''
                        )}>
                          {line.words.map((word, wi) => {
                            const wordActive = isActive && wi <= activeWordIdx;
                            const wordCurrent = isActive && wi === activeWordIdx;

                            return (
                              <span
                                key={wi}
                                className={cn(
                                  'font-display font-bold transition-all duration-150',
                                  isActive ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl',
                                  wordActive
                                    ? 'gradient-text'
                                    : isActive
                                    ? 'text-white'
                                    : 'text-white/50',
                                  wordCurrent && 'text-glow'
                                )}
                              >
                                {word.word}
                              </span>
                            );
                          })}
                        </div>

                        {isActive && (
                          <motion.div
                            className="h-0.5 mx-auto mt-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((adjustedTime - line.start) / (line.end - line.start)) * 100)}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Music4 className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-white/40 text-sm">No lyrics available for this track</p>
                  <p className="text-white/25 text-xs mt-1">Try a different song from the list below</p>
                  <div className="mt-6 space-y-2 w-full max-w-sm">
                    {tracksWithLyrics.filter((t) => t.id !== currentTrack.id).map((t) => (
                      <button key={t.id} onClick={() => play(t)}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl glass border border-white/10 hover:border-primary/40 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${t.coverUrl})` }} />
                        <p className="text-xs font-medium text-white/80 truncate flex-1">{t.title}</p>
                        <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right panel — controls */}
        <div className="lg:w-80 p-6 glass border-t lg:border-t-0 lg:border-l border-white/5 space-y-6">
          <h3 className="font-display font-bold text-white">Karaoke Controls</h3>

          {/* Vocal level */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/70">Vocal Level</label>
              <span className="text-sm text-primary font-mono">{Math.round(effects.vocalLevel * 100)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={effects.vocalLevel}
              onChange={(e) => updateEffect('vocalLevel', Number(e.target.value))}
              className="w-full" />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>Karaoke</span>
              <span>Original</span>
            </div>
          </div>

          {/* Pitch adjust for singing */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/70">Pitch (for your voice)</label>
              <span className="text-sm text-secondary font-mono">{effects.pitch > 0 ? '+' : ''}{effects.pitch}st</span>
            </div>
            <input type="range" min={-6} max={6} step={0.5} value={effects.pitch}
              onChange={(e) => updateEffect('pitch', Number(e.target.value))}
              className="w-full" />
          </div>

          {/* Lyric offset */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Lyric Timing</label>
              <span className="text-sm text-amber-400 font-mono">{lyricOffset > 0 ? '+' : ''}{lyricOffset.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLyricOffset((o) => Math.max(-5, o - 0.5))}
                className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-amber-400 rounded-full" style={{
                  width: `${((lyricOffset + 5) / 10) * 100}%`
                }} />
              </div>
              <button onClick={() => setLyricOffset((o) => Math.min(5, o + 0.5))}
                className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <Plus className="w-3 h-3" />
              </button>
              <button onClick={() => setLyricOffset(0)}
                className="text-white/30 hover:text-white transition-colors">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tempo */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/70">Tempo</label>
              <span className="text-sm text-emerald-400 font-mono">{effects.tempo.toFixed(2)}×</span>
            </div>
            <input type="range" min={0.7} max={1.3} step={0.05} value={effects.tempo}
              onChange={(e) => updateEffect('tempo', Number(e.target.value))}
              className="w-full" />
          </div>

          {/* Reverb for mic */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/70">Studio Reverb</label>
              <span className="text-sm text-sky-400 font-mono">{Math.round(effects.reverb * 100)}%</span>
            </div>
            <input type="range" min={0} max={0.8} step={0.01} value={effects.reverb}
              onChange={(e) => updateEffect('reverb', Number(e.target.value))}
              className="w-full" />
          </div>

          {/* Mic visualizer */}
          <div className="p-3 rounded-xl bg-black/30 text-center">
            <Mic2 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-white/40">Live mic processing coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
