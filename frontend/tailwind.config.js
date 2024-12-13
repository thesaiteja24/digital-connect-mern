/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#E9F1FA',
        'bright-blue': '#00ABE4',
      },
    },
  },
  plugins: [],
}