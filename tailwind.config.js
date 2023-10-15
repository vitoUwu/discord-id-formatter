import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blurple: "#5865f2",
        "blurple-hover": "#4752c4",
        "blurple-disabled": "#454c94",
        secondary: "#4e5058",
        "secondary-hover": "#6d6f78",
        "secondary-disabled": "#404248",
        success: "#248046",
        "success-hover": "#1a6334",
        "success-disabled": "#2b5a3f",
        danger: "#da373c",
        "danger-hover": "#a12828",
        "danger-disabled": "#86353a",
        white: "#dcddde",
        "white-disabled": "#70686b",
        "dark-secondary": "#36393f",
        embed: "#2b2d31",
        tertiary: "#1e1f22",
        transparent: colors.transparent,
        black: "#18191c",
      },
    },
  },
  plugins: [],
};
