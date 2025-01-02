/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',        // Include the index.html in the root directory
    './src/**/*.html',     // Include all HTML files in the src directory
    './src/**/*.js',       // Include all JS files in the src directory
    './src/**/*.css', 
  ],
  theme: {
    extend: {
      fontFamily: {
        baseFont: ["Outfit", "sans-serif"],
      },
      screens: {
        "sm1": "470px",
        "sm2": "370px",
        "lg1": "1200px"
      }
    },
  },
  plugins: [],
}

