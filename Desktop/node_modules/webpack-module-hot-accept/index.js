'use strict';

module.exports = function(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  if (/\bmodule.hot\b/.test(source)) {
    return source;
  }

  return ''
    + source + "\n"
    + "\n"
    + 'if (module.hot) {'
      + 'module.hot.accept(function(err) {' + "\n"
        + 'if (err) {' + "\n"
          + 'console.error(err);' + "\n" 
        + '}' + "\n"
      + '});' + "\n"
    + '}' + "\n";
};
