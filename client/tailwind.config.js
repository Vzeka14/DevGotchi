/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ica: "#E02222",
        willys: "#FFC72C",
        maxi: "#0058A3",
        eurocash: "#006F3C",
      },
    },
  },
  plugins: [],
};
