import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#050816",
        surface: "#0F172A",
        primary: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
        },
        accent: "#60A5FA",
        muted: "#94A3B8",
      },
      fontFamily: {
        logo: ["var(--font-orbitron)"],
        heading: ["var(--font-space-grotesk)"],
        body: ["var(--font-inter)"],
        // Scoped to the Tajex concept, which follows its own brand.
        tajex: ["var(--font-tajex)", "system-ui", "sans-serif"],
        "tajex-mono": ["var(--font-tajex-mono)", "ui-monospace", "monospace"],
        // Shared by the concept demos for small uppercase labels.
        mono: ["var(--font-tajex-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.18), transparent 60%)",
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(96,165,250,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.2), transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(37, 99, 235, 0.25)",
        card: "0 10px 40px -12px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
