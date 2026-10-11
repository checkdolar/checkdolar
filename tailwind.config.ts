import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0F0A1F",
          soft: "#160F2E",
          card: "#1B1333",
        },
        violet: {
          950: "#1E1245",
          900: "#2E1A6B",
          800: "#4C1D95",
          700: "#5B21B6",
          600: "#6D28D9",
          500: "#7C3AED",
          400: "#8B5CF6",
          300: "#A78BFA",
        },
        gold: {
          DEFAULT: "#FACC15",
          soft: "#FDE68A",
        },
        up: "#34D399",
        down: "#F87171",
        neutral: "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.45)",
        card: "0 4px 24px -8px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 0%, rgba(124,58,237,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(250,204,21,0.08), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
