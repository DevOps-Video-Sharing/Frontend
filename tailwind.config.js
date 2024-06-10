/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:
      {
        teko: ["Teko", "sans-serif"]  ,
        Oswald: ["Oswald", "sans-serif"]  ,
        roboto: ["Roboto", "sans-serif"]
      }
    },
  },
  plugins: [],
}

