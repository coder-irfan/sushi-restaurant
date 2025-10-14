/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        goldYellow: "#F5BE32",
        lightGray: "#D9D9D9",
        white: "#FFFFFF",
        softBeigeYellow: "#F3D382",
        black: "#000000",
        darkCharcoal: "#1E1E1E",
        deepGray: "#2E2E2E",
        red: "#F27070",
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-bg.webp')",
        "footer-pattern": "url('/images/footer-bg.webp')",
      },
      fontFamily: {
        cormorantSC: "Cormorant SC",
        greatVibes: "Great Vibes",
        cinzel: "Cinzel",
      },
      animation: {
        bounce1: "bounce 1s infinite 0.1s",
        bounce2: "bounce 1s infinite 0.2s",
        bounce3: "bounce 1s infinite 0.3s",
        scroll: "scroll 30s linear infinite", // default
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bounce: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        // Responsive animation durations
        ".animate-scroll": {
          animation: "scroll 30s linear infinite",
        },
        "@media (max-width: 640px)": {
          ".animate-scroll": {
            animation: "scroll 10s linear infinite", // faster on mobile
          },
        },
        "@media (min-width: 1024px)": {
          ".animate-scroll": {
            animation: "scroll 30s linear infinite", // slower on large screens
          },
        },
      });
    },
  ],
};
