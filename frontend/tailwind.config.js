import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary": "#ffffff",
        "on-tertiary-fixed-variant": "#0c5216",
        "surface": "#fcf9f8",
        "on-surface-variant": "#3f4a3c",
        "on-primary-fixed-variant": "#005312",
        "primary": "#1b6d24",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "secondary-fixed-dim": "#bbc8d0",
        "secondary-container": "#d7e4ec",
        "surface-dim": "#dcd9d9",
        "tertiary-fixed-dim": "#91d78a",
        "on-tertiary": "#ffffff",
        "surface-tint": "#1b6d24",
        "tertiary": "#2a6b2c",
        "background": "#fcf9f8",
        "on-primary-container": "#003c0a",
        "secondary": "#546067",
        "surface-container": "#f0edec",
        "surface-container-low": "#f6f3f2",
        "inverse-primary": "#88d982",
        "primary-fixed-dim": "#88d982",
        "outline-variant": "#becab9",
        "surface-container-high": "#ebe7e7",
        "secondary-fixed": "#d7e4ec",
        "primary-container": "#5dac5b",
        "inverse-on-surface": "#f3f0ef",
        "on-background": "#1c1b1b",
        "on-error": "#ffffff",
        "surface-variant": "#e5e2e1",
        "surface-bright": "#fcf9f8",
        "on-primary-fixed": "#002204",
        "on-secondary-fixed": "#111d23",
        "on-secondary-container": "#5a666d",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#acf4a4",
        "on-tertiary-fixed": "#002203",
        "inverse-surface": "#313030",
        "tertiary-container": "#67ab63",
        "on-tertiary-container": "#003d0a",
        "error-container": "#ffdad6",
        "outline": "#6f7a6b",
        "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#3c494f",
        "surface-container-highest": "#e5e2e1",
        "on-surface": "#1c1b1b",
        "primary-fixed": "#a3f69c",
        "skeleton": "var(--skeleton)",
        "btn-border": "var(--btn-border)",
        "input-border": "var(--input-border)",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(27, 109, 36, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(27, 109, 36, 0.6)' },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
