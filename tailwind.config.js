import { blue,green,orange } from '@ant-design/colors';


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
        pass: "#008000",
        ok:green[0],
        warning:orange[1],
        antdBlue:{
          // DEFAULT: blue.primary, // 沒有DEFAULT的效果以後再研究
          primary: blue.primary,
          // '1': blue[0],
          // '2': blue[1],
          // '3': blue[2],
          // '4': blue[3],
          // '5': blue[4],
          // '6': blue[5],
          // '7': blue[6],
          // '8': blue[7],
          // '9': blue[8],
          // '10': blue[9],
        },
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