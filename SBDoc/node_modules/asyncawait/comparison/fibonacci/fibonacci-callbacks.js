

// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = function (n, callback) {
    if (n <= 1) {
        callback(null, 1);
    } else {
        var lhs, rhs;
        fibonacci(n - 1, function (err, l) {
            if (err) return callback(err);
            lhs = l;
            if (rhs) callback(null, lhs + rhs);
        });
        fibonacci(n - 2, function (err, r) {
            if (err) return callback(err);
            rhs = r;
            if (lhs) callback(null, lhs + rhs);
        });
    }
}


module.exports = fibonacci;
