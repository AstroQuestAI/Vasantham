'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Square } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

const beats = [
  { id: 'tabla', label: 'Tabla', emoji: '🪘' },
  { id: 'dhol', label: 'Dhol', emoji: '🥁' },
  { id: 'kick', label: 'Kick', emoji: '🔊' },
  { id: 'mridangam', label: 'Mridangam', emoji: '🎵' },
];

export function RemixLab() {
  const { effects, updateEffect } = usePlayerStore();
  const [beatPlaying, setBeatPlaying] = useState<string | null>(null);
  const [loopEnabled, setLoopEnabled] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Remix Lab</h3>
          <p className="text-xs text-white/40">Loop regions, change tempo, layer beats</p>
        </div>
      </div>

      {/* Tempo control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/80">Playback Speed</label>
          <span className="text-sm text-rose-400 font-mono">{effects.tempo.toFixed(2)}×</span>
        </div>
        <input
          type="range" min={0.5} max={2} step={0.05} value={effects.tempo}
          onChange={(e) => updateEffect('tempo', Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>0.5× Slow</span>
          <span>1.0× Normal</span>
          <span>2.0× Fast</span>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[0.75, 1.0, 1.25, 1.5].map((s) => (
            <button key={s} onClick={() => updateEffect('tempo', s)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                Math.abs(effects.tempo - s) < 0.01
                  ? 'bg-rose-500/30 border border-rose-500/50 text-rose-400'
                  : 'glass border border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Loop region */}
      <div className="mb-6 p-4 rounded-2xl glass border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Loop Region</p>
          <button
            onClick={() => setLoopEnabled(!loopEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${loopEnabled ? 'bg-rose-500' : 'bg-white/20'}`}
          >
            <motion.div animate={{ x: loopEnabled ? 20 : 2 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
          </button>
        </div>

        {/* Waveform-style loop selector */}
        <div className="relative h-12 bg-black/40 rounded-lg overflow-hidden cursor-crosshair">
          <div className="flex items-end gap-0.5 h-full px-1 py-1">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-rose-500/40"
                style={{ height: `${25 + Math.sin(i * 0.8) * 15 + Math.random() * 15}%` }}
              />
            ))}
          </div>
          {loopEnabled && (
            <div
              className="absolute inset-y-0 bg-rose-500/20 border-x-2 border-rose-500"
              style={{ left: '20%', right: '30%' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-rose-400 mt-1">Loop</div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-white/30 mt-2">Connect audio source to enable interactive loop selection</p>
      </div>

      {/* Beat layering */}
      <div>
        <p className="text-sm font-semibold text-white mb-3">Layer Indian Beats</p>
        <div className="grid grid-cols-2 gap-3">
          {beats.map((beat) => {
            const isPlaying = beatPlaying === beat.id;
            return (
              <motion.button
                key={beat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBeatPlaying(isPlaying ? null : beat.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isPlaying
                    ? 'bg-rose-500/20 border-rose-500/50'
                    : 'glass border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{beat.emoji}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{beat.label}</p>
                  {isPlaying && (
                    <div className="flex gap-0.5 mt-1">
                      <div className="w-0.5 h-3 bg-rose-400 rounded-full eq-bar-1" />
                      <div className="w-0.5 h-3 bg-rose-400 rounded-full eq-bar-2" />
                      <div className="w-0.5 h-3 bg-rose-400 rounded-full eq-bar-3" />
                    </div>
                  )}
                </div>
                <div className="ml-auto">
                  {isPlaying
                    ? <Square className="w-4 h-4 text-rose-400" />
                    : <Play className="w-4 h-4 text-white/40" />
                  }
                </div>
              </motion.button>
            );
          })}
        </div>
        <p className="text-[10px] text-white/25 mt-3">Beat layering connects to the audio engine with real audio sources</p>
      </div>
    </div>
  );
}
