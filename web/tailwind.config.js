/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black:   '#000000',
        'black-soft': '#0A0A0A',
        navy:    '#0D1B2A',
        royal:   '#0D2B5E',
        gold:    '#D4AF37',
        'gold-light': '#F0D060',
        'gold-dark':  '#A08828',
        surface: '#111111',
        card:    '#161616',
        'card-hover': '#1E1E1E',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #F0D060, #D4AF37, #A08828)',
        'dark-gradient':  'linear-gradient(180deg, #000000, #0D1B2A)',
        'royal-gradient': 'linear-gradient(135deg, #0D1B2A, #0D2B5E)',
      },
      letterSpacing: {
        'ultra': '0.3em',
        'mega':  '0.5em',
      },
      animation: {
        'fade-up':    'fadeUp 0.8s ease forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'fade-left':  'fadeLeft 0.8s ease forwards',
        'fade-right': 'fadeRight 0.8s ease forwards',
        'shimmer':    'shimmer 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'beam':       'beam 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(50px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
        beam: {
          '0%,100%': { opacity: '0.3' },
          '50%':     { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
