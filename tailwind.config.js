/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tcm-primary': '#1f2937',
        'tcm-secondary': '#374151',
        'tcm-accent': '#059669',
        'tcm-warm': '#f59e0b',
      }
    },
  },
  plugins: [],
}
