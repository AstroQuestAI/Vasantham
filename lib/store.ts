'use client';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Track, EffectSettings, PlayerMode } from '@/lib/types';
import { defaultEffects } from '@/lib/types';

interface PlayerStore {
  // Playback state
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: Track[];
  queueIndex: number;

  // UI state
  playerMode: PlayerMode;
  showFullPlayer: boolean;
  showQueue: boolean;

  // Effects
  effects: EffectSettings;

  // Library
  favorites: string[]; // track IDs
  recentlyPlayed: Track[];

  // Actions
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  addToQueue: (track: Track) => void;
  setPlayerMode: (mode: PlayerMode) => void;
  setShowFullPlayer: (show: boolean) => void;
  setShowQueue: (show: boolean) => void;
  updateEffect: <K extends keyof EffectSettings>(key: K, value: EffectSettings[K]) => void;
  resetEffects: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const usePlayerStore = create<PlayerStore>()(
  subscribeWithSelector((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    queue: [],
    queueIndex: 0,
    playerMode: 'normal',
    showFullPlayer: false,
    showQueue: false,
    effects: { ...defaultEffects },
    favorites: [],
    recentlyPlayed: [],

    play: (track, queue) => {
      const current = get();
      const newQueue = queue ?? [track];
      const idx = newQueue.findIndex((t) => t.id === track.id);
      const recent = [track, ...current.recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 20);
      set({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        queue: newQueue,
        queueIndex: idx >= 0 ? idx : 0,
        recentlyPlayed: recent,
      });
    },

    pause: () => set({ isPlaying: false }),
    resume: () => set({ isPlaying: true }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    next: () => {
      const { queue, queueIndex, isShuffled, repeatMode } = get();
      if (!queue.length) return;
      let nextIdx: number;
      if (isShuffled) {
        nextIdx = Math.floor(Math.random() * queue.length);
      } else if (queueIndex < queue.length - 1) {
        nextIdx = queueIndex + 1;
      } else if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
      const track = queue[nextIdx];
      set({ currentTrack: track, queueIndex: nextIdx, currentTime: 0, isPlaying: true });
    },

    prev: () => {
      const { queue, queueIndex, currentTime } = get();
      if (currentTime > 3) {
        set({ currentTime: 0 });
        return;
      }
      if (!queue.length) return;
      const prevIdx = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
      set({ currentTrack: queue[prevIdx], queueIndex: prevIdx, currentTime: 0, isPlaying: true });
    },

    seek: (time) => set({ currentTime: time }),
    setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)), isMuted: false }),
    toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
    toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),

    cycleRepeat: () =>
      set((s) => ({
        repeatMode: s.repeatMode === 'none' ? 'all' : s.repeatMode === 'all' ? 'one' : 'none',
      })),

    setCurrentTime: (t) => set({ currentTime: t }),
    setDuration: (d) => set({ duration: d }),

    addToQueue: (track) =>
      set((s) => ({ queue: [...s.queue, track] })),

    setPlayerMode: (mode) => set({ playerMode: mode }),
    setShowFullPlayer: (show) => set({ showFullPlayer: show }),
    setShowQueue: (show) => set({ showQueue: show }),

    updateEffect: (key, value) =>
      set((s) => ({ effects: { ...s.effects, [key]: value } })),

    resetEffects: () => set({ effects: { ...defaultEffects } }),

    toggleFavorite: (id) =>
      set((s) => ({
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((f) => f !== id)
          : [...s.favorites, id],
      })),

    isFavorite: (id) => get().favorites.includes(id),
  }))
);
