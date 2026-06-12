export type MediaType = 'audio' | 'video';

export type Genre =
  | 'Carnatic Classical'
  | 'Hindustani Classical'
  | 'Tamil Film'
  | 'Hindi Film'
  | 'Telugu Film'
  | 'Malayalam Film'
  | 'Kannada Film'
  | 'Devotional'
  | 'Folk'
  | 'Fusion'
  | 'Instrumental'
  | 'Pop'
  | 'Indie';

export type Language =
  | 'Tamil'
  | 'Hindi'
  | 'Telugu'
  | 'Malayalam'
  | 'Kannada'
  | 'Sanskrit'
  | 'Bengali'
  | 'Gujarati'
  | 'Marathi'
  | 'Punjabi'
  | 'English';

export type Mood =
  | 'Joyful'
  | 'Devotional'
  | 'Romantic'
  | 'Melancholic'
  | 'Energetic'
  | 'Peaceful'
  | 'Festive'
  | 'Nostalgic'
  | 'Meditative';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // seconds
  genre: Genre;
  language: Language;
  year: number;
  raga?: string;
  mood?: Mood;
  coverUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  lyricsUrl?: string;
  type: MediaType;
  plays?: number;
  featured?: boolean;
  trending?: boolean;
}

export interface Raga {
  id: string;
  name: string;
  hindustaniName?: string;
  carnaticName?: string;
  arohana: string; // ascending scale
  avarohana: string; // descending scale
  mood: string;
  timeOfDay?: string;
  season?: string;
  semitones: number[]; // MIDI offsets from root
  description: string;
}

export interface EffectSettings {
  pitch: number; // -12 to +12 semitones
  tempo: number; // 0.5 to 2.0
  reverb: number; // 0 to 1
  bass: number; // -12 to +12 dB
  treble: number; // -12 to +12 dB
  mid: number; // -12 to +12 dB
  vocalLevel: number; // 0 to 1 (karaoke vocal isolation)
  instrumentLevel: number; // 0 to 1
  is8D: boolean;
  isLoFi: boolean;
  selectedRaga: string | null;
  eq: number[]; // 10-band EQ values
}

export const defaultEffects: EffectSettings = {
  pitch: 0,
  tempo: 1,
  reverb: 0,
  bass: 0,
  treble: 0,
  mid: 0,
  vocalLevel: 1,
  instrumentLevel: 1,
  is8D: false,
  isLoFi: false,
  selectedRaga: null,
  eq: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: string[]; // track IDs
  createdAt: number;
}

export interface StudioProject {
  id: string;
  name: string;
  trackId: string;
  effects: EffectSettings;
  loopStart?: number;
  loopEnd?: number;
  createdAt: number;
}

export type PlayerMode = 'normal' | 'karaoke' | 'studio' | 'visualizer';

export type ViewMode = 'grid' | 'list';

export type GenerationFilter = 'all' | 'genz' | 'millennial' | 'classic';
