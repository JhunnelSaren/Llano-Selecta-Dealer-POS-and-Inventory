/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D32F2F',    // SELECTA Brand Red
          dark: '#B71C1C',   // Darker Red for Hover
          light: '#FFEBEE',  // Light Red Accent
        }
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}