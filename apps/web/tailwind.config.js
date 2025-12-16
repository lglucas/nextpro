/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D47E', // Verde NextPro (Exemplo)
          dark: '#00A360',
        },
        secondary: {
          DEFAULT: '#1E293B', // Slate 800
        }
      }
    },
  },
  plugins: [],
}
