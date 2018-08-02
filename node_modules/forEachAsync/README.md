forEachAsync v3.x
===

**New Version** in a [new repo - FuturesJS/forEachAsync](https://github.com/FuturesJS/forEachAsync)

v3.x (aka 'Diet Cola") has all of the awesomeness of forEachAsync v2.x, but trims the fat and comes browser-ready!

Array.forEachAsync()
----

Another reincarnation of `sequence` that makes sense for the use case of arrays.

**Example:**

    var forEachAsync = require('forEachAsync')
      , count = 0
      , timers = [
          101,
          502,
          203,
          604,
          105
        ];

    function hello(next, time) {
      this[count] = time;

      if (count >= 4) {
        next(forEachAsync.BREAK);
      }

      console.log(count += 1, time);

      setTimeout(next, time);
    }

    function goodbye() {
      console.log("All Done", this);
    }

    forEachAsync(timers, hello, {}).then(goodbye);

API
---

  * forEachAsync(array, callback*[, thisArg]*)
  * forEachAsync#then(finalCallback)
  * forEachAsync#BREAK

**Warning:** [Poorly written code](https://gist.github.com/941362) may have really strange errors when `Array.prototype` is extended.
If you run into such problems please contact the author of the code (I'm also willing to help if they are unavailable).
Libraries such as `jQuery` or `MooTools` will accept bug reports for such failures.

