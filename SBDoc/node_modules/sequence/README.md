sequence()
----

Creates an Asynchronous Stack which execute each enqueued method after the previous function calls the provided `next(err, data [, ...])`.

**Core**

  * `Futures.sequence(globalContext=null)`
  * `then(next, err, data [, ...])` - add a method onto the queue
    * begins or resumes the queue
    * passes the results of the previous function into the next

**Example:**

    var sequence = Futures.sequence(),
      err;

    sequence
      .then(function (next) {
        setTimeout(function () {
          next(err, "Hi", "World!");
        }, 120);
      })
      .then(function (next, err, a, b) {
        setTimeout(function () {
          next(err, "Hello", b);
        }, 270);
      })
      .then(function (next, err, a, b) {
        setTimeout(function () {
          console.log(a, b);
          next();
        }, 50);
      });

