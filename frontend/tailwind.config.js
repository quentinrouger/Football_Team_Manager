/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,d}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        'scale-smooth': 'scaleSmooth 2s infinite',
      },
      keyframes: {
        scaleSmooth: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [require("@xpd/tailwind-3dtransforms")],
}
