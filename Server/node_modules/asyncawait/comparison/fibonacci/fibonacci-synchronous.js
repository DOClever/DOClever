

// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = function (n) {
    if (n <= 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
};


function nodeified(n, callback) {
    try {
        callback(null, fibonacci(n));
    }
    catch (err) {
        callback(err);
    }
}
module.exports = nodeified;
