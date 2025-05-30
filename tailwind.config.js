/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          600: '#C41E3A',
          700: '#B01B33',
        },
        purple: {
          600: '#8B5CF6',
          700: '#7C3AED',
        },
        black: '#121212',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};