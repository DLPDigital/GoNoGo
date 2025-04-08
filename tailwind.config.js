const { heroui } = require("@heroui/theme")
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|form|ripple|spinner).js",
  ],
  theme: {
    extend: {
      fontFamily: { rock3d: ["Rock3D", "sans-serif"] },
    },
  },
  plugins: [heroui()],
}
