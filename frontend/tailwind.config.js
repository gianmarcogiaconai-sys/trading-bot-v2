export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        dark: '#1a1a1a',
        light: '#f5f5f5'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}