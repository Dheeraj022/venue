/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
      colors: {
        'apple-gray': '#f5f5f7',
        'apple-blue': '#0071e3',
        'apple-dark': '#1d1d1f',
        'apple-text': '#1d1d1f',
        'apple-text-secondary': '#86868b',
      },
    },
  },
  plugins: [],
}
