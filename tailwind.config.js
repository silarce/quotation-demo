import { blue, green, orange } from '@ant-design/colors';


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
        text02: "#212121",
        active: "#ea1833",
        border: "#c1c1c1",
        border02: "#616161",
        bgc01: "#f5f5f5",
        bgc02: "#fcfcfc",
        hoverBgc: "#ecf1ff",
        chosenBgc: "#ffeeee",
        danger: "#ea1833",
        success: "#08f366",
        pass: "#008000",
        ok: green[0],
        warning: orange[1],
        // 
        brown01: '#B45309',
        brown02: '#92400E',
        brown03: '#78350F',

        green01: '#1B9C5E',
        green02: '#159151',
        green03: '#117944',

        blue01: '#14256A', // main
        blue02: '#1A3084',
        blue03: '#101E4A',
        blue04: '#EDF1F7',

        gray01: '#4B5563',
        gray02: '#374151',
        gray03: '#111827',
        gray04: '#F5F5F5', // bgc01
        gray05: '#616161', // border02
        gray06: '#9D9D9D',

        red01: '#EA1833', // danger active
        red02: '#C5152B',
        red03: '#A11223',

        black01: '#212121', // text02
        white01: '#FFFFFF',


        // 
        antdBlue: {
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
      },
      border: {
        radius: {
          normal: "8px",
          "02": "4px"
        }
      },
      boxShadow: {
        "01": "0px 3px 3px 0px #61616133",
        "02": "0px 4px 4px 0px #00000040"
      },
      padding: {
        layoutY: "32px",
        layoutX: "24px"
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