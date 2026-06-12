'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Info } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

export function VocalSplit() {
  const { effects, updateEffect } = usePlayerStore();
  const [processing, setProcessing] = useState(false);

  const simulateProcessing = () => {
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
  };

  const vocalPct = Math.round(effects.vocalLevel * 100);
  const instrPct = Math.round(effects.instrumentLevel * 100);

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Voice / Music Split</h3>
          <p className="text-xs text-white/40">Isolate vocals or instruments with mid-side processing</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-300/80 leading-relaxed">
          Uses mid-side processing to separate centered audio (vocals) from stereo content (instruments).
          Works best on professionally mixed tracks. AI-powered full separation coming soon.
        </p>
      </div>

      {/* Vocal / Instrument blend */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/80">Vocal Level</label>
          <span className="text-sm text-indigo-400 font-mono">{vocalPct}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={effects.vocalLevel}
          onChange={(e) => updateEffect('vocalLevel', Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>No Vocals</span>
          <span>50/50</span>
          <span>Vocals Only</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/80">Instrument Level</label>
          <span className="text-sm text-violet-400 font-mono">{instrPct}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={effects.instrumentLevel}
          onChange={(e) => updateEffect('instrumentLevel', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Quick presets */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '🎤 Karaoke', vocal: 0.05, instr: 1 },
          { label: '⚖️ Balanced', vocal: 1, instr: 1 },
          { label: '🎸 Music Only', vocal: 0, instr: 1 },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => {
              updateEffect('vocalLevel', p.vocal);
              updateEffect('instrumentLevel', p.instr);
              simulateProcessing();
            }}
            className="p-3 rounded-xl glass border border-white/10 hover:border-indigo-500/40 text-xs text-center transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stem separation (future AI) */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
        <p className="text-xs font-semibold text-white/60 mb-3">Stem Mixer</p>
        {['🥁 Drums', '🎸 Bass', '🎹 Melody', '🎤 Vocals'].map((stem) => (
          <div key={stem} className="flex items-center gap-3 mb-3 last:mb-0">
            <span className="text-xs text-white/50 w-20 flex-shrink-0">{stem}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: '100%' }}
                animate={{ opacity: processing ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 0.8, repeat: processing ? Infinity : 0 }}
              />
            </div>
            <span className="text-xs text-white/30 font-mono w-8">100%</span>
          </div>
        ))}
        <p className="text-[10px] text-white/25 mt-3">Full AI stem separation available with server integration</p>
      </div>
    </div>
  );
}
