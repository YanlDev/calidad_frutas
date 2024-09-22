/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/templates/**/*.{html,js}", // Escanear los archivos HTML y JS en templates
    "./app/static/js/**/*.js",    // Escanear los archivos JS en static/js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
