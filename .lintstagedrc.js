module.exports = {
  "*.{js,jsx,ts,tsx}": (filenames) => [
    `eslint ${filenames.map((f) => `"${f}"`).join(" ")} -c ./eslint.config.mjs --fix`,
    `prettier --write ${filenames.map((f) => `"${f}"`).join(" ")}`
  ],
  "*.{json,md}": (filenames) => [`prettier --write ${filenames.map((f) => `"${f}"`).join(" ")}`]
};
