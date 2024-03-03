module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'show': 'fade-in 0.5s forwards',
      },
      keyframes: {
        'fade-in': {
          '100%': { opacity: 1 },
        }
      },
    },
  },
  plugins: [],
};