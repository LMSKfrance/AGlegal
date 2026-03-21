import type { Config } from "tailwindcss";

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function scale(name: string) {
  return Object.fromEntries(
    steps.map((step) => [step, `var(--${name}-${step})`])
  );
}

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--white)",
        black: "var(--black)",

        gray: scale("gray"),
        slate: scale("slate"),
        neutral: scale("neutral"),
        beige: scale("beige"),
        "ag-blue": scale("ag-blue"),
        orange: scale("orange"),
        purple: scale("purple"),
        cyan: scale("cyan"),
        yellow: scale("yellow"),
        red: scale("red"),

        // Semantic aliases
        success: scale("ag-blue"),
        warning: scale("yellow"),
        danger: scale("red"),

        // Admin 2.0 design system colors (fixed values, not CSS vars)
        brand: {
          50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
          400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
          800: "#1f2937", 900: "#111827",
        },
        primary: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
          800: "#1e40af", 900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
