'use client';
import { useState, useCallback } from 'react';
import { Search, X, Mic } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search songs, artists, ragas…' }: Props) {
  const [focused, setFocused] = useState(false);

  const clear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl glass border transition-all ${
      focused ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-white/10 hover:border-white/20'
    }`}>
      <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${focused ? 'text-primary' : 'text-white/40'}`} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
      />

      {value && (
        <button onClick={clear} className="text-white/40 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}

      <button className="text-white/40 hover:text-primary transition-colors" title="Voice search">
        <Mic className="w-4 h-4" />
      </button>
    </div>
  );
}
