var async = require('../..').async;
var await = require('../..').await;


// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = async.cps (function self(n) {
    if (n <= 1) return 1;
    var operands = await.in ([self(n - 1), self(n - 2)]);
    return operands[0] + operands[1];
});


module.exports = fibonacci;
