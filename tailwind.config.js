/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB6C1',
          lavender: '#D8BFD8',
          purple: '#C9A0DC',
          blue: '#ADD8E6',
          teal: '#98D8D8',
          mint: '#B5EAD7',
          peach: '#FFDAB9',
          cream: '#FFF8DC',
        },
        accent: {
          primary: '#8B5CF6',
          secondary: '#6366F1',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(255, 255, 255, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'wobble': 'wobble 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 50%, #D1D5DB 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
        'glass-lg': '0 12px 48px 0 rgba(139, 92, 246, 0.2)',
        'inner-glass': 'inset 0 2px 4px rgba(255, 255, 255, 0.1)',
        'purple': '0 4px 14px rgba(139, 92, 246, 0.3)',
        'purple-lg': '0 10px 25px rgba(139, 92, 246, 0.4)',
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
