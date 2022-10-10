const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        netflix: ['"Nunito Sans"', "sans-serif"],
      },
      colors: {
        gray: colors.neutral,
        "netflix-red": "#e50914",
        "netflix-red-light": "#f40612",
        "netflix-orange": "#e87c03",
        "netflix-orange-light": "#ffa00a",
      },
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
      },
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      borderWidth: {
        3: "3px",
      },
      minWidth: {
        "screen-1/2": "50vh",
        "screen-3/4": "75vh",
      },
      minHeight: {
        "screen-1/2": "50vh",
        "screen-3/4": "75vh",
      },
      height: {
        18: "4.5rem",
      },
      margin: {
        13: "3.125rem",
        "-13": "-3.125rem",
        "1/2": "50vh",
        "-1/2": "-50vh",
        "2/3": "66.66666666666667vh",
        "-2/3": "-66.66666666666667vh",
        "3/4": "75vh",
        "-3/4": "-75vh",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
