var Config = require('./config');
var makeAsyncFunc = require('./makeAsyncFunc');
/**
  * Creates a suspendable function. Suspendable functions may use the await() function
  * internally to suspend execution at arbitrary points, pending the results of
  * internal asynchronous operations.
  * @param {Function} fn - Contains the body of the suspendable function. Calls to await()
  *                        may appear inside this function.
  * @returns {Function} A function of the form `(...args) --> Promise`. Any arguments
  *                     passed to this function are passed through to fn. The returned
  *                     promise is resolved when fn returns, or rejected if fn throws.
  */
var async = makeAsyncFunc(new Config());
async.cps = async.mod('returns: none, callback: true, iterable: false');
async.thunk = async.mod('returns: thunk, callback: false, iterable: false');
async.result = async.mod('returns: result, callback: false, iterable: false');
async.iterable = async.mod('returns: promise, callback: false, iterable: true');
module.exports = async;
//# sourceMappingURL=index.js.map