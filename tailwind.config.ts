import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary Blue - 메-력소 브랜드 컬러
        primary: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          foreground: "#FFFFFF",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Neutral Gray Scale
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },

        // World Group Colors - 월드 그룹 구분
        world: {
          challenger: {
            DEFAULT: "#F97316",
            bg: "#FFF7ED",
            border: "#FDBA74",
            text: "#C2410C",
          },
          eosHelios: {
            DEFAULT: "#8B5CF6",
            bg: "#F5F3FF",
            border: "#C4B5FD",
            text: "#6D28D9",
          },
          normal: {
            DEFAULT: "#10B981",
            bg: "#ECFDF5",
            border: "#6EE7B7",
            text: "#047857",
          },
        },

        // Temperature Gradient - 매너 온도
        temp: {
          freezing: "#3B82F6",   // 0-19°C
          cold: "#60A5FA",       // 20-29°C
          cool: "#06B6D4",       // 30-35°C
          warm: "#10B981",       // 36-39°C (기본)
          hot: "#F59E0B",        // 40-49°C
          burning: "#EF4444",    // 50°C+
        },

        // Status Colors
        success: {
          DEFAULT: "#10B981",
          bg: "#ECFDF5",
          text: "#047857",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FFFBEB",
          text: "#B45309",
        },
        error: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
          text: "#B91C1C",
        },
        info: {
          DEFAULT: "#3B82F6",
          bg: "#EFF6FF",
          text: "#1D4ED8",
        },
      },

      fontSize: {
        // Typography Scale
        "display": ["2rem", { lineHeight: "1.2", fontWeight: "700" }],      // 32px
        "h1": ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],         // 24px
        "h2": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],        // 20px
        "h3": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],       // 18px
        "body-lg": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],      // 16px
        "body": ["0.9375rem", { lineHeight: "1.5", fontWeight: "400" }],    // 15px
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],  // 14px
        "caption": ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }], // 13px
        "tiny": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],      // 12px
      },

      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },

      borderRadius: {
        lg: "0.75rem",    // 12px
        md: "0.5rem",     // 8px
        sm: "0.375rem",   // 6px
        full: "9999px",
      },

      boxShadow: {
        "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "card": "0 2px 8px 0 rgb(0 0 0 / 0.08)",
        "elevated": "0 4px 16px 0 rgb(0 0 0 / 0.12)",
        "float": "0 8px 24px 0 rgb(0 0 0 / 0.16)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },

      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
