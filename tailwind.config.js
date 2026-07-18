/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'var(--font-inter)', '"Helvetica Neue"', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'var(--font-inter)', '"Helvetica Neue"', 'sans-serif'],
      },
      colors: {
        surface: {
          primary: '#000000',
          panel: 'rgba(28, 28, 30, 0.75)',
          card: 'rgba(28, 28, 30, 0.45)',
          'card-hover': 'rgba(44, 44, 46, 0.6)',
          input: 'rgba(255, 255, 255, 0.06)',
        },
        border: {
          hairline: 'rgba(255, 255, 255, 0.08)',
          focus: '#0071e3',
        },
        accent: {
          blue: '#0071e3',
          'blue-hover': '#147ce5',
          green: '#30d158',
          purple: '#bf5af2',
          red: '#ff453a',
          'red-hover': '#ff3b30',
          yellow: '#ffd60a',
        },
        text: {
          primary: '#f5f5f7',
          secondary: '#86868b',
          muted: '#48484a',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
      },
      animation: {
        'spring-load': 'springLoad 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'modal-in': 'modalIn 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'spin-slow': 'spin 1s linear infinite',
        'task-fade-out': 'taskFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        springLoad: {
          from: { transform: 'scale(0.97) translateY(5px)', opacity: '0' },
          to: { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        taskFadeOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)', maxHeight: '300px', marginBottom: '0' },
          '40%': { opacity: '0', transform: 'scale(0.96) translateY(-4px)', maxHeight: '300px' },
          '100%': { opacity: '0', transform: 'scale(0.92) translateY(-8px)', maxHeight: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '-12px', border: 'none' },
        },
        modalIn: {
          from: { transform: 'scale(0.96) translateY(5px)', opacity: '0' },
          to: { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
