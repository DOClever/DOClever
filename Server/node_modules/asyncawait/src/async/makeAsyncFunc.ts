import Fiber = require('../fibers');
import Promise = require('bluebird');
import _ = require('lodash');
import types = require('../types');
import Config = require('./config');
import FiberMgr = require('./fiberManager');
import RunContext = require('./runContext');
import Semaphore = require('./semaphore');
import AsyncIterator = require('./asyncIterator');
import defer = require('./defer');
import await = require('../await/index');
export = makeAsyncFunc;


/** Function for creating a specific variant of the async function. */
function makeAsyncFunc(config: Config): types.AsyncFunction {

    // Validate the specified configuration
    config.validate();
    
    // Create an async function tailored to the given options.
    var result: types.AsyncFunction = <any> function async(bodyFunc: Function) {

        // Create a semaphore for limiting top-level concurrency, if specified in options.
        var semaphore = config.maxConcurrency ? new Semaphore(config.maxConcurrency) : Semaphore.unlimited;

        // Choose and run the appropriate function factory based on whether the result should be iterable.
        var makeFunc = config.isIterable ? makeAsyncIterator : makeAsyncNonIterator;
        var result: Function = makeFunc(bodyFunc, config, semaphore);

        // Ensure the suspendable function's arity matches that of the function it wraps.
        var arity = bodyFunc.length;
        if (config.acceptsCallback) ++arity;
        result = makeFuncWithArity(result, arity);
        return result;
    };

    // Add the mod() function, and return the result.
    result.mod = makeModFunc(config);
    return result;
}


/** Function for creating iterable suspendable functions. */
function makeAsyncIterator(bodyFunc: Function, config: Config, semaphore: Semaphore) {

    // Return a function that returns an iterator.
    return function iterable(): any {

        // Capture the initial arguments used to start the iterator, as an array.
        var startupArgs = new Array(arguments.length + 1); // Reserve 0th arg for the yield function. 
        for (var i = 0, len = arguments.length; i < len; ++i) startupArgs[i + 1] = arguments[i];

        // Create a yield() function tailored for this iterator.
        var yield_ = expr => {

            // Ensure this function is executing inside a fiber.
            if (!Fiber.current) {
                throw new Error(
                    'await functions, yield functions, and value-returning suspendable ' +
                    'functions may only be called from inside a suspendable function. '
                );
            }

            // Notify waiters of the next result, then suspend the iterator.
            if (runContext.callback) runContext.callback(null, { value: expr, done: false });
            if (runContext.resolver) runContext.resolver.resolve({ value: expr, done: false });
            Fiber.yield();
        }

        // Insert the yield function as the first argument when starting the iterator.
        startupArgs[0] = yield_;

        // Create the iterator.
        var runContext = new RunContext(bodyFunc, this, startupArgs);
        var iterator = new AsyncIterator(runContext, semaphore, config.returnValue, config.acceptsCallback);

        // Wrap the given bodyFunc to properly complete the iteration.
        runContext.wrapped = function () {
            var len = arguments.length, args=new Array(len);
            for (var i = 0; i < len; ++i) args[i] = arguments[i];
            bodyFunc.apply(this, args);
            iterator.destroy();
            return { done: true };
        };

        // Return the iterator.
        return iterator;
    };
}


