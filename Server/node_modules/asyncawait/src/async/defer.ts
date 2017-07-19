import Promise = require('bluebird');
export = defer;


/** Equivalent to Promise.defer() from bluebird 1.x. Added here because Promise.defer() is deprecated as of bluebird 2.x */
function defer() {
    var resolve, reject;
    var promise = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return <Promise.Resolver<any>> {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
