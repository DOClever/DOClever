var fs = require('fs');
var Promise = require('bluebird');
var _ = require('lodash');
var async = require('..').async;
var await = require('..').await;


var longCalculation = async (function (seconds, result) {
    await(Promise.delay(seconds * 1000));
    return result;
});


var program = async (function() {
    var randomDelays = _.times(10, function() { return Math.round(40 * Math.random()) / 10; });
    console.log('Operation lengths (secs): ' + JSON.stringify(randomDelays, null, 2));

    var asyncOps = _.map(randomDelays, function(delay) { return longCalculation(delay, delay); });
    var fastest = await.top(3) (asyncOps);
    console.log('Finished fastest: ' + JSON.stringify(fastest, null, 2));
});


console.log('running...');
program().catch(function (err) { console.log('ERROR: ' + err); });