/** Function for creating non-iterable suspendable functions. */
function makeAsyncNonIterator(bodyFunc: Function, config: Config, semaphore: Semaphore) {

    // Return a function that executes fn in a fiber and returns a promise of fn's result.
    return function nonIterable(): any {

        // Get all the arguments passed in, as an array.
        var argsAsArray = new Array(arguments.length);
        for (var i = 0; i < argsAsArray.length; ++i) argsAsArray[i] = arguments[i];

        // Remove concurrency restrictions for nested calls, to avoid race conditions.
        if (FiberMgr.isExecutingInFiber()) this._semaphore = Semaphore.unlimited;

        // Configure the run context.
        var runContext = new RunContext(bodyFunc, this, argsAsArray, () => semaphore.leave());
        if (config.returnValue !== Config.NONE) {
            var resolver = defer();
            runContext.resolver = resolver;
        }
        if (config.acceptsCallback && argsAsArray.length && _.isFunction(argsAsArray[argsAsArray.length - 1])) {
            var callback = argsAsArray.pop();
            runContext.callback = callback;
        }

        // Execute bodyFunc to completion in a coroutine. For thunks, this is a lazy operation.
        if (config.returnValue === Config.THUNK) {
            var thunk: types.Thunk<any> = (done?) => {
                if (done) resolver.promise.then(val => done(null, val), err => done(err));
                semaphore.enter(() => FiberMgr.create().run(runContext));
            };
        } else {
            semaphore.enter(() => FiberMgr.create().run(runContext));
        }

        // Return the appropriate value.
        switch (config.returnValue) {
            case Config.PROMISE:    return resolver.promise;
            case Config.THUNK:      return thunk;
            case Config.RESULT:     return await (resolver.promise);
            case Config.NONE:       return;
        }
    };
}


/** Returns a function that directly proxies the given function, whilst reporting the given arity. */
function makeFuncWithArity(fn: Function, arity: number) {

    // Need to handle each arity individually, but the body never changes.
    switch (arity) {
        case 0: return function f0() {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 1: return function f1(a) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 2: return function f2(a,b) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 3: return function f3(a,b,c) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 4: return function f4(a,b,c,d) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 5: return function f5(a,b,c,d,e) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 6: return function f6(a,b,c,d,e,f) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 7: return function f7(a,b,c,d,e,f,g) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 8: return function f8(a,b,c,d,e,f,g,h) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        case 9: return function f9(a,b,c,d,e,f,g,h,_i) {var i,l=arguments.length,r=new Array(l);for(i=0;i<l;++i)r[i]=arguments[i];return fn.apply(this,r)}
        default: return fn; // Bail out if arity is crazy high.
    }
}


function makeModFunc(config: Config) {
    return (options: any, maxConcurrency?: number) => {
        if (_.isString(options)) {

            // This way of specifying options is useful for TypeScript users, as they get better type information.
            // JavaScript users can use this too, but providing an options hash is more useful in that case. 
            var rt, cb, it;
            switch(options) {
                case 'returns: promise, callback: false, iterable: false': rt = 'promise'; cb = false; it = false; break;
                case 'returns: thunk, callback: false, iterable: false':   rt = 'thunk'; cb = false; it = false; break;
                case 'returns: result, callback: false, iterable: false':  rt = 'result'; cb = false; it = false; break;
                case 'returns: promise, callback: true, iterable: false':  rt = 'promise'; cb = true; it = false; break;
                case 'returns: thunk, callback: true, iterable: false':    rt = 'thunk'; cb = true; it = false; break;
                case 'returns: result, callback: true, iterable: false':   rt = 'result'; cb = true; it = false; break;
                case 'returns: none, callback: true, iterable: false':     rt = 'none'; cb = true; it = false; break;
                case 'returns: promise, callback: false, iterable: true':  rt = 'promise'; cb = false; it = true; break;
                case 'returns: thunk, callback: false, iterable: true':    rt = 'thunk'; cb = false; it = true; break;
                case 'returns: result, callback: false, iterable: true':   rt = 'result'; cb = false; it = true; break;
                case 'returns: promise, callback: true, iterable: true':   rt = 'promise'; cb = true; it = true; break;
                case 'returns: thunk, callback: true, iterable: true':     rt = 'thunk'; cb = true; it = true; break;
                case 'returns: result, callback: true, iterable: true':    rt = 'result'; cb = true; it = true; break;
                case 'returns: none, callback: true, iterable: true':      rt = 'none'; cb = true; it = true; break;
            }
            options = { returnValue: rt, acceptsCallback: cb, isIterable: it, maxConcurrency: maxConcurrency };
        }
        var newConfig = new Config(_.defaults({}, options, config));
        return makeAsyncFunc(newConfig);
    };
}
