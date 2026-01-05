const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');
module.exports = {
  content: [
    './imports/ui/**/*.tsx',
    './client/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        blueGray: colors.slate,
        coolGray: colors.gray,
      },
    },
  },
  plugins: [
    forms,
  ],
};
