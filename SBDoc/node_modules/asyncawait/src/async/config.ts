import assert = require('assert');
import types = require('../types');
export = Config;


/** A config object holds the configuration options for a variant of the async function. */
class Config implements types.AsyncOptions {

    /** Construct a new Config instance. */
    constructor(options?: types.AsyncOptions) {
        if (options) {
            this.returnValue = options.returnValue;
            this.acceptsCallback = options.acceptsCallback;
            this.isIterable = options.isIterable;
            this.maxConcurrency = options.maxConcurrency;
        }
    }

    /** Recognised values: 'none', 'promise', 'thunk', 'result'. */
    returnValue: string = Config.PROMISE;

    /** Indicates whether a callback function, if supplied, will be used to notify waiters of results. */
    acceptsCallback: boolean = false;

    /** Indicates whether the suspendable function has iterator semantics or normal semantics. */
    isIterable: boolean = false;

    /** Indicates whether top-level concurrency should be limited to a specified ceiling. */
    maxConcurrency: number = null;

    // Constants for use with returnValue and callbackArg
    static PROMISE = 'promise';
    static THUNK = 'thunk';
    static RESULT = 'result';
    static NONE = 'none';

    /** Checks all configuration values and throw an error if anything is invalid. */
    validate() {
        var knownRetVal = [Config.PROMISE, Config.THUNK, Config.RESULT, Config.NONE].indexOf(this.returnValue) !== -1;
        assert(knownRetVal, 'Unrecognised return value: ' + this.returnValue);        

        var hasNotifier = this.returnValue !== Config.NONE || this.acceptsCallback;
        assert(hasNotifier, 'At least one notification method must be enabled.');        
    }
}
