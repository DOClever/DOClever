var async = require('async');


// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = function (n, callback) {
    if (n <= 1) {
        callback(null, 1);
    } else {
        async.parallel([
            function (callback) {
                fibonacci(n - 1, callback);
            },
            function (callback) {
                fibonacci(n - 2, callback);
            }
        ],
        function (err, operands) {
            if (err) return callback(err);
            callback(null, operands[0] + operands[1]);
        });
    }
}


module.exports = fibonacci;
