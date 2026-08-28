import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07090d",
          900: "#0c0f16",
          850: "#11151e",
          800: "#161b26",
          700: "#1f2531",
          600: "#2a3140",
          500: "#3a4356",
        },
        accent: {
          DEFAULT: "#2f6fed",
          dim: "#1c4fbd",
          bright: "#5b93ff",
        },
        gold: "#e3b23c",
        silver: "#b8c0cc",
        bronze: "#c17a4c",
      },
      fontFamily: {
        heading: ["var(--font-oswald)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
