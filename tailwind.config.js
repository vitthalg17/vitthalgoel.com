module.exports = {
  content: [
    './**/*.html',
    './js/**/*.js',
    // WebGL code with no Tailwind classes; its words (truncate, sticky, ...) would generate unused utilities
    '!./js/venom-button.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'inter-tight': ['Inter Tight', 'sans-serif']
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
  ],
};
