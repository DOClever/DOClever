/**
 * This class is used to pass all required contextual information to the runInFiber()
 * function as a single argument. runInFiber() can only accept a single argument because
 * it is invoked via Fiber#run(), which can only pass through a single argument.
 */
var RunContext = (function () {
    /** Construct a new RunContext instance. */
    function RunContext(wrapped, thisArg, argsAsArray, done) {
        /** Optional promise resolver for notifying the wrapped function's return/throw value. */
        this.resolver = null;
        /** Optional callback for notifying the wrapped function's return/throw value. */
        this.callback = null;
        this.wrapped = wrapped;
        this.thisArg = thisArg;
        this.argsAsArray = argsAsArray;
        this.done = done;
    }
    return RunContext;
})();
module.exports = RunContext;
//# sourceMappingURL=runContext.js.map