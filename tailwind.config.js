/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00CED1',
          50: '#E0FFFE',
          100: '#B3FFFC',
          200: '#66FFF8',
          300: '#1AFFF4',
          400: '#00E6E9',
          500: '#00CED1',
          600: '#00A8AA',
          700: '#008284',
          800: '#005C5D',
          900: '#003637',
        },
        ultramarine: {
          DEFAULT: '#4169E1',
          50: '#E6EBFC',
          100: '#C1CDF7',
          200: '#9BAFF2',
          300: '#7691ED',
          400: '#5073E8',
          500: '#4169E1',
          600: '#2952D0',
          700: '#1F3EA0',
          800: '#152B70',
          900: '#0B1740',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}