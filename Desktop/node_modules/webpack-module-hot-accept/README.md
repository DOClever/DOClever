# webpack-module-hot-accept
Tiny webpack plugin that adds `module.hot.accept` to the bottom of modules if `module.hot` is not already present.

## Installation
```
npm install webpack-module-hot-accept --save-dev
```

## Usage
```js
// webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './entry.js'
  ],
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel',
          'webpack-module-hot-accept' // add this last
        ]
      }
    ]
  }
};

```
