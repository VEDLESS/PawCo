import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0d9488', // Teal
          600: '#0f766e',
          700: '#115e59',
          800: '#064e3b', // Deep Forest
          900: '#022c22',
        },
        forest: {
          50: '#f2fbf7',
          100: '#e1f6ec',
          200: '#c5eedb',
          300: '#98dfc3',
          400: '#64c8a4',
          500: '#3caa88',
          600: '#29896c',
          700: '#236e57',
          800: '#1f5746',
          900: '#1a483a', // PetCo Signature Forest
          950: '#0b2920',
        },
        ivory: {
          50: '#fdfbf7',
          100: '#f8f5ee',
          200: '#f1ebd8',
          300: '#e5dcbe',
          400: '#d7c79e',
        },
        warm: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Amber
          600: '#d97706',
          700: '#b45309',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'soft-md': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.07), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
