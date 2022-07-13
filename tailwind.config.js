const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'blurple': '#5865F2',
      'secondary':'#72767d',
      'success': '#25ac4f',
      'danger': '#d83c3e',
      white: '#dcddde',
      'dark-secondary': '#36393f',
      'embed': '#2f3136',
      'tertiary': '#202225',
      'transparent': colors.transparent,
      'black': '#18191c'
    },
    extend: {},
  },
  plugins: [],
}
