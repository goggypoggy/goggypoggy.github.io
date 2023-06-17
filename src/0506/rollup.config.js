const glslify = require("rollup-plugin-glslify");
const json = require("@rollup/plugin-json");
const eslint = require("@rollup/plugin-eslint");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const uglify = require("rollup-plugin-glslify");

module.exports = {
  input: "./main.js",
  output: {
    dir: "../../dist/0506",
    format: "iife",
  },
  plugins: [
    json(),
    glslify(),
    eslint({
        exclude: ["**.glsl"],
    }),
    resolve({
        jsnext: true,
        main: true,
        browser: true,
    }),
    commonjs(),
    babel({
        exclude:"node_modules/**",
    }),
    uglify(),
  ],
};
