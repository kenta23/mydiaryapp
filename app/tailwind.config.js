/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F5BF6D',
        'secondary': '#F4E1C3',
        'bg': '#F4F0E9',
        'logo': '#DC802C',
        'gray': '#96866E',
        'dark': '#5C3F14'
        
      }
    },
    screens: {
      sm: '430px',
      md: '481px',
      lg: '769px',
      xl: '1201px',
    },
      fontFamily: {
         kaisei: ['Kaisei Decol', 'serif'],
         inika: ['Inika',' serif'],
         inter: ['Inter', 'serif']
      },
      
  },
  plugins: [],
}

