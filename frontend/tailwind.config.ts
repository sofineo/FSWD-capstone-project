import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Ensure this is set to "class"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
