/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Standard Blue - change to your brand color
        secondary: '#64748b',
        background: '#f8fafc',
      }
    },
  },
  plugins: [],
}
