import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: {
            primary: "#ffffff",
            secondary: "#f2f2f7",
            tertiary: "#e5e5ea",
          },
          text: {
            primary: "#000000",
            secondary: "#8e8e93",
            tertiary: "#c7c7cc",
          },
          accent: "#007aff",
          "accent-light": "#e8f4fd",
          danger: "#ff3b30",
          "danger-light": "#ffe5e4",
          success: "#34c759",
          "success-light": "#e8fced",
          warning: "#ff9500",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "sheet-enter": "sheetEnter 350ms cubic-bezier(0.32, 0.72, 0, 1)",
        "sheet-exit": "sheetExit 250ms cubic-bezier(0.32, 0.72, 0, 1)",
        "fab-press": "fabPress 100ms ease-out",
        "fade-in": "fadeIn 200ms ease-out",
        "slide-out": "slideOut 300ms ease-in",
      },
      keyframes: {
        sheetEnter: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        sheetExit: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        fabPress: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideOut: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
