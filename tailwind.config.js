const tickerAnimation = '100s infinite linear forwards';

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'ticker-right': `tickerRight ${tickerAnimation}`,
        'ticker-left': `tickerLeft ${tickerAnimation}`,
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        tickerRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        tickerLeft: {
          '0%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
    screens: {
      short: { raw: '(max-height: 750px)' },
    },
  },
};
