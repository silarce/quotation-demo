module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#14256a",
        sub: "#404040",
        text: "#404040",
        active: "#ea1833",
        border: "#c1c1c1",
        bgc01: "#f5f5f5",
        bgc02: "#fcfcfc",
        hoverBgc: "#ecf1ff",
        chosenBgc: "#ffeeee",
        danger: "#ea1833",
        success: "#08f366",
        pass: "#008000"
      },
      width: {
        table: "1100px"
      }
    },
    screens: {
      // xxl: { max: "1535px" },
      // => @media (max-width: 1535px) { ... }
      // xl: { max: "1279px" },
      notebook: { max: "1440px" },
      // => @media (max-width: 1279px) { ... }
      laptop: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }
      // md: { max: "767px" },
      // => @media (max-width: 767px) { ... }
      // sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
}