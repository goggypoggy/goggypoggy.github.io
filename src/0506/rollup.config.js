const glslify = require("rollup-plugin-glslify");

module.exports = {
  input: "./main.js",
  output: {
    dir: "../../dist/0506",
    format: "iife",
  },
  plugins: [
    glslify(),
  ],
};
