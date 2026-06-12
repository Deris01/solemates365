/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-light': '#F7F3EF',
        'brand-beige': '#EBE1D7',
        'brand-taupe': '#D6C8B3',
        'brand-brown': '#8B6E5A',
        'brand-dark': '#28282B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}