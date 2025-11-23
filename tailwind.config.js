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
        geist: ['"Geist Sans"', "sans-serif"],
      },
      // Tambahkan custom token lain di sini nanti
    },
  },

  plugins: [],
};
