/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-app': '#0a0f1e',
        'bg-surface': 'rgba(30, 41, 59, 0.85)',
        'bg-card': 'rgba(30, 41, 59, 0.75)',
        'primary': '#6366f1',
        'primary-strong': '#4f46e5',
        'primary-soft': 'rgba(99,102,241,0.2)',
        'accent': '#22d3ee',
        'accent-soft': 'rgba(34,211,238,0.2)',
        'success': '#22c55e',
        'warning': '#fbbf24',
        'danger': '#f43f5e',
        'text-strong': '#f8fafc',
        'text-muted': '#e0e7ff',
        'text-soft': '#cbd5e1'
      },
      boxShadow: {
        'soft': '0 20px 40px rgba(15, 23, 42, 0.3)',
        'glow': '0 0 30px rgba(99, 102, 241, 0.4)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideInUp: 'slideInUp 0.8s ease-out forwards',
        pulse: 'pulse 8s ease-in-out infinite',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}