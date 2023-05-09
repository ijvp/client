/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple": "#5B4EEE",
        "dark-purple": "#3c368A",
        "white": "#F2EDF9",
        "gray": "#a499b2",
        "black-border": "#191629",
        "black-secondary": "#1f1c3c",
        "black-bg": "#0d0a1e",
        "black": "#080512",
        "green": "#4FFC9E",
        "red": "#FC594F"
      }
    },
  },
  plugins: [],
}