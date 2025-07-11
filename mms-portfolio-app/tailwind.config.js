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
        "zoom-in": "zoom-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "zoom-out": "zoom-out 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "progress-glow": "progress-glow 2s ease-in-out infinite",
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
        "zoom-in": {
          "0%": { transform: "scale(0.8)", opacity: "0.3" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0.3" },
        },
        "progress-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px #B6EADA, 0 0 10px #B6EADA",
            opacity: "0.8",
          },
          "50%": {
            boxShadow: "0 0 10px #B6EADA, 0 0 20px #B6EADA, 0 0 30px #B6EADA",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
