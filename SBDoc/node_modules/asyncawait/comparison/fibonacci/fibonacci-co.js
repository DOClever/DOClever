// TODO: BUG: this co implementation does not recurse properly - cause yet to be determined


var co = require('co');


// WARNING: BAD CODE!! THIS IMPL IS HUGELY INEFFICIENT. It's purpose is purely
// to exercise recursive behaviour for testing and evaluation purposes.
var fibonacci = co(function* (n) {
    if (n <= 1) return 1;
    var operands = yield [fibonacci(n - 1), fibonacci(n - 2)];
    return operands[0] + operands[1];
});


module.exports = fibonacci;
