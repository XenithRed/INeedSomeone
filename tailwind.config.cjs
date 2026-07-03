/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f7fff8',
          light: '#ecfff0',
          lighter: '#dffbf0',
          card: '#ffffff',
          hover: '#f0fff4',
        },
        brand: {
          DEFAULT: '#22c55e',
          light: '#86efac',
          dark: '#15803d',
          gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
        },
        accent: {
          pink: '#ff4daf',
          teal: '#2dd4bf',
          amber: '#facc15',
          emerald: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          tertiary: '#64748b',
          onColor: '#ffffff',
        },
        border: {
          DEFAULT: 'rgba(15, 23, 42, 0.08)',
          hover: 'rgba(15, 23, 42, 0.15)',
          subtle: 'rgba(15, 23, 42, 0.06)',
        }
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1', fontWeight: '800' }],
        'heading': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'caption': ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 30px rgba(168, 85, 247, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)',
        'glow-sm': '0 0 12px rgba(168, 85, 247, 0.3)',
        'glow': '0 0 24px rgba(168, 85, 247, 0.4)',
        'glow-lg': '0 0 48px rgba(168, 85, 247, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)' },
          '100%': { boxShadow: '0 0 24px rgba(168, 85, 247, 0.6), 0 0 48px rgba(168, 85, 247, 0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #22c55e, #4ade80)',
        'gradient-surface': 'linear-gradient(180deg, #f7fff8 0%, #e5fdf0 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(74, 222, 128, 0.08))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      },
    },
  },
  plugins: [],
}
