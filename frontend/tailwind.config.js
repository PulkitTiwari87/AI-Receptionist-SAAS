/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#A7C7E7',
          green: '#C1E1C1',
          pink: '#FFD1DC',
          yellow: '#FDFD96',
          purple: '#C3B1E1',
        }
      }
    },
  },
  plugins: [],
}
