import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Racing brand
        racing: {
          red:    '#E8002D',
          black:  '#09090B',
          dark:   '#09090B',
          darker: '#050507',
          surface: '#111113',
          border: '#1E1E21',
          muted:  '#2A2A2E',
          text:   '#A1A1AA',
        },
        // Driver colors
        driver: {
          rene:      '#E8002D',
          mike:      '#0096FF',
          christian: '#00C853',
          gerhard:   '#FF6B00',
          ralf:      '#9C27B0',
          wolfi:     '#FFD600',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        bebas:   ['Bebas Neue', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'racing-gradient': 'linear-gradient(135deg, #09090B 0%, #1a0005 50%, #09090B 100%)',
        'hero-gradient':   'linear-gradient(to bottom, transparent 0%, #09090B 100%)',
        'card-gradient':   'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'marquee':     'marquee 30s linear infinite',
        'marquee-rev': 'marquee-rev 30s linear infinite',
        'fade-up':     'fade-up 0.8s cubic-bezier(0.65, 0.05, 0, 1) forwards',
        'fade-in':     'fade-in 0.6s ease forwards',
        'shimmer':     'shimmer 2s linear infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'racing': 'cubic-bezier(0.65, 0.05, 0, 1)',
      },
      backdropBlur: { xs: '2px' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
