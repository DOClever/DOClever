import types = require('../types');
import makeAwaitFunc = require('./makeAwaitFunc');
export = await;



/**
  * Suspends a suspendable function until the given awaitable expression produces
  * a result. If the given expression produces an error, then an exception is raised
  * in the suspendable function.
  * @param {any} expr - The awaitable expression whose results are to be awaited.
  * @returns {any} The final result of the given awaitable expression.
  */
var await: types.Await = <any> makeAwaitFunc();
await.in = makeAwaitFunc('in');
await.top = <any> makeAwaitFunc('top');
