/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ================================
         ✅ FONT
      ================================ */
      fontFamily: {
        geist: ["Geist Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      /* ================================
         ✅ HEIGHT & MAX-HEIGHT
      ================================ */
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

      /* ================================
         ✅ GLOBAL SPACING KOSAKATA (INI YANG KAMU MINTA 🤣)
         Bisa dipakai untuk:
         pt-17, mt-19, px-22, gap-25, dll
      ================================ */
      spacing: {
        17: "68px",
        18: "72px",
        19: "76px",
        21: "84px",
        22: "88px",
        23: "92px",
        25: "100px",
        26: "104px",
        28: "112px",
        30: "120px",
        32: "128px",
        36: "144px",
        40: "160px",
      },

      /* ================================
         ✅ SCROLLBAR COLORS
      ================================ */
      colors: {
        scrollbar: {
          DEFAULT: '#555',
          thumb: '#888',
          hover: '#aaa',
        },
      },
    },
  },

  plugins: [
    /* ================================
       ✅ CUSTOM SCROLLBAR PLUGIN
    ================================ */
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
