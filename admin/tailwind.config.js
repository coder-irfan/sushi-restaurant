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
      fontFamily: {
        cormorantSC: "Cormorant SC",
        greatVibes: "Great Vibes",
        cinzel: "Cinzel",
      },
      animation: {
        bounce1: "bounce 1s infinite 0.1s",
        bounce2: "bounce 1s infinite 0.2s",
        bounce3: "bounce 1s infinite 0.3s",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        bounce: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
