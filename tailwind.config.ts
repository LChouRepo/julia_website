import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222 47% 11%)",
        muted: "hsl(210 40% 96.1%)",
        accent: {
          DEFAULT: "hsl(267 85% 52%)",
          foreground: "#fff"
        }
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: []
}
export default config
