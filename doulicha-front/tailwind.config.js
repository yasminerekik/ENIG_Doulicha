/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#9333ea', // purple-600
          hover: '#7e22ce', // purple-700
        },
        secondary: {
          DEFAULT: '#a855f7', // purple-500
          hover: '#9333ea', // purple-600
        }
      }
    },
  },
  plugins: [],
}

