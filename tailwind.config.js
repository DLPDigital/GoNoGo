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
      fontFamily: {
        // sans: ["Roboto Variable", "Roboto", "sans-serif"],
        roboto: ["Roboto Variable", "Roboto", "sans-serif"],
        rock3d: ["Rock3D", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        // Assuming Roboto variable supports these weights
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
  plugins: [heroui()],
}
