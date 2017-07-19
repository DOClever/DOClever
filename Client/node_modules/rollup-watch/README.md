# rollup-watch

This module is used by the [Rollup](https://rollupjs.org) command line interface to enable automatic incremental rebuilds.

Install it to your project like so...

```bash
npm install --save-dev rollup-watch
```

...then invoke it by adding the `--watch` flag (or `-w`) to the command that starts Rollup. In this example, `npm run dev` will create your bundle then recreate it whenever its sources change:

```js
// package.json
{
  // ...
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  }
}
```


## Options

You can specify watch options in your rollup.config.js file:

```js
// rollup.config.js
export default {
  entry: 'src/main.js',
  ...,
  watch: {
    chokidar: {
      // if the chokidar option is given, rollup-watch will
      // use it instead of fs.watch. You will need to install
      // chokidar separately.
      //
      // this options object is passed to chokidar. if you
      // don't have any options, just pass `chokidar: true`
    },

    // include and exclude govern which files to watch. by
    // default, all dependencies will be watched
    exclude: ['node_modules/**']
  }
};
```


## LICENSE

[MIT](LICENSE)