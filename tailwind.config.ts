import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        patry: {
          violet: "#4913C2",
          "violet-deep": "#2E0B85",
          "violet-soft": "#F1EBFC",
          ink: "#1A1523",
          paper: "#FBFAF8",
          gold: "#B8935B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(26, 21, 35, 0.06)",
        card: "0 12px 40px rgba(46, 11, 133, 0.10)",
      },
      backgroundImage: {
        "violet-gradient":
          "linear-gradient(135deg, #4913C2 0%, #2E0B85 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
