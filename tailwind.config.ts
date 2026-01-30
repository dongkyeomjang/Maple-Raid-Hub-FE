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

        // Primary Maple Orange - 메-력소 브랜드 컬러 (단풍/메이플 테마)
        primary: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          foreground: "#FFFFFF",
        },

        // Accent Amber - 보조 강조색
        accent: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Neutral Warm Gray Scale - 따뜻한 뉴트럴 톤
        gray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },

        // World Group Colors - 월드 그룹 구분
        world: {
          challenger: {
            DEFAULT: "#EF4444",
            bg: "#FEF2F2",
            border: "#FECACA",
            text: "#B91C1C",
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
          DEFAULT: "#0EA5E9",
          bg: "#F0F9FF",
          text: "#0369A1",
        },

        // Feature Highlight Colors
        chat: {
          DEFAULT: "#8B5CF6",
          bg: "#F5F3FF",
          text: "#6D28D9",
        },
        schedule: {
          DEFAULT: "#06B6D4",
          bg: "#ECFEFF",
          text: "#0E7490",
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
        "glow": "0 0 20px 0 rgb(249 115 22 / 0.3)",
        "glow-lg": "0 0 40px 0 rgb(249 115 22 / 0.4)",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(20deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.1)" },
        },
        // Radix UI 컴포넌트 애니메이션 (Context7 참조)
        "tooltip-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "dialog-in": {
          from: { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "dropdown-in": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px 0 rgb(249 115 22 / 0.3)" },
          "50%": { boxShadow: "0 0 30px 5px rgb(249 115 22 / 0.5)" },
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
        float: "float 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "pop-in": "pop-in 0.3s ease-out",
        "heart-beat": "heart-beat 1.5s ease-in-out infinite",
        // Radix UI 컴포넌트 애니메이션
        "tooltip-in": "tooltip-in 0.15s ease-out",
        "dialog-in": "dialog-in 0.2s ease-out",
        "dropdown-in": "dropdown-in 0.15s ease-out",
        "toast-in": "toast-in 0.3s ease-out",
        "gentle-pulse": "gentle-pulse 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },

      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-maple": "linear-gradient(135deg, #F97316 0%, #F59E0B 50%, #FBBF24 100%)",
        "gradient-warm": "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
