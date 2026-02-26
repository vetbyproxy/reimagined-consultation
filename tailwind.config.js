/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        provet: {
          purple: {
            DEFAULT: '#401197', // Main Brand Color
            light: '#6B46C1',   // Secondary / interactive
            lighter: '#E9D8FD', // Highlights
            bg: '#F5F3FF',      // Very light tint for backgrounds
          },
          blue: {
            royal: '#4E71DE',
          },
          neutral: {
            white: '#FFFFFF',
            50: '#F9FAFB',      // App Background
            100: '#F3F4F6',     // Panels
            200: '#E5E7EB',     // Borders
            600: '#4B5563',     // Secondary Text
            800: '#1F2937',     // Primary Text
            900: '#111827',     // Headings
          },
          // Keep semantic names for ease of use but map to new palette
          // Clinical/Status colors
          status: {
            critical: '#EF4444', // Red
            warning: '#F59E0B',  // Amber
            success: '#10B981',  // Emerald
            info: '#3B82F6',     // Blue
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
