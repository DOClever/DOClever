var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');


/** Returns the number of files in the given directory. */
var countFiles = function (dir) {
    return fs.readdirAsync(dir)

    // Get all file stats in parallel.
    .then(function (files) {
        var paths = _.map(files, function (file) { return path.join(dir, file); });
        return Promise.all(_.map(paths, function (path) { return fs.statAsync(path); }));
    })

    // Count the files.
    .then(function (stats) {
        return _.filter(stats, function (stat) { return stat.isFile(); }).length;
    });
}


function nodeified(dir, callback) { countFiles(dir).nodeify(callback); }
module.exports = nodeified;
