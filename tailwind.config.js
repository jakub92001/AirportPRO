/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#007aff',
        'brand-green': '#34c759',
        'brand-yellow': '#ffcc00',
        'brand-red': '#ff3b30',
        'brand-orange': '#ff9500',
        'base-100': '#1c1c1e',
        'base-200': '#2c2c2e',
        'base-300': '#3a3a3c',
        'base-content': '#f2f2f7',
        'base-content-secondary': '#8e8e93',
      },
      keyframes: {
        'plane-takeoff': {
          '0%': { transform: 'translateX(0) translateY(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(300px) translateY(-100px) scale(0.5)', opacity: 0 },
        },
        'plane-landing': {
          '0%': { transform: 'translateX(-300px) translateY(100px) scale(0.5)', opacity: 0 },
          '100%': { transform: 'translateX(0) translateY(0) scale(1)', opacity: 1 },
        },
        'notification-fade': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '10%': { opacity: 1, transform: 'translateY(0)' },
          '90%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'plane-takeoff': 'plane-takeoff 5s ease-in forwards',
        'plane-landing': 'plane-landing 5s ease-out forwards',
        'notification-fade': 'notification-fade 5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
