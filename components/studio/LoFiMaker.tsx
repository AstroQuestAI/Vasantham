'use client';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

const presets = [
  { name: '☕ Café', reverb: 0.3, bass: 2, treble: -4 },
  { name: '🌧 Rainy', reverb: 0.5, bass: 3, treble: -6 },
  { name: '📼 Cassette', reverb: 0.1, bass: 4, treble: -8 },
  { name: '🌙 Late Night', reverb: 0.4, bass: 5, treble: -5 },
];

export function LoFiMaker() {
  const { effects, updateEffect } = usePlayerStore();

  const apply = (p: typeof presets[0]) => {
    updateEffect('reverb', p.reverb);
    updateEffect('bass', p.bass);
    updateEffect('treble', p.treble);
    if (!effects.isLoFi) updateEffect('isLoFi', true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Lo-Fi Maker</h3>
          <p className="text-xs text-white/40">Add that warm, nostalgic, chill vibe</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass border border-white/10 mb-6">
        <div>
          <p className="text-sm font-semibold text-white">Lo-Fi Mode</p>
          <p className="text-xs text-white/40 mt-0.5">Low-pass filter + warm saturation</p>
        </div>
        <button
          onClick={() => updateEffect('isLoFi', !effects.isLoFi)}
          className={`relative w-12 h-6 rounded-full transition-colors ${effects.isLoFi ? 'bg-emerald-500' : 'bg-white/20'}`}
        >
          <motion.div
            animate={{ x: effects.isLoFi ? 24 : 2 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
          />
        </button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {presets.map((p) => (
          <motion.button
            key={p.name}
            whileTap={{ scale: 0.96 }}
            onClick={() => apply(p)}
            className="p-3 rounded-xl glass border border-white/10 hover:border-emerald-500/30 text-left transition-all group"
          >
            <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{p.name}</p>
            <p className="text-xs text-white/40 mt-0.5">
              Reverb {Math.round(p.reverb * 100)}% · Bass +{p.bass}dB · Treble {p.treble}dB
            </p>
          </motion.button>
        ))}
      </div>

      {/* Warmth slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Warmth / Reverb</label>
          <span className="text-sm text-emerald-400 font-mono">{Math.round(effects.reverb * 100)}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={effects.reverb}
          onChange={(e) => updateEffect('reverb', Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Bass Warmth</label>
          <span className="text-sm text-emerald-400 font-mono">{effects.bass > 0 ? '+' : ''}{effects.bass} dB</span>
        </div>
        <input
          type="range" min={-6} max={12} step={0.5} value={effects.bass}
          onChange={(e) => updateEffect('bass', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Lo-fi visual */}
      <div className="mt-4 p-4 rounded-xl bg-black/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">{effects.isLoFi ? '📼' : '🎵'}</div>
          <p className="text-xs text-white/40">
            {effects.isLoFi ? 'Lo-Fi mode active — vibing in retro' : 'Enable Lo-Fi for the aesthetic experience'}
          </p>
        </div>
      </div>
    </div>
  );
}
