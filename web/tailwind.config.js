/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black:  '#0A0A0A',
        navy:   '#0D1B2A',
        gold:   '#D4AF37',
        'gold-light': '#F0D060',
        'gold-dark':  '#A08828',
        surface: '#111827',
        card:    '#141E2B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F0D060, #D4AF37, #A08828)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A, #0D1B2A)',
      },
    },
  },
  plugins: [],
}
