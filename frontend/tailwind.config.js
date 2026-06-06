/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c2d6b',
        },
        accent: {
          500: '#ec4899',
          600: '#db2777',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937',
          },
        },
      },
    },
  },
  plugins: [],
}
