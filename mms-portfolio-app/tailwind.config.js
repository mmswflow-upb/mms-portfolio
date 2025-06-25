/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "deep-space": "#03001C",
        "cosmic-purple": "#301E67",
        "stellar-blue": "#5B8FB9",
        "nebula-mint": "#B6EADA",
      },
      maxWidth: {
        "3xl": "48rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px #B6EADA, 0 0 10px #B6EADA, 0 0 15px #B6EADA",
          },
          "100%": {
            boxShadow: "0 0 10px #B6EADA, 0 0 20px #B6EADA, 0 0 30px #B6EADA",
          },
        },
      },
    },
  },
  plugins: [],
};
