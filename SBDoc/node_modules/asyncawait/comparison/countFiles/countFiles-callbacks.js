var fs = require('fs');
var path = require('path');
var _ = require('lodash');


/** Returns the number of files in the given directory. */
var countFiles = function (dir, callback) {

    // Get all directory entries.
    fs.readdir(dir, function (err, files) {
        if (err) { callback(err); return; }
        var paths = _.map(files, function (file) { return path.join(dir, file); });
        (function getStatsInParallel(callback) {
            var stats = [];
            var remaining = paths.length;
            if (remaining === 0) {

                // Directory is empty.
                callback(null, stats);
                return;
            } else {

                // Get all file stats in parallel.
                paths.forEach(function (path, i) {
                    fs.stat(path, function (err, stat) {
                        if (remaining === 0) return;
                        if (err) {
                            remaining = 0;
                            callback(err);
                        } else {
                            stats[i] = stat;
                            --remaining;
                            if (remaining === 0) callback(null, stats);
                        }
                    });
                });
            }
        })(function (err, stats) {

            // Count the files.
            if (err) { callback(err); return; }
            var result = _.filter(stats, function (stat) { return stat.isFile(); }).length;
            callback(null, result);
        });
    });
}


module.exports = countFiles;
