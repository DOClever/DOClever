/** A simple abstraction for limiting concurrent function calls to a specific upper bound. */
var Semaphore = (function () {
    function Semaphore(n) {
        this.n = n;
        this._queued = [];
        this._avail = n;
    }
    Semaphore.prototype.enter = function (fn) {
        if (this._avail > 0) {
            --this._avail;
            fn();
        }
        else {
            this._queued.push(fn);
        }
    };
    Semaphore.prototype.leave = function () {
        if (this._queued.length > 0) {
            var fn = this._queued.pop();
            fn();
        }
        else {
            ++this._avail;
        }
    };
    Semaphore.unlimited = new Semaphore(10000000);
    return Semaphore;
})();
module.exports = Semaphore;
//# sourceMappingURL=semaphore.js.map