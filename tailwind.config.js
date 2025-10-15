import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4361ee',
        'primary-dark': '#3a56d4',
        secondary: '#7209b7',
        accent: '#f72585',
        light: '#f8f9fa',
        dark: '#212529',
        gray: '#6c757d',
        success: '#4cc9f0',
        warning: '#ff9e00',
        info: '#00b4d8',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'float-fast': 'float 5s ease-in-out infinite 1s',
        'shine': 'shine 3s infinite',
        'drawChart': 'drawChart 2s ease-out forwards',
        'rotate': 'rotate 20s linear infinite',
        'chartMove': 'chartMove 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        shine: {
          '0%': { left: '-100%' },
          '50%': { left: '100%' },
          '100%': { left: '100%' },
        },
        drawChart: {
          'from': {
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
          },
          'to': {
            strokeDasharray: '1000',
            strokeDashoffset: '0',
          },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        chartMove: {
          '0%, 100%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}