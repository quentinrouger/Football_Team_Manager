/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,d}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@xpd/tailwind-3dtransforms")],
}
