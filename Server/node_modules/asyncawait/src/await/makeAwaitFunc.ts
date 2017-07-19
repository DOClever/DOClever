import Fiber = require('../fibers');
import Promise = require('bluebird');
import _ = require('lodash');
export = makeAwaitFunc;


/** Function for creating a specific variant of the await() function.
 *  @param {string} variant - Recognised values: undefined, 'in', 'top'.
 */
function makeAwaitFunc(variant?: string): any {

    // Return an await function tailored to the given options.
    switch (variant) {
        case 'in':  return getExtraInfo(traverseInPlace);
        case 'top': return (n: number) => getExtraInfo(traverseInPlace, n);
        default:    return getExtraInfo(traverseClone);
    }
}


/** Helper function for makeAwaitFunc(). */
function getExtraInfo(traverse: (o, visitor: Function) => void, topN?: number) {

    return function await() {

        // Ensure this function is executing inside a fiber.
        if (!Fiber.current) {
            throw new Error(
                'await functions, yield functions, and value-returning suspendable ' +
                'functions may only be called from inside a suspendable function. '
            );
        }

        // Parse argument(s). If not a single argument, treat it like an array was passed in.
        if (arguments.length === 1) {
            var expr = arguments[0];
        } else {
            expr = new Array(arguments.length);
            for (var i = 0; i < arguments.length; ++i) expr[i] = arguments[i];
            traverse = traverseInPlace;
        }

        // Handle each supported 'awaitable' appropriately...
        var fiber = Fiber.current;
        if (expr && _.isFunction(expr.then)) {

            // A promise: resume the coroutine with the resolved value, or throw the rejection value into it.
            // NB: ensure the handlers return null to avoid bluebird 3.x warning 'a promise was created in a
            //     handler but none were returned from it'. This occurs if the next resumption of the suspendable
            //     function (i.e. in the client's code) creates a bluebird 3.x promise and then awaits it.
            expr.then(val => (fiber.run(val), fiber = null), err => (fiber.throwInto(err), fiber = null));
        }
        else if (_.isFunction(expr)) {

            // A thunk: resume the coroutine with the callback value, or throw the errback value into it.
            expr((err, val) => { if (err) fiber.throwInto(err); else fiber.run(val); fiber = null; });
        }
        else if (_.isArray(expr) || _.isPlainObject(expr)) {

            // An array or plain object: resume the coroutine with a deep clone of the array/object,
            // where all contained promises and thunks have been replaced by their resolved values.
            // NB: ensure handlers return null (see similar comment above).
            var trackedPromises = [];
            expr = traverse(expr, trackAndReplaceWithResolvedValue(trackedPromises));
            if (!topN) {
                Promise.all(trackedPromises).then(val => (fiber.run(expr), fiber = null), err => (fiber.throwInto(err), fiber = null));
            } else {
                Promise.some(trackedPromises, topN).then(val => (fiber.run(val), fiber = null), err => (fiber.throwInto(err), fiber = null));
            }

        } else {

            // Anything else: resume the coroutine immediately with the value.
            setImmediate(() => { fiber.run(expr); fiber = null; });
        }

        // Suspend the current fiber until the one of the above handlers resumes it again.
        return Fiber.yield();
    }
}


/** In-place (ie non-cloning) object traversal. */
function traverseInPlace(o, visitor: (obj, key) => void): any {
    if (_.isArray(o)) {
        var len = o.length;
        for (var i = 0; i < len; ++i) {
            traverseInPlace(o[i], visitor);
            visitor(o, i);
        }
    } else if (_.isPlainObject(o)) {
        for (var key in o) {
            if (!o.hasOwnProperty(key)) continue;
            traverseInPlace(o[key], visitor);
            visitor(o, key);
        }
    }
    return o;
}


/** Object traversal with cloning. */
function traverseClone(o, visitor: (obj, key) => void): any {
    var result;
    if (_.isArray(o)) {
        var len = o.length;
        result = new Array(len);
        for (var i = 0; i < len; ++i) {
            result[i] = traverseClone(o[i], visitor);
            visitor(result, i);
        }
    } else if (_.isPlainObject(o)) {
        result = {};
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                result[key] = traverseClone(o[key], visitor);
                visitor(result, key);
            }
        }
    } else {
        result = o;
    }
    return result;
}


/** Visitor function factory for handling thunks and promises in awaited object graphs. */
function trackAndReplaceWithResolvedValue(tracking: Promise<any>[]) {

    // Return a visitor function closed over the specified tracking array.
    return (obj, key) => {

        // Get the value being visited, and return early if it's falsy.
        var val = obj[key];
        if (!val) return;

        // If the value is a thunk, convert it to an equivalent promise.
        if (_.isFunction(val)) val = thunkToPromise(val);

        // If the value is a promise, add it to the tracking array, and replace it with its value when resolved.
        if (_.isFunction(val.then)) {
            tracking.push(val);
            val.then(result => { obj[key] = result }, err => {});
        }
    }
}


/** Convert a thunk to a promise. */
function thunkToPromise(thunk: Function) {
    return new Promise((resolve, reject) => {
        var callback = (err, val) => (err ? reject(err) : resolve(val));
        thunk(callback);
    });
}
