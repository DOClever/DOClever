import Promise = require('bluebird');
import _ = require('lodash');
import types = require('../types');
import FiberMgr = require('./fiberManager');
import RunContext = require('./runContext');
import Semaphore = require('./semaphore');
import Config = require('./config');
import defer = require('./defer');
import await = require('../await/index');
export = AsyncIterator;


/**
 * Asynchronous analogue to an ES6 Iterator. Rather than return each value/done
 * result synchronously, the next() function notifies a promise and/or callback
 * when the next result is ready.
 */
class AsyncIterator {

    /** Construct a new AsyncIterator instance. This will create a fiber. */
    constructor(runContext: RunContext, semaphore: Semaphore, returnValue: string, acceptsCallback: boolean) {
        this._runContext = runContext;
        this._semaphore = semaphore;
        this._fiber = FiberMgr.create();
        this._returnValue = returnValue;
        this._acceptsCallback = acceptsCallback;
    }

    /** Fetch the next result from the iterator. */
    next(callback?: (err, result) => void) {

        // Configure the run context.
        if (this._acceptsCallback) {
            this._runContext.callback = callback; // May be null, in which case it won't be used.
        }
        if (this._returnValue !== Config.NONE) {
            var resolver = defer();
            this._runContext.resolver = resolver;
        }

        // Remove concurrency restrictions for nested calls, to avoid race conditions.
        if (FiberMgr.isExecutingInFiber()) this._semaphore = Semaphore.unlimited;

        // Run the fiber until it either yields a value or completes. For thunks, this is a lazy operation.
        if (this._returnValue === Config.THUNK) {
            var thunk: types.Thunk<any> = (done?) => {
                if (done) resolver.promise.then(val => done(null, val), err => done(err));
                this._semaphore.enter(() => this._fiber.run(this._runContext));
                this._runContext.done = () => this._semaphore.leave();
            };
        } else {
            this._semaphore.enter(() => this._fiber.run(this._runContext));
            this._runContext.done = () => this._semaphore.leave();
        }

        // Return the appropriate value.
        switch (this._returnValue) {
            case Config.PROMISE:    return resolver.promise;
            case Config.THUNK:      return thunk;
            case Config.RESULT:     return await (resolver.promise);
            case Config.NONE:       return;
        }
    }

    /** Enumerate the entire iterator, calling callback with each result. */
    forEach(callback: (value) => void, doneCallback?: (err?) => void): any {

        // Create a function that calls next() in an asynchronous loop until the iteration is complete.
        var run, runCtx = this._runContext;
        if (this._returnValue === Config.RESULT)        run = () => stepAwaited(() => this.next());
        else if (this._returnValue === Config.THUNK)    run = () => this.next()(stepCallback);
        else if (this._acceptsCallback)                 run = () => this.next(stepCallback);
        else                                            run = () => this.next().then(stepResolved, endOfIteration);

        // Configure the resolver and callback to be invoked at the end of the iteration.
        if (this._returnValue === Config.PROMISE || this._returnValue === Config.THUNK) {
            var doneResolver = defer();
        }
        if (!this._acceptsCallback) doneCallback = null;

        // Execute the entire iteration. For thunks, this is a lazy operation.
        if (this._returnValue === Config.THUNK) {
            var thunk: types.Thunk<any> = (done?) => {
                if (done) doneResolver.promise.then(val => done(null, val), err => done(err));
                run();
            }
        } else {
            run();
        }

        // Return the appropriate value.
        switch (this._returnValue) {
            case Config.PROMISE:    return doneResolver.promise;
            case Config.THUNK:      return thunk;
            case Config.RESULT:     return undefined;
            case Config.NONE:       return undefined;
        }

        // These functions handle stepping through and finalising the iteration.
        function stepAwaited(next) {
            try { while (true) {
                var item = next();
                if (item.done) return endOfIteration();
                callback(item.value);
            } }
            catch (err) { endOfIteration(err); throw err; }
        }
        function stepCallback(err, result) {
            if (err || result.done) return endOfIteration(err);
            callback(result.value);
            setImmediate(run);
        }
        function stepResolved(result) {
            if (result.done) return endOfIteration();
            callback(result.value);
            setImmediate(run);
        }
        function endOfIteration(err?) {
            if (doneCallback) err ? doneCallback(err) : doneCallback();
            if (doneResolver) {
                if (FiberMgr.isExecutingInFiber()) {
                    runCtx.resolver = doneResolver; // FiberManager will handle it
                } else {
                    err ? doneResolver.reject(err) : doneResolver.resolve(null);
                }
            }
        }
    }

    /** Release resources associated with this object (i.e., the fiber). */
    destroy() {
        this._fiber = null;
    }

    private _runContext: RunContext;
    private _semaphore: Semaphore;
    private _fiber: Fiber;
    private _returnValue: string;
    private _acceptsCallback: boolean;
}
