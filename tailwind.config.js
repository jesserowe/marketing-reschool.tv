module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'gray-1000': 'rgba(34, 34, 34, 0.9)',
        'progress-bar-gray': '#404040',
        'near-black': '#202020'
      },
      width: { '480': '480px' },
      inset: { '-1/8': '-12.5%' }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
