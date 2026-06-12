'use client';
import { motion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

const presets = [
  { name: 'Original', pitch: 0, icon: '🎤' },
  { name: 'Child', pitch: 5, icon: '👦' },
  { name: 'Deep', pitch: -4, icon: '🎙' },
  { name: 'Chipmunk', pitch: 8, icon: '🐿' },
  { name: 'Robot', pitch: -6, icon: '🤖' },
  { name: 'Villain', pitch: -8, icon: '😈' },
  { name: 'Helium', pitch: 10, icon: '🎈' },
  { name: 'Male→Female', pitch: 6, icon: '🔄' },
];

export function VoiceChanger() {
  const { effects, updateEffect } = usePlayerStore();

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center">
          <Mic2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Voice Changer</h3>
          <p className="text-xs text-white/40">Pitch shift & voice transformation</p>
        </div>
      </div>

      {/* Pitch slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/80">Pitch Shift</label>
          <span className="text-sm font-bold text-pink-400 font-mono">
            {effects.pitch > 0 ? '+' : ''}{effects.pitch} semitones
          </span>
        </div>
        <input
          type="range"
          min={-12}
          max={12}
          step={0.5}
          value={effects.pitch}
          onChange={(e) => updateEffect('pitch', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1 font-mono">
          <span>-12st (Deep)</span>
          <span>0 (Original)</span>
          <span>+12st (High)</span>
        </div>
      </div>

      {/* Reverb / room */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/80">Room / Reverb</label>
          <span className="text-sm font-bold text-pink-400 font-mono">{Math.round(effects.reverb * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={effects.reverb}
          onChange={(e) => updateEffect('reverb', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>Dry</span>
          <span>Bathroom</span>
          <span>Concert Hall</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-sm font-medium text-white/80 mb-3">Voice Presets</p>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => {
            const isActive = Math.abs(effects.pitch - p.pitch) < 0.3;
            return (
              <motion.button
                key={p.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateEffect('pitch', p.pitch)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                  isActive
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                    : 'glass border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs font-medium leading-tight">{p.name}</span>
                <span className="text-[10px] font-mono text-white/40">{p.pitch > 0 ? '+' : ''}{p.pitch}st</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Visual pitch indicator */}
      <div className="mt-6 p-4 rounded-xl bg-black/30 flex items-center justify-center gap-3">
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 12 }).map((_, i) => {
            const semitone = i - 6;
            const active = Math.round(effects.pitch) === semitone;
            const height = active ? 48 : 20 + Math.random() * 10;
            return (
              <div
                key={i}
                className={`w-3 rounded transition-all duration-200 ${active ? 'bg-gradient-to-t from-pink-600 to-rose-400' : 'bg-white/10'}`}
                style={{ height: active ? 48 : 20 }}
              />
            );
          })}
        </div>
        <p className="text-xs text-white/40">
          {effects.pitch === 0 ? 'Original pitch' : effects.pitch > 0 ? `${effects.pitch} semitones higher` : `${Math.abs(effects.pitch)} semitones lower`}
        </p>
      </div>
    </div>
  );
}
