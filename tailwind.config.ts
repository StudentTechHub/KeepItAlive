import { heroui } from "@heroui/react";

import { staticColors } from "./src/themes/staticColors";
import { light, dark } from "./src/themes";

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ...staticColors
      },
      backgroundImage: {
        "auth-vector": "url('/AuthVector.svg')",
        "auth-vector-dark": "url('/AuthVectorDark.svg')"
      }
    }
  },
  plugins: [
    heroui({
      addCommonColors: false,
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            ...light
          }
        },
        dark: {
          colors: {
            ...dark
          }
        }
      }
    })
  ]
};
