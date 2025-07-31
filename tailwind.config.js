/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3345a6',
          50: '#f0f1fd',
          100: '#e3e6fb',
          200: '#ccd2f7',
          300: '#adb6f1',
          400: '#8b93e9',
          500: '#6e72e0',
          600: '#5752d4',
          700: '#4b42c1',
          800: '#3e399d',
          900: '#3345a6',
        },
        secondary: {
          'lime': '#c7e977',
          'jungle-teal': '#76d7c4',
          'sky-blue': '#85d1f2',
          'sunset-orange': '#ffc373',
          'coral-pink': '#ff9f9a',
          'golden-yellow': '#ffe066',
          'amazon-green': '#a6d785',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}