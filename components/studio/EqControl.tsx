'use client';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

const bands = [
  { label: '60Hz', key: 'bass' as const, desc: 'Sub Bass' },
  { label: '250Hz', key: 'mid' as const, desc: 'Mid' },
  { label: '8kHz', key: 'treble' as const, desc: 'Treble' },
];

const presets = [
  { name: 'Flat', bass: 0, mid: 0, treble: 0 },
  { name: 'Bass Boost', bass: 8, mid: 0, treble: -2 },
  { name: 'Vocal Clear', bass: -4, mid: 6, treble: 4 },
  { name: 'Classical', bass: 2, mid: -1, treble: 4 },
  { name: 'Lo-Fi', bass: 4, mid: -2, treble: -6 },
  { name: 'Tabla Rich', bass: 6, mid: 2, treble: 0 },
];

export function EqControl() {
  const { effects, updateEffect } = usePlayerStore();

  const applyPreset = (p: typeof presets[0]) => {
    updateEffect('bass', p.bass);
    updateEffect('mid', p.mid);
    updateEffect('treble', p.treble);
  };

  const reset = () => applyPreset(presets[0]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-bold text-white">Equalizer</h3>
          <p className="text-xs text-white/40">3-band EQ for tonal control</p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap mb-6">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full text-xs font-medium glass border border-white/10 hover:border-primary/40 hover:text-primary transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-3 gap-8">
        {bands.map(({ label, key, desc }) => {
          const value = effects[key] as number;
          const pct = ((value + 12) / 24) * 100;

          return (
            <div key={key} className="flex flex-col items-center gap-3">
              <span className="text-sm font-bold text-white">{value > 0 ? '+' : ''}{value} dB</span>

              {/* Vertical slider */}
              <div className="relative h-32 flex items-center justify-center">
                <div className="absolute w-1 h-full bg-white/10 rounded-full" />
                <div
                  className="absolute w-1 rounded-full bg-gradient-to-t from-primary to-secondary transition-all"
                  style={{
                    bottom: '50%',
                    height: `${Math.abs(value / 12) * 50}%`,
                    transform: value < 0 ? 'translateY(100%)' : undefined,
                    background: value < 0
                      ? 'linear-gradient(to bottom, #ec4899, #8b5cf6)'
                      : 'linear-gradient(to top, #8b5cf6, #ec4899)',
                  }}
                />
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={0.5}
                  value={value}
                  onChange={(e) => updateEffect(key, Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl', width: '100%', height: '100%' }}
                />
                {/* Thumb */}
                <motion.div
                  className="absolute w-5 h-5 rounded-full bg-white shadow-lg border-2 border-primary pointer-events-none"
                  style={{ bottom: `${pct}%`, transform: 'translateY(50%)' }}
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">{label}</p>
                <p className="text-[10px] text-white/40">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spectrum preview */}
      <div className="mt-6 p-3 rounded-xl bg-black/30">
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 30 }).map((_, i) => {
            const freq = i / 30;
            let gain = 0;
            if (freq < 0.3) gain = effects.bass / 12;
            else if (freq < 0.7) gain = effects.mid / 12;
            else gain = effects.treble / 12;
            const h = 50 + gain * 40;
            return (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${Math.max(4, h)}%`,
                  background: `linear-gradient(to top, #8b5cf6, #ec4899)`,
                  opacity: 0.6 + Math.abs(gain) * 0.4,
                  transition: 'height 0.15s ease',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/30">60Hz</span>
          <span className="text-[10px] text-white/30">1kHz</span>
          <span className="text-[10px] text-white/30">16kHz</span>
        </div>
      </div>
    </div>
  );
}
