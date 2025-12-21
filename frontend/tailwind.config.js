/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bleu-nuit': '#0F1B2E',
        'or': '#D4A853',
        'sable': '#E8DCC4',
        'parchemin': '#F5F0E6',
        'terre': '#8B6E4E',
        'nuit': {
          DEFAULT: '#0F1B2E',
          light: '#1A2B45',
          dark: '#0A1220',
        },
        'gold': {
          DEFAULT: '#D4A853',
          light: '#E8C574',
          dark: '#B8903F',
        },
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'display': ['Philosopher', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'lantern': 'lantern 4s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        lantern: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 168, 83, 0.3)',
        'glow-lg': '0 0 40px rgba(212, 168, 83, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
