var fs = require('fs');
var Promise = require('bluebird');
var async = require('..').async;
var await = require('..').await;


// A thunked version of fs.readFile.
function stat(filename) {
    return function (callback) {
        return fs.stat(filename, callback);
    };
}

// A slow asynchronous function, written in async/await style.
var longCalculation = async (function (seconds, result) {
    console.log('Starting ' + result);
    await (Promise.delay(seconds * 1000));
    return result;
});

// An async/await style function with both sequential and parallel operations.
var compoundOperation = async (function () {
    console.log('A: zero');

    var result1 = await([

        // Everything is this array will be computed in parallel.
        longCalculation(1, 'A: one'),
        1.5,
        longCalculation(1, 'A: two'),
        stat(__filename),
        {
            three: longCalculation(1, 'A: three'),
            four: longCalculation(1, 'A: four'),
            five: 'five'
        }
    ]);
    console.log(result1);

    // result2 won't start being computed until result1 above is complete.
    var result2 = await ({

        // Everything is this object will be computed in parallel.
        k1: longCalculation(1, 'B: one'),
        k2: longCalculation(1, 'B: two'),
        k3: [
            longCalculation(1, 'B: three'),
            longCalculation(1, 'B: four'),
            5,
            'six'
        ]
    });
    console.log(result2);

    // Execution will reach here after result2 is complete.
    return 'Finished!';
});

// Start the compound operation.
compoundOperation().then(function (result) { console.log(result); });
