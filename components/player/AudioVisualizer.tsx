'use client';
import { useEffect, useRef } from 'react';
import { useAudioContext } from '@/components/AudioProvider';
import { usePlayerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type VisualizerMode = 'bars' | 'wave' | 'circular' | 'ambient';

interface Props {
  mode?: VisualizerMode;
  className?: string;
  height?: number;
  color1?: string;
  color2?: string;
}

export function AudioVisualizer({
  mode = 'bars',
  className,
  height = 80,
  color1 = '#8b5cf6',
  color2 = '#ec4899',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const { getAnalyser } = useAudioContext();
  const { isPlaying } = usePlayerStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const analyser = getAnalyser();
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (!analyser || !isPlaying) {
        // Draw idle state
        drawIdle(ctx, W, H, mode, color1);
        return;
      }

      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(data);
      const waveData = new Uint8Array(bufLen);
      analyser.getByteTimeDomainData(waveData);

      switch (mode) {
        case 'bars': drawBars(ctx, W, H, data, color1, color2); break;
        case 'wave': drawWave(ctx, W, H, waveData, color1, color2); break;
        case 'circular': drawCircular(ctx, W, H, data, color1, color2); break;
        case 'ambient': drawAmbient(ctx, W, H, data, color1, color2); break;
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, isPlaying, color1, color2, getAnalyser]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full', className)}
      style={{ height }}
    />
  );
}

function drawIdle(ctx: CanvasRenderingContext2D, W: number, H: number, mode: string, color: string) {
  if (mode === 'bars') {
    const barCount = 60;
    const barW = W / barCount;
    ctx.fillStyle = color + '30';
    for (let i = 0; i < barCount; i++) {
      const h = 4 + Math.sin(i * 0.4) * 4;
      ctx.fillRect(i * barW + 1, H / 2 - h / 2, barW - 2, h);
    }
  } else {
    ctx.beginPath();
    ctx.strokeStyle = color + '30';
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
  }
}

function drawBars(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  data: Uint8Array, c1: string, c2: string
) {
  const barCount = Math.min(80, data.length);
  const barW = W / barCount;
  const grad = ctx.createLinearGradient(0, H, 0, 0);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  for (let i = 0; i < barCount; i++) {
    const v = data[i] / 255;
    const barH = v * H * 0.85;
    const x = i * barW;
    const radius = Math.min(barW * 0.3, 3);
    ctx.beginPath();
    ctx.roundRect(x + 1, H - barH, barW - 2, barH, [radius, radius, 0, 0]);
    ctx.fill();
    // Reflection
    ctx.globalAlpha = 0.15;
    ctx.scale(1, -1);
    ctx.translate(0, -H * 2);
    ctx.beginPath();
    ctx.roundRect(x + 1, H - barH, barW - 2, barH * 0.4, [0, 0, radius, radius]);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }
}

function drawWave(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  data: Uint8Array, c1: string, c2: string
) {
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.beginPath();
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  const sliceW = W / data.length;
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128;
    const y = (v * H) / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceW;
  }
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  // Fill area
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
  fillGrad.addColorStop(0, c1 + '40');
  fillGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fillGrad;
  ctx.fill();
}

function drawCircular(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  data: Uint8Array, c1: string, c2: string
) {
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(W, H) * 0.3;
  const barCount = 128;

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
    const v = data[Math.floor((i / barCount) * data.length)] / 255;
    const len = v * r * 0.8;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;
    const x2 = cx + Math.cos(angle) * (r + len);
    const y2 = cy + Math.sin(angle) * (r + len);

    const t = i / barCount;
    const color = interpolateColor(c1, c2, t);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Center circle
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
  grad.addColorStop(0, c1 + '20');
  grad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawAmbient(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  data: Uint8Array, c1: string, c2: string
) {
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const intensity = avg / 255;
  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  grad.addColorStop(0, c1 + Math.floor(intensity * 80).toString(16).padStart(2, '0'));
  grad.addColorStop(0.5, c2 + Math.floor(intensity * 40).toString(16).padStart(2, '0'));
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const hex = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = hex(c1);
  const [r2, g2, b2] = hex(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
