/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      colors: {
        primary: {
          50: '#E0FBFF',
          100: '#E0FBFF',
          500: '#00E5FF',
          700: '#00B8D9',
        },
        secondary: {
          500: '#7F56D9',
          700: '#6941C6',
        },
        neutral: {
          50: '#F4F4F5',
          100: '#F4F4F5',
          200: '#E4E4E7',
          400: '#A1A1AA',
          800: '#1E1E1E',
          900: '#141414',
          950: '#0A0A0A',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'xxxl': '64px',
      },
      borderRadius: {
        'primary': '12px',
        'secondary': '8px',
      },
      boxShadow: {
        'glow-primary': '0 0 12px rgba(0, 229, 255, 0.4)',
        'glow-secondary': '0 0 12px rgba(127, 86, 217, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'primary': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};