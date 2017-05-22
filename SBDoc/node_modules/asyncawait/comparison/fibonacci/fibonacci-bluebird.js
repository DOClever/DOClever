var Promise = require('bluebird');


// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = function (n) {
    if (n <= 1) {
        return Promise.resolve(1);
    } else {
        return Promise.all([
            fibonacci(n - 1),
            fibonacci(n - 2)
        ])
        .spread(function (lhs, rhs) {
            return Promise.resolve(lhs + rhs);
        });
    }
}


function nodeified(n, callback) { fibonacci(n).nodeify(callback); }
module.exports = nodeified;
