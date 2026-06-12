import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080812',
        surface: '#0f0f1e',
        surface2: '#16162a',
        surface3: '#1e1e38',
        primary: {
          DEFAULT: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
        secondary: {
          DEFAULT: '#ec4899',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        accent: {
          DEFAULT: '#f59e0b',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        jade: '#10b981',
        sky: '#38bdf8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'vasantham': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 30%, #db2777 70%, #f59e0b 100%)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, transparent 70%)',
        'glow-pink': 'radial-gradient(ellipse at center, rgba(236,72,153,0.3) 0%, transparent 70%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'equalizer': 'equalizer 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(236,72,153,0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'equalizer': {
          '0%': { height: '4px' },
          '100%': { height: '20px' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
