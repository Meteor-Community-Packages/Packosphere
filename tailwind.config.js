const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');
module.exports = {
  purge: [
    './imports/ui/**/*.tsx',
    './client/**/*.html',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blueGray: colors.blueGray,
        coolGray: colors.coolGray,
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
      borderColor: ['checked', 'hover', 'focus'],
    },
  },
  plugins: [
    forms,
  ],
};
