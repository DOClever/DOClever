var Promise = require('bluebird');
var async = require('..').async;
var await = require('..').await;


// A slow asynchronous function, written in async/await style.
var longCalculation = async (function (seconds, result) {
    await(Promise.delay(seconds * 1000));
    return result;
});

// A pair of synchronous-looking compound operations, written in async/await style.
var compoundOperationA = async (function () {
    console.log('A: zero');
    console.log(await(longCalculation(1, 'A: one')));
    console.log(await(longCalculation(1, 'A: two')));
    console.log(await(longCalculation(1, 'A: three')));
    return 'A: Finished!';
});
var compoundOperationB = async (function () {
    await(longCalculation(0.5, '')); // Fall half a second behind A.
    console.log('B: zero');
    console.log(await(longCalculation(1, 'B: one')));
    console.log(await(longCalculation(1, 'B: two')));
    console.log(await(longCalculation(1, 'B: three')));
    return 'B: Finished!';
});

// Start both compound operations.
compoundOperationA().then(function (result) { console.log(result); });
compoundOperationB().then(function (result) { console.log(result); });

// Outputs (with half second delays between lines):
// A: zero
// B: zero
// A: one
// B: one
// A: two
// B: two
// A: three
// A: Finished!
// B: three
// B: Finished!
