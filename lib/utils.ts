import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPlays(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
  if (plays >= 1_000) return `${(plays / 1_000).toFixed(0)}K`;
  return plays.toString();
}

export function getColorFromString(str: string): string {
  const colors = [
    'from-violet-600 to-purple-800',
    'from-pink-600 to-rose-800',
    'from-amber-500 to-orange-700',
    'from-emerald-500 to-teal-700',
    'from-sky-500 to-blue-700',
    'from-indigo-600 to-violet-800',
    'from-rose-500 to-pink-700',
    'from-teal-500 to-cyan-700',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
