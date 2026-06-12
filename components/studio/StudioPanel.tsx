'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2, Music4, Wand2, Zap, Settings2, Radio,
  Volume2, RotateCcw, X, Info, ChevronRight
} from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { AudioVisualizer } from '@/components/player/AudioVisualizer';
import { EqControl } from './EqControl';
import { VoiceChanger } from './VoiceChanger';
import { RagaChanger } from './RagaChanger';
import { EightDAudio } from './EightDAudio';
import { LoFiMaker } from './LoFiMaker';
import { VocalSplit } from './VocalSplit';
import { RemixLab } from './RemixLab';
import { cn } from '@/lib/utils';

type Tool = 'eq' | 'voice' | 'raga' | '8d' | 'lofi' | 'vocal' | 'remix';

const tools: {
  id: Tool; label: string; desc: string; icon: React.ComponentType<{ className?: string }>;
  gradient: string; badge?: string;
}[] = [
  { id: 'eq', label: 'Equalizer', desc: '10-band EQ for perfect sound', icon: Volume2, gradient: 'from-violet-500 to-purple-700' },
  { id: 'voice', label: 'Voice Changer', desc: 'Pitch shift & formant control', icon: Mic2, gradient: 'from-pink-500 to-rose-700', badge: 'Popular' },
  { id: 'raga', label: 'Raga Transposer', desc: 'Shift music to any Indian raga', icon: Music4, gradient: 'from-amber-500 to-orange-700', badge: 'Unique' },
  { id: '8d', label: '8D Audio', desc: 'Immersive spatial audio effect', icon: Radio, gradient: 'from-sky-500 to-blue-700' },
  { id: 'lofi', label: 'Lo-Fi Maker', desc: 'Add that warm retro vibe', icon: Wand2, gradient: 'from-emerald-500 to-teal-700' },
  { id: 'vocal', label: 'Voice / Music Split', desc: 'Isolate vocals or instruments', icon: Settings2, gradient: 'from-indigo-500 to-violet-700', badge: 'AI' },
  { id: 'remix', label: 'Remix Lab', desc: 'Loop, BPM change & beat layer', icon: Zap, gradient: 'from-rose-500 to-pink-700', badge: 'New' },
];

export function StudioPanel() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const { currentTrack, effects, resetEffects } = usePlayerStore();

  const activeCount = [
    effects.is8D,
    effects.isLoFi,
    effects.pitch !== 0,
    effects.selectedRaga !== null,
    effects.reverb > 0,
    effects.bass !== 0 || effects.treble !== 0 || effects.mid !== 0,
    effects.vocalLevel !== 1,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl vasantham-gradient flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          Creative Studio
        </h1>
        <p className="text-white/50">Transform your music with powerful creative tools</p>

        {activeCount > 0 && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-primary-400 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {activeCount} effect{activeCount > 1 ? 's' : ''} active
            </span>
            <button onClick={resetEffects} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
              <RotateCcw className="w-3 h-3" />
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Now playing context */}
      {currentTrack ? (
        <div className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/10 mb-8">
          <div className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 shadow-lg"
            style={{ backgroundImage: `url(${currentTrack.coverUrl})` }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-white/50">{currentTrack.artist}</p>
            <p className="text-xs text-white/30 mt-0.5">{currentTrack.genre} · {currentTrack.language}</p>
          </div>
          <div className="w-32">
            <AudioVisualizer mode="bars" height={36} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl glass border border-white/10 mb-8">
          <Info className="w-5 h-5 text-white/40 flex-shrink-0" />
          <p className="text-sm text-white/50">Play a track from the library to use studio tools</p>
        </div>
      )}

      {/* Tool grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          const hasEffect = (() => {
            switch (tool.id) {
              case 'eq': return effects.bass !== 0 || effects.mid !== 0 || effects.treble !== 0;
              case 'voice': return effects.pitch !== 0;
              case 'raga': return effects.selectedRaga !== null;
              case '8d': return effects.is8D;
              case 'lofi': return effects.isLoFi;
              case 'vocal': return effects.vocalLevel !== 1 || effects.instrumentLevel !== 1;
              case 'remix': return effects.tempo !== 1;
              default: return false;
            }
          })();

          return (
            <motion.button
              key={tool.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTool(isActive ? null : tool.id)}
              className={cn(
                'relative p-5 rounded-2xl border text-left transition-all',
                isActive
                  ? 'bg-white/10 border-primary/50 shadow-lg shadow-primary/20'
                  : hasEffect
                  ? 'glass border-white/15 bg-primary/5'
                  : 'glass border-white/8 hover:border-white/15'
              )}
            >
              {/* Badge */}
              {tool.badge && (
                <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-primary/30 text-[10px] font-bold text-primary-400 border border-primary/30">
                  {tool.badge}
                </div>
              )}

              {/* Effect indicator */}
              {hasEffect && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>

              <p className="font-display font-bold text-white text-sm mb-1">{tool.label}</p>
              <p className="text-xs text-white/50 leading-snug">{tool.desc}</p>

              {isActive && <ChevronRight className="absolute right-4 bottom-4 w-4 h-4 text-primary" />}
            </motion.button>
          );
        })}
      </div>

      {/* Active tool panel */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative p-6 rounded-2xl glass border border-white/10 shadow-xl"
          >
            <button
              onClick={() => setActiveTool(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activeTool === 'eq' && <EqControl />}
            {activeTool === 'voice' && <VoiceChanger />}
            {activeTool === 'raga' && <RagaChanger />}
            {activeTool === '8d' && <EightDAudio />}
            {activeTool === 'lofi' && <LoFiMaker />}
            {activeTool === 'vocal' && <VocalSplit />}
            {activeTool === 'remix' && <RemixLab />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
