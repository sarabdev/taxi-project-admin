/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // Yellow
        base: "#ffffff", // White
      },
    },
  },
  plugins: [],
};
