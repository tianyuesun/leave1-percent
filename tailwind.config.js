/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F2',
        paper: '#FFFEFA',
        ink: '#1C211D',
        muted: '#6F756F',
        line: '#E4E5DE',
        sage: '#5F9558',
        'sage-dark': '#3F703D',
        'sage-soft': '#E8F0E4',
        earth: '#9A846C',
        sand: '#F2EBDD',
        lavender: '#EEEAF4',
        blush: '#F6E8E2',
      },
      borderRadius: {
        card: '22px',
      },
    },
  },
  plugins: [],
};
