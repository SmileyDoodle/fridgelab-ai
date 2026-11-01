/**
 * FridgeLab AI - Centralized Tailwind Configuration & Design Tokens
 */

export const designTokens = {
  colors: {
    brand: {
      primary: '#D35B34',
      hover: '#BC4F2C',
      subtle: '#FFF5F1',
      border: '#F4C8BA',
    },
    cream: {
      50: '#FDFCF9',
      100: '#FAF7F2',
      200: '#F3EDE2',
      300: '#E6DCCC',
    },
    accents: {
      green: '#EAF6F0',
      greenText: '#1F5A3E',
      amber: '#FFF8E6',
      amberText: '#8B5B00',
    },
    surface: {
      card: '#FFFFFF',
      border: '#EBE6DE',
    },
  },
  fonts: {
    serif: ["'Playfair Display'", 'Georgia', 'serif'],
    sans: ["'Inter'", 'sans-serif'],
  },
} as const

export type DesignTokens = typeof designTokens

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: designTokens.colors.brand,
        cream: designTokens.colors.cream,
        accent: {
          green: designTokens.colors.accents.green,
          'green-text': designTokens.colors.accents.greenText,
          amber: designTokens.colors.accents.amber,
          'amber-text': designTokens.colors.accents.amberText,
        },
        surface: designTokens.colors.surface,
      },
      fontFamily: {
        serif: designTokens.fonts.serif,
        sans: designTokens.fonts.sans,
      },
    },
  },
}
