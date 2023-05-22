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
        "black-secondary": "#1F1C3C",
        "black-bg": "#0d0a1e",
        "black": "#080512",
        "green-light": "#4FFC9E",
        "red-light": "#FC594F",
        "red-wrong": "#AA2E26",
        'grey-placeholder': "#d3d3d3"
      }
    },
  },
  plugins: [],
}