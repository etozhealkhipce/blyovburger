const plugin = require("tailwindcss/plugin");
const { SCREEN_WIDTHS } = require("./src/shared/lib/constants/breakpoints.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "",
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ theme, addBase }) => {
      addBase({
        // or whichever color you'd like
        html: { color: theme("colors.slate.800") },
        "@font-face": {
          fontStyle: "normal",
          fontDisplay: "swap",
          fontWeight: "normal",
          fontFamily: "Rubik Mono One",
          src: "url('/assets/fonts/RubikMonoOne-Regular.ttf') format('truetype')",
        },
      });
    }),
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: SCREEN_WIDTHS.xs,
      sm: SCREEN_WIDTHS.sm,
      md: SCREEN_WIDTHS.md,
      lg: SCREEN_WIDTHS.lg,
      xl: SCREEN_WIDTHS.xl,
      "2xl": SCREEN_WIDTHS["2xl"],
    },
    extend: {
      fontFamily: {
        mono: ["Rubik Mono One", "monospace"],
      },
      colors: {
        brand: "#FFFF",
        "neon-pink": "#FF10F0",
        "neon-green": "#39FF14",
      },
      animation: {
        "wave-right": "wave 1.55s linear infinite",
        "accordion-up": "accordion-up 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "wave-right-delayed": "wave 2s linear infinite -1s",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "initify-turn": "initify-turn 1.25s ease-out infinite",
      },
      keyframes: {
        "caret-blink": {
          "20%,50%": { opacity: "0" },
          "0%,70%,100%": { opacity: "1" },
        },
        wave: {
          "0%": { backgroundPosition: "right" },
          "100%": { backgroundPosition: "left" },
        },
        "initify-turn": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(90deg)" },
        },
        "accordion-up": {
          to: { height: "0" },
          from: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
      },
    },
  },
};
