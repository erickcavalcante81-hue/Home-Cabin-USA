/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          900: "#07090d",
          800: "#0d1117",
          700: "#141a23",
          600: "#1c2430",
        },
        neon: {
          cyan: "#22d3ee",
          green: "#34d399",
          amber: "#fbbf24",
          red: "#f87171",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 24px rgba(34, 211, 238, 0.35)",
      },
    },
  },
  plugins: [],
};
