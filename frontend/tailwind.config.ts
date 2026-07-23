import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0C831F", // Blinkit green
          light: "#E8F5E9",
        },
        gold: {
          DEFAULT: "#F8C200",
          light: "#FFF9E6",
        },
        dark: "#1A1A2E",
        surface: "#F4F6F8",
        card: "#FFFFFF",
        muted: "#6B7280",
        danger: "#D32F2F",
      },
      borderRadius: {
        DEFAULT: "12px",
        xl2: "16px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "pulse-badge": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.85" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "fire-flicker": {
          "0%, 100%": { transform: "rotate(-3deg) scale(1)" },
          "50%": { transform: "rotate(3deg) scale(1.15)" },
        },
      },
      animation: {
        "pulse-badge": "pulse-badge 1.2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.35s ease-out",
        "fire-flicker": "fire-flicker 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
