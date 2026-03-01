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
      },
    },
  },
  plugins: [],
} satisfies Config;
