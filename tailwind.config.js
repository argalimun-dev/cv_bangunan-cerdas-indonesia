/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        // Gunakan font dari @fontsource/geist-sans
        geist: ["Geist Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },

  plugins: [],
};
