import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EBF4FC',
          100: '#D0E7F7',
          200: '#A3CFF0',
          300: '#6FB0E5',
          400: '#4495D9',
          500: '#1B72B5',
          600: '#165D93',
          700: '#114A75',
          800: '#0D3858',
          900: '#08253C',
          950: '#041829',
        },
        teal: {
          50:  '#F2FAE9',
          100: '#E0F3CC',
          200: '#C4E8A0',
          300: '#A2D96E',
          400: '#85CA53',
          500: '#6BBE44',
          600: '#56A135',
          700: '#428028',
          800: '#2F601D',
          900: '#1E4012',
        },
        medical: {
          blue:  '#1B72B5',
          light: '#EBF4FC',
          teal:  '#56A135',
          green: '#6BBE44',
          soft:  '#F2FAE9',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Source Sans 3"', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Bitter', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #041829 0%, #0D3858 40%, #1B72B5 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'teal-gradient': 'linear-gradient(135deg, #56A135 0%, #6BBE44 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0D3858 0%, #1B72B5 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(27, 114, 181, 0.12)',
        'card':  '0 4px 24px rgba(27, 114, 181, 0.08)',
        'hover': '0 12px 40px rgba(27, 114, 181, 0.18)',
        'primary': '0 8px 24px rgba(27, 114, 181, 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
