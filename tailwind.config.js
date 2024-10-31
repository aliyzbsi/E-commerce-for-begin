/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        flip: "flip 0.6s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "perspective(600px) rotateY(0deg)" },
          "100%": { transform: "perspective(600px) rotateY(180deg)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* IE ve Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari ve Opera */,
        },
      });
    },
  ],
};
