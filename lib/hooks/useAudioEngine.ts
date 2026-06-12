'use client';
import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/lib/store';
import { resolveJioSaavnUrl } from '@/lib/resolveJioSaavn';

export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const midRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  const {
    currentTrack, isPlaying, volume, isMuted,
    effects, setCurrentTime, setDuration, next, repeatMode,
  } = usePlayerStore();

  const buildChain = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const ctx = new AudioContext();
    contextRef.current = ctx;

    const source = ctx.createMediaElementSource(audio);
    sourceRef.current = source;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const bass = ctx.createBiquadFilter();
    bass.type = 'lowshelf';
    bass.frequency.value = 200;
    bassRef.current = bass;

    const mid = ctx.createBiquadFilter();
    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 1;
    midRef.current = mid;

    const treble = ctx.createBiquadFilter();
    treble.type = 'highshelf';
    treble.frequency.value = 3000;
    trebleRef.current = treble;

    const panner = ctx.createStereoPanner();
    pannerRef.current = panner;

    const dryGain = ctx.createGain();
    dryGain.gain.value = 1;
    dryGainRef.current = dryGain;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0;
    reverbGainRef.current = reverbGain;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    gainRef.current = masterGain;

    // Build impulse response for reverb
    const reverb = ctx.createConvolver();
    reverbRef.current = reverb;
    createImpulseResponse(ctx).then((buffer) => {
      reverb.buffer = buffer;
    });

    // Chain: source → bass → mid → treble → panner → [dry/wet split] → analyser → master → out
    source.connect(bass);
    bass.connect(mid);
    mid.connect(treble);
    treble.connect(panner);

    panner.connect(dryGain);
    panner.connect(reverb);
    reverb.connect(reverbGain);

    dryGain.connect(analyser);
    reverbGain.connect(analyser);
    analyser.connect(masterGain);
    masterGain.connect(ctx.destination);
  }, [volume]);

  const createImpulseResponse = async (ctx: AudioContext): Promise<AudioBuffer> => {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 2.5;
    const buffer = ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5);
      }
    }
    return buffer;
  };

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    // Disable browser's built-in pitch correction so our playbackRate changes actually shift pitch
    (audio as any).preservesPitch = false;
    (audio as any).mozPreservesPitch = false;
    (audio as any).webkitPreservesPitch = false;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
      contextRef.current?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track changes — resolve real stream URL from JioSaavn, fall back to audioUrl
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;

    const load = async () => {
      let url = currentTrack.audioUrl ?? currentTrack.videoUrl ?? '';
      try {
        const resolved = await resolveJioSaavnUrl(currentTrack.title, currentTrack.album ?? '');
        if (resolved) url = resolved;
      } catch {
        // keep fallback
      }
      console.log('[JioSaavn]', currentTrack.title, '=>', url);
      if (url) audio.src = url;

      if (isPlaying) {
        if (!contextRef.current) buildChain();
        else if (contextRef.current.state === 'suspended') contextRef.current.resume();
        audio.play().catch(() => {});
      }
    };

    load();
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (!contextRef.current) buildChain();
      else if (contextRef.current.state === 'suspended') {
        contextRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume
  useEffect(() => {
    if (!gainRef.current) {
      if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
      return;
    }
    gainRef.current.gain.value = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Playback rate: combines tempo and pitch shift.
  // pitch shift in semitones → rate multiplier = 2^(n/12)
  // Both are applied together so changing pitch also shifts tempo slightly,
  // which is the browser-native trade-off without a full pitch-stretch library.
  useEffect(() => {
    if (!audioRef.current) return;
    const pitchRate = Math.pow(2, effects.pitch / 12);
    audioRef.current.playbackRate = effects.tempo * pitchRate;
  }, [effects.tempo, effects.pitch]);

  // Bass EQ
  useEffect(() => {
    if (bassRef.current) bassRef.current.gain.value = effects.bass;
  }, [effects.bass]);

  // Mid EQ
  useEffect(() => {
    if (midRef.current) midRef.current.gain.value = effects.mid;
  }, [effects.mid]);

  // Treble EQ
  useEffect(() => {
    if (trebleRef.current) trebleRef.current.gain.value = effects.treble;
  }, [effects.treble]);

  // Reverb wet level
  useEffect(() => {
    if (reverbGainRef.current) reverbGainRef.current.gain.value = effects.reverb;
    if (dryGainRef.current) dryGainRef.current.gain.value = 1 - effects.reverb * 0.5;
  }, [effects.reverb]);

  // Lo-fi: low-pass filter on treble
  useEffect(() => {
    if (!trebleRef.current) return;
    if (effects.isLoFi) {
      trebleRef.current.type = 'lowpass';
      trebleRef.current.frequency.value = 2000;
    } else {
      trebleRef.current.type = 'highshelf';
      trebleRef.current.frequency.value = 3000;
    }
  }, [effects.isLoFi]);

  const getAnalyser = useCallback(() => analyserRef.current, []);
  const getAudioElement = useCallback(() => audioRef.current, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, [setCurrentTime]);

  return { getAnalyser, getAudioElement, seekTo };
}
