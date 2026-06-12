'use client';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

export function EightDAudio() {
  const { effects, updateEffect } = usePlayerStore();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">8D Audio</h3>
          <p className="text-xs text-white/40">Immersive spatial audio — best with headphones</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass border border-white/10 mb-6">
        <div>
          <p className="text-sm font-semibold text-white">Enable 8D Effect</p>
          <p className="text-xs text-white/40 mt-0.5">Rotates audio in 3D space around your head</p>
        </div>
        <button
          onClick={() => updateEffect('is8D', !effects.is8D)}
          className={`relative w-12 h-6 rounded-full transition-colors ${effects.is8D ? 'bg-sky-500' : 'bg-white/20'}`}
        >
          <motion.div
            animate={{ x: effects.is8D ? 24 : 2 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
          />
        </button>
      </div>

      {/* Visual */}
      <div className="flex flex-col items-center py-6">
        <div className="relative w-48 h-48">
          {/* Orbit rings */}
          {[1, 0.7, 0.4].map((scale, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-sky-500/20"
              style={{ transform: `scale(${scale})`, margin: 'auto', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          ))}

          {/* Head */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/30 to-blue-700/30 border border-sky-500/40 flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
          </div>

          {/* Sound orb */}
          {effects.is8D && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50 pulse-ring" />
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-white/40 mt-4 text-center max-w-48">
          {effects.is8D
            ? '🎧 Use headphones for the best immersive experience'
            : 'Enable 8D to begin spatial audio rotation'}
        </p>
      </div>

      {/* Headphone recommendation */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
        <span className="text-2xl">🎧</span>
        <p className="text-xs text-sky-300/80">
          8D Audio works best with stereo headphones. Speakers will show minimal effect.
        </p>
      </div>
    </div>
  );
}
