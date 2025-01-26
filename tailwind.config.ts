import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        pico: {
          primary: "var(--pico-primary)",
          "primary-background": "var(--pico-primary-background)",
          underline: "var(--pico-primary-underline)",
          hover: "var(--pico-primary-hover)",
          "hover-background": "var(--pico-primary-hover-background)",
          focus: "var(--pico-primary-focus)",
          inverse: "var(--pico-primary-inverse)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
