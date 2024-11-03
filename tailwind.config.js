/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#39DB4A",
        red: "#FF6868",
        orange: "#f79602",
        secondary: "#555555",
        primaryBg: "#FCFCFC",
        darkBg: "#1f2937",
        darkText: "#f1f5f9",
        light: "#c5c5c5",
      },
      
    },
  },
  plugins: [require('daisyui'),],
};
