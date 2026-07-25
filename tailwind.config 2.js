/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F5',
          100: '#FFE4F0',
          200: '#FFD1DC',
          300: '#FFB6C1',
          400: '#FFA0B4',
          500: '#FF85A8',
          600: '#FF6B95',
          700: '#FF5282',
          800: '#FF396F',
          900: '#FF1F5C',
        },
        pastel: {
          pink: '#FFD1DC',
          lavender: '#E6E6FA',
          peach: '#FFDAB9',
          mint: '#B5EAD7',
          babyBlue: '#B0E0E6',
        },
        glass: {
          light: 'rgba(255, 209, 220, 0.1)',
          medium: 'rgba(255, 209, 220, 0.2)',
          dark: 'rgba(255, 209, 220, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        cute: ['Comic Sans MS', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'wobble': 'wobble 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 209, 220, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 209, 220, 0.6)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #FFD1DC 0%, #FFB6C1 50%, #E6E6FA 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 209, 220, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(255, 209, 220, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(255, 209, 220, 0.4)',
        'inner-glass': 'inset 0 2px 4px rgba(255, 209, 220, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
