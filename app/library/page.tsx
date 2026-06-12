'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, List, SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '@/components/library/SearchBar';
import { MediaCard } from '@/components/library/MediaCard';
import { sampleTracks, genres, languages, moods } from '@/lib/data/sampleMedia';
import { cn } from '@/lib/utils';
import type { Track } from '@/lib/types';

type ViewMode = 'grid' | 'list';

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'year' | 'plays'>('plays');

  const filtered = useMemo<Track[]>(() => {
    let list = [...sampleTracks];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album?.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q) ||
          t.language.toLowerCase().includes(q) ||
          t.raga?.toLowerCase().includes(q)
      );
    }

    if (selectedGenres.length > 0) {
      list = list.filter((t) => selectedGenres.includes(t.genre));
    }

    if (selectedLanguages.length > 0) {
      list = list.filter((t) => selectedLanguages.includes(t.language));
    }

    if (selectedMood) {
      list = list.filter((t) => t.mood === selectedMood);
    }

    list.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'plays') return (b.plays ?? 0) - (a.plays ?? 0);
      return 0;
    });

    return list;
  }, [query, selectedGenres, selectedLanguages, selectedMood, sortBy]);

  const toggleGenre = (g: string) =>
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const toggleLanguage = (l: string) =>
    setSelectedLanguages((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSelectedMood(null);
  };

  const activeFilterCount = selectedGenres.length + selectedLanguages.length + (selectedMood ? 1 : 0);

  return (
    <div className="min-h-screen px-5 md:px-10 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">Library</h1>
        <p className="text-sm text-white/40">50,000+ songs · Browse and discover</p>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all',
              showFilters || activeFilterCount > 0
                ? 'bg-primary/20 border-primary/50 text-primary-400'
                : 'glass border-white/10 text-white/60 hover:text-white'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-xs text-white flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="glass border border-white/10 rounded-2xl px-3 py-2.5 text-sm text-white/70 bg-transparent outline-none cursor-pointer"
          >
            <option value="plays" className="bg-surface">Most Played</option>
            <option value="title" className="bg-surface">Title</option>
            <option value="artist" className="bg-surface">Artist</option>
            <option value="year" className="bg-surface">Newest</option>
          </select>

          {/* View mode */}
          <div className="flex glass border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-xl transition-colors', viewMode === 'grid' ? 'bg-primary/30 text-primary' : 'text-white/40 hover:text-white')}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-xl transition-colors', viewMode === 'list' ? 'bg-primary/30 text-primary' : 'text-white/40 hover:text-white')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass border border-white/10 rounded-2xl p-5 mb-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Genres */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Genre</p>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    selectedGenres.includes(g)
                      ? 'bg-primary/30 border border-primary/50 text-primary-400'
                      : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLanguage(l)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    selectedLanguages.includes(l)
                      ? 'bg-secondary/30 border border-secondary/50 text-pink-400'
                      : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Mood</p>
            <div className="flex flex-wrap gap-2">
              {moods.filter(Boolean).map((m) => (
                <button
                  key={m as string}
                  onClick={() => setSelectedMood(selectedMood === m ? null : m as string)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    selectedMood === m
                      ? 'bg-amber-500/30 border border-amber-500/50 text-amber-400'
                      : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  )}
                >
                  {m as string}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/40">
          {filtered.length} {filtered.length === 1 ? 'track' : 'tracks'}
          {query && <span> for &quot;{query}&quot;</span>}
        </p>
      </div>

      {/* Tracks */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-white/40 text-sm">No tracks found</p>
          <button onClick={clearFilters} className="mt-3 text-xs text-primary hover:underline">Clear filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
            >
              <MediaCard track={track} tracks={filtered} view="grid" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
            >
              <MediaCard track={track} tracks={filtered} view="list" rank={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
