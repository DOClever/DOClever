var assert = require('assert');
/** A config object holds the configuration options for a variant of the async function. */
var Config = (function () {
    /** Construct a new Config instance. */
    function Config(options) {
        /** Recognised values: 'none', 'promise', 'thunk', 'result'. */
        this.returnValue = Config.PROMISE;
        /** Indicates whether a callback function, if supplied, will be used to notify waiters of results. */
        this.acceptsCallback = false;
        /** Indicates whether the suspendable function has iterator semantics or normal semantics. */
        this.isIterable = false;
        /** Indicates whether top-level concurrency should be limited to a specified ceiling. */
        this.maxConcurrency = null;
        if (options) {
            this.returnValue = options.returnValue;
            this.acceptsCallback = options.acceptsCallback;
            this.isIterable = options.isIterable;
            this.maxConcurrency = options.maxConcurrency;
        }
    }
    /** Checks all configuration values and throw an error if anything is invalid. */
    Config.prototype.validate = function () {
        var knownRetVal = [Config.PROMISE, Config.THUNK, Config.RESULT, Config.NONE].indexOf(this.returnValue) !== -1;
        assert(knownRetVal, 'Unrecognised return value: ' + this.returnValue);
        var hasNotifier = this.returnValue !== Config.NONE || this.acceptsCallback;
        assert(hasNotifier, 'At least one notification method must be enabled.');
    };
    // Constants for use with returnValue and callbackArg
    Config.PROMISE = 'promise';
    Config.THUNK = 'thunk';
    Config.RESULT = 'result';
    Config.NONE = 'none';
    return Config;
})();
module.exports = Config;
//# sourceMappingURL=config.js.map