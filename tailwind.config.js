/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ana Renkler - Derin Lacivert ve Mor Tonları
        primary: {
          dark: '#0A0E27',
          DEFAULT: '#1A1F3A',
          light: '#2D3561',
          lighter: '#3D4A7A',
        },
        // Vurgu Renkleri - Elektrik Mavisi ve Neon Turkuaz
        accent: {
          electric: {
            dark: '#00A3FF',
            DEFAULT: '#00D4FF',
            light: '#5CE1FF',
          },
          purple: {
            dark: '#6B4CE6',
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
          },
          pink: {
            dark: '#EC4899',
            DEFAULT: '#F472B6',
            light: '#FBCFE8',
          },
        },
        // Dark Mode Arkaplanlar
        dark: {
          bg: {
            primary: '#0A0E27',
            secondary: '#13182E',
            tertiary: '#1A1F3A',
            card: '#1F2647',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            tertiary: '#94A3B8',
          },
          border: '#2D3561',
        },
        // Light Mode Arkaplanlar (Pastel ve Gradient)
        light: {
          bg: {
            primary: '#F8FAFC',
            secondary: '#F1F5F9',
            tertiary: '#E2E8F0',
            accent: '#EFF6FF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#334155',
            tertiary: '#64748B',
          },
          border: '#E2E8F0',
        },
        // Anlamsal Renkler
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Mobile-first boyutları
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.375' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        // Desktop büyük boyutlar
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(10, 22, 40, 0.08)',
        'medium': '0 4px 16px rgba(10, 22, 40, 0.12)',
        'large': '0 8px 24px rgba(10, 22, 40, 0.15)',
        'xl': '0 12px 32px rgba(10, 22, 40, 0.18)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
