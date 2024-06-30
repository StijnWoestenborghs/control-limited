export default {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'class'
  theme: {
    extend: {
      fontFamily: {
        inconsolata: ['Inconsolata', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
