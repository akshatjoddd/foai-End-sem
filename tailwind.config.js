/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        // Light mode palette
        light: {
          bg: '#f0f4f8',
          card: '#ffffff',
          border: '#d1dce6',
          muted: '#8896a4',
        },
        // Dark mode / cyberpunk palette
        cyber: {
          bg: '#0a0e1a',
          card: '#0d1525',
          cardHover: '#111b30',
          border: '#1a2540',
        },
        // Neon accent colors
        neon: {
          cyan: '#00e5ff',
          orange: '#ff6b2b',
          green: '#00ff88',
          pink: '#ff2d78',
          purple: '#b537f2',
          yellow: '#ffd600',
        },
        accent: { DEFAULT: '#ff6b2b', dark: '#e05a20' },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.05)',
        'glow-orange': '0 0 15px rgba(255, 107, 43, 0.3), inset 0 0 15px rgba(255, 107, 43, 0.05)',
        'glow-green': '0 0 15px rgba(0, 255, 136, 0.3), inset 0 0 15px rgba(0, 255, 136, 0.05)',
        'glow-pink': '0 0 15px rgba(255, 45, 120, 0.3), inset 0 0 15px rgba(255, 45, 120, 0.05)',
        'glow-purple': '0 0 15px rgba(181, 55, 242, 0.3), inset 0 0 15px rgba(181, 55, 242, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
