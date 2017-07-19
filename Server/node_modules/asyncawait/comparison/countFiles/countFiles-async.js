var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');


/** Returns the number of files in the given directory. */
var countFiles = function (dir, callback) {
    async.waterfall([
        function (callback) {
            fs.readdir(dir, callback);
        },

        // Get all file stats in parallel.
        function (files, callback) {
            var paths = _.map(files, function (file) { return path.join(dir, file); });
            async.parallel(_.map(paths, function (path) { return fs.stat.bind(fs, path); }), callback);
        },

        // Count the files.
        function (stats, callback) {
            var result = _.filter(stats, function (stat) { return stat.isFile(); }).length;
            callback(null, result);
        }
    ], callback);
}


module.exports = countFiles;
