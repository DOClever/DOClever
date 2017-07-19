// rollup.config.js
var babel = require("rollup-plugin-babel");


export default {
  entry: "src/index.js",
  format: "umd",
  moduleName: "fullpage",
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'dist/fullpage.js' // equivalent to --output
};