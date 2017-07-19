var makeAwaitFunc = require('./makeAwaitFunc');
/**
  * Suspends a suspendable function until the given awaitable expression produces
  * a result. If the given expression produces an error, then an exception is raised
  * in the suspendable function.
  * @param {any} expr - The awaitable expression whose results are to be awaited.
  * @returns {any} The final result of the given awaitable expression.
  */
var await = makeAwaitFunc();
await.in = makeAwaitFunc('in');
await.top = makeAwaitFunc('top');
module.exports = await;
//# sourceMappingURL=index.js.map