/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  // darkMode: ['selector', '[data-mode="dark"]'],
  content: ["./index.html", "./src/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
