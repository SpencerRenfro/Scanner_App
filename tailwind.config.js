/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // 'media' enables dark mode based on user's system preferences
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}