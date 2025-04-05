import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Let Prettier handle formatting
      "prettier/prettier": "error",
      
      // Custom rules that don't conflict with Prettier
      "no-unused-vars": "warn",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Remove conflicting formatting rules
      // "object-curly-newline": "off",
      // "object-property-newline": "off",
      // "newline-per-chained-call": "off",
      // "operator-linebreak": "off",
      // "object-curly-spacing": "off",
    },
  },
]

export default eslintConfig
