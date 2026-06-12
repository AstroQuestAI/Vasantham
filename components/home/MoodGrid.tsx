'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Zap, Moon, Sun, Music, Leaf, Drum, Star } from 'lucide-react';

const moods = [
  { id: 'Devotional', label: 'Devotional', icon: Star, gradient: 'from-amber-500 to-orange-600', emoji: '🪔' },
  { id: 'Romantic', label: 'Romantic', icon: Heart, gradient: 'from-rose-500 to-pink-700', emoji: '💕' },
  { id: 'Energetic', label: 'Energetic', icon: Zap, gradient: 'from-yellow-400 to-orange-500', emoji: '⚡' },
  { id: 'Meditative', label: 'Meditative', icon: Moon, gradient: 'from-indigo-500 to-purple-700', emoji: '🧘' },
  { id: 'Festive', label: 'Festive', icon: Drum, gradient: 'from-red-500 to-rose-700', emoji: '🥁' },
  { id: 'Peaceful', label: 'Peaceful', icon: Leaf, gradient: 'from-emerald-500 to-teal-700', emoji: '🌿' },
  { id: 'Nostalgic', label: 'Nostalgic', icon: Sun, gradient: 'from-amber-400 to-yellow-600', emoji: '🌅' },
  { id: 'Joyful', label: 'Joyful', icon: Music, gradient: 'from-violet-500 to-purple-700', emoji: '🎶' },
];

export function MoodGrid() {
  const router = useRouter();

  return (
    <section className="px-6 md:px-10 mb-10">
      <h2 className="font-display text-xl font-bold text-white mb-4">How are you feeling?</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {moods.map((mood, i) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/library?mood=${mood.id}`)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl glass border border-white/5 hover:border-white/15 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mood.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <span className="text-xl">{mood.emoji}</span>
            </div>
            <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors text-center leading-tight">
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
