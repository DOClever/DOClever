var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var async = require('..').async;
var await = require('..').await;


var descendentFilePaths = async.iterable (function self(yield_, dir, recursive) {

    var files = await (fs.readdirSync(dir));
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = await (_.map(paths, function (path) { return fs.statAsync(path); }));

    _.each(stats, function(stat, i) {
        if (stat.isFile()) yield_ (paths[i]);
        else if (recursive) self(yield_, paths[i], true);
    });
});


var program = async (function(dir) {
    var paths = descendentFilePaths(dir, true);
    paths.forEach(console.log);
    return 'Finished!';
});


console.log('running...');
program(path.join(__dirname, '.'))
    .then(function (result) {
        console.log(result);
    })
    .catch(function(err) {
        console.log('----- rejected: -----');
        console.log(err);
    });
