/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  var Sequence = require('sequence');

  function handleItem(item, i, arr) {
    var seq = this
      ;

    function nextItem(next, BREAK) {
      if (forEachAsync.BREAK === BREAK) {
        process.nextTick(function () {
          next(forEachAsync.BREAK);
        });
        return;
      }

      seq._contextCallback.call(this, next, item, i, arr);
    }

    seq.then(nextItem);
  }

  function forEachAsync(arr, callback, _context) {
    var sequence = Sequence.create(_context);

    sequence._contextCallback = callback;

    arr.forEach(handleItem, sequence);

    return sequence;
  }

  forEachAsync.BREAK = '__forEachAsync_BREAK__';
  module.exports = forEachAsync;
}());
