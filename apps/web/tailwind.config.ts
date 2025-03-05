import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindConfigPreset from "@tdata/shared/configs/tailwind";

export default {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/automation-ui/**/*.{js,ts,jsx,tsx}",
    /**
     * The icons fie should be scanned s well as it contains color classes for icons
     */
    "./src/lib/constants/icon.ts",
    // https://tailwindcss.com/docs/content-configuration#working-with-third-party-libraries,
    // https://github.com/tailwindlabs/tailwindcss/discussions/8402
    "../editor/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [tailwindConfigPreset],
  plugins: [tailwindAnimate],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} satisfies Config;
