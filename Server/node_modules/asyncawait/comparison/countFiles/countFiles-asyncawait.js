var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var async = require('../..').async;
var await = require('../..').await;


/** Returns the number of files in the given directory. */
var countFiles = async.cps (function (dir) {
    var files = await (fs.readdirSync(dir));

    // Get all file stats in parallel.
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = await (_.map(paths, function (path) { return fs.statAsync(path); }));

    // Count the files.
    return _.filter(stats, function (stat) { return stat.isFile(); }).length;
});


module.exports = countFiles;
