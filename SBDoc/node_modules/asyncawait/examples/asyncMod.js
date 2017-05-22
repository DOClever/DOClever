var fs = require('fs');
var Promise = require('bluebird');
var async = require('..').async;
var await = require('..').await;


var ITER = async.mod({ isIterable: true, acceptsCallback: true, returnValue: 'thunk' });


var someNums = ITER (function (yield_) {
    await (Promise.delay(500));
    yield_(111);
    await (Promise.delay(500));
    yield_(222);
    await (Promise.delay(500));
    yield_(333);
    await (Promise.delay(500));
});


var program = async (function() {
    var iterator = someNums();

    var thunk = iterator.forEach(console.log, function (err) {
        console.log('Finished (callback)');
    });

    thunk(function (err) {
        console.log('Finished (thunk)');
    });
    console.log('Finished (synchronous)');
});


console.log('running...');
program().catch(function (err) { console.log('ERROR: ' + err); });
