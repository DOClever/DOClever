# babel-plugin-transform-remove-strict-mode

remove "use strict" directive

## Installation

```sh
$ npm install babel-plugin-transform-remove-strict-mode
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
{
  "plugins": ["transform-remove-strict-mode"]
}
```

### Via CLI

```sh
$ babel --plugins transform-remove-strict-mode script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-remove-strict-mode"]
});
```