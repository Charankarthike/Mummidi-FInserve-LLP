/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      colors: {
        navy: '#0A2540',
        accent: '#2563EB',
        accentLight: '#60A5FA',
        cream: '#F8FAFC',
      },
    },
  },
  plugins: [],
};
