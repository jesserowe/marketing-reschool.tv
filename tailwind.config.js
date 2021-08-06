module.exports = {
  purge: ["./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "gray-1000": "rgb(34, 34, 34)",
        "modal-gray": "#333",
        "submenu-gray": "rgb(64, 64, 64)",
        "progress-bar-gray": "#404040",
        "volume-slider-gray": "#606060",
        "near-black": "#202020",
        "facebook-blue": "rgb(59, 89, 152)",
        "twitter-blue": "rgb(29, 161, 242)",
      },
      width: { 480: "480px" },
      inset: { "-1/8": "-12.5%" },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
