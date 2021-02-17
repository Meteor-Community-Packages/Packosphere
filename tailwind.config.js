const colors = require('tailwindcss/colors');

module.exports = {
  // purge: [
  //   './imports/client/**/*.tsx',
  //   './client/**/*.html',
  // ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blueGray: colors.blueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
