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

      maxHeight: {
        '280': '280px',
        '320': '320px',
        '360': '360px',
        '400': '400px',
        '450': '450px',
      },

      height: {
        '280': '280px',
        '320': '320px',
        '360': '360px',
        '400': '400px',
        '450': '450px',
      },

      // Optional: tambahkan custom scrollbar
      colors: {
        scrollbar: {
          DEFAULT: '#555',       // warna scroll
          thumb: '#888',          // warna thumb
          hover: '#aaa',          // hover thumb
        },
      },
    },
  },

  plugins: [
    // Plugin scrollbar (misal: tailwind-scrollbar)
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-custom': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#888 #555',
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '6px',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          background: '#555',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '9999px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb:hover': {
          background: '#aaa',
        },
      };
      addUtilities(newUtilities, ['responsive']);
    },
  ],
};
