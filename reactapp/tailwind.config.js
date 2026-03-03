/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'neural': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8b92f6',
          500: '#7c6aef',
          600: '#6d4de3',
          700: '#5d3bc8',
          800: '#4c32a2',
          900: '#402d81',
        },
        'cyber': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'neural-pulse': 'neural-pulse 4s ease-in-out infinite',
        'blob-drift': 'blob-drift 20s ease-in-out infinite',
        'blob-pulse': 'blob-pulse 15s ease-in-out infinite',
        'gentle-float': 'gentle-float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'blob-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'neural-gradient': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
        'cyber-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'geometric-pattern': 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
        'wave-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(148, 163, 184, 0.05) 10px, rgba(148, 163, 184, 0.05) 20px)',
      }
    },
  },
  plugins: [],
}